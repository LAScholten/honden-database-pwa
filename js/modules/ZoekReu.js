/**
 * Zoek Reu Module
 * Voor het zoeken naar geschikte reuen voor een teef
 */

class ZoekReu {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = {
            nl: {
                title: "Zoek een Reu",
                description: "Vind een geschikte reu voor uw teef op basis van criteria",
                selectTeef: "Selecteer uw teef",
                selectTeefPlaceholder: "Kies een teef...",
                searchCriteria: "Zoekcriteria",
                ras: "Ras",
                anyBreed: "Elk ras",
                vachtkleur: "Vachtkleur",
                anyColor: "Elke kleur",
                healthFilter: "Gezondheid filter",
                hdFree: "HD-vrij",
                edFree: "ED-vrij",
                patellaFree: "Patella-vrij",
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
                tryAgain: "Probeer andere zoekcriteria"
            },
            en: {
                title: "Find a Male",
                description: "Find a suitable male for your female based on criteria",
                selectTeef: "Select your female",
                selectTeefPlaceholder: "Choose a female...",
                searchCriteria: "Search Criteria",
                ras: "Breed",
                anyBreed: "Any breed",
                vachtkleur: "Coat color",
                anyColor: "Any color",
                healthFilter: "Health filter",
                hdFree: "HD-free",
                edFree: "ED-free",
                patellaFree: "Patella-free",
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
                tryAgain: "Try different search criteria"
            },
            de: {
                title: "Finde einen Rüden",
                description: "Finden Sie einen geeigneten Rüden für Ihre Hündin basierend auf Kriterien",
                selectTeef: "Wählen Sie Ihre Hündin",
                selectTeefPlaceholder: "Wählen Sie eine Hündin...",
                searchCriteria: "Suchkriterien",
                ras: "Rasse",
                anyBreed: "Jede Rasse",
                vachtkleur: "Fellfarbe",
                anyColor: "Jede Farbe",
                healthFilter: "Gesundheitsfilter",
                hdFree: "HD-frei",
                edFree: "ED-frei",
                patellaFree: "Patella-frei",
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
                tryAgain: "Versuchen Sie andere Suchkriterien"
            }
        };
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
        
        // Verzamel unieke rassen en kleuren
        const rassen = [...new Set(reuen.map(r => r.ras).filter(Boolean))].sort();
        const vachtkleuren = [...new Set(reuen.map(r => r.vachtkleur).filter(Boolean))].sort();
        
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
                                <select class="form-select" id="teefSelect">
                                    <option value="">${t('selectTeefPlaceholder')}</option>
                                    ${teven.map(teef => `
                                        <option value="${teef.id}">
                                            ${teef.naam} (${teef.ras || 'Onbekend ras'})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div id="selectedTeefInfo" class="d-none small p-3 bg-light rounded">
                                <!-- Teef informatie komt hier -->
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
                                    <label class="form-label">${t('vachtkleur')}</label>
                                    <select class="form-select" id="vachtkleurFilter">
                                        <option value="">${t('anyColor')}</option>
                                        ${vachtkleuren.map(kleur => `
                                            <option value="${kleur}">${kleur}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                
                                <div class="col-12">
                                    <label class="form-label">${t('healthFilter')}</label>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="hdFilter">
                                                <label class="form-check-label" for="hdFilter">
                                                    ${t('hdFree')}
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="edFilter">
                                                <label class="form-check-label" for="edFilter">
                                                    ${t('edFree')}
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="patellaFilter">
                                                <label class="form-check-label" for="patellaFilter">
                                                    ${t('patellaFree')}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <label class="form-label">${t('searchRadius')}</label>
                                    <select class="form-select" id="radiusFilter">
                                        ${t('radiusOptions').map((option, index) => `
                                            <option value="${index}" ${index === 0 ? 'selected' : ''}>${option}</option>
                                        `).join('')}
                                    </select>
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
            window.breedingManager.loadMainScreen();
        });
        
        document.getElementById('teefSelect').addEventListener('change', (e) => {
            this.updateTeefInfo(e.target.value);
        });
        
        document.getElementById('searchButton').addEventListener('click', () => {
            this.performSearch();
        });
    }
    
    async getHonden() {
        try {
            if (window.db && typeof window.db.getHonden === 'function') {
                return await window.db.getHonden();
            }
            return [];
        } catch (error) {
            console.error('Fout bij ophalen honden:', error);
            return [];
        }
    }
    
    async updateTeefInfo(teefId) {
        const infoDiv = document.getElementById('selectedTeefInfo');
        
        if (!teefId) {
            infoDiv.classList.add('d-none');
            return;
        }
        
        const honden = await this.getHonden();
        const teef = honden.find(h => h.id == teefId);
        
        if (!teef) {
            infoDiv.classList.add('d-none');
            return;
        }
        
        infoDiv.innerHTML = `
            <h6>${teef.naam || 'Onbekend'}</h6>
            <div class="row">
                <div class="col-6">
                    <strong>Ras:</strong> ${teef.ras || '-'}<br>
                    <strong>Stamboom:</strong> ${teef.stamboomnr || '-'}
                </div>
                <div class="col-6">
                    <strong>Vachtkleur:</strong> ${teef.vachtkleur || '-'}<br>
                    <strong>Geboortedatum:</strong> ${teef.geboortedatum ? 
                        new Date(teef.geboortedatum).toLocaleDateString(this.currentLang) : '-'}
                </div>
            </div>
        `;
        infoDiv.classList.remove('d-none');
    }
    
    async performSearch() {
        const t = this.t.bind(this);
        const resultsDiv = document.getElementById('searchResults');
        
        resultsDiv.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">Zoeken...</span>
                </div>
                <p class="mt-3">Zoeken naar geschikte reuen...</p>
            </div>
        `;
        
        // Simuleer zoekproces
        setTimeout(() => {
            // Toon ontwikkelingsmelding
            resultsDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Zoekfunctie in ontwikkeling</strong><br>
                    Deze zoekfunctionaliteit is momenteel nog in ontwikkeling. Binnenkort kunt u hier reuen vinden op basis van:
                    <ul class="mt-2 mb-0">
                        <li>Genetische compatibiliteit</li>
                        <li>Gezondheidsscores</li>
                        <li>Locatie en beschikbaarheid</li>
                        <li>Stamboom matching</li>
                    </ul>
                </div>
                
                <div class="text-center py-4">
                    <i class="bi bi-search-heart text-purple" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">${t('noResults')}</h5>
                    <p class="text-muted">${t('tryAgain')}</p>
                </div>
            `;
        }, 1500);
    }
    
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.getElementById('breedingContent');
        content.insertBefore(alertDiv, content.firstChild);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}