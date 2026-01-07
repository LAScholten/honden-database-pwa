/**
 * Reu en Teef Combinatie Module - ZELFSTANDIGE VERSIE
 * Voor het maken van fokplannen met specifieke reu en teef
 * MET ZELFDE STAMBOOM LAYOUT ALS STAMBOOMMANAGER
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
        
        // Foto caches
        this.dogHasPhotosCache = new Map();
        this.dogThumbnailsCache = new Map();
        this.fullPhotoCache = new Map();
        
        // COI Calculator instance
        this.coiCalculator = null;
        this.coiCalculatorReady = false;
        this.coiCalculationInProgress = false;
        
        // EIGEN popup systeem
        this.ownPopupContainerId = 'reuteefCombinatiePopup';
        this.ownPopupOverlayId = 'reuteefCombinatiePopupOverlay';
        this.ownPhotoOverlayId = 'reuteefCombinatiePhotoOverlay';
        
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
                showFuturePuppy: "Toon Toekomstige Pup Stamboom",
                futurePuppyName: "Toekomstige Pup",
                close: "Sluiten",
                print: "Afdrukken",
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
                futurePuppyDescription: "Voorspelling van combinatie {reu} × {teef}",
                futurePuppyTitle: "Stamboom voor toekomstige pup uit combinatie {reu} × {teef}",
                predictedPedigree: "Voorspelde stamboom",
                combinedParents: "Combinatie ouders",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Sluiten",
                predictedCoi: "Voorspelde Inteeltcoëfficiënt",
                clickForDetails: "Klik voor details",
                healthInLine: "Gezondheid in de lijn 6 generaties",
                healthCategory: "Gezondheidscategorie",
                motherLine: "Moederlijn",
                fatherLine: "Vaderlijn",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD niet bekend",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED niet bekend",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL niet bekend",
                eyesFree: "Ogen vrij",
                eyesDist: "Ogen Dist",
                eyesOther: "Ogen overig",
                eyesUnknown: "Ogen niet bekend",
                dwlmDnaFree: "Dandy Walker (DNA) vrij",
                dwlmParentsFree: "Dandy Walker (ouders) vrij",
                dwlmUnknown: "Dandy Walker niet bekend",
                thyroidTested: "Schildklier getest",
                thyroidUnknown: "Schildklier niet bekend",
                occurrences: "Aantal keer",
                pedigreeTitle: "Stamboom van {name}",
                pedigree4Gen: "4-generatie stamboom",
                generatingPedigree: "Stamboom genereren...",
                noData: "Geen gegevens",
                unknown: "Onbekend",
                currentDog: "Huidige hond",
                mainDog: "Hoofdhond",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                paternal: "Paternaal",
                maternal: "Maternaal",
                remarks: "Opmerkingen",
                noRemarks: "Geen opmerkingen",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                male: "Reu",
                female: "Teef",
                breed: "Ras",
                gender: "Geslacht",
                coatColor: "Vachtkleur",
                country: "Land",
                zipCode: "Postcode",
                deathDate: "Overlijdensdatum",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                eyesExplanation: "Verklaring ogen",
                thyroidExplanation: "Toelichting schildklier"
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
                showFuturePuppy: "Show Future Puppy Pedigree",
                futurePuppyName: "Future Puppy",
                close: "Close",
                print: "Print",
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
                futurePuppyDescription: "Prediction of combination {father} × {mother}",
                futurePuppyTitle: "Pedigree for future puppy from combination {father} × {mother}",
                predictedPedigree: "Predicted pedigree",
                combinedParents: "Combination parents",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Close",
                predictedCoi: "Predicted Inbreeding Coefficient",
                clickForDetails: "Click for details",
                healthInLine: "Health in the line 6 generations",
                healthCategory: "Health category",
                motherLine: "Mother line",
                fatherLine: "Father line",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD unknown",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED unknown",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL unknown",
                eyesFree: "Eyes free",
                eyesDist: "Eyes Dist",
                eyesOther: "Eyes other",
                eyesUnknown: "Eyes unknown",
                dwlmDnaFree: "Dandy Walker (DNA) free",
                dwlmParentsFree: "Dandy Walker (parents) free",
                dwlmUnknown: "Dandy Walker unknown",
                thyroidTested: "Thyroid tested",
                thyroidUnknown: "Thyroid unknown",
                occurrences: "Occurrences",
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "4-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                noData: "No data",
                unknown: "Unknown",
                currentDog: "Current Dog",
                mainDog: "Main Dog",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents",
                paternal: "Paternal",
                maternal: "Maternaal",
                remarks: "Remarks",
                noRemarks: "No remarks",
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                male: "Male",
                female: "Female",
                breed: "Breed",
                gender: "Gender",
                coatColor: "Coat color",
                country: "Country",
                zipCode: "Zip code",
                deathDate: "Death date",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                eyesExplanation: "Eye explanation",
                thyroidExplanation: "Thyroid explanation"
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
                showFuturePuppy: "Zukünftigen Welpen-Stammbaum Zeigen",
                futurePuppyName: "Zukünftiger Welpe",
                close: "Schließen",
                print: "Drucken",
                loading: "Laden...",
                noDogFound: "Kein Hund gefunden",
                unknownBreed: "Unbekannte Rasse",
                genderTeef: "Hündin",
                genderReu: "Rüde",
                kennel: "Zwingername:",
                pedigreeNumber: "Stammbuchnr:",
                birthDate: "Geburtsdatum:",
                healthInfo: "Health information",
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
                futurePuppyDescription: "Vorhersage der Kombination {father} × {mother}",
                futurePuppyTitle: "Stamboom für zukünftigen Welpen aus Kombination {father} × {mother}",
                predictedPedigree: "Vorhergesagter Stammbaum",
                combinedParents: "Kombination Eltern",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Schließen",
                predictedCoi: "Vorhergesagter Inzuchtkoeffizient",
                clickForDetails: "Klicken für Details",
                healthInLine: "Gesundheit in der Linie 6 Generationen",
                healthCategory: "Gesundheitskategorie",
                motherLine: "Mutterlinie",
                fatherLine: "Vaterlinie",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD unbekannt",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED unbekannt",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL unbekannt",
                eyesFree: "Augen frei",
                eyesDist: "Augen Dist",
                eyesOther: "Augen sonstige",
                eyesUnknown: "Augen unbekannt",
                dwlmDnaFree: "Dandy Walker (DNA) frei",
                dwlmParentsFree: "Dandy Walker (Eltern) vrij",
                dwlmUnknown: "Dandy Walker unbekannt",
                thyroidTested: "Schilddrüse getestet",
                thyroidUnknown: "Schilddrüse unbekannt",
                occurrences: "Anzahl Mal",
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "4-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wordt generiert...",
                noData: "Keine Daten",
                unknown: "Unbekannt",
                currentDog: "Aktueller Hund",
                mainDog: "Haupt-Hund",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                paternal: "Väterlich",
                maternal: "Mütterlich",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbaar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                male: "Rüde",
                female: "Hündin",
                breed: "Rasse",
                gender: "Geslacht",
                coatColor: "Fellfarbe",
                country: "Country",
                zipCode: "Postleitzahl",
                deathDate: "Sterbedatum",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                eyesExplanation: "Augenerklärung",
                thyroidExplanation: "Schilddrüse Erklärung"
            }
        };
    }
    
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        
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
        
        // Reset
        this.selectedTeef = null;
        this.selectedReu = null;
        this.hondenCache.clear();
        
        // Laad honden data
        await this.loadAllHonden();
        
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
                            
                            <div class="search-results-container flex-grow-1 mt-2" id="teefSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="teefDetails" class="d-none"></div>
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
                            
                            <div class="search-results-container flex-grow-1 mt-2" id="reuSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="reuDetails" class="d-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="showPedigreeBtn" disabled>
                <i class="bi bi-diagram-3 me-1"></i> ${t('showFuturePuppy')}
            </button>
        `;
        
        this.addStyles();
        
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('showPedigreeBtn').addEventListener('click', () => {
            this.showFuturePuppyPedigree();
        });
        
        this.setupAutocomplete('teefSearch', 'teefSearchResults', 'teven', (hond) => {
            this.selectTeef(hond);
        });
        
        this.setupAutocomplete('reuSearch', 'reuSearchResults', 'reuen', (hond) => {
            this.selectReu(hond);
        });
        
        this.updateButtonStates();
    }
    
    addStyles() {
        if (!document.querySelector('#reuteef-combinatie-styles')) {
            const style = document.createElement('style');
            style.id = 'reuteef-combinatie-styles';
            style.textContent = `
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
                
                /* EIGEN POPUP STYLES */
                .reuteef-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: reuteefFadeIn 0.3s;
                    overflow-y: auto;
                }
                
                @keyframes reuteefFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .reuteef-popup-container {
                    background: white;
                    border-radius: 12px;
                    max-width: 400px;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: reuteefSlideUp 0.3s;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                    width: calc(100% - 20px);
                    margin: 10px;
                }
                
                @keyframes reuteefSlideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .reuteef-photo-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 10000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    animation: reuteefFadeIn 0.3s;
                }
                
                .dog-detail-popup {
                    width: 100%;
                }
                
                .popup-header {
                    background: #198754;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .popup-title {
                    margin: 0;
                    font-size: 1.1rem;
                }
                
                .popup-body {
                    padding: 20px;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .popup-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #dee2e6;
                    text-align: right;
                    border-radius: 0 0 12px 12px;
                }
                
                .info-section {
                    margin-bottom: 15px;
                }
                
                .info-section h6 {
                    color: #495057;
                    border-bottom: 1px solid #dee2e6;
                    padding-bottom: 5px;
                    margin-bottom: 10px;
                }
                
                .info-grid {
                    font-size: 0.9rem;
                }
                
                .info-row {
                    display: flex;
                    margin-bottom: 8px;
                }
                
                .info-item-half {
                    flex: 1;
                    padding: 0 5px;
                }
                
                .info-item-full {
                    flex: 100%;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    margin-right: 5px;
                }
                
                .info-value {
                    color: #212529;
                }
                
                .health-analysis-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    font-size: 0.8rem;
                }
                
                .health-analysis-table th {
                    background-color: #f8f9fa;
                    padding: 8px;
                    text-align: center;
                    border: 1px solid #dee2e6;
                    font-weight: 600;
                    color: #495057;
                }
                
                .health-analysis-table td {
                    padding: 6px;
                    border: 1px solid #dee2e6;
                    text-align: center;
                }
                
                .health-category {
                    text-align: left;
                    font-weight: 500;
                    padding-left: 8px;
                    background-color: #f8f9fa;
                }
                
                .mother-count {
                    background-color: #fff3cd;
                }
                
                .father-count {
                    background-color: #d1ecf1;
                }
                
                /* PEDIGREE STYLES */
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
                    border: 2px solid #198754 !important;
                    background: #f0fff4;
                    width: 170px !important;
                    height: 110px !important;
                }
                
                .pedigree-card-compact.horizontal.male {
                    border-left: 4px solid #0d6efd !important;
                }
                
                .pedigree-card-compact.horizontal.female {
                    border-left: 4px solid #dc3545 !important;
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
                
                .pedigree-card-header-compact.horizontal {
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                    padding: 5px 8px;
                    font-size: 0.7rem;
                    min-height: 22px;
                }
                
                .pedigree-card-header-compact.horizontal.bg-success {
                    background: #198754 !important;
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
                    padding: 6px 8px;
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
                    font-size: 0.75rem;
                }
                
                .dog-pedigree-compact {
                    font-weight: 600;
                    color: #495057;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                    font-size: 0.65rem;
                }
                
                .dog-breed-compact {
                    color: #28a745;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                    text-align: right;
                    font-size: 0.65rem;
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
                
                .badge-hd { background-color: #dc3545 !important; color: white !important; }
                .badge-ed { background-color: #fd7e14 !important; color: white !important; }
                .badge-pl { background-color: #6f42c1 !important; color: white !important; }
                .badge-eyes { background-color: #20c997 !important; color: white !important; }
                .badge-dandy { background-color: #6610f2 !important; color: white !important; }
                .badge-thyroid { background-color: #e83e8c !important; color: white !important; }
            `;
            document.head.appendChild(style);
        }
    }
    
    async loadAllHonden() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                this.allHonden = await this.db.getHonden();
                console.log(`✅ Geladen: ${this.allHonden.length} honden`);
                
                // Zorg voor consistentie
                this.allHonden = this.allHonden.map(hond => ({
                    ...hond,
                    heupdysplasie: hond.heupdysplasie || '',
                    elleboogdysplasie: hond.elleboogdysplasie || '',
                    patella: hond.patella || '',
                    ogen: hond.ogen || '',
                    ogenVerklaring: hond.ogenVerklaring || '',
                    dandyWalker: hond.dandyWalker || '',
                    schildklier: hond.schildklier || '',
                    schildklierVerklaring: hond.schildklierVerklaring || '',
                    vachtkleur: hond.vachtkleur || '',
                    ras: hond.ras || '',
                    land: hond.land || '',
                    postcode: hond.postcode || '',
                    opmerkingen: hond.opmerkingen || ''
                }));
                
                // Cache
                this.allHonden.forEach(hond => {
                    this.hondenCache.set(hond.id, hond);
                    if (hond.stamboomnr) {
                        this.hondenCache.set(hond.stamboomnr, hond);
                    }
                });
            } else {
                console.error('❌ Database niet beschikbaar');
                this.allHonden = [];
            }
        } catch (error) {
            console.error('❌ Fout bij laden honden:', error);
            this.allHonden = [];
        }
    }
    
    async getHondById(id) {
        if (this.hondenCache.has(id)) {
            return this.hondenCache.get(id);
        }
        
        try {
            const hond = await this.db.getHondById(id);
            if (hond) {
                const volledigeHond = {
                    ...hond,
                    heupdysplasie: hond.heupdysplasie || '',
                    elleboogdysplasie: hond.elleboogdysplasie || '',
                    patella: hond.patella || '',
                    ogen: hond.ogen || '',
                    ogenVerklaring: hond.ogenVerklaring || '',
                    dandyWalker: hond.dandyWalker || '',
                    schildklier: hond.schildklier || '',
                    schildklierVerklaring: hond.schildklierVerklaring || '',
                    vachtkleur: hond.vachtkleur || '',
                    ras: hond.ras || ''
                };
                
                this.hondenCache.set(id, volledigeHond);
                if (volledigeHond.stamboomnr) {
                    this.hondenCache.set(volledigeHond.stamboomnr, volledigeHond);
                }
                
                const existsInAllHonden = this.allHonden.some(dog => dog.id === id);
                if (!existsInAllHonden) {
                    this.allHonden.push(volledigeHond);
                }
                return volledigeHond;
            }
            return null;
        } catch (error) {
            console.error(`❌ Fout bij ophalen hond ${id}:`, error);
            return null;
        }
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
                        <div class="dog-name-line">
                            <span class="dog-name">${dog.naam || this.t('unknown')}</span>
                            ${dog.kennelnaam ? `<span class="text-muted ms-2">${dog.kennelnaam}</span>` : ''}
                        </div>
                        
                        <div class="dog-details-line">
                            ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                            ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                            <span class="geslacht">${genderText}</span>
                        </div>
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = html;
            
            resultsContainer.querySelectorAll('.dog-result-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const hondId = parseInt(item.getAttribute('data-id'));
                    const hond = currentResults.find(d => d.id === hondId);
                    if (hond) {
                        resultsContainer.querySelectorAll('.dog-result-item').forEach(i => {
                            i.classList.remove('selected');
                        });
                        item.classList.add('selected');
                        
                        const displayName = hond.kennelnaam ? 
                            `${hond.naam} (${hond.kennelnaam})` : 
                            hond.naam;
                        input.value = displayName;
                        
                        onSelect(hond);
                    }
                });
            });
        };
        
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
            
            let filteredHonden = this.allHonden.filter(hond => {
                if (geslacht === 'teven') {
                    return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                } else if (geslacht === 'reuen') {
                    return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                }
                return true;
            });
            
            if (searchTerm.length >= 1) {
                filteredHonden = filteredHonden.filter(dog => {
                    const naam = dog.naam ? dog.naam.toLowerCase() : '';
                    const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
                    const combined = `${naam} ${kennelnaam}`;
                    return combined.includes(searchTerm);
                });
            }
            
            currentResults = filteredHonden.slice(0, 50); // Beperk tot 50 resultaten
            displaySearchResults(currentResults);
            
            if (filteredHonden.length > 0) {
                dropdown.innerHTML = filteredHonden.slice(0, 10).map((hond, index) => {
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
                
                dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const index = parseInt(item.getAttribute('data-index'));
                        const hond = filteredHonden[index];
                        if (hond) {
                            const displayName = hond.kennelnaam ? 
                                `${hond.naam} (${hond.kennelnaam})` : 
                                hond.naam;
                            input.value = displayName;
                            dropdown.style.display = 'none';
                            
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
            }
        });
        
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
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showHondDetails('reuDetails', hond, 'reu');
        this.updateButtonStates();
    }
    
    async showHondDetails(elementId, hond, type) {
        const t = this.t.bind(this);
        const detailsContainer = document.getElementById(elementId);
        
        const resultsId = elementId.replace('Details', 'SearchResults');
        const resultsContainer = document.getElementById(resultsId);
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        
        detailsContainer.classList.remove('d-none');
        
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
        
        if (detailsId === 'teefDetails') {
            this.selectedTeef = null;
        } else if (detailsId === 'reuDetails') {
            this.selectedReu = null;
        }
        
        if (input) {
            input.value = '';
        }
        
        detailsContainer.classList.add('d-none');
        detailsContainer.innerHTML = '';
        
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
    }
    
    async getOudersInfo(hond) {
        const result = { vader: null, moeder: null };
        
        if (hond.vaderId) {
            result.vader = await this.getHondById(hond.vaderId);
        }
        
        if (hond.moederId) {
            result.moeder = await this.getHondById(hond.moederId);
        }
        
        return result;
    }
    
    updateButtonStates() {
        const showPedigreeBtn = document.getElementById('showPedigreeBtn');
        
        const bothSelected = this.selectedTeef && this.selectedReu;
        
        if (showPedigreeBtn) {
            showPedigreeBtn.disabled = !bothSelected;
            showPedigreeBtn.title = bothSelected ? '' : this.t('selectDogFirst');
        }
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            const modal = bootstrap.Modal.getInstance(breedingModal);
            if (modal) {
                modal.hide();
            }
        }
    }
    
    async showFuturePuppyPedigree() {
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert(this.t('selectDogFirst'), 'warning');
            return;
        }
        
        if (this.coiCalculationInProgress) {
            console.log('⚠️ COI berekening al bezig');
            return;
        }
        
        this.coiCalculationInProgress = true;
        
        try {
            // Creëer toekomstige pup
            const futurePuppy = {
                id: -999999,
                naam: this.t('futurePuppyName'),
                geslacht: 'onbekend',
                vaderId: this.selectedReu.id,
                moederId: this.selectedTeef.id,
                vader: this.selectedReu.naam,
                moeder: this.selectedTeef.naam,
                kennelnaam: this.t('combinedParents'),
                stamboomnr: 'VOORSPELD',
                geboortedatum: new Date().toISOString().split('T')[0],
                vachtkleur: `${this.selectedReu.vachtkleur || ''}/${this.selectedTeef.vachtkleur || ''}`.trim(),
                heupdysplasie: null,
                elleboogdysplasie: null,
                patella: null,
                ogen: null,
                ogenVerklaring: null,
                dandyWalker: null,
                schildklier: null,
                schildklierVerklaring: null,
                land: null,
                postcode: null,
                opmerkingen: null
            };
            
            // Bereken COI (als COICalculator beschikbaar is)
            let coiResult = { coi6Gen: '0.0', coiAllGen: '0.0' };
            let healthAnalysis = { motherLine: { total: 0, counts: {} }, fatherLine: { total: 0, counts: {} } };
            
            try {
                if (typeof COICalculator !== 'undefined') {
                    const tempCOICalculator = new COICalculator([...this.allHonden, futurePuppy]);
                    coiResult = tempCOICalculator.calculateCOI(futurePuppy.id);
                    console.log('✅ COI berekend:', coiResult);
                }
                
                // Bereken gezondheidsanalyse
                healthAnalysis = await this.analyzeHealthInLine(futurePuppy);
                console.log('✅ Gezondheidsanalyse klaar');
                
            } catch (calcError) {
                console.warn('⚠️ COI berekening niet beschikbaar:', calcError);
            }
            
            // Toon stamboom
            await this.createFuturePuppyModal(futurePuppy, coiResult, healthAnalysis);
            
        } catch (error) {
            console.error('❌ Fout bij tonen toekomstige pup stamboom:', error);
            this.showAlert('Kon stamboom niet genereren. Probeer opnieuw.', 'danger');
        } finally {
            this.coiCalculationInProgress = false;
        }
    }
    
    async analyzeHealthInLine(futurePuppy) {
        const analysis = {
            motherLine: { total: 0, counts: {} },
            fatherLine: { total: 0, counts: {} }
        };
        
        const healthItems = [
            { key: 'hd_a', label: this.t('hdA') },
            { key: 'hd_b', label: this.t('hdB') },
            { key: 'hd_c', label: this.t('hdC') },
            { key: 'hd_d', label: this.t('hdD') },
            { key: 'hd_e', label: this.t('hdE') },
            { key: 'hd_unknown', label: this.t('hdUnknown') },
            
            { key: 'ed_0', label: this.t('ed0') },
            { key: 'ed_1', label: this.t('ed1') },
            { key: 'ed_2', label: this.t('ed2') },
            { key: 'ed_3', label: this.t('ed3') },
            { key: 'ed_unknown', label: this.t('edUnknown') },
            
            { key: 'pl_0', label: this.t('pl0') },
            { key: 'pl_1', label: this.t('pl1') },
            { key: 'pl_2', label: this.t('pl2') },
            { key: 'pl_3', label: this.t('pl3') },
            { key: 'pl_unknown', label: this.t('plUnknown') },
            
            { key: 'eyes_free', label: this.t('eyesFree') },
            { key: 'eyes_dist', label: this.t('eyesDist') },
            { key: 'eyes_other', label: this.t('eyesOther') },
            { key: 'eyes_unknown', label: this.t('eyesUnknown') },
            
            { key: 'dwlm_dna_free', label: this.t('dwlmDnaFree') },
            { key: 'dwlm_parents_free', label: this.t('dwlmParentsFree') },
            { key: 'dwlm_unknown', label: this.t('dwlmUnknown') },
            
            { key: 'thyroid_tested', label: this.t('thyroidTested') },
            { key: 'thyroid_unknown', label: this.t('thyroidUnknown') }
        ];
        
        healthItems.forEach(item => {
            analysis.motherLine.counts[item.key] = 0;
            analysis.fatherLine.counts[item.key] = 0;
        });
        
        const motherAncestors = await this.collectAncestorsFromParent(this.selectedTeef, 6);
        const fatherAncestors = await this.collectAncestorsFromParent(this.selectedReu, 6);
        
        console.log(`📊 Moederlijn: ${motherAncestors.length}, Vaderlijn: ${fatherAncestors.length}`);
        
        for (const ancestor of motherAncestors) {
            analysis.motherLine.total++;
            this.updateHealthCounts(analysis.motherLine.counts, ancestor);
        }
        
        for (const ancestor of fatherAncestors) {
            analysis.fatherLine.total++;
            this.updateHealthCounts(analysis.fatherLine.counts, ancestor);
        }
        
        return analysis;
    }
    
    async collectAncestorsFromParent(parentDog, generations) {
        const ancestors = [];
        const queue = [{ dog: parentDog, generation: 1 }];
        const visited = new Set();
        
        while (queue.length > 0) {
            const { dog: currentDog, generation } = queue.shift();
            
            if (!currentDog || visited.has(currentDog.id) || generation > generations) {
                continue;
            }
            
            visited.add(currentDog.id);
            ancestors.push(currentDog);
            
            if (currentDog.vaderId) {
                const father = await this.getHondById(currentDog.vaderId);
                if (father) {
                    queue.push({ dog: father, generation: generation + 1 });
                }
            }
            
            if (currentDog.moederId) {
                const mother = await this.getHondById(currentDog.moederId);
                if (mother) {
                    queue.push({ dog: mother, generation: generation + 1 });
                }
            }
        }
        
        return ancestors;
    }
    
    updateHealthCounts(counts, ancestor) {
        if (ancestor.heupdysplasie) {
            const hdKey = this.getHDKey(ancestor.heupdysplasie);
            if (hdKey) counts[hdKey]++;
        } else {
            counts['hd_unknown']++;
        }
        
        if (ancestor.elleboogdysplasie) {
            const edKey = this.getEDKey(ancestor.elleboogdysplasie);
            if (edKey) counts[edKey]++;
        } else {
            counts['ed_unknown']++;
        }
        
        if (ancestor.patella) {
            const plKey = this.getPLKey(ancestor.patella);
            if (plKey) counts[plKey]++;
        } else {
            counts['pl_unknown']++;
        }
        
        if (ancestor.ogen) {
            const eyesKey = this.getEyesKey(ancestor.ogen);
            if (eyesKey) counts[eyesKey]++;
        } else {
            counts['eyes_unknown']++;
        }
        
        if (ancestor.dandyWalker) {
            const dwlmKey = this.getDWLMKey(ancestor.dandyWalker);
            if (dwlmKey) counts[dwlmKey]++;
        } else {
            counts['dwlm_unknown']++;
        }
        
        if (ancestor.schildklier) {
            counts['thyroid_tested']++;
        } else {
            counts['thyroid_unknown']++;
        }
    }
    
    getHDKey(hdValue) {
        const hd = (hdValue || '').toLowerCase().trim();
        if (hd.includes('a')) return 'hd_a';
        if (hd.includes('b')) return 'hd_b';
        if (hd.includes('c')) return 'hd_c';
        if (hd.includes('d')) return 'hd_d';
        if (hd.includes('e')) return 'hd_e';
        return null;
    }
    
    getEDKey(edValue) {
        const ed = (edValue || '').toLowerCase().trim();
        if (ed.includes('0')) return 'ed_0';
        if (ed.includes('1')) return 'ed_1';
        if (ed.includes('2')) return 'ed_2';
        if (ed.includes('3')) return 'ed_3';
        return null;
    }
    
    getPLKey(plValue) {
        const pl = (plValue || '').toLowerCase().trim();
        if (pl.includes('0')) return 'pl_0';
        if (pl.includes('1')) return 'pl_1';
        if (pl.includes('2')) return 'pl_2';
        if (pl.includes('3')) return 'pl_3';
        return null;
    }
    
    getEyesKey(eyesValue) {
        const eyes = (eyesValue || '').toLowerCase().trim();
        if (eyes.includes('vrij') || eyes.includes('free')) return 'eyes_free';
        if (eyes.includes('dist')) return 'eyes_dist';
        return 'eyes_other';
    }
    
    getDWLMKey(dwlmValue) {
        const dwlm = (dwlmValue || '').toLowerCase().trim();
        if (dwlm.includes('dna')) return 'dwlm_dna_free';
        if (dwlm.includes('ouders') || dwlm.includes('parents')) return 'dwlm_parents_free';
        return null;
    }
    
    async createFuturePuppyModal(futurePuppy, coiResult, healthAnalysis) {
        const modalId = 'futurePuppyModal';
        
        // Verwijder bestaande modal
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
        
        const title = this.t('futurePuppyTitle', { 
            reu: this.selectedReu.naam || '?', 
            teef: this.selectedTeef.naam || '?' 
        });
        
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="futurePuppyModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="futurePuppyModalLabel">
                                <i class="bi bi-diagram-3 me-2"></i> ${title}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0" style="overflow: hidden;">
                            <div class="pedigree-mobile-wrapper" id="futurePuppyMobileWrapper">
                                <div class="pedigree-container-compact" id="futurePuppyContainer">
                                    <!-- Hier komt de stamboom -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        // Render stamboom DIRECT
        await this.renderFuturePuppyPedigree(futurePuppy, coiResult, healthAnalysis);
        
        // Setup events
        this.setupFuturePuppyModalEvents(futurePuppy, coiResult, healthAnalysis);
    }
    
    async renderFuturePuppyPedigree(futurePuppy, coiResult, healthAnalysis) {
        const container = document.getElementById('futurePuppyContainer');
        if (!container) return;
        
        try {
            // Bouw stamboom
            const pedigreeTree = this.buildFuturePuppyPedigreeTree(futurePuppy);
            
            // Genereer cards
            const mainDogCard = this.generateDogCard(pedigreeTree.mainDog, this.t('mainDog'), true, 0);
            const fatherCard = this.generateDogCard(pedigreeTree.father, this.t('fatherLabel'), false, 1);
            const motherCard = this.generateDogCard(pedigreeTree.mother, this.t('motherLabel'), false, 1);
            
            const paternalGrandfatherCard = this.generateDogCard(pedigreeTree.paternalGrandfather, this.t('grandfatherLabel'), false, 2);
            const paternalGrandmotherCard = this.generateDogCard(pedigreeTree.paternalGrandmother, this.t('grandmotherLabel'), false, 2);
            const maternalGrandfatherCard = this.generateDogCard(pedigreeTree.maternalGrandfather, this.t('grandfatherLabel'), false, 2);
            const maternalGrandmotherCard = this.generateDogCard(pedigreeTree.maternalGrandmother, this.t('grandmotherLabel'), false, 2);
            
            const paternalGreatGrandfather1Card = this.generateDogCard(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3);
            const paternalGreatGrandmother1Card = this.generateDogCard(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3);
            const paternalGreatGrandfather2Card = this.generateDogCard(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3);
            const paternalGreatGrandmother2Card = this.generateDogCard(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3);
            const maternalGreatGrandfather1Card = this.generateDogCard(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3);
            const maternalGreatGrandmother1Card = this.generateDogCard(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3);
            const maternalGreatGrandfather2Card = this.generateDogCard(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3);
            const maternalGreatGrandmother2Card = this.generateDogCard(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3);
            
            const gridHTML = `
                <div class="pedigree-grid-compact">
                    <!-- Generatie 0: Toekomstige Pup -->
                    <div class="pedigree-generation-col gen0">
                        <div class="generation-label" style="background: #198754; color: white;">
                            <i class="bi bi-stars me-1"></i>${this.t('futurePuppyName')}
                        </div>
                        ${mainDogCard}
                    </div>
                    
                    <!-- Generatie 1: Ouders -->
                    <div class="pedigree-generation-col gen1">
                        <div class="generation-label">${this.t('parents')}</div>
                        ${fatherCard}
                        ${motherCard}
                    </div>
                    
                    <!-- Generatie 2: Grootouders -->
                    <div class="pedigree-generation-col gen2">
                        <div class="generation-label">${this.t('grandparents')}</div>
                        ${paternalGrandfatherCard}
                        ${paternalGrandmotherCard}
                        ${maternalGrandfatherCard}
                        ${maternalGrandmotherCard}
                    </div>
                    
                    <!-- Generatie 3: Overgrootouders -->
                    <div class="pedigree-generation-col gen3">
                        <div class="generation-label">${this.t('greatGrandparents')}</div>
                        ${paternalGreatGrandfather1Card}
                        ${paternalGreatGrandmother1Card}
                        ${paternalGreatGrandfather2Card}
                        ${paternalGreatGrandmother2Card}
                        ${maternalGreatGrandfather1Card}
                        ${maternalGreatGrandmother1Card}
                        ${maternalGreatGrandfather2Card}
                        ${maternalGreatGrandmother2Card}
                    </div>
                </div>
            `;
            
            container.innerHTML = gridHTML;
            
            // Voeg click handlers toe
            this.setupCardClickHandlers(futurePuppy, coiResult, healthAnalysis);
            
        } catch (error) {
            console.error('❌ Fout bij renderen stamboom:', error);
            container.innerHTML = `
                <div class="alert alert-danger m-3">
                    <i class="bi bi-exclamation-triangle"></i>
                    Fout bij laden stamboom: ${error.message}
                </div>
            `;
        }
    }
    
    buildFuturePuppyPedigreeTree(futurePuppy) {
        const pedigreeTree = {
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
        
        // Vul stamboom
        if (this.selectedReu && this.selectedReu.vaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(this.selectedReu.vaderId);
        }
        
        if (this.selectedReu && this.selectedReu.moederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(this.selectedReu.moederId);
        }
        
        if (this.selectedTeef && this.selectedTeef.vaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(this.selectedTeef.vaderId);
        }
        
        if (this.selectedTeef && this.selectedTeef.moederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(this.selectedTeef.moederId);
        }
        
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.vaderId) {
            pedigreeTree.paternalGreatGrandfather1 = this.getDogById(pedigreeTree.paternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.moederId) {
            pedigreeTree.paternalGreatGrandmother1 = this.getDogById(pedigreeTree.paternalGrandfather.moederId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.vaderId) {
            pedigreeTree.paternalGreatGrandfather2 = this.getDogById(pedigreeTree.paternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.moederId) {
            pedigreeTree.paternalGreatGrandmother2 = this.getDogById(pedigreeTree.paternalGrandmother.moederId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.vaderId) {
            pedigreeTree.maternalGreatGrandfather1 = this.getDogById(pedigreeTree.maternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.moederId) {
            pedigreeTree.maternalGreatGrandmother1 = this.getDogById(pedigreeTree.maternalGrandfather.moederId);
        }
        
        if (pedigreeTree.maternalGrandmother && pedigreeTree.maternalGrandmother.vaderId) {
            pedigreeTree.maternalGreatGrandfather2 = this.getDogById(pedigreeTree.maternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.maternalGrandmother && pedigreeTree.maternalGrandmother.moederId) {
            pedigreeTree.maternalGreatGrandmother2 = this.getDogById(pedigreeTree.maternalGrandmother.moederId);
        }
        
        return pedigreeTree;
    }
    
    generateDogCard(dog, relation, isMainDog = false, generation = 0) {
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
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-success' : 'bg-secondary';

        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        const breedText = dog.ras && dog.id !== -999999 ? 
                         `<div class="dog-breed-compact" title="${dog.ras}">${dog.ras}</div>` : '';
        
        return `
            <div class="pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}">
                <div class="pedigree-card-header-compact horizontal ${headerColor}">
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
                        <div class="dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <div class="card-row card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${breedText}
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
    
    setupCardClickHandlers(futurePuppy, coiResult, healthAnalysis) {
        const cards = document.querySelectorAll('.pedigree-card-compact.horizontal:not(.empty)');
        
        cards.forEach(card => {
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            newCard.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const dogId = parseInt(newCard.getAttribute('data-dog-id'));
                
                if (dogId === -999999) {
                    // Toekomstige pup
                    this.showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis);
                } else if (dogId > 0) {
                    // Normale hond
                    const dog = this.getDogById(dogId);
                    if (dog) {
                        const relation = newCard.getAttribute('data-relation') || '';
                        await this.showDogDetailPopup(dog, relation);
                    }
                }
            });
        });
    }
    
    setupFuturePuppyModalEvents(futurePuppy, coiResult, healthAnalysis) {
        const modal = document.getElementById('futurePuppyModal');
        if (!modal) return;
        
        const printBtn = modal.querySelector('.btn-print');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
    
    showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis) {
        const coi6Color = this.getCOIColor(coiResult.coi6Gen);
        const coiAllColor = this.getCOIColor(coiResult.coiAllGen);
        
        const healthAnalysisHTML = this.generateHealthAnalysisHTML(healthAnalysis);
        
        const popupHTML = `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi bi-stars me-2" style="color: #ffc107;"></i>
                        ${this.t('futurePuppyName')}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="${this.t('close')}"></button>
                </div>
                <div class="popup-body">
                    <div class="info-section mb-4">
                        <h6><i class="bi bi-calculator me-1"></i> ${this.t('predictedCoi')}</h6>
                        <div class="info-grid">
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coi6Gen')}:</span>
                                    <span class="info-value coi-value" style="color: ${coi6Color}; font-weight: bold;">
                                        ${coiResult.coi6Gen}%
                                    </span>
                                </div>
                                
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coiAllGen')}:</span>
                                    <span class="info-value coi-value" style="color: ${coiAllColor}; font-weight: bold;">
                                        ${coiResult.coiAllGen}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section mb-4">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInLine')}</h6>
                        ${healthAnalysisHTML}
                    </div>
                    
                    <div class="info-section mb-2">
                        <div class="alert alert-info mb-0">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>${this.t('predictedPedigree')}</strong><br>
                            ${this.t('futurePuppyDescription', { 
                                reu: this.selectedReu.naam || '?', 
                                teef: this.selectedTeef.naam || '?' 
                            })}
                        </div>
                    </div>
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
        
        // Toon popup
        this.showOwnPopup(popupHTML);
    }
    
    showOwnPopup(contentHTML) {
        // Verwijder bestaande
        const existingOverlay = document.getElementById(this.ownPopupOverlayId);
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Maak nieuwe
        const overlay = document.createElement('div');
        overlay.className = 'reuteef-popup-overlay';
        overlay.id = this.ownPopupOverlayId;
        
        const container = document.createElement('div');
        container.className = 'reuteef-popup-container';
        container.id = this.ownPopupContainerId;
        container.innerHTML = contentHTML;
        
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // Voeg event listeners toe
        const closeBtn = container.querySelector('.btn-close');
        const closeBtn2 = container.querySelector('.popup-close-btn');
        
        const closePopup = () => {
            overlay.style.display = 'none';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
            document.removeEventListener('keydown', escapeHandler);
        };
        
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closePopup();
            }
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closePopup);
        if (closeBtn2) closeBtn2.addEventListener('click', closePopup);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closePopup();
            }
        });
        
        document.addEventListener('keydown', escapeHandler);
    }
    
    getDogById(id) {
        return this.allHonden.find(dog => dog.id === id);
    }
    
    async showDogDetailPopup(dog, relation) {
        if (!dog) return;
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        let coiValues = { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const headerText = combinedName + kennelSuffix;
        
        const popupHTML = `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${headerText}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="${this.t('close')}"></button>
                </div>
                <div class="popup-body">
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> ${this.t('dogDetails')}</h6>
                        <div class="info-grid">
                            <div class="info-row">
                                ${dog.stamboomnr ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('pedigreeNumber')}:</span>
                                    <span class="info-value">${dog.stamboomnr}</span>
                                </div>
                                ` : ''}
                                
                                ${dog.ras ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('breed')}:</span>
                                    <span class="info-value">${dog.ras}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('gender')}:</span>
                                    <span class="info-value">${genderText}</span>
                                </div>
                                
                                ${dog.vachtkleur ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coatColor')}:</span>
                                    <span class="info-value">${dog.vachtkleur}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            ${dog.geboortedatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('birthDate')}:</span>
                                    <span class="info-value">${this.formatDate(dog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${dog.opmerkingen ? `
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
        
        this.showOwnPopup(popupHTML);
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        } catch {
            return dateString;
        }
    }
    
    getHealthBadge(value, type) {
        if (!value || value === '') {
            return `<span class="badge bg-secondary">${this.t('unknown')}</span>`;
        }
        
        let badgeClass = 'badge ';
        switch(type) {
            case 'hip': badgeClass += 'badge-hd'; break;
            case 'elbow': badgeClass += 'badge-ed'; break;
            case 'patella': badgeClass += 'badge-pl'; break;
            case 'eyes': badgeClass += 'badge-eyes'; break;
            case 'dandy': badgeClass += 'badge-dandy'; break;
            case 'thyroid': badgeClass += 'badge-thyroid'; break;
            default: badgeClass += 'bg-secondary';
        }
        
        return `<span class="${badgeClass}">${value}</span>`;
    }
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    generateHealthAnalysisHTML(analysis) {
        const t = this.t.bind(this);
        
        const healthItems = [
            { key: 'hd_a', label: t('hdA') },
            { key: 'hd_b', label: t('hdB') },
            { key: 'hd_c', label: t('hdC') },
            { key: 'hd_d', label: t('hdD') },
            { key: 'hd_e', label: t('hdE') },
            { key: 'hd_unknown', label: t('hdUnknown') },
            
            { key: 'ed_0', label: t('ed0') },
            { key: 'ed_1', label: t('ed1') },
            { key: 'ed_2', label: t('ed2') },
            { key: 'ed_3', label: t('ed3') },
            { key: 'ed_unknown', label: t('edUnknown') },
            
            { key: 'pl_0', label: t('pl0') },
            { key: 'pl_1', label: t('pl1') },
            { key: 'pl_2', label: t('pl2') },
            { key: 'pl_3', label: t('pl3') },
            { key: 'pl_unknown', label: t('plUnknown') },
            
            { key: 'eyes_free', label: t('eyesFree') },
            { key: 'eyes_dist', label: t('eyesDist') },
            { key: 'eyes_other', label: t('eyesOther') },
            { key: 'eyes_unknown', label: t('eyesUnknown') },
            
            { key: 'dwlm_dna_free', label: t('dwlmDnaFree') },
            { key: 'dwlm_parents_free', label: t('dwlmParentsFree') },
            { key: 'dwlm_unknown', label: t('dwlmUnknown') },
            
            { key: 'thyroid_tested', label: t('thyroidTested') },
            { key: 'thyroid_unknown', label: t('thyroidUnknown') }
        ];
        
        let tableRows = '';
        healthItems.forEach(item => {
            const motherCount = analysis.motherLine.counts[item.key] || 0;
            const fatherCount = analysis.fatherLine.counts[item.key] || 0;
            
            const motherClass = motherCount > 0 ? (motherCount > 2 ? 'count-high' : 'count-good') : '';
            const fatherClass = fatherCount > 0 ? (fatherCount > 2 ? 'count-high' : 'count-good') : '';
            
            tableRows += `
                <tr>
                    <td class="health-category">${item.label}</td>
                    <td class="mother-count ${motherClass}">${motherCount}</td>
                    <td class="father-count ${fatherClass}">${fatherCount}</td>
                </tr>
            `;
        });
        
        tableRows += `
            <tr style="border-top: 2px solid #dee2e6;">
                <td class="health-category"><strong>Totaal voorouders:</strong></td>
                <td class="mother-count"><strong>${analysis.motherLine.total}</strong></td>
                <td class="father-count"><strong>${analysis.fatherLine.total}</strong></td>
            </tr>
        `;
        
        return `
            <div class="mb-3">
                <table class="health-analysis-table">
                    <thead>
                        <tr>
                            <th>${t('healthCategory')}</th>
                            <th>${t('motherLine')}</th>
                            <th>${t('fatherLine')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
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

window.reuTeefCombinatie = new ReuTeefCombinatie();