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
        this.translations = {
            nl: {
                title: "Zoek een Reu",
                description: "Vind een geschikte reu voor uw teef op basis van criteria",
                selectTeef: "Selecteer uw teef",
                selectTeefPlaceholder: "Typ naam of stamboomnummer...",
                searchCriteria: "Zoekcriteria",
                ras: "Ras",
                anyBreed: "Elk ras",
                healthFilter: "Gezondheid filter",
                heupdysplasie: "Heupdysplasie (HD)",
                patellaluxatie: "Patellaluxatie (PL)",
                ogen: "Ogen",
                dandyWalker: "Dandy Walker",
                schildklier: "Schildklier",
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
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "4"],
                    ogen: ["Vrij", "Gefokt niet toegestaan", "Tevens niet fokgeschikt", "Niet onderzocht"],
                    dandyWalker: ["Vrij", "Drager", "Lijder", "Niet getest"],
                    schildklier: ["Vrij", "Licht verlaagd", "Verlaagd", "Niet getest"],
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
                        "0": "PL-0 (Vrij)",
                        "1": "PL-1 (Lichte afwijking)",
                        "2": "PL-2 (Matige afwijking)",
                        "3": "PL-3 (Ernstige afwijking)",
                        "4": "PL-4 (Zeer ernstige afwijking)"
                    },
                    ogen: {
                        "Vrij": "Ogen vrij",
                        "Gefokt niet toegestaan": "Gefokt niet toegestaan",
                        "Tevens niet fokgeschikt": "Tevens niet fokgeschikt",
                        "Niet onderzocht": "Niet onderzocht"
                    },
                    dandyWalker: {
                        "Vrij": "Dandy Walker vrij",
                        "Drager": "Drager Dandy Walker",
                        "Lijder": "Lijder Dandy Walker",
                        "Niet getest": "Niet getest op Dandy Walker"
                    },
                    schildklier: {
                        "Vrij": "Schildklier vrij",
                        "Licht verlaagd": "Licht verlaagd",
                        "Verlaagd": "Verlaagd",
                        "Niet getest": "Niet getest op schildklier"
                    },
                    elleboogdysplasie: {
                        "0": "ED-0 (Vrij)",
                        "1": "ED-1 (Lichte afwijking)",
                        "2": "ED-2 (Matige afwijking)",
                        "3": "ED-3 (Ernstige afwijking)",
                        "Niet getest": "Niet getest op ED"
                    }
                },
                resultColumns: {
                    naam: "Naam",
                    ras: "Ras",
                    stamboom: "Stamboom",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Ogen",
                    dw: "Dandy Walker",
                    schildklier: "Schildklier",
                    ed: "ED",
                    locatie: "Locatie"
                },
                unknown: "Onbekend",
                notTested: "Niet getest"
            },
            en: {
                title: "Find a Male",
                description: "Find a suitable male for your female based on criteria",
                selectTeef: "Select your female",
                selectTeefPlaceholder: "Type name or pedigree number...",
                searchCriteria: "Search Criteria",
                ras: "Breed",
                anyBreed: "Any breed",
                healthFilter: "Health filter",
                heupdysplasie: "Hip Dysplasia (HD)",
                patellaluxatie: "Patellar Luxation (PL)",
                ogen: "Eyes",
                dandyWalker: "Dandy Walker",
                schildklier: "Thyroid",
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
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "4"],
                    ogen: ["Free", "Not allowed for breeding", "Not suitable for breeding", "Not examined"],
                    dandyWalker: ["Free", "Carrier", "Affected", "Not tested"],
                    schildklier: ["Free", "Slightly reduced", "Reduced", "Not tested"],
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
                        "0": "PL-0 (Free)",
                        "1": "PL-1 (Mild)",
                        "2": "PL-2 (Moderate)",
                        "3": "PL-3 (Severe)",
                        "4": "PL-4 (Very severe)"
                    },
                    ogen: {
                        "Free": "Eyes free",
                        "Not allowed for breeding": "Not allowed for breeding",
                        "Not suitable for breeding": "Not suitable for breeding",
                        "Not examined": "Not examined"
                    },
                    dandyWalker: {
                        "Free": "Dandy Walker free",
                        "Carrier": "Dandy Walker carrier",
                        "Affected": "Dandy Walker affected",
                        "Not tested": "Not tested for Dandy Walker"
                    },
                    schildklier: {
                        "Free": "Thyroid free",
                        "Slightly reduced": "Slightly reduced",
                        "Reduced": "Reduced",
                        "Not tested": "Not tested for thyroid"
                    },
                    elleboogdysplasie: {
                        "0": "ED-0 (Free)",
                        "1": "ED-1 (Mild)",
                        "2": "ED-2 (Moderate)",
                        "3": "ED-3 (Severe)",
                        "Not tested": "Not tested for ED"
                    }
                },
                resultColumns: {
                    naam: "Name",
                    ras: "Breed",
                    stamboom: "Pedigree",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Eyes",
                    dw: "Dandy Walker",
                    schildklier: "Thyroid",
                    ed: "ED",
                    locatie: "Location"
                },
                unknown: "Unknown",
                notTested: "Not tested"
            },
            de: {
                title: "Finde einen Rüden",
                description: "Finden Sie einen geeigneten Rüden für Ihre Hündin basierend auf Kriterien",
                selectTeef: "Wählen Sie Ihre Hündin",
                selectTeefPlaceholder: "Name oder Stammbaumnummer eingeben...",
                searchCriteria: "Suchkriterien",
                ras: "Rasse",
                anyBreed: "Jede Rasse",
                healthFilter: "Gesundheitsfilter",
                heupdysplasie: "Hüftgelenksdysplasie (HD)",
                patellaluxatie: "Patellaluxation (PL)",
                ogen: "Augen",
                dandyWalker: "Dandy Walker",
                schildklier: "Schilddrüse",
                elleboogdysplasie: "Ellbogengelenksdysplasie (ED)",
                anyHealth: "Nicht wichtig",
                searchRadius: "Suchradius",
                radiusOptions: ["Niederlande", "Belgien", "Deutschland", "Europa", "Weltweit"],
                searchButton: "Rüden suchen",
                results: "Suchergebnisse",
                inDevelopment: "Diese Suchfunktion ist derzeit in Entwicklung",
                devMessage: "Die vollständige Suchfunktionalität für Rüden wird demnächst verfügbar sein.",
                features: [
                    "Erweiterte Suchfilter",
                    "Genetische Kompatibilitätsprüfung",
                    "Stammbaumanalyse",
                    "Gesundheitswertvergleich",
                    "Standortbasierte Suche",
                    "Bewertungen und Erfahrungsberichte"
                ],
                back: "Zurück",
                noResults: "Keine Rüden gefunden, die Ihren Kriterien entsprechen",
                tryAgain: "Versuchen Sie andere Suchkriterien",
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "4"],
                    ogen: ["Frei", "Zucht nicht erlaubt", "Auch nicht zuchttauglich", "Nicht untersucht"],
                    dandyWalker: ["Frei", "Träger", "Betroffen", "Nicht getestet"],
                    schildklier: ["Frei", "Leicht verringert", "Verringert", "Nicht getestet"],
                    elleboogdysplasie: ["0", "1", "2", "3", "Nicht getestet"]
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
                        "0": "PL-0 (Frei)",
                        "1": "PL-1 (Leicht)",
                        "2": "PL-2 (Mäßig)",
                        "3": "PL-3 (Schwer)",
                        "4": "PL-4 (Sehr schwer)"
                    },
                    ogen: {
                        "Frei": "Augen frei",
                        "Zucht nicht erlaubt": "Zucht nicht erlaubt",
                        "Auch nicht zuchttauglich": "Auch nicht zuchttauglich",
                        "Nicht untersucht": "Nicht untersucht"
                    },
                    dandyWalker: {
                        "Frei": "Dandy Walker frei",
                        "Träger": "Dandy Walker Träger",
                        "Betroffen": "Dandy Walker betroffen",
                        "Nicht getestet": "Nicht auf Dandy Walker getestet"
                    },
                    schildklier: {
                        "Frei": "Schilddrüse frei",
                        "Leicht verringert": "Leicht verringert",
                        "Verringert": "Verringert",
                        "Nicht getestet": "Nicht auf Schilddrüse getestet"
                    },
                    elleboogdysplasie: {
                        "0": "ED-0 (Frei)",
                        "1": "ED-1 (Leicht)",
                        "2": "ED-2 (Mäßig)",
                        "3": "ED-3 (Schwer)",
                        "Niet getest": "Nicht auf ED getestet"
                    }
                },
                resultColumns: {
                    naam: "Name",
                    ras: "Rasse",
                    stamboom: "Stammbaum",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Augen",
                    dw: "Dandy Walker",
                    schildklier: "Schilddrüse",
                    ed: "ED",
                    locatie: "Standort"
                },
                unknown: "Unbekannt",
                notTested: "Nicht getestet"
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
        
        // Laad honden data
        const honden = await this.getHonden();
        const teven = honden.filter(h => h.geslacht === 'teven');
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
                                    <div class="autocomplete-dropdown" id="teefDropdown" style="display: none;"></div>
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
            
            <div class="card mt-4">
                <div class="card-header">
                    <h6 class="mb-0">Toekomstige functionaliteiten</h6>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        ${t('features').map(feature => `
                            <li class="list-group-item">
                                <i class="bi bi-check-circle text-success me-2"></i>${feature}
                            </li>
                        `).join('')}
                    </ul>
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
            
            if (searchTerm.length < 2) {
                teefDropdown.style.display = 'none';
                return;
            }
            
            this.teefInputTimer = setTimeout(() => {
                this.searchTeven(searchTerm);
            }, 300);
        });
        
        teefSearch.addEventListener('focus', () => {
            const searchTerm = teefSearch.value.trim();
            if (searchTerm.length >= 2) {
                this.searchTeven(searchTerm);
            }
        });
        
        document.getElementById('searchButton').addEventListener('click', () => {
            this.performSearch();
        });
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
    
    async searchTeven(searchTerm) {
        const honden = await this.getHonden();
        const teven = honden.filter(h => 
            h.geslacht === 'teven' && 
            (h.naam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             h.stamboomnr?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        this.showTeefDropdown(teven.slice(0, 10)); // Toon max 10 resultaten
    }
    
    showTeefDropdown(teven) {
        const t = this.t.bind(this);
        const dropdown = document.getElementById('teefDropdown');
        
        if (teven.length === 0) {
            dropdown.innerHTML = `
                <div class="autocomplete-item text-muted">
                    <i class="bi bi-search me-2"></i>Geen teven gevonden
                </div>
            `;
            dropdown.style.display = 'block';
            return;
        }
        
        dropdown.innerHTML = teven.map(teef => `
            <div class="autocomplete-item" data-id="${teef.id}">
                <div class="fw-bold">${teef.naam || t('unknown')}</div>
                <div class="small text-muted">
                    ${teef.ras || t('unknown')} • ${teef.stamboomnr || t('unknown')}
                </div>
            </div>
        `).join('');
        
        dropdown.style.display = 'block';
        
        // Event listeners voor dropdown items
        dropdown.querySelectorAll('.autocomplete-item[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                const teefId = item.getAttribute('data-id');
                this.selectTeef(teefId);
                dropdown.style.display = 'none';
                document.getElementById('teefSearch').value = '';
            });
        });
        
        // Sluit dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target.id !== 'teefSearch') {
                dropdown.style.display = 'none';
            }
        }, { once: true });
    }
    
    async selectTeef(teefId) {
        const honden = await this.getHonden();
        const teef = honden.find(h => h.id == teefId);
        
        if (!teef) return;
        
        this.selectedTeef = teef;
        
        const infoDiv = document.getElementById('selectedTeefInfo');
        infoDiv.innerHTML = `
            <h6>${teef.naam || 'Onbekend'}</h6>
            <div class="row">
                <div class="col-6">
                    <strong>Ras:</strong> ${teef.ras || '-'}<br>
                    <strong>Stamboom:</strong> ${teef.stamboomnr || '-'}
                </div>
                <div class="col-6">
                    <strong>HD:</strong> ${teef.heupdysplasie || '?'}<br>
                    <strong>PL:</strong> ${teef.patella || '?'}
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-6">
                    <strong>Ogen:</strong> ${teef.ogen || '?'}<br>
                    <strong>DW:</strong> ${teef.dandyWalker || '?'}
                </div>
                <div class="col-6">
                    <strong>Schildklier:</strong> ${teef.schildklier || '?'}<br>
                    <strong>ED:</strong> ${teef.elleboogdysplasie || '?'}
                </div>
            </div>
            <hr class="my-2">
            <div class="text-end">
                <button class="btn btn-sm btn-outline-purple" id="clearTeefBtn">
                    <i class="bi bi-x"></i> Wis selectie
                </button>
            </div>
        `;
        
        document.getElementById('clearTeefBtn').addEventListener('click', () => {
            this.selectedTeef = null;
            infoDiv.innerHTML = `
                <div class="text-muted text-center">
                    <i class="bi bi-gender-female"></i>
                    <p class="mb-0 mt-2">Selecteer een teef om te beginnen</p>
                </div>
            `;
        });
    }
    
    async performSearch() {
        const t = this.t.bind(this);
        const resultsDiv = document.getElementById('searchResults');
        
        // Toon laad indicator
        resultsDiv.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">Zoeken...</span>
                </div>
                <p class="mt-3">Zoeken naar geschikte reuen...</p>
            </div>
        `;
        
        // Verzamel zoekcriteria
        const criteria = this.getSearchCriteria();
        
        // Haal alle reuen op
        const honden = await this.getHonden();
        let reuen = honden.filter(h => h.geslacht === 'reuen');
        
        // Filter op ras
        if (criteria.ras) {
            reuen = reuen.filter(r => r.ras === criteria.ras);
        }
        
        // Filter op gezondheid
        reuen = this.filterByHealth(reuen, criteria.health);
        
        // Sorteer op gezondheidsscore
        reuen = this.sortByHealthScore(reuen, criteria.health);
        
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
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>${t('resultColumns').naam}</th>
                                    <th>${t('resultColumns').ras}</th>
                                    <th>${t('resultColumns').stamboom}</th>
                                    <th>${t('resultColumns').hd}</th>
                                    <th>${t('resultColumns').pl}</th>
                                    <th>${t('resultColumns').ogen}</th>
                                    <th>${t('resultColumns').dw}</th>
                                    <th>${t('resultColumns').schildklier}</th>
                                    <th>${t('resultColumns').ed}</th>
                                    <th>${t('resultColumns').locatie}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateResultsTable(reuen, t)}
                            </tbody>
                        </table>
                    </div>
                    <div class="text-muted text-center mt-3">
                        <small>${reuen.length} reuen gevonden</small>
                    </div>
                `;
            }
        }, 1000);
    }
    
    getSearchCriteria() {
        const criteria = {
            ras: document.getElementById('rasFilter').value,
            radius: document.getElementById('radiusFilter').value,
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
            for (const [test, minValue] of Object.entries(healthCriteria)) {
                const reuValue = reu[this.getHealthFieldName(test)];
                if (!reuValue || reuValue === '') return false;
                
                // Speciale logica voor elke test
                switch(test) {
                    case 'heupdysplasie':
                        // HD: A is beter dan B, etc.
                        if (this.compareHD(reuValue, minValue) > 0) return false;
                        break;
                        
                    case 'patellaluxatie':
                        // PL: 0 is beter dan 1, etc.
                        if (this.comparePL(reuValue, minValue) > 0) return false;
                        break;
                        
                    case 'elleboogdysplasie':
                        // ED: 0 is beter dan 1, etc.
                        if (this.compareED(reuValue, minValue) > 0) return false;
                        break;
                        
                    case 'ogen':
                        // Ogen: "Vrij" is beter dan andere
                        if (reuValue !== minValue && minValue === 'Vrij') return false;
                        break;
                        
                    case 'dandyWalker':
                    case 'schildklier':
                        // Gelijk aan de geselecteerde waarde
                        if (reuValue !== minValue && minValue.includes('Vrij')) return false;
                        break;
                }
            }
            return true;
        });
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
    
    compareHD(a, b) {
        const order = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
        return (order[a] || 5) - (order[b] || 5);
    }
    
    comparePL(a, b) {
        const order = { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4 };
        return (order[a] || 5) - (order[b] || 5);
    }
    
    compareED(a, b) {
        const order = { '0': 0, '1': 1, '2': 2, '3': 3 };
        return (order[a] || 4) - (order[b] || 4);
    }
    
    sortByHealthScore(reuen, healthCriteria) {
        return reuen.sort((a, b) => {
            // Reuen met meer bekende uitslagen komen eerst
            const knownTestsA = this.countKnownTests(a);
            const knownTestsB = this.countKnownTests(b);
            
            if (knownTestsA !== knownTestsB) {
                return knownTestsB - knownTestsA;
            }
            
            // Sorteer op HD (belangrijkste)
            const hdScore = this.compareHD(a.heupdysplasie, b.heupdysplasie);
            if (hdScore !== 0) return hdScore;
            
            // Sorteer op PL
            const plScore = this.comparePL(a.patella, b.patella);
            if (plScore !== 0) return plScore;
            
            // Sorteer op ogen
            const ogenScore = this.compareOgen(a.ogen, b.ogen);
            if (ogenScore !== 0) return ogenScore;
            
            // Sorteer op Dandy Walker
            const dwScore = this.compareDW(a.dandyWalker, b.dandyWalker);
            if (dwScore !== 0) return dwScore;
            
            // Sorteer op schildklier
            const thyroidScore = this.compareThyroid(a.schildklier, b.schildklier);
            if (thyroidScore !== 0) return thyroidScore;
            
            // Sorteer op ED
            const edScore = this.compareED(a.elleboogdysplasie, b.elleboogdysplasie);
            if (edScore !== 0) return edScore;
            
            // Laatste sortering op naam
            return (a.naam || '').localeCompare(b.naam || '');
        });
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
            return value && value !== '' && value !== 'Niet getest' && value !== 'Niet onderzocht';
        }).length;
    }
    
    compareOgen(a, b) {
        const order = { 'Vrij': 0, 'Gefokt niet toegestaan': 1, 'Tevens niet fokgeschikt': 2 };
        return (order[a] || 3) - (order[b] || 3);
    }
    
    compareDW(a, b) {
        const order = { 'Vrij': 0, 'Drager': 1, 'Lijder': 2 };
        return (order[a] || 3) - (order[b] || 3);
    }
    
    compareThyroid(a, b) {
        const order = { 'Vrij': 0, 'Licht verlaagd': 1, 'Verlaagd': 2 };
        return (order[a] || 3) - (order[b] || 3);
    }
    
    generateResultsTable(reuen, t) {
        return reuen.map(reu => {
            const getHealthClass = (value) => {
                if (!value || value === '') return 'text-muted';
                if (value === 'A' || value === '0' || value === 'Vrij') return 'text-success fw-bold';
                if (value === 'B' || value === '1' || value === 'Licht verlaagd' || value === 'Drager') return 'text-warning';
                if (value === 'C' || value === '2' || value === 'Verlaagd' || value === 'Lijder') return 'text-warning';
                if (value === 'D' || value === '3') return 'text-danger';
                if (value === 'E' || value === '4') return 'text-danger';
                return 'text-secondary';
            };
            
            return `
                <tr>
                    <td>${reu.naam || t('unknown')}</td>
                    <td>${reu.ras || t('unknown')}</td>
                    <td><small>${reu.stamboomnr || ''}</small></td>
                    <td class="${getHealthClass(reu.heupdysplasie)}">
                        ${reu.heupdysplasie || '?'}
                    </td>
                    <td class="${getHealthClass(reu.patella)}">
                        ${reu.patella || '?'}
                    </td>
                    <td class="${getHealthClass(reu.ogen)}">
                        ${reu.ogen ? reu.ogen.substring(0, 15) : '?'}
                    </td>
                    <td class="${getHealthClass(reu.dandyWalker)}">
                        ${reu.dandyWalker ? reu.dandyWalker.substring(0, 10) : '?'}
                    </td>
                    <td class="${getHealthClass(reu.schildklier)}">
                        ${reu.schildklier ? reu.schildklier.substring(0, 10) : '?'}
                    </td>
                    <td class="${getHealthClass(reu.elleboogdysplasie)}">
                        ${reu.elleboogdysplasie || '?'}
                    </td>
                    <td><small>${reu.land || ''}</small></td>
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

// Voeg CSS toe voor autocomplete dropdown
const style = document.createElement('style');
style.textContent = `
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
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        z-index: 1000;
    }
    
    .autocomplete-item {
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-bottom: 1px solid #f8f9fa;
    }
    
    .autocomplete-item:hover {
        background-color: #f8f9fa;
    }
    
    .autocomplete-item:last-child {
        border-bottom: none;
    }
    
    .text-success { color: #198754 !important; }
    .text-warning { color: #ffc107 !important; }
    .text-danger { color: #dc3545 !important; }
    .text-muted { color: #6c757d !important; }
    .text-secondary { color: #6c757d !important; }
`;
document.head.appendChild(style);