/**
 * Main UI Handler - Complete werkende versie
 */

class UIHandler {
    constructor() {
        console.log('UIHandler initialiseren...');
        this.currentModal = null;
        this.modules = {};
        this.initialized = false;
        this.initialize();
    }
    
    async initialize() {
        if (this.initialized) return;
        
        try {
            console.log('1. Authenticatie controleren...');
            if (!window.auth || !window.auth.isAuthenticated()) {
                window.location.href = 'index.html';
                return;
            }
            
            console.log('2. Database initialiseren...');
            await this.initializeDatabase();
            
            console.log('3. Modules laden...');
            await this.initializeModules();
            
            console.log('4. UI instellen...');
            this.setupUI();
            
            console.log('5. Welkomstbericht tonen...');
            this.showWelcomeMessage();
            
            this.initialized = true;
            console.log('✅ UIHandler klaar');
            
        } catch (error) {
            console.error('❌ Fout bij initialisatie:', error);
            this.showAlert('Applicatie kon niet starten: ' + error.message, 'danger');
        }
    }
    
    async initializeDatabase() {
        if (!window.db) {
            if (typeof HondenDatabase !== 'undefined') {
                window.db = new HondenDatabase();
                await window.db.init();
                console.log('Database geïnitialiseerd');
            } else {
                throw new Error('Database klasse niet gevonden');
            }
        }
    }
    
    async initializeModules() {
        // Wacht even zodat alle scripts geladen zijn
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Module mapping - controleer welke klassen bestaan
        const modulesToLoad = [
            { key: 'data', className: 'DataManager' },
            { key: 'dog', className: 'DogManager' },
            { key: 'photo', className: 'PhotoManager' },
            { key: 'breeding', className: 'BreedingManager' },
            { key: 'private', className: 'PrivateInfoManager' },
            { key: 'search', className: 'SearchManager' }
        ];
        
        for (const moduleDef of modulesToLoad) {
            await this.loadModule(moduleDef.key, moduleDef.className);
        }
    }
    
    async loadModule(key, className) {
        try {
            // Wacht tot de klasse beschikbaar is in window
            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts && !window[className]) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (window[className] && typeof window[className] === 'function') {
                const ModuleClass = window[className];
                const module = new ModuleClass();
                
                // Inject dependencies
                if (window.db) module.db = window.db;
                if (window.auth) module.auth = window.auth;
                if (!module.uiHandler) module.uiHandler = this;
                
                this.modules[key] = module;
                console.log(`✅ Module ${key} (${className}) geladen`);
                
                // Special case voor search
                if (key === 'search' && module.loadSearchData) {
                    await module.loadSearchData();
                }
                
            } else {
                console.warn(`⚠ ${className} niet gevonden, gebruik fallback`);
                this.modules[key] = this.createFallbackModule(key);
            }
            
        } catch (error) {
            console.error(`❌ Fout bij laden ${key}:`, error);
            this.modules[key] = this.createFallbackModule(key);
        }
    }
    
    createFallbackModule(name) {
        return {
            name: name,
            getModalHTML: () => this.getFallbackModalHTML(name),
            setupEvents: () => {},
            showError: (msg) => this.showAlert(msg, 'danger'),
            showSuccess: (msg) => this.showAlert(msg, 'success'),
            showProgress: () => {},
            hideProgress: () => {}
        };
    }
    
    setupUI() {
        console.log('UI knoppen instellen...');
        
        // KNOP CONFIGURATIE - exact zoals in app.html
        const buttonConfigs = [
            { id: 'dataManagementBtn', modal: 'data', adminOnly: true },
            { id: 'addDogBtn', modal: 'dog', adminOnly: true },
            { id: 'searchBtn', modal: 'search', adminOnly: false },
            { id: 'photoGalleryBtn', modal: 'photo', adminOnly: false },
            { id: 'breedingPlanBtn', modal: 'breeding', adminOnly: true },
            { id: 'privateInfoBtn', modal: 'private', adminOnly: true }
        ];
        
        // Verwijder eerst alle bestaande event listeners
        buttonConfigs.forEach(config => {
            const button = document.getElementById(config.id);
            if (button) {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            }
        });
        
        // Voeg nieuwe event listeners toe
        buttonConfigs.forEach(config => {
            const button = document.getElementById(config.id);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log(`Knop: ${config.id}, Modal: ${config.modal}`);
                    
                    if (config.adminOnly && !window.auth.isAdmin()) {
                        this.showAlert('Alleen administrators hebben toegang tot deze functie', 'warning');
                        return;
                    }
                    
                    this.showModal(config.modal);
                });
                console.log(`✅ Knop ${config.id} ingesteld`);
            } else {
                console.warn(`⚠ Knop ${config.id} niet gevonden`);
            }
        });
        
        // Logout knop
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            const newLogoutBtn = logoutBtn.cloneNode(true);
            logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
            
            newLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.auth.logout();
            });
            console.log('✅ Logout knop ingesteld');
        }
        
        console.log('✅ UI setup voltooid');
    }
    
    showModal(modalType) {
        console.log(`Toon modal: ${modalType}`);
        
        // Voorkom dubbele modals
        if (this.currentModal === modalType) {
            console.log('Modal is al open');
            return;
        }
        
        // Verwijder huidige modal
        this.hideCurrentModal();
        
        // Haal modal HTML op
        let modalHTML = '';
        let modalId = '';
        
        if (modalType === 'search') {
            // Gebruik SearchManager voor zoeken
            modalHTML = this.modules.search ? this.modules.search.getModalHTML() : this.getSearchModalHTML();
            modalId = 'searchModal';
        } else {
            // Gebruik andere modules
            const module = this.modules[modalType];
            if (module && module.getModalHTML) {
                modalHTML = module.getModalHTML();
                modalId = this.getModalIdForType(modalType);
            } else {
                modalHTML = this.getFallbackModalHTML(modalType);
                modalId = `${modalType}Modal`;
            }
        }
        
        // Inject de modal
        this.injectModal(modalHTML, modalId, modalType);
    }
    
    getModalIdForType(modalType) {
        const modalIds = {
            'data': 'dataManagementModal',
            'dog': 'addDogModal',
            'photo': 'photoGalleryModal',
            'breeding': 'breedingPlanModal',
            'private': 'privateInfoModal'
        };
        return modalIds[modalType] || `${modalType}Modal`;
    }
    
    injectModal(html, modalId, modalType) {
        const container = document.getElementById('modalsContainer');
        if (!container) {
            console.error('Modals container niet gevonden!');
            return;
        }
        
        // Verwijder alle bestaande modals
        container.innerHTML = '';
        
        // Voeg nieuwe modal toe
        container.innerHTML = html;
        
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                this.currentModal = null;
                container.innerHTML = '';
                console.log(`Modal ${modalId} gesloten`);
            });
            
            modal.show();
            this.currentModal = modalType;
            
            // Setup events
            setTimeout(() => {
                this.setupModalEvents(modalType, modalElement);
            }, 100);
            
            console.log(`✅ Modal ${modalId} getoond`);
        } else {
            console.error(`❌ Modal element ${modalId} niet gevonden`);
        }
    }
    
    setupModalEvents(modalType, modalElement) {
        // Sluit knop event
        const closeBtn = modalElement.querySelector('.btn-secondary[data-bs-dismiss="modal"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideCurrentModal();
            });
        }
        
        // Specifieke module events
        const module = this.modules[modalType];
        if (module && module.setupEvents) {
            try {
                module.setupEvents();
                console.log(`✅ Events voor ${modalType} ingesteld`);
            } catch (error) {
                console.error(`❌ Fout bij events voor ${modalType}:`, error);
            }
        }
        
        // Special case voor search
        if (modalType === 'search') {
            this.setupSearchEvents();
        }
    }
    
    // SEARCH FUNCTIONALITEIT
    getSearchModalHTML() {
        return `
            <div class="modal fade" id="searchModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title"><i class="bi bi-search"></i> Hond Zoeken</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label>Zoek op naam:</label>
                                <input type="text" class="form-control" id="searchInput" placeholder="Bijv. 'Max' of 'Bella'">
                            </div>
                            <button class="btn btn-info w-100 mb-4" id="searchButton">
                                <i class="bi bi-search"></i> Zoeken
                            </button>
                            <div id="searchResults">
                                <div class="text-center text-muted py-4">
                                    <i class="bi bi-search display-6"></i>
                                    <p class="mt-2">Voer een zoekterm in</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupSearchEvents() {
        const searchBtn = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBtn && searchInput) {
            // Verwijder oude listeners
            const newSearchBtn = searchBtn.cloneNode(true);
            const newSearchInput = searchInput.cloneNode(true);
            searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            // Voeg nieuwe listeners toe
            newSearchBtn.addEventListener('click', async () => {
                const term = newSearchInput.value.trim();
                if (!term) {
                    this.showAlert('Voer een zoekterm in', 'warning');
                    return;
                }
                
                await this.performSearch(term);
            });
            
            newSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    newSearchBtn.click();
                }
            });
            
            console.log('✅ Search events ingesteld');
        }
    }
    
    async performSearch(term) {
        this.showProgress('Zoeken...');
        
        try {
            if (!window.db) {
                throw new Error('Database niet beschikbaar');
            }
            
            const allDogs = await window.db.getHonden();
            const results = allDogs.filter(dog => 
                dog.naam && dog.naam.toLowerCase().includes(term.toLowerCase())
            );
            
            this.hideProgress();
            this.displaySearchResults(results);
            
        } catch (error) {
            this.hideProgress();
            this.showAlert(`Zoeken mislukt: ${error.message}`, 'danger');
            console.error('Search error:', error);
        }
    }
    
    displaySearchResults(results) {
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    Geen honden gevonden met deze zoekterm.
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="card">
                <div class="card-header">
                    <strong>${results.length} hond(en) gevonden:</strong>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Naam</th>
                                    <th>Stamboomnr</th>
                                    <th>Ras</th>
                                    <th>Acties</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        results.forEach(dog => {
            html += `
                <tr>
                    <td>${dog.naam || '-'}</td>
                    <td><code>${dog.stamboomnr || '-'}</code></td>
                    <td>${dog.ras || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info view-dog-btn" data-id="${dog.id}">
                            <i class="bi bi-eye"></i> Bekijk
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Event listeners voor bekijk knoppen
        document.querySelectorAll('.view-dog-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                const dogId = e.target.closest('.view-dog-btn').dataset.id;
                this.viewDogDetails(dogId);
            });
        });
    }
    
    viewDogDetails(dogId) {
        if (this.modules.dog && this.modules.dog.viewDogDetails) {
            this.modules.dog.viewDogDetails(dogId);
        } else {
            this.showAlert('Detailweergave niet beschikbaar', 'warning');
        }
    }
    
    // BASIS UI FUNCTIES
    showProgress(message) {
        this.hideProgress();
        
        const html = `
            <div class="modal-backdrop show" style="opacity: 0.5; z-index: 1040;"></div>
            <div class="position-fixed top-50 start-50 translate-middle" style="z-index: 1041;">
                <div class="d-flex flex-column align-items-center">
                    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                    <div class="mt-2 text-white bg-dark p-2 rounded">${message}</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }
    
    hideProgress() {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        const spinners = document.querySelectorAll('.spinner-border');
        spinners.forEach(spinner => {
            const parent = spinner.parentElement?.parentElement;
            if (parent) parent.remove();
        });
    }
    
    showAlert(message, type = 'info', duration = 5000) {
        document.querySelectorAll('.ui-alert').forEach(alert => alert.remove());
        
        const html = `
            <div class="position-fixed top-0 end-0 p-3 ui-alert" style="z-index: 9999">
                <div class="toast show" role="alert">
                    <div class="toast-header bg-${type} text-white">
                        <strong class="me-auto">Melding</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">${message}</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        
        if (duration > 0) {
            setTimeout(() => {
                document.querySelectorAll('.ui-alert').forEach(alert => alert.remove());
            }, duration);
        }
    }
    
    hideCurrentModal() {
        if (this.currentModal) {
            const modalId = this.getModalIdForType(this.currentModal);
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
                modalElement.remove();
            }
            this.currentModal = null;
            
            // Clear modals container
            const container = document.getElementById('modalsContainer');
            if (container) container.innerHTML = '';
        }
    }
    
    showWelcomeMessage() {
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement && window.auth) {
            const user = window.auth.getCurrentUser();
            if (user) {
                const role = user.role === 'admin' ? 'Administrator' : 'Gebruiker';
                welcomeElement.textContent = `Welkom, ${user.username} (${role})`;
            }
        }
    }
    
    getFallbackModalHTML(name) {
        return `
            <div class="modal fade" id="${name}Modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title">Module Niet Beschikbaar</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i>
                                De <strong>${name}</strong> module is niet beschikbaar.
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Start de UIHandler
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM Geladen ===');
    
    if (typeof bootstrap === 'undefined') {
        document.body.innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger">
                    <h4>Bootstrap niet geladen!</h4>
                </div>
            </div>
        `;
        return;
    }
    
    if (!window.auth || !window.auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    window.uiHandler = new UIHandler();
    window.showAlert = (msg, type) => {
        if (window.uiHandler) window.uiHandler.showAlert(msg, type);
    };
    
    console.log('=== UIHandler Gestart ===');
});