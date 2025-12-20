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
                
                // Honden details
                dogDetails: "Hond Details",
                father: "Vader",
                mother: "Moeder",
                parentsUnknown: "Onbekend",
                
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
                
                // Dog details
                dogDetails: "Dog Details",
                father: "Father",
                mother: "Mother",
                parentsUnknown: "Unknown",
                
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
                
                // Hundedetails
                dogDetails: "Hund Details",
                father: "Vater",
                mother: "Mutter",
                parentsUnknown: "Unbekannt",
                
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
                                        <div class="form-text">Begin te typen om honden te vinden</div>
                                    </div>
                                    <div id="autocompleteDropdown" class="autocomplete-dropdown" style="display: none;"></div>
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
            
            <style>
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    width: calc(100% - 30px);
                    z-index: 1000;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.85em;
                    color: #666;
                }
                
                .dog-details-card {
                    transition: transform 0.2s;
                }
                
                .dog-details-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
            </style>
        `;
    }
    
    setupEvents() {
        this.setupSearch();
    }
    
    setupSearch() {
        const searchInput = document.getElementById('searchNameInput');
        if (!searchInput) return;
        
        // Laad alle honden bij focus
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadSearchData();
            }
        });
        
        // Filter honden bij elke toetsaanslag met autocomplete
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // Toon autocomplete dropdown
            this.showAutocomplete(searchTerm);
            
            // Filter honden voor resultaten
            if (searchTerm.length >= 2) {
                this.filterDogs(searchTerm);
            } else {
                this.showInitialView();
            }
        });
        
        // Klik buiten de autocomplete dropdown om te verbergen
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#autocompleteDropdown') && !e.target.closest('#searchNameInput')) {
                this.hideAutocomplete();
            }
        });
    }
    
    showAutocomplete(searchTerm) {
        const dropdown = document.getElementById('autocompleteDropdown');
        if (!dropdown) return;
        
        if (!searchTerm || searchTerm.length < 2) {
            dropdown.style.display = 'none';
            return;
        }
        
        // Filter honden voor autocomplete
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam.toLowerCase();
            const dogBreed = dog.ras ? dog.ras.toLowerCase() : '';
            const pedigree = dog.stamboomnr ? dog.stamboomnr.toLowerCase() : '';
            
            return dogName.includes(searchTerm) || 
                   dogBreed.includes(searchTerm) ||
                   pedigree.includes(searchTerm);
        }).slice(0, 10); // Max 10 suggesties
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            html += `
                <div class="autocomplete-item" data-id="${dog.id}">
                    <div class="dog-name">${dog.naam}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'}
                    </div>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        // Event listeners voor autocomplete items
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = item.getAttribute('data-id');
                const dog = this.allDogs.find(d => d.id === parseInt(dogId));
                if (dog) {
                    document.getElementById('searchNameInput').value = dog.naam;
                    this.hideAutocomplete();
                    this.showDogDetails(dog);
                }
            });
        });
    }
    
    hideAutocomplete() {
        const dropdown = document.getElementById('autocompleteDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <p class="mt-3 text-muted">${t('searchPlaceholder')}</p>
                <small class="text-muted">Typ minstens 2 letters om te zoeken</small>
            </div>
        `;
    }
    
    async loadSearchData() {
        this.showProgress(this.t('loading'));
        
        try {
            this.allDogs = await this.db.getHonden();
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            this.hideProgress();
            
            console.log(`${this.allDogs.length} honden geladen voor zoeken`);
            
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
            
            this.showDogDetails(hond);
            
        } catch (error) {
            this.showError(`Fout bij laden hond: ${error.message}`);
        }
    }
    
    async showDogDetails(dog) {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsContainer');
        
        if (!container) return;
        
        // Zoek ouders in database
        let fatherInfo = t('parentsUnknown');
        let motherInfo = t('parentsUnknown');
        
        if (dog.vaderId) {
            try {
                const father = this.allDogs.find(d => d.id === dog.vaderId);
                if (father) {
                    fatherInfo = `${father.naam} (${father.stamboomnr || 'Geen stamboom'})`;
                }
            } catch (error) {
                console.error('Fout bij laden vader:', error);
            }
        }
        
        if (dog.moederId) {
            try {
                const mother = this.allDogs.find(d => d.id === dog.moederId);
                if (mother) {
                    motherInfo = `${mother.naam} (${mother.stamboomnr || 'Geen stamboom'})`;
                }
            } catch (error) {
                console.error('Fout bij laden moeder:', error);
            }
        }
        
        const html = `
            <div class="row">
                <div class="col-12 mb-3">
                    <button class="btn btn-sm btn-outline-secondary mb-3" id="backToSearchBtn">
                        <i class="bi bi-arrow-left"></i> Terug naar zoeken
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-8">
                    <div class="card dog-details-card">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">${t('dogDetails')}</h5>
                        </div>
                        <div class="card-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h4><strong>${dog.naam}</strong></h4>
                                    <div class="mb-2">
                                        <span class="badge bg-info">${dog.ras || 'Onbekend ras'}</span>
                                        <span class="badge bg-secondary ms-2">${dog.geslacht || 'Onbekend'}</span>
                                    </div>
                                </div>
                                <div class="col-md-6 text-end">
                                    <h5><code>${dog.stamboomnr || 'Geen stamboomnummer'}</code></h5>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">${t('father')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0">${fatherInfo}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">${t('mother')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0">${motherInfo}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            ${dog.opmerkingen ? `
                            <div class="mt-4">
                                <h6>Opmerkingen:</h6>
                                <p class="text-muted">${dog.opmerkingen}</p>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Extra informatie</h6>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled">
                                ${dog.geboortedatum ? `
                                <li class="mb-2">
                                    <strong>Geboortedatum:</strong><br>
                                    ${dog.geboortedatum}
                                </li>
                                ` : ''}
                                
                                ${dog.kleur ? `
                                <li class="mb-2">
                                    <strong>Kleur:</strong><br>
                                    ${dog.kleur}
                                </li>
                                ` : ''}
                                
                                ${dog.chipnummer ? `
                                <li class="mb-2">
                                    <strong>Chipnummer:</strong><br>
                                    <code>${dog.chipnummer}</code>
                                </li>
                                ` : ''}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Event listener voor terug knop
        document.getElementById('backToSearchBtn').addEventListener('click', () => {
            const searchTerm = document.getElementById('searchNameInput').value;
            if (searchTerm && searchTerm.length >= 2) {
                this.filterDogs(searchTerm.toLowerCase());
            } else {
                this.showInitialView();
            }
        });
    }
}

// Global export
if (typeof window !== 'undefined') {
    window.SearchManager = SearchManager;
}