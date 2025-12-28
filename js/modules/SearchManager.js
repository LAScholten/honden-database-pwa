/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam en kennelnaam
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.searchType = 'name'; // 'name' of 'kennel'
        this.stamboomManager = null; // Wordt later geïnitialiseerd
        
        // Vertalingen uitgebreid met pedigree knop
        this.translations = {
            nl: {
                searchDog: "Hond Zoeken",
                searchName: "Zoek hond op naam",
                searchKennel: "Zoek hond op kennelnaam",
                searchPlaceholder: "Typ hondennaam...",
                kennelPlaceholder: "Typ kennelnaam...",
                noDogsFound: "Geen honden gevonden",
                typeToSearch: "Begin met typen om te zoeken",
                typeToSearchKennel: "Typ een kennelnaam om te zoeken",
                searchResults: "Zoekresultaten",
                found: "gevonden",
                name: "Naam",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                close: "Sluiten",
                dogDetails: "Hond Details",
                father: "Vader",
                mother: "Moeder",
                parentsUnknown: "Onbekend",
                male: "Reu",
                female: "Teef",
                unknown: "Onbekend",
                loading: "Honden laden...",
                backToSearch: "Terug naar zoeken",
                viewingParent: "Bekijkt ouder",
                clickToView: "Klik om details te bekijken",
                parents: "Ouders",
                noHealthInfo: "Geen gezondheidsinformatie beschikbaar",
                noAdditionalInfo: "Geen extra informatie beschikbaar",
                selectDogToView: "Selecteer een hond om details te zien",
                
                // Hond gegevens
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                eyesExplanation: "Verklaring ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                remarks: "Opmerkingen",
                healthInfo: "Gezondheidsinformatie",
                additionalInfo: "Extra informatie",
                
                // Gezondheidsstatussen
                hipGrades: {
                    A: "A - Geen tekenen van HD",
                    B: "B - Overgangsvorm",
                    C: "C - Lichte HD",
                    D: "D - Matige HD", 
                    E: "E - Ernstige HD"
                },
                elbowGrades: {
                    "0": "0 - Geen ED",
                    "1": "1 - Milde ED",
                    "2": "2 - Matige ED",
                    "3": "3 - Ernstige ED",
                    "NB": "NB - Niet bekend"
                },
                patellaGrades: {
                    "0": "0 - Geen PL",
                    "1": "1 - Af en toe luxatie",
                    "2": "2 - Regelmatig luxatie",
                    "3": "3 - Constante luxation"
                },
                eyeStatus: {
                    "Vrij": "Vrij",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Overig"
                },
                dandyStatus: {
                    "Vrij op DNA": "Vrij op DNA",
                    "Vrij op ouders": "Vrij op ouders", 
                    "Drager": "Drager",
                    "Lijder": "Lijder"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negatief",
                    "Positief": "Tgaa Positief"
                },
                
                // Labels
                grade: "Graad",
                status: "Status",
                notApplicable: "Niet van toepassing",
                viewMore: "Meer details",
                
                // Stamboom knoppen
                pedigreeButton: "Stamboom",
                pedigreeTitle: "Stamboom van {name}",
                generatingPedigree: "Stamboom genereren...",
                openPedigree: "Stamboom openen",
                pedigree4Gen: "4-generatie stamboom",
                
                // Familierelaties voor stamboom
                greatGrandfather: "Overgrootvader",
                greatGrandmother: "Overgrootmoeder",
                grandfather: "Grootvader",
                grandmother: "Grootmoeder"
            },
            en: {
                searchDog: "Search Dog",
                searchName: "Search dog by name",
                searchKennel: "Search dog by kennel name",
                searchPlaceholder: "Type dog name...",
                kennelPlaceholder: "Type kennel name...",
                noDogsFound: "No dogs found",
                typeToSearch: "Start typing to search",
                typeToSearchKennel: "Type a kennel name to search",
                searchResults: "Search Results",
                found: "found",
                name: "Name",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                close: "Close",
                dogDetails: "Dog Details",
                father: "Father",
                mother: "Mother",
                parentsUnknown: "Unknown",
                male: "Male",
                female: "Female",
                unknown: "Unknown",
                loading: "Loading dogs...",
                backToSearch: "Back to search",
                viewingParent: "Viewing parent",
                clickToView: "Click to view details",
                parents: "Parents",
                noHealthInfo: "No health information available",
                noAdditionalInfo: "No additional information available",
                selectDogToView: "Select a dog to view details",
                
                // Dog details
                birthDate: "Birth date",
                deathDate: "Death date",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                eyesExplanation: "Eye explanation",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                remarks: "Remarks",
                healthInfo: "Health Information",
                additionalInfo: "Additional Information",
                
                // Health statuses
                hipGrades: {
                    A: "A - No signs of HD",
                    B: "B - Borderline",
                    C: "C - Mild HD",
                    D: "D - Moderate HD",
                    E: "E - Severe HD"
                },
                elbowGrades: {
                    "0": "0 - No ED",
                    "1": "1 - Mild ED",
                    "2": "2 - Moderate ED",
                    "3": "3 - Severe ED",
                    "NB": "NB - Not known"
                },
                patellaGrades: {
                    "0": "0 - No PL",
                    "1": "1 - Occasional luxation",
                    "2": "2 - Frequent luxation",
                    "3": "3 - Constant luxation"
                },
                eyeStatus: {
                    "Vrij": "Free",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Other"
                },
                dandyStatus: {
                    "Vrij op DNA": "Free on DNA",
                    "Vrij op ouders": "Free on parents",
                    "Drager": "Carrier",
                    "Lijder": "Affected"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negative",
                    "Positief": "Tgaa Positive"
                },
                
                // Labels
                grade: "Grade",
                status: "Status",
                notApplicable: "Not applicable",
                viewMore: "View details",
                
                // Stamboom buttons
                pedigreeButton: "Pedigree",
                pedigreeTitle: "Pedigree of {name}",
                generatingPedigree: "Generating pedigree...",
                openPedigree: "Open pedigree",
                pedigree4Gen: "4-generation pedigree",
                
                // Family relations for pedigree
                greatGrandfather: "Great Grandfather",
                greatGrandmother: "Great Grandmother",
                grandfather: "Grandfather",
                grandmother: "Grandmother"
            },
            de: {
                searchDog: "Hund suchen",
                searchName: "Hund nach Namen suchen",
                searchKennel: "Hund nach Kennelname suchen",
                searchPlaceholder: "Hundenamen eingeben...",
                kennelPlaceholder: "Kennelnamen eingeben...",
                noDogsFound: "Keine Hunde gefunden",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                typeToSearchKennel: "Kennelnamen eingeben um zu suchen",
                searchResults: "Suchergebnisse",
                found: "gefunden",
                name: "Name",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geschlecht",
                close: "Schließen",
                dogDetails: "Hund Details",
                father: "Vater",
                mother: "Mutter",
                parentsUnknown: "Unbekannt",
                male: "Rüde",
                female: "Hündin",
                unknown: "Unbekannt",
                loading: "Hunde laden...",
                backToSearch: "Zurück zur Suche",
                viewingParent: "Elternteil ansehen",
                clickToView: "Klicken für Details",
                parents: "Eltern",
                noHealthInfo: "Keine Gesundheitsinformationen verfügbar",
                noAdditionalInfo: "Keine zusätzlichen Informationen verfügbar",
                selectDogToView: "Wählen Sie einen Hund, um Details zu sehen",
                
                // Hund Details
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                eyesExplanation: "Augenerklärung",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                remarks: "Bemerkungen",
                healthInfo: "Gesundheitsinformationen",
                additionalInfo: "Zusätzliche informatie",
                
                // Stamboom buttons
                pedigreeButton: "Ahnentafel",
                pedigreeTitle: "Ahnentafel von {name}",
                generatingPedigree: "Ahnentafel wird generiert...",
                openPedigree: "Ahnentafel öffnen",
                pedigree4Gen: "4-Generationen Ahnentafel",
                
                // Familienbeziehungen voor Ahnentafel
                greatGrandfather: "Urgroßvater",
                greatGrandmother: "Urgroßmutter",
                grandfather: "Großvater",
                grandmother: "Großmutter"
            }
        };
    }
    
    // NIEUW: Inject dependencies method voor UIHandler compatibiliteit
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
        console.log('SearchManager: dependencies geïnjecteerd');
    }
    
    // NIEUW: Initialize method voor UIHandler compatibiliteit
    initialize() {
        console.log('SearchManager: initializing...');
        // Laad honden niet vooraf om performance te verbeteren
        // Ze worden geladen wanneer de gebruiker voor het eerst zoekt
        return Promise.resolve();
    }
    
    t(key, subKey = null) {
        if (subKey && this.translations[this.currentLang][key] && typeof this.translations[this.currentLang][key] === 'object') {
            return this.translations[this.currentLang][key][subKey] || subKey;
        }
        return this.translations[this.currentLang][key] || key;
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search me-2"></i> ${t('searchDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="container-fluid">
                                <div class="row">
                                    <!-- Zoekkolom -->
                                    <div class="col-md-5 border-end p-3" id="searchColumn">
                                        <div class="sticky-top" style="top: 15px;">
                                            <!-- Tab knoppen voor zoektype -->
                                            <div class="d-flex mb-3 border-bottom">
                                                <button type="button" class="btn btn-search-type btn-outline-info active me-2" data-search-type="name">
                                                    ${t('searchName')}
                                                </button>
                                                <button type="button" class="btn btn-search-type btn-outline-info" data-search-type="kennel">
                                                    ${t('searchKennel')}
                                                </button>
                                            </div>
                                            
                                            <!-- Zoekveld voor naam -->
                                            <div class="mb-4" id="nameSearchField">
                                                <label for="searchNameInput" class="form-label fw-bold">${t('searchName')}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-white border-end-0">
                                                        <i class="bi bi-person text-muted"></i>
                                                    </span>
                                                    <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                           id="searchNameInput" 
                                                           placeholder="${t('searchPlaceholder')}" 
                                                           autocomplete="off">
                                                </div>
                                                <div class="form-text mt-1">${t('typeToSearch')}</div>
                                            </div>
                                            
                                            <!-- Zoekveld voor kennelnaam -->
                                            <div class="mb-4 d-none" id="kennelSearchField">
                                                <label for="searchKennelInput" class="form-label fw-bold">${t('searchKennel')}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-white border-end-0">
                                                        <i class="bi bi-house text-muted"></i>
                                                    </span>
                                                    <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                           id="searchKennelInput" 
                                                           placeholder="${t('kennelPlaceholder')}" 
                                                           autocomplete="off">
                                                </div>
                                                <div class="form-text mt-1">${t('typeToSearchKennel')}</div>
                                            </div>
                                            
                                            <div id="searchResultsContainer">
                                                <div class="text-center py-5">
                                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Details kolom -->
                                    <div class="col-md-7 p-3" id="detailsColumn">
                                        <div id="detailsContainer">
                                            <div class="text-center py-5">
                                                <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                                                <p class="mt-3 text-muted">${t('selectDogToView')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i> ${t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- RESET CSS VOOR STAMBOOMMODAL DIE VANUIT DEZE MODAL WORDT GESTART -->
            <style>
                /* RESET VOOR STAMBOOM MODAL */
                .modal-dialog.modal-fullscreen .modal-content {
                    padding: 0 !important;
                    margin: 0 !important;
                    border: none !important;
                }
                
                .modal-dialog.modal-fullscreen .modal-body {
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                .pedigree-container-compact {
                    padding: 0 !important;
                    margin: 0 !important;
                    width: 100vw !important;
                    max-width: 100vw !important;
                }
                
                .pedigree-grid-compact {
                    padding: 0 !important;
                    margin: 0 !important;
                    width: 100vw !important;
                }
                
                .pedigree-generation-row {
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                /* SEARCH MANAGER STYLES */
                .search-input {
                    font-size: 1.1rem;
                    padding: 10px 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                
                .search-input:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
                
                .btn-search-type {
                    flex: 1;
                    border-radius: 8px;
                    padding: 8px 12px;
                    transition: all 0.3s;
                }
                
                .btn-search-type.active {
                    background-color: #0d6efd;
                    color: white;
                    border-color: #0d6efd;
                }
                
                .dog-result-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    padding: 12px 15px;
                    background: white;
                }
                
                .dog-result-item:hover {
                    background-color: #f8f9fa;
                    border-color: #0d6efd;
                    transform: translateX(3px);
                }
                
                .dog-result-item.selected {
                    background-color: #e8f4fd;
                    border-color: #0d6efd;
                    border-left: 4px solid #0d6efd;
                }
                
                .dog-name-line {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #0d6efd;
                    margin-bottom: 4px;
                }
                
                .dog-name {
                    font-weight: 700;
                    color: #0d6efd;
                }
                
                .dog-kennel-line {
                    font-size: 0.95rem;
                    color: #6c757d;
                    margin-bottom: 8px;
                    font-style: italic;
                }
                
                .dog-details-line {
                    color: #495057;
                    font-size: 0.95rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    align-items: center;
                }
                
                .dog-details-line .stamboom {
                    font-weight: 700;
                    color: #212529;
                }
                
                .search-stats {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .details-card {
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .details-header {
                    background: white;
                    color: #212529;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .details-body {
                    padding: 20px;
                    background: white;
                }
                
                .info-group {
                    margin-bottom: 20px;
                }
                
                .info-group-title {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    color: #6c757d;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .info-row {
                    display: flex;
                    margin-bottom: 8px;
                    padding: 8px 0;
                    border-bottom: 1px solid #f8f9fa;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    width: 180px;
                    min-width: 180px;
                }
                
                .info-value {
                    color: #212529;
                    flex: 1;
                }
                
                .badge-hd {
                    background-color: #20c997;
                    color: white;
                }
                
                .badge-ed {
                    background-color: #6f42c1;
                    color: white;
                }
                
                .badge-pl {
                    background-color: #fd7e14;
                    color: white;
                }
                
                .badge-eyes {
                    background-color: #17a2b8;
                    color: white;
                }
                
                .badge-dandy {
                    background-color: #e83e8c;
                    color: white;
                }
                
                .badge-thyroid {
                    background-color: #28a745;
                    color: white;
                }
                
                .father-card {
                    background: #e8f4fd;
                    border: 1px solid #cfe2ff;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .father-card:hover {
                    background: #d1e7ff;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .mother-card {
                    background: #fce8f1;
                    border: 1px solid #f8d7e3;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .mother-card:hover {
                    background: #f9d9e9;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .parent-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #0d6efd;
                    margin-bottom: 5px;
                }
                
                .parent-mother-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #dc3545;
                    margin-bottom: 5px;
                }
                
                .parent-info {
                    color: #6c757d;
                    font-size: 0.85rem;
                }
                
                .click-hint {
                    font-size: 0.75rem;
                    color: #6c757d;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .back-button {
                    margin-bottom: 15px;
                }
                
                .remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 15px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                }
                
                .empty-state {
                    color: #adb5bd;
                    font-style: italic;
                }
                
                .dog-name-header {
                    color: #0d6efd;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                
                .dog-detail-header-line {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    align-items: center;
                    margin-top: 8px;
                    color: #495057;
                }
                
                .dog-detail-header-line .geslacht {
                    font-weight: 600;
                    color: #0d6efd;
                }
                
                .dog-detail-header-line .ras {
                    font-weight: 500;
                }
                
                .dog-detail-header-line .stamboom {
                    font-weight: 700;
                    color: #212529;
                }
                
                .dog-detail-header-line .vachtkleur {
                    color: #d63384;
                    font-weight: 500;
                }
                
                @media (max-width: 768px) {
                    .modal-body {
                        max-height: calc(100vh - 200px);
                        overflow-y: auto;
                    }
                    
                    .info-row {
                        flex-direction: column;
                    }
                    
                    .info-label {
                        width: 100%;
                        margin-bottom: 4px;
                    }
                    
                    .dog-name-line {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                    }
                    
                    .dog-details-line {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                    }
                    
                    .dog-detail-header-line {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                    }
                }
            </style>
        `;
    }
    
    setupEvents() {
        this.setupSearch();
    }
    
    setupSearch() {
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const searchType = e.target.getAttribute('data-search-type');
                this.switchSearchType(searchType);
            });
        });
        
        this.setupNameSearch();
        this.setupKennelSearch();
    }
    
    switchSearchType(type) {
        this.searchType = type;
        
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            const btnType = btn.getAttribute('data-search-type');
            if (btnType === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        const nameField = document.getElementById('nameSearchField');
        const kennelField = document.getElementById('kennelSearchField');
        
        if (type === 'name') {
            nameField.classList.remove('d-none');
            kennelField.classList.add('d-none');
            document.getElementById('searchNameInput').focus();
        } else {
            nameField.classList.add('d-none');
            kennelField.classList.remove('d-none');
            document.getElementById('searchKennelInput').focus();
        }
        
        this.showInitialView();
        this.clearDetails();
    }
    
    setupNameSearch() {
        const searchInput = document.getElementById('searchNameInput');
        if (!searchInput) return;
        
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadSearchData();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.filterDogsByName(searchTerm);
            } else {
                this.showInitialView();
                this.clearDetails();
            }
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.filteredDogs.length > 0) {
                e.preventDefault();
                this.selectDog(this.filteredDogs[0]);
            }
        });
    }
    
    setupKennelSearch() {
        const searchInput = document.getElementById('searchKennelInput');
        if (!searchInput) return;
        
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadSearchData();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.filterDogsByKennel(searchTerm);
            } else {
                this.showInitialView();
                this.clearDetails();
            }
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.filteredDogs.length > 0) {
                e.preventDefault();
                this.selectDog(this.filteredDogs[0]);
            }
        });
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        const t = this.t.bind(this);
        
        const message = this.searchType === 'name' ? t('typeToSearch') : t('typeToSearchKennel');
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${message}</p>
            </div>
        `;
    }
    
    clearDetails() {
        const container = document.getElementById('detailsContainer');
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${t('selectDogToView')}</p>
            </div>
        `;
    }
    
    async loadSearchData() {
        this.showProgress(this.t('loading'));
        
        try {
            if (!this.db) {
                console.error('Database niet beschikbaar in SearchManager');
                this.hideProgress();
                return;
            }
            
            this.allDogs = await this.db.getHonden();
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            this.hideProgress();
            
            console.log(`${this.allDogs.length} honden geladen voor zoeken`);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Laden mislukt: ${error.message}`);
        }
    }
    
    filterDogsByName(searchTerm = '') {
        this.filteredDogs = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            return naam.startsWith(searchTerm);
        });
        
        this.displaySearchResults();
    }
    
    filterDogsByKennel(searchTerm = '') {
        this.filteredDogs = this.allDogs.filter(dog => {
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            return kennelnaam.startsWith(searchTerm);
        });
        
        this.filteredDogs.sort((a, b) => {
            const naamA = a.naam ? a.naam.toLowerCase() : '';
            const naamB = b.naam ? b.naam.toLowerCase() : '';
            return naamA.localeCompare(naamB);
        });
        
        this.displaySearchResults();
    }
    
    displaySearchResults() {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        if (this.filteredDogs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-stats">
                <i class="bi bi-info-circle me-1"></i>
                ${this.filteredDogs.length} ${t('found')}
            </div>
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : t('unknown');
            
            html += `
                <div class="dog-result-item" data-id="${dog.id}">
                    <!-- REGEL 1: Alleen naam -->
                    <div class="dog-name-line">
                        <span class="dog-name">${dog.naam || t('unknown')}</span>
                    </div>
                    
                    <!-- REGEL 2: Kennelnaam -->
                    ${dog.kennelnaam ? `
                    <div class="dog-kennel-line">
                        ${dog.kennelnaam}
                    </div>
                    ` : ''}
                    
                    <!-- REGEL 3: Stamboomnummer + Ras + Geslacht (GEEN vachtkleur in zoekresultaten) -->
                    <div class="dog-details-line">
                        ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                        ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                        <span class="geslacht">${genderText}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const hondId = parseInt(item.getAttribute('data-id'));
                this.selectDogById(hondId);
                
                // Verberg de dropdown op mobiele apparaten
                if (window.innerWidth <= 768) {
                    this.collapseSearchResultsOnMobile();
                }
            });
        });
    }
    
    collapseSearchResultsOnMobile() {
        // Op mobiel schermen, toon alleen de details en verberg de zoekresultaten
        if (window.innerWidth <= 768) {
            const searchColumn = document.getElementById('searchColumn');
            const detailsColumn = document.getElementById('detailsColumn');
            
            if (searchColumn && detailsColumn) {
                searchColumn.classList.add('d-none');
                detailsColumn.classList.remove('col-md-7');
                detailsColumn.classList.add('col-12');
                
                // Voeg een terugknop toe voor mobiele weergave
                this.addMobileBackButton();
            }
        }
    }
    
    addMobileBackButton() {
        const detailsContainer = document.getElementById('detailsContainer');
        if (!detailsContainer) return;
        
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-sm btn-outline-secondary mb-3';
        backButton.innerHTML = '<i class="bi bi-arrow-left me-1"></i> Terug naar zoeken';
        backButton.onclick = () => {
            this.restoreSearchViewOnMobile();
        };
        
        // Voeg de knop toe aan het begin van de details
        const firstChild = detailsContainer.firstChild;
        if (firstChild) {
            detailsContainer.insertBefore(backButton, firstChild);
        } else {
            detailsContainer.appendChild(backButton);
        }
    }
    
    restoreSearchViewOnMobile() {
        const searchColumn = document.getElementById('searchColumn');
        const detailsColumn = document.getElementById('detailsColumn');
        
        if (searchColumn && detailsColumn) {
            searchColumn.classList.remove('d-none');
            detailsColumn.classList.remove('col-12');
            detailsColumn.classList.add('col-md-7');
            
            // Wis de terugknop
            const backButton = detailsContainer.querySelector('button.btn-outline-secondary');
            if (backButton && backButton.textContent.includes('Terug naar zoeken')) {
                backButton.remove();
            }
            
            // Herstel de zoekfunctie
            const searchInput = this.searchType === 'name' ? 
                document.getElementById('searchNameInput') : 
                document.getElementById('searchKennelInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
    
    selectDog(dog) {
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.classList.remove('selected');
            if (parseInt(item.getAttribute('data-id')) === dog.id) {
                item.classList.add('selected');
            }
        });
        
        this.showDogDetails(dog);
        
        // Verberg de dropdown op mobiele apparaten
        if (window.innerWidth <= 768) {
            this.collapseSearchResultsOnMobile();
        }
    }
    
    selectDogById(hondId) {
        const dog = this.allDogs.find(h => h.id === hondId);
        if (dog) {
            this.selectDog(dog);
        }
    }
    
    showDogDetails(dog, isParentView = false, originalDogId = null) {
        const t = this.t.bind(this);
        const container = document.getElementById('detailsContainer');
        
        if (!container) return;
        
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        
        if (dog.vaderId) {
            const father = this.allDogs.find(d => d.id === dog.vaderId);
            if (father) {
                fatherInfo = { 
                    id: father.id,
                    naam: father.naam || t('unknown'),
                    stamboomnr: father.stamboomnr || '',
                    ras: father.ras || '',
                    kennelnaam: father.kennelnaam || ''
                };
            }
        }
        
        if (dog.moederId) {
            const mother = this.allDogs.find(d => d.id === dog.moederId);
            if (mother) {
                motherInfo = { 
                    id: mother.id,
                    naam: mother.naam || t('unknown'),
                    stamboomnr: mother.stamboomnr || '',
                    ras: mother.ras || '',
                    kennelnaam: mother.kennelnaam || ''
                };
            }
        }
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        };
        
        const getHealthBadge = (value, type) => {
            if (!value || value === '') {
                return `<span class="badge bg-secondary">${t('unknown')}</span>`;
            }
            
            let badgeClass = '';
            let badgeText = value;
            
            switch(type) {
                case 'hip':
                    badgeClass = 'badge-hd';
                    badgeText = t('hipGrades', value) || value;
                    break;
                case 'elbow':
                    badgeClass = 'badge-ed';
                    badgeText = t('elbowGrades', value) || value;
                    break;
                case 'patella':
                    badgeClass = 'badge-pl';
                    badgeText = t('patellaGrades', value) || value;
                    break;
                case 'eyes':
                    badgeClass = 'badge-eyes';
                    badgeText = t('eyeStatus', value) || value;
                    break;
                case 'dandy':
                    badgeClass = 'badge-dandy';
                    badgeText = t('dandyStatus', value) || value;
                    break;
                case 'thyroid':
                    badgeClass = 'badge-thyroid';
                    badgeText = t('thyroidStatus', value) || value;
                    break;
                default:
                    badgeClass = 'badge bg-secondary';
            }
            
            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
        };
        
        const displayValue = (value) => {
            return value && value !== '' ? value : t('unknown');
        };
        
        const genderText = dog.geslacht === 'reuen' ? t('male') : 
                          dog.geslacht === 'teven' ? t('female') : t('unknown');
        
        const html = `
            <div class="details-card">
                ${isParentView ? `
                <div class="details-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-sm btn-outline-secondary back-button" data-original-dog="${originalDogId}">
                            <i class="bi bi-arrow-left me-1"></i> ${t('backToSearch')}
                        </button>
                        <div class="text-muted small">
                            <i class="bi bi-info-circle me-1"></i> ${t('viewingParent')}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="details-header ${isParentView ? 'pt-0' : ''}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="dog-name-header">${displayValue(dog.naam)}</div>
                            ${dog.kennelnaam ? `<div class="text-muted mb-2">${displayValue(dog.kennelnaam)}</div>` : ''}
                            
                            <!-- VOLGORDE: Stamboomnummer + Ras + Geslacht + Vachtkleur (zoals in 2e image) -->
                            <div class="dog-detail-header-line mt-2">
                                ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                <span class="geslacht">${genderText}</span>
                                ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? 
                                  `<span class="vachtkleur">${dog.vachtkleur}</span>` : 
                                  `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                            </div>
                        </div>
                        <div class="text-end">
                            <!-- Geboortedatum - behouden -->
                            ${dog.geboortedatum ? `
                            <div class="text-muted">
                                <i class="bi bi-calendar me-1"></i>
                                ${formatDate(dog.geboortedatum)}
                            </div>
                            ` : ''}
                            
                            <!-- Overlijdensdatum - behouden -->
                            ${dog.overlijdensdatum ? `
                            <div class="text-muted ${dog.geboortedatum ? 'mt-1' : ''}">
                                <i class="bi bi-calendar-x me-1"></i>
                                ${formatDate(dog.overlijdensdatum)}
                            </div>
                            ` : ''}
                            
                            <!-- Stamboom knop -->
                            <button class="btn btn-sm btn-outline-primary mt-2 btn-pedigree" data-dog-id="${dog.id}">
                                <i class="bi bi-diagram-3 me-1"></i> ${t('pedigreeButton')}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="details-body">
                    <div class="info-group">
                        <div class="info-group-title d-flex justify-content-between align-items-center">
                            <div>
                                <i class="bi bi-people me-1"></i> ${t('parents')}
                            </div>
                            <button class="btn btn-sm btn-outline-primary btn-pedigree" data-dog-id="${dog.id}">
                                <i class="bi bi-diagram-3 me-1"></i> ${t('pedigreeButton')}
                            </button>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="father-card" ${fatherInfo.id ? `data-parent-id="${fatherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                    <div class="fw-bold mb-1 text-primary">
                                        <i class="bi bi-gender-male me-1"></i> ${t('father')}
                                    </div>
                                    <div class="parent-name">${fatherInfo.naam} ${fatherInfo.kennelnaam}</div>
                                    ${fatherInfo.stamboomnr ? `<div class="parent-info">${fatherInfo.stamboomnr}</div>` : ''}
                                    ${fatherInfo.ras ? `<div class="parent-info">${fatherInfo.ras}</div>` : ''}
                                    ${fatherInfo.id ? `
                                    <div class="click-hint">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        ${t('clickToView')}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="mother-card" ${motherInfo.id ? `data-parent-id="${motherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                    <div class="fw-bold mb-1 text-danger">
                                        <i class="bi bi-gender-female me-1"></i> ${t('mother')}
                                    </div>
                                    <div class="parent-mother-name">${motherInfo.naam} ${motherInfo.kennelnaam}</div>
                                    ${motherInfo.stamboomnr ? `<div class="parent-info">${motherInfo.stamboomnr}</div>` : ''}
                                    ${motherInfo.ras ? `<div class="parent-info">${motherInfo.ras}</div>` : ''}
                                    ${motherInfo.id ? `
                                    <div class="click-hint">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        ${t('clickToView')}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-heart-pulse me-1"></i> ${t('healthInfo')}
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('hipDysplasia')}</div>
                                <div>${getHealthBadge(dog.heupdysplasie, 'hip')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('elbowDysplasia')}</div>
                                <div>${getHealthBadge(dog.elleboogdysplasie, 'elbow')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('patellaLuxation')}</div>
                                <div>${getHealthBadge(dog.patella, 'patella')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('eyes')}</div>
                                <div>${getHealthBadge(dog.ogen, 'eyes')}</div>
                                ${dog.ogenVerklaring ? `<div class="text-muted small mt-1">${dog.ogenVerklaring}</div>` : ''}
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('dandyWalker')}</div>
                                <div>${getHealthBadge(dog.dandyWalker, 'dandy')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('thyroid')}</div>
                                <div>${getHealthBadge(dog.schildklier, 'thyroid')}</div>
                                ${dog.schildklierVerklaring ? `<div class="text-muted small mt-1">${dog.schildklierVerklaring}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-info-circle me-1"></i> ${t('additionalInfo')}
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="fw-bold mb-1">${t('country')}</div>
                                <div>${displayValue(dog.land)}</div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="fw-bold mb-1">${t('zipCode')}</div>
                                <div>${displayValue(dog.postcode)}</div>
                            </div>
                        </div>
                        
                        <div class="mt-3">
                            <div class="fw-bold mb-2">${t('remarks')}</div>
                            <div class="remarks-box">
                                ${dog.opmerkingen ? dog.opmerkingen : t('noAdditionalInfo')}
                            </div>
                        </div>
                    </div>
                    
                    ${dog.createdAt || dog.updatedAt ? `
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-clock-history me-1"></i> Systeem informatie
                        </div>
                        <div class="row">
                            ${dog.createdAt ? `
                            <div class="col-md-6">
                                <div class="text-muted small">Aangemaakt</div>
                                <div class="small">${formatDate(dog.createdAt)}</div>
                            </div>
                            ` : ''}
                            ${dog.updatedAt ? `
                            <div class="col-md-6">
                                <div class="text-muted small">Laatst bijgewerkt</div>
                                <div class="small">${formatDate(dog.updatedAt)}</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Voeg terugknop toe voor mobiele weergave (als we in collapsed modus zijn)
        if (window.innerWidth <= 768) {
            this.addMobileBackButton();
        }
        
        if (fatherInfo.id) {
            const fatherCard = document.querySelector('.father-card');
            if (fatherCard) {
                fatherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(fatherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        if (motherInfo.id) {
            const motherCard = document.querySelector('.mother-card');
            if (motherCard) {
                motherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(motherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        // Event listeners voor stamboom knoppen
        document.querySelectorAll('.btn-pedigree').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        });
        
        if (isParentView) {
            const backButton = document.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    const originalDogId = parseInt(backButton.getAttribute('data-original-dog'));
                    const originalDog = this.allDogs.find(d => d.id === originalDogId);
                    if (originalDog) {
                        this.showDogDetails(originalDog);
                    }
                });
            }
        }
    }
    
    showParentDetails(parentId, originalDogId) {
        const parent = this.allDogs.find(d => d.id === parentId);
        if (parent) {
            this.showDogDetails(parent, true, originalDogId);
            
            document.querySelectorAll('.dog-result-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-id')) === parentId) {
                    item.classList.add('selected');
                }
            });
        }
    }
    
    // NIEUWE METHODE: Stamboom openen
    async openPedigree(dogId) {
        try {
            // Initialiseer stamboom manager als nog niet gedaan
            if (!this.stamboomManager) {
                console.log('Initializing StamboomManager...');
                this.stamboomManager = new StamboomManager(this.db, this.currentLang);
                await this.stamboomManager.initialize();
            }
            
            // Zoek de hond
            const dog = this.allDogs.find(d => d.id === dogId);
            if (!dog) {
                this.showError("Hond niet gevonden");
                return;
            }
            
            // Toon stamboom modal
            this.stamboomManager.showPedigree(dog);
            
        } catch (error) {
            console.error('Fout bij openen stamboom:', error);
            this.showError(`Fout bij openen stamboom: ${error.message}`);
        }
    }
    
    // Helper methodes van BaseModule
    showProgress(message) {
        if (typeof super.showProgress === 'function') {
            super.showProgress(message);
        } else {
            console.log('Progress:', message);
        }
    }
    
    hideProgress() {
        if (typeof super.hideProgress === 'function') {
            super.hideProgress();
        }
    }
    
    showError(message) {
        if (typeof super.showError === 'function') {
            super.showError(message);
        } else {
            console.error('Error:', message);
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (typeof super.showSuccess === 'function') {
            super.showSuccess(message);
        } else {
            console.log('Success:', message);
        }
    }
}