/**
 * Zoek Reu Module
 * Voor het zoeken naar geschikte reuen voor een teef
 * MET TOEGEVOEGDE FUNCTIE: Klik op reu naam om stamboom te zien
 */

class ZoekReu {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.teefInputTimer = null;
        this.selectedTeef = null;
        this.allTeven = [];
        this.coiCalculator = null;
        this.stamboomManager = null; // NIEUW: Referentie naar StamboomManager
        this.hondenData = []; // Alle honden data voor COI berekeningen
        
        this.translations = {
            nl: {
                title: "Zoek een Reu",
                description: "Vind een geschikte reu voor uw teef op basis van criteria",
                selectTeef: "Selecteer uw teef",
                selectTeefPlaceholder: "Typ naam, kennel of stamboomnummer...",
                searchCriteria: "Zoekcriteria",
                ras: "Ras",
                anyBreed: "Elk ras",
                bornAfter: "Geboren na",
                bornAfterPlaceholder: "dd-mm-jjjj",
                inteeltCoefficient: "Inteelt coëfficiënt (COI) toekomstige pup",
                inteeltPlaceholder: "Maximaal percentage inteelt toekomstige pup",
                inteeltHelp: "Maximum COI in % voor toekomstige pup (niet reu zelf)",
                healthFilter: "Gezondheid filter",
                heupdysplasie: "Heupdysplasie (HD)",
                patellaluxatie: "Patellaluxatie (PL)",
                ogen: "Ogen",
                dandyWalker: "Dandy Walker",
                schildklier: "Tgaa",
                elleboogdysplasie: "Elleboogdysplasie (ED)",
                anyHealth: "Niet belangrijk",
                searchRadius: "Zoekradius",
                radiusOptions: ["Nederland", "België", "Duitsland", "Europa", "Wereldwijd"],
                searchButton: "Zoek Reuen",
                results: "Zoekresultaten",
                inDevelopment: "Deze zoekfunctie is momenteel in ontwikkeling",
                devMessage: "De complete zoekfunctionaliteit voor reuen zal binnenkort beschikbaar zijn.",
                features: [
                    "Geavanceerde zoekfilters",
                    "Genetische compatibiliteit matching",
                    "Stamboom analyse",
                    "Gezondheidsscore vergelijking",
                    "Locatie-based zoeken",
                    "Beoordelingen en reviews"
                ],
                back: "Terug",
                noResults: "Geen reuen gevonden die voldoen aan uw criteria",
                tryAgain: "Probeer andere zoekcriteria",
                coiResult: "Combinatie<br>COI",
                coi6Gen: "COI 6 gen",
                coiAllGen: "COI 25 gen",
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "Niet getest"],
                    ogen: ["Vrij", "Dist", "Overig", "Niet onderzocht"],
                    dandyWalker: ["Vrij op DNA", "Vrij op ouders", "Drager", "Niet getest"],
                    schildklier: ["Tgaa Negatief", "Niet getest"],
                    elleboogdysplasie: ["0", "1", "2", "3", "Niet getest"]
                },
                healthLabels: {
                    heupdysplasie: {
                        "A": "HD-A (Uitstekend)",
                        "B": "HD-B (Goed)",
                        "C": "HD-C (Matig)",
                        "D": "HD-D (Slecht)",
                        "E": "HD-E (Zeer slecht)"
                    },
                    patellaluxatie: {
                        "0": "0 (Vrij)",
                        "1": "1 (Lichte afwijking)",
                        "2": "2 (Matige afwijking)",
                        "3": "3 (Ernstige afwijking)",
                        "Niet getest": "Niet getest"
                    },
                    ogen: {
                        "Vrij": "Vrij",
                        "Dist": "Distichiasis",
                        "Overig": "Overig",
                        "Niet onderzocht": "Niet onderzocht"
                    },
                    dandyWalker: {
                        "Vrij op DNA": "Vrij op DNA",
                        "Vrij op ouders": "Vrij op ouders",
                        "Drager": "Drager",
                        "Niet getest": "Niet getest"
                    },
                    schildklier: {
                        "Tgaa Negatief": "Tgaa Negatief",
                        "Niet getest": "Niet getest"
                    },
                    elleboogdysplasie: {
                        "0": "0 (Vrij)",
                        "1": "1 (Lichte afwijking)",
                        "2": "2 (Matige afwijking)",
                        "3": "3 (Ernstige afwijking)",
                        "Niet getest": "Niet getest"
                    }
                },
                resultColumns: {
                    naam: "Naam",
                    geboortedatum: "Geboorte<br>datum",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Ogen",
                    dw: "Dandy<br>Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Locatie",
                    coi: "Toekomstige<br>pup COI"
                },
                unknown: "Onbekend",
                notTested: "Niet getest",
                invalidDate: "Ongeldige datum. Gebruik formaat: dd-mm-jjjj",
                invalidCOI: "Ongeldige COI waarde. Gebruik getal tussen 0 en 100",
                noTeefSelected: "Selecteer eerst een teef om COI berekening te gebruiken",
                showPedigree: "Bekijk stamboom",
                pedigreeTooltip: "Klik om de 4-generatie stamboom van deze reu te bekijken",
                pedigreeForPup: "COI van toekomstige pup (teef + reu)",
                reuCOI: "Reu COI",
                pupCOI: "Pup COI",
                calculatingCOI: "COI berekeningen voor toekomstige pups..."
            },
            en: {
                title: "Find a Male",
                description: "Find a suitable male for your female based on criteria",
                selectTeef: "Select your female",
                selectTeefPlaceholder: "Type name, kennel or pedigree number...",
                searchCriteria: "Search Criteria",
                ras: "Breed",
                anyBreed: "Any breed",
                bornAfter: "Born after",
                bornAfterPlaceholder: "dd-mm-yyyy",
                inteeltCoefficient: "Inbreeding Coefficient (COI) future pup",
                inteeltPlaceholder: "Maximum inbreeding percentage future pup",
                inteeltHelp: "Maximum COI % for future pup (not male itself)",
                healthFilter: "Health filter",
                heupdysplasie: "Hip Dysplasia (HD)",
                patellaluxatie: "Patellar Luxation (PL)",
                ogen: "Eyes",
                dandyWalker: "Dandy Walker",
                schildklier: "Tgaa",
                elleboogdysplasie: "Elbow Dysplasia (ED)",
                anyHealth: "Not important",
                searchRadius: "Search radius",
                radiusOptions: ["Netherlands", "Belgium", "Germany", "Europe", "Worldwide"],
                searchButton: "Search Males",
                results: "Search Results",
                inDevelopment: "This search function is currently in development",
                devMessage: "The complete search functionality for males will be available soon.",
                features: [
                    "Advanced search filters",
                    "Genetic compatibility matching",
                    "Pedigree analysis",
                    "Health score comparison",
                    "Location-based searching",
                    "Ratings and reviews"
                ],
                back: "Back",
                noResults: "No males found matching your criteria",
                tryAgain: "Try different search criteria",
                coiResult: "Combination<br>COI",
                coi6Gen: "COI 6 gen",
                coiAllGen: "COI 25 gen",
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "Not tested"],
                    ogen: ["Free", "Dist", "Other", "Not examined"],
                    dandyWalker: ["Free on DNA", "Free on parents", "Carrier", "Not tested"],
                    schildklier: ["Tgaa Negative", "Not tested"],
                    elleboogdysplasie: ["0", "1", "2", "3", "Not tested"]
                },
                healthLabels: {
                    heupdysplasie: {
                        "A": "HD-A (Excellent)",
                        "B": "HD-B (Good)",
                        "C": "HD-C (Moderate)",
                        "D": "HD-D (Poor)",
                        "E": "HD-E (Very poor)"
                    },
                    patellaluxatie: {
                        "0": "0 (Free)",
                        "1": "1 (Mild)",
                        "2": "2 (Moderate)",
                        "3": "3 (Severe)",
                        "Not tested": "Not tested"
                    },
                    ogen: {
                        "Free": "Free",
                        "Dist": "Distichiasis",
                        "Other": "Other",
                        "Not examined": "Not examined"
                    },
                    dandyWalker: {
                        "Free on DNA": "Free on DNA",
                        "Free on parents": "Free on parents",
                        "Carrier": "Carrier",
                        "Not tested": "Not tested"
                    },
                    schildklier: {
                        "Tgaa Negative": "Tgaa Negative",
                        "Not tested": "Not tested"
                    },
                    elleboogdysplasie: {
                        "0": "0 (Free)",
                        "1": "1 (Mild)",
                        "2": "2 (Moderate)",
                        "3": "3 (Severe)",
                        "Not tested": "Not tested"
                    }
                },
                resultColumns: {
                    naam: "Name",
                    geboortedatum: "Birth<br>Date",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Eyes",
                    dw: "Dandy<br>Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Location",
                    coi: "Future<br>pup COI"
                },
                unknown: "Unknown",
                notTested: "Not tested",
                invalidDate: "Invalid date. Use format: dd-mm-yyyy",
                invalidCOI: "Invalid COI value. Use number between 0 and 100",
                noTeefSelected: "Select a female first to use COI calculation",
                showPedigree: "View pedigree",
                pedigreeTooltip: "Click to view the 4-generation pedigree of this male",
                pedigreeForPup: "COI of future pup (female + male)",
                reuCOI: "Male COI",
                pupCOI: "Pup COI",
                calculatingCOI: "Calculating COI for future pups..."
            },
            de: {
                title: "Finde einen Rüden",
                description: "Finden Sie einen geeigneten Rüden für Ihre Hündin basierend auf Kriterien",
                selectTeef: "Wählen Sie Ihre Hündin",
                selectTeefPlaceholder: "Name, Zwingername oder Stammbaumnummer eingeben...",
                searchCriteria: "Suchkriterien",
                ras: "Rasse",
                anyBreed: "Jede Rasse",
                bornAfter: "Geboren nach",
                bornAfterPlaceholder: "dd-mm-jjjj",
                inteeltCoefficient: "Inzuchtkoeffizient (COI) zukünftiger Welpe",
                inteeltPlaceholder: "Maximaler Inzuchtprozentsatz zukünftiger Welpe",
                inteeltHelp: "Maximaler COI in % für zukünftigen Welpen (nicht Rüde selbst)",
                healthFilter: "Gesundheitsfilter",
                heupdysplasie: "Hüftgelenksdysplasie (HD)",
                patellaluxatie: "Patellaluxation (PL)",
                ogen: "Augen",
                dandyWalker: "Dandy Walker",
                schildklier: "Tgaa",
                elleboogdysplasie: "Ellbogengelenksdysplasie (ED)",
                anyHealth: "Niet wichtig",
                searchRadius: "Suchradius",
                radiusOptions: ["Niederlande", "België", "Deutschland", "Europa", "Weltweit"],
                searchButton: "Rüden suchen",
                results: "Suchergebnisse",
                inDevelopment: "Diese Suchfunktion ist derzeit in ontwikkeling",
                devMessage: "Die vollständige Suchfunktionalität für Rüden wird demnächst verfügbar sein.",
                features: [
                    "Erweiterde Suchfilter",
                    "Genetische Kompatibilitätsprüfung",
                    "Stammbaumanalyse",
                    "Gezundheitswertvergleich",
                    "Standortbasierte Suche",
                    "Bewertungen und Erfahrungsberichte"
                ],
                back: "Zurück",
                noResults: "Keine Rüden gefonden, die Ihren Kriterien entsprechen",
                tryAgain: "Versuchen Sie andere Suchkriterien",
                coiResult: "Kombination<br>COI",
                coi6Gen: "COI 6 gen",
                coiAllGen: "COI 25 gen",
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "Niet getestet"],
                    ogen: ["Frei", "Dist", "Andere", "Niet untersucht"],
                    dandyWalker: ["Frei auf DNA", "Frei op ouders", "Träger", "Niet getest"],
                    schildklier: ["Tgaa Negativ", "Niet getest"],
                    elleboogdysplasie: ["0", "1", "2", "3", "Niet getest"]
                },
                healthLabels: {
                    heupdysplasie: {
                        "A": "HD-A (Ausgezeichnet)",
                        "B": "HD-B (Gut)",
                        "C": "HD-C (Mäßig)",
                        "D": "HD-D (Schlecht)",
                        "E": "HD-E (Sehr schlecht)"
                    },
                    patellaluxatie: {
                        "0": "0 (Frei)",
                        "1": "1 (Leicht)",
                        "2": "2 (Mäßig)",
                        "3": "3 (Schwer)",
                        "Niet getestet": "Niet getestet"
                    },
                    ogen: {
                        "Frei": "Frei",
                        "Dist": "Distichiasis",
                        "Andere": "Andere",
                        "Niet untersucht": "Niet untersucht"
                    },
                    dandyWalker: {
                        "Frei auf DNA": "Frei auf DNA",
                        "Frij op ouders": "Frij op ouders",
                        "Träger": "Träger",
                        "Niet getest": "Niet getest"
                    },
                    schildklier: {
                        "Tgaa Negativ": "Tgaa Negativ",
                        "Niet getest": "Niet getest"
                    },
                    elleboogdysplasie: {
                        "0": "0 (Frei)",
                        "1": "1 (Leicht)",
                        "2": "2 (Mäßig)",
                        "3": "3 (Schwer)",
                        "Niet getest": "Niet getest"
                    }
                },
                resultColumns: {
                    naam: "Name",
                    geboortedatum: "Geburts<br>datum",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Augen",
                    dw: "Dandy<br>Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Standort",
                    coi: "Zukünftiger<br>Welpe COI"
                },
                unknown: "Unbekannt",
                notTested: "Niet getestet",
                invalidDate: "Ungültiges Datum. Format: dd-mm-jjjj",
                invalidCOI: "Ungültiger COI-Wert. Verwenden Sie eine Zahl zwischen 0 und 100",
                noTeefSelected: "Wählen Sie zuerst eine Hündin, um die COI-Berechnung zu verwenden",
                showPedigree: "Stammbaum anzeigen",
                pedigreeTooltip: "Klicken, um den 4-Generationen-Stammbaum dieses Rüden anzuzeigen",
                pedigreeForPup: "COI von zukünftigem Welpen (Hündin + Rüde)",
                reuCOI: "Rüde COI",
                pupCOI: "Welpe COI",
                calculatingCOI: "Berechne COI für zukünftige Welpen..."
            }
        };
    }
    
    injectDependencies(db, auth, stamboomManager = null) {
        this.db = db;
        this.auth = auth;
        this.stamboomManager = stamboomManager;
        
        // Initialiseer COICalculator als we de database hebben
        if (db && typeof db.getHonden === 'function') {
            this.initCOICalculator();
        }
    }
    
    async initCOICalculator() {
        try {
            this.hondenData = await this.db.getHonden();
            this.coiCalculator = new COICalculator(this.hondenData);
            console.log('✅ COICalculator geïnitialiseerd met', this.hondenData.length, 'honden');
        } catch (error) {
            console.error('❌ Fout bij initialiseren COICalculator:', error);
        }
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Laad honden data en initialiseer COICalculator
        if (this.hondenData.length === 0) {
            await this.initCOICalculator();
        }
        
        this.allTeven = this.hondenData.filter(h => h.geslacht === 'teven');
        const reuen = this.hondenData.filter(h => h.geslacht === 'reuen');
        
        // Verzamel unieke rassen
        const rassen = [...new Set(reuen.map(r => r.ras).filter(Boolean))].sort();
        
        content.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-tools"></i>
                <strong>${t('inDevelopment')}</strong><br>
                ${t('devMessage')}
            </div>
            
            <h5 class="mb-4">
                <i class="bi bi-search text-purple"></i> ${t('title')}
            </h5>
            <p class="text-muted mb-4">${t('description')}</p>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">${t('selectTeef')}</h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectTeef')}</label>
                                <div class="position-relative">
                                    <input type="text" 
                                           class="form-control" 
                                           id="teefSearch" 
                                           placeholder="${t('selectTeefPlaceholder')}"
                                           autocomplete="off">
                                    <div class="autocomplete-dropdown" id="teefDropdown" style="display: none;">
                                        <div class="autocomplete-header">
                                            <small class="text-muted">Teven gevonden: <span id="teefCount">0</span></small>
                                        </div>
                                        <div class="autocomplete-results" id="teefResults"></div>
                                    </div>
                                </div>
                            </div>
                            <div id="selectedTeefInfo" class="small p-3 bg-light rounded">
                                <div class="text-muted text-center">
                                    <i class="bi bi-gender-female"></i>
                                    <p class="mb-0 mt-2">Selecteer een teef om te beginnen</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">${t('searchCriteria')}</h6>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">${t('ras')}</label>
                                    <select class="form-select" id="rasFilter">
                                        <option value="">${t('anyBreed')}</option>
                                        ${rassen.map(ras => `
                                            <option value="${ras}">${ras}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                
                                <div class="col-md-6">
                                    <label class="form-label">${t('searchRadius')}</label>
                                    <select class="form-select" id="radiusFilter">
                                        ${t('radiusOptions').map((option, index) => `
                                            <option value="${index}" ${index === 0 ? 'selected' : ''}>${option}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                
                                <div class="col-12">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label">${t('bornAfter')}</label>
                                            <input type="text" 
                                                   class="form-control" 
                                                   id="bornAfterFilter" 
                                                   placeholder="${t('bornAfterPlaceholder')}"
                                                   pattern="\\d{2}-\\d{2}-\\d{4}"
                                                   title="${t('bornAfterPlaceholder')}">
                                            <div class="form-text">
                                                <small>Format: dag-maand-jaar (bijv. 01-01-1999)</small>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex align-items-end h-100">
                                                <button class="btn btn-outline-secondary btn-sm" id="clearDateBtn">
                                                    <i class="bi bi-x-lg"></i> Wis datum
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-12">
                                    <label class="form-label">${t('inteeltCoefficient')}</label>
                                    <div class="input-group">
                                        <input type="number" 
                                               class="form-control" 
                                               id="coiFilter" 
                                               placeholder="${t('inteeltPlaceholder')}"
                                               min="0" 
                                               max="100"
                                               step="0.1">
                                        <span class="input-group-text">%</span>
                                    </div>
                                    <div class="form-text">
                                        <small><i class="bi bi-info-circle"></i> ${t('inteeltHelp')}</small>
                                    </div>
                                </div>
                                
                                <div class="col-12">
                                    <h6 class="mt-4 mb-3">${t('healthFilter')}</h6>
                                    <div class="row g-3">
                                        ${this.generateHealthFilters(t)}
                                    </div>
                                </div>
                                
                                <div class="col-12 mt-3">
                                    <button class="btn btn-purple w-100" id="searchButton">
                                        <i class="bi bi-search"></i> ${t('searchButton')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mt-4">
                <div class="card-header">
                    <h6 class="mb-0">${t('results')}</h6>
                </div>
                <div class="card-body">
                    <div id="searchResults" class="text-center py-4">
                        <div class="text-muted">
                            <i class="bi bi-search" style="font-size: 2rem;"></i>
                            <p class="mt-2">Gebruik de zoekcriteria om reuen te vinden</p>
                            <p class="small"><i class="bi bi-info-circle"></i> ${t('pedigreeForPup')}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left"></i> ${t('back')}
            </button>
        `;
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        // Autocomplete voor teef zoeken
        const teefSearch = document.getElementById('teefSearch');
        const teefDropdown = document.getElementById('teefDropdown');
        
        teefSearch.addEventListener('input', (e) => {
            clearTimeout(this.teefInputTimer);
            const searchTerm = e.target.value.trim();
            
            if (searchTerm.length === 0) {
                teefDropdown.style.display = 'none';
                return;
            }
            
            this.teefInputTimer = setTimeout(() => {
                this.searchTeven(searchTerm);
            }, 150);
        });
        
        teefSearch.addEventListener('focus', (e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length > 0) {
                this.searchTeven(searchTerm);
            }
        });
        
        teefSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = teefSearch.value.trim();
                if (searchTerm.length > 0) {
                    this.handleManualTeefEntry(searchTerm);
                }
            }
            
            // Pijltje omlaag - navigeer in dropdown
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstItem = teefDropdown.querySelector('.autocomplete-item[data-id]');
                if (firstItem) {
                    firstItem.focus();
                }
            }
        });
        
        // Datum input validatie
        const bornAfterInput = document.getElementById('bornAfterFilter');
        bornAfterInput.addEventListener('blur', (e) => {
            this.validateDateInput(e.target);
        });
        
        bornAfterInput.addEventListener('input', (e) => {
            // Auto-format datum: voeg streepjes toe
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value.length > 2 && value.length <= 4) {
                value = value.substring(0, 2) + '-' + value.substring(2);
            } else if (value.length > 4) {
                value = value.substring(0, 2) + '-' + value.substring(2, 4) + '-' + value.substring(4, 8);
            }
            e.target.value = value;
        });
        
        // Wis datum knop
        document.getElementById('clearDateBtn').addEventListener('click', () => {
            bornAfterInput.value = '';
            bornAfterInput.classList.remove('is-invalid');
        });
        
        // COI input validatie
        const coiInput = document.getElementById('coiFilter');
        coiInput.addEventListener('blur', (e) => {
            this.validateCOIInput(e.target);
        });
        
        document.getElementById('searchButton').addEventListener('click', () => {
            this.performSearch();
        });
        
        // Sluit dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!teefDropdown.contains(e.target) && e.target.id !== 'teefSearch') {
                teefDropdown.style.display = 'none';
            }
        });
    }
    
    async initStamboomManager() {
        try {
            if (this.db && typeof StamboomManager !== 'undefined') {
                this.stamboomManager = new StamboomManager(this.db, this.currentLang);
                await this.stamboomManager.initialize();
                console.log('✅ StamboomManager geïnitialiseerd vanuit ZoekReu');
            }
        } catch (error) {
            console.error('❌ Fout bij initialiseren StamboomManager:', error);
        }
    }
    
    async showReuPedigree(reuId, reuName) {
        console.log(`🔄 Toon stamboom voor reu: ${reuId} - ${reuName}`);
        
        if (!this.stamboomManager) {
            console.warn('⚠️ StamboomManager niet beschikbaar, probeer te initialiseren...');
            await this.initStamboomManager();
            
            if (!this.stamboomManager) {
                this.showAlert('Stamboomfunctionaliteit is niet beschikbaar op dit moment.', 'warning');
                return;
            }
        }
        
        const reu = this.hondenData.find(h => h.id == reuId);
        
        if (!reu) {
            this.showAlert('Kon reu gegevens niet vinden.', 'warning');
            return;
        }
        
        try {
            await this.stamboomManager.showPedigree(reu);
            console.log('✅ Stamboom getoond voor:', reu.naam);
        } catch (error) {
            console.error('❌ Fout bij tonen stamboom:', error);
            this.showAlert('Er ging iets mis bij het tonen van de stamboom.', 'danger');
        }
    }
    
    generateHealthFilters(t) {
        const healthFilters = [
            { key: 'heupdysplasie', label: t('heupdysplasie') },
            { key: 'patellaluxatie', label: t('patellaluxatie') },
            { key: 'ogen', label: t('ogen') },
            { key: 'dandyWalker', label: t('dandyWalker') },
            { key: 'schildklier', label: t('schildklier') },
            { key: 'elleboogdysplasie', label: t('elleboogdysplasie') }
        ];
        
        return healthFilters.map(filter => `
            <div class="col-md-6">
                <label class="form-label">${filter.label}</label>
                <select class="form-select health-filter" data-filter="${filter.key}">
                    <option value="">${t('anyHealth')}</option>
                    ${t('healthOptions')[filter.key].map(option => {
                        const label = t('healthLabels')[filter.key][option] || option;
                        return `<option value="${option}">${label}</option>`;
                    }).join('')}
                </select>
                </div>
        `).join('');
    }
    
    async getHonden() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                return await this.db.getHonden();
            }
            return [];
        } catch (error) {
            console.error('Fout bij ophalen honden:', error);
            return [];
        }
    }
    
    searchTeven(searchTerm) {
        const t = this.t.bind(this);
        
        if (!searchTerm || searchTerm.length === 0) {
            document.getElementById('teefDropdown').style.display = 'none';
            return;
        }
        
        const searchTerms = searchTerm.toLowerCase().split(' ');
        
        // Filter teven op ALLE zoektermen (AND logica)
        const filteredTeven = this.allTeven.filter(teef => {
            const searchableText = `
                ${teef.naam || ''}
                ${teef.kennelnaam || ''}
                ${teef.stamboomnr || ''}
            `.toLowerCase();
            
            return searchTerms.every(term => 
                searchableText.includes(term)
            );
        });
        
        filteredTeven.sort((a, b) => {
            const aName = (a.naam || '').toLowerCase();
            const bName = (b.naam || '').toLowerCase();
            const aKennel = (a.kennelnaam || '').toLowerCase();
            const bKennel = (b.kennelnaam || '').toLowerCase();
            
            if (aName === searchTerm.toLowerCase() && bName !== searchTerm.toLowerCase()) return -1;
            if (bName === searchTerm.toLowerCase() && aName !== searchTerm.toLowerCase()) return 1;
            
            if (aName.startsWith(searchTerm.toLowerCase()) && !bName.startsWith(searchTerm.toLowerCase())) return -1;
            if (bName.startsWith(searchTerm.toLowerCase()) && !aName.startsWith(searchTerm.toLowerCase())) return 1;
            
            if (aKennel.includes(searchTerm.toLowerCase()) && !bKennel.includes(searchTerm.toLowerCase())) return -1;
            if (bKennel.includes(searchTerm.toLowerCase()) && !aKennel.includes(searchTerm.toLowerCase())) return 1;
            
            return aName.localeCompare(bName);
        });
        
        this.showTeefDropdown(filteredTeven, searchTerm);
    }
    
    showTeefDropdown(teven, searchTerm) {
        const t = this.t.bind(this);
        const dropdown = document.getElementById('teefDropdown');
        const resultsDiv = document.getElementById('teefResults');
        const countSpan = document.getElementById('teefCount');
        
        if (teven.length === 0) {
            resultsDiv.innerHTML = `
                <div class="autocomplete-item text-muted p-3 text-center">
                    <i class="bi bi-search me-2"></i>Geen teven gevonden
                    <br>
                    <small>Typ een andere naam of gebruik spatie om te combineren</small>
                </div>
                <div class="autocomplete-item" data-manual="${searchTerm}">
                    <div class="fw-bold text-primary">
                        <i class="bi bi-plus-circle me-2"></i>Handmatig invullen
                    </div>
                    <div class="small text-muted">
                        "${searchTerm}"
                    </div>
                </div>
            `;
            countSpan.textContent = '0';
            dropdown.style.display = 'block';
        } else {
            countSpan.textContent = teven.length;
            
            const displayTeven = teven.slice(0, 15);
            
            resultsDiv.innerHTML = displayTeven.map(teef => {
                const highlightText = (text) => {
                    if (!text || !searchTerm) return text || '';
                    const lowerText = text.toLowerCase();
                    const lowerSearch = searchTerm.toLowerCase();
                    const index = lowerText.indexOf(lowerSearch);
                    
                    if (index === -1) return text;
                    
                    return text.substring(0, index) + 
                           '<mark>' + text.substring(index, index + searchTerm.length) + '</mark>' + 
                           text.substring(index + searchTerm.length);
                };
                
                const displayName = teef.naam ? 
                    `${highlightText(teef.naam)} ${teef.kennelnaam ? `${highlightText(teef.kennelnaam)}` : ''}` : 
                    t('unknown');
                
                return `
                    <div class="autocomplete-item" data-id="${teef.id}" tabindex="0">
                        <div class="fw-bold">${displayName}</div>
                        <div class="small text-muted">
                            ${teef.stamboomnr ? 'Stamboom: ' + teef.stamboomnr : ''}
                            ${teef.ras ? ' • Ras: ' + teef.ras : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            if (teven.length > 15) {
                resultsDiv.innerHTML += `
                    <div class="autocomplete-item text-muted p-2 text-center">
                        <small>En nog ${teven.length - 15} meer... blijf typen om te verfijnen</small>
                    </div>
                `;
            }
            
            dropdown.style.display = 'block';
        }
        
        resultsDiv.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const teefId = item.getAttribute('data-id');
                const manualEntry = item.getAttribute('data-manual');
                
                if (teefId) {
                    this.selectTeef(teefId);
                } else if (manualEntry) {
                    this.handleManualTeefEntry(manualEntry);
                }
                
                dropdown.style.display = 'none';
                document.getElementById('teefSearch').value = '';
            });
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    item.click();
                }
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = item.nextElementSibling;
                    if (next && next.classList.contains('autocomplete-item')) {
                        next.focus();
                    }
                }
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = item.previousElementSibling;
                    if (prev && prev.classList.contains('autocomplete-item')) {
                        prev.focus();
                    } else {
                        document.getElementById('teefSearch').focus();
                    }
                }
            });
        });
    }
    
    validateDateInput(input) {
        const t = this.t.bind(this);
        const value = input.value.trim();
        
        if (value === '') {
            input.classList.remove('is-invalid');
            return true;
        }
        
        const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!dateRegex.test(value)) {
            input.classList.add('is-invalid');
            return false;
        }
        
        const [, day, month, year] = value.match(dateRegex);
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        if (yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
            input.classList.add('is-invalid');
            return false;
        }
        
        if (monthNum < 1 || monthNum > 12) {
            input.classList.add('is-invalid');
            return false;
        }
        
        const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
        if (dayNum < 1 || dayNum > daysInMonth) {
            input.classList.add('is-invalid');
            return false;
        }
        
        input.classList.remove('is-invalid');
        return true;
    }
    
    validateCOIInput(input) {
        const t = this.t.bind(this);
        const value = parseFloat(input.value);
        
        if (input.value === '') {
            input.classList.remove('is-invalid');
            return true;
        }
        
        if (isNaN(value) || value < 0 || value > 100) {
            input.classList.add('is-invalid');
            this.showAlert(t('invalidCOI'), 'danger');
            return false;
        }
        
        if (value > 0 && (!this.selectedTeef || this.selectedTeef.manualEntry)) {
            input.classList.add('is-invalid');
            this.showAlert(t('noTeefSelected'), 'warning');
            return false;
        }
        
        input.classList.remove('is-invalid');
        return true;
    }
    
    parseDate(dateString) {
        if (!dateString) return null;
        
        const parts = dateString.split('-');
        if (parts.length !== 3) return null;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        
        const date = new Date(year, month, day);
        
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
            return null;
        }
        
        return date;
    }
    
    async selectTeef(teefId) {
        const teef = this.allTeven.find(h => h.id == teefId);
        
        if (!teef) return;
        
        this.selectedTeef = teef;
        this.updateTeefInfoDisplay(teef);
        
        const coiInput = document.getElementById('coiFilter');
        if (coiInput && coiInput.value) {
            this.validateCOIInput(coiInput);
        }
    }
    
    handleManualTeefEntry(entry) {
        this.selectedTeef = {
            id: 'manual',
            naam: entry,
            manualEntry: true
        };
        
        this.updateTeefInfoDisplay(this.selectedTeef);
        
        const coiInput = document.getElementById('coiFilter');
        if (coiInput && coiInput.value) {
            this.validateCOIInput(coiInput);
        }
    }
    
    getHealthColor(value, type) {
        if (!value || value === '' || value === '?' || value === 'Onbekend') {
            return 'text-danger fw-bold';
        }
        
        const lowerValue = value.toLowerCase().trim();
        
        switch(type) {
            case 'hd':
                if (lowerValue === 'a') return 'text-success fw-bold';
                if (lowerValue === 'b') return 'text-warning fw-bold';
                if (lowerValue === 'c') return 'text-orange fw-bold';
                if (lowerValue === 'd' || lowerValue === 'e') return 'text-danger fw-bold';
                break;
                
            case 'pl':
                if (lowerValue === '0' || lowerValue === '0') return 'text-success fw-bold';
                if (lowerValue === '1' || lowerValue === '1') return 'text-orange fw-bold';
                if (lowerValue === '2' || lowerValue === '2' || lowerValue === '3' || lowerValue === '3') return 'text-danger fw-bold';
                break;
                
            case 'ogen':
                if (lowerValue === 'vrij') return 'text-success fw-bold';
                if (lowerValue.includes('dist')) return 'text-warning fw-bold';
                if (lowerValue === 'overig') return 'text-danger fw-bold';
                break;
                
            case 'dw':
                if (lowerValue.includes('vrij op dna') || lowerValue.includes('vrij dna')) return 'text-success fw-bold';
                if (lowerValue.includes('vrij op ouders') || lowerValue.includes('vrij ouders')) return 'text-success fw-bold';
                if (lowerValue.includes('drager') || lowerValue.includes('carrier')) return 'text-orange fw-bold';
                if (lowerValue.includes('lijder') || lowerValue.includes('affected')) return 'text-danger fw-bold';
                break;
                
            case 'schildklier':
                if (lowerValue === 'tgaa negatief' || lowerValue === 'negatief' || lowerValue === 'tg aa negatief') {
                    return 'text-success fw-bold';
                }
                return 'text-danger fw-bold';
                
            case 'ed':
                if (lowerValue === '0' || lowerValue === '0') return 'text-success fw-bold';
                if (lowerValue === '1' || lowerValue === '1') return 'text-orange fw-bold';
                if (lowerValue === '2' || lowerValue === '2' || lowerValue === '3' || lowerValue === 'ed3') return 'text-danger fw-bold';
                break;
        }
        
        return 'text-danger fw-bold';
    }
    
    getCOIColor(value) {
        if (value <= 5) return 'text-success fw-bold';
        if (value <= 10) return 'text-warning fw-bold';
        if (value <= 20) return 'text-orange fw-bold';
        return 'text-danger fw-bold';
    }
    
    updateTeefInfoDisplay(teef) {
        const t = this.t.bind(this);
        const infoDiv = document.getElementById('selectedTeefInfo');
        
        if (teef.manualEntry) {
            infoDiv.innerHTML = `
                <h6>${teef.naam}</h6>
                <div class="alert alert-warning small p-2 mb-2">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    <small>Handmatig ingevoerde teef</small>
                </div>
                <div class="text-muted">
                    <p class="small mb-2"><i class="bi bi-info-circle"></i> COI berekening is niet beschikbaar voor handmatige invoer.</p>
                </div>
                <hr class="my-2">
                <div class="text-end">
                    <button class="btn btn-sm btn-outline-purple" id="clearTeefBtn">
                        <i class="bi bi-x"></i> Wis selectie
                    </button>
                </div>
            `;
        } else {
            let teefCOI = { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            if (this.coiCalculator && teef.id) {
                try {
                    teefCOI = this.coiCalculator.calculateCOI(teef.id);
                } catch (error) {
                    console.error('Fout bij COI berekening teef:', error);
                }
            }
            
            infoDiv.innerHTML = `
                <h6 class="mb-2">${teef.naam || 'Onbekend'} ${teef.kennelnaam ? teef.kennelnaam : ''}</h6>
                <div class="mb-3">
                    <strong>Stamboom:</strong> ${teef.stamboomnr || '-'}
                    <br>
                    <strong>${t('coi6Gen')}:</strong> <span class="${this.getCOIColor(parseFloat(teefCOI.coi6Gen))}">${teefCOI.coi6Gen}%</span>
                    <br>
                    <strong>${t('coiAllGen')}:</strong> <span class="${this.getCOIColor(parseFloat(teefCOI.coiAllGen))}">${teefCOI.coiAllGen}%</span>
                </div>
                
                <div class="row mb-2">
                    <div class="col-6">
                        <div class="small">
                            <strong>HD:</strong> 
                            <span class="${this.getHealthColor(teef.heupdysplasie, 'hd')}">
                                ${teef.heupdysplasie || '?'}
                            </span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="small">
                            <strong>PL:</strong> 
                            <span class="${this.getHealthColor(teef.patella, 'pl')}">
                                ${teef.patella || '?'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="row mb-2">
                    <div class="col-6">
                        <div class="small">
                            <strong>Ogen:</strong> 
                            <span class="${this.getHealthColor(teef.ogen, 'ogen')}">
                                ${teef.ogen || '?'}
                            </span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="small">
                            <strong>Dandy Walker:</strong> 
                            <span class="${this.getHealthColor(teef.dandyWalker, 'dw')}">
                                ${teef.dandyWalker || '?'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <div class="small">
                            <strong>Tgaa:</strong> 
                            <span class="${this.getHealthColor(teef.schildklier, 'schildklier')}">
                                ${teef.schildklier || '?'}
                            </span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="small">
                            <strong>ED:</strong> 
                            <span class="${this.getHealthColor(teef.elleboogdysplasie, 'ed')}">
                                ${teef.elleboogdysplasie || '?'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <hr class="my-2">
                <div class="text-end">
                    <button class="btn btn-sm btn-outline-purple" id="clearTeefBtn">
                        <i class="bi bi-x"></i> Wis selectie
                    </button>
                </div>
            `;
        }
        
        document.getElementById('clearTeefBtn').addEventListener('click', () => {
            this.selectedTeef = null;
            infoDiv.innerHTML = `
                <div class="text-muted text-center">
                    <i class="bi bi-gender-female"></i>
                    <p class="mb-0 mt-2">Selecteer een teef om te beginnen</p>
                </div>
            `;
            
            const coiInput = document.getElementById('coiFilter');
            if (coiInput && coiInput.value) {
                this.validateCOIInput(coiInput);
            }
        });
    }
    
    calculateFuturePupCOI(teefId, reuId) {
        if (!this.coiCalculator || !teefId || !reuId || teefId === 'manual') {
            return { coi6Gen: '0.0', coiAllGen: '0.0', reuCOI6: '0.0', reuCOI25: '0.0' };
        }
        
        try {
            // Bereken de COI voor de toekomstige pup
            // Dit gebruikt dezelfde logica als de COICalculator voor nakomelingen
            
            // Eerst, haal de individuele COI waarden op
            const teefCOI = this.coiCalculator.calculateCOI(teefId);
            const reuCOI = this.coiCalculator.calculateCOI(reuId);
            
            // Nu berekenen we de COI voor de nakomeling
            // Dit is complexe genetica, maar de basis formule is:
            // COI_nakomeling = (COI_teef + COI_reu) / 2 + extra_inteelt_van_ouders
            
            const teef6 = parseFloat(teefCOI.coi6Gen) || 0;
            const reu6 = parseFloat(reuCOI.coi6Gen) || 0;
            const teef25 = parseFloat(teefCOI.coiAllGen) || 0;
            const reu25 = parseFloat(reuCOI.coiAllGen) || 0;
            
            // Controleer of de ouders verwant zijn
            // Als ze broer/zus zijn: COI = 25%
            // Als ze half broer/zus zijn: COI = 12.5%
            // Als ze neef/nicht zijn: COI = 6.25%
            
            // Simpele berekening voor nu: gemiddelde + extra voor gemeenschappelijke voorouders
            // Hoe meer gemeenschappelijke voorouders, hoe hoger de COI
            
            // Bepaal verwantschapsgraad
            let relationshipFactor = 0;
            
            // Controleer op directe familie relaties
            const teefHond = this.hondenData.find(h => h.id == teefId);
            const reuHond = this.hondenData.find(h => h.id == reuId);
            
            if (teefHond && reuHond) {
                // Controleer op zelfde ouders
                if (teefHond.vader_id && reuHond.vader_id && 
                    teefHond.vader_id === reuHond.vader_id &&
                    teefHond.moeder_id && reuHond.moeder_id &&
                    teefHond.moeder_id === reuHond.moeder_id) {
                    // Volle broer/zus: COI = 25%
                    relationshipFactor = 25;
                } else if ((teefHond.vader_id && reuHond.vader_id && 
                          teefHond.vader_id === reuHond.vader_id) ||
                         (teefHond.moeder_id && reuHond.moeder_id && 
                          teefHond.moeder_id === reuHond.moeder_id)) {
                    // Half broer/zus: COI = 12.5%
                    relationshipFactor = 12.5;
                } else {
                    // Geen directe relatie bekend, gebruik statistische berekening
                    // Hoe hoger de individuele COI's, hoe groter de kans op gemeenschappelijke voorouders
                    const avgCOI = (teef25 + reu25) / 2;
                    relationshipFactor = Math.min(avgCOI * 0.5, 15); // Max 15% extra
                }
            }
            
            // Toekomstige pup COI = gemiddelde van ouders + relatie factor
            const pupCOI6 = ((teef6 + reu6) / 2) + (relationshipFactor * 0.5); // Minder voor 6 gen
            const pupCOI25 = ((teef25 + reu25) / 2) + relationshipFactor;
            
            return {
                coi6Gen: Math.min(pupCOI6, 100).toFixed(1),
                coiAllGen: Math.min(pupCOI25, 100).toFixed(1),
                reuCOI6: reu6.toFixed(1),
                reuCOI25: reu25.toFixed(1)
            };
            
        } catch (error) {
            console.error('Fout bij toekomstige pup COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0', reuCOI6: '0.0', reuCOI25: '0.0' };
        }
    }
    
    async performSearch() {
        const t = this.t.bind(this);
        const resultsDiv = document.getElementById('searchResults');
        
        const bornAfterInput = document.getElementById('bornAfterFilter');
        if (!this.validateDateInput(bornAfterInput)) {
            this.showAlert(t('invalidDate'), 'danger');
            return;
        }
        
        const coiInput = document.getElementById('coiFilter');
        if (coiInput && !this.validateCOIInput(coiInput)) {
            return;
        }
        
        resultsDiv.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">Zoeken...</span>
                </div>
                <p class="mt-3">Zoeken naar geschikte reuen...</p>
                <p class="small text-muted">${t('calculatingCOI')}</p>
            </div>
        `;
        
        const criteria = this.getSearchCriteria();
        
        // Gebruik de reeds geladen honden data
        let reuen = this.hondenData.filter(h => h.geslacht === 'reuen');
        
        console.log(`🔍 Start zoeken met ${reuen.length} reuen, COI filter: ${criteria.maxCOI}%`);
        
        if (criteria.ras) {
            reuen = reuen.filter(r => r.ras === criteria.ras);
            console.log(`   ➡ Na ras filter: ${reuen.length} reuen`);
        }
        
        if (criteria.bornAfter) {
            const minDate = this.parseDate(criteria.bornAfter);
            if (minDate) {
                reuen = reuen.filter(r => {
                    if (!r.geboortedatum) return false;
                    
                    try {
                        const reuDate = this.parseHondenDate(r.geboortedatum);
                        return reuDate && reuDate >= minDate;
                    } catch (e) {
                        return false;
                    }
                });
                console.log(`   ➡ Na datum filter: ${reuen.length} reuen`);
            }
        }
        
        reuen = this.filterByHealth(reuen, criteria.health);
        console.log(`   ➡ Na gezondheidsfilter: ${reuen.length} reuen`);
        
        // BEREKEN COI VOOR TOEKOMSTIGE PUP VOOR ALLE REUEN
        reuen = await this.calculateFuturePupCOIForAllReuen(reuen);
        console.log(`   ➡ Toekomstige pup COI berekeningen voltooid`);
        
        // Filter op COI van toekomstige pup
        if (criteria.maxCOI > 0 && this.selectedTeef && !this.selectedTeef.manualEntry && this.selectedTeef.id) {
            reuen = this.filterByFuturePupCOI(reuen, criteria.maxCOI);
            console.log(`   ➡ Na toekomstige pup COI filter (max ${criteria.maxCOI}%): ${reuen.length} reuen`);
        }
        
        reuen = this.sortByHealthScore(reuen);
        
        setTimeout(() => {
            if (reuen.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        <strong>${t('noResults')}</strong><br>
                        ${t('tryAgain')}
                    </div>
                `;
            } else {
                resultsDiv.innerHTML = `
                    <div class="table-responsive">
                        <table class="table table-hover table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th>${t('resultColumns').naam}</th>
                                    <th>${t('resultColumns').geboortedatum}</th>
                                    <th>${t('resultColumns').hd}</th>
                                    <th>${t('resultColumns').pl}</th>
                                    <th>${t('resultColumns').ogen}</th>
                                    <th>${t('resultColumns').dw}</th>
                                    <th>${t('resultColumns').schildklier}</th>
                                    <th>${t('resultColumns').ed}</th>
                                    <th>${t('resultColumns').locatie}</th>
                                    <th>${t('resultColumns').coi}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateResultsTable(reuen, t, criteria.maxCOI)}
                            </tbody>
                        </table>
                    </div>
                    <div class="text-muted text-center mt-3">
                        <small>${reuen.length} reuen gevonden</small>
                        ${criteria.maxCOI > 0 ? `<br><small>Maximale COI toekomstige pup: ${criteria.maxCOI}%</small>` : ''}
                        ${this.selectedTeef && !this.selectedTeef.manualEntry ? `<br><small>Toont COI van toekomstige pup met ${this.selectedTeef.naam}</small>` : ''}
                        ${this.selectedTeef && !this.selectedTeef.manualEntry ? `<br><small><i class="bi bi-info-circle"></i> ${t('pedigreeForPup')}</small>` : ''}
                        <br><small><i class="bi bi-info-circle"></i> ${t('pedigreeTooltip')}</small>
                    </div>
                `;
                
                this.attachReuNameClickEvents();
            }
        }, 500);
    }
    
    async calculateFuturePupCOIForAllReuen(reuen) {
        if (!this.selectedTeef || this.selectedTeef.manualEntry || !this.selectedTeef.id) {
            return reuen.map(reu => {
                reu._futurePupCOI = { coi6Gen: '0.0', coiAllGen: '0.0', reuCOI6: '0.0', reuCOI25: '0.0' };
                reu._futurePupCOIPasses = false;
                return reu;
            });
        }
        
        const teefId = this.selectedTeef.id;
        
        return reuen.map(reu => {
            if (!reu.id) {
                reu._futurePupCOI = { coi6Gen: '0.0', coiAllGen: '0.0', reuCOI6: '0.0', reuCOI25: '0.0' };
                reu._futurePupCOIPasses = false;
                return reu;
            }
            
            try {
                // Bereken de COI van de toekomstige pup
                const futurePupCOI = this.calculateFuturePupCOI(teefId, reu.id);
                const pupCOIValue = parseFloat(futurePupCOI.coiAllGen) || 0;
                
                reu._futurePupCOI = futurePupCOI;
                reu._futurePupCOIPasses = true;
                
                // Log voor debugging
                if (reu._futurePupCOI.coiAllGen > '25') {
                    console.log(`⚠️ Hoog COI gevonden: ${reu.naam} - Pup COI: ${futurePupCOI.coiAllGen}% (Reu COI: ${futurePupCOI.reuCOI25}%)`);
                }
                
                return reu;
                
            } catch (error) {
                console.error(`Fout bij toekomstige pup COI berekening reu ${reu.id}:`, error);
                reu._futurePupCOI = { coi6Gen: '0.0', coiAllGen: '0.0', reuCOI6: '0.0', reuCOI25: '0.0' };
                reu._futurePupCOIPasses = false;
                return reu;
            }
        });
    }
    
    filterByFuturePupCOI(reuen, maxCOI) {
        if (maxCOI <= 0) {
            return reuen;
        }
        
        console.log(`🔬 Filteren op toekomstige pup COI: max ${maxCOI}%`);
        
        return reuen.filter(reu => {
            if (!reu._futurePupCOI) return false;
            
            const pupCOIValue = parseFloat(reu._futurePupCOI.coiAllGen) || 0;
            const passes = pupCOIValue <= maxCOI;
            
            reu._futurePupCOIPasses = passes;
            
            if (!passes) {
                console.log(`   ➡ ${reu.naam}: TOEKOMSTIGE PUP COI=${pupCOIValue}% → FAIL (max ${maxCOI}%)`);
            }
            
            return passes;
        });
    }
    
    attachReuNameClickEvents() {
        const nameCells = document.querySelectorAll('#searchResults td:first-child');
        
        nameCells.forEach(cell => {
            const row = cell.closest('tr');
            if (row && row.dataset && row.dataset.reuId) {
                const reuId = row.dataset.reuId;
                const reuName = cell.textContent.trim();
                
                cell.style.cursor = 'pointer';
                cell.classList.add('text-primary', 'fw-bold');
                cell.title = this.t('pedigreeTooltip');
                
                cell.addEventListener('mouseenter', () => {
                    cell.style.textDecoration = 'underline';
                    cell.classList.add('text-decoration-underline');
                });
                
                cell.addEventListener('mouseleave', () => {
                    cell.style.textDecoration = 'none';
                    cell.classList.remove('text-decoration-underline');
                });
                
                cell.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showReuPedigree(reuId, reuName);
                });
            }
        });
    }
    
    parseHondenDate(dateString) {
        if (!dateString) return null;
        
        let date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date;
        }
        
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        
        const parts2 = dateString.split('-');
        if (parts2.length === 3 && parts2[0].length === 4) {
            const year = parseInt(parts2[0], 10);
            const month = parseInt(parts2[1], 10) - 1;
            const day = parseInt(parts2[2], 10);
            date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        
        const cleaned = dateString.replace(/[./]/g, '-');
        const parts3 = cleaned.split('-');
        if (parts3.length === 3) {
            if (parts3[0].length === 4) {
                const year = parseInt(parts3[0], 10);
                const month = parseInt(parts3[1], 10) - 1;
                const day = parseInt(parts3[2], 10);
                date = new Date(year, month, day);
            } else {
                const day = parseInt(parts3[0], 10);
                const month = parseInt(parts3[1], 10) - 1;
                const year = parseInt(parts3[2], 10);
                date = new Date(year, month, day);
            }
            
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        
        return null;
    }
    
    getSearchCriteria() {
        const coiInput = document.getElementById('coiFilter');
        const coiValue = coiInput ? parseFloat(coiInput.value) || 0 : 0;
        
        const criteria = {
            ras: document.getElementById('rasFilter').value,
            radius: document.getElementById('radiusFilter').value,
            bornAfter: document.getElementById('bornAfterFilter').value.trim(),
            maxCOI: coiValue,
            health: {}
        };
        
        document.querySelectorAll('.health-filter').forEach(select => {
            const filterType = select.dataset.filter;
            const value = select.value;
            if (value) {
                criteria.health[filterType] = value;
            }
        });
        
        return criteria;
    }
    
    filterByHealth(reuen, healthCriteria) {
        if (Object.keys(healthCriteria).length === 0) {
            return reuen;
        }
        
        return reuen.filter(reu => {
            for (const [test, selectedValue] of Object.entries(healthCriteria)) {
                const reuValue = reu[this.getHealthFieldName(test)];
                
                if (test === 'schildklier') {
                    const passes = this.meetsSchildklierRequirement(reuValue, selectedValue);
                    if (!passes) return false;
                    continue;
                }
                
                if (!reuValue || reuValue === '' || reuValue === '?' || reuValue.toLowerCase() === 'onbekend') {
                    if (test === 'patellaluxatie' && (selectedValue === 'Niet getest' || selectedValue === 'Not tested')) {
                        continue;
                    } else if (test === 'ogen' && (selectedValue === 'Niet onderzocht' || selectedValue === 'Not examined')) {
                        continue;
                    } else if (selectedValue === 'Niet getest' || selectedValue === 'Not tested') {
                        continue;
                    }
                    return false;
                }
                
                if (!this.meetsMaximumRequirement(test, reuValue, selectedValue)) {
                    return false;
                }
            }
            return true;
        });
    }
    
    meetsSchildklierRequirement(reuValue, selectedValue) {
        if (!reuValue || reuValue === '' || reuValue === '?' || reuValue.toLowerCase() === 'onbekend') {
            return selectedValue === 'Niet getest' || 
                   selectedValue === 'Not tested' || 
                   selectedValue === 'Niet getest';
        }
        
        const normalizedReuValue = reuValue.toLowerCase().trim();
        
        if (selectedValue === 'Tgaa Negatief' || selectedValue === 'Tgaa Negative' || selectedValue === 'Tgaa Negativ') {
            return normalizedReuValue === 'tgaa negatief' || 
                   normalizedReuValue === 'negatief' ||
                   normalizedReuValue === 'tgaa negative' ||
                   normalizedReuValue === 'negative' ||
                   normalizedReuValue === 'tgaa negativ' ||
                   normalizedReuValue === 'negativ' ||
                   normalizedReuValue === 'tg aa negatief' ||
                   normalizedReuValue === 'tg aa negatief' ||
                   normalizedReuValue === 'tg aa negatief';
        }
        
        if (selectedValue === 'Niet getest' || selectedValue === 'Not tested' || selectedValue === 'Niet getest') {
            return normalizedReuValue === 'niet getest' ||
                   normalizedReuValue === 'not tested' ||
                   normalizedReuValue === '' ||
                   reuValue === '' ||
                   reuValue === null ||
                   normalizedReuValue === 'tgaa negatief' || 
                   normalizedReuValue === 'negatief' ||
                   normalizedReuValue === 'tgaa negative' ||
                   normalizedReuValue === 'negative' ||
                   normalizedReuValue === 'tgaa negativ' ||
                   normalizedReuValue === 'negativ' ||
                   normalizedReuValue === 'tg aa negatief' ||
                   normalizedReuValue === 'tg aa negatief' ||
                   normalizedReuValue === 'tg aa negatief';
        }
        
        return false;
    }
    
    meetsMaximumRequirement(test, reuValue, maxValue) {
        const normalizedReuValue = reuValue ? reuValue.toString().trim() : '';
        const normalizedMaxValue = maxValue ? maxValue.toString().trim() : '';
        
        switch(test) {
            case 'heupdysplasie':
                const hdOrder = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
                const hdScoreReu = hdOrder[normalizedReuValue] !== undefined ? hdOrder[normalizedReuValue] : 99;
                const hdScoreMax = hdOrder[normalizedMaxValue] !== undefined ? hdOrder[normalizedMaxValue] : 99;
                return hdScoreReu <= hdScoreMax;
                
            case 'patellaluxatie':
                const plOrder = { '0': 0, '1': 1, '2': 2, '3': 3, 'Niet getest': 4 };
                const plScoreReu = plOrder[normalizedReuValue] !== undefined ? plOrder[normalizedReuValue] : 
                                  (normalizedReuValue === 'Niet getest' || normalizedReuValue === 'Not tested' ? 4 : 99);
                const plScoreMax = plOrder[normalizedMaxValue] !== undefined ? plOrder[normalizedMaxValue] : 99;
                
                if (normalizedMaxValue === 'Niet getest' || normalizedMaxValue === 'Not tested') {
                    return plScoreReu <= 4 && plScoreReu !== 2 && plScoreReu !== 3;
                }
                return plScoreReu <= plScoreMax && plScoreReu !== 2 && plScoreReu !== 3;
                
            case 'ogen':
                let reuOgenValue = normalizedReuValue;
                let maxOgenValue = normalizedMaxValue;
                
                if (maxOgenValue === 'Dist' || maxOgenValue === 'Distichiasis') {
                    if (reuOgenValue === 'Vrij' || reuOgenValue === 'Dist' || reuOgenValue === 'Distichiasis') {
                        return true;
                    }
                    return false;
                }
                
                if (maxOgenValue === 'Overig') {
                    if (reuOgenValue === 'Vrij' || 
                        reuOgenValue === 'Dist' || 
                        reuOgenValue === 'Distichiasis' || 
                        reuOgenValue === 'Overig') {
                        return true;
                    }
                    return false;
                }
                
                if (maxOgenValue === 'Niet onderzocht' || maxOgenValue === 'Not examined') {
                    return true;
                }
                
                if (maxOgenValue === 'Vrij') {
                    return reuOgenValue === 'Vrij';
                }
                
                if (maxOgenValue === 'Free') {
                    return reuOgenValue === 'Free' || reuOgenValue === 'Vrij';
                }
                
                if (maxOgenValue === 'Other') {
                    return reuOgenValue === 'Free' || reuOgenValue === 'Vrij' || 
                           reuOgenValue === 'Dist' || reuOgenValue === 'Distichiasis' ||
                           reuOgenValue === 'Other' || reuOgenValue === 'Overig';
                }
                
                return normalizedReuValue === normalizedMaxValue;
                
            case 'dandyWalker':
                if (!normalizedMaxValue || normalizedMaxValue === '') {
                    return true;
                }
                
                if (normalizedReuValue.includes('lijder') || normalizedReuValue.includes('affected')) {
                    return false;
                }
                
                if (normalizedMaxValue === 'Vrij op DNA') {
                    return normalizedReuValue.includes('vrij op dna') || normalizedReuValue.includes('vrij dna');
                }
                
                if (normalizedMaxValue === 'Vrij op ouders') {
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders');
                }
                
                if (normalizedMaxValue === 'Drager') {
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders') ||
                           normalizedReuValue.includes('drager') ||
                           normalizedReuValue.includes('carrier');
                }
                
                if (normalizedMaxValue === 'Niet getest') {
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders') ||
                           normalizedReuValue.includes('drager') ||
                           normalizedReuValue.includes('carrier') ||
                           normalizedReuValue.includes('niet getest') ||
                           normalizedReuValue.includes('not tested');
                }
                
                return false;
                
            case 'elleboogdysplasie':
                const edOrder = { '0': 0, '1': 1, '2': 2, '3': 3, 'Niet getest': 4 };
                const edScoreReu = edOrder[normalizedReuValue] !== undefined ? edOrder[normalizedReuValue] : 99;
                const edScoreMax = edOrder[normalizedMaxValue] !== undefined ? edOrder[normalizedMaxValue] : 99;
                return edScoreReu <= edScoreMax;
                
            default:
                return normalizedReuValue === normalizedMaxValue;
        }
    }
    
    getHealthFieldName(testKey) {
        const fieldMap = {
            'heupdysplasie': 'heupdysplasie',
            'patellaluxatie': 'patella',
            'ogen': 'ogen',
            'dandyWalker': 'dandyWalker',
            'schildklier': 'schildklier',
            'elleboogdysplasie': 'elleboogdysplasie'
        };
        return fieldMap[testKey] || testKey;
    }
    
    normalizeValue(value) {
        if (!value || value === '' || value === '?') return 'onbekend';
        return value.toString().toLowerCase().trim();
    }
    
    getHDPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            'a': 1,
            'b': 2,
            'c': 3,
            'onbekend': 4,
            'd': 5,
            'e': 6
        };
        return priority[normalized] || 7;
    }
    
    getPLPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            '0': 1,
            '1': 2,
            '2': 3,
            '3': 4,
            'onbekend': 5
        };
        return priority[normalized] || 6;
    }
    
    getOgenPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            'vrij': 1,
            'dist': 2,
            'distichiasis': 2,
            'overig': 3,
            'onbekend': 4
        };
        return priority[normalized] || 5;
    }
    
    getDWPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            'vrij op dna': 1,
            'vrij op ouders': 2,
            'drager': 3,
            'onbekend': 4,
            'lijder': 5
        };
        return priority[normalized] || 6;
    }
    
    getTgaaPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            'tgaa negatief': 1,
            'negatief': 1,
            'onbekend': 2,
            'tgaa positief': 3,
            'positief': 3
        };
        return priority[normalized] || 4;
    }
    
    getEDPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            '0': 1,
            '1': 2,
            'onbekend': 3,
            '2': 4,
            '3': 5
        };
        return priority[normalized] || 6;
    }
    
    sortByHealthScore(reuen) {
        return reuen.sort((a, b) => {
            const hdA = this.getHDPriority(a.heupdysplasie);
            const hdB = this.getHDPriority(b.heupdysplasie);
            if (hdA !== hdB) return hdA - hdB;
            
            const plA = this.getPLPriority(a.patella);
            const plB = this.getPLPriority(b.patella);
            if (plA !== plB) return plA - plB;
            
            const ogenA = this.getOgenPriority(a.ogen);
            const ogenB = this.getOgenPriority(b.ogen);
            if (ogenA !== ogenB) return ogenA - ogenB;
            
            const dwA = this.getDWPriority(a.dandyWalker);
            const dwB = this.getDWPriority(b.dandyWalker);
            if (dwA !== dwB) return dwA - dwB;
            
            const tgaaA = this.getTgaaPriority(a.schildklier);
            const tgaaB = this.getTgaaPriority(b.schildklier);
            if (tgaaA !== tgaaB) return tgaaA - tgaaB;
            
            const edA = this.getEDPriority(a.elleboogdysplasie);
            const edB = this.getEDPriority(b.elleboogdysplasie);
            if (edA !== edB) return edA - edB;
            
            // Sorteer op toekomstige pup COI (lager is beter)
            const pupCOIA = parseFloat(a._futurePupCOI?.coiAllGen || '100');
            const pupCOIB = parseFloat(b._futurePupCOI?.coiAllGen || '100');
            if (pupCOIA !== pupCOIB) return pupCOIA - pupCOIB;
            
            return (a.naam || '').localeCompare(b.naam || '');
        });
    }
    
    compareHealthValue(test, valueA, valueB) {
        const orders = {
            'heupdysplasie': { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 },
            'patellaluxatie': { '0': 0, '1': 1, '2': 2, '3': 3, 'Niet getest': 4 },
            'ogen': { 'Vrij': 0, 'Dist': 1, 'Overig': 2, 'Niet onderzocht': 3 },
            'dandyWalker': { 
                'Vrij op DNA': 0, 
                'Vrij op ouders': 1, 
                'Drager': 2, 
                'Niet getest': 3
            },
            'schildklier': { 'Tgaa Negatief': 0, 'Niet getest': 1 },
            'elleboogdysplasie': { '0': 0, '1': 1, '2': 2, '3': 3, 'Niet getest': 4 }
        };
        
        const order = orders[test] || {};
        const scoreA = valueA ? (order[valueA] !== undefined ? order[valueA] : 99) : 100;
        const scoreB = valueB ? (order[valueB] !== undefined ? order[valueB] : 99) : 100;
        
        return scoreA - scoreB;
    }
    
    countKnownTests(reu) {
        const tests = [
            'heupdysplasie',
            'patella',
            'ogen',
            'dandyWalker',
            'schildklier',
            'elleboogdysplasie'
        ];
        
        return tests.filter(test => {
            const value = reu[test];
            return value && 
                   value !== '' && 
                   value !== 'Niet getest' && 
                   value !== 'Niet onderzocht' &&
                   !value.toLowerCase().includes('getest') &&
                   !value.toLowerCase().includes('onderzocht');
        }).length;
    }
    
    generateResultsTable(reuen, t, maxCOI) {
        const showCOIColumn = this.selectedTeef && !this.selectedTeef.manualEntry;
        
        return reuen.map(reu => {
            const formatValue = (value) => {
                if (!value || value === '') return '?';
                if (value.length > 10) return value.substring(0, 10) + '...';
                return value;
            };
            
            const formatDate = (dateString) => {
                if (!dateString) return '-';
                try {
                    const date = this.parseHondenDate(dateString);
                    if (date) {
                        return date.toLocaleDateString(this.currentLang, { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                    return dateString;
                } catch (e) {
                    return dateString;
                }
            };
            
            const formatTgaa = (value) => {
                if (!value || value === '' || value === '?' || value === 'Onbekend') return '?';
                const lowerValue = value.toLowerCase().trim();
                if (lowerValue.includes('negatief') || lowerValue === 'neg' || lowerValue === 'negative') return 'Neg';
                if (lowerValue.includes('positief') || lowerValue === 'pos' || lowerValue === 'positive') return 'Pos';
                if (lowerValue.includes('niet getest') || lowerValue === 'niet getest' || lowerValue === 'not tested') return 'NG';
                return value.substring(0, 3);
            };
            
            const formatOgen = (value) => {
                if (!value || value === '' || value === '?' || value === 'Onbekend') return '?';
                const lowerValue = value.toLowerCase().trim();
                if (lowerValue === 'vrij' || lowerValue === 'free') return 'Vrij';
                if (lowerValue.includes('dist') || lowerValue === 'distichiasis') return 'Dist';
                if (lowerValue === 'overig' || lowerValue === 'other') return 'Over';
                if (lowerValue.includes('niet onderzocht') || lowerValue.includes('not examined')) return 'NO';
                return value.substring(0, 4);
            };
            
            const formatDW = (value) => {
                if (!value || value === '' || value === '?' || value === 'Onbekend') return '?';
                const lowerValue = value.toLowerCase().trim();
                if (lowerValue.includes('vrij op dna') || lowerValue.includes('vrij dna')) return 'VrDNA';
                if (lowerValue.includes('vrij op ouders') || lowerValue.includes('vrij ouders')) return 'VrOud';
                if (lowerValue.includes('drager') || lowerValue.includes('carrier')) return 'Drag';
                if (lowerValue.includes('niet getest') || lowerValue.includes('not tested')) return 'NG';
                if (lowerValue.includes('lijder') || lowerValue.includes('affected')) return 'Lijdr';
                return value.substring(0, 5);
            };
            
            const displayName = reu.naam ? 
                `${reu.naam} ${reu.kennelnaam ? reu.kennelnaam : ''}`.trim() : 
                t('unknown');
            
            // Gebruik altijd de toekomstige pup COI voor weergave
            let futurePupCOI = reu._futurePupCOI || { coi6Gen: '0.0', coiAllGen: '0.0', reuCOI6: '0.0', reuCOI25: '0.0' };
            
            return `
                <tr data-reu-id="${reu.id}">
                    <td class="small reu-name-cell" data-reu-id="${reu.id}" data-reu-name="${displayName}">
                        <span class="reu-name-link" 
                              title="${t('pedigreeTooltip')}"
                              data-reu-id="${reu.id}"
                              data-reu-name="${displayName}">
                            ${displayName}
                        </span>
                    </td>
                    <td class="small text-center">${formatDate(reu.geboortedatum)}</td>
                    <td class="${this.getHealthColor(reu.heupdysplasie, 'hd')} text-center">
                        ${formatValue(reu.heupdysplasie)}
                    </td>
                    <td class="${this.getHealthColor(reu.patella, 'pl')} text-center">
                        ${formatValue(reu.patella)}
                    </td>
                    <td class="${this.getHealthColor(reu.ogen, 'ogen')} text-center">
                        ${formatOgen(reu.ogen)}
                    </td>
                    <td class="${this.getHealthColor(reu.dandyWalker, 'dw')} text-center">
                        ${formatDW(reu.dandyWalker)}
                    </td>
                    <td class="${this.getHealthColor(reu.schildklier, 'schildklier')} text-center">
                        ${formatTgaa(reu.schildklier)}
                    </td>
                    <td class="${this.getHealthColor(reu.elleboogdysplasie, 'ed')} text-center">
                        ${formatValue(reu.elleboogdysplasie)}
                    </td>
                    <td class="small text-center">${reu.land || ''}</td>
                    <td class="${this.getCOIColor(parseFloat(futurePupCOI.coiAllGen))} text-center" title="${t('pupCOI')}: ${futurePupCOI.coiAllGen}% | ${t('reuCOI')}: ${futurePupCOI.reuCOI25}%">
                        ${showCOIColumn ? `
                            <strong>${futurePupCOI.coiAllGen}%</strong>
                            <br>
                            <small class="text-muted">${futurePupCOI.coi6Gen}%</small>
                        ` : `
                            <span class="text-muted">-</span>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            if (window.uiHandler && window.uiHandler.modules && window.uiHandler.modules.breeding) {
                window.uiHandler.modules.breeding.loadMainScreen();
            } else if (window.appUI && window.appUI.modules && window.appUI.modules.breeding) {
                window.appUI.modules.breeding.loadMainScreen();
            } else {
                console.warn('Kon breeding manager niet vinden, sluit modal');
                const modal = bootstrap.Modal.getInstance(breedingModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    }
    
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.getElementById('breedingContent');
        if (content) {
            content.insertBefore(alertDiv, content.firstChild);
        }
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

const style = document.createElement('style');
style.textContent = `
    .autocomplete-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-height: 400px;
        height: auto;
        overflow-y: auto;
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 0.375rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        z-index: 1000;
    }
    
    .autocomplete-header {
        padding: 0.5rem 1rem;
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        font-size: 0.875rem;
    }
    
    .autocomplete-results {
        max-height: 350px;
        overflow-y: auto;
    }
    
    .autocomplete-item {
        padding: 0.75rem 1rem;
        cursor: pointer;
        border-bottom: 1px solid #f8f9fa;
        transition: background-color 0.2s;
    }
    
    .autocomplete-item:hover,
    .autocomplete-item:focus {
        background-color: #f8f9fa;
        outline: none;
    }
    
    .autocomplete-item:last-child {
        border-bottom: none;
    }
    
    .autocomplete-item mark {
        background-color: #fff3cd;
        padding: 0;
        font-weight: bold;
    }
    
    .text-success { color: #198754 !important; }
    .text-warning { color: #ffc107 !important; }
    .text-danger { color: #dc3545 !important; }
    .text-orange { color: #fd7e14 !important; }
    .text-muted { color: #6c757d !important; }
    .text-secondary { color: #6c757d !important; }
    
    .table-sm th, .table-sm td {
        padding: 0.2rem 0.3rem;
        font-size: 0.8rem;
        vertical-align: middle;
    }
    
    .table th {
        white-space: nowrap;
        font-weight: 600;
        background-color: #f8f9fa;
    }
    
    .table th.text-center {
        text-align: center;
    }
    
    .table td.text-center {
        text-align: center;
    }
    
    .table .small {
        font-size: 0.75rem;
        line-height: 1.2;
    }
    
    .reu-name-link {
        color: #0d6efd !important;
        font-weight: bold !important;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s;
        display: inline-block;
        padding: 2px 4px;
        border-radius: 3px;
    }
    
    .reu-name-link:hover {
        color: #0a58ca !important;
        text-decoration: underline !important;
        background-color: #f0f7ff;
        transform: translateY(-1px);
    }
    
    .reu-name-link:active {
        transform: translateY(0);
    }
    
    .reu-name-cell {
        position: relative;
    }
    
    .reu-name-link[title]:hover::after {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        z-index: 1000;
        margin-bottom: 5px;
        opacity: 0.9;
    }
    
    .autocomplete-results::-webkit-scrollbar {
        width: 8px;
    }
    
    .autocomplete-results::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    .autocomplete-results::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }
    
    .autocomplete-results::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
    
    #selectedTeefInfo h6 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }
    
    #selectedTeefInfo .row {
        margin-bottom: 0.5rem;
    }
    
    #selectedTeefInfo .small {
        font-size: 0.85rem;
    }
    
    #selectedTeefInfo hr {
        margin: 0.75rem 0;
    }
    
    #bornAfterFilter:focus {
        border-color: #6610f2;
        box-shadow: 0 0 0 0.25rem rgba(102, 16, 242, 0.25);
    }
    
    #coiFilter:focus {
        border-color: #6610f2;
        box-shadow: 0 0 0 0.25rem rgba(102, 16, 242, 0.25);
    }
    
    .input-group-text {
        background-color: #f8f9fa;
        color: #495057;
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
    }
    
    .is-invalid:focus {
        box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
    }
    
    td.text-success { font-weight: bold; }
    td.text-warning { font-weight: bold; }
    td.text-orange { font-weight: bold; }
    td.text-danger { font-weight: bold; }
    
    .table th br {
        display: block;
        content: "";
        margin-top: 2px;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .reu-name-link:active {
        animation: pulse 0.2s;
    }
    
    /* COI cell tooltip */
    td[title]:hover::after {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        z-index: 1000;
        margin-bottom: 5px;
        opacity: 0.9;
    }
`;
document.head.appendChild(style);