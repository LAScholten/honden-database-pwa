/**
 * Main UI Handler - Complete werkende versie
 */

class UIHandler {
    constructor() {
        console.log('UIHandler initialiseren...');
        this.currentModal = null;
        this.modules = {};
        this.initialize();
    }
    
    async initialize() {
        try {
            console.log('1. Authenticatie controleren...');
            // Gebruik isAuthenticated() - dit is belangrijk!
            if (!window.auth || !window.auth.isAuthenticated()) {
                console.warn('Niet geauthenticeerd, redirect naar login');
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
        // LAAD DE MODULES OP DEZELFDE MANIER ALS SEARCHMANAGER
        const moduleDefinitions = [
            { name: 'data', className: 'DataManager', file: 'DataManager.js' },
            { name: 'dog', className: 'DogManager', file: 'DogManager.js' },
            { name: 'photo', className: 'PhotoManager', file: 'PhotoManager.js' },
            { name: 'breeding', className: 'BreedingManager', file: 'BreedingManager.js' },
            { name: 'private', className: 'PrivateInfoManager', file: 'PrivateInfoManager.js' }
        ];
        
        for (const moduleDef of moduleDefinitions) {
            try {
                // Controleer of de klasse bestaat in window object
                if (window[moduleDef.className] && typeof window[moduleDef.className] === 'function') {
                    const ModuleClass = window[moduleDef.className];
                    const module = new ModuleClass();
                    
                    // Inject dependencies
                    if (window.db) module.db = window.db;
                    if (window.auth) module.auth = window.auth;
                    module.uiHandler = this;
                    
                    this.modules[moduleDef.name] = module;
                    console.log(`✅ Module ${moduleDef.name} geladen`);
                } else {
                    console.warn(`⚠ ${moduleDef.className} niet gevonden in window object`);
                    this.modules[moduleDef.name] = this.createFallbackModule(moduleDef.name);
                }
            } catch (error) {
                console.error(`❌ Fout bij laden ${moduleDef.name}:`, error);
                this.modules[moduleDef.name] = this.createFallbackModule(moduleDef.name);
            }
        }
    }
    
    createFallbackModule(name) {
        return {
            name: name,
            getModalHTML: () => this.getFallbackModalHTML(name),
            setupEvents: () => console.log(`Fallback events voor ${name}`),
            showError: (msg) => this.showAlert(msg, 'danger'),
            showSuccess: (msg) => this.showAlert(msg, 'success'),
            showProgress: (msg) => console.log(`Progress: ${msg}`),
            hideProgress: () => console.log('Progress verborgen')
        };
    }
    
    setupUI() {
        console.log('UI knoppen instellen...');
        
        // DEZE KNOP ID's MOETEN OVEREEENKOMEN MET app.html
        const buttonConfigs = [
            { id: 'dataManagementBtn', modal: 'data', adminOnly: true },
            { id: 'addDogBtn', modal: 'dog', adminOnly: true },
            { id: 'searchBtn', modal: 'search', adminOnly: false },
            { id: 'photoGalleryBtn', modal: 'photo', adminOnly: false },
            { id: 'breedingPlanBtn', modal: 'breeding', adminOnly: true },
            { id: 'privateInfoBtn', modal: 'private', adminOnly: true }
        ];
        
        buttonConfigs.forEach(config => {
            const button = document.getElementById(config.id);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Knop: ${config.id}, Modal: ${config.modal}`);
                    
                    // Admin check
                    if (config.adminOnly && !window.auth.isAdmin()) {
                        this.showAlert('Alleen administrators hebben toegang tot deze functie', 'warning');
                        return;
                    }
                    
                    this.showModal(config.modal);
                });
                console.log(`✅ Knop ${config.id} ingesteld`);
            } else {
                console.warn(`⚠ Knop ${config.id} niet gevonden in DOM`);
            }
        });
        
        // Logout knop
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.auth.logout();
            });
            console.log('✅ Logout knop ingesteld');
        }
        
        console.log('✅ UI setup voltooid');
    }
    
    showModal(modalType) {
        console.log(`Toon modal: ${modalType}`);
        
        // Verwijder huidige modal
        this.hideCurrentModal();
        
        // Kies de juiste modal HTML
        let modalHTML = '';
        let modalId = '';
        
        switch (modalType) {
            case 'data':
                modalHTML = this.modules.data ? this.modules.data.getModalHTML() : this.getFallbackModalHTML('data');
                modalId = 'dataManagementModal';
                break;
            case 'dog':
                modalHTML = this.modules.dog ? this.modules.dog.getModalHTML() : this.getFallbackModalHTML('dog');
                modalId = 'addDogModal';
                break;
            case 'search':
                modalHTML = this.getSearchModalHTML();
                modalId = 'searchModal';
                break;
            case 'photo':
                modalHTML = this.modules.photo ? this.modules.photo.getModalHTML() : this.getFallbackModalHTML('photo');
                modalId = 'photoGalleryModal';
                break;
            case 'breeding':
                modalHTML = this.modules.breeding ? this.modules.breeding.getModalHTML() : this.getFallbackModalHTML('breeding');
                modalId = 'breedingPlanModal';
                break;
            case 'private':
                modalHTML = this.modules.private ? this.modules.private.getModalHTML() : this.getFallbackModalHTML('private');
                modalId = 'privateInfoModal';
                break;
            default:
                modalHTML = this.getFallbackModalHTML(modalType);
                modalId = 'fallbackModal';
        }
        
        // Inject de modal
        this.injectModal(modalHTML, modalId, modalType);
    }
    
    injectModal(html, modalId, modalType) {
        const container = document.getElementById('modalsContainer');
        if (!container) {
            console.error('Modals container niet gevonden!');
            return;
        }
        
        container.innerHTML = html;
        
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                this.currentModal = null;
                console.log(`Modal ${modalId} gesloten`);
            });
            
            modal.show();
            this.currentModal = modalId;
            
            // Setup events voor deze modal
            setTimeout(() => {
                this.setupModalEvents(modalType);
            }, 100);
            
            console.log(`✅ Modal ${modalId} getoond`);
        } else {
            console.error(`❌ Modal element ${modalId} niet gevonden na injectie`);
        }
    }
    
    setupModalEvents(modalType) {
        if (modalType === 'search') {
            this.setupSearchEvents();
        } else if (this.modules[modalType] && this.modules[modalType].setupEvents) {
            try {
                this.modules[modalType].setupEvents();
                console.log(`✅ Events voor ${modalType} ingesteld`);
            } catch (error) {
                console.error(`❌ Fout bij events voor ${modalType}:`, error);
            }
        }
    }
    
    // ========== SEARCH FUNCTIONALITEIT (WERKT AL) ==========
    
    getSearchModalHTML() {
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search"></i> Hond Zoeken
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="searchInput" class="form-label">Zoek op naam:</label>
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
            searchBtn.addEventListener('click', async () => {
                const term = searchInput.value.trim();
                if (!term) {
                    this.showAlert('Voer een zoekterm in', 'warning');
                    return;
                }
                
                await this.performSearch(term);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchBtn.click();
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
            btn.addEventListener('click', (e) => {
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
    
    // ========== BASIS UI FUNCTIES ==========
    
    showProgress(message) {
        // Verwijder bestaande progress
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
        spinners.forEach(spinner => spinner.parentElement?.parentElement?.remove());
    }
    
    showAlert(message, type = 'info', duration = 5000) {
        // Verwijder bestaande alerts
        document.querySelectorAll('.ui-alert').forEach(alert => alert.remove());
        
        const html = `
            <div class="position-fixed top-0 end-0 p-3 ui-alert" style="z-index: 9999">
                <div class="toast show" role="alert">
                    <div class="toast-header bg-${type} text-white">
                        <strong class="me-auto">Melding</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
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
            const modalElement = document.getElementById(this.currentModal);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
                modalElement.remove();
            }
            this.currentModal = null;
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
                            <p>Mogelijke oorzaken:</p>
                            <ul>
                                <li>JavaScript bestand niet geladen</li>
                                <li>Module klasse niet gevonden</li>
                                <li>Syntax fout in module</li>
                            </ul>
                            <p class="mb-0">Controleer de browser console voor details.</p>
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

// Start de UIHandler wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM Geladen ===');
    
    // Controleer Bootstrap
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap niet geladen!');
        document.body.innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger">
                    <h4>Bootstrap niet geladen!</h4>
                    <p>Controleer of bootstrap.bundle.min.js correct is ingeladen.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Controleer authenticatie - gebruik isAuthenticated()
    if (!window.auth || !window.auth.isAuthenticated()) {
        console.warn('Niet ingelogd, redirect naar login');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialiseer UIHandler
    window.uiHandler = new UIHandler();
    
    // Globale helper
    window.showAlert = (msg, type) => {
        if (window.uiHandler) window.uiHandler.showAlert(msg, type);
    };
    
    console.log('=== UIHandler Gestart ===');
});