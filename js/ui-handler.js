/**
 * Main UI Handler
 * Coördineert alle modules en toont de juiste modals
 */

class UIHandler {
    constructor() {
        this.db = db;
        this.auth = auth;
        this.currentModal = null;
        
        // Initialiseer modules
        this.modules = {
            data: new DataManager(),
            dog: new DogManager(),
            search: new SearchManager(),  // NIEUW: SearchManager toegevoegd
            photo: new PhotoManager(),
            breeding: new BreedingManager(),
            private: new PrivateInfoManager()
        };
        
        // Maak modules beschikbaar voor andere modules indien nodig
        this.dogManager = this.modules.dog;
        
        // Voeg CSS toe voor styling
        this.addStyles();
    }
    
    addStyles() {
        const progressCSS = `
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
            
            .bg-purple {
                background-color: #6f42c1 !important;
            }
            
            .btn-purple {
                background-color: #6f42c1;
                border-color: #6f42c1;
                color: white;
            }
            
            .btn-purple:hover {
                background-color: #5a32a3;
                border-color: #5a32a3;
                color: white;
            }
            
            .photo-thumbnail img {
                transition: transform 0.3s ease;
            }
            
            .photo-thumbnail img:hover {
                transform: scale(1.05);
            }
            
            /* Dropdown zoekveld styling */
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
            
            /* Parent zoekveld styling */
            .parent-search-field {
                position: relative;
            }
            
            .parent-search-field .dropdown-menu {
                max-height: 300px;
                overflow-y: auto;
                width: 100%;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = progressCSS;
        document.head.appendChild(style);
    }
    
    // ========== MODAL MANAGEMENT ==========
    
    showModal(modalType) {
        let modalHTML = '';
        let modalId = '';
        
        switch (modalType) {
            case 'data':
                modalHTML = this.modules.data.getModalHTML();
                modalId = 'dataManagementModal';
                break;
                
            case 'addDog':
                if (!this.auth.isAdmin()) {
                    this.modules.dog.showError('Alleen administrators mogen nieuwe honden toevoegen');
                    return;
                }
                modalHTML = this.modules.dog.getModalHTML();
                modalId = 'addDogModal';
                break;
                
            case 'search':
                modalHTML = this.modules.search.getModalHTML();  // NIEUW: SearchManager gebruikt
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
    
    injectModal(html, modalId) {
        // Verwijder bestaande modal
        if (this.currentModal) {
            const existingModal = document.getElementById(this.currentModal);
            if (existingModal) {
                const modalInstance = bootstrap.Modal.getInstance(existingModal);
                if (modalInstance) modalInstance.hide();
                existingModal.remove();
            }
        }
        
        // Voeg nieuwe modal toe
        const container = document.getElementById('modalsContainer');
        container.innerHTML = html;
        
        // Toon modal
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                this.currentModal = null;
            });
            
            this.currentModal = modalId;
        }
    }
    
    setupModalEvents(modalType) {
        setTimeout(() => {
            switch (modalType) {
                case 'data':
                    this.modules.data.setupEvents();
                    this.modules.data.loadDatabaseStats();
                    break;
                    
                case 'addDog':
                    this.modules.dog.setupEvents();
                    break;
                    
                case 'search':
                    this.modules.search.setupEvents();  // NIEUW: SearchManager events
                    break;
                    
                case 'photos':
                    this.modules.photo.setupEvents();
                    this.modules.photo.loadPhotosData();
                    break;
                    
                case 'breeding':
                    this.modules.breeding.setupEvents();
                    this.modules.breeding.loadBreedingData();
                    break;
                    
                case 'private':
                    this.modules.private.setupEvents();
                    this.modules.private.loadPrivateInfoData();
                    break;
            }
        }, 100); // Kleine delay om DOM te laten laden
    }
    
    // ========== ALGEMENE FUNCTIES ==========
    
    showProgress(message) {
        // Directe implementatie zonder module dependency
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
    
    showSuccess(message) {
        this.showAlert(message, 'success');
    }
    
    showError(message) {
        this.showAlert(message, 'danger');
    }
    
    showInfo(message) {
        this.showAlert(message, 'info');
    }
    
    showAlert(message, type, duration = 5000) {
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
        }
    }
    
    // ========== MODULE COMMUNICATIE ==========
    
    /**
     * Roep een functie aan op een specifieke module
     * @param {string} moduleName - Naam van de module ('dog', 'search', 'photo', etc.)
     * @param {string} functionName - Naam van de functie om aan te roepen
     * @param {...any} args - Argumenten voor de functie
     */
    callModuleFunction(moduleName, functionName, ...args) {
        if (this.modules[moduleName] && typeof this.modules[moduleName][functionName] === 'function') {
            return this.modules[moduleName][functionName](...args);
        } else {
            console.error(`Functie ${functionName} bestaat niet in module ${moduleName}`);
            return null;
        }
    }
    
    /**
     * Toon hond details vanuit een andere module (bijv. SearchManager)
     * @param {number} hondId - ID van de hond
     */
    showDogDetails(hondId) {
        if (this.modules.dog && typeof this.modules.dog.viewDogDetails === 'function') {
            this.modules.dog.viewDogDetails(hondId);
        }
    }
    
    /**
     * Bewerk een hond vanuit een andere module
     * @param {number} hondId - ID van de hond
     */
    editDog(hondId) {
        if (this.modules.dog && typeof this.modules.dog.editDog === 'function') {
            this.modules.dog.editDog(hondId);
        }
    }
    
    /**
     * Update taal voor alle modules
     * @param {string} lang - Taalcode ('nl', 'en', 'de')
     */
    updateLanguageForAllModules(lang) {
        // Update taal in localStorage
        localStorage.setItem('appLanguage', lang);
        
        // Update taal in alle modules
        Object.values(this.modules).forEach(module => {
            if (module.updateLanguage) {
                module.updateLanguage(lang);
            }
        });
        
        // Herlaad huidige modal als die open is
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
    }
    
    /**
     * Bepaal modal type op basis van modal ID
     * @param {string} modalId - ID van de modal
     * @returns {string|null} Modal type of null
     */
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
}

// Maak UIHandler beschikbaar voor andere modules
const uiHandler = new UIHandler();

// Maak ook de dogManager beschikbaar via window voor SearchManager
window.uiHandler = uiHandler;
window.dogManager = uiHandler.modules.dog;