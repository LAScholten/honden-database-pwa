/**
 * Reu en Teef Combinatie Module
 * Voor het maken van fokplannen met specifieke reu en teef
 * HERGEBRUIKT StamboomManager voor stamboom visualisatie
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = [];
        this.hondenCache = new Map();
        
        // Stamboom Manager instance
        this.stamboomManager = null;
        
        // Vertalingen
        this.translations = {
            nl: {
                title: "Reu en Teef Combinatie",
                description: "Selecteer een specifieke reu en teef voor uw fokplan",
                mother: "Teef (Moeder)",
                selectMother: "Selecteer een teef...",
                father: "Reu (Vader)",
                selectFather: "Selecteer een reu...",
                searchPlaceholder: "Typ om te zoeken...",
                back: "Terug",
                showPedigree: "Toekomstige Stamboom Tonen",
                showFuturePuppy: "Toon Toekomstige Pup Stamboom",
                pedigreeTitle: "Toekomstige Pup Stamboom",
                close: "Sluiten",
                loading: "Laden...",
                noDogFound: "Geen hond gevonden",
                unknownBreed: "Onbekend ras",
                genderTeef: "Teef",
                genderReu: "Reu",
                kennel: "Kennel:",
                pedigreeNumber: "Stamboomnr:",
                birthDate: "Geboortedatum:",
                healthInfo: "Gezondheidsinformatie",
                color: "Vachtkleur:",
                searchByName: "Zoek op naam of kennel",
                dogDetails: "Hond details",
                selectDogFirst: "Selecteer eerst een reu én een teef",
                loadingPedigree: "Stamboom wordt geladen...",
                unknownAncestor: "Onbekend",
                fatherLabel: "Vader",
                motherLabel: "Moeder",
                grandfatherLabel: "Grootvader",
                grandmotherLabel: "Grootmoeder",
                greatGrandfatherLabel: "Overgrootvader",
                greatGrandmotherLabel: "Overgrootmoeder",
                typeToSearch: "Begin met typen om te zoeken",
                noDogsFound: "Geen honden gevonden",
                found: "gevonden",
                futurePuppyName: "Toekomstige Pup",
                futurePuppyDescription: "Voorspelling van combinatie {reu} × {teef}",
                futurePuppyTitle: "Stamboom voor toekomstige pup uit combinatie {reu} × {teef}",
                predictedPedigree: "Voorspelde stamboom",
                combinedParents: "Combinatie ouders",
                print: "Afdrukken",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                mainDog: "Hoofdhond",
                currentDog: "Huidige hond",
                noData: "Geen gegevens",
                clickForDetails: "Klik voor details",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                breed: "Ras",
                gender: "Geslacht",
                coatColor: "Vachtkleur",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                eyesExplanation: "Verklaring ogen",
                thyroidExplanation: "Toelichting schildklier",
                male: "Reu",
                female: "Teef",
                remarks: "Opmerkingen",
                noRemarks: "Geen opmerkingen",
                closePopup: "Sluiten",
                photos: "Foto's",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                pedigreeNumberShort: "Stamboom",
                futurePuppy: "Toekomstige Pup",
                predictedCOI: "Voorspelde Inteeltcoëfficiënt",
                coiCalculation: "Inteeltcoëfficiënt berekening",
                basedOnParents: "Gebaseerd op ouders:",
                fatherName: "Vader:",
                motherName: "Moeder:",
                healthStatus: "Gezondheidsstatus",
                estimatedHealth: "Geschatte gezondheid (gebaseerd op ouders)",
                calculatedCOI: "Berekende COI",
                pedigreeInfo: "Stamboom informatie",
                generationInfo: "4-generatie voorspelling"
            },
            en: {
                title: "Male and Female Combination",
                description: "Select a specific male and female for your breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select a female...",
                father: "Male (Father)",
                selectFather: "Select a male...",
                searchPlaceholder: "Type to search...",
                back: "Back",
                showPedigree: "Show Future Pedigree",
                showFuturePuppy: "Show Future Puppy Pedigree",
                pedigreeTitle: "Future Puppy Pedigree",
                close: "Close",
                loading: "Loading...",
                noDogFound: "No dog found",
                unknownBreed: "Unknown breed",
                genderTeef: "Female",
                genderReu: "Male",
                kennel: "Kennel:",
                pedigreeNumber: "Pedigree nr:",
                birthDate: "Birth date:",
                healthInfo: "Health information",
                color: "Color:",
                searchByName: "Search by name or kennel",
                dogDetails: "Dog details",
                selectDogFirst: "Select both a male and a female first",
                loadingPedigree: "Loading pedigree...",
                unknownAncestor: "Unknown",
                fatherLabel: "Father",
                motherLabel: "Mother",
                grandfatherLabel: "Grandfather",
                grandmotherLabel: "Grandmother",
                greatGrandfatherLabel: "Great-grandfather",
                greatGrandmotherLabel: "Great-grandmother",
                typeToSearch: "Start typing to search",
                noDogsFound: "No dogs found",
                found: "found",
                futurePuppyName: "Future Puppy",
                futurePuppyDescription: "Prediction of combination {father} × {mother}",
                futurePuppyTitle: "Pedigree for future puppy from combination {father} × {mother}",
                predictedPedigree: "Predicted pedigree",
                combinedParents: "Combination parents",
                print: "Print",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents",
                mainDog: "Main Dog",
                currentDog: "Current Dog",
                noData: "No data",
                clickForDetails: "Click for details",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                breed: "Breed",
                gender: "Gender",
                coatColor: "Coat color",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                eyesExplanation: "Eye explanation",
                thyroidExplanation: "Thyroid explanation",
                male: "Male",
                female: "Female",
                remarks: "Remarks",
                noRemarks: "No remarks",
                closePopup: "Close",
                photos: "Photos",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                pedigreeNumberShort: "Pedigree",
                futurePuppy: "Future Puppy",
                predictedCOI: "Predicted Inbreeding Coefficient",
                coiCalculation: "Inbreeding coefficient calculation",
                basedOnParents: "Based on parents:",
                fatherName: "Father:",
                motherName: "Mother:",
                healthStatus: "Health status",
                estimatedHealth: "Estimated health (based on parents)",
                calculatedCOI: "Calculated COI",
                pedigreeInfo: "Pedigree information",
                generationInfo: "4-generation prediction"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie einen bestimmten Rüden und eine Hündin für Ihren Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie eine Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie einen Rüden...",
                searchPlaceholder: "Tippen Sie zum Suchen...",
                back: "Zurück",
                showPedigree: "Zukünftigen Stammbaum Zeigen",
                showFuturePuppy: "Zukünftigen Welpen-Stammbaum Zeigen",
                pedigreeTitle: "Zukünftiger Welpen-Stammbaum",
                close: "Schließen",
                loading: "Laden...",
                noDogFound: "Kein Hund gefunden",
                unknownBreed: "Unbekannte Rasse",
                genderTeef: "Hündin",
                genderReu: "Rüde",
                kennel: "Zwingername:",
                pedigreeNumber: "Stammbuchnr:",
                birthDate: "Geburtsdatum:",
                healthInfo: "Gesundheitsinformationen",
                color: "Fellfarbe:",
                searchByName: "Suche nach Name oder Zwingername",
                dogDetails: "Hund Details",
                selectDogFirst: "Wählen Sie zuerst einen Rüden und eine Hündin",
                loadingPedigree: "Stammbaum wird geladen...",
                unknownAncestor: "Unbekannt",
                fatherLabel: "Vater",
                motherLabel: "Mutter",
                grandfatherLabel: "Großvater",
                grandmotherLabel: "Großmutter",
                greatGrandfatherLabel: "Urgroßvater",
                greatGrandmotherLabel: "Urgroßmutter",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                noDogsFound: "Keine Hunde gefunden",
                found: "gefunden",
                futurePuppyName: "Zukünftiger Welpe",
                futurePuppyDescription: "Vorhersage der Kombination {father} × {mother}",
                futurePuppyTitle: "Stamboom für zukünftigen Welpen aus Kombination {father} × {mother}",
                predictedPedigree: "Vorhergesagter Stammbaum",
                combinedParents: "Kombination Eltern",
                print: "Drucken",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                mainDog: "Haupt-Hund",
                currentDog: "Aktueller Hund",
                noData: "Keine Daten",
                clickForDetails: "Klicken für Details",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                breed: "Rasse",
                gender: "Geslacht",
                coatColor: "Fellfarbe",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                eyesExplanation: "Augenerklärung",
                thyroidExplanation: "Schilddrüse Erklärung",
                male: "Rüde",
                female: "Hündin",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen",
                closePopup: "Schließen",
                photos: "Fotos",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                pedigreeNumberShort: "Stammbuch",
                futurePuppy: "Zukünftiger Welpe",
                predictedCOI: "Vorhergesagter Inzuchtkoeffizient",
                coiCalculation: "Inzuchtkoeffizient Berechnung",
                basedOnParents: "Basierend auf ouders:",
                fatherName: "Vater:",
                motherName: "Mutter:",
                healthStatus: "Gesundheitsstatus",
                estimatedHealth: "Geschätzte Gesundheit (basierend op ouders)",
                calculatedCOI: "Berechnete COI",
                pedigreeInfo: "Stammbaum Information",
                generationInfo: "4-Generationen Vorhersage"
            }
        };
    }
    
    injectDependencies(db, auth, stamboomManager) {
        this.db = db;
        this.auth = auth;
        this.stamboomManager = stamboomManager;
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        
        // Vervang parameters in tekst
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Reset geselecteerde honden
        this.selectedTeef = null;
        this.selectedReu = null;
        this.hondenCache.clear();
        
        // Laad honden data
        await this.loadAllHonden();
        
        // Initialiseer StamboomManager als deze nog niet bestaat
        if (!this.stamboomManager && this.db) {
            this.stamboomManager = new StamboomManager(this.db, this.currentLang);
            await this.stamboomManager.initialize();
        }
        
        content.innerHTML = `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle"></i>
                <strong>${t('searchByName')}</strong><br>
                ${t('description')}
            </div>
            
            <h5 class="mb-4">
                <i class="bi bi-gender-male-female text-purple"></i> ${t('title')}
            </h5>
            
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-female text-pink me-2"></i>${t('mother')}
                            </h6>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-search me-1"></i>${t('selectMother')}
                                </label>
                                <div class="autocomplete-container">
                                    <div class="input-group">
                                        <span class="input-group-text bg-white border-end-0">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <input type="text" 
                                               class="form-control search-input border-start-0 ps-0" 
                                               id="teefSearch" 
                                               placeholder="${t('searchPlaceholder')}"
                                               autocomplete="off">
                                    </div>
                                    <div class="autocomplete-dropdown" id="teefDropdown"></div>
                                </div>
                                <div class="form-text text-muted small mt-2">
                                    <i class="bi bi-info-circle me-1"></i> ${t('typeToSearch')}
                                </div>
                            </div>
                            
                            <!-- Zoekresultaten container -->
                            <div class="search-results-container flex-grow-1 mt-2" id="teefSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="teefDetails" class="d-none">
                                <!-- Teef details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-male text-blue me-2"></i>${t('father')}
                            </h6>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-search me-1"></i>${t('selectFather')}
                                </label>
                                <div class="autocomplete-container">
                                    <div class="input-group">
                                        <span class="input-group-text bg-white border-end-0">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <input type="text" 
                                               class="form-control search-input border-start-0 ps-0" 
                                               id="reuSearch" 
                                               placeholder="${t('searchPlaceholder')}"
                                               autocomplete="off">
                                    </div>
                                    <div class="autocomplete-dropdown" id="reuDropdown"></div>
                                </div>
                                <div class="form-text text-muted small mt-2">
                                    <i class="bi bi-info-circle me-1"></i> ${t('typeToSearch')}
                                </div>
                            </div>
                            
                            <!-- Zoekresultaten container -->
                            <div class="search-results-container flex-grow-1 mt-2" id="reuSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="reuDetails" class="d-none">
                                <!-- Reu details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Toekomstige Pup Samenvatting -->
            <div class="card mt-4 d-none" id="futurePuppySummary">
                <div class="card-header bg-success text-white">
                    <h6 class="mb-0">
                        <i class="bi bi-stars me-2"></i>${t('predictedPedigree')}
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5 id="futurePuppyName">${t('futurePuppyName')}</h5>
                            <p class="mb-2" id="futurePuppyDescription">
                                ${t('futurePuppyDescription', { reu: '?', teef: '?' })}
                            </p>
                        </div>
                        <div class="col-md-4 text-end">
                            <button type="button" class="btn btn-success btn-lg" id="showFuturePedigreeBtn">
                                <i class="bi bi-diagram-3 me-2"></i> ${t('showFuturePuppy')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // ALLEEN de groene knop tonen, paarse knop verwijderd
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
        `;
        
        // Voeg CSS toe
        this.addStyles();
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        // Setup autocomplete voor teef
        this.setupAutocomplete('teefSearch', 'teefSearchResults', 'teven', (hond) => {
            this.selectTeef(hond);
        });
        
        // Setup autocomplete voor reu
        this.setupAutocomplete('reuSearch', 'reuSearchResults', 'reuen', (hond) => {
            this.selectReu(hond);
        });
        
        // Update button states
        this.updateButtonStates();
    }
    
    addStyles() {
        if (!document.querySelector('#reuteef-combinatie-styles')) {
            const style = document.createElement('style');
            style.id = 'reuteef-combinatie-styles';
            style.textContent = `
                /* CONSISTENTE ZOEKSTIJLEN */
                .search-input {
                    font-size: 1.1rem;
                    padding: 10px 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                
                .search-input:focus {
                    border-color: #6f42c1;
                    box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
                }
                
                .search-results-container {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    overflow-y: auto;
                    min-height: 200px;
                    max-height: 300px;
                }
                
                /* AUTCOMPLETE DROPDOWN */
                .autocomplete-container {
                    position: relative;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 1050;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                    display: none;
                }
                
                /* HOND RESULTAAT ITEMS */
                .dog-result-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid #f0f0f0;
                    padding: 12px 15px;
                    background: white;
                }
                
                .dog-result-item:hover {
                    background-color: #f8f9fa;
                    transform: translateX(3px);
                }
                
                .dog-result-item.selected {
                    background-color: #f0e6ff;
                    border-left: 4px solid #6f42c1;
                }
                
                .dog-name-line {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #6f42c1;
                    margin-bottom: 8px;
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
                
                .search-stats {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 12px;
                    padding: 8px 15px;
                    border-bottom: 1px solid #dee2e6;
                    background: #f8f9fa;
                }
                
                /* DETAILS CARD STYLES */
                .dog-details-card {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    padding: 20px;
                    margin-top: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .dog-details-header {
                    margin-bottom: 20px;
                }
                
                .dog-details-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #6f42c1;
                    margin-bottom: 5px;
                }
                
                .dog-details-subtitle {
                    color: #6c757d;
                    font-size: 1rem;
                }
                
                .dog-details-info {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 15px;
                }
                
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .info-item i {
                    color: #6f42c1;
                }
                
                .dog-details-row {
                    margin-bottom: 15px;
                }
                
                .dog-details-label {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 5px;
                }
                
                .dog-details-value {
                    color: #212529;
                }
                
                /* TOEKOMSTIGE PUP SAMENVATTING */
                #futurePuppySummary .card-header {
                    background: linear-gradient(135deg, #198754 0%, #2ecc71 100%);
                }
                
                #showFuturePedigreeBtn {
                    padding: 10px 25px;
                    font-size: 1.1rem;
                    background: linear-gradient(135deg, #198754 0%, #2ecc71 100%);
                    border: none;
                    transition: all 0.3s;
                }
                
                #showFuturePedigreeBtn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(25, 135, 84, 0.3);
                }
                
                /* TOEKOMSTIGE PUP DETAIL POPUP */
                .future-puppy-detail-popup .popup-header {
                    background: linear-gradient(135deg, #198754 0%, #2ecc71 100%);
                }
                
                .coi-highlight {
                    font-size: 1.2rem;
                    font-weight: bold;
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 15px 0;
                    background: #f8f9fa;
                    border: 2px solid #198754;
                }
                
                .coi-value-large {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #198754;
                }
                
                .parents-combination {
                    background: #e9f7ef;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 15px 0;
                    border-left: 4px solid #198754;
                }
                
                .health-estimation {
                    background: #fff3cd;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 15px 0;
                    border-left: 4px solid #ffc107;
                }
                
                /* RESPONSIVE STYLES */
                @media (max-width: 768px) {
                    .search-input {
                        font-size: 1rem;
                        padding: 8px 12px;
                    }
                    
                    .dog-result-item {
                        padding: 10px 12px;
                    }
                    
                    .dog-name-line {
                        font-size: 1rem;
                    }
                    
                    .dog-details-line {
                        font-size: 0.85rem;
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        gap: 8px !important;
                    }
                    
                    .autocomplete-dropdown {
                        max-height: 250px;
                        position: fixed;
                        top: auto !important;
                        left: 10px !important;
                        right: 10px !important;
                        width: auto !important;
                        z-index: 1060;
                    }
                    
                    .search-results-container {
                        max-height: 250px;
                    }
                    
                    .dog-details-card {
                        padding: 15px;
                        margin-top: 10px;
                    }
                    
                    .dog-details-name {
                        font-size: 1.3rem;
                    }
                    
                    #futurePuppySummary .card-body .row {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    #futurePuppySummary .col-md-4 {
                        text-align: center !important;
                        margin-top: 15px;
                    }
                }
                
                @media (max-width: 480px) {
                    .search-results-container {
                        min-height: 180px;
                        max-height: 220px;
                    }
                    
                    .dog-details-info {
                        flex-direction: column;
                        gap: 8px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async loadAllHonden() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                this.allHonden = await this.db.getHonden();
                console.log(`Geladen: ${this.allHonden.length} honden uit database`);
                
                // Voeg alle honden toe aan cache
                this.allHonden.forEach(hond => {
                    this.hondenCache.set(hond.id, hond);
                    if (hond.stamboomnr) {
                        this.hondenCache.set(hond.stamboomnr, hond);
                    }
                });
            } else {
                console.error('Database niet beschikbaar of getHonden functie ontbreekt');
                this.allHonden = [];
            }
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.allHonden = [];
        }
    }
    
    async getHondById(id) {
        // Controleer eerst cache
        if (this.hondenCache.has(id)) {
            return this.hondenCache.get(id);
        }
        
        try {
            const hond = await this.db.getHondById(id);
            if (hond) {
                // Voeg toe aan cache
                this.hondenCache.set(id, hond);
                if (hond.stamboomnr) {
                    this.hondenCache.set(hond.stamboomnr, hond);
                }
            }
            return hond;
        } catch (error) {
            console.error(`Fout bij ophalen hond ${id}:`, error);
            return null;
        }
    }
    
    async findHondByNameOrPedigree(name) {
        if (!name || !name.trim()) return null;
        
        // Controleer eerst in cache
        const searchName = name.toLowerCase().trim();
        for (const hond of this.allHonden) {
            const hondNaam = hond.naam?.toLowerCase() || '';
            const stamboomnr = hond.stamboomnr?.toLowerCase() || '';
            if (hondNaam === searchName || stamboomnr === searchName) {
                return hond;
            }
        }
        
        // Zoek in database als niet gevonden in cache
        try {
            const result = await this.db.zoekHonden({ naam: name });
            if (result && result.length > 0) {
                // Voeg gevonden hond toe aan cache
                result.forEach(hond => {
                    this.hondenCache.set(hond.id, hond);
                    if (hond.stamboomnr) {
                        this.hondenCache.set(hond.stamboomnr, hond);
                    }
                });
                return result[0];
            }
        } catch (error) {
            console.error(`Fout bij zoeken hond op naam ${name}:`, error);
        }
        
        return null;
    }
    
    setupAutocomplete(inputId, resultsId, geslacht, onSelect) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId.replace('Search', 'Dropdown'));
        const resultsContainer = document.getElementById(resultsId);
        let activeIndex = -1;
        let currentResults = [];
        
        const showInitialView = () => {
            resultsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${this.t('typeToSearch')}</p>
                </div>
            `;
        };
        
        const displaySearchResults = (filteredHonden) => {
            const t = this.t.bind(this);
            
            if (filteredHonden.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="text-center py-4">
                        <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                    </div>
                `;
                return;
            }
            
            let html = `
                <div class="search-stats">
                    <i class="bi bi-info-circle me-1"></i>
                    ${filteredHonden.length} ${t('found')}
                </div>
            `;
            
            filteredHonden.forEach(dog => {
                const genderText = dog.geslacht === 'reuen' ? this.t('genderReu') : 
                                 dog.geslacht === 'teven' ? this.t('genderTeef') : this.t('unknown');
                
                html += `
                    <div class="dog-result-item" data-id="${dog.id}">
                        <!-- REGEL 1: Naam + Kennelnaam -->
                        <div class="dog-name-line">
                            <span class="dog-name">${dog.naam || this.t('unknown')}</span>
                            ${dog.kennelnaam ? `<span class="text-muted ms-2">${dog.kennelnaam}</span>` : ''}
                        </div>
                        
                        <!-- REGEL 2: Stamboomnummer + Ras + Geslacht - ACHTER ELKAAR -->
                        <div class="dog-details-line">
                            ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                            ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                            <span class="geslacht">${genderText}</span>
                        </div>
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = html;
            
            // Event listeners voor resultaten
            resultsContainer.querySelectorAll('.dog-result-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const hondId = parseInt(item.getAttribute('data-id'));
                    const hond = currentResults.find(d => d.id === hondId);
                    if (hond) {
                        // Markeer als geselecteerd
                        resultsContainer.querySelectorAll('.dog-result-item').forEach(i => {
                            i.classList.remove('selected');
                        });
                        item.classList.add('selected');
                        
                        // Update input
                        const displayName = hond.kennelnaam ? 
                            `${hond.naam} (${hond.kennelnaam})` : 
                            hond.naam;
                        input.value = displayName;
                        
                        // Selecteer hond
                        onSelect(hond);
                    }
                });
            });
        };
        
        // Initial view
        showInitialView();
        
        input.addEventListener('focus', async () => {
            if (this.allHonden.length === 0) {
                await this.loadAllHonden();
            }
        });
        
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length === 0) {
                dropdown.style.display = 'none';
                showInitialView();
                return;
            }
            
            // Filter op geslacht en zoekterm
            let filteredHonden = this.allHonden.filter(hond => {
                if (geslacht === 'teven') {
                    return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                } else if (geslacht === 'reuen') {
                    return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                }
                return true;
            });
            
            // Zoek logica
            if (searchTerm.length >= 1) {
                filteredHonden = filteredHonden.filter(dog => {
                    const naam = dog.naam ? dog.naam.toLowerCase() : '';
                    const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
                    const combined = `${naam} ${kennelnaam}`;
                    return combined.startsWith(searchTerm);
                });
            }
            
            currentResults = filteredHonden;
            
            // Toon resultaten in container
            displaySearchResults(filteredHonden);
            
            // Toon ook dropdown voor autocomplete
            if (filteredHonden.length > 0) {
                dropdown.innerHTML = filteredHonden.map((hond, index) => {
                    const geboortejaar = hond.geboortedatum ? 
                        new Date(hond.geboortedatum).getFullYear() : '?';
                    
                    return `
                        <div class="autocomplete-item ${index === activeIndex ? 'active' : ''}" 
                             data-index="${index}"
                             data-id="${hond.id}">
                            <div class="d-flex justify-content-between align-items-start">
                                <div style="flex: 1;">
                                    <div class="dog-name">${hond.naam || 'Onbekend'}</div>
                                    <div class="dog-details">
                                        ${hond.kennelnaam ? `
                                            <span class="kennel-name">
                                                <i class="bi bi-house-door me-1"></i>${hond.kennelnaam}
                                            </span> • 
                                        ` : ''}
                                        ${hond.ras || this.t('unknownBreed')}
                                        ${hond.stamboomnr ? ` • ${hond.stamboomnr}` : ''}
                                    </div>
                                </div>
                                <div class="text-muted small ms-2" style="white-space: nowrap;">
                                    ${geboortejaar}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                dropdown.style.display = 'block';
                
                // Event listeners voor dropdown
                dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const index = parseInt(item.getAttribute('data-index'));
                        const hond = currentResults[index];
                        if (hond) {
                            const displayName = hond.kennelnaam ? 
                                `${hond.naam} (${hond.kennelnaam})` : 
                                hond.naam;
                            input.value = displayName;
                            dropdown.style.display = 'none';
                            
                            // Selecteer in resultaten container
                            const resultsItems = resultsContainer.querySelectorAll('.dog-result-item');
                            resultsItems.forEach((resultItem, idx) => {
                                resultItem.classList.remove('selected');
                                if (idx === index) {
                                    resultItem.classList.add('selected');
                                }
                            });
                            
                            onSelect(hond);
                        }
                    });
                });
            } else {
                dropdown.style.display = 'none';
            }
        });
        
        input.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.autocomplete-item');
            const resultItems = resultsContainer.querySelectorAll('.dog-result-item');
            
            if (items.length === 0) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    activeIndex = Math.min(activeIndex + 1, items.length - 1);
                    this.updateActiveItem(items, activeIndex);
                    this.updateActiveResultItem(resultItems, activeIndex);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    activeIndex = Math.max(activeIndex - 1, -1);
                    this.updateActiveItem(items, activeIndex);
                    this.updateActiveResultItem(resultItems, activeIndex);
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0 && items[activeIndex]) {
                        const hond = currentResults[activeIndex];
                        if (hond) {
                            const displayName = hond.kennelnaam ? 
                                `${hond.naam} (${hond.kennelnaam})` : 
                                hond.naam;
                            input.value = displayName;
                            dropdown.style.display = 'none';
                            onSelect(hond);
                        }
                    }
                    break;
                    
                case 'Escape':
                    dropdown.style.display = 'none';
                    activeIndex = -1;
                    break;
                    
                case 'Tab':
                    dropdown.style.display = 'none';
                    activeIndex = -1;
                    break;
            }
        });
        
        // Sluit dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                activeIndex = -1;
            }
        });
    }
    
    updateActiveItem(items, activeIndex) {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            if (index === activeIndex) {
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }
    
    updateActiveResultItem(resultItems, activeIndex) {
        resultItems.forEach((item, index) => {
            item.classList.toggle('selected', index === activeIndex);
            if (index === activeIndex) {
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }
    
    selectTeef(hond) {
        this.selectedTeef = hond;
        this.showHondDetails('teefDetails', hond, 'teef');
        this.updateButtonStates();
        this.updateFuturePuppySummary();
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showHondDetails('reuDetails', hond, 'reu');
        this.updateButtonStates();
        this.updateFuturePuppySummary();
    }
    
    async showHondDetails(elementId, hond, type) {
        const t = this.t.bind(this);
        const detailsContainer = document.getElementById(elementId);
        
        // Verberg de zoekresultaten container
        const resultsId = elementId.replace('Details', 'SearchResults');
        const resultsContainer = document.getElementById(resultsId);
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        
        // Toon details container
        detailsContainer.classList.remove('d-none');
        
        // Haal ouders informatie op
        const oudersInfo = await this.getOudersInfo(hond);
        
        detailsContainer.innerHTML = `
            <div class="dog-details-card">
                <div class="dog-details-header">
                    <div class="dog-details-name">${hond.naam || 'Onbekend'}</div>
                    ${hond.kennelnaam ? `<div class="dog-details-subtitle">${hond.kennelnaam}</div>` : ''}
                    
                    <div class="dog-details-info mt-3">
                        ${hond.stamboomnr ? `
                            <div class="info-item">
                                <i class="bi bi-card-checklist"></i>
                                <span>${hond.stamboomnr}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.ras ? `
                            <div class="info-item">
                                <i class="bi bi-tag"></i>
                                <span>${hond.ras}</span>
                            </div>
                        ` : ''}
                        
                        <div class="info-item">
                            <i class="bi bi-gender-${type === 'teef' ? 'female' : 'male'}"></i>
                            <span>${type === 'teef' ? t('genderTeef') : t('genderReu')}</span>
                        </div>
                        
                        ${hond.geboortedatum ? `
                            <div class="info-item">
                                <i class="bi bi-calendar"></i>
                                <span>${new Date(hond.geboortedatum).toLocaleDateString(this.currentLang)}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.vachtkleur ? `
                            <div class="info-item">
                                <i class="bi bi-palette"></i>
                                <span>${hond.vachtkleur}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="dog-details-row">
                    <div class="dog-details-label">${t('parents')}:</div>
                    <div class="dog-details-value">
                        <div class="row">
                            ${oudersInfo.vader ? `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('fatherLabel')}:</strong><br>
                                    ${oudersInfo.vader.naam || 'Onbekend'}
                                    ${oudersInfo.vader.stamboomnr ? `(${oudersInfo.vader.stamboomnr})` : ''}
                                </div>
                            ` : `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('fatherLabel')}:</strong><br>
                                    <span class="text-muted">${t('unknownAncestor')}</span>
                                </div>
                            `}
                            
                            ${oudersInfo.moeder ? `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('motherLabel')}:</strong><br>
                                    ${oudersInfo.moeder.naam || 'Onbekend'}
                                    ${oudersInfo.moeder.stamboomnr ? `(${oudersInfo.moeder.stamboomnr})` : ''}
                                </div>
                            ` : `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('motherLabel')}:</strong><br>
                                    <span class="text-muted">${t('unknownAncestor')}</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                ${hond.heupdysplasie || hond.elleboogdysplasie || hond.patella || hond.ogen || hond.dandyWalker || hond.schildklier ? `
                    <div class="dog-details-row">
                        <div class="dog-details-label">${t('healthInfo')}:</div>
                        <div class="dog-details-value">
                            <div class="row">
                                ${hond.heupdysplasie ? `
                                    <div class="col-md-6 mb-2">
                                        <strong>HD:</strong> ${hond.heupdysplasie}
                                    </div>
                                ` : ''}
                                
                                ${hond.elleboogdysplasie ? `
                                    <div class="col-md-6 mb-2">
                                        <strong>ED:</strong> ${hond.elleboogdysplasie}
                                    </div>
                                ` : ''}
                                
                                ${hond.patella ? `
                                    <div class="col-md-6 mb-2">
                                        <strong>Patella:</strong> ${hond.patella}
                                    </div>
                                ` : ''}
                                
                                ${hond.ogen ? `
                                    <div class="col-md-6 mb-2">
                                        <strong>Ogen:</strong> ${hond.ogen}
                                        ${hond.ogenVerklaring ? `<br><small>${hond.ogenVerklaring}</small>` : ''}
                                    </div>
                                ` : ''}
                                
                                ${hond.dandyWalker ? `
                                    <div class="col-md-6 mb-2">
                                        <strong>Dandy Walker:</strong> ${hond.dandyWalker}
                                    </div>
                                ` : ''}
                                
                                ${hond.schildklier ? `
                                    <div class="col-md-6 mb-2">
                                        <strong>Schildklier:</strong> ${hond.schildklier}
                                        ${hond.schildklierVerklaring ? `<br><small>${hond.schildklierVerklaring}</small>` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="mt-3 pt-3 border-top">
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.reuTeefCombinatie.clearSelection('${elementId}', '${resultsId}')">
                        <i class="bi bi-x-circle me-1"></i> Selectie wissen
                    </button>
                </div>
            </div>
        `;
    }
    
    clearSelection(detailsId, resultsId) {
        const detailsContainer = document.getElementById(detailsId);
        const resultsContainer = document.getElementById(resultsId);
        const inputId = detailsId.replace('Details', 'Search');
        const input = document.getElementById(inputId);
        
        // Reset de selectie
        if (detailsId === 'teefDetails') {
            this.selectedTeef = null;
        } else if (detailsId === 'reuDetails') {
            this.selectedReu = null;
        }
        
        // Wis input
        if (input) {
            input.value = '';
        }
        
        // Verberg details
        detailsContainer.classList.add('d-none');
        detailsContainer.innerHTML = '';
        
        // Toon zoekresultaten opnieuw
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${this.t('typeToSearch')}</p>
                </div>
            `;
        }
        
        this.updateButtonStates();
        this.updateFuturePuppySummary();
    }
    
    async getOudersInfo(hond) {
        const result = { vader: null, moeder: null };
        
        // Zoek vader
        if (hond.vaderId) {
            result.vader = await this.getHondById(hond.vaderId);
        } else if (hond.vader) {
            // Zoek vader op naam of stamboomnummer
            result.vader = await this.findHondByNameOrPedigree(hond.vader);
        }
        
        // Zoek moeder
        if (hond.moederId) {
            result.moeder = await this.getHondById(hond.moederId);
        } else if (hond.moeder) {
            // Zoek moeder op naam of stamboomnummer
            result.moeder = await this.findHondByNameOrPedigree(hond.moeder);
        }
        
        return result;
    }
    
    updateButtonStates() {
        const showFuturePedigreeBtn = document.getElementById('showFuturePedigreeBtn');
        
        // Alleen beschikbaar als beide honden geselecteerd zijn
        const bothSelected = this.selectedTeef && this.selectedReu;
        
        if (showFuturePedigreeBtn) {
            showFuturePedigreeBtn.disabled = !bothSelected;
        }
    }
    
    updateFuturePuppySummary() {
        const futurePuppySummary = document.getElementById('futurePuppySummary');
        
        if (this.selectedTeef && this.selectedReu) {
            // Toon samenvatting
            futurePuppySummary.classList.remove('d-none');
            
            // Update tekst
            const reuNaam = this.selectedReu.naam || '?';
            const teefNaam = this.selectedTeef.naam || '?';
            
            document.getElementById('futurePuppyDescription').textContent = 
                this.t('futurePuppyDescription', { reu: reuNaam, teef: teefNaam });
            
            // Voeg event listener toe aan knop
            const showFuturePedigreeBtn = document.getElementById('showFuturePedigreeBtn');
            if (showFuturePedigreeBtn) {
                showFuturePedigreeBtn.onclick = () => {
                    this.showFuturePuppyPedigree();
                };
            }
        } else {
            // Verberg samenvatting
            futurePuppySummary.classList.add('d-none');
        }
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            if (window.uiHandler && window.uiHandler.modules && window.uiHandler.modules.breeding) {
                window.uiHandler.modules.breeding.loadMainScreen();
            } else if (window.appUI && window.appUI.modules && window.appUI.modules.breeding) {
                window.appUI.modules.breeding.loadMainScreen();
            } else {
                const modal = bootstrap.Modal.getInstance(breedingModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    }
    
    async showFuturePuppyPedigree() {
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert(this.t('selectDogFirst'), 'warning');
            return;
        }
        
        if (!this.stamboomManager) {
            this.showAlert('StamboomManager niet geïnitialiseerd', 'danger');
            return;
        }
        
        // Maak een virtuele toekomstige pup
        const futurePuppy = {
            id: -999, // Speciaal ID voor toekomstige pup
            naam: this.t('futurePuppyName'),
            geslacht: 'onbekend',
            vaderId: this.selectedReu.id,
            moederId: this.selectedTeef.id,
            vader: this.selectedReu.naam,
            moeder: this.selectedTeef.naam,
            kennelnaam: this.t('combinedParents'),
            ras: this.selectedReu.ras || this.selectedTeef.ras || 'Mix',
            stamboomnr: 'VOORSPELD',
            geboortedatum: new Date().toISOString().split('T')[0],
            vachtkleur: `${this.selectedReu.vachtkleur || ''}/${this.selectedTeef.vachtkleur || ''}`.trim(),
            heupdysplasie: this.estimateHealth('heupdysplasie'),
            elleboogdysplasie: this.estimateHealth('elleboogdysplasie'),
            patella: this.estimateHealth('patella'),
            ogen: this.estimateHealth('ogen'),
            dandyWalker: this.estimateHealth('dandyWalker'),
            schildklier: this.estimateHealth('schildklier')
        };
        
        // Haal de complete stamboom op
        try {
            // Maak een aangepaste pedigree tree voor de toekomstige pup
            const pedigreeTree = await this.createFuturePuppyPedigree(futurePuppy);
            
            // Toon de aangepaste modal voor toekomstige pup
            await this.showFuturePuppyPedigreeModal(futurePuppy, pedigreeTree);
            
        } catch (error) {
            console.error('Fout bij tonen toekomstige pup stamboom:', error);
            this.showAlert('Kon toekomstige pup stamboom niet tonen', 'danger');
        }
    }
    
    estimateHealth(healthType) {
        // Eenvoudige schatting gebaseerd op ouders
        const reuValue = this.selectedReu[healthType];
        const teefValue = this.selectedTeef[healthType];
        
        if (!reuValue && !teefValue) return 'Onbekend';
        if (reuValue && !teefValue) return `Gelijk aan vader (${reuValue})`;
        if (!reuValue && teefValue) return `Gelijk aan moeder (${teefValue})`;
        
        // Beide ouders hebben waarden
        return `Gemiddelde van ouders (${reuValue}/${teefValue})`;
    }
    
    async createFuturePuppyPedigree(futurePuppy) {
        // Bouw een virtuele pedigree tree op basis van de geselecteerde ouders
        const tree = {
            mainDog: futurePuppy,
            father: this.selectedReu,
            mother: this.selectedTeef,
            paternalGrandfather: null,
            paternalGrandmother: null,
            maternalGrandfather: null,
            maternalGrandmother: null,
            paternalGreatGrandfather1: null,
            paternalGreatGrandmother1: null,
            paternalGreatGrandfather2: null,
            paternalGreatGrandmother2: null,
            maternalGreatGrandfather1: null,
            maternalGreatGrandmother1: null,
            maternalGreatGrandfather2: null,
            maternalGreatGrandmother2: null
        };
        
        // Haal ouders op voor reu
        const reuParents = await this.getParentsForDog(this.selectedReu);
        tree.paternalGrandfather = reuParents.vader;
        tree.paternalGrandmother = reuParents.moeder;
        
        // Haal ouders op voor teef
        const teefParents = await this.getParentsForDog(this.selectedTeef);
        tree.maternalGrandfather = teefParents.vader;
        tree.maternalGrandmother = teefParents.moeder;
        
        // Haal grootouders op voor reu's vader
        if (reuParents.vader) {
            const reuVaderParents = await this.getParentsForDog(reuParents.vader);
            tree.paternalGreatGrandfather1 = reuVaderParents.vader;
            tree.paternalGreatGrandmother1 = reuVaderParents.moeder;
        }
        
        // Haal grootouders op voor reu's moeder
        if (reuParents.moeder) {
            const reuMoederParents = await this.getParentsForDog(reuParents.moeder);
            tree.paternalGreatGrandfather2 = reuMoederParents.vader;
            tree.paternalGreatGrandmother2 = reuMoederParents.moeder;
        }
        
        // Haal grootouders op voor teef's vader
        if (teefParents.vader) {
            const teefVaderParents = await this.getParentsForDog(teefParents.vader);
            tree.maternalGreatGrandfather1 = teefVaderParents.vader;
            tree.maternalGreatGrandmother1 = teefVaderParents.moeder;
        }
        
        // Haal grootouders op voor teef's moeder
        if (teefParents.moeder) {
            const teefMoederParents = await this.getParentsForDog(teefParents.moeder);
            tree.maternalGreatGrandfather2 = teefMoederParents.vader;
            tree.maternalGreatGrandmother2 = teefMoederParents.moeder;
        }
        
        return tree;
    }
    
    async getParentsForDog(dog) {
        const result = { vader: null, moeder: null };
        
        try {
            // Zoek vader
            if (dog.vaderId) {
                result.vader = await this.getHondById(dog.vaderId);
            }
            
            // Zoek moeder
            if (dog.moederId) {
                result.moeder = await this.getHondById(dog.moederId);
            }
        } catch (error) {
            console.error(`Fout bij ophalen ouders voor hond ${dog.id}:`, error);
        }
        
        return result;
    }
    
    async showFuturePuppyPedigreeModal(futurePuppy, pedigreeTree) {
        // Maak een aangepaste modal voor de toekomstige pup
        const modalId = 'futurePuppyPedigreeModal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal fade';
            modal.tabIndex = -1;
            modal.setAttribute('aria-hidden', 'true');
            
            // GEBRUIK EXACT DEZELFDE HTML ALS STAMBOOMMANAGER
            modal.innerHTML = `
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="futurePuppyPedigreeModalLabel">
                                <i class="bi bi-stars me-2"></i>
                                ${this.t('futurePuppyTitle', { 
                                    reu: this.selectedReu.naam || '?', 
                                    teef: this.selectedTeef.naam || '?' 
                                })}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0" style="overflow: hidden;">
                            <!-- EXACT DEZELFDE STRUCTUUR ALS STAMBOOMMANAGER -->
                            <div class="pedigree-mobile-wrapper">
                                <div class="pedigree-container-compact" id="futurePuppyPedigreeContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-success" role="status">
                                            <span class="visually-hidden">${this.t('loadingPedigree')}</span>
                                        </div>
                                        <p class="mt-3">${this.t('loadingPedigree')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        // Update titel
        const title = this.t('futurePuppyTitle', { 
            reu: this.selectedReu.naam || '?', 
            teef: this.selectedTeef.naam || '?' 
        });
        document.getElementById('futurePuppyPedigreeModalLabel').textContent = title;
        
        // Render de stamboom MET DE JUISTE LAYOUT
        await this.renderFuturePuppyPedigree(pedigreeTree);
        
        // Toon modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        // Voeg print functionaliteit toe
        modal.querySelector('.btn-print').addEventListener('click', () => {
            window.print();
        });
        
        // Voeg de StamboomManager CSS toe aan deze modal
        this.injectStamboomManagerCSS();
    }
    
    injectStamboomManagerCSS() {
        // Zoek de StamboomManager CSS
        const stamboomStyles = document.querySelectorAll('style');
        let foundStamboomCSS = false;
        
        stamboomStyles.forEach(style => {
            if (style.textContent.includes('.pedigree-grid-compact') && 
                style.textContent.includes('.pedigree-card-compact.horizontal')) {
                foundStamboomCSS = true;
            }
        });
        
        // Als StamboomManager CSS niet gevonden is, voeg het toe
        if (!foundStamboomCSS) {
            const style = document.createElement('style');
            style.textContent = `
                /* STAMBOOMMANAGER CSS - EXACT DEZELFDE ALS IN STAMBOOMMANAGER.JS */
                .pedigree-mobile-wrapper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f8f9fa;
                    position: relative;
                    border-radius: 12px;
                }
                
                .pedigree-container-compact {
                    padding: 15px !important;
                    margin: 0 !important;
                    width: 100% !important;
                    background: #f8f9fa;
                    overflow-x: auto !important;
                    overflow-y: auto !important;
                    position: relative;
                    min-height: 0 !important;
                    box-sizing: border-box !important;
                    border-radius: inherit;
                }
                
                .pedigree-grid-compact {
                    display: flex;
                    flex-direction: row;
                    height: auto;
                    min-width: fit-content;
                    padding: 10px 15px !important;
                    gap: 20px;
                    align-items: flex-start;
                    box-sizing: border-box !important;
                    margin: 0 auto;
                }
                
                .pedigree-generation-col {
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    justify-content: flex-start;
                    min-width: 0;
                }
                
                .pedigree-generation-col.gen0 {
                    gap: 4px !important;
                }
                
                .pedigree-generation-col.gen1 {
                    gap: 4px !important;
                }
                
                .pedigree-generation-col.gen2 {
                    gap: 4px !important;
                }
                
                .pedigree-generation-col.gen3 {
                    gap: 4px !important;
                }
                
                .pedigree-card-compact.horizontal {
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin: 0 !important;
                    padding: 0 !important;
                    flex-shrink: 0;
                }
                
                .pedigree-card-compact.horizontal.gen0,
                .pedigree-card-compact.horizontal.gen1,
                .pedigree-card-compact.horizontal.gen2 {
                    width: 160px !important;
                    height: 120px !important;
                }
                
                .pedigree-card-compact.horizontal.gen3 {
                    width: 160px !important;
                    height: 60px !important;
                }
                
                .pedigree-card-compact.horizontal.main-dog-compact {
                    border: 2px solid #0d6efd !important;
                    background: #f0f7ff;
                    width: 170px !important;
                    height: 110px !important;
                }
                
                .pedigree-card-compact.horizontal.male {
                    border-left: 4px solid #0d6efd !important;
                }
                
                .pedigree-card-compact.horizontal.female {
                    border-left: 4px solid #dc3545 !important;
                }
                
                .pedigree-card-compact.horizontal.future-puppy {
                    background: linear-gradient(135deg, #f8fff9 0%, #e8f5e9 100%);
                    border: 2px solid #198754 !important;
                }
                
                .pedigree-card-compact.horizontal.future-puppy .pedigree-card-header-compact.horizontal {
                    background: #198754 !important;
                }
                
                .pedigree-card-compact.horizontal:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
                    transform: translateY(-1px);
                    z-index: 1;
                    position: relative;
                }
                
                .pedigree-card-compact.horizontal.empty {
                    background: #f8f9fa;
                    cursor: default;
                    opacity: 0.6;
                }
                
                .pedigree-card-compact.horizontal.empty:hover {
                    transform: none !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
                }
                
                .pedigree-card-header-compact.horizontal {
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                
                .pedigree-card-compact.horizontal.gen0 .pedigree-card-header-compact.horizontal,
                .pedigree-card-compact.horizontal.gen1 .pedigree-card-header-compact.horizontal,
                .pedigree-card-compact.horizontal.gen2 .pedigree-card-header-compact.horizontal {
                    padding: 5px 8px;
                    font-size: 0.7rem;
                    min-height: 22px;
                }
                
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-header-compact.horizontal {
                    padding: 3px 6px;
                    font-size: 0.56rem;
                    min-height: 16px;
                }
                
                .pedigree-card-header-compact.horizontal.bg-primary {
                    background: #0d6efd !important;
                }
                
                .pedigree-card-header-compact.horizontal.bg-secondary {
                    background: #6c757d !important;
                }
                
                .relation-compact {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    font-weight: 600;
                    overflow: hidden;
                    flex: 1;
                }
                
                .relation-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .main-dot {
                    color: #ffc107;
                    font-size: 0.7rem;
                    flex-shrink: 0;
                }
                
                .gender-icon-compact {
                    flex-shrink: 0;
                    margin-left: 4px;
                }
                
                .pedigree-card-body-compact.horizontal {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex: 1;
                }
                
                .pedigree-card-compact.horizontal.gen0 .pedigree-card-body-compact.horizontal,
                .pedigree-card-compact.horizontal.gen1 .pedigree-card-body-compact.horizontal,
                .pedigree-card-compact.horizontal.gen2 .pedigree-card-body-compact.horizontal {
                    padding: 6px 8px;
                }
                
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-body-compact.horizontal {
                    padding: 4px 6px;
                }
                
                .card-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                }
                
                .card-row-1 {
                    margin-bottom: 2px;
                }
                
                .card-row-2 {
                    margin-bottom: 2px;
                }
                
                .card-row-3 {
                    margin-top: auto;
                }
                
                .dog-name-kennel-compact {
                    font-weight: 600;
                    color: #0d6efd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    width: 100%;
                }
                
                .pedigree-card-compact.horizontal.gen0 .dog-name-kennel-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-name-kennel-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-name-kennel-compact {
                    font-size: 0.75rem;
                }
                
                .pedigree-card-compact.horizontal.gen0 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen0 .dog-breed-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-breed-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-breed-compact {
                    font-size: 0.65rem;
                }
                
                .pedigree-card-compact.horizontal.gen0 .click-hint-compact,
                .pedigree-card-compact.horizontal.gen1 .click-hint-compact,
                .pedigree-card-compact.horizontal.gen2 .click-hint-compact {
                    font-size: 0.55rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .dog-name-kennel-compact {
                    font-size: 0.6rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen3 .dog-breed-compact {
                    font-size: 0.52rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .click-hint-compact {
                    font-size: 0.44rem;
                }
                
                .dog-pedigree-compact {
                    font-weight: 600;
                    color: #495057;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                }
                
                .dog-breed-compact {
                    color: #28a745;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                    text-align: right;
                }
                
                .no-data-text {
                    color: #6c757d;
                    font-style: italic;
                    line-height: 1.3;
                    font-size: 0.7rem;
                }
                
                .click-hint-compact {
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    line-height: 1;
                    width: 100%;
                    padding-top: 2px;
                    border-top: 1px dashed #dee2e6;
                    font-size: 0.55rem;
                }
                
                .generation-label {
                    font-weight: bold;
                    color: #495057;
                    text-align: center;
                    margin-bottom: 8px !important;
                    font-size: 0.75rem;
                    background: #e9ecef;
                    padding: 4px 8px;
                    border-radius: 4px;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                
                @media (max-width: 767px) {
                    .pedigree-container-compact {
                        height: 640px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        padding: 10px !important;
                        -webkit-overflow-scrolling: touch;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .pedigree-grid-compact {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        height: 100% !important;
                        min-width: max-content !important;
                        padding: 10px 15px !important;
                        gap: 15px !important;
                        margin: 0 !important;
                        align-items: stretch !important;
                        box-sizing: border-box !important;
                        width: auto !important;
                    }
                    
                    .pedigree-generation-col {
                        display: flex !important;
                        flex-direction: column !important;
                        height: 100% !important;
                        flex-shrink: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        position: relative;
                        justify-content: center !important;
                        align-items: flex-start !important;
                    }
                    
                    .pedigree-generation-col.gen0 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important;
                        height: 140px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important;
                        height: 70px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important;
                        height: 140px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                }
                
                @media (min-width: 768px) {
                    .pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        align-items: center;
                        padding: 0 !important;
                        display: flex;
                    }
                    
                    .pedigree-grid-compact {
                        flex-direction: row;
                        height: 100%;
                        min-width: fit-content;
                        padding: 0 20px !important;
                        gap: 25px;
                        align-items: center;
                        box-sizing: border-box !important;
                        margin: 0 auto;
                    }
                    
                    .pedigree-generation-col {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        justify-content: center;
                        min-width: 0;
                    }
                    
                    .pedigree-generation-col.gen0 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 {
                        gap: 4px !important;
                        justify-content: center;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 132px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 66px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 132px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .dog-name-kennel-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-name-kennel-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-name-kennel-compact {
                        font-size: 0.8rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen0 .dog-breed-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-breed-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-breed-compact {
                        font-size: 0.7rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .click-hint-compact,
                    .pedigree-card-compact.horizontal.gen1 .click-hint-compact,
                    .pedigree-card-compact.horizontal.gen2 .click-hint-compact {
                        font-size: 0.6rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .dog-name-kennel-compact {
                        font-size: 0.64rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen3 .dog-breed-compact {
                        font-size: 0.56rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .click-hint-compact {
                        font-size: 0.48rem;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
    }
    
    async renderFuturePuppyPedigree(pedigreeTree) {
        const container = document.getElementById('futurePuppyPedigreeContainer');
        if (!container || !this.stamboomManager) return;
        
        // Maak cards voor alle honden
        const cards = [];
        
        // Hoofdhond (toekomstige pup)
        cards.push(this.createFuturePuppyCard(
            pedigreeTree.mainDog, 
            this.t('futurePuppy'), 
            true, 
            0
        ));
        
        // Ouders
        cards.push(await this.createDogCard(pedigreeTree.father, this.t('fatherLabel'), false, 1));
        cards.push(await this.createDogCard(pedigreeTree.mother, this.t('motherLabel'), false, 1));
        
        // Grootouders
        cards.push(await this.createDogCard(pedigreeTree.paternalGrandfather, this.t('grandfatherLabel'), false, 2));
        cards.push(await this.createDogCard(pedigreeTree.paternalGrandmother, this.t('grandmotherLabel'), false, 2));
        cards.push(await this.createDogCard(pedigreeTree.maternalGrandfather, this.t('grandfatherLabel'), false, 2));
        cards.push(await this.createDogCard(pedigreeTree.maternalGrandmother, this.t('grandmotherLabel'), false, 2));
        
        // Overgrootouders
        cards.push(await this.createDogCard(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3));
        cards.push(await this.createDogCard(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3));
        cards.push(await this.createDogCard(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3));
        cards.push(await this.createDogCard(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3));
        cards.push(await this.createDogCard(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3));
        cards.push(await this.createDogCard(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3));
        cards.push(await this.createDogCard(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3));
        cards.push(await this.createDogCard(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3));
        
        // EXACT DEZELFDE HTML ALS STAMBOOMMANAGER
        const gridHTML = `
            <div class="pedigree-grid-compact">
                <!-- Generatie 0: Hoofdhond (Toekomstige Pup) -->
                <div class="pedigree-generation-col gen0">
                    <div class="generation-label" style="background: #198754; color: white;">
                        <i class="bi bi-stars me-1"></i>${this.t('futurePuppy')}
                    </div>
                    ${cards[0]}
                </div>
                
                <!-- Generatie 1: Ouders -->
                <div class="pedigree-generation-col gen1">
                    <div class="generation-label">${this.t('parents')}</div>
                    ${cards[1]}
                    ${cards[2]}
                </div>
                
                <!-- Generatie 2: Grootouders -->
                <div class="pedigree-generation-col gen2">
                    <div class="generation-label">${this.t('grandparents')}</div>
                    ${cards[3]}
                    ${cards[4]}
                    ${cards[5]}
                    ${cards[6]}
                </div>
                
                <!-- Generatie 3: Overgrootouders -->
                <div class="pedigree-generation-col gen3">
                    <div class="generation-label">${this.t('greatGrandparents')}</div>
                    ${cards[7]}
                    ${cards[8]}
                    ${cards[9]}
                    ${cards[10]}
                    ${cards[11]}
                    ${cards[12]}
                    ${cards[13]}
                    ${cards[14]}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        // Voeg click events toe aan ALLE cards, inclusief toekomstige pup
        this.setupFuturePuppyCardClickEvents(pedigreeTree);
    }
    
    createFuturePuppyCard(dog, relation = '', isMainDog = true, generation = 0) {
        const genderIcon = 'bi-stars text-success';
        
        // EXACT DEZELFDE HTML ALS STAMBOOMMANAGER
        return `
            <div class="pedigree-card-compact horizontal future-puppy ${isMainDog ? 'main-dog-compact' : ''} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}"
                 data-has-photos="false"
                 data-is-future-puppy="true">
                <div class="pedigree-card-header-compact horizontal bg-success">
                    <div class="relation-compact">
                        <span class="relation-text">${relation}</span>
                        ${isMainDog ? '<span class="main-dot">★</span>' : ''}
                    </div>
                    <div class="gender-icon-compact">
                        <i class="bi ${genderIcon}"></i>
                    </div>
                </div>
                <div class="pedigree-card-body-compact horizontal">
                    <div class="card-row card-row-1">
                        <div class="dog-name-kennel-compact" title="${dog.naam || this.t('futurePuppyName')}">
                            ${dog.naam || this.t('futurePuppyName')}
                        </div>
                    </div>
                    
                    <div class="card-row card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${dog.ras ? `
                        <div class="dog-breed-compact" title="${dog.ras}">
                            ${dog.ras}
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="card-row card-row-3">
                        <div class="click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    async createDogCard(dog, relation = '', isMainDog = false, generation = 0) {
        if (!dog) {
            return `
                <div class="pedigree-card-compact horizontal empty gen${generation}" data-dog-id="0">
                    <div class="pedigree-card-header-compact horizontal">
                        <div class="relation-compact">${relation}</div>
                    </div>
                    <div class="pedigree-card-body-compact horizontal text-center py-3">
                        <div class="no-data-text">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        // Gebruik StamboomManager voor consistente cards
        return await this.stamboomManager.getDogCompactCardHTML(dog, relation, isMainDog, generation);
    }
    
    setupFuturePuppyCardClickEvents(pedigreeTree) {
        const container = document.getElementById('futurePuppyPedigreeContainer');
        if (!container) return;
        
        const cards = container.querySelectorAll('.pedigree-card-compact.horizontal:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                const isFuturePuppy = card.getAttribute('data-is-future-puppy') === 'true';
                
                if (dogId === 0) return;
                
                if (isFuturePuppy) {
                    await this.showFuturePuppyDetailPopup(pedigreeTree.mainDog, pedigreeTree);
                } else {
                    if (this.stamboomManager) {
                        const dog = this.stamboomManager.getDogById(dogId);
                        if (!dog) return;
                        
                        const relation = card.getAttribute('data-relation') || '';
                        await this.stamboomManager.showDogDetailPopup(dog, relation);
                    }
                }
            });
        });
    }
    
    async showFuturePuppyDetailPopup(futurePuppy, pedigreeTree) {
        const t = this.t.bind(this);
        
        const coiValues = await this.calculateFuturePuppyCOI(pedigreeTree);
        
        const popupHTML = `
            <div class="dog-detail-popup future-puppy-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi bi-stars text-warning me-2"></i>
                        ${futurePuppy.naam || t('futurePuppyName')}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="${t('closePopup')}"></button>
                </div>
                <div class="popup-body">
                    <div class="coi-highlight">
                        <div class="mb-2">
                            <i class="bi bi-calculator me-1"></i>
                            <strong>${t('predictedCOI')}</strong>
                        </div>
                        <div class="coi-value-large">
                            ${coiValues.coi6Gen}% / ${coiValues.coiAllGen}%
                        </div>
                        <div class="small text-muted mt-1">
                            ${t('coi6Gen')} / ${t('coiAllGen')}
                        </div>
                    </div>
                    
                    <div class="parents-combination">
                        <h6><i class="bi bi-gender-male-female me-1"></i> ${t('basedOnParents')}</h6>
                        <div class="info-grid">
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${t('fatherName')}</span>
                                    <span class="info-value">${pedigreeTree.father?.naam || t('unknown')}</span>
                                </div>
                                <div class="info-item info-item-half">
                                    <span class="info-label">${t('motherName')}</span>
                                    <span class="info-value">${pedigreeTree.mother?.naam || t('unknown')}</span>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${t('pedigreeInfo')}</span>
                                    <span class="info-value">${t('generationInfo')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> ${t('predictedPedigree')}</h6>
                        <div class="info-grid">
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${t('pedigreeNumberShort')}:</span>
                                    <span class="info-value">${futurePuppy.stamboomnr || 'VOORSPELD'}</span>
                                </div>
                                <div class="info-item info-item-half">
                                    <span class="info-label">${t('breed')}:</span>
                                    <span class="info-value">${futurePuppy.ras || 'Mix'}</span>
                                </div>
                            </div>
                            
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${t('gender')}:</span>
                                    <span class="info-value">${t('unknown')}</span>
                                </div>
                                <div class="info-item info-item-half">
                                    <span class="info-label">${t('coatColor')}:</span>
                                    <span class="info-value">${futurePuppy.vachtkleur || t('unknown')}</span>
                                </div>
                            </div>
                            
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${t('calculatedCOI')}:</span>
                                    <span class="info-value">
                                        <span style="color: ${this.getCOIColor(coiValues.coi6Gen)}; font-weight: bold;">
                                            ${t('coi6Gen')}: ${coiValues.coi6Gen}%
                                        </span> | 
                                        <span style="color: ${this.getCOIColor(coiValues.coiAllGen)}; font-weight: bold;">
                                            ${t('coiAllGen')}: ${coiValues.coiAllGen}%
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="health-estimation">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${t('estimatedHealth')}</h6>
                        <div class="info-grid">
                            ${futurePuppy.heupdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${t('hipDysplasia')}:</span>
                                    <span class="info-value">${futurePuppy.heupdysplasie}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${futurePuppy.elleboogdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${t('elbowDysplasia')}:</span>
                                    <span class="info-value">${futurePuppy.elleboogdysplasie}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${futurePuppy.patella ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${t('patellaLuxation')}:</span>
                                    <span class="info-value">${futurePuppy.patella}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${futurePuppy.ogen ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${t('eyes')}:</span>
                                    <span class="info-value">${futurePuppy.ogen}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${futurePuppy.dandyWalker ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${t('dandyWalker')}:</span>
                                    <span class="info-value">${futurePuppy.dandyWalker}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${futurePuppy.schildklier ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${t('thyroid')}:</span>
                                    <span class="info-value">${futurePuppy.schildklier}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${t('remarks')}</h6>
                        <div class="remarks-box">
                            ${t('predictedPedigree')} ${t('basedOnParents')}:<br>
                            • ${pedigreeTree.father?.naam || t('unknown')} (${t('fatherLabel')})<br>
                            • ${pedigreeTree.mother?.naam || t('unknown')} (${t('motherLabel')})<br><br>
                            ${t('coiCalculation')}: ${coiValues.coi6Gen}% (6 gen) / ${coiValues.coiAllGen}% (alle gen)
                        </div>
                    </div>
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-success popup-close-btn">
                        <i class="bi bi-check-circle me-1"></i> ${t('closePopup')}
                    </button>
                </div>
            </div>
        `;
        
        this.showCustomPopup(popupHTML);
    }
    
    async calculateFuturePuppyCOI(pedigreeTree) {
        if (this.stamboomManager && this.stamboomManager.calculateCOI) {
            try {
                const fatherCOI = this.stamboomManager.calculateCOI(pedigreeTree.father?.id || 0);
                const motherCOI = this.stamboomManager.calculateCOI(pedigreeTree.mother?.id || 0);
                
                let coi6Gen = 0;
                let coiAllGen = 0;
                
                if (fatherCOI && motherCOI) {
                    coi6Gen = (parseFloat(fatherCOI.coi6Gen || 0) + parseFloat(motherCOI.coi6Gen || 0)) / 2;
                    coiAllGen = (parseFloat(fatherCOI.coiAllGen || 0) + parseFloat(motherCOI.coiAllGen || 0)) / 2;
                }
                
                const parentsRelated = await this.checkParentsRelated(pedigreeTree.father, pedigreeTree.mother);
                if (parentsRelated) {
                    coi6Gen += 6.25;
                    coiAllGen += 12.5;
                }
                
                coi6Gen = Math.min(coi6Gen, 100);
                coiAllGen = Math.min(coiAllGen, 100);
                
                return {
                    coi6Gen: coi6Gen.toFixed(1),
                    coiAllGen: coiAllGen.toFixed(1)
                };
            } catch (error) {
                console.error('Fout bij berekenen toekomstige pup COI:', error);
            }
        }
        
        return {
            coi6Gen: '0.0',
            coiAllGen: '0.0'
        };
    }
    
    async checkParentsRelated(father, mother) {
        if (!father || !mother) return false;
        
        const fatherAncestors = await this.getAncestors(father, 3);
        const motherAncestors = await this.getAncestors(mother, 3);
        
        for (const ancestor of fatherAncestors) {
            if (motherAncestors.includes(ancestor)) {
                return true;
            }
        }
        
        return false;
    }
    
    async getAncestors(dog, generations) {
        const ancestors = new Set();
        
        const collectAncestors = async (currentDog, currentGen) => {
            if (!currentDog || currentGen >= generations) return;
            
            if (currentDog.vaderId) {
                ancestors.add(currentDog.vaderId);
                const father = await this.getHondById(currentDog.vaderId);
                if (father) {
                    await collectAncestors(father, currentGen + 1);
                }
            }
            
            if (currentDog.moederId) {
                ancestors.add(currentDog.moederId);
                const mother = await this.getHondById(currentDog.moederId);
                if (mother) {
                    await collectAncestors(mother, currentGen + 1);
                }
            }
        };
        
        await collectAncestors(dog, 0);
        return Array.from(ancestors);
    }
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    showCustomPopup(popupHTML) {
        const existingOverlay = document.getElementById('customPopupOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        const overlayHTML = `
            <div class="pedigree-popup-overlay" id="customPopupOverlay" style="display: flex;">
                <div class="pedigree-popup-container" id="customPopupContainer">
                    ${popupHTML}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        const overlay = document.getElementById('customPopupOverlay');
        const container = document.getElementById('customPopupContainer');
        
        if (!overlay || !container) return;
        
        const closeButtons = container.querySelectorAll('.btn-close, .popup-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            });
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        });
        
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                    document.removeEventListener('keydown', closeOnEscape);
                }, 300);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    showAlert(message, type = 'info') {
        document.querySelectorAll('.alert-dismissible').forEach(alert => {
            if (alert.parentNode) {
                alert.remove();
            }
        });
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.getElementById('breedingContent');
        if (content) {
            content.insertBefore(alertDiv, content.firstChild);
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    const bsAlert = new bootstrap.Alert(alertDiv);
                    bsAlert.close();
                }
            }, 5000);
        }
    }
}

// Maak het beschikbaar op window object voor inline onclick
window.reuTeefCombinatie = null;

// Export voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}