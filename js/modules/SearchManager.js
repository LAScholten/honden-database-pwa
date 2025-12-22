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
                searchPlaceholder: "Typ hondennaam, stamboomnummer of ras...",
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
                loading: "Honden laden...",
                backToSearch: "Terug naar zoeken",
                
                // Hond gegevens
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                eyesExplanation: "Verklaring ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                remarks: "Opmerkingen",
                healthInfo: "Gezondheidsinformatie",
                additionalInfo: "Extra informatie",
                
                // Gezondheidsstatussen
                hipGrades: {
                    A: "A - Geen tekenen van HD",
                    B: "B - Overgangsvorm",
                    C: "C - Lichte HD",
                    D: "D - Matige HD", 
                    E: "E - Ernstige HD"
                },
                elbowGrades: {
                    "0": "0 - Geen ED",
                    "1": "1 - Milde ED",
                    "2": "2 - Matige ED",
                    "3": "3 - Ernstige ED",
                    "NB": "NB - Niet bekend"
                },
                patellaGrades: {
                    "0": "0 - Geen PL",
                    "1": "1 - Af en toe luxatie",
                    "2": "2 - Regelmatig luxatie",
                    "3": "3 - Constante luxation"
                },
                eyeStatus: {
                    "Vrij": "Vrij",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Overig"
                },
                dandyStatus: {
                    "Vrij op DNA": "Vrij op DNA",
                    "Vrij op ouders": "Vrij op ouders", 
                    "Drager": "Drager",
                    "Lijder": "Lijder"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negatief",
                    "Positief": "Tgaa Positief"
                },
                
                // Labels
                grade: "Graad",
                status: "Status",
                unknown: "Onbekend",
                notApplicable: "Niet van toepassing",
                viewMore: "Meer details"
            },
            en: {
                searchDog: "Search Dog",
                searchName: "Search dog by name",
                searchPlaceholder: "Type dog name, pedigree number or breed...",
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
                loading: "Loading dogs...",
                backToSearch: "Back to search",
                
                // Dog details
                birthDate: "Birth date",
                deathDate: "Death date",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                eyesExplanation: "Eye explanation",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                remarks: "Remarks",
                healthInfo: "Health Information",
                additionalInfo: "Additional Information",
                
                // Health statuses
                hipGrades: {
                    A: "A - No signs of HD",
                    B: "B - Borderline",
                    C: "C - Mild HD",
                    D: "D - Moderate HD",
                    E: "E - Severe HD"
                },
                elbowGrades: {
                    "0": "0 - No ED",
                    "1": "1 - Mild ED",
                    "2": "2 - Moderate ED",
                    "3": "3 - Severe ED",
                    "NB": "NB - Not known"
                },
                patellaGrades: {
                    "0": "0 - No PL",
                    "1": "1 - Occasional luxation",
                    "2": "2 - Frequent luxation",
                    "3": "3 - Constant luxation"
                },
                eyeStatus: {
                    "Vrij": "Free",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Other"
                },
                dandyStatus: {
                    "Vrij op DNA": "Free on DNA",
                    "Vrij op ouders": "Free on parents",
                    "Drager": "Carrier",
                    "Lijder": "Affected"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negative",
                    "Positief": "Tgaa Positive"
                },
                
                // Labels
                grade: "Grade",
                status: "Status",
                unknown: "Unknown",
                notApplicable: "Not applicable",
                viewMore: "View details"
            },
            de: {
                searchDog: "Hund suchen",
                searchName: "Hund nach Namen suchen",
                searchPlaceholder: "Hundenamen, Stammbaum-Nummer oder Rasse eingeben...",
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
                loading: "Hunde laden...",
                backToSearch: "Zurück zur Suche",
                
                // Hund Details
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                eyesExplanation: "Augenerklärung",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                remarks: "Bemerkungen",
                healthInfo: "Gesundheitsinformationen",
                additionalInfo: "Zusätzliche Informationen",
                
                // Gesundheitsstatus
                hipGrades: {
                    A: "A - Keine Anzeichen van HD",
                    B: "B - Übergangsform",
                    C: "C - Leichte HD",
                    D: "D - Mittlere HD",
                    E: "E - Schwere HD"
                },
                elbowGrades: {
                    "0": "0 - Keine ED",
                    "1": "1 - Milde ED",
                    "2": "2 - Mittlere ED",
                    "3": "3 - Schwere ED",
                    "NB": "NB - Nicht bekannt"
                },
                patellaGrades: {
                    "0": "0 - Keine PL",
                    "1": "1 - Gelegentlich Luxation",
                    "2": "2 - Häufig Luxation",
                    "3": "3 - Ständige Luxation"
                },
                eyeStatus: {
                    "Vrij": "Frei",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Andere"
                },
                dandyStatus: {
                    "Vrij op DNA": "Frei auf DNA",
                    "Vrij op ouders": "Frei auf Eltern",
                    "Drager": "Träger",
                    "Lijder": "Betroffen"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negativ",
                    "Positief": "Tgaa Positiv"
                },
                
                // Labels
                grade: "Grad",
                status: "Status",
                unknown: "Unbekannt",
                notApplicable: "Niet zutreffend",
                viewMore: "Mehr Details"
            }
        };
    }
    
    t(key, subKey = null) {
        if (subKey && this.translations[this.currentLang][key] && typeof this.translations[this.currentLang][key] === 'object') {
            return this.translations[this.currentLang][key][subKey] || subKey;
        }
        return this.translations[this.currentLang][key] || key;
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search me-2"></i> ${t('searchDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="container-fluid">
                                <div class="row">
                                    <!-- Zoekkolom -->
                                    <div class="col-md-5 border-end p-3" id="searchColumn">
                                        <div class="sticky-top" style="top: 15px;">
                                            <div class="mb-4">
                                                <label for="searchNameInput" class="form-label fw-bold">${t('searchName')}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-white border-end-0">
                                                        <i class="bi bi-search text-muted"></i>
                                                    </span>
                                                    <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                           id="searchNameInput" 
                                                           placeholder="${t('searchPlaceholder')}" 
                                                           autocomplete="off">
                                                </div>
                                                <div class="form-text mt-1">${t('typeToSearch')}</div>
                                            </div>
                                            
                                            <div id="searchResultsContainer">
                                                <div class="text-center py-5">
                                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Details kolom -->
                                    <div class="col-md-7 p-3" id="detailsColumn">
                                        <div id="detailsContainer">
                                            <div class="text-center py-5">
                                                <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                                                <p class="mt-3 text-muted">${t('selectDogToView') || "Selecteer een hond om details te zien"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i> ${t('close')}
                            </button>
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
                    border-radius: 8px;
                    margin-bottom: 8px;
                    padding: 12px 15px;
                    background: white;
                }
                
                .dog-result-item:hover {
                    background-color: #f8f9fa;
                    border-color: #0d6efd;
                    transform: translateX(3px);
                }
                
                .dog-result-item.selected {
                    background-color: #e8f4fd;
                    border-color: #0d6efd;
                    border-left: 4px solid #0d6efd;
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
                
                .search-stats {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .details-card {
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .details-header {
                    background: white;
                    color: #212529;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .details-body {
                    padding: 20px;
                    background: white;
                }
                
                .info-group {
                    margin-bottom: 20px;
                }
                
                .info-group-title {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    color: #6c757d;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .info-row {
                    display: flex;
                    margin-bottom: 8px;
                    padding: 8px 0;
                    border-bottom: 1px solid #f8f9fa;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    width: 180px;
                    min-width: 180px;
                }
                
                .info-value {
                    color: #212529;
                    flex: 1;
                }
                
                .badge-hd {
                    background-color: #20c997;
                    color: white;
                }
                
                .badge-ed {
                    background-color: #6f42c1;
                    color: white;
                }
                
                .badge-pl {
                    background-color: #fd7e14;
                    color: white;
                }
                
                .badge-eyes {
                    background-color: #17a2b8;
                    color: white;
                }
                
                .badge-dandy {
                    background-color: #e83e8c;
                    color: white;
                }
                
                .badge-thyroid {
                    background-color: #28a745;
                    color: white;
                }
                
                .father-card {
                    background: #e8f4fd;
                    border: 1px solid #cfe2ff;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .father-card:hover {
                    background: #d1e7ff;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .mother-card {
                    background: #fce8f1;
                    border: 1px solid #f8d7e3;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .mother-card:hover {
                    background: #f9d9e9;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .parent-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #0d6efd;
                    margin-bottom: 5px;
                }
                
                .parent-mother-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #dc3545;
                    margin-bottom: 5px;
                }
                
                .parent-info {
                    color: #6c757d;
                    font-size: 0.85rem;
                }
                
                .click-hint {
                    font-size: 0.75rem;
                    color: #6c757d;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .back-button {
                    margin-bottom: 15px;
                }
                
                .remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 15px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                }
                
                .empty-state {
                    color: #adb5bd;
                    font-style: italic;
                }
                
                .dog-name-header {
                    color: #0d6efd;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                
                @media (max-width: 768px) {
                    .modal-body {
                        max-height: calc(100vh - 200px);
                        overflow-y: auto;
                    }
                    
                    .info-row {
                        flex-direction: column;
                    }
                    
                    .info-label {
                        width: 100%;
                        margin-bottom: 4px;
                    }
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
                this.filterDogs(searchTerm);
            } else {
                this.showInitialView();
                this.clearDetails();
            }
        });
        
        // Enter toets om eerste resultaat te selecteren
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.filteredDogs.length > 0) {
                e.preventDefault();
                this.selectDog(this.filteredDogs[0]);
            }
        });
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${t('typeToSearch')}</p>
            </div>
        `;
    }
    
    clearDetails() {
        const container = document.getElementById('detailsContainer');
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${t('selectDogToView') || "Selecteer een hond om details te zien"}</p>
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
    
    filterDogs(searchTerm = '') {
        // AANGEPAST: ALLEEN ZOEKEN OP NAAM VAN DE HOND - EN ALLEEN ALS HET BEGINT MET DE ZOEKTERM
        this.filteredDogs = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            // AANGEPAST: ALLEEN OP NAAM ZOEKEN EN ALLEEN ALS HET BEGINT MET DE ZOEKTERM
            return naam.startsWith(searchTerm);
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
                    <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-stats">
                <i class="bi bi-info-circle me-1"></i>
                ${this.filteredDogs.length} ${t('found')}
            </div>
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : t('unknown');
            const genderClass = dog.geslacht === 'reuen' ? 'badge bg-primary' : 
                              dog.geslacht === 'teven' ? 'badge bg-danger' : 'badge bg-secondary';
            
            html += `
                <div class="dog-result-item" data-id="${dog.id}">
                    <div class="dog-name">
                        ${dog.naam || 'Onbekend'}
                        <span class="${genderClass} ms-2" style="font-size: 0.7rem; padding: 2px 6px;">${genderText}</span>
                    </div>
                    <div class="dog-info">
                        ${dog.ras ? `
                        <div class="d-flex align-items-center">
                            <i class="bi bi-tag me-1" style="font-size: 0.8rem;"></i>
                            <span>${dog.ras}</span>
                        </div>
                        ` : ''}
                        
                        ${dog.stamboomnr ? `
                        <div class="d-flex align-items-center">
                            <i class="bi bi-hash me-1" style="font-size: 0.8rem;"></i>
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
                const hondId = parseInt(item.getAttribute('data-id'));
                this.selectDogById(hondId);
            });
        });
    }
    
    selectDog(dog) {
        // Markeer geselecteerd item
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.classList.remove('selected');
            if (parseInt(item.getAttribute('data-id')) === dog.id) {
                item.classList.add('selected');
            }
        });
        
        this.showDogDetails(dog);
    }
    
    selectDogById(hondId) {
        const dog = this.allDogs.find(h => h.id === hondId);
        if (dog) {
            this.selectDog(dog);
        }
    }
    
    showDogDetails(dog, isParentView = false, originalDogId = null) {
        const t = this.t.bind(this);
        const container = document.getElementById('detailsContainer');
        
        if (!container) return;
        
        // Zoek ouders
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '' };
        
        if (dog.vaderId) {
            const father = this.allDogs.find(d => d.id === dog.vaderId);
            if (father) {
                fatherInfo = { 
                    id: father.id,
                    naam: father.naam || t('unknown'),
                    stamboomnr: father.stamboomnr || '',
                    ras: father.ras || ''
                };
            }
        }
        
        if (dog.moederId) {
            const mother = this.allDogs.find(d => d.id === dog.moederId);
            if (mother) {
                motherInfo = { 
                    id: mother.id,
                    naam: mother.naam || t('unknown'),
                    stamboomnr: mother.stamboomnr || '',
                    ras: mother.ras || ''
                };
            }
        }
        
        // Format datum
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        };
        
        // Genereer health badge
        const getHealthBadge = (value, type) => {
            if (!value || value === '') return '';
            
            let badgeClass = '';
            let badgeText = value;
            
            switch(type) {
                case 'hip':
                    badgeClass = 'badge-hd';
                    badgeText = t('hipGrades', value) || value;
                    break;
                case 'elbow':
                    badgeClass = 'badge-ed';
                    badgeText = t('elbowGrades', value) || value;
                    break;
                case 'patella':
                    badgeClass = 'badge-pl';
                    badgeText = t('patellaGrades', value) || value;
                    break;
                case 'eyes':
                    badgeClass = 'badge-eyes';
                    badgeText = t('eyeStatus', value) || value;
                    break;
                case 'dandy':
                    badgeClass = 'badge-dandy';
                    badgeText = t('dandyStatus', value) || value;
                    break;
                case 'thyroid':
                    badgeClass = 'badge-thyroid';
                    badgeText = t('thyroidStatus', value) || value;
                    break;
            }
            
            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
        };
        
        const html = `
            <div class="details-card">
                ${isParentView ? `
                <!-- Terug knop voor parent view -->
                <div class="details-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-sm btn-outline-secondary back-button" data-original-dog="${originalDogId}">
                            <i class="bi bi-arrow-left me-1"></i> ${t('backToSearch')}
                        </button>
                        <div class="text-muted small">
                            <i class="bi bi-info-circle me-1"></i> ${t('viewingParent') || 'Bekijkt ouder'}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Header -->
                <div class="details-header ${isParentView ? 'pt-0' : ''}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="dog-name-header">${dog.naam || t('unknown')}</div>
                            <div class="d-flex align-items-center flex-wrap gap-2 mt-2">
                                ${dog.stamboomnr ? `<span class="badge bg-light text-dark">${dog.stamboomnr}</span>` : ''}
                                ${dog.ras ? `<span class="badge bg-light text-dark">${dog.ras}</span>` : ''}
                                <span class="badge ${dog.geslacht === 'reuen' ? 'bg-primary' : dog.geslacht === 'teven' ? 'bg-danger' : 'bg-secondary'}">
                                    ${dog.geslacht === 'reuen' ? t('male') : dog.geslacht === 'teven' ? t('female') : t('unknown')}
                                </span>
                            </div>
                        </div>
                        ${dog.geboortedatum || dog.overlijdensdatum ? `
                        <div class="text-end">
                            ${dog.geboortedatum ? `
                            <div class="text-muted">
                                <i class="bi bi-calendar me-1"></i>
                                ${formatDate(dog.geboortedatum)}
                            </div>
                            ` : ''}
                            ${dog.overlijdensdatum ? `
                            <div class="text-muted mt-1">
                                <i class="bi bi-calendar-x me-1"></i>
                                ${formatDate(dog.overlijdensdatum)}
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Body -->
                <div class="details-body">
                    <!-- Ouders -->
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-people me-1"></i> ${t('parents') || 'Ouders'}
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="father-card" ${fatherInfo.id ? `data-parent-id="${fatherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                    <div class="fw-bold mb-1 text-primary">
                                        <i class="bi bi-gender-male me-1"></i> ${t('father')}
                                    </div>
                                    <div class="parent-name">${fatherInfo.naam}</div>
                                    ${fatherInfo.stamboomnr ? `<div class="parent-info">${fatherInfo.stamboomnr}</div>` : ''}
                                    ${fatherInfo.ras ? `<div class="parent-info">${fatherInfo.ras}</div>` : ''}
                                    ${fatherInfo.id ? `
                                    <div class="click-hint">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        ${t('clickToView') || 'Klik om details te bekijken'}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="mother-card" ${motherInfo.id ? `data-parent-id="${motherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                    <div class="fw-bold mb-1 text-danger">
                                        <i class="bi bi-gender-female me-1"></i> ${t('mother')}
                                    </div>
                                    <div class="parent-mother-name">${motherInfo.naam}</div>
                                    ${motherInfo.stamboomnr ? `<div class="parent-info">${motherInfo.stamboomnr}</div>` : ''}
                                    ${motherInfo.ras ? `<div class="parent-info">${motherInfo.ras}</div>` : ''}
                                    ${motherInfo.id ? `
                                    <div class="click-hint">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        ${t('clickToView') || 'Klik om details te bekijken'}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Gezondheidsinformatie -->
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-heart-pulse me-1"></i> ${t('healthInfo')}
                        </div>
                        
                        <div class="row">
                            ${dog.heupdysplasie ? `
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('hipDysplasia')}</div>
                                <div>${getHealthBadge(dog.heupdysplasie, 'hip')}</div>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('elbowDysplasia')}</div>
                                <div>${getHealthBadge(dog.elleboogdysplasie, 'elbow')}</div>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('patellaLuxation')}</div>
                                <div>${getHealthBadge(dog.patella, 'patella')}</div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('eyes')}</div>
                                <div>${getHealthBadge(dog.ogen, 'eyes')}</div>
                                ${dog.ogenVerklaring ? `<div class="text-muted small mt-1">${dog.ogenVerklaring}</div>` : ''}
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('dandyWalker')}</div>
                                <div>${getHealthBadge(dog.dandyWalker, 'dandy')}</div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('thyroid')}</div>
                                <div>${getHealthBadge(dog.schildklier, 'thyroid')}</div>
                                ${dog.schildklierVerklaring ? `<div class="text-muted small mt-1">${dog.schildklierVerklaring}</div>` : ''}
                            </div>
                            ` : ''}
                        </div>
                        
                        ${!dog.heupdysplasie && !dog.elleboogdysplasie && !dog.patella && 
                          !dog.ogen && !dog.dandyWalker && !dog.schildklier ? `
                        <div class="text-muted text-center py-3">
                            <i class="bi bi-heart me-1"></i> ${t('noHealthInfo') || 'Geen gezondheidsinformatie beschikbaar'}
                        </div>
                        ` : ''}
                    </div>
                    
                    <!-- Extra informatie -->
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-info-circle me-1"></i> ${t('additionalInfo')}
                        </div>
                        
                        ${dog.land || dog.postcode ? `
                        <div class="row mb-3">
                            ${dog.land ? `
                            <div class="col-md-6">
                                <div class="fw-bold mb-1">${t('country')}</div>
                                <div>${dog.land}</div>
                            </div>
                            ` : ''}
                            
                            ${dog.postcode ? `
                            <div class="col-md-6">
                                <div class="fw-bold mb-1">${t('zipCode')}</div>
                                <div>${dog.postcode}</div>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                        
                        ${dog.opmerkingen ? `
                        <div class="mt-3">
                            <div class="fw-bold mb-2">${t('remarks')}</div>
                            <div class="remarks-box">
                                ${dog.opmerkingen}
                            </div>
                        </div>
                        ` : ''}
                        
                        ${!dog.land && !dog.postcode && !dog.opmerkingen ? `
                        <div class="text-muted text-center py-3">
                            <i class="bi bi-info me-1"></i> ${t('noAdditionalInfo') || 'Geen extra informatie beschikbaar'}
                        </div>
                        ` : ''}
                    </div>
                    
                    <!-- Timestamps -->
                    ${dog.createdAt || dog.updatedAt ? `
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-clock-history me-1"></i> Systeem informatie
                        </div>
                        <div class="row">
                            ${dog.createdAt ? `
                            <div class="col-md-6">
                                <div class="text-muted small">Aangemaakt</div>
                                <div class="small">${formatDate(dog.createdAt)}</div>
                            </div>
                            ` : ''}
                            ${dog.updatedAt ? `
                            <div class="col-md-6">
                                <div class="text-muted small">Laatst bijgewerkt</div>
                                <div class="small">${formatDate(dog.updatedAt)}</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Voeg event listeners toe voor ouderknoppen
        if (fatherInfo.id) {
            const fatherCard = document.querySelector('.father-card');
            if (fatherCard) {
                fatherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(fatherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        if (motherInfo.id) {
            const motherCard = document.querySelector('.mother-card');
            if (motherCard) {
                motherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(motherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        // Voeg event listener toe voor terugknop
        if (isParentView) {
            const backButton = document.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    const originalDogId = parseInt(backButton.getAttribute('data-original-dog'));
                    const originalDog = this.allDogs.find(d => d.id === originalDogId);
                    if (originalDog) {
                        this.showDogDetails(originalDog);
                    }
                });
            }
        }
    }
    
    showParentDetails(parentId, originalDogId) {
        const parent = this.allDogs.find(d => d.id === parentId);
        if (parent) {
            this.showDogDetails(parent, true, originalDogId);
            
            // Markeer ook de ouder in de zoekkolom
            document.querySelectorAll('.dog-result-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-id')) === parentId) {
                    item.classList.add('selected');
                }
            });
        }
    }
}