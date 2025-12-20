/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam
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
                typeToSearch: "Begin met typen om te zoeken",
                
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
                male: "Reu",
                female: "Teef",
                unknown: "Onbekend",
                
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
                typeToSearch: "Start typing to search",
                
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
                male: "Male",
                female: "Female",
                unknown: "Unknown",
                
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
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                
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
                male: "Rüde",
                female: "Hündin",
                unknown: "Unbekannt",
                
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
                                        <input type="text" class="form-control search-input" id="searchNameInput" 
                                               placeholder="${t('searchPlaceholder')}" autocomplete="off">
                                        <div class="form-text">Zoekt alleen op hondennaam, vanaf 1 letter</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="searchResultsContainer">
                                <div class="text-center py-5">
                                    <i class="bi bi-search display-1 text-muted"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
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
                .search-input {
                    font-size: 1.1rem;
                    padding: 12px;
                    border: 2px solid #dee2e6;
                    transition: all 0.3s;
                }
                
                .search-input:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
                
                .dog-result-card {
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #dee2e6;
                    margin-bottom: 10px;
                }
                
                .dog-result-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border-color: #0d6efd;
                }
                
                .dog-result-card .card-body {
                    padding: 15px;
                }
                
                .dog-name {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #0d6efd;
                }
                
                .dog-info {
                    color: #6c757d;
                    font-size: 0.9rem;
                }
                
                .dog-badge {
                    font-size: 0.8rem;
                    padding: 4px 8px;
                }
                
                .search-stats {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin-bottom: 15px;
                }
                
                .back-btn {
                    margin-bottom: 20px;
                }
                
                .details-section {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                }
                
                .parents-info {
                    background: #e8f4fd;
                    border-left: 4px solid #0d6efd;
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
        
        // Filter honden bij ELKE toetsaanslag (vanaf 1 letter)
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.filterDogsByName(searchTerm);
            } else {
                this.showInitialView();
            }
        });
        
        // Enter toets om eerste resultaat te selecteren
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.filteredDogs.length > 0) {
                e.preventDefault();
                this.showDogDetails(this.filteredDogs[0]);
            }
        });
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <p class="mt-3 text-muted">${t('typeToSearch')}</p>
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
    
    filterDogsByName(searchTerm = '') {
        // Zoek ALLEEN op naam (NIET op ras of stamboomnummer)
        this.filteredDogs = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
            
            // Check of de naam de zoekterm bevat
            return dogName.includes(searchTerm);
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
                    <small class="text-muted">Geen honden gevonden met deze naam</small>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-stats">
                <strong>${t('searchResults')}:</strong> ${this.filteredDogs.length} ${t('found')}
            </div>
            
            <div class="row">
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : t('unknown');
            const genderClass = dog.geslacht === 'reuen' ? 'bg-primary' : 
                              dog.geslacht === 'teven' ? 'bg-danger' : 'bg-secondary';
            
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card dog-result-card" data-id="${dog.id}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="dog-name">${dog.naam}</div>
                                    <div class="dog-info mt-2">
                                        <div><strong>${t('breed')}:</strong> ${dog.ras || '-'}</div>
                                        <div><strong>${t('pedigreeNumber')}:</strong> ${dog.stamboomnr || '-'}</div>
                                    </div>
                                </div>
                                <div>
                                    <span class="badge ${genderClass} dog-badge">${genderText}</span>
                                </div>
                            </div>
                            <div class="mt-3 text-end">
                                <small class="text-muted">Klik om details te zien</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        container.innerHTML = html;
        
        // Event listeners voor ALLE hond kaarten
        document.querySelectorAll('.dog-result-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const hondId = card.getAttribute('data-id');
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
        let fatherInfo = { naam: t('parentsUnknown'), stamboomnr: '' };
        let motherInfo = { naam: t('parentsUnknown'), stamboomnr: '' };
        
        if (dog.vaderId) {
            try {
                const father = this.allDogs.find(d => d.id === dog.vaderId);
                if (father) {
                    fatherInfo = { 
                        naam: father.naam, 
                        stamboomnr: father.stamboomnr || 'Geen stamboom',
                        id: father.id
                    };
                }
            } catch (error) {
                console.error('Fout bij laden vader:', error);
            }
        }
        
        if (dog.moederId) {
            try {
                const mother = this.allDogs.find(d => d.id === dog.moederId);
                if (mother) {
                    motherInfo = { 
                        naam: mother.naam, 
                        stamboomnr: mother.stamboomnr || 'Geen stamboom',
                        id: mother.id
                    };
                }
            } catch (error) {
                console.error('Fout bij laden moeder:', error);
            }
        }
        
        const html = `
            <div class="row">
                <div class="col-12 mb-3">
                    <button class="btn btn-sm btn-outline-secondary back-btn" id="backToSearchBtn">
                        <i class="bi bi-arrow-left"></i> Terug naar zoeken
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-8">
                    <div class="card dog-details-card">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">${t('dogDetails')}: ${dog.naam}</h5>
                        </div>
                        <div class="card-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h4><strong>${dog.naam}</strong></h4>
                                    <div class="mb-2">
                                        <span class="badge bg-info">${dog.ras || 'Onbekend ras'}</span>
                                        <span class="badge bg-secondary ms-2">${dog.geslacht === 'reuen' ? t('male') : dog.geslacht === 'teven' ? t('female') : t('unknown')}</span>
                                    </div>
                                </div>
                                <div class="col-md-6 text-end">
                                    <h5><code>${dog.stamboomnr || 'Geen stamboomnummer'}</code></h5>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card parents-info">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">${t('father')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0">${fatherInfo.naam}</p>
                                            ${fatherInfo.stamboomnr ? `<small class="text-muted">${fatherInfo.stamboomnr}</small>` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card parents-info">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">${t('mother')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0">${motherInfo.naam}</p>
                                            ${motherInfo.stamboomnr ? `<small class="text-muted">${motherInfo.stamboomnr}</small>` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            ${dog.opmerkingen ? `
                            <div class="mt-4 details-section">
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
            if (searchTerm && searchTerm.length >= 1) {
                this.filterDogsByName(searchTerm.toLowerCase());
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