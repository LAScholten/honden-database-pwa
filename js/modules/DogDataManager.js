// js/modules/DogDataManager.js

/**
 * DogDataManager - Module voor het bewerken van honden data
 * Deze module is nog in ontwikkeling
 */
class DogDataManager extends BaseModule {
    constructor() {
        super('dogdata', 'Data Hond Bewerken');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        console.log('DogDataManager geïnitialiseerd');
        
        this.translations = {
            nl: {
                // Modal titels
                editDogData: "Data Hond Bewerken",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd",
                
                // Toegangscontrole popup teksten
                insufficientPermissions: "Onvoldoende rechten",
                insufficientPermissionsText: "U heeft geen toestemming om honden te bewerken. Alleen administrators kunnen deze functie gebruiken.",
                loggedInAs: "U bent ingelogd als:",
                user: "Gebruiker",
                availableFeatures: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewGallery: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                
                // Info teksten
                moduleUnavailable: "Module nog niet beschikbaar",
                moduleUnavailableText: "De \"Data Hond Bewerken\" module is momenteel nog in ontwikkeling en zal in een toekomstige update beschikbaar komen.",
                useSearchFunctionality: "Gebruik voor nu de <strong>\"Hond Zoeken\"</strong> functionaliteit om honden te vinden en te bewerken.",
                
                // Geplande functionaliteiten
                plannedFeatures: "Geplande functionaliteiten",
                searchById: "Zoeken op hond ID of naam",
                bulkEdit: "Bulk bewerking van meerdere honden",
                advancedFilters: "Geavanceerde zoekfilters",
                exportData: "Export van bewerkte data",
                changeHistory: "Historie van wijzigingen",
                
                // Alternatieven
                alternatives: "Alternatieven",
                currentOptions: "Huidige opties:",
                searchDogButton: "Hond Zoeken",
                newDogButton: "Nieuwe Hond (admin)"
            },
            en: {
                // Modal titles
                editDogData: "Edit Dog Data",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied",
                
                // Access control popup texts
                insufficientPermissions: "Insufficient permissions",
                insufficientPermissionsText: "You do not have permission to edit dogs. Only administrators can use this function.",
                loggedInAs: "You are logged in as:",
                user: "User",
                availableFeatures: "Available features for users",
                searchDogs: "Search and view dogs",
                viewGallery: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                
                // Info texts
                moduleUnavailable: "Module not yet available",
                moduleUnavailableText: "The \"Edit Dog Data\" module is currently under development and will be available in a future update.",
                useSearchFunctionality: "For now, use the <strong>\"Search Dog\"</strong> functionality to find and edit dogs.",
                
                // Planned features
                plannedFeatures: "Planned features",
                searchById: "Search by dog ID or name",
                bulkEdit: "Bulk editing of multiple dogs",
                advancedFilters: "Advanced search filters",
                exportData: "Export of edited data",
                changeHistory: "Change history",
                
                // Alternatives
                alternatives: "Alternatives",
                currentOptions: "Current options:",
                searchDogButton: "Search Dog",
                newDogButton: "New Dog (admin)"
            },
            de: {
                // Modal Titel
                editDogData: "Hundedaten bearbeiten",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert",
                
                // Zugangskontrolle Popup Texte
                insufficientPermissions: "Unzureichende Berechtigungen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Hunde zu bearbeiten. Nur Administratoren können diese Funktion nutzen.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare Funktionen für Benutzer",
                searchDogs: "Hunde suchen und anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                
                // Info Texte
                moduleUnavailable: "Modul noch nicht verfügbar",
                moduleUnavailableText: "Das \"Hundedaten bearbeiten\" Modul befindet sich derzeit in Entwicklung und wird in einem zukünftigen Update verfügbar sein.",
                useSearchFunctionality: "Nutzen Sie vorerst die <strong>\"Hund suchen\"</strong> Funktion, um Hunde zu finden und zu bearbeiten.",
                
                // Geplante Funktionen
                plannedFeatures: "Geplante Funktionen",
                searchById: "Suche nach Hunde-ID oder Name",
                bulkEdit: "Massenbearbeitung mehrerer Hunde",
                advancedFilters: "Erweiterte Suchfilter",
                exportData: "Export bearbeiteter Daten",
                changeHistory: "Änderungshistorie",
                
                // Alternativen
                alternatives: "Alternativen",
                currentOptions: "Aktuelle Optionen:",
                searchDogButton: "Hund suchen",
                newDogButton: "Neuer Hund (Admin)"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    /**
     * Render de module interface
     */
    getModalHTML() {
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        const currentUser = auth.getCurrentUser();
        const userRole = currentUser.role === 'admin' ? 'Admin' : this.t('user');
        
        if (!isAdmin) {
            return `
                <div class="modal fade" id="dogDataModal" tabindex="-1" aria-labelledby="dogDataModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="dogDataModalLabel">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span class="module-title" data-key="accessDenied">${this.t('accessDenied')}</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <h5><i class="bi bi-shield-lock"></i> ${this.t('insufficientPermissions')}</h5>
                                    <p>${this.t('insufficientPermissionsText')}</p>
                                    <p class="mb-0">${this.t('loggedInAs')}: <strong>${currentUser.username}</strong> (${userRole})</p>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h6><i class="bi bi-info-circle text-primary"></i> ${this.t('availableFeatures')}</h6>
                                        <ul>
                                            <li>${this.t('searchDogs')}</li>
                                            <li>${this.t('viewGallery')}</li>
                                            <li>${this.t('managePrivateInfo')}</li>
                                            <li>${this.t('importExport')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i>
                                    <span class="module-text" data-key="close">${this.t('close')}</span>
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
                                <span class="module-title" data-key="editDogData">${this.t('editDogData')}</span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <h5><i class="bi bi-info-circle"></i> ${this.t('moduleUnavailable')}</h5>
                                <p>${this.t('moduleUnavailableText')}</p>
                                <p>${this.t('useSearchFunctionality')}</p>
                            </div>
                            
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6><i class="bi bi-clock-history text-primary"></i> ${this.t('plannedFeatures')}</h6>
                                            <ul class="mb-0">
                                                <li>${this.t('searchById')}</li>
                                                <li>${this.t('bulkEdit')}</li>
                                                <li>${this.t('advancedFilters')}</li>
                                                <li>${this.t('exportData')}</li>
                                                <li>${this.t('changeHistory')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6><i class="bi bi-lightning-charge text-warning"></i> ${this.t('alternatives')}</h6>
                                            <p class="mb-0">
                                                <strong>${this.t('currentOptions')}</strong><br>
                                                1. <button class="btn btn-sm btn-primary mt-2" onclick="appUI.showModal('search')">${this.t('searchDogButton')}</button><br>
                                                2. <button class="btn btn-sm btn-success mt-2" onclick="appUI.showModal('addDog')">${this.t('newDogButton')}</button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                <span class="module-text" data-key="close">${this.t('close')}</span>
                            </button>
                            <button type="button" class="btn btn-primary" onclick="location.reload()">
                                <i class="bi bi-arrow-clockwise me-1"></i>
                                <span class="module-text" data-key="refresh">${this.t('refresh')}</span>
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