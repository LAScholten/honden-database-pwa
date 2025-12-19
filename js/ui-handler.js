/**
 * Main UI Handler - Complete werkende versie
 * Gebruikt Bootstrap 5 modals en alle modules
 */

class UIHandler {
    constructor() {
        console.log('=== UIHandler Initialisatie ===');
        this.currentModal = null;
        this.modules = {};
        this.modalHistory = [];
        this.isInitializing = false;
        this.initialize();
    }

    async initialize() {
        if (this.isInitializing) return;
        this.isInitializing = true;

        try {
            console.log('1. Controleer authenticatie...');
            if (!window.auth || !window.auth.isAuthenticated()) {
                console.warn('Niet ingelogd, redirect naar login');
                window.location.href = 'index.html';
                return;
            }

            console.log('2. Initialiseer database...');
            await this.initializeDatabase();

            console.log('3. Initialiseer modules...');
            await this.initializeModules();

            console.log('4. Setup UI...');
            this.setupUI();

            console.log('5. Toon welkomstbericht...');
            this.showWelcomeMessage();

            console.log('6. Laad initiële data...');
            await this.loadInitialData();

            console.log('✅ UIHandler succesvol geïnitialiseerd');

        } catch (error) {
            console.error('❌ Fout bij initialisatie:', error);
            this.showError(`Initialisatie mislukt: ${error.message}`);
        } finally {
            this.isInitializing = false;
        }
    }

    async initializeDatabase() {
        if (!window.db) {
            if (typeof HondenDatabase !== 'undefined') {
                window.db = new HondenDatabase();
                await window.db.init();
                console.log('✅ Database geïnitialiseerd');
            } else {
                throw new Error('Database klasse niet gevonden');
            }
        }
    }

    async initializeModules() {
        console.log('Initialiseer modules...');
        
        // Wacht op alle scripts
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Module configuratie
        const moduleConfigs = [
            { key: 'data', className: 'DataManager', required: false },
            { key: 'dog', className: 'DogManager', required: false },
            { key: 'photo', className: 'PhotoManager', required: false },
            { key: 'breeding', className: 'BreedingManager', required: false },
            { key: 'private', className: 'PrivateInfoManager', required: false },
            { key: 'search', className: 'SearchManager', required: true }
        ];

        for (const config of moduleConfigs) {
            await this.loadModule(config);
        }

        console.log('✅ Modules geïnitialiseerd:', Object.keys(this.modules));
    }

    async loadModule(config) {
        const { key, className, required } = config;
        
        try {
            console.log(`Laden module: ${className}...`);
            
            // Controleer of klasse bestaat
            if (window[className] && typeof window[className] === 'function') {
                const ModuleClass = window[className];
                const moduleInstance = new ModuleClass();
                
                // Inject dependencies
                if (window.db) moduleInstance.db = window.db;
                if (window.auth) moduleInstance.auth = window.auth;
                if (!moduleInstance.uiHandler) moduleInstance.uiHandler = this;
                
                this.modules[key] = moduleInstance;
                console.log(`✅ ${className} succesvol geladen`);
                
                // Initialiseer module data indien nodig
                if (moduleInstance.initialize && typeof moduleInstance.initialize === 'function') {
                    await moduleInstance.initialize();
                }
                
            } else if (required) {
                console.warn(`⚠ ${className} niet gevonden maar is vereist`);
                this.modules[key] = this.createBasicModule(key, className);
            } else {
                console.warn(`⚠ ${className} niet gevonden, gebruik fallback`);
                this.modules[key] = this.createFallbackModule(key, className);
            }
            
        } catch (error) {
            console.error(`❌ Fout bij laden ${className}:`, error);
            this.modules[key] = required ? 
                this.createBasicModule(key, className) : 
                this.createFallbackModule(key, className);
        }
    }

    createBasicModule(key, className) {
        return {
            name: key,
            className: className,
            getModalHTML: () => this.getBasicModalHTML(key),
            setupEvents: () => console.log(`Basic events voor ${key}`),
            showError: (msg) => this.showError(msg),
            showSuccess: (msg) => this.showSuccess(msg),
            showProgress: (msg) => this.showProgress(msg),
            hideProgress: () => this.hideProgress(),
            initialize: async () => {}
        };
    }

    createFallbackModule(key, className) {
        return {
            name: key,
            className: className,
            getModalHTML: () => this.getFallbackModalHTML(key, className),
            setupEvents: () => console.log(`Fallback events voor ${key}`),
            showError: (msg) => this.showError(msg),
            showSuccess: (msg) => this.showSuccess(msg),
            showProgress: (msg) => this.showProgress(msg),
            hideProgress: () => this.hideProgress(),
            initialize: async () => {}
        };
    }

    setupUI() {
        console.log('Setup UI knoppen...');
        
        // Knop configuratie - EXACT zoals in app.html
        const buttonConfigs = [
            { 
                id: 'dataManagementBtn', 
                modal: 'data', 
                adminOnly: true,
                icon: 'bi-database-gear',
                label: 'Data Beheer'
            },
            { 
                id: 'addDogBtn', 
                modal: 'dog', 
                adminOnly: true,
                icon: 'bi-plus-circle',
                label: 'Nieuwe Hond'
            },
            { 
                id: 'searchBtn', 
                modal: 'search', 
                adminOnly: false,
                icon: 'bi-search',
                label: 'Hond Zoeken'
            },
            { 
                id: 'photoGalleryBtn', 
                modal: 'photo', 
                adminOnly: false,
                icon: 'bi-images',
                label: 'Foto Galerij'
            },
            { 
                id: 'breedingPlanBtn', 
                modal: 'breeding', 
                adminOnly: true,
                icon: 'bi-calendar-heart',
                label: 'Fok Planning'
            },
            { 
                id: 'privateInfoBtn', 
                modal: 'private', 
                adminOnly: true,
                icon: 'bi-lock',
                label: 'Privé Informatie'
            }
        ];

        // Setup elke knop
        buttonConfigs.forEach(config => {
            this.setupButton(config);
        });

        // Logout knop
        this.setupLogoutButton();

        // Refresh stats knop
        this.setupRefreshStatsButton();

        console.log('✅ UI setup voltooid');
    }

    setupButton(config) {
        const button = document.getElementById(config.id);
        if (!button) {
            console.warn(`⚠ Knop niet gevonden: ${config.id}`);
            return;
        }

        // Verwijder bestaande event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Voeg click handler toe
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            console.log(`Knop geklikt: ${config.id} -> ${config.modal}`);
            
            // Admin check
            if (config.adminOnly && !window.auth.isAdmin()) {
                this.showWarning('Alleen administrators hebben toegang tot deze functie');
                return;
            }
            
            this.showModal(config.modal);
        });

        console.log(`✅ Knop geconfigureerd: ${config.id}`);
    }

    setupLogoutButton() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.auth.logout();
            });
            console.log('✅ Logout knop geconfigureerd');
        }
    }

    setupRefreshStatsButton() {
        const refreshBtn = document.getElementById('refreshStatsBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                await this.refreshStats();
            });
            console.log('✅ Refresh stats knop geconfigureerd');
        }
    }

    async refreshStats() {
        try {
            if (!window.db) return;
            
            const stats = await window.db.getStatistieken();
            document.getElementById('quickStatsHonden').textContent = stats.totaalHonden;
            document.getElementById('quickStatsFotos').textContent = stats.totaalFotos;
            
            this.showSuccess('Statistieken vernieuwd');
        } catch (error) {
            console.error('Fout bij vernieuwen statistieken:', error);
        }
    }

    showModal(modalType) {
        console.log(`Toon modal: ${modalType}`);
        
        // Voorkom dubbele modals
        if (this.currentModal === modalType) {
            console.log('Modal is al open');
            return;
        }
        
        // Sluit huidige modal
        this.hideCurrentModal();
        
        // Haal modal HTML op
        const modalHTML = this.getModalHTML(modalType);
        const modalId = this.getModalId(modalType);
        
        // Inject modal
        this.injectModal(modalHTML, modalId, modalType);
        
        // Update state
        this.currentModal = modalType;
        this.modalHistory.push(modalType);
        
        console.log(`✅ Modal geopend: ${modalType}`);
    }

    getModalHTML(modalType) {
        const module = this.modules[modalType];
        
        if (module && module.getModalHTML) {
            try {
                return module.getModalHTML();
            } catch (error) {
                console.error(`Fout bij ophalen modal HTML voor ${modalType}:`, error);
                return this.getBasicModalHTML(modalType);
            }
        }
        
        return this.getBasicModalHTML(modalType);
    }

    getModalId(modalType) {
        const modalIds = {
            'data': 'dataManagementModal',
            'dog': 'addDogModal',
            'photo': 'photoGalleryModal',
            'breeding': 'breedingPlanModal',
            'private': 'privateInfoModal',
            'search': 'searchModal'
        };
        
        return modalIds[modalType] || `${modalType}Modal`;
    }

    injectModal(html, modalId, modalType) {
        const container = document.getElementById('modalsContainer');
        if (!container) {
            console.error('Modals container niet gevonden');
            this.showError('Kan modal niet tonen - technische fout');
            return;
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Inject HTML
        container.innerHTML = html;
        
        // Get modal element
        const modalElement = document.getElementById(modalId);
        if (!modalElement) {
            console.error(`Modal element niet gevonden: ${modalId}`);
            return;
        }
        
        // Initialize Bootstrap modal
        const modal = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: true,
            focus: true
        });
        
        // Event handlers
        modalElement.addEventListener('shown.bs.modal', () => {
            this.onModalShown(modalType, modalElement);
        });
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            this.onModalHidden(modalType);
            container.innerHTML = '';
        });
        
        // Show modal
        modal.show();
    }

    onModalShown(modalType, modalElement) {
        console.log(`Modal getoond: ${modalType}`);
        
        // Setup events voor deze modal
        const module = this.modules[modalType];
        if (module && module.setupEvents) {
            try {
                module.setupEvents();
                console.log(`✅ Events ingesteld voor ${modalType}`);
            } catch (error) {
                console.error(`Fout bij setup events voor ${modalType}:`, error);
            }
        }
        
        // Load data indien nodig
        if (module && module.loadData) {
            setTimeout(() => {
                try {
                    module.loadData();
                } catch (error) {
                    console.error(`Fout bij laden data voor ${modalType}:`, error);
                }
            }, 100);
        }
    }

    onModalHidden(modalType) {
        console.log(`Modal gesloten: ${modalType}`);
        this.currentModal = null;
        
        // Cleanup
        const container = document.getElementById('modalsContainer');
        if (container) {
            container.innerHTML = '';
        }
    }

    hideCurrentModal() {
        if (this.currentModal) {
            const modalId = this.getModalId(this.currentModal);
            const modalElement = document.getElementById(modalId);
            
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            
            this.currentModal = null;
        }
    }

    async loadInitialData() {
        try {
            if (!window.db) return;
            
            // Laad statistieken
            const stats = await window.db.getStatistieken();
            if (stats) {
                document.getElementById('quickStatsHonden').textContent = stats.totaalHonden;
                document.getElementById('quickStatsFotos').textContent = stats.totaalFotos;
            }
            
            // Laad module data
            for (const [key, module] of Object.entries(this.modules)) {
                if (module.loadData && typeof module.loadData === 'function') {
                    try {
                        await module.loadData();
                    } catch (error) {
                        console.error(`Fout bij laden data voor ${key}:`, error);
                    }
                }
            }
            
        } catch (error) {
            console.error('Fout bij laden initiële data:', error);
        }
    }

    showWelcomeMessage() {
        const user = window.auth.getCurrentUser();
        if (user) {
            const welcomeElement = document.getElementById('welcomeMessage');
            if (welcomeElement) {
                const role = user.role === 'admin' ? 'Administrator' : 'Gebruiker';
                welcomeElement.textContent = `Welkom, ${user.username} (${role})`;
            }
            
            // Update current user display
            const currentUserElement = document.getElementById('currentUser');
            if (currentUserElement) {
                currentUserElement.textContent = `${user.username} (${role})`;
            }
        }
    }

    // ========== MODAL TEMPLATES ==========

    getBasicModalHTML(modalType) {
        const titles = {
            'data': 'Data Beheer',
            'dog': 'Nieuwe Hond',
            'photo': 'Foto Galerij',
            'breeding': 'Fok Planning',
            'private': 'Privé Informatie',
            'search': 'Hond Zoeken'
        };
        
        const title = titles[modalType] || modalType;
        const modalId = this.getModalId(modalType);
        
        return `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="${modalId}Label">
                                <i class="bi bi-gear"></i> ${title}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                Deze functionaliteit wordt momenteel geladen...
                            </div>
                            <div class="text-center py-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Laden...</span>
                                </div>
                                <p class="mt-2">Module wordt geladen...</p>
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

    getFallbackModalHTML(modalType, className) {
        const modalId = this.getModalId(modalType);
        
        return `
            <div class="modal fade" id="${modalId}" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title">Module Niet Beschikbaar</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i>
                                <strong>${className}</strong> module is niet beschikbaar.
                            </div>
                            <p>Mogelijke oorzaken:</p>
                            <ul>
                                <li>JavaScript bestand niet correct geladen</li>
                                <li>Module klasse niet gevonden in window object</li>
                                <li>Syntax fout in module bestand</li>
                            </ul>
                            <div class="mt-3">
                                <button class="btn btn-sm btn-outline-primary" onclick="location.reload()">
                                    <i class="bi bi-arrow-clockwise"></i> Pagina herladen
                                </button>
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

    // ========== UI HELPER FUNCTIES ==========

    showProgress(message) {
        this.hideProgress();
        
        const html = `
            <div class="modal-backdrop show" style="opacity: 0.5; z-index: 1040;"></div>
            <div class="position-fixed top-50 start-50 translate-middle" style="z-index: 1041;">
                <div class="card shadow-lg">
                    <div class="card-body text-center p-4">
                        <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
                        <div class="fw-bold">${message}</div>
                    </div>
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
            const card = spinner.closest('.card');
            if (card) card.remove();
        });
    }

    showSuccess(message, duration = 3000) {
        this.showNotification(message, 'success', duration);
    }

    showError(message, duration = 5000) {
        this.showNotification(message, 'danger', duration);
    }

    showWarning(message, duration = 4000) {
        this.showNotification(message, 'warning', duration);
    }

    showInfo(message, duration = 3000) {
        this.showNotification(message, 'info', duration);
    }

    showNotification(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        document.querySelectorAll('.ui-notification').forEach(el => el.remove());
        
        const html = `
            <div class="position-fixed top-0 end-0 p-3 ui-notification" style="z-index: 9999">
                <div class="toast show" role="alert">
                    <div class="toast-header bg-${type} text-white">
                        <strong class="me-auto">Melding</strong>
                        <small class="text-white">${new Date().toLocaleTimeString()}</small>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">${message}</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        
        if (duration > 0) {
            setTimeout(() => {
                document.querySelectorAll('.ui-notification').forEach(el => el.remove());
            }, duration);
        }
    }
}

// ========== GLOBAL INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM Geladen ===');
    
    // Check Bootstrap
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap niet geladen!');
        document.body.innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger">
                    <h4><i class="bi bi-exclamation-triangle"></i> Bootstrap niet geladen</h4>
                    <p>Controleer of bootstrap.bundle.min.js correct is ingeladen.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Check authentication
    if (!window.auth || !window.auth.isAuthenticated()) {
        console.warn('Niet ingelogd, redirect naar login');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize UIHandler
    try {
        window.uiHandler = new UIHandler();
        console.log('✅ UIHandler geïnitialiseerd');
    } catch (error) {
        console.error('❌ Fout bij initialiseren UIHandler:', error);
        alert('Fout bij starten applicatie: ' + error.message);
    }
    
    // Global helper functions
    window.showAlert = function(message, type = 'info', duration = 3000) {
        if (window.uiHandler && window.uiHandler.showNotification) {
            window.uiHandler.showNotification(message, type, duration);
        } else {
            alert(message);
        }
    };
    
    window.showError = function(message, duration = 5000) {
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message, duration);
        } else {
            alert('Fout: ' + message);
        }
    };
    
    window.showSuccess = function(message, duration = 3000) {
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message, duration);
        } else {
            alert(message);
        }
    };
});

// Add custom styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .ui-notification {
            animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .menu-btn {
            transition: all 0.2s ease;
        }
        
        .menu-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .modal-header {
            border-bottom: 2px solid rgba(255,255,255,0.1);
        }
        
        .modal-footer {
            border-top: 1px solid #dee2e6;
        }
        
        .toast {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);
});

// Service Worker error handling (ignore these errors)
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('ServiceWorker') || 
        e.message && e.message.includes('Cache') ||
        e.filename && e.filename.includes('sw.js')) {
        console.warn('Service Worker error (kan genegeerd worden):', e.message);
        e.preventDefault();
    }
});