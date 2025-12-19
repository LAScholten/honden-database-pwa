/**
 * Search Manager Module
 * Beheert het zoeken naar honden met autocomplete functionaliteit
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.translations = {
            nl: {
                // Modal titels
                searchDog: "Hond Zoeken",
                searchInfo: "Typ de naam van een hond om te zoeken. Resultaten worden automatisch gefilterd tijdens het typen.",
                
                // Zoek velden
                searchName: "Zoek op hond naam",
                searchPlaceholder: "Typ hond naam...",
                noDogsFound: "Geen honden gevonden",
                
                // Resultaten
                searchResults: "Zoekresultaten",
                found: "gevonden",
                name: "Naam",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                view: "Bekijken",
                close: "Sluiten",
                
                // Alerts
                loading: "Honden laden...",
                loadFailed: "Laden mislukt: "
            },
            en: {
                // Modal titles
                searchDog: "Search Dog",
                searchInfo: "Type a dog's name to search. Results are automatically filtered as you type.",
                
                // Search fields
                searchName: "Search by dog name",
                searchPlaceholder: "Type dog name...",
                noDogsFound: "No dogs found",
                
                // Results
                searchResults: "Search Results",
                found: "found",
                name: "Name",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                view: "View",
                close: "Close",
                
                // Alerts
                loading: "Loading dogs...",
                loadFailed: "Loading failed: "
            },
            de: {
                // Modal Titel
                searchDog: "Hund suchen",
                searchInfo: "Geben Sie einen Hundenamen ein, um zu suchen. Die Ergebnisse werden automatisch während der Eingabe gefiltert.",
                
                // Suchfelder
                searchName: "Nach Hundenamen suchen",
                searchPlaceholder: "Hundenamen eingeben...",
                noDogsFound: "Keine Hunde gefunden",
                
                // Ergebnisse
                searchResults: "Suchergebnisse",
                found: "gefunden",
                name: "Name",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geschlecht",
                view: "Ansehen",
                close: "Schließen",
                
                // Meldungen
                loading: "Hunde laden...",
                loadFailed: "Laden fehlgeschlagen: "
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('searchModal')) {
            this.loadSearchData();
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search"></i> ${t('searchDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-4">
                                <i class="bi bi-info-circle"></i>
                                ${t('searchInfo')}
                            </div>
                            
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label for="searchNameInput" class="form-label">${t('searchName')}</label>
                                        <input type="text" class="form-control" id="searchNameInput" 
                                               placeholder="${t('searchPlaceholder')}" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            
                            <div id="searchResultsContainer">
                                <div class="text-center py-5">
                                    <i class="bi bi-search display-1 text-muted"></i>
                                    <p class="mt-3 text-muted">${t('searchPlaceholder')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        this.setupSearch();
    }
    
    setupSearch() {
        const searchInput = document.getElementById('searchNameInput');
        if (!searchInput) return;
        
        // Filter honden bij elke toetsaanslag
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            this.filterDogs(searchTerm);
        });
        
        // Bij focus, laad alle honden als nog niet geladen
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadSearchData();
            }
            this.filterDogs('');
        });
    }
    
    async loadSearchData() {
        this.showProgress(this.t('loading'));
        
        try {
            this.allDogs = await this.db.getHonden();
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            this.hideProgress();
            
            // Toon alle honden bij eerste keer laden
            this.filterDogs('');
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('loadFailed')}${error.message}`);
        }
    }
    
    filterDogs(searchTerm = '') {
        this.filteredDogs = this.allDogs.filter(dog => {
            const dogName = dog.naam.toLowerCase();
            const dogBreed = dog.ras ? dog.ras.toLowerCase() : '';
            const pedigree = dog.stamboomnr ? dog.stamboomnr.toLowerCase() : '';
            
            return dogName.includes(searchTerm) || 
                   dogBreed.includes(searchTerm) ||
                   pedigree.includes(searchTerm);
        });
        
        this.displaySearchResults();
    }
    
    displaySearchResults() {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        if (this.filteredDogs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">${t('searchResults')} (${this.filteredDogs.length} ${t('found')})</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>${t('name')}</th>
                                    <th>${t('pedigreeNumber')}</th>
                                    <th>${t('breed')}</th>
                                    <th>${t('gender')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : '-';
            
            html += `
                <tr>
                    <td><strong>${dog.naam}</strong></td>
                    <td><code>${dog.stamboomnr || '-'}</code></td>
                    <td>${dog.ras || '-'}</td>
                    <td>${genderText}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-dog-btn" data-id="${dog.id}">
                            <i class="bi bi-eye"></i> ${t('view')}
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Event listeners voor view knoppen
        document.querySelectorAll('.view-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.view-dog-btn').dataset.id;
                this.viewDog(hondId);
            });
        });
    }
    
    async viewDog(hondId) {
        try {
            const honden = await this.db.getHonden();
            const hond = honden.find(h => h.id === parseInt(hondId));
            
            if (!hond) {
                this.showError('Hond niet gevonden');
                return;
            }
            
            // Roep de view functie van DogManager aan
            if (window.uiHandler && window.uiHandler.dogManager) {
                window.uiHandler.dogManager.viewDogDetails(hondId);
            }
            
        } catch (error) {
            this.showError(`Fout bij laden hond: ${error.message}`);
        }
    }

// Global export
if (typeof window !== 'undefined') {
    window.SearchManager = SearchManager;
}
