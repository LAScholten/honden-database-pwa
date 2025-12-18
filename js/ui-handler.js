/**
 * Main UI Handler
 * Coördineert alle modules en toont de juiste modals
 */

class UIHandler {
    constructor() {
        console.log('UIHandler initialiseren...');
        
        // Wacht tot DOM geladen is
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    async initialize() {
        console.log('UIHandler initialisatie gestart');
        
        try {
            // Controleer of auth beschikbaar is
            if (!window.auth) {
                console.error('Auth module niet gevonden!');
                this.showLoginError();
                return;
            }
            
            // Controleer of gebruiker ingelogd is
            if (!window.auth.isAuthenticated()) {
                console.log('Gebruiker niet geauthenticeerd, terug naar login');
                window.location.href = 'index.html';
                return;
            }
            
            // Controleer of database beschikbaar is
            if (!window.db) {
                console.error('Database niet gevonden!');
                this.showDatabaseError();
                return;
            }
            
            // Wacht op database initialisatie
            if (!window.db.isInitialized) {
                console.log('Wachten op database initialisatie...');
                await window.db.init();
            }
            
            this.db = window.db;
            this.auth = window.auth;
            
            console.log('UIHandler status:', {
                isAuthenticated: this.auth.isAuthenticated(),
                isAdmin: this.auth.isAdmin(),
                currentUser: this.auth.getCurrentUser(),
                databaseReady: this.db.isInitialized
            });
            
            this.currentModal = null;
            
            // Initialiseer modules
            this.initializeModules();
            
            // Voeg CSS toe voor styling
            this.addStyles();
            
            // Setup event listeners voor dashboard knoppen
            this.setupDashboardEvents();
            
            // Toon welkomstbericht
            this.showWelcomeMessage();
            
            console.log('UIHandler succesvol geïnitialiseerd');
            
        } catch (error) {
            console.error('Fout bij initialiseren UIHandler:', error);
            this.showInitializationError();
        }
    }
    
    initializeModules() {
        console.log('Modules initialiseren...');
        
        this.modules = {
            data: new DataManager(),
            dog: new DogManager(),
            photo: new PhotoManager(),
            breeding: new BreedingManager(),
            private: new PrivateInfoManager()
        };
        
        // Injecteer dependencies in modules
        Object.values(this.modules).forEach(module => {
            if (module) {
                module.db = this.db;
                module.auth = this.auth;
                module.uiHandler = this;
            }
        });
        
        // Maak dogManager beschikbaar
        this.dogManager = this.modules.dog;
        
        console.log('Modules geïnitialiseerd:', Object.keys(this.modules));
    }
    
    setupDashboardEvents() {
        console.log('Dashboard events instellen...');
        
        // Menu knoppen
        const menuButtons = {
            'addDogBtn': 'addDog',
            'searchDogBtn': 'search',
            'photoGalleryBtn': 'photos',
            'breedingPlanBtn': 'breeding',
            'privateInfoBtn': 'private',
            'dataManagementBtn': 'data'
        };
        
        Object.entries(menuButtons).forEach(([btnId, modalType]) => {
            const button = document.getElementById(btnId);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Knop geklikt: ${btnId}, modal type: ${modalType}`);
                    this.showModal(modalType);
                });
            } else {
                console.warn(`Knop niet gevonden: ${btnId}`);
            }
        });
        
        // Logout knop
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.auth.logout();
                window.location.href = 'index.html';
            });
        }
        
        // Taal switcher
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const lang = e.target.value;
                this.updateLanguageForAllModules(lang);
            });
        }
        
        console.log('Dashboard events ingesteld');
    }
    
    showWelcomeMessage() {
        const user = this.auth.getCurrentUser();
        if (user) {
            const welcomeMsg = document.getElementById('welcomeMessage');
            if (welcomeMsg) {
                const roleText = this.auth.isAdmin() ? 'Administrator' : 'Gebruiker';
                const lang = localStorage.getItem('appLanguage') || 'nl';
                
                const messages = {
                    nl: `Welkom, ${user.username}! (${roleText})`,
                    en: `Welcome, ${user.username}! (${roleText})`,
                    de: `Willkommen, ${user.username}! (${roleText})`
                };
                
                welcomeMsg.textContent = messages[lang] || messages.nl;
            }
        }
    }
    
    // ========== MODAL MANAGEMENT ==========
    
    showModal(modalType) {
        console.log(`Modal tonen: ${modalType}`);
        
        // Controleer admin rechten voor bepaalde modals
        if (['addDog', 'breeding', 'private', 'data'].includes(modalType) && !this.auth.isAdmin()) {
            this.showAlert('Alleen administrators hebben toegang tot deze functie', 'danger');
            return;
        }
        
        let modalHTML = '';
        let modalId = '';
        
        switch (modalType) {
            case 'data':
                modalHTML = this.modules.data.getModalHTML();
                modalId = 'dataManagementModal';
                break;
                
            case 'addDog':
                modalHTML = this.modules.dog.getModalHTML();
                modalId = 'addDogModal';
                break;
                
            case 'search':
                // Simpel zoekscherm (tijdelijk tot SearchManager klaar is)
                modalHTML = this.getSimpleSearchModalHTML();
                modalId = 'searchModal';
                break;
                
            case 'photos':
                modalHTML = this.modules.photo.getModalHTML();
                modalId = 'photoGalleryModal';
                break;
                
            case 'breeding':
                modalHTML = this.modules.breeding.getModalHTML();
                modalId = 'breedingPlanModal';
                break;
                
            case 'private':
                modalHTML = this.modules.private.getModalHTML();
                modalId = 'privateInfoModal';
                break;
                
            default:
                console.error('Onbekend modal type:', modalType);
                return;
        }
        
        this.injectModal(modalHTML, modalId);
        this.setupModalEvents(modalType);
    }
    
    getSimpleSearchModalHTML() {
        const currentLang = localStorage.getItem('appLanguage') || 'nl';
        const translations = {
            nl: {
                title: "Hond Zoeken",
                placeholder: "Typ hond naam...",
                search: "Zoeken",
                close: "Sluiten",
                info: "Typ de naam van een hond om te zoeken. Alle honden met deze naam worden getoond."
            },
            en: {
                title: "Search Dog",
                placeholder: "Type dog name...",
                search: "Search",
                close: "Close",
                info: "Type a dog's name to search. All dogs with this name will be shown."
            },
            de: {
                title: "Hund suchen",
                placeholder: "Hundenamen eingeben...",
                search: "Suchen",
                close: "Schließen",
                info: "Geben Sie einen Hundenamen ein, um zu suchen. Alle Hunde mit diesem Namen werden angezeigt."
            }
        };
        
        const t = translations[currentLang] || translations.nl;
        
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search"></i> ${t.title}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-4">
                                <i class="bi bi-info-circle"></i>
                                ${t.info}
                            </div>
                            
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label for="simpleSearchInput" class="form-label">${t.title}</label>
                                        <input type="text" class="form-control" id="simpleSearchInput" 
                                               placeholder="${t.placeholder}">
                                    </div>
                                    <button class="btn btn-info w-100" id="simpleSearchBtn">
                                        <i class="bi bi-search"></i> ${t.search}
                                    </button>
                                </div>
                            </div>
                            
                            <div id="simpleSearchResults">
                                <div class="text-center py-5">
                                    <i class="bi bi-search display-1 text-muted"></i>
                                    <p class="mt-3 text-muted">${t.placeholder}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t.close}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    injectModal(html, modalId) {
        console.log(`Modal injecteren: ${modalId}`);
        
        // Verwijder bestaande modal
        if (this.currentModal) {
            const existingModal = document.getElementById(this.currentModal);
            if (existingModal) {
                try {
                    const modalInstance = bootstrap.Modal.getInstance(existingModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                } catch (e) {
                    console.warn('Fout bij sluiten modal:', e);
                }
                existingModal.remove();
            }
        }
        
        // Voeg nieuwe modal toe
        const container = document.getElementById('modalsContainer');
        if (!container) {
            console.error('Modals container niet gevonden!');
            return;
        }
        
        container.innerHTML = html;
        
        // Toon modal
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                this.currentModal = null;
                console.log(`Modal ${modalId} gesloten`);
            });
            
            this.currentModal = modalId;
            console.log(`Modal ${modalId} getoond`);
        } else {
            console.error(`Modal element ${modalId} niet gevonden na injectie`);
        }
    }
    
    setupModalEvents(modalType) {
        console.log(`Events instellen voor modal: ${modalType}`);
        
        setTimeout(() => {
            try {
                switch (modalType) {
                    case 'data':
                        if (this.modules.data && this.modules.data.setupEvents) {
                            this.modules.data.setupEvents();
                            this.modules.data.loadDatabaseStats();
                        }
                        break;
                        
                    case 'addDog':
                        if (this.modules.dog && this.modules.dog.setupEvents) {
                            this.modules.dog.setupEvents();
                        }
                        break;
                        
                    case 'search':
                        // Voor eenvoudig zoeken
                        this.setupSimpleSearchEvents();
                        break;
                        
                    case 'photos':
                        if (this.modules.photo && this.modules.photo.setupEvents) {
                            this.modules.photo.setupEvents();
                            this.modules.photo.loadPhotosData();
                        }
                        break;
                        
                    case 'breeding':
                        if (this.modules.breeding && this.modules.breeding.setupEvents) {
                            this.modules.breeding.setupEvents();
                            this.modules.breeding.loadBreedingData();
                        }
                        break;
                        
                    case 'private':
                        if (this.modules.private && this.modules.private.setupEvents) {
                            this.modules.private.setupEvents();
                            this.modules.private.loadPrivateInfoData();
                        }
                        break;
                }
                console.log(`Events ingesteld voor ${modalType}`);
            } catch (error) {
                console.error(`Fout bij instellen events voor ${modalType}:`, error);
            }
        }, 300);
    }
    
    setupSimpleSearchEvents() {
        const searchBtn = document.getElementById('simpleSearchBtn');
        const searchInput = document.getElementById('simpleSearchInput');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', async () => {
                const searchTerm = searchInput.value.trim();
                if (!searchTerm) {
                    this.showAlert('Voer een zoekterm in', 'warning');
                    return;
                }
                
                await this.performSimpleSearch(searchTerm);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchBtn.click();
                }
            });
        }
    }
    
    async performSimpleSearch(searchTerm) {
        this.showProgress('Zoeken...');
        
        try {
            if (!this.db || !this.db.getHonden) {
                throw new Error('Database niet beschikbaar');
            }
            
            const honden = await this.db.getHonden();
            const results = honden.filter(hond => 
                hond.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (hond.stamboomnr && hond.stamboomnr.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            
            this.hideProgress();
            this.displaySimpleSearchResults(results);
            
        } catch (error) {
            this.hideProgress();
            this.showAlert(`Zoeken mislukt: ${error.message}`, 'danger');
            console.error('Search error:', error);
        }
    }
    
    displaySimpleSearchResults(results) {
        const container = document.getElementById('simpleSearchResults');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="mt-3 text-muted">Geen honden gevonden</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">Zoekresultaten (${results.length})</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Naam</th>
                                    <th>Stamboomnummer</th>
                                    <th>Ras</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        results.forEach(hond => {
            html += `
                <tr>
                    <td><strong>${hond.naam}</strong></td>
                    <td><code>${hond.stamboomnr || '-'}</code></td>
                    <td>${hond.ras || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-dog-simple-btn" data-id="${hond.id}">
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
        
        // Event listeners voor view knoppen
        document.querySelectorAll('.view-dog-simple-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.view-dog-simple-btn').dataset.id;
                this.showDogDetails(hondId);
            });
        });
    }
    
    // ========== ALGEMENE FUNCTIES ==========
    
    showProgress(message) {
        this.hideProgress();
        
        const progressHTML = `
            <div class="modal-backdrop show" style="opacity: 0.8;"></div>
            <div class="progress-modal">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Laden...</span>
                </div>
                <div class="mt-3">${message}</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', progressHTML);
    }
    
    hideProgress() {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        
        const progressModal = document.querySelector('.progress-modal');
        if (progressModal) progressModal.remove();
    }
    
    showAlert(message, type, duration = 5000) {
        // Verwijder bestaande alerts
        const existingAlerts = document.querySelectorAll('.alert-dismissible');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Sluiten"></button>
            </div>
        `;
        
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            modalBody.insertAdjacentHTML('afterbegin', alertHTML);
            
            setTimeout(() => {
                const alert = modalBody.querySelector('.alert');
                if (alert) {
                    alert.classList.remove('show');
                    setTimeout(() => alert.remove(), 150);
                }
            }, duration);
        } else {
            // Fallback naar toast notificatie
            this.showToast(message, type);
        }
    }
    
    showToast(message, type) {
        const toastHTML = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
                <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Sluiten"></button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.querySelector('.toast');
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
    
    // ========== HELPER FUNCTIES ==========
    
    showDogDetails(hondId) {
        if (this.modules.dog && typeof this.modules.dog.viewDogDetails === 'function') {
            this.modules.dog.viewDogDetails(hondId);
        } else {
            console.error('DogManager.viewDogDetails functie niet beschikbaar');
            this.showAlert('Kan hond details niet tonen', 'danger');
        }
    }
    
    updateLanguageForAllModules(lang) {
        localStorage.setItem('appLanguage', lang);
        
        // Update taal in alle modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.updateLanguage === 'function') {
                module.updateLanguage(lang);
            }
        });
        
        // Herlaad huidige modal
        if (this.currentModal) {
            const modalElement = document.getElementById(this.currentModal);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                    setTimeout(() => {
                        const modalType = this.getModalTypeById(this.currentModal);
                        if (modalType) {
                            this.showModal(modalType);
                        }
                    }, 300);
                }
            }
        }
        
        // Update welkomstbericht
        this.showWelcomeMessage();
    }
    
    getModalTypeById(modalId) {
        switch (modalId) {
            case 'dataManagementModal': return 'data';
            case 'addDogModal': return 'addDog';
            case 'editDogModal': return 'addDog';
            case 'searchModal': return 'search';
            case 'photoGalleryModal': return 'photos';
            case 'breedingPlanModal': return 'breeding';
            case 'privateInfoModal': return 'private';
            default: return null;
        }
    }
    
    addStyles() {
        const styles = `
            .progress-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 0 30px rgba(0,0,0,0.3);
                z-index: 9999;
                text-align: center;
                min-width: 200px;
            }
            
            .progress-modal .spinner-border {
                width: 3rem;
                height: 3rem;
            }
            
            .dashboard-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .dashboard-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            }
            
            .menu-btn {
                width: 100%;
                margin-bottom: 10px;
                text-align: left;
                padding: 15px;
            }
            
            .menu-btn i {
                margin-right: 10px;
            }
            
            .user-role-badge {
                font-size: 0.8rem;
                padding: 2px 8px;
                margin-left: 10px;
            }
            
            .search-dropdown {
                position: relative;
            }
            
            .search-dropdown .dropdown-menu {
                max-height: 300px;
                overflow-y: auto;
                width: 100%;
            }
            
            .search-dropdown .dropdown-item {
                cursor: pointer;
            }
            
            .search-dropdown .dropdown-item:hover {
                background-color: #f8f9fa;
            }
            
            .search-dropdown .dropdown-item:active {
                background-color: #0d6efd;
                color: white;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
    }
    
    showLoginError() {
        const appContent = document.getElementById('appContent');
        if (appContent) {
            appContent.innerHTML = `
                <div class="alert alert-danger">
                    <h4 class="alert-heading">Authenticatie fout</h4>
                    <p>Er is een probleem met de authenticatie module. Controleer of:</p>
                    <ul>
                        <li>De auth.js correct is geladen</li>
                        <li>Je correct bent ingelogd</li>
                        <li>Er geen JavaScript errors zijn in de console</li>
                    </ul>
                    <hr>
                    <a href="index.html" class="btn btn-danger">Terug naar login</a>
                </div>
            `;
        }
    }
    
    showDatabaseError() {
        const appContent = document.getElementById('appContent');
        if (appContent) {
            appContent.innerHTML = `
                <div class="alert alert-danger">
                    <h4 class="alert-heading">Database fout</h4>
                    <p>Er is een probleem met de database module. Controleer of:</p>
                    <ul>
                        <li>De database.js correct is geladen</li>
                        <li>Er voldoende browser storage beschikbaar is</li>
                        <li>Er geen JavaScript errors zijn in de console</li>
                    </ul>
                    <hr>
                    <button onclick="window.location.reload()" class="btn btn-danger">Pagina vernieuwen</button>
                </div>
            `;
        }
    }
    
    showInitializationError() {
        const appContent = document.getElementById('appContent');
        if (appContent) {
            appContent.innerHTML = `
                <div class="alert alert-warning">
                    <h4 class="alert-heading">Initialisatie fout</h4>
                    <p>Er is een probleem met het laden van de applicatie. Probeer de pagina te vernieuwen.</p>
                    <hr>
                    <button onclick="window.location.reload()" class="btn btn-warning">Pagina vernieuwen</button>
                </div>
            `;
        }
    }
}

// Initialiseer UIHandler wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM geladen, UIHandler initialiseren...');
    
    // Maak globale UIHandler beschikbaar
    window.uiHandler = new UIHandler();
});