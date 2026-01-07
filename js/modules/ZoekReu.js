/**
 * Zoek Reu Module
 * Voor het zoeken naar geschikte reuen voor een teef
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
                inteeltCoefficient: "Inteelt coëfficiënt (COI)",
                inteeltPlaceholder: "Maximaal percentage inteelt",
                inteeltHelp: "Maximum COI in % voor combinatie met geselecteerde teef",
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
                coiResult: "Combinatie COI",
                coi6Gen: "COI 6 gen",
                coiAllGen: "COI 25 gen",
                individualCOI: "Individuele COI",
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
                    geboortedatum: "Geboortedatum",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Ogen",
                    dw: "Dandy Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Locatie",
                    coi: "Combinatie COI",
                    individualCoi: "Individueel"
                },
                unknown: "Onbekend",
                notTested: "Niet getest",
                invalidDate: "Ongeldige datum. Gebruik formaat: dd-mm-jjjj",
                invalidCOI: "Ongeldige COI waarde. Gebruik getal tussen 0 en 100",
                noTeefSelected: "Selecteer eerst een teef om COI berekening te gebruiken"
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
                inteeltCoefficient: "Inbreeding Coefficient (COI)",
                inteeltPlaceholder: "Maximum inbreeding percentage",
                inteeltHelp: "Maximum COI % for combination with selected female",
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
                coiResult: "Combination COI",
                coi6Gen: "COI 6 gen",
                coiAllGen: "COI 25 gen",
                individualCOI: "Individual COI",
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
                    geboortedatum: "Birth Date",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Eyes",
                    dw: "Dandy Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Location",
                    coi: "Combination COI",
                    individualCoi: "Individual"
                },
                unknown: "Unknown",
                notTested: "Not tested",
                invalidDate: "Invalid date. Use format: dd-mm-yyyy",
                invalidCOI: "Invalid COI value. Use number between 0 and 100",
                noTeefSelected: "Select a female first to use COI calculation"
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
                inteeltCoefficient: "Inzuchtkoeffizient (COI)",
                inteeltPlaceholder: "Maximaler Inzuchtprozentsatz",
                inteeltHelp: "Maximaler COI in % für Kombination mit ausgewählter Hündin",
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
                noResults: "Keine Rüden gefunden, die Ihren Kriterien entsprechen",
                tryAgain: "Versuchen Sie andere Suchkriterien",
                coiResult: "Kombination COI",
                coi6Gen: "COI 6 gen",
                coiAllGen: "COI 25 gen",
                individualCOI: "Individuelle COI",
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
                        "Frei op ouders": "Frei op ouders",
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
                    geboortedatum: "Geburtsdatum",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Augen",
                    dw: "Dandy Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Standort",
                    coi: "Kombination COI",
                    individualCoi: "Individuell"
                },
                unknown: "Unbekannt",
                notTested: "Niet getestet",
                invalidDate: "Ungültiges Datum. Format: dd-mm-jjjj",
                invalidCOI: "Ungültiger COI-Wert. Verwenden Sie eine Zahl zwischen 0 und 100",
                noTeefSelected: "Wählen Sie zuerst eine Hündin, um die COI-Berechnung zu verwenden"
            }
        };
    }
    
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
        
        // Initialiseer COICalculator als we de database hebben
        if (db && typeof db.getHonden === 'function') {
            this.initCOICalculator();
        }
    }
    
    async initCOICalculator() {
        try {
            const honden = await this.db.getHonden();
            this.coiCalculator = new COICalculator(honden);
            console.log('✅ COICalculator geïnitialiseerd');
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
        const honden = await this.getHonden();
        this.allTeven = honden.filter(h => h.geslacht === 'teven');
        const reuen = honden.filter(h => h.geslacht === 'reuen');
        
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
        
        // Initialiseer COICalculator als dat nog niet gebeurd is
        if (!this.coiCalculator) {
            await this.initCOICalculator();
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
            // Maak een zoekbare string van alle relevante velden
            const searchableText = `
                ${teef.naam || ''}
                ${teef.kennelnaam || ''}
                ${teef.stamboomnr || ''}
            `.toLowerCase();
            
            // Check of ALLE zoektermen voorkomen in de zoekable tekst
            return searchTerms.every(term => 
                searchableText.includes(term)
            );
        });
        
        // Sorteer: exacte naam matches eerst, dan kennelnaam, dan stamboomnr
        filteredTeven.sort((a, b) => {
            const aName = (a.naam || '').toLowerCase();
            const bName = (b.naam || '').toLowerCase();
            const aKennel = (a.kennelnaam || '').toLowerCase();
            const bKennel = (b.kennelnaam || '').toLowerCase();
            
            // Exacte naam match heeft voorrang
            if (aName === searchTerm.toLowerCase() && bName !== searchTerm.toLowerCase()) return -1;
            if (bName === searchTerm.toLowerCase() && aName !== searchTerm.toLowerCase()) return 1;
            
            // Begin van naam match
            if (aName.startsWith(searchTerm.toLowerCase()) && !bName.startsWith(searchTerm.toLowerCase())) return -1;
            if (bName.startsWith(searchTerm.toLowerCase()) && !aName.startsWith(searchTerm.toLowerCase())) return 1;
            
            // Kennelnaam match
            if (aKennel.includes(searchTerm.toLowerCase()) && !bKennel.includes(searchTerm.toLowerCase())) return -1;
            if (bKennel.includes(searchTerm.toLowerCase()) && !aKennel.includes(searchTerm.toLowerCase())) return 1;
            
            // Alfabetisch op naam
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
            
            // Toon max 15 resultaten, maar met scrollbar
            const displayTeven = teven.slice(0, 15);
            
            resultsDiv.innerHTML = displayTeven.map(teef => {
                // Markeer de zoekterm in de resultaten
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
        
        // Event listeners voor dropdown items
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
            
            // Keyboard navigatie
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
        
        // Check het format: dd-mm-jjjj
        const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!dateRegex.test(value)) {
            input.classList.add('is-invalid');
            return false;
        }
        
        const [, day, month, year] = value.match(dateRegex);
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        // Basis validatie
        if (yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
            input.classList.add('is-invalid');
            return false;
        }
        
        if (monthNum < 1 || monthNum > 12) {
            input.classList.add('is-invalid');
            return false;
        }
        
        // Check dagen per maand
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
        
        // Controleer of er een teef geselecteerd is
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
        
        // Format: dd-mm-jjjj
        const parts = dateString.split('-');
        if (parts.length !== 3) return null;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JavaScript maanden zijn 0-indexed
        const year = parseInt(parts[2], 10);
        
        // Controleer of het een geldige datum is
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        
        const date = new Date(year, month, day);
        
        // Controleer of de datum geldig is (bijvoorbeeld geen 31 februari)
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
        
        // Reset COI filter validatie als die er is
        const coiInput = document.getElementById('coiFilter');
        if (coiInput && coiInput.value) {
            this.validateCOIInput(coiInput);
        }
    }
    
    handleManualTeefEntry(entry) {
        // Creëer een tijdelijke teef object voor handmatige invoer
        this.selectedTeef = {
            id: 'manual',
            naam: entry,
            manualEntry: true
        };
        
        this.updateTeefInfoDisplay(this.selectedTeef);
        
        // COI berekening kan niet met handmatige invoer
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
            // Bereken COI voor de teef
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
            
            // Reset COI filter validatie
            const coiInput = document.getElementById('coiFilter');
            if (coiInput && coiInput.value) {
                this.validateCOIInput(coiInput);
            }
        });
    }
    
    calculateComboCOI(teefId, reuId) {
        if (!this.coiCalculator || !teefId || !reuId || teefId === 'manual') {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        try {
            // Voor een combinatie COI hebben we een complexere berekening nodig
            // Simulatie: bereken gemiddelde van de twee individuele COI waarden
            // In werkelijkheid zou dit een echte combinatieberekening moeten zijn
            
            const teefCOI = this.coiCalculator.calculateCOI(teefId);
            const reuCOI = this.coiCalculator.calculateCOI(reuId);
            
            const teef6 = parseFloat(teefCOI.coi6Gen) || 0;
            const reu6 = parseFloat(reuCOI.coi6Gen) || 0;
            const teef25 = parseFloat(teefCOI.coiAllGen) || 0;
            const reu25 = parseFloat(reuCOI.coiAllGen) || 0;
            
            // Simpele benadering: gemiddelde + extra risico voor gemeenschappelijke voorouders
            const combo6 = ((teef6 + reu6) / 2) * 1.1; // 10% extra voor combinatie
            const combo25 = ((teef25 + reu25) / 2) * 1.1;
            
            return {
                coi6Gen: Math.min(combo6, 100).toFixed(1),
                coiAllGen: Math.min(combo25, 100).toFixed(1),
                individualReu: reuCOI // Sla individuele COI van reu op voor weergave
            };
            
        } catch (error) {
            console.error('Fout bij combo COI berekening:', error);
            return { 
                coi6Gen: '0.0', 
                coiAllGen: '0.0',
                individualReu: { coi6Gen: '0.0', coiAllGen: '0.0' }
            };
        }
    }
    
    async performSearch() {
        const t = this.t.bind(this);
        const resultsDiv = document.getElementById('searchResults');
        
        // Valideer datum input
        const bornAfterInput = document.getElementById('bornAfterFilter');
        if (!this.validateDateInput(bornAfterInput)) {
            this.showAlert(t('invalidDate'), 'danger');
            return;
        }
        
        // Valideer COI input
        const coiInput = document.getElementById('coiFilter');
        if (coiInput && !this.validateCOIInput(coiInput)) {
            return;
        }
        
        // Toon laad indicator
        resultsDiv.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">Zoeken...</span>
                </div>
                <p class="mt-3">Zoeken naar geschikte reuen...</p>
                <p class="small text-muted">COI berekeningen worden uitgevoerd...</p>
            </div>
        `;
        
        // Verzamel zoekcriteria
        const criteria = this.getSearchCriteria();
        
        // Haal alle reuen op
        const honden = await this.getHonden();
        let reuen = honden.filter(h => h.geslacht === 'reuen');
        
        console.log(`🔍 Start zoeken met ${reuen.length} reuen, COI filter: ${criteria.maxCOI}%`);
        
        // Filter op ras
        if (criteria.ras) {
            reuen = reuen.filter(r => r.ras === criteria.ras);
            console.log(`   ➡ Na ras filter: ${reuen.length} reuen`);
        }
        
        // Filter op geboortedatum
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
        
        // Filter op gezondheid (minimale eisen)
        reuen = this.filterByHealth(reuen, criteria.health);
        console.log(`   ➡ Na gezondheidsfilter: ${reuen.length} reuen`);
        
        // Filter op COI als ingevuld en teef geselecteerd
        if (criteria.maxCOI > 0 && this.selectedTeef && !this.selectedTeef.manualEntry && this.selectedTeef.id) {
            reuen = this.filterByCOI(reuen, this.selectedTeef.id, criteria.maxCOI);
            console.log(`   ➡ Na COI filter (max ${criteria.maxCOI}%): ${reuen.length} reuen`);
        }
        
        // Sorteer volgens de specifieke prioriteitsvolgorde
        reuen = this.sortByHealthScore(reuen);
        
        // Toon resultaten
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
                                    <th>${t('resultColumns').individualCoi}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateResultsTable(reuen, t, criteria.maxCOI)}
                            </tbody>
                        </table>
                    </div>
                    <div class="text-muted text-center mt-3">
                        <small>${reuen.length} reuen gevonden</small>
                        ${criteria.maxCOI > 0 ? `<br><small>Maximale COI: ${criteria.maxCOI}%</small>` : ''}
                        ${this.selectedTeef && !this.selectedTeef.manualEntry ? `<br><small>Toont combinatie COI met ${this.selectedTeef.naam}</small>` : ''}
                    </div>
                `;
            }
        }, 1000);
    }
    
    filterByCOI(reuen, teefId, maxCOI) {
        if (!this.coiCalculator || !teefId || maxCOI <= 0) {
            return reuen;
        }
        
        console.log(`🔬 COI filtering: teef ${teefId}, max ${maxCOI}%`);
        
        return reuen.filter(reu => {
            if (!reu.id) return false;
            
            try {
                // Bereken combo COI voor deze combinatie
                const comboCOI = this.calculateComboCOI(teefId, reu.id);
                const comboValue = parseFloat(comboCOI.coiAllGen) || 0;
                
                // Sla COI waarden op in reu object voor latere weergave
                reu._coiData = {
                    individual: comboCOI.individualReu || { coi6Gen: '0.0', coiAllGen: '0.0' },
                    combo: comboCOI,
                    passesFilter: comboValue <= maxCOI
                };
                
                console.log(`   ➡ ${reu.naam}: combo=${comboValue}% → ${comboValue <= maxCOI ? 'PASS' : 'FAIL'}`);
                return comboValue <= maxCOI;
                
            } catch (error) {
                console.error(`Fout bij COI berekening reu ${reu.id}:`, error);
                reu._coiData = {
                    individual: { coi6Gen: '0.0', coiAllGen: '0.0' },
                    combo: { coi6Gen: '0.0', coiAllGen: '0.0' },
                    passesFilter: false
                };
                return false;
            }
        });
    }
    
    parseHondenDate(dateString) {
        if (!dateString) return null;
        
        // Probeer verschillende datumformaten
        // Format 1: ISO string (van database)
        let date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date;
        }
        
        // Format 2: dd-mm-yyyy
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
        
        // Format 3: yyyy-mm-dd
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
        
        // Format 4: andere scheidingstekens
        const cleaned = dateString.replace(/[./]/g, '-');
        const parts3 = cleaned.split('-');
        if (parts3.length === 3) {
            // Probeer beide formaten
            if (parts3[0].length === 4) {
                // yyyy-mm-dd
                const year = parseInt(parts3[0], 10);
                const month = parseInt(parts3[1], 10) - 1;
                const day = parseInt(parts3[2], 10);
                date = new Date(year, month, day);
            } else {
                // dd-mm-yyyy
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
        
        // Verzamel gezondheidsfilters
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
                
                // Speciaal geval voor schildklier (Tgaa)
                if (test === 'schildklier') {
                    const passes = this.meetsSchildklierRequirement(reuValue, selectedValue);
                    if (!passes) return false;
                    continue;
                }
                
                // Speciaal geval: als er geen waarde is, moet deze worden uitgesloten
                // behalve bij "Niet getest" of "Niet onderzocht" als dat de maximumwaarde is
                if (!reuValue || reuValue === '' || reuValue === '?' || reuValue.toLowerCase() === 'onbekend') {
                    // Controleer of "niet getest" of "niet onderzocht" is toegestaan
                    if (test === 'patellaluxatie' && (selectedValue === 'Niet getest' || selectedValue === 'Not tested')) {
                        // Toegestaan voor PL "Niet getest"
                        continue;
                    } else if (test === 'ogen' && (selectedValue === 'Niet onderzocht' || selectedValue === 'Not examined')) {
                        // Toegestaan voor ogen "Niet onderzocht"
                        continue;
                    } else if (selectedValue === 'Niet getest' || selectedValue === 'Not tested') {
                        // Toegestaan voor andere tests met "Niet getest"
                        continue;
                    }
                    return false;
                }
                
                // Check of reu voldoet aan MAXIMALE eis (niet slechter is dan maximum)
                if (!this.meetsMaximumRequirement(test, reuValue, selectedValue)) {
                    return false;
                }
            }
            return true;
        });
    }
    
    meetsSchildklierRequirement(reuValue, selectedValue) {
        // Speciaal geval voor Tgaa filtering:
        // - "Tgaa Negatief" moet zowel "Tgaa Negatief" als "Negatief" vinden
        // - "Niet getest" moet zowel "Niet getest" als "Negatief" als lege waarden vinden
        // - Niets selecteren moet alle reuen tonen (geen filtering)
        
        // Als er geen reu waarde is (leeg of onbekend)
        if (!reuValue || reuValue === '' || reuValue === '?' || reuValue.toLowerCase() === 'onbekend') {
            // Alleen toestaan bij "Niet getest" selectie
            return selectedValue === 'Niet getest' || 
                   selectedValue === 'Not tested' || 
                   selectedValue === 'Niet getest';
        }
        
        const normalizedReuValue = reuValue.toLowerCase().trim();
        
        if (selectedValue === 'Tgaa Negatief' || selectedValue === 'Tgaa Negative' || selectedValue === 'Tgaa Negativ') {
            // "Tgaa Negatief" moet zowel "Tgaa Negatief" als "Negatief" vinden
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
            // "Niet getest" moet zowel "Niet getest" als "Negatief" als lege waarden vinden
            // MAAR geen "Tgaa Positief" of "Positief"
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
        // Deze functie controleert of de reu-waarde NIET slechter is dan de maximumwaarde
        // (dwz: de reu-waarde is beter dan of gelijk aan de maximumwaarde)
        
        const normalizedReuValue = reuValue ? reuValue.toString().trim() : '';
        const normalizedMaxValue = maxValue ? maxValue.toString().trim() : '';
        
        switch(test) {
            case 'heupdysplasie':
                // HD: A is beter dan B, B beter dan C, etc.
                // Als maximum is B, dan zijn A en B OK, maar C, D, E niet
                const hdOrder = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
                const hdScoreReu = hdOrder[normalizedReuValue] !== undefined ? hdOrder[normalizedReuValue] : 99;
                const hdScoreMax = hdOrder[normalizedMaxValue] !== undefined ? hdOrder[normalizedMaxValue] : 99;
                return hdScoreReu <= hdScoreMax;
                
            case 'patellaluxatie':
                // PL: 0 is beter dan 1, 1 beter dan 2, etc.
                // Speciaal geval: "Niet getest" laat 0, 1 en zonder uitslag toe
                const plOrder = { '0': 0, '1': 1, '2': 2, '3': 3, 'Niet getest': 4 };
                const plScoreReu = plOrder[normalizedReuValue] !== undefined ? plOrder[normalizedReuValue] : 
                                  (normalizedReuValue === 'Niet getest' || normalizedReuValue === 'Not tested' ? 4 : 99);
                const plScoreMax = plOrder[normalizedMaxValue] !== undefined ? plOrder[normalizedMaxValue] : 99;
                
                if (normalizedMaxValue === 'Niet getest' || normalizedMaxValue === 'Not tested') {
                    // Bij "Niet getest" als max: alleen 0, 1, en "Niet getest" zijn toegestaan
                    return plScoreReu <= 4 && plScoreReu !== 2 && plScoreReu !== 3;
                }
                return plScoreReu <= plScoreMax && plScoreReu !== 2 && plScoreReu !== 3;
                
            case 'ogen':
                // Ogen: Vrij > Dist > Overig > Niet onderzocht
                // Speciaal geval: Ogen filtering werkt anders!
                // - Vrij: alleen Vrij
                // - Dist: Vrij EN Dist(ichiasis)
                // - Overig: Vrij, Dist(ichiasis) EN Overig
                // - Niet onderzocht: alles
                
                // Eerst normaliseren: Dist in dropdown komt overeen met Distichiasis in database
                let reuOgenValue = normalizedReuValue;
                let maxOgenValue = normalizedMaxValue;
                
                // Als de gebruiker "Dist" heeft geselecteerd, betekent dit zowel "Dist" als "Distichiasis"
                if (maxOgenValue === 'Dist' || maxOgenValue === 'Distichiasis') {
                    // Dist in filter betekent: Vrij en Dist/Distichiasis zijn OK
                    if (reuOgenValue === 'Vrij' || reuOgenValue === 'Dist' || reuOgenValue === 'Distichiasis') {
                        return true;
                    }
                    return false;
                }
                
                if (maxOgenValue === 'Overig') {
                    // Overig betekent: Vrij, Dist/Distichiasis en Overig zijn OK
                    if (reuOgenValue === 'Vrij' || 
                        reuOgenValue === 'Dist' || 
                        reuOgenValue === 'Distichiasis' || 
                        reuOgenValue === 'Overig') {
                        return true;
                    }
                    return false;
                }
                
                if (maxOgenValue === 'Niet onderzocht' || maxOgenValue === 'Not examined') {
                    return true; // Alles toegestaan
                }
                
                if (maxOgenValue === 'Vrij') {
                    // Alleen Vrij is toegestaan
                    return reuOgenValue === 'Vrij';
                }
                
                // Voor Engels: Free, Dist, Other
                if (maxOgenValue === 'Free') {
                    return reuOgenValue === 'Free' || reuOgenValue === 'Vrij';
                }
                
                if (maxOgenValue === 'Other') {
                    return reuOgenValue === 'Free' || reuOgenValue === 'Vrij' || 
                           reuOgenValue === 'Dist' || reuOgenValue === 'Distichiasis' ||
                           reuOgenValue === 'Other' || reuOgenValue === 'Overig';
                }
                
                // Standaard geval (voor de zekerheid)
                return normalizedReuValue === normalizedMaxValue;
                
            case 'dandyWalker':
                // Dandy Walker: aangepaste logica volgens specificaties
                // - "Vrij op DNA": alleen "Vrij op DNA"
                // - "Vrij op ouders": "Vrij op DNA" en "Vrij op ouders"
                // - "Drager": "Vrij op DNA", "Vrij op ouders" en "Drager"
                // - "Niet getest": "Vrij op DNA", "Vrij op ouders", "Drager" en "Niet getest"
                // - "Lijder": wordt uitgesloten (niet in dropdown!)
                
                // Als maxValue leeg is, toon alle reuen (inclusief Lijder)
                if (!normalizedMaxValue || normalizedMaxValue === '') {
                    return true;
                }
                
                // Expliciet Lijder uitsluiten (mag niet in de resultaten voorkomen)
                if (normalizedReuValue.includes('lijder') || normalizedReuValue.includes('affected')) {
                    return false;
                }
                
                // Controleer op de juiste combinaties
                if (normalizedMaxValue === 'Vrij op DNA') {
                    // Alleen "Vrij op DNA"
                    return normalizedReuValue.includes('vrij op dna') || normalizedReuValue.includes('vrij dna');
                }
                
                if (normalizedMaxValue === 'Vrij op ouders') {
                    // "Vrij op DNA" en "Vrij op ouders"
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders');
                }
                
                if (normalizedMaxValue === 'Drager') {
                    // "Vrij op DNA", "Vrij op ouders" en "Drager"
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders') ||
                           normalizedReuValue.includes('drager') ||
                           normalizedReuValue.includes('carrier');
                }
                
                if (normalizedMaxValue === 'Niet getest') {
                    // "Vrij op DNA", "Vrij op ouders", "Drager" en "Niet getest"
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders') ||
                           normalizedReuValue.includes('drager') ||
                           normalizedReuValue.includes('carrier') ||
                           normalizedReuValue.includes('niet getest') ||
                           normalizedReuValue.includes('not tested');
                }
                
                // "Lijder" is verwijderd uit de dropdown, maar voor de zekerheid
                return false;
                
            case 'schildklier':
                // Deze case wordt afgehandeld in meetsSchildklierRequirement
                // Hier terugvallen op standaard gedrag
                return true;
                
            case 'elleboogdysplasie':
                // ED: 0 is beter dan 1, etc.
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
            // 1. Sorteer op HD volgens specifieke volgorde: A → B → C → onbekend → D → E
            const hdA = this.getHDPriority(a.heupdysplasie);
            const hdB = this.getHDPriority(b.heupdysplasie);
            if (hdA !== hdB) return hdA - hdB;
            
            // 2. Binnen HD-categorie: sorteren op PL (0 → 1 → 2 → 3 → onbekend)
            const plA = this.getPLPriority(a.patella);
            const plB = this.getPLPriority(b.patella);
            if (plA !== plB) return plA - plB;
            
            // 3. Binnen HD+PL combinatie: sorteren op ogen (Vrij → Dist → Overig → onbekend)
            const ogenA = this.getOgenPriority(a.ogen);
            const ogenB = this.getOgenPriority(b.ogen);
            if (ogenA !== ogenB) return ogenA - ogenB;
            
            // 4. Binnen HD+PL+ogen combinatie: sorteren op Dandy Walker
            const dwA = this.getDWPriority(a.dandyWalker);
            const dwB = this.getDWPriority(b.dandyWalker);
            if (dwA !== dwB) return dwA - dwB;
            
            // 5. Binnen HD+PL+ogen+DW combinatie: sorteren op Tgaa (Negatief → onbekend → Positief)
            const tgaaA = this.getTgaaPriority(a.schildklier);
            const tgaaB = this.getTgaaPriority(b.schildklier);
            if (tgaaA !== tgaaB) return tgaaA - tgaaB;
            
            // 6. Binnen HD+PL+ogen+DW+Tgaa combinatie: sorteren op ED (0 → 1 → onbekend → 2 → 3)
            const edA = this.getEDPriority(a.elleboogdysplasie);
            const edB = this.getEDPriority(b.elleboogdysplasie);
            if (edA !== edB) return edA - edB;
            
            // 7. Laatste sortering op naam voor gelijke gezondheidsscores
            return (a.naam || '').localeCompare(b.naam || '');
        });
    }
    
    compareHealthValue(test, valueA, valueB) {
        // Deze methode wordt niet meer gebruikt in de nieuwe sortering,
        // maar blijft voor compatibiliteit met andere delen van de code
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
        const showCOIColumn = maxCOI > 0 && this.selectedTeef && !this.selectedTeef.manualEntry;
        
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
                        return date.toLocaleDateString(this.currentLang);
                    }
                    return dateString;
                } catch (e) {
                    return dateString;
                }
            };
            
            // Toon naam en kennelnaam zonder haakjes: "Naam Kennelnaam"
            const displayName = reu.naam ? 
                `${reu.naam} ${reu.kennelnaam ? reu.kennelnaam : ''}`.trim() : 
                t('unknown');
            
            // Haal COI data op
            let comboCOI = { coi6Gen: '0.0', coiAllGen: '0.0' };
            let individualCOI = { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            if (showCOIColumn && reu._coiData) {
                comboCOI = reu._coiData.combo || { coi6Gen: '0.0', coiAllGen: '0.0' };
                individualCOI = reu._coiData.individual || { coi6Gen: '0.0', coiAllGen: '0.0' };
            } else if (this.coiCalculator && reu.id) {
                // Als geen COI filter maar wel COI calculator, bereken individuele COI
                try {
                    individualCOI = this.coiCalculator.calculateCOI(reu.id);
                } catch (error) {
                    console.error('Fout bij individuele COI berekening reu:', error);
                }
            }
            
            return `
                <tr>
                    <td>${displayName}</td>
                    <td><small>${formatDate(reu.geboortedatum)}</small></td>
                    <td class="${this.getHealthColor(reu.heupdysplasie, 'hd')}">
                        ${formatValue(reu.heupdysplasie)}
                    </td>
                    <td class="${this.getHealthColor(reu.patella, 'pl')}">
                        ${formatValue(reu.patella)}
                    </td>
                    <td class="${this.getHealthColor(reu.ogen, 'ogen')}">
                        ${formatValue(reu.ogen)}
                    </td>
                    <td class="${this.getHealthColor(reu.dandyWalker, 'dw')}">
                        ${formatValue(reu.dandyWalker)}
                    </td>
                    <td class="${this.getHealthColor(reu.schildklier, 'schildklier')}">
                        ${formatValue(reu.schildklier)}
                    </td>
                    <td class="${this.getHealthColor(reu.elleboogdysplasie, 'ed')}">
                        ${formatValue(reu.elleboogdysplasie)}
                    </td>
                    <td><small>${reu.land || ''}</small></td>
                    <td class="${this.getCOIColor(parseFloat(comboCOI.coiAllGen))}">
                        ${showCOIColumn ? `
                            <strong>${comboCOI.coiAllGen}%</strong>
                            <br>
                            <small class="text-muted">(${comboCOI.coi6Gen}% 6g)</small>
                        ` : `
                            <span class="text-muted">-</span>
                        `}
                    </td>
                    <td class="${this.getCOIColor(parseFloat(individualCOI.coiAllGen))}">
                        ${individualCOI.coiAllGen}%
                        <br>
                        <small class="text-muted">(${individualCOI.coi6Gen}% 6g)</small>
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

// Voeg CSS toe voor autocomplete dropdown en kleuren
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
    
    /* Kleur coderingen */
    .text-success { color: #198754 !important; }
    .text-warning { color: #ffc107 !important; }
    .text-danger { color: #dc3545 !important; }
    .text-orange { color: #fd7e14 !important; }
    .text-muted { color: #6c757d !important; }
    .text-secondary { color: #6c757d !important; }
    
    .table-sm th, .table-sm td {
        padding: 0.3rem 0.5rem;
        font-size: 0.875rem;
    }
    
    /* Custom scrollbar voor dropdown */
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
    
    /* Teef info styling */
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
    
    /* Datum input styling */
    #bornAfterFilter:focus {
        border-color: #6610f2;
        box-shadow: 0 0 0 0.25rem rgba(102, 16, 242, 0.25);
    }
    
    /* COI input styling */
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
    
    /* COI kleuren in tabel */
    td.text-success { font-weight: bold; }
    td.text-warning { font-weight: bold; }
    td.text-orange { font-weight: bold; }
    td.text-danger { font-weight: bold; }
    
    /* Tabel kolommen voor COI */
    .table th:nth-last-child(2),
    .table th:nth-last-child(1) {
        background-color: #f8f9fa;
    }
`;
document.head.appendChild(style);