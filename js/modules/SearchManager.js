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
            
            <style>
                .search-input {
                    font-size: 1.1rem;
                    padding: 10px 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                
                .search-input:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
                
                .dog-result-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    padding: 12px 15px;
                    background: white;
                }
                
                .dog-result-item:hover {
                    background-color: #f8f9fa;
                    border-color: #0d6efd;
                    transform: translateX(3px);
                }
                
                .dog-result-item:active {
                    background-color: #e9ecef;
                }
                
                .dog-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #0d6efd;
                    margin-bottom: 4px;
                }
                
                .dog-info {
                    color: #6c757d;
                    font-size: 0.85rem;
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }
                
                .dog-info-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .dog-info-item i {
                    font-size: 0.8rem;
                    color: #adb5bd;
                }
                
                .search-stats {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .back-btn {
                    margin-bottom: 15px;
                    padding: 6px 12px;
                    font-size: 0.875rem;
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
                    padding: 12px;
                    border-radius: 4px;
                    margin-bottom: 10px;
                }
                
                .gender-badge {
                    font-size: 0.75rem;
                    padding: 3px 6px;
                    border-radius: 4px;
                }
                
                .badge-male {
                    background-color: #0d6efd;
                    color: white;
                }
                
                .badge-female {
                    background-color: #dc3545;
                    color: white;
                }
                
                .badge-unknown {
                    background-color: #6c757d;
                    color: white;
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
            
            console.log(`${this.allDogs.length} honden geladen voor zoeken`);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Laden mislukt: ${error.message}`);
        }
    }
    
    filterDogsByName(searchTerm = '') {
        // BELANGRIJK: Zoek op het BEGIN van de naam (case-insensitive)
        this.filteredDogs = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
            
            // Check of de naam BEGINT met de zoekterm
            return dogName.startsWith(searchTerm);
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
            <div class="search-stats">
                ${this.filteredDogs.length} ${t('found')}
            </div>
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : t('unknown');
            const genderClass = dog.geslacht === 'reuen' ? 'badge-male' : 
                              dog.geslacht === 'teven' ? 'badge-female' : 'badge-unknown';
            
            // Markeer het overeenkomende deel van de naam
            const searchTerm = document.getElementById('searchNameInput').value.toLowerCase();
            const dogName = dog.naam || '';
            let displayedName = dogName;
            
            // Als de zoekterm aan het begin staat, markeer deze
            if (dogName.toLowerCase().startsWith(searchTerm) && searchTerm.length > 0) {
                const matchPart = dogName.substring(0, searchTerm.length);
                const restPart = dogName.substring(searchTerm.length);
                displayedName = `<span class="text-primary fw-bold">${matchPart}</span>${restPart}`;
            }
            
            html += `
                <div class="dog-result-item" data-id="${dog.id}">
                    <div class="dog-name">
                        ${displayedName}
                        <span class="gender-badge ${genderClass} ms-2">${genderText}</span>
                    </div>
                    <div class="dog-info">
                        ${dog.ras ? `
                        <div class="dog-info-item">
                            <i class="bi bi-tag"></i>
                            <span>${dog.ras}</span>
                        </div>
                        ` : ''}
                        
                        ${dog.stamboomnr ? `
                        <div class="dog-info-item">
                            <i class="bi bi-hash"></i>
                            <span>${dog.stamboomnr}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Event listeners voor ALLE hond items
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const hondId = item.getAttribute('data-id');
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
        
        // Zoek ouders via ID's
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
                        <div class="parents-info">
                            <div class="fw-bold mb-1">${t('father')}:</div>
                            <div class="fs-5">${fatherInfo.naam}</div>
                            ${fatherInfo.stamboomnr ? `<div class="text-muted">${fatherInfo.stamboomnr}</div>` : ''}
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="parents-info">
                            <div class="fw-bold mb-1">${t('mother')}:</div>
                            <div class="fs-5">${motherInfo.naam}</div>
                            ${motherInfo.stamboomnr ? `<div class="text-muted">${motherInfo.stamboomnr}</div>` : ''}
                        </div>
                    </div>
                </div>
                
                ${dog.geboortedatum || dog.kleur || dog.chipnummer || dog.opmerkingen ? `
                <div class="mt-3">
                    <h6 class="border-bottom pb-2 mb-3">Extra informatie</h6>
                    <div class="row">
                        ${dog.geboortedatum ? `
                        <div class="col-md-6 mb-2">
                            <strong>Geboortedatum:</strong><br>
                            ${dog.geboortedatum}
                        </div>
                        ` : ''}
                        
                        ${dog.kleur ? `
                        <div class="col-md-6 mb-2">
                            <strong>Kleur:</strong><br>
                            ${dog.kleur}
                        </div>
                        ` : ''}
                        
                        ${dog.chipnummer ? `
                        <div class="col-12 mb-2">
                            <strong>Chipnummer:</strong><br>
                            <code>${dog.chipnummer}</code>
                        </div>
                        ` : ''}
                        
                        ${dog.opmerkingen ? `
                        <div class="col-12 mt-2 pt-2 border-top">
                            <strong>Opmerkingen:</strong><br>
                            <p class="text-muted mb-0">${dog.opmerkingen}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
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