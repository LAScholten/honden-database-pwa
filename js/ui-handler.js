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
            editDogData: new DogDataManager(), // Nieuwe module toegevoegd
            photo: new PhotoManager(),
            breeding: new BreedingManager(),
            private: new PrivateInfoManager()
        };
        
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
                
            case 'editDogData': // Nieuwe case toegevoegd
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
                this.showError(`Modal type '${modalType}' niet herkend. Beschikbare modules: ${Object.keys(this.modules).join(', ')}`);
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
        } else {
            console.error('Modal element niet gevonden:', modalId);
            this.showError(`Kon modal '${modalId}' niet laden. Probeer opnieuw.`);
        }
    }
    
    setupModalEvents(modalType) {
        setTimeout(() => {
            try {
                switch (modalType) {
                    case 'data':
                        this.modules.data.setupEvents();
                        this.modules.data.loadDatabaseStats();
                        break;
                        
                    case 'addDog':
                        this.modules.dog.setupEvents();
                        break;
                        
                    case 'editDogData': // Nieuwe case toegevoegd
                        if (this.modules.editDogData.setupEvents) {
                            this.modules.editDogData.setupEvents();
                        } else {
                            // Fallback voor placeholder module zonder setupEvents
                            console.log('DogDataManager gebruikt placeholder functionaliteit');
                        }
                        break;
                        
                    case 'search':
                        this.modules.dog.setupSearchEvents();
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
            } catch (error) {
                console.error(`Fout bij setup events voor ${modalType}:`, error);
                this.showError(`Fout bij laden van ${modalType}: ${error.message}`);
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
}