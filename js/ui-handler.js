/**
 * Main UI Handler
 * Coördineert alle modules en toont de juiste modals
 */

class UIHandler {
    constructor() {
        this.db = db;
        this.auth = auth;
        this.currentModal = null;
        
        // DEBUG: Check of modules beschikbaar zijn
        console.log('Initializing UIHandler with modules:', {
            data: typeof DataManager,
            dog: typeof DogManager,
            editDogData: typeof DogDataManager,
            photo: typeof PhotoManager,
            breeding: typeof BreedingManager,
            private: typeof PrivateInfoManager
        });
        
        // Initialiseer modules - FIX: wacht tot ze geladen zijn
        this.modules = {
            data: typeof DataManager !== 'undefined' ? new DataManager() : null,
            dog: typeof DogManager !== 'undefined' ? new DogManager() : null,
            editDogData: typeof DogDataManager !== 'undefined' ? new DogDataManager() : null,
            photo: typeof PhotoManager !== 'undefined' ? new PhotoManager() : null,
            breeding: typeof BreedingManager !== 'undefined' ? new BreedingManager() : null,
            private: typeof PrivateInfoManager !== 'undefined' ? new PrivateInfoManager() : null
        };
        
        // Controleer of alle modules geladen zijn
        for (const [key, module] of Object.entries(this.modules)) {
            if (!module) {
                console.error(`Module ${key} is niet geladen!`);
            }
        }
        
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
        `;
        
        const style = document.createElement('style');
        style.textContent = progressCSS;
        document.head.appendChild(style);
    }
    
    // ========== MODAL MANAGEMENT ==========
    
    showModal(modalType) {
        console.log(`showModal called for: ${modalType}`);
        
        // Controleer of module bestaat
        if (!this.modules[modalType]) {
            console.error(`Module ${modalType} bestaat niet in modules:`, Object.keys(this.modules));
            this.showError(`Module '${modalType}' is niet beschikbaar.`);
            return;
        }
        
        let modalHTML = '';
        let modalId = '';
        
        try {
            switch (modalType) {
                case 'data':
                    modalHTML = this.modules.data.getModalHTML();
                    modalId = 'dataManagementModal';
                    break;
                    
                case 'addDog':
                    if (!this.auth.isAdmin()) {
                        this.showError('Alleen administrators mogen nieuwe honden toevoegen');
                        return;
                    }
                    modalHTML = this.modules.dog.getModalHTML();
                    modalId = 'addDogModal';
                    break;
                    
                case 'editDogData':
                    modalHTML = this.modules.editDogData.getModalHTML();
                    modalId = 'dogDataModal';
                    break;
                    
                case 'search':
                    modalHTML = this.modules.dog.getSearchModalHTML();
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
                    this.showError(`Modal type '${modalType}' niet herkend.`);
                    return;
            }
            
            console.log(`Modal ${modalId} geladen voor type: ${modalType}`);
            this.injectModal(modalHTML, modalId);
            this.setupModalEvents(modalType);
            
        } catch (error) {
            console.error(`Fout bij laden modal ${modalType}:`, error);
            this.showError(`Fout bij openen: ${error.message}`);
        }
    }
    
    injectModal(html, modalId) {
        console.log(`Injecting modal: ${modalId}`);
        
        // Verwijder bestaande modal
        if (this.currentModal) {
            const existingModal = document.getElementById(this.currentModal);
            if (existingModal) {
                try {
                    const modalInstance = bootstrap.Modal.getInstance(existingModal);
                    if (modalInstance) {
                        modalInstance.hide();
                        // Wacht tot modal volledig verborgen is
                        setTimeout(() => {
                            existingModal.remove();
                        }, 300);
                    } else {
                        existingModal.remove();
                    }
                } catch (e) {
                    existingModal.remove();
                }
            }
        }
        
        // Voeg nieuwe modal toe
        const container = document.getElementById('modalsContainer');
        if (!container) {
            console.error('modalsContainer niet gevonden!');
            return;
        }
        
        container.innerHTML = html;
        
        // Toon modal
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            try {
                const modal = new bootstrap.Modal(modalElement, {
                    backdrop: 'static',
                    keyboard: true
                });
                modal.show();
                
                modalElement.addEventListener('hidden.bs.modal', () => {
                    console.log(`Modal ${modalId} gesloten`);
                    this.currentModal = null;
                    // Verwijder modal van DOM na sluiten
                    setTimeout(() => {
                        if (modalElement.parentNode) {
                            modalElement.remove();
                        }
                    }, 300);
                });
                
                this.currentModal = modalId;
                console.log(`Modal ${modalId} getoond`);
                
            } catch (error) {
                console.error(`Fout bij tonen modal ${modalId}:`, error);
                this.showError(`Fout bij openen popup: ${error.message}`);
            }
        } else {
            console.error(`Modal element ${modalId} niet gevonden in HTML:`, html.substring(0, 200));
            this.showError(`Kon popup niet laden. Probeer opnieuw.`);
        }
    }
    
    setupModalEvents(modalType) {
        console.log(`Setting up events for: ${modalType}`);
        
        // Wacht tot modal volledig in DOM is
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
                        
                    case 'editDogData':
                        if (this.modules.editDogData && this.modules.editDogData.setupEvents) {
                            this.modules.editDogData.setupEvents();
                        } else {
                            // Fallback voor placeholder
                            console.log('DogDataManager gebruikt placeholder functionaliteit');
                        }
                        break;
                        
                    case 'search':
                        if (this.modules.dog && this.modules.dog.setupSearchEvents) {
                            this.modules.dog.setupSearchEvents();
                        }
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
            } catch (error) {
                console.error(`Fout bij setup events voor ${modalType}:`, error);
                this.showError(`Fout bij initialiseren: ${error.message}`);
            }
        }, 150);
    }
    
    // ========== ALGEMENE FUNCTIES ==========
    
    showProgress(message) {
        this.hideProgress();
        
        const progressHTML = `
            <div class="modal-backdrop show" style="opacity: 0.8; z-index: 9998;"></div>
            <div class="progress-modal" style="z-index: 9999;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Laden...</span>
                </div>
                <div class="mt-3">${message}</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', progressHTML);
    }
    
    hideProgress() {
        const backdrop = document.querySelector('.modal-backdrop[style*="z-index: 9998"]');
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
        // Zoek de juiste plaats voor de alert
        let target = document.querySelector('.modal-body');
        if (!target) {
            target = document.querySelector('.card-body') || document.body;
        }
        
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Sluiten"></button>
            </div>
        `;
        
        if (target) {
            target.insertAdjacentHTML('beforeend', alertHTML);
            
            // Verwijder alert na bepaalde tijd
            setTimeout(() => {
                const alert = target.querySelector(`.alert-${type}`);
                if (alert) {
                    alert.classList.remove('show');
                    setTimeout(() => alert.remove(), 150);
                }
            }, duration);
        }
    }
    
    // Helper om te controleren of UIHandler werkt
    test() {
        console.log('UIHandler test: OK', this.modules);
        return true;
    }
}