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
                // COI labels toegevoegd voor popup
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Sluiten",
                predictedCoi: "Voorspelde Inteeltcoëfficiënt",
                futurePuppyInfo: "Toekomstige Pup Informatie"
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
                // COI labels added for popup
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Close",
                predictedCoi: "Predicted Inbreeding Coefficient",
                futurePuppyInfo: "Future Puppy Information"
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
                futurePuppyName: "Zukünftiger Welpe",
                futurePuppyDescription: "Vorhersage der Kombination {father} × {mother}",
                futurePuppyTitle: "Stamboom für zukünftigen Welpen aus Kombination {father} × {mother}",
                predictedPedigree: "Vorhergesagter Stammbaum",
                combinedParents: "Kombination Eltern",
                // COI labels hinzugefügt für Popup
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Schließen",
                predictedCoi: "Vorhergesagter Inzuchtkoeffizient",
                futurePuppyInfo: "Zukünftiger Welpen-Informationen"
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
            
            <!-- VERWIJDERD: Toekomstige Pup Samenvatting -->
        `;
        
        // ALLEEN PAARSE KNOPS (geen groene knop)
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="showPedigreeBtn" disabled>
                <i class="bi bi-diagram-3 me-1"></i> ${t('showFuturePuppy')}
            </button>
        `;
        
        // Voeg CSS toe
        this.addStyles();
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('showPedigreeBtn').addEventListener('click', () => {
            this.showFuturePuppyPedigree();
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
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showHondDetails('reuDetails', hond, 'reu');
        this.updateButtonStates();
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
        const showPedigreeBtn = document.getElementById('showPedigreeBtn');
        
        // Alleen beschikbaar als beide honden geselecteerd zijn
        const bothSelected = this.selectedTeef && this.selectedReu;
        
        if (showPedigreeBtn) {
            showPedigreeBtn.disabled = !bothSelected;
            showPedigreeBtn.title = bothSelected ? '' : this.t('selectDogFirst');
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
        
        // Maak een virtuele toekomstige pup met ALLE vereiste eigenschappen
        const futurePuppy = {
            id: -1, // Speciaal ID voor toekomstige pup
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
            // Voeg alle mogelijke gezondheidsvelden toe
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
        
        // Debug info
        console.log('Toekomstige pup aangemaakt:', futurePuppy);
        console.log('Reu ID:', this.selectedReu.id, 'Naam:', this.selectedReu.naam);
        console.log('Teef ID:', this.selectedTeef.id, 'Naam:', this.selectedTeef.naam);
        
        try {
            // Voeg de virtuele pup tijdelijk toe aan de StamboomManager's honden lijst
            if (this.stamboomManager.allDogs) {
                // Maak een kopie van de originele lijst
                const originalDogs = [...this.stamboomManager.allDogs];
                
                // Voeg de virtuele pup toe
                this.stamboomManager.allDogs.push(futurePuppy);
                
                // Probeer de stamboom te tonen
                await this.stamboomManager.showPedigree(futurePuppy);
                
                // VOEG CLICK EVENT TOE VOOR TOEKOMSTIGE PUP CARD
                setTimeout(() => {
                    this.addFuturePuppyClickHandler(futurePuppy);
                }, 100);
                
                // Herstel de originele lijst
                this.stamboomManager.allDogs = originalDogs;
            } else {
                // Fallback: gebruik een aangepaste methode
                await this.showCustomFuturePuppyPedigree(futurePuppy);
            }
        } catch (error) {
            console.error('Fout bij tonen toekomstige pup stamboom:', error);
            this.showAlert('Kon stamboom niet genereren. Probeer opnieuw.', 'danger');
        }
    }
    
    // NIEUWE FUNCTIE: Voeg click handler toe voor toekomstige pup card
    addFuturePuppyClickHandler(futurePuppy) {
        const futurePuppyCard = document.querySelector('.pedigree-card-compact.horizontal.main-dog-compact.gen0');
        if (futurePuppyCard) {
            futurePuppyCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFuturePuppyPopup(futurePuppy);
            });
            
            // Voeg cursor styling toe
            futurePuppyCard.style.cursor = 'pointer';
            
            // Update click hint
            const clickHint = futurePuppyCard.querySelector('.click-hint-compact');
            if (clickHint) {
                clickHint.innerHTML = '<i class="bi bi-info-circle"></i> ' + this.t('clickForDetails');
            }
        }
    }
    
    // NIEUWE FUNCTIE: Toon popup voor toekomstige pup - ENKEL COI
    async showFuturePuppyPopup(futurePuppy) {
        // Bereken COI waarden voor de toekomstige pup - DIRECTE BEREKENING
        const coiValues = this.calculateDirectCOIForParents(this.selectedReu, this.selectedTeef);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.getCOIColor(coiValues.coiAllGen);
        
        // Maak popup HTML - ALLEEN COI
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
                    <!-- ALLEEN COI SECTIE -->
                    <div class="info-section mb-4">
                        <h6><i class="bi bi-calculator me-1"></i> ${this.t('predictedCoi')}</h6>
                        <div class="info-grid">
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coi6Gen')}:</span>
                                    <span class="info-value coi-value" style="color: ${coi6Color}; font-weight: bold;">
                                        ${coiValues.coi6Gen}%
                                    </span>
                                </div>
                                
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coiAllGen')}:</span>
                                    <span class="info-value coi-value" style="color: ${coiAllColor}; font-weight: bold;">
                                        ${coiValues.coiAllGen}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Status info -->
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
        
        // Gebruik dezelfde popup container als StamboomManager
        this.ensurePopupContainer();
        
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (container) {
            container.innerHTML = popupHTML;
            overlay.style.display = 'flex';
            
            // Voeg event listeners toe
            this.setupPopupEventListeners();
        }
    }
    
    // NIEUWE FUNCTIE: Directe COI berekening voor ouders combinatie
    calculateDirectCOIForParents(reu, teef) {
        console.log('🔍 COI berekening voor ouders combinatie:');
        console.log('   Reu:', reu.naam, 'ID:', reu.id);
        console.log('   Teef:', teef.naam, 'ID:', teef.id);
        
        // Controleer basisgevallen eerst
        if (!reu || !teef) {
            console.log('   ➡ Ontbrekende ouders -> 0%');
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        if (reu.id === teef.id) {
            console.log('   ➡ Zelfde ouders -> 25%');
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }
        
        // VOLLE BROER/ZUS
        const isFullSibling = reu.vaderId && teef.vaderId && reu.vaderId === teef.vaderId &&
                             reu.moederId && teef.moederId && reu.moederId === teef.moederId;
        
        if (isFullSibling) {
            console.log('   ➡ Ouders zijn volle broer/zus -> 25%');
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }
        
        // HALF BROER/ZUS (gemeenschappelijke vader OF moeder)
        const isHalfSibling = (reu.vaderId && teef.vaderId && reu.vaderId === teef.vaderId) ||
                             (reu.moederId && teef.moederId && reu.moederId === teef.moederId);
        
        if (isHalfSibling) {
            console.log('   ➡ Ouders zijn half broer/zus -> 12.5%');
            return { coi6Gen: '12.5', coiAllGen: '12.5' };
        }
        
        // COMPLEXE BEREKENING - gebruik StamboomManager's COI calculator als beschikbaar
        if (this.stamboomManager && this.stamboomManager.coiCalculator) {
            try {
                // Maak een virtuele pup voor berekening
                const tempVirtualPup = {
                    id: -9999,
                    vaderId: reu.id,
                    moederId: teef.id
                };
                
                // Voeg tijdelijk toe aan allDogs voor COI berekening
                const originalDogs = [...this.stamboomManager.allDogs];
                this.stamboomManager.allDogs.push(tempVirtualPup);
                
                // Bereken COI via COICalculator
                const coiResult = this.stamboomManager.coiCalculator.calculateCOI(-9999);
                console.log('   ➡ Complexe COI via calculator:', coiResult);
                
                // Herstel originele lijst
                this.stamboomManager.allDogs = originalDogs;
                
                return {
                    coi6Gen: coiResult.coi6Gen || '0.0',
                    coiAllGen: coiResult.coiAllGen || '0.0'
                };
                
            } catch (error) {
                console.error('Fout in COI calculator:', error);
            }
        }
        
        // Eenvoudige berekening voor neef/nicht etc.
        // Controleer op gemeenschappelijke grootouders
        let commonAncestors = 0;
        
        // Vind alle voorouders van reu (2 generaties)
        const reuAncestors = this.getAllAncestors(reu.id, 2);
        // Vind alle voorouders van teef (2 generaties)
        const teefAncestors = this.getAllAncestors(teef.id, 2);
        
        // Tel gemeenschappelijke voorouders
        for (const ancestor of reuAncestors) {
            if (teefAncestors.has(ancestor)) {
                commonAncestors++;
            }
        }
        
        console.log('   ➡ Gemeenschappelijke voorouders:', commonAncestors);
        
        // Bepaal COI op basis van gemeenschappelijke voorouders
        if (commonAncestors >= 2) {
            // Waarschijnlijk neef/nicht of dichter
            return { coi6Gen: '6.25', coiAllGen: '6.25' };
        } else if (commonAncestors === 1) {
            // Verre verwantschap
            return { coi6Gen: '3.125', coiAllGen: '3.125' };
        }
        
        console.log('   ➡ Geen verwantschap -> 0%');
        return { coi6Gen: '0.0', coiAllGen: '0.0' };
    }
    
    // Helper functie: vind alle voorouders tot bepaalde diepte
    getAllAncestors(dogId, maxDepth) {
        const ancestors = new Set();
        
        const traverse = (id, depth) => {
            if (depth > maxDepth) return;
            
            const dog = this.getDogById(id);
            if (!dog) return;
            
            if (dog.vaderId) {
                ancestors.add(dog.vaderId);
                traverse(dog.vaderId, depth + 1);
            }
            
            if (dog.moederId) {
                ancestors.add(dog.moederId);
                traverse(dog.moederId, depth + 1);
            }
        };
        
        traverse(dogId, 1);
        return ancestors;
    }
    
    // NIEUWE FUNCTIE: Maak popup container aan als deze niet bestaat
    ensurePopupContainer() {
        // Controleer of container al bestaat
        if (document.getElementById('pedigreePopupOverlay')) {
            return;
        }
        
        const overlayHTML = `
            <div class="pedigree-popup-overlay" id="pedigreePopupOverlay" style="display: none;">
                <div class="pedigree-popup-container" id="pedigreePopupContainer">
                    <!-- Hier komt de popup content -->
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
    }
    
    // NIEUWE FUNCTIE: Setup popup event listeners
    setupPopupEventListeners() {
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (!overlay || !container) return;
        
        // Add close event listeners
        const closeButtons = container.querySelectorAll('.btn-close, .popup-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
        });
        
        // Close when clicking outside popup
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
        
        // Close with Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.style.display = 'none';
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Clean up event listener when popup closes
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    // NIEUWE FUNCTIE: Helper voor COI kleuren (zelfde als StamboomManager)
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745'; // groen
        if (value <= 6.0) return '#fd7e14'; // oranje
        return '#dc3545'; // rood
    }
    
    async showCustomFuturePuppyPedigree(futurePuppy) {
        // Maak een aangepaste modal voor de toekomstige pup
        const modalId = 'futurePuppyModal';
        let modal = document.getElementById(modalId);
        
        if (modal) {
            modal.remove();
        }
        
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.setAttribute('aria-hidden', 'true');
        
        const title = this.t('futurePuppyTitle', { 
            reu: this.selectedReu.naam || '?', 
            teef: this.selectedTeef.naam || '?' 
        });
        
        modal.innerHTML = `
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-stars me-2"></i>${title}
                        </h5>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-light btn-print">
                                <i class="bi bi-printer me-1"></i> ${this.t('print')}
                            </button>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                        </div>
                    </div>
                    <div class="modal-body p-0" style="overflow: hidden;">
                        <div class="pedigree-mobile-wrapper">
                            <div class="pedigree-container-compact" id="futurePuppyContainer">
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
        
        // Toon modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        // Render de stamboom
        await this.renderFuturePuppyPedigree(futurePuppy);
        
        // Voeg print functionaliteit toe
        modal.querySelector('.btn-print').addEventListener('click', () => {
            window.print();
        });
        
        // VOEG CLICK EVENT TOE VOOR TOEKOMSTIGE PUP CARD
        setTimeout(() => {
            this.addFuturePuppyClickHandler(futurePuppy);
        }, 100);
    }
    
    async renderFuturePuppyPedigree(futurePuppy) {
        const container = document.getElementById('futurePuppyContainer');
        if (!container) return;
        
        // Bouw de pedigree tree voor de toekomstige pup
        const pedigreeTree = this.buildFuturePuppyPedigreeTree(futurePuppy);
        
        // Genereer de cards
        const mainDogCard = await this.generateDogCard(pedigreeTree.mainDog, this.t('futurePuppyName'), true, 0);
        const fatherCard = await this.generateDogCard(pedigreeTree.father, this.t('fatherLabel'), false, 1);
        const motherCard = await this.generateDogCard(pedigreeTree.mother, this.t('motherLabel'), false, 1);
        
        // Grootouders
        const paternalGrandfatherCard = await this.generateDogCard(pedigreeTree.paternalGrandfather, this.t('grandfatherLabel'), false, 2);
        const paternalGrandmotherCard = await this.generateDogCard(pedigreeTree.paternalGrandmother, this.t('grandmotherLabel'), false, 2);
        const maternalGrandfatherCard = await this.generateDogCard(pedigreeTree.maternalGrandfather, this.t('grandfatherLabel'), false, 2);
        const maternalGrandmotherCard = await this.generateDogCard(pedigreeTree.maternalGrandmother, this.t('grandmotherLabel'), false, 2);
        
        // Overgrootouders
        const paternalGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3);
        const paternalGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3);
        const paternalGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3);
        const paternalGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3);
        const maternalGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3);
        const maternalGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3);
        const maternalGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3);
        const maternalGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3);
        
        // Bouw de grid HTML
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
        
        // Add click events to other cards via StamboomManager
        if (this.stamboomManager && typeof this.stamboomManager.setupCardClickEvents === 'function') {
            this.stamboomManager.setupCardClickEvents();
        }
    }
    
    buildFuturePuppyPedigreeTree(futurePuppy) {
        // Bouw een pedigree tree net zoals StamboomManager.buildPedigreeTree doet
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
        
        // Haal ouders op uit cache of database
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
        
        // Overgrootouders voor reu
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
        
        // Overgrootouders voor teef
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
    
    getDogById(id) {
        if (!id || id === 0) return null;
        
        // Zoek eerst in cache
        if (this.hondenCache.has(id)) {
            return this.hondenCache.get(id);
        }
        
        // Zoek in allHonden array
        const dog = this.allHonden.find(d => d.id === id);
        if (dog) {
            this.hondenCache.set(id, dog);
            return dog;
        }
        
        return null;
    }
    
    async generateDogCard(dog, relation, isMainDog = false, generation = 0) {
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
        
        // Maak een gecombineerde naam+kennel string voor automatische aanpassing
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
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
                    <!-- Regel 1: Naam en kennelnaam in één regel -->
                    <div class="card-row card-row-1">
                        <div class="dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <!-- Regel 2: Stamboomnummer en ras -->
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
                    
                    <!-- Regel 3: Klik hint -->
                    <div class="card-row card-row-3">
                        <div class="click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}
                        </div>
                    </div>
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

// Maak het beschikbaar op window object voor inline onclick
window.reuTeefCombinatie = null;

// Export voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}