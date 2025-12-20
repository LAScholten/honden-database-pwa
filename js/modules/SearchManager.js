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
                searchDog: "Hond Zoeken",
                searchName: "Zoek hond op naam",
                searchPlaceholder: "Typ hondennaam...",
                noDogsFound: "Geen honden gevonden",
                typeToSearch: "Begin met typen om te zoeken",
                searchResults: "Zoekresultaten",
                found: "gevonden",
                name: "Naam",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                close: "Sluiten",
                dogDetails: "Hond Details",
                father: "Vader",
                mother: "Moeder",
                parentsUnknown: "Onbekend",
                male: "Reu",
                female: "Teef",
                unknown: "Onbekend",
                loading: "Honden laden..."
            },
            en: {
                searchDog: "Search Dog",
                searchName: "Search dog by name",
                searchPlaceholder: "Type dog name...",
                noDogsFound: "No dogs found",
                typeToSearch: "Start typing to search",
                searchResults: "Search Results",
                found: "found",
                name: "Name",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                close: "Close",
                dogDetails: "Dog Details",
                father: "Father",
                mother: "Mother",
                parentsUnknown: "Unknown",
                male: "Male",
                female: "Female",
                unknown: "Unknown",
                loading: "Loading dogs..."
            },
            de: {
                searchDog: "Hund suchen",
                searchName: "Hund nach Namen suchen",
                searchPlaceholder: "Hundenamen eingeben...",
                noDogsFound: "Keine Hunde gefunden",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                searchResults: "Suchergebnisse",
                found: "gefunden",
                name: "Name",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geschlecht",
                close: "Schließen",
                dogDetails: "Hund Details",
                father: "Vater",
                mother: "Mutter",
                parentsUnknown: "Unbekannt",
                male: "Rüde",
                female: "Hündin",
                unknown: "Unbekannt",
                loading: "Hunde laden..."
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
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
                            <div class="mb-4">
                                <div class="mb-3">
                                    <input type="text" class="form-control search-input" id="searchNameInput" 
                                           placeholder="${t('searchPlaceholder')}" autocomplete="off">
                                </div>
                            </div>
                            
                            <div id="searchResultsContainer">
                                <div class="text-center py-4">
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
        `;
    }
    
    setupEvents() {
        this.setupSearch();
    }
    
    setupSearch() {
        const searchInput = document.getElementById('searchNameInput');
        if (!searchInput) return;
        
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadSearchData();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.filterDogsByName(searchTerm);
            } else {
                this.showInitialView();
            }
        });
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="text-center py-4">
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
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Laden mislukt: ${error.message}`);
        }
    }
    
    filterDogsByName(searchTerm = '') {
        this.filteredDogs = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
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
                <div class="text-center py-4">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-stats mb-3">
                <strong>${t('searchResults')}:</strong> ${this.filteredDogs.length} ${t('found')}
            </div>
            
            <div class="row">
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : t('unknown');
            const genderClass = dog.geslacht === 'reuen' ? 'badge-male' : 
                              dog.geslacht === 'teven' ? 'badge-female' : 'badge-unknown';
            
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
        
        document.querySelectorAll('.dog-result-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const hondId = card.getAttribute('data-id');
                this.viewDog(hondId);
            });
        });
    }
    
    async viewDog(hondId) {
        try {
            const hond = this.allDogs.find(h => h.id === parseInt(hondId));
            
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
        
        let fatherInfo = { naam: t('parentsUnknown'), stamboomnr: '' };
        let motherInfo = { naam: t('parentsUnknown'), stamboomnr: '' };
        
        if (dog.vaderId) {
            const father = this.allDogs.find(d => d.id === dog.vaderId);
            if (father) {
                fatherInfo = { 
                    naam: father.naam, 
                    stamboomnr: father.stamboomnr || ''
                };
            }
        }
        
        if (dog.moederId) {
            const mother = this.allDogs.find(d => d.id === dog.moederId);
            if (mother) {
                motherInfo = { 
                    naam: mother.naam, 
                    stamboomnr: mother.stamboomnr || ''
                };
            }
        }
        
        const html = `
            <div class="mb-3">
                <button class="btn btn-sm btn-outline-secondary back-btn" id="backToSearchBtn">
                    <i class="bi bi-arrow-left"></i> Terug naar zoeken
                </button>
            </div>
            
            <div class="details-section">
                <div class="row align-items-center mb-3">
                    <div class="col">
                        <h4 class="mb-0">${dog.naam}</h4>
                        <div class="mt-1">
                            ${dog.ras ? `<span class="badge bg-info">${dog.ras}</span>` : ''}
                            ${dog.geslacht === 'reuen' ? `<span class="badge bg-primary ms-1">${t('male')}</span>` : ''}
                            ${dog.geslacht === 'teven' ? `<span class="badge bg-danger ms-1">${t('female')}</span>` : ''}
                        </div>
                    </div>
                    <div class="col-auto">
                        ${dog.stamboomnr ? `<code class="fs-5">${dog.stamboomnr}</code>` : ''}
                    </div>
                </div>
                
                <div class="row mt-3">
                    <div class="col-md-6 mb-3">
                        <div class="parents-info p-3 bg-light rounded">
                            <div class="fw-bold mb-1">${t('father')}:</div>
                            <div class="fs-5">${fatherInfo.naam}</div>
                            ${fatherInfo.stamboomnr ? `<div class="text-muted">${fatherInfo.stamboomnr}</div>` : ''}
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="parents-info p-3 bg-light rounded">
                            <div class="fw-bold mb-1">${t('mother')}:</div>
                            <div class="fs-5">${motherInfo.naam}</div>
                            ${motherInfo.stamboomnr ? `<div class="text-muted">${motherInfo.stamboomnr}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
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