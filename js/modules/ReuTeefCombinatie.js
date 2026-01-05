/**
 * Reu en Teef Combinatie Module
 * Voor het maken van fokplannen met specifieke reu en teef
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = [];
        this.familieDataCache = new Map(); // Cache voor familie data
        this.hondenCache = new Map(); // Cache voor individuele honden
        
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
                inDevelopment: "Deze functie is momenteel in ontwikkeling",
                devMessage: "De volledige functionaliteit voor reu en teef combinatie zal binnenkort beschikbaar zijn.",
                back: "Terug",
                save: "Toekomstige Stamboom Tonen",
                showPedigree: "Toon Stamboom",
                pedigreeTitle: "Toekomstige Stamboom - Voorspelling",
                pedigreeInfo: "Dit is een voorspelde stamboom op basis van de geselecteerde reu en teef:",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                motherSide: "Moeders kant",
                fatherSide: "Vaders kant",
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
                selectDogFirst: "Selecteer eerst een hond",
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
                found: "gevonden"
            },
            en: {
                title: "Male and Female Combination",
                description: "Select a specific male and female for your breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select a female...",
                father: "Male (Father)",
                selectFather: "Select a male...",
                searchPlaceholder: "Type to search...",
                inDevelopment: "This feature is currently in development",
                devMessage: "The full functionality for male and female combination will be available soon.",
                back: "Back",
                save: "Show Future Pedigree",
                showPedigree: "Show Pedigree",
                pedigreeTitle: "Future Pedigree - Prediction",
                pedigreeInfo: "This is a predicted pedigree based on the selected male and female:",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great-grandparents",
                motherSide: "Mother's side",
                fatherSide: "Father's side",
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
                selectDogFirst: "Select a dog first",
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
                found: "found"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie einen bestimmten Rüden und eine Hündin für Ihren Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie eine Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie einen Rüden...",
                searchPlaceholder: "Tippen Sie zum Suchen...",
                inDevelopment: "Diese Funktion ist derzeit in Entwicklung",
                devMessage: "Die vollständige Funktionalität für Rüde und Hündin Kombination wird demnächst verfügbar sein.",
                back: "Zurück",
                save: "Zukünftigen Stammbaum Zeigen",
                showPedigree: "Stammbaum Zeigen",
                pedigreeTitle: "Zukünftiger Stammbaum - Vorhersage",
                pedigreeInfo: "Dies ist ein vorhergesagter Stammbaum basierend auf dem ausgewählten Rüden und der Hündin:",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                motherSide: "Mutterseite",
                fatherSide: "Vaterseite",
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
                selectDogFirst: "Wählen Sie zuerst einen Hund",
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
                found: "gefunden"
            }
        };
    }
    
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Reset geselecteerde honden
        this.selectedTeef = null;
        this.selectedReu = null;
        this.familieDataCache.clear();
        this.hondenCache.clear();
        
        // Laad honden data
        await this.loadAllHonden();
        
        content.innerHTML = `
            <div class="alert alert-info">
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
            
            <!-- Stamboom Modal -->
            <div class="modal fade" id="pedigreeModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-diagram-3 text-purple me-2"></i>${t('pedigreeTitle')}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-3">
                                <i class="bi bi-info-circle me-2"></i>
                                ${t('pedigreeInfo')}
                            </div>
                            <div id="pedigreeContent" class="pedigree-content"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-lg me-1"></i>${t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="saveBtn" disabled>
                <i class="bi bi-diagram-3 me-1"></i> ${t('save')}
            </button>
        `;
        
        // Voeg CSS toe
        this.addStyles();
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.showPedigree();
        });
        
        // Setup autocomplete voor teef - identiek aan SearchManager
        this.setupAutocomplete('teefSearch', 'teefSearchResults', 'teeven', (hond) => {
            this.selectTeef(hond);
        });
        
        // Setup autocomplete voor reu - identiek aan SearchManager
        this.setupAutocomplete('reuSearch', 'reuSearchResults', 'reuen', (hond) => {
            this.selectReu(hond);
        });
        
        // Update save button state
        this.updateSaveButtonState();
    }
    
    addStyles() {
        if (!document.querySelector('#reuteef-combinatie-styles')) {
            const style = document.createElement('style');
            style.id = 'reuteef-combinatie-styles';
            style.textContent = `
                /* CONSISTENTE ZOEKSTIJLEN MET SEARCHMANAGER */
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
                
                /* AUTCOMPLETE DROPDOWN - IDENTIEK AAN SEARCHMANAGER */
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
                
                /* HOND RESULTAAT ITEMS - IDENTIEK AAN SEARCHMANAGER */
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
                
                /* PEDIGREE STYLES */
                .pedigree-content {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .pedigree-generation {
                    margin-bottom: 2.5rem;
                    position: relative;
                }
                
                .pedigree-generation-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #6f42c1;
                    position: relative;
                    display: inline-block;
                }
                
                .pedigree-generation-title::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 60px;
                    height: 2px;
                    background: #198754;
                }
                
                .pedigree-row {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    position: relative;
                }
                
                .pedigree-row::before {
                    content: '';
                    position: absolute;
                    top: -1.5rem;
                    left: 50%;
                    width: 2px;
                    height: 1.5rem;
                    background: #adb5bd;
                    transform: translateX(-50%);
                }
                
                .pedigree-box {
                    padding: 1rem;
                    border: 2px solid;
                    border-radius: 0.75rem;
                    background: white;
                    min-width: 200px;
                    max-width: 250px;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .pedigree-box:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
                }
                
                .pedigree-box::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                }
                
                .pedigree-box.puppy {
                    border-color: #6f42c1;
                    background: linear-gradient(135deg, #f8f9ff 0%, #f0e6ff 100%);
                }
                
                .pedigree-box.puppy::before {
                    background: linear-gradient(90deg, #6f42c1, #9d7ce6);
                }
                
                .pedigree-box.parent {
                    border-color: #198754;
                    background: linear-gradient(135deg, #f8fff9 0%, #e6f7ec 100%);
                }
                
                .pedigree-box.parent::before {
                    background: linear-gradient(90deg, #198754, #2ecc71);
                }
                
                .pedigree-box.grandparent {
                    border-color: #0dcaf0;
                    background: linear-gradient(135deg, #f8f9ff 0%, #e6f2ff 100%);
                }
                
                .pedigree-box.grandparent::before {
                    background: linear-gradient(90deg, #0dcaf0, #5bc0de);
                }
                
                .pedigree-box.great-grandparent {
                    border-color: #ffc107;
                    background: linear-gradient(135deg, #fffcf5 0%, #fff3cd 100%);
                }
                
                .pedigree-box.great-grandparent::before {
                    background: linear-gradient(90deg, #ffc107, #ffd54f);
                }
                
                .pedigree-box.unknown {
                    border-color: #6c757d;
                    background: #f8f9fa;
                    opacity: 0.8;
                }
                
                .pedigree-box.unknown::before {
                    background: #6c757d;
                }
                
                .pedigree-name {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #343a40;
                    margin-bottom: 0.5rem;
                    line-height: 1.3;
                }
                
                .pedigree-breed {
                    font-size: 0.9rem;
                    color: #495057;
                    margin-bottom: 0.25rem;
                    font-weight: 500;
                }
                
                .pedigree-details {
                    font-size: 0.8rem;
                    color: #6c757d;
                    margin-top: 0.5rem;
                    line-height: 1.4;
                }
                
                .pedigree-pedigree {
                    font-size: 0.75rem;
                    color: #6f42c1;
                    font-weight: 500;
                    margin-top: 0.25rem;
                }
                
                .pedigree-label {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    background: #e9ecef;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 0.5rem;
                }
                
                /* RESPONSIVE STYLES - CONSISTENT MET SEARCHMANAGER */
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
                    
                    .pedigree-row {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                    }
                    
                    .pedigree-box {
                        min-width: 180px;
                        max-width: 100%;
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
    
    // IDENTIEKE SETUP ALS SEARCHMANAGER
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
            
            // Zoek logica identiek aan SearchManager
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
        this.updateSaveButtonState();
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showHondDetails('reuDetails', hond, 'reu');
        this.updateSaveButtonState();
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
                    <button class="btn btn-sm btn-outline-secondary" onclick="this.clearSelection('${elementId}', '${resultsId}')">
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
        
        this.updateSaveButtonState();
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
    
    async getFamilieTree(hond, diepte) {
        if (diepte <= 0 || !hond) return { hond: hond };
        
        const cacheKey = `${hond.id}_${diepte}`;
        if (this.familieDataCache.has(cacheKey)) {
            return this.familieDataCache.get(cacheKey);
        }
        
        const ouders = await this.getOudersInfo(hond);
        
        const tree = {
            hond: hond,
            vader: null,
            moeder: null
        };
        
        if (ouders.vader) {
            tree.vader = await this.getFamilieTree(ouders.vader, diepte - 1);
        }
        
        if (ouders.moeder) {
            tree.moeder = await this.getFamilieTree(ouders.moeder, diepte - 1);
        }
        
        this.familieDataCache.set(cacheKey, tree);
        return tree;
    }
    
    updateSaveButtonState() {
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            const isDisabled = !(this.selectedTeef && this.selectedReu);
            saveBtn.disabled = isDisabled;
            saveBtn.title = isDisabled ? this.t('selectDogFirst') : '';
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
    
    async showPedigree() {
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert(this.t('selectDogFirst'), 'warning');
            return;
        }
        
        await this.renderPedigree();
        const modal = new bootstrap.Modal(document.getElementById('pedigreeModal'));
        modal.show();
    }
    
    async renderPedigree() {
        const t = this.t.bind(this);
        const content = document.getElementById('pedigreeContent');
        
        // Toon laadindicator
        content.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-purple mb-3" role="status">
                    <span class="visually-hidden">${t('loadingPedigree')}</span>
                </div>
                <p class="text-muted">${t('loadingPedigree')}...</p>
            </div>
        `;
        
        try {
            // Haal familie bomen op voor beide honden (tot 3 generaties diep)
            const [teefTree, reuTree] = await Promise.all([
                this.getFamilieTree(this.selectedTeef, 3),
                this.getFamilieTree(this.selectedReu, 3)
            ]);
            
            content.innerHTML = `
                <div class="pedigree-content">
                    <!-- Toekomstige pup -->
                    <div class="pedigree-generation text-center">
                        <div class="pedigree-generation-title mb-3">Toekomstige Pup (Voorspelling)</div>
                        <div class="pedigree-row">
                            <div class="pedigree-box puppy">
                                <div class="pedigree-label">Voorspelde Pup</div>
                                <div class="pedigree-name">${this.selectedTeef.naam} & ${this.selectedReu.naam}</div>
                                <div class="pedigree-breed">${this.selectedTeef.ras || this.selectedReu.ras || 'Mix'}</div>
                                <div class="pedigree-details">
                                    Combinatie van geselecteerde reu en teef
                                </div>
                                <div class="pedigree-pedigree">Theoretische voorspelling</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ouders -->
                    <div class="pedigree-generation">
                        <div class="pedigree-generation-title mb-4">${t('parents')}</div>
                        <div class="pedigree-row">
                            ${this.maakPedigreeBox(this.selectedReu, t('fatherLabel'), 'parent')}
                            ${this.maakPedigreeBox(this.selectedTeef, t('motherLabel'), 'parent')}
                        </div>
                    </div>
                    
                    <!-- Grootouders -->
                    <div class="pedigree-generation">
                        <div class="pedigree-generation-title mb-4">${t('grandparents')}</div>
                        
                        <div class="row">
                            <!-- Vaders kant -->
                            <div class="col-lg-6">
                                <div class="pedigree-side-title">${t('fatherSide')}</div>
                                <div class="pedigree-row">
                                    ${this.maakPedigreeBox(reuTree.vader?.hond || null, t('grandfatherLabel'), 'grandparent')}
                                    ${this.maakPedigreeBox(reuTree.moeder?.hond || null, t('grandmotherLabel'), 'grandparent')}
                                </div>
                            </div>
                            
                            <!-- Moeders kant -->
                            <div class="col-lg-6">
                                <div class="pedigree-side-title">${t('motherSide')}</div>
                                <div class="pedigree-row">
                                    ${this.maakPedigreeBox(teefTree.vader?.hond || null, t('grandfatherLabel'), 'grandparent')}
                                    ${this.maakPedigreeBox(teefTree.moeder?.hond || null, t('grandmotherLabel'), 'grandparent')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Legenda -->
                    <div class="pedigree-legend">
                        <div class="pedigree-legend-item">
                            <div class="pedigree-legend-color" style="background: linear-gradient(90deg, #6f42c1, #9d7ce6);"></div>
                            <span class="small">Voorspelde Pup</span>
                        </div>
                        <div class="pedigree-legend-item">
                            <div class="pedigree-legend-color" style="background: linear-gradient(90deg, #198754, #2ecc71);"></div>
                            <span class="small">${t('parents')}</span>
                        </div>
                        <div class="pedigree-legend-item">
                            <div class="pedigree-legend-color" style="background: linear-gradient(90deg, #0dcaf0, #5bc0de);"></div>
                            <span class="small">${t('grandparents')}</span>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Fout bij renderen stamboom:', error);
            content.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Er is een fout opgetreden bij het laden van de stamboom.
                    <div class="small mt-2">${error.message}</div>
                </div>
            `;
        }
    }
    
    maakPedigreeBox(hond, relatie, type = 'unknown') {
        const t = this.t.bind(this);
        
        if (!hond || !hond.naam) {
            return `
                <div class="pedigree-box ${type} unknown">
                    <div class="pedigree-label">${relatie}</div>
                    <div class="pedigree-name">${t('unknownAncestor')}</div>
                    <div class="pedigree-details">Geen informatie beschikbaar</div>
                </div>
            `;
        }
        
        const geboortejaar = hond.geboortedatum ? 
            new Date(hond.geboortedatum).getFullYear() : '?';
        const kennelInfo = hond.kennelnaam ? `Kennel: ${hond.kennelnaam}` : '';
        const geboorteDatum = hond.geboortedatum ? 
            new Date(hond.geboortedatum).toLocaleDateString(this.currentLang) : '?';
        
        return `
            <div class="pedigree-box ${type}">
                <div class="pedigree-label">${relatie}</div>
                <div class="pedigree-name">${hond.naam}</div>
                <div class="pedigree-breed">${hond.ras || t('unknownBreed')}</div>
                ${hond.stamboomnr ? `<div class="pedigree-pedigree">${hond.stamboomnr}</div>` : ''}
                <div class="pedigree-details">
                    ${geboorteDatum}<br>
                    ${kennelInfo}
                    ${hond.vachtkleur ? `<br>Kleur: ${hond.vachtkleur}` : ''}
                </div>
            </div>
        `;
    }
    
    showAlert(message, type = 'info') {
        // Verwijder bestaande alerts eerst
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
            
            // Verwijder alert na 5 seconden
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    const bsAlert = new bootstrap.Alert(alertDiv);
                    bsAlert.close();
                }
            }, 5000);
        }
    }
}

// Export voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}

// Voeg de clearSelection functie toe aan window object voor gebruik in inline onclick
window.clearReuTeefSelection = function(detailsId, resultsId) {
    const instance = window.uiHandler?.modules?.reuteef || window.appUI?.modules?.reuteef;
    if (instance) {
        instance.clearSelection(detailsId, resultsId);
    }
};