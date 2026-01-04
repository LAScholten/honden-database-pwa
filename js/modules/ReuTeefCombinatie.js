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
                greatGrandmotherLabel: "Overgrootmoeder"
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
                greatGrandmotherLabel: "Great-grandmother"
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
                features: [
                    "Auswahl spezifischer Rüde und Hündin",
                    "Genetische Kompatibilitätsanalyse",
                    "Stammbaumverifizierung",
                    "Gesundheitswertberechnung",
                    "Vorhergesagte Wurfgröße",
                    "Planung und Kalenderintegration"
                ],
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
                greatGrandmotherLabel: "Urgroßmutter"
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
                    <div class="card">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-female text-pink me-2"></i>${t('mother')}
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-search me-1"></i>${t('selectMother')}
                                </label>
                                <div class="autocomplete-container">
                                    <input type="text" 
                                           class="form-control" 
                                           id="teefSearch" 
                                           placeholder="${t('searchPlaceholder')}"
                                           autocomplete="off">
                                    <div class="autocomplete-dropdown" id="teefDropdown"></div>
                                </div>
                                <div class="form-text text-muted small">
                                    ${t('searchByName')}
                                </div>
                            </div>
                            <div id="teefDetails" class="d-none mt-3">
                                <!-- Teef details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-male text-blue me-2"></i>${t('father')}
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-search me-1"></i>${t('selectFather')}
                                </label>
                                <div class="autocomplete-container">
                                    <input type="text" 
                                           class="form-control" 
                                           id="reuSearch" 
                                           placeholder="${t('searchPlaceholder')}"
                                           autocomplete="off">
                                    <div class="autocomplete-dropdown" id="reuDropdown"></div>
                                </div>
                                <div class="form-text text-muted small">
                                    ${t('searchByName')}
                                </div>
                            </div>
                            <div id="reuDetails" class="d-none mt-3">
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
        
        // Voeg CSS toe voor autocomplete en stamboom
        this.addAutocompleteStyles();
        this.addPedigreeStyles();
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.showPedigree();
        });
        
        // Setup autocomplete voor teef
        this.setupAutocomplete('teefSearch', 'teven', (hond) => {
            this.selectTeef(hond);
        });
        
        // Setup autocomplete voor reu
        this.setupAutocomplete('reuSearch', 'reuen', (hond) => {
            this.selectReu(hond);
        });
        
        // Update save button state
        this.updateSaveButtonState();
    }
    
    addAutocompleteStyles() {
        if (!document.querySelector('#autocomplete-styles')) {
            const style = document.createElement('style');
            style.id = 'autocomplete-styles';
            style.textContent = `
                .autocomplete-container {
                    position: relative;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    max-height: 300px;
                    overflow-y: auto;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 0.375rem;
                    border-top: none;
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 1050;
                    display: none;
                }
                
                .autocomplete-item {
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    border-bottom: 1px solid #f8f9fa;
                    transition: all 0.2s;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                    transform: translateX(2px);
                }
                
                .autocomplete-item.active {
                    background-color: #6f42c1;
                    color: white;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: 600;
                    font-size: 1rem;
                    color: #495057;
                }
                
                .autocomplete-item.active .dog-name {
                    color: white;
                }
                
                .autocomplete-item .dog-details {
                    font-size: 0.85rem;
                    opacity: 0.8;
                }
                
                .autocomplete-item.active .dog-details {
                    opacity: 0.9;
                }
                
                .autocomplete-item .kennel-name {
                    color: #6f42c1;
                    font-weight: 500;
                }
                
                .autocomplete-item.active .kennel-name {
                    color: #e0d6f5;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addPedigreeStyles() {
        if (!document.querySelector('#pedigree-styles')) {
            const style = document.createElement('style');
            style.id = 'pedigree-styles';
            style.textContent = `
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
                
                .pedigree-connection {
                    position: relative;
                    height: 2rem;
                    margin: 0.5rem 0;
                }
                
                .pedigree-connection::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(to bottom, #adb5bd, transparent);
                }
                
                .pedigree-side-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 1rem;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #dee2e6;
                    text-align: center;
                }
                
                .pedigree-legend {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid #dee2e6;
                    flex-wrap: wrap;
                }
                
                .pedigree-legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .pedigree-legend-color {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                }
                
                .pedigree-health-icon {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin: 0 2px;
                }
                
                .pedigree-health-good {
                    background-color: #198754;
                }
                
                .pedigree-health-fair {
                    background-color: #ffc107;
                }
                
                .pedigree-health-poor {
                    background-color: #dc3545;
                }
                
                .pedigree-health-unknown {
                    background-color: #6c757d;
                }
                
                @media (max-width: 768px) {
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
    
    setupAutocomplete(inputId, geslacht, onSelect) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId.replace('Search', 'Dropdown'));
        let activeIndex = -1;
        let currentResults = [];
        
        input.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.trim();
            activeIndex = -1;
            
            if (searchTerm.length === 0) {
                dropdown.style.display = 'none';
                return;
            }
            
            // Filter op geslacht
            let filteredHonden = this.allHonden.filter(hond => {
                if (geslacht === 'teven') {
                    return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                } else if (geslacht === 'reuen') {
                    return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                }
                return true;
            });
            
            if (searchTerm.length === 1) {
                // Bij eerste letter: zoek op eerste letter van naam
                const firstLetter = searchTerm.toLowerCase();
                filteredHonden = filteredHonden.filter(hond => {
                    const naam = hond.naam?.toLowerCase() || '';
                    const kennel = hond.kennelnaam?.toLowerCase() || '';
                    return naam.startsWith(firstLetter) || kennel.startsWith(firstLetter);
                });
            } else {
                // Bij meerdere letters: zoek in naam en kennelnaam
                const searchTermLower = searchTerm.toLowerCase();
                filteredHonden = filteredHonden.filter(hond => {
                    const naam = hond.naam?.toLowerCase() || '';
                    const kennel = hond.kennelnaam?.toLowerCase() || '';
                    const stamboom = hond.stamboomnr?.toLowerCase() || '';
                    const ras = hond.ras?.toLowerCase() || '';
                    
                    return naam.includes(searchTermLower) || 
                           kennel.includes(searchTermLower) ||
                           stamboom.includes(searchTermLower) ||
                           ras.includes(searchTermLower);
                });
            }
            
            // Sorteren: exacte naam matches eerst, dan kennel matches
            filteredHonden.sort((a, b) => {
                const aNaam = a.naam?.toLowerCase() || '';
                const bNaam = b.naam?.toLowerCase() || '';
                const aKennel = a.kennelnaam?.toLowerCase() || '';
                const bKennel = b.kennelnaam?.toLowerCase() || '';
                
                // Exacte naam match
                if (aNaam === searchTerm.toLowerCase()) return -1;
                if (bNaam === searchTerm.toLowerCase()) return 1;
                
                // Begint met zoekterm
                if (aNaam.startsWith(searchTerm.toLowerCase())) return -1;
                if (bNaam.startsWith(searchTerm.toLowerCase())) return 1;
                
                // Kennelnaam match
                if (aKennel.includes(searchTerm.toLowerCase())) return -1;
                if (bKennel.includes(searchTerm.toLowerCase())) return 1;
                
                // Sorteren op naam
                return aNaam.localeCompare(bNaam);
            });
            
            currentResults = filteredHonden;
            
            if (filteredHonden.length === 0) {
                dropdown.innerHTML = `
                    <div class="autocomplete-item text-muted text-center py-3">
                        <i class="bi bi-search me-2"></i>${this.t('noDogFound')}
                    </div>
                `;
                dropdown.style.display = 'block';
                return;
            }
            
            dropdown.innerHTML = filteredHonden.map((hond, index) => {
                const geboortejaar = hond.geboortedatum ? 
                    new Date(hond.geboortedatum).getFullYear() : '?';
                
                return `
                    <div class="autocomplete-item ${index === activeIndex ? 'active' : ''}" 
                         data-index="${index}"
                         data-id="${hond.id}"
                         data-value='${JSON.stringify(hond)}'>
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
            
            // Event listeners voor dropdown items
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
                        onSelect(hond);
                    }
                });
            });
        });
        
        input.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.autocomplete-item');
            
            if (items.length === 0) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    activeIndex = Math.min(activeIndex + 1, items.length - 1);
                    this.updateActiveItem(items, activeIndex);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    activeIndex = Math.max(activeIndex - 1, -1);
                    this.updateActiveItem(items, activeIndex);
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0 && items[activeIndex]) {
                        const index = parseInt(items[activeIndex].getAttribute('data-index'));
                        const hond = currentResults[index];
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
        
        // Houd focus op input wanneer op dropdown wordt geklikt
        dropdown.addEventListener('mousedown', (e) => {
            e.preventDefault();
            input.focus();
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
        const details = document.getElementById(elementId);
        
        // Haal ouders informatie op
        const oudersInfo = await this.getOudersInfo(hond);
        
        details.innerHTML = `
            <div class="card border-${type === 'teef' ? 'pink' : 'blue'}">
                <div class="card-header bg-${type === 'teef' ? 'pink' : 'blue'} bg-opacity-10 border-${type === 'teef' ? 'pink' : 'blue'}">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">
                            <i class="bi bi-gender-${type === 'teef' ? 'female' : 'male'} text-${type === 'teef' ? 'pink' : 'blue'} me-2"></i>
                            ${t('dogDetails')}
                        </h6>
                        <span class="badge bg-${type === 'teef' ? 'pink' : 'blue'}">
                            ${type === 'teef' ? t('genderTeef') : t('genderReu')}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-8">
                            <h5 class="mb-3">${hond.naam || 'Onbekend'}</h5>
                            <div class="row">
                                <div class="col-md-6 mb-2">
                                    <strong>${t('kennel')}</strong><br>
                                    ${hond.kennelnaam || '-'}
                                </div>
                                <div class="col-md-6 mb-2">
                                    <strong>${t('pedigreeNumber')}</strong><br>
                                    ${hond.stamboomnr || '-'}
                                </div>
                                <div class="col-md-6 mb-2">
                                    <strong>${t('birthDate')}</strong><br>
                                    ${hond.geboortedatum ? 
                                        new Date(hond.geboortedatum).toLocaleDateString(this.currentLang) : '-'}
                                </div>
                                <div class="col-md-6 mb-2">
                                    <strong>${t('color')}</strong><br>
                                    ${hond.vachtkleur || '-'}
                                </div>
                                <div class="col-md-6 mb-2">
                                    <strong>Ras:</strong><br>
                                    ${hond.ras || '-'}
                                </div>
                                <div class="col-md-6 mb-2">
                                    <strong>Land:</strong><br>
                                    ${hond.land || '-'}
                                </div>
                            </div>
                            
                            ${oudersInfo.vader || oudersInfo.moeder ? `
                                <hr class="my-3">
                                <h6 class="mb-2">${t('parents')}:</h6>
                                <div class="row">
                                    ${oudersInfo.vader ? `
                                        <div class="col-md-6 mb-2">
                                            <strong>${t('fatherLabel')}:</strong><br>
                                            ${oudersInfo.vader.naam || 'Onbekend'}
                                            ${oudersInfo.vader.stamboomnr ? `(${oudersInfo.vader.stamboomnr})` : ''}
                                        </div>
                                    ` : ''}
                                    ${oudersInfo.moeder ? `
                                        <div class="col-md-6 mb-2">
                                            <strong>${t('motherLabel')}:</strong><br>
                                            ${oudersInfo.moeder.naam || 'Onbekend'}
                                            ${oudersInfo.moeder.stamboomnr ? `(${oudersInfo.moeder.stamboomnr})` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                        <div class="col-lg-4 mt-3 mt-lg-0">
                            <div class="card bg-light">
                                <div class="card-header bg-light border-bottom">
                                    <h6 class="mb-0">${t('healthInfo')}</h6>
                                </div>
                                <div class="card-body">
                                    <div class="small">
                                        ${hond.heupdysplasie ? `
                                            <div class="mb-1">
                                                <strong>HD:</strong> ${hond.heupdysplasie}
                                            </div>
                                        ` : ''}
                                        ${hond.elleboogdysplasie ? `
                                            <div class="mb-1">
                                                <strong>ED:</strong> ${hond.elleboogdysplasie}
                                            </div>
                                        ` : ''}
                                        ${hond.patella ? `
                                            <div class="mb-1">
                                                <strong>Patella:</strong> ${hond.patella}
                                            </div>
                                        ` : ''}
                                        ${hond.ogen ? `
                                            <div class="mb-1">
                                                <strong>Ogen:</strong> ${hond.ogen}
                                                ${hond.ogenVerklaring ? `<br><small>${hond.ogenVerklaring}</small>` : ''}
                                            </div>
                                        ` : ''}
                                        ${hond.dandyWalker ? `
                                            <div class="mb-1">
                                                <strong>Dandy Walker:</strong> ${hond.dandyWalker}
                                            </div>
                                        ` : ''}
                                        ${hond.schildklier ? `
                                            <div class="mb-1">
                                                <strong>Schildklier:</strong> ${hond.schildklier}
                                                ${hond.schildklierVerklaring ? `<br><small>${hond.schildklierVerklaring}</small>` : ''}
                                            </div>
                                        ` : ''}
                                        ${!hond.heupdysplasie && !hond.elleboogdysplasie && !hond.patella && 
                                          !hond.ogen && !hond.dandyWalker && !hond.schildklier ? 
                                            '<div class="text-muted">Geen gezondheidsinformatie beschikbaar</div>' : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        details.classList.remove('d-none');
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
    
    async getFamilielid(hond, generatie, relatie) {
        if (!hond) return null;
        
        // Als we bij de gewenste generatie zijn, geef de hond terug
        if (generatie === 0) return hond;
        
        // Haal ouders op
        const ouders = await this.getOudersInfo(hond);
        
        // Ga recursief dieper
        if (relatie === 'vader' || relatie === 'both') {
            const vaderFamilielid = await this.getFamilielid(ouders.vader, generatie - 1, relatie);
            if (vaderFamilielid) return vaderFamilielid;
        }
        
        if (relatie === 'moeder' || relatie === 'both') {
            const moederFamilielid = await this.getFamilielid(ouders.moeder, generatie - 1, relatie);
            if (moederFamilielid) return moederFamilielid;
        }
        
        return null;
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
            
            // Haal specifieke generaties op
            const grootoudersTeef = {
                moederMoeder: teefTree.moeder?.hond || null,
                moederVader: teefTree.vader?.hond || null,
                vaderMoeder: teefTree.moeder?.moeder?.hond || null,
                vaderVader: teefTree.moeder?.vader?.hond || null
            };
            
            const grootoudersReu = {
                moederMoeder: reuTree.moeder?.hond || null,
                moederVader: reuTree.vader?.hond || null,
                vaderMoeder: reuTree.moeder?.moeder?.hond || null,
                vaderVader: reuTree.moeder?.vader?.hond || null
            };
            
            // Haal overgrootouders op
            const overgrootouders = {
                // Teef's moeder's moeder's ouders
                mmMoeder: teefTree.moeder?.moeder?.hond || null,
                mmVader: teefTree.moeder?.moeder?.vader?.hond || null,
                
                // Teef's moeder's vader's ouders
                mvMoeder: teefTree.moeder?.vader?.hond || null,
                mvVader: teefTree.moeder?.vader?.vader?.hond || null,
                
                // Teef's vader's moeder's ouders
                vmMoeder: teefTree.vader?.moeder?.hond || null,
                vmVader: teefTree.vader?.moeder?.vader?.hond || null,
                
                // Teef's vader's vader's ouders
                vvMoeder: teefTree.vader?.vader?.hond || null,
                vvVader: teefTree.vader?.vader?.vader?.hond || null
            };
            
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
                                    ${this.maakPedigreeBox(grootoudersReu.vaderVader, t('grandfatherLabel'), 'grandparent')}
                                    ${this.maakPedigreeBox(grootoudersReu.vaderMoeder, t('grandmotherLabel'), 'grandparent')}
                                </div>
                            </div>
                            
                            <!-- Moeders kant -->
                            <div class="col-lg-6">
                                <div class="pedigree-side-title">${t('motherSide')}</div>
                                <div class="pedigree-row">
                                    ${this.maakPedigreeBox(grootoudersTeef.vaderVader, t('grandfatherLabel'), 'grandparent')}
                                    ${this.maakPedigreeBox(grootoudersTeef.vaderMoeder, t('grandmotherLabel'), 'grandparent')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Overgrootouders -->
                    <div class="pedigree-generation">
                        <div class="pedigree-generation-title mb-4">${t('greatGrandparents')}</div>
                        
                        <div class="row">
                            <!-- Vaders vaders kant -->
                            <div class="col-lg-3 col-md-6">
                                <div class="pedigree-side-title small">${t('fatherSide')} - ${t('fatherLabel')}</div>
                                <div class="pedigree-row">
                                    ${this.maakPedigreeBox(overgrootouders.vvVader, t('greatGrandfatherLabel'), 'great-grandparent')}
                                    ${this.maakPedigreeBox(overgrootouders.vvMoeder, t('greatGrandmotherLabel'), 'great-grandparent')}
                                </div>
                            </div>
                            
                            <!-- Vaders moeders kant -->
                            <div class="col-lg-3 col-md-6">
                                <div class="pedigree-side-title small">${t('fatherSide')} - ${t('motherLabel')}</div>
                                <div class="pedigree-row">
                                    ${this.maakPedigreeBox(overgrootouders.vmVader, t('greatGrandfatherLabel'), 'great-grandparent')}
                                    ${this.maakPedigreeBox(overgrootouders.vmMoeder, t('greatGrandmotherLabel'), 'great-grandparent')}
                                </div>
                            </div>
                            
                            <!-- Moeders vaders kant -->
                            <div class="col-lg-3 col-md-6">
                                <div class="pedigree-side-title small">${t('motherSide')} - ${t('fatherLabel')}</div>
                                <div class="pedigree-row">
                                    ${this.maakPedigreeBox(overgrootouders.mvVader, t('greatGrandfatherLabel'), 'great-grandparent')}
                                    ${this.maakPedigreeBox(overgrootouders.mvMoeder, t('greatGrandmotherLabel'), 'great-grandparent')}
                                </div>
                            </div>
                            
                            <!-- Moeders moeders kant -->
                            <div class="col-lg-3 col-md-6">
                                <div class="pedigree-side-title small">${t('motherSide')} - ${t('motherLabel')}</div>
                                <div class="pedigree-row">
                                    ${this.maakPedigreeBox(overgrootouders.mmVader, t('greatGrandfatherLabel'), 'great-grandparent')}
                                    ${this.maakPedigreeBox(overgrootouders.mmMoeder, t('greatGrandmotherLabel'), 'great-grandparent')}
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
                        <div class="pedigree-legend-item">
                            <div class="pedigree-legend-color" style="background: linear-gradient(90deg, #ffc107, #ffd54f);"></div>
                            <span class="small">${t('greatGrandparents')}</span>
                        </div>
                    </div>
                    
                    <!-- Debug info (optioneel) -->
                    <div class="mt-4 text-muted small">
                        <details>
                            <summary>Debug informatie</summary>
                            <div class="mt-2">
                                <strong>Teef ID:</strong> ${this.selectedTeef.id}<br>
                                <strong>Reu ID:</strong> ${this.selectedReu.id}<br>
                                <strong>Cache grootte:</strong> ${this.hondenCache.size} honden<br>
                                <strong>Familie cache:</strong> ${this.familieDataCache.size} bomen
                            </div>
                        </details>
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
                    <div class="small mt-2">Stack trace: ${error.stack}</div>
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
        
        // Gezondheid indicator
        let healthIndicator = '';
        if (hond.heupdysplasie || hond.elleboogdysplasie) {
            const hd = hond.heupdysplasie || '-';
            const ed = hond.elleboogdysplasie || '-';
            healthIndicator = `<div class="pedigree-details">HD: ${hd} | ED: ${ed}</div>`;
        }
        
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
                ${healthIndicator}
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