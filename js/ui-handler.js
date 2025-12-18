/**
 * Main UI Handler - Robuuste versie
 * Werkt zelfs als modules niet perfect geïnitialiseerd zijn
 */

class UIHandler {
    constructor() {
        console.log('=== UIHandler Initialisatie Start ===');
        this.currentModal = null;
        this.modules = {};
        this.initialize();
    }
    
    async initialize() {
        try {
            console.log('1. Controleer authenticatie...');
            if (!window.auth || !window.auth.isAuthenticated()) {
                console.warn('Niet geauthenticeerd, redirect naar login');
                window.location.href = 'index.html';
                return;
            }
            
            console.log('2. Controleer database...');
            if (!window.db) {
                console.error('Database niet beschikbaar, probeer te herinitialiseren');
                await this.initializeDatabase();
            }
            
            console.log('3. Initialiseer modules...');
            this.initializeModules();
            
            console.log('4. Setup UI...');
            this.setupUI();
            
            console.log('5. Toon welkomstbericht...');
            this.showWelcomeMessage();
            
            console.log('=== UIHandler Initialisatie Voltooid ===');
            
        } catch (error) {
            console.error('Fout bij UIHandler initialisatie:', error);
            this.showEmergencyUI();
        }
    }
    
    async initializeDatabase() {
        // Probeer database te herinitialiseren
        if (typeof HondenDatabase !== 'undefined') {
            window.db = new HondenDatabase();
            try {
                await window.db.init();
                console.log('Database herinitialisatie succesvol');
            } catch (error) {
                console.error('Database herinitialisatie mislukt:', error);
                throw new Error('Database kon niet geïnitialiseerd worden');
            }
        } else {
            throw new Error('Database klasse niet gevonden');
        }
    }
    
    initializeModules() {
        console.log('Module initialisatie start');
        
        // Probeer elke module te laden, maar faal zachtjes
        const moduleClasses = {
            data: window.DataManager,
            dog: window.DogManager,
            photo: window.PhotoManager,
            breeding: window.BreedingManager,
            private: window.PrivateInfoManager
        };
        
        this.modules = {};
        
        Object.entries(moduleClasses).forEach(([name, ModuleClass]) => {
            try {
                if (ModuleClass && typeof ModuleClass === 'function') {
                    const module = new ModuleClass();
                    
                    // Inject dependencies als ze bestaan
                    if (window.db) module.db = window.db;
                    if (window.auth) module.auth = window.auth;
                    module.uiHandler = this;
                    
                    this.modules[name] = module;
                    console.log(`✓ Module ${name} geladen`);
                } else {
                    console.warn(`⚠ Module ${name} klasse niet gevonden`);
                    this.modules[name] = this.createFallbackModule(name);
                }
            } catch (error) {
                console.error(`✗ Fout bij laden module ${name}:`, error);
                this.modules[name] = this.createFallbackModule(name);
            }
        });
        
        console.log('Module initialisatie voltooid:', Object.keys(this.modules));
    }
    
    createFallbackModule(name) {
        // Creëer een fallback module met basis functionaliteit
        return {
            name: name,
            getModalHTML: () => this.getFallbackModalHTML(name),
            setupEvents: () => console.log(`Fallback events voor ${name}`),
            showError: (msg) => this.showAlert(msg, 'danger'),
            showSuccess: (msg) => this.showAlert(msg, 'success'),
            showProgress: (msg) => this.showProgress(msg),
            hideProgress: () => this.hideProgress()
        };
    }
    
    setupUI() {
        console.log('UI setup start');
        
        // Menu knoppen - met fallback voor als ze niet bestaan
        const buttonConfigs = [
            { id: 'addDogBtn', modal: 'addDog', adminOnly: true },
            { id: 'searchDogBtn', modal: 'search', adminOnly: false },
            { id: 'photoGalleryBtn', modal: 'photos', adminOnly: false },
            { id: 'breedingPlanBtn', modal: 'breeding', adminOnly: true },
            { id: 'privateInfoBtn', modal: 'private', adminOnly: true },
            { id: 'dataManagementBtn', modal: 'data', adminOnly: true }
        ];
        
        buttonConfigs.forEach(config => {
            const button = document.getElementById(config.id);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Knop: ${config.id}, Modal: ${config.modal}`);
                    
                    if (config.adminOnly && window.auth && !window.auth.isAdmin()) {
                        this.showAlert('Alleen administrators hebben toegang tot deze functie', 'danger');
                        return;
                    }
                    
                    this.showModal(config.modal);
                });
                console.log(`✓ Knop ${config.id} ingesteld`);
            } else {
                console.warn(`⚠ Knop ${config.id} niet gevonden in DOM`);
            }
        });
        
        // Logout knop
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.auth) {
                    window.auth.logout();
                } else {
                    window.location.href = 'index.html';
                }
            });
        }
        
        // Taal switcher
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const lang = e.target.value;
                localStorage.setItem('appLanguage', lang);
                this.showAlert(`Taal gewijzigd naar ${lang}`, 'info');
                // Herlaad pagina voor taalwijziging
                setTimeout(() => location.reload(), 1000);
            });
        }
        
        console.log('UI setup voltooid');
    }
    
    showModal(modalType) {
        console.log(`Toon modal: ${modalType}`);
        
        // Verwijder eerst eventuele open modal
        this.hideCurrentModal();
        
        let modalHTML = '';
        let modalId = '';
        
        // Kies de juiste modal HTML
        switch (modalType) {
            case 'data':
                modalHTML = this.modules.data ? this.modules.data.getModalHTML() : this.getDataModalHTML();
                modalId = 'dataManagementModal';
                break;
                
            case 'addDog':
                modalHTML = this.modules.dog ? this.modules.dog.getModalHTML() : this.getAddDogModalHTML();
                modalId = 'addDogModal';
                break;
                
            case 'search':
                modalHTML = this.getSearchModalHTML(); // Eenvoudige search
                modalId = 'searchModal';
                break;
                
            case 'photos':
                modalHTML = this.modules.photo ? this.modules.photo.getModalHTML() : this.getPhotoModalHTML();
                modalId = 'photoGalleryModal';
                break;
                
            case 'breeding':
                modalHTML = this.modules.breeding ? this.modules.breeding.getModalHTML() : this.getBreedingModalHTML();
                modalId = 'breedingPlanModal';
                break;
                
            case 'private':
                modalHTML = this.modules.private ? this.modules.private.getModalHTML() : this.getPrivateModalHTML();
                modalId = 'privateInfoModal';
                break;
                
            default:
                modalHTML = this.getFallbackModalHTML(modalType);
                modalId = 'fallbackModal';
        }
        
        // Inject modal
        this.injectModal(modalHTML, modalId, modalType);
    }
    
    injectModal(html, modalId, modalType) {
        console.log(`Inject modal: ${modalId}`);
        
        const container = document.getElementById('modalsContainer');
        if (!container) {
            console.error('Modals container niet gevonden!');
            this.showAlert('Kan modal niet tonen - technische fout', 'danger');
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
            setTimeout(() => this.setupModalEvents(modalType), 100);
        } else {
            console.error(`Modal element ${modalId} niet gevonden na injectie`);
            this.showAlert('Kan modal niet openen', 'danger');
        }
    }
    
    setupModalEvents(modalType) {
        console.log(`Setup events voor: ${modalType}`);
        
        // Basis events voor alle modals
        const closeBtn = document.querySelector(`#${this.currentModal} .btn-secondary`);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideCurrentModal();
            });
        }
        
        // Specifieke events per modal type
        switch (modalType) {
            case 'search':
                this.setupSearchEvents();
                break;
                
            case 'photos':
                if (this.modules.photo && this.modules.photo.setupEvents) {
                    try {
                        this.modules.photo.setupEvents();
                        // Probeer foto's te laden
                        setTimeout(() => {
                            if (this.modules.photo.loadPhotosData) {
                                this.modules.photo.loadPhotosData();
                            }
                        }, 200);
                    } catch (error) {
                        console.error('Fout bij photo events:', error);
                    }
                }
                break;
                
            default:
                // Probeer module events
                if (this.modules[modalType] && this.modules[modalType].setupEvents) {
                    try {
                        this.modules[modalType].setupEvents();
                    } catch (error) {
                        console.error(`Fout bij ${modalType} events:`, error);
                    }
                }
        }
    }
    
    // ========== MODAL TEMPLATES ==========
    
    getSearchModalHTML() {
        return `
            <div class="modal fade" id="searchModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-search"></i> Hond Zoeken
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                Typ de naam van een hond om te zoeken. Resultaten verschijnen hieronder.
                            </div>
                            
                            <div class="mb-3">
                                <label>Zoek op naam:</label>
                                <input type="text" class="form-control" id="searchInput" 
                                       placeholder="Bijv. 'Max' of 'Bella'">
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
                    this.showAlert('Voer een zoekterm in', 'warning', 3000);
                    return;
                }
                
                await this.performSearch(term);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchBtn.click();
                }
            });
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
                            <i class="bi bi-eye"></i>
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
        
        // Add event listeners
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
    
    // ========== BASIC UI FUNCTIONS ==========
    
    showProgress(message) {
        this.hideProgress();
        
        const html = `
            <div class="modal-backdrop show" style="opacity: 0.8;"></div>
            <div class="progress-modal">
                <div class="spinner-border text-primary"></div>
                <div class="mt-2">${message}</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }
    
    hideProgress() {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        
        const progress = document.querySelector('.progress-modal');
        if (progress) progress.remove();
    }
    
    showAlert(message, type = 'info', duration = 5000) {
        // Remove existing alerts
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
    
    showEmergencyUI() {
        const appContent = document.getElementById('appContent');
        if (appContent) {
            appContent.innerHTML = `
                <div class="alert alert-danger">
                    <h4><i class="bi bi-exclamation-triangle"></i> Kritieke Fout</h4>
                    <p>De applicatie kon niet correct starten. Mogelijke oorzaken:</p>
                    <ul>
                        <li>JavaScript bestanden niet geladen</li>
                        <li>Browser incompatibiliteit</li>
                        <li>Database problemen</li>
                    </ul>
                    <div class="mt-3">
                        <button class="btn btn-danger me-2" onclick="location.reload()">
                            <i class="bi bi-arrow-clockwise"></i> Herladen
                        </button>
                        <button class="btn btn-outline-danger" onclick="window.auth.logout()">
                            <i class="bi bi-box-arrow-right"></i> Uitloggen
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    getFallbackModalHTML(moduleName) {
        return `
            <div class="modal fade" id="fallbackModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title">Module Niet Beschikbaar</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i>
                                De <strong>${moduleName}</strong> module is niet beschikbaar.
                            </div>
                            <p>Dit kan komen door:</p>
                            <ul>
                                <li>JavaScript fout in de module</li>
                                <li>Bestand niet correct geladen</li>
                                <li>Browser compatibiliteit probleem</li>
                            </ul>
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

// Laad UIHandler wanneer DOM klaar is
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM Geladen - Start UIHandler ===');
    
    // Controleer of Bootstrap beschikbaar is
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
    
    // Controleer of gebruiker ingelogd is
    if (!window.auth || !window.auth.isAuthenticated()) {
        console.warn('Niet ingelogd, redirect naar login');
        window.location.href = 'index.html';
        return;
    }
    
    // Start UIHandler
    window.uiHandler = new UIHandler();
    
    // Global helper functies
    window.showAlert = (msg, type) => {
        if (window.uiHandler) window.uiHandler.showAlert(msg, type);
    };
    
    console.log('=== UIHandler Gestart ===');
});

// Add emergency styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .progress-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            z-index: 9999;
            text-align: center;
        }
        
        .progress-modal .spinner-border {
            width: 3rem;
            height: 3rem;
        }
        
        .ui-alert {
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        
        .menu-btn {
            transition: all 0.3s ease;
        }
        
        .menu-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
});