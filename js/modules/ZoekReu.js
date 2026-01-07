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
        this.translations = {
            nl: {
                title: "Zoek een Reu",
                description: "Vind een geschikte reu voor uw teef op basis van criteria",
                selectTeef: "Selecteer uw teef",
                selectTeefPlaceholder: "Typ naam, kennel of stamboomnummer...",
                searchCriteria: "Zoekcriteria",
                ras: "Ras",
                anyBreed: "Elk ras",
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
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["PL 0", "PL 1", "PL 2", "PL 3", "Niet getest"],
                    ogen: ["Vrij", "Dist", "Overig", "Niet onderzocht"],
                    dandyWalker: ["Vrij op DNA", "Vrij op ouders", "Drager", "Niet getest", "Lijder"],
                    schildklier: ["Tgaa Negatief", "Niet getest"],
                    elleboogdysplasie: ["ED 0", "ED 1", "ED 2", "ED 3", "Niet getest"]
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
                        "PL 0": "PL 0 (Vrij)",
                        "PL 1": "PL 1 (Lichte afwijking)",
                        "PL 2": "PL 2 (Matige afwijking)",
                        "PL 3": "PL 3 (Ernstige afwijking)",
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
                        "Niet getest": "Niet getest",
                        "Lijder": "Lijder"
                    },
                    schildklier: {
                        "Tgaa Negatief": "Tgaa Negatief",
                        "Niet getest": "Niet getest"
                    },
                    elleboogdysplasie: {
                        "ED 0": "ED 0 (Vrij)",
                        "ED 1": "ED 1 (Lichte afwijking)",
                        "ED 2": "ED 2 (Matige afwijking)",
                        "ED 3": "ED 3 (Ernstige afwijking)",
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
                    locatie: "Locatie"
                },
                unknown: "Onbekend",
                notTested: "Niet getest"
            },
            en: {
                title: "Find a Male",
                description: "Find a suitable male for your female based on criteria",
                selectTeef: "Select your female",
                selectTeefPlaceholder: "Type name, kennel or pedigree number...",
                searchCriteria: "Search Criteria",
                ras: "Breed",
                anyBreed: "Any breed",
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
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["PL 0", "PL 1", "PL 2", "PL 3", "Not tested"],
                    ogen: ["Free", "Dist", "Other", "Not examined"],
                    dandyWalker: ["Free on DNA", "Free on parents", "Carrier", "Not tested", "Affected"],
                    schildklier: ["Tgaa Negative", "Not tested"],
                    elleboogdysplasie: ["ED 0", "ED 1", "ED 2", "ED 3", "Not tested"]
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
                        "PL 0": "PL 0 (Free)",
                        "PL 1": "PL 1 (Mild)",
                        "PL 2": "PL 2 (Moderate)",
                        "PL 3": "PL 3 (Severe)",
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
                        "Not tested": "Not tested",
                        "Affected": "Affected"
                    },
                    schildklier: {
                        "Tgaa Negative": "Tgaa Negative",
                        "Not tested": "Not tested"
                    },
                    elleboogdysplasie: {
                        "ED 0": "ED 0 (Free)",
                        "ED 1": "ED 1 (Mild)",
                        "ED 2": "ED 2 (Moderate)",
                        "ED 3": "ED 3 (Severe)",
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
                    locatie: "Location"
                },
                unknown: "Unknown",
                notTested: "Not tested"
            },
            de: {
                title: "Finde einen Rüden",
                description: "Finden Sie einen geeigneten Rüden für Ihre Hündin basierend auf Kriterien",
                selectTeef: "Wählen Sie Ihre Hündin",
                selectTeefPlaceholder: "Name, Zwingername oder Stammbaumnummer eingeben...",
                searchCriteria: "Suchkriterien",
                ras: "Rasse",
                anyBreed: "Jede Rasse",
                healthFilter: "Gesundheitsfilter",
                heupdysplasie: "Hüftgelenksdysplasie (HD)",
                patellaluxatie: "Patellaluxation (PL)",
                ogen: "Augen",
                dandyWalker: "Dandy Walker",
                schildklier: "Tgaa",
                elleboogdysplasie: "Ellbogengelenksdysplasie (ED)",
                anyHealth: "Nicht wichtig",
                searchRadius: "Suchradius",
                radiusOptions: ["Niederlande", "België", "Deutschland", "Europa", "Weltweit"],
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
                    patellaluxatie: ["PL 0", "PL 1", "PL 2", "PL 3", "Nicht getestet"],
                    ogen: ["Frei", "Dist", "Andere", "Nicht untersucht"],
                    dandyWalker: ["Frei auf DNA", "Frei auf Eltern", "Träger", "Niet getest", "Betroffen"],
                    schildklier: ["Tgaa Negativ", "Niet getest"],
                    elleboogdysplasie: ["ED 0", "ED 1", "ED 2", "ED 3", "Niet getest"]
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
                        "PL 0": "PL 0 (Frei)",
                        "PL 1": "PL 1 (Leicht)",
                        "PL 2": "PL 2 (Mäßig)",
                        "PL 3": "PL 3 (Schwer)",
                        "Nicht getestet": "Nicht getestet"
                    },
                    ogen: {
                        "Frei": "Frei",
                        "Dist": "Distichiasis",
                        "Andere": "Andere",
                        "Nicht untersucht": "Nicht untersucht"
                    },
                    dandyWalker: {
                        "Frei auf DNA": "Frei auf DNA",
                        "Frei auf ouders": "Frei auf ouders",
                        "Träger": "Träger",
                        "Niet getest": "Niet getest",
                        "Betroffen": "Betroffen"
                    },
                    schildklier: {
                        "Tgaa Negativ": "Tgaa Negativ",
                        "Niet getest": "Niet getest"
                    },
                    elleboogdysplasie: {
                        "ED 0": "ED 0 (Frei)",
                        "ED 1": "ED 1 (Leicht)",
                        "ED 2": "ED 2 (Mäßig)",
                        "ED 3": "ED 3 (Schwer)",
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
                    locatie: "Standort"
                },
                unknown: "Unbekannt",
                notTested: "Niet getestet"
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
            
            // Check of ALLE zoektermen voorkomen in de zoekbare tekst
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
    
    async selectTeef(teefId) {
        const teef = this.allTeven.find(h => h.id == teefId);
        
        if (!teef) return;
        
        this.selectedTeef = teef;
        this.updateTeefInfoDisplay(teef);
    }
    
    handleManualTeefEntry(entry) {
        // Creëer een tijdelijke teef object voor handmatige invoer
        this.selectedTeef = {
            id: 'manual',
            naam: entry,
            manualEntry: true
        };
        
        this.updateTeefInfoDisplay(this.selectedTeef);
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
                if (lowerValue === 'pl 0' || lowerValue === 'pl0') return 'text-success fw-bold';
                if (lowerValue === 'pl 1' || lowerValue === 'pl1') return 'text-orange fw-bold';
                if (lowerValue === 'pl 2' || lowerValue === 'pl2' || lowerValue === 'pl 3' || lowerValue === 'pl3') return 'text-danger fw-bold';
                break;
                
            case 'ogen':
                if (lowerValue === 'vrij') return 'text-success fw-bold';
                if (lowerValue.includes('dist')) return 'text-warning fw-bold';
                if (lowerValue === 'overig') return 'text-danger fw-bold';
                break;
                
            case 'dw':
                if (lowerValue.includes('vrij op dna') || lowerValue.includes('vrij dna')) return 'text-success fw-bold';
                if (lowerValue.includes('vrij op ouders') || lowerValue.includes('vrij ouders')) return 'text-success fw-bold';
                if (lowerValue.includes('drager')) return 'text-orange fw-bold';
                if (lowerValue.includes('lijder')) return 'text-danger fw-bold';
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
    
    updateTeefInfoDisplay(teef) {
        const t = this.t.bind(this);
        const infoDiv = document.getElementById('selectedTeefInfo');
        
        if (teef.manualEntry) {
            infoDiv.innerHTML = `
                <h6>${teef.naam}</h6>
                <div class="alert alert-info small p-2 mb-2">
                    <i class="bi bi-info-circle me-1"></i>
                    <small>Handmatig ingevoerde teef</small>
                </div>
                <div class="text-muted">
                    Geen extra informatie beschikbaar voor handmatige invoer.
                </div>
                <hr class="my-2">
                <div class="text-end">
                    <button class="btn btn-sm btn-outline-purple" id="clearTeefBtn">
                        <i class="bi bi-x"></i> Wis selectie
                    </button>
                </div>
            `;
        } else {
            infoDiv.innerHTML = `
                <h6 class="mb-2">${teef.naam || 'Onbekend'} ${teef.kennelnaam ? teef.kennelnaam : ''}</h6>
                <div class="mb-3">
                    <strong>Stamboom:</strong> ${teef.stamboomnr || '-'}
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
        
        // Filter op gezondheid (minimale eisen)
        reuen = this.filterByHealth(reuen, criteria.health);
        
        // Sorteer ALTIJD op gezondheidsscore (beste bovenaan)
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
                if (!reuValue || reuValue === '') {
                    // Onbekende waarde = niet goed genoeg
                    return false;
                }
                
                // Check of reu voldoet aan MINIMALE eis (of beter is)
                if (!this.meetsMinimumRequirement(test, reuValue, minValue)) {
                    return false;
                }
            }
            return true;
        });
    }
    
    meetsMinimumRequirement(test, reuValue, minValue) {
        // Alle waarden die voldoen aan de minimale eis (of beter zijn)
        switch(test) {
            case 'heupdysplasie':
                // HD: A is beter dan B, etc. Als minimum is B, dan zijn A en B OK
                const hdOrder = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
                return (hdOrder[reuValue] || 5) <= (hdOrder[minValue] || 5);
                
            case 'patellaluxatie':
                // PL: 0 is beter dan 1, etc.
                const plOrder = { 'PL 0': 0, 'PL 1': 1, 'PL 2': 2, 'PL 3': 3, 'Niet getest': 4 };
                return (plOrder[reuValue] || 5) <= (plOrder[minValue] || 5);
                
            case 'ogen':
                // Ogen: Vrij > Dist > Overig > Niet onderzocht
                const ogenOrder = { 'Vrij': 0, 'Dist': 1, 'Overig': 2, 'Niet onderzocht': 3 };
                return (ogenOrder[reuValue] || 4) <= (ogenOrder[minValue] || 4);
                
            case 'dandyWalker':
                // Dandy Walker: Vrij op DNA > Vrij op ouders > Drager > Niet getest > Lijder
                const dwOrder = { 
                    'Vrij op DNA': 0, 
                    'Vrij op ouders': 1, 
                    'Drager': 2, 
                    'Niet getest': 3, 
                    'Lijder': 4 
                };
                return (dwOrder[reuValue] || 5) <= (dwOrder[minValue] || 5);
                
            case 'schildklier':
                // Schildklier: Tgaa Negatief > Niet getest
                const thyroidOrder = { 'Tgaa Negatief': 0, 'Niet getest': 1 };
                return (thyroidOrder[reuValue] || 2) <= (thyroidOrder[minValue] || 2);
                
            case 'elleboogdysplasie':
                // ED: 0 is beter dan 1, etc.
                const edOrder = { 'ED 0': 0, 'ED 1': 1, 'ED 2': 2, 'ED 3': 3, 'Niet getest': 4 };
                return (edOrder[reuValue] || 5) <= (edOrder[minValue] || 5);
                
            default:
                return reuValue === minValue;
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
    
    sortByHealthScore(reuen) {
        return reuen.sort((a, b) => {
            // 1. Sorteer op aantal bekende tests (meer is beter)
            const knownTestsA = this.countKnownTests(a);
            const knownTestsB = this.countKnownTests(b);
            if (knownTestsB !== knownTestsA) {
                return knownTestsB - knownTestsA;
            }
            
            // 2. HD score (A is beste)
            const hdScore = this.compareHealthValue('heupdysplasie', a.heupdysplasie, b.heupdysplasie);
            if (hdScore !== 0) return hdScore;
            
            // 3. PL score (PL 0 is beste)
            const plScore = this.compareHealthValue('patellaluxatie', a.patella, b.patella);
            if (plScore !== 0) return plScore;
            
            // 4. Ogen score (Vrij is beste)
            const ogenScore = this.compareHealthValue('ogen', a.ogen, b.ogen);
            if (ogenScore !== 0) return ogenScore;
            
            // 5. Dandy Walker score (Vrij op DNA is beste)
            const dwScore = this.compareHealthValue('dandyWalker', a.dandyWalker, b.dandyWalker);
            if (dwScore !== 0) return dwScore;
            
            // 6. Schildklier score (Tgaa Negatief is beste)
            const thyroidScore = this.compareHealthValue('schildklier', a.schildklier, b.schildklier);
            if (thyroidScore !== 0) return thyroidScore;
            
            // 7. ED score (ED 0 is beste)
            const edScore = this.compareHealthValue('elleboogdysplasie', a.elleboogdysplasie, b.elleboogdysplasie);
            if (edScore !== 0) return edScore;
            
            // 8. Laatste sortering op naam
            return (a.naam || '').localeCompare(b.naam || '');
        });
    }
    
    compareHealthValue(test, valueA, valueB) {
        // Definieer de volgorde voor elke test (lage score = beter)
        const orders = {
            'heupdysplasie': { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 },
            'patellaluxatie': { 'PL 0': 0, 'PL 1': 1, 'PL 2': 2, 'PL 3': 3, 'Niet getest': 4 },
            'ogen': { 'Vrij': 0, 'Dist': 1, 'Overig': 2, 'Niet onderzocht': 3 },
            'dandyWalker': { 
                'Vrij op DNA': 0, 
                'Vrij op ouders': 1, 
                'Drager': 2, 
                'Niet getest': 3, 
                'Lijder': 4 
            },
            'schildklier': { 'Tgaa Negatief': 0, 'Niet getest': 1 },
            'elleboogdysplasie': { 'ED 0': 0, 'ED 1': 1, 'ED 2': 2, 'ED 3': 3, 'Niet getest': 4 }
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
    
    generateResultsTable(reuen, t) {
        return reuen.map(reu => {
            const formatValue = (value) => {
                if (!value || value === '') return '?';
                if (value.length > 10) return value.substring(0, 10) + '...';
                return value;
            };
            
            const formatDate = (dateString) => {
                if (!dateString) return '-';
                try {
                    return new Date(dateString).toLocaleDateString(this.currentLang);
                } catch (e) {
                    return dateString;
                }
            };
            
            // Toon naam en kennelnaam zonder haakjes: "Naam Kennelnaam"
            const displayName = reu.naam ? 
                `${reu.naam} ${reu.kennelnaam ? reu.kennelnaam : ''}`.trim() : 
                t('unknown');
            
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
`;
document.head.appendChild(style);