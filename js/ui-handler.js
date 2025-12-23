/**
 * Main UI Handler
 * Coördineert alle modules en toont de juiste modals
 */

class UIHandler {
    constructor() {
        this.db = db;
        this.auth = auth;
        this.currentModal = null;
        
        // Debug logging
        console.log('UIHandler constructor aangeroepen');
        console.log('Beschikbare modules:', {
            DataManager: typeof DataManager,
            DogManager: typeof DogManager,
            DogDataManager: typeof DogDataManager,
            SearchManager: typeof SearchManager,
            PhotoManager: typeof PhotoManager,
            BreedingManager: typeof BreedingManager,
            PrivateInfoManager: typeof PrivateInfoManager,
            LitterManager: typeof LitterManager // Controleer of deze bestaat
        });
        
        try {
            // Initialiseer modules - maak LitterManager optioneel
            this.modules = {
                data: new DataManager(),
                dog: new DogManager(),
                editDogData: new DogDataManager(),
                search: new SearchManager(),
                photo: new PhotoManager(),
                breeding: new BreedingManager(),
                private: new PrivateInfoManager()
            };
            
            // Probeer LitterManager te initialiseren als deze beschikbaar is
            if (typeof LitterManager !== 'undefined') {
                this.modules.litter = new LitterManager();
                console.log('LitterManager succesvol geïnitialiseerd');
            } else {
                console.warn('LitterManager module niet gevonden - wordt overgeslagen');
                this.modules.litter = null;
            }
            
            // Maak dogManager beschikbaar voor SearchManager
            window.dogManager = this.modules.dog;
            
            console.log('Modules geïnitialiseerd:', Object.keys(this.modules).map(key => ({
                name: key,
                available: this.modules[key] !== null
            })));
            
        } catch (error) {
            console.error('Fout bij initialiseren modules:', error);
            // Probeer op zijn minst de essentiële modules te behouden
            this.modules = {
                data: null,
                dog: null,
                editDogData: null,
                search: null,
                photo: null,
                breeding: null,
                private: null,
                litter: null
            };
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
        console.log(`showModal aangeroepen voor type: ${modalType}`);
        
        let modalHTML = '';
        let modalId = '';
        
        try {
            switch (modalType) {
                case 'data':
                    if (!this.modules.data) throw new Error('DataManager module niet beschikbaar');
                    modalHTML = this.modules.data.getModalHTML();
                    modalId = 'dataManagementModal';
                    break;
                    
                case 'addDog':
                    if (!this.modules.dog) throw new Error('DogManager module niet beschikbaar');
                    // TOEGANGSCONTROLE IS VERWIJDERD - zit nu in DogManager.getModalHTML()
                    modalHTML = this.modules.dog.getModalHTML();
                    modalId = 'addDogModal';
                    break;
                    
                case 'editDogData':
                    if (!this.modules.editDogData) throw new Error('DogDataManager module niet beschikbaar');
                    modalHTML = this.modules.editDogData.getModalHTML();
                    modalId = 'dogDataModal';
                    break;
                    
                case 'search':
                    if (!this.modules.search) throw new Error('SearchManager module niet beschikbaar');
                    modalHTML = this.modules.search.getModalHTML();
                    modalId = 'searchModal';
                    break;
                    
                case 'photos':
                    if (!this.modules.photo) throw new Error('PhotoManager module niet beschikbaar');
                    modalHTML = this.modules.photo.getModalHTML();
                    modalId = 'photoGalleryModal';
                    break;
                    
                case 'breeding':
                    if (!this.modules.breeding) throw new Error('BreedingManager module niet beschikbaar');
                    modalHTML = this.modules.breeding.getModalHTML();
                    modalId = 'breedingPlanModal';
                    break;
                    
                case 'private':
                    if (!this.modules.private) throw new Error('PrivateInfoManager module niet beschikbaar');
                    modalHTML = this.modules.private.getModalHTML();
                    modalId = 'privateInfoModal';
                    break;
                    
                // Optionele case voor litter (voor toekomstig gebruik)
                case 'litter':
                    if (!this.modules.litter) throw new Error('LitterManager module niet beschikbaar');
                    modalHTML = this.getLitterModalHTML();
                    modalId = 'litterModal';
                    break;
                    
                default:
                    throw new Error(`Onbekend modal type: ${modalType}`);
            }
            
            console.log(`Modal ${modalId} geladen voor type: ${modalType}`);
            this.injectModal(modalHTML, modalId);
            this.setupModalEvents(modalType);
            
        } catch (error) {
            console.error(`Fout bij laden modal ${modalType}:`, error);
            this.showError(`Fout bij openen: ${error.message}`);
        }
    }
    
    getLitterModalHTML() {
        // Dit is een aparte modal voor als je direct een nest wilt toevoegen
        // (niet via het keuzescherm in DogManager)
        return `
            <div class="modal fade" id="litterModal" tabindex="-1" aria-labelledby="litterModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="litterModalLabel">
                                <i class="bi bi-people"></i> Nieuw Nest Toevoegen
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            ${this.modules.litter.getFormHTML()}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i> Sluiten
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
                    backdrop: true,
                    keyboard: true,
                    focus: true
                });
                modal.show();
                
                modalElement.addEventListener('hidden.bs.modal', () => {
                    console.log(`Modal ${modalId} gesloten`);
                    this.currentModal = null;
                });
                
                modalElement.addEventListener('shown.bs.modal', () => {
                    console.log(`Modal ${modalId} getoond`);
                    this.currentModal = modalId;
                });
                
                this.currentModal = modalId;
                
            } catch (error) {
                console.error(`Fout bij tonen modal ${modalId}:`, error);
                this.showError(`Fout bij openen popup: ${error.message}`);
            }
        } else {
            console.error(`Modal element ${modalId} niet gevonden in HTML`);
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
                            if (this.modules.data.loadDatabaseStats) {
                                this.modules.data.loadDatabaseStats();
                            }
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
                        } else if (this.modules.editDogData && this.modules.editDogData.init) {
                            // Fallback voor modules met alleen init
                            this.modules.editDogData.init();
                        }
                        break;
                        
                    case 'search':
                        if (this.modules.search && this.modules.search.setupEvents) {
                            this.modules.search.setupEvents();
                            if (this.modules.search.loadSearchData) {
                                this.modules.search.loadSearchData();
                            }
                        }
                        break;
                        
                    case 'photos':
                        if (this.modules.photo && this.modules.photo.setupEvents) {
                            this.modules.photo.setupEvents();
                            if (this.modules.photo.loadPhotosData) {
                                this.modules.photo.loadPhotosData();
                            }
                        }
                        break;
                        
                    case 'breeding':
                        if (this.modules.breeding && this.modules.breeding.setupEvents) {
                            this.modules.breeding.setupEvents();
                            if (this.modules.breeding.loadBreedingData) {
                                this.modules.breeding.loadBreedingData();
                            }
                        }
                        break;
                        
                    case 'private':
                        if (this.modules.private && this.modules.private.setupEvents) {
                            this.modules.private.setupEvents();
                            if (this.modules.private.loadPrivateInfoData) {
                                this.modules.private.loadPrivateInfoData();
                            }
                        }
                        break;
                        
                    case 'litter':
                        if (this.modules.litter && this.modules.litter.setupEvents) {
                            this.modules.litter.setupEvents();
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
    
    // Test functie voor debugging
    test() {
        console.log('UIHandler test - modules:', Object.keys(this.modules));
        return true;
    }
    
    // Helper functie voor terugkeer naar keuzescherm (gebruikt door LitterManager)
    showChoiceScreen() {
        // Deze functie wordt aangeroepen vanuit LitterManager om terug te gaan naar het keuzescherm
        if (this.modules.dog && this.modules.dog.showChoiceScreen) {
            this.modules.dog.showChoiceScreen();
        }
    }
}

// Maak globaal beschikbaar voor debug doeleinden
if (typeof window !== 'undefined') {
    window.UIHandler = UIHandler;
    window.uiHandler = new UIHandler(); // Optioneel: maak direct een instantie beschikbaar
}