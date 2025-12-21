// js/modules/DogDataManager.js

/**
 * DogDataManager - Module voor het bewerken van honden data
 * Deze module is nog in ontwikkeling
 */
class DogDataManager extends BaseModule {
    constructor() {
        super('dogdata', 'Data Hond Bewerken');
        console.log('DogDataManager geïnitialiseerd');
    }
    
    /**
     * Render de module interface
     */
    getModalHTML() {
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        
        if (!isAdmin) {
            return `
                <div class="modal fade" id="dogDataModal" tabindex="-1" aria-labelledby="dogDataModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="dogDataModalLabel">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span class="module-title" data-key="accessDenied">Toegang Geweigerd</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <h5><i class="bi bi-shield-lock"></i> Onvoldoende rechten</h5>
                                    <p>U heeft geen toestemming om honden te bewerken. Alleen administrators kunnen deze functie gebruiken.</p>
                                    <p class="mb-0">U bent ingelogd als: <strong>${auth.getCurrentUser().username}</strong> (Gebruiker)</p>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h6><i class="bi bi-info-circle text-primary"></i> Beschikbare functies voor gebruikers</h6>
                                        <ul>
                                            <li>Honden zoeken en bekijken</li>
                                            <li>Foto galerij bekijken</li>
                                            <li>Privé informatie beheren</li>
                                            <li>Data importeren/exporteren</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i>
                                    <span class="module-text" data-key="close">Sluiten</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="modal fade" id="dogDataModal" tabindex="-1" aria-labelledby="dogDataModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dogDataModalLabel">
                                <i class="bi bi-pencil-square me-2"></i>
                                <span class="module-title" data-key="editDogData">Data Hond Bewerken</span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <h5><i class="bi bi-info-circle"></i> Module nog niet beschikbaar</h5>
                                <p>De "Data Hond Bewerken" module is momenteel nog in ontwikkeling en zal in een toekomstige update beschikbaar komen.</p>
                                <p>Gebruik voor nu de <strong>"Hond Zoeken"</strong> functionaliteit om honden te vinden en te bewerken.</p>
                            </div>
                            
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6><i class="bi bi-clock-history text-primary"></i> Geplande functionaliteiten</h6>
                                            <ul class="mb-0">
                                                <li>Zoeken op hond ID of naam</li>
                                                <li>Bulk bewerking van meerdere honden</li>
                                                <li>Geavanceerde zoekfilters</li>
                                                <li>Export van bewerkte data</li>
                                                <li>Historie van wijzigingen</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6><i class="bi bi-lightning-charge text-warning"></i> Alternatieven</h6>
                                            <p class="mb-0">
                                                <strong>Huidige opties:</strong><br>
                                                1. <button class="btn btn-sm btn-primary mt-2" onclick="appUI.showModal('search')">Hond Zoeken</button><br>
                                                2. <button class="btn btn-sm btn-success mt-2" onclick="appUI.showModal('addDog')">Nieuwe Hond (admin)</button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                <span class="module-text" data-key="close">Sluiten</span>
                            </button>
                            <button type="button" class="btn btn-primary" onclick="location.reload()">
                                <i class="bi bi-arrow-clockwise me-1"></i>
                                <span class="module-text" data-key="refresh">Pagina Vernieuwen</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Setup event listeners voor deze module
     */
    setupEvents() {
        console.log('DogDataManager setupEvents called');
        
        // Vertaal de modal tekst
        setTimeout(() => {
            this.translateModal();
        }, 100);
        
        // Voeg event listeners toe voor de knoppen in de modal
        const modal = document.getElementById('dogDataModal');
        if (modal) {
            modal.addEventListener('shown.bs.modal', () => {
                console.log('DogDataModal is nu zichtbaar');
            });
        }
    }
    
    /**
     * Vertaal de modal tekst
     */
    translateModal() {
        const currentLang = localStorage.getItem('appLanguage') || 'nl';
        const translations = {
            nl: {
                editDogData: "Data Hond Bewerken",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd"
            },
            en: {
                editDogData: "Edit Dog Data",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied"
            },
            de: {
                editDogData: "Hundedaten bearbeiten",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert"
            }
        };
        
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[currentLang] && translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });
    }
    
    /**
     * Initialiseer de module
     */
    async init() {
        console.log('DogDataManager geïnitialiseerd');
        return true;
    }
}

// Maak globaal beschikbaar voor debug doeleinden
if (typeof window !== 'undefined') {
    window.DogDataManager = DogDataManager;
}