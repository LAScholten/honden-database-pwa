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
        }, 100); // Kleine delay om DOM te laten laden
    }
    
    // ========== ALGEMENE FUNCTIES ==========
    
    showProgress(message) {
        this.modules.data.showProgress(message);
    }
    
    hideProgress() {
        this.modules.data.hideProgress();
    }
    
    showSuccess(message) {
        this.modules.data.showSuccess(message);
    }
    
    showError(message) {
        this.modules.data.showError(message);
    }
    
    showInfo(message) {
        this.modules.data.showAlert(message, 'info');
    }
}