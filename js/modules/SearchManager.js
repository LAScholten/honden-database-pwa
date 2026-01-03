/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam en kennelnaam
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.searchType = 'name';
        this.stamboomManager = null;
        this.isMobileCollapsed = false;
        this.dogPhotosCache = new Map();
        this.modalClosing = false;
        
        this.translations = {
            nl: {
                searchDog: "Hond Zoeken",
                searchName: "Zoek hond op naam (of naam + kennelnaam)",
                searchKennel: "Zoek hond op kennelnaam",
                searchPlaceholder: "Typ hondennaam... of 'naam kennelnaam'",
                kennelPlaceholder: "Typ kennelnaam...",
                noDogsFound: "Geen honden gevonden",
                typeToSearch: "Begin met typen om te zoeken",
                typeToSearchKennel: "Typ een kennelnaam om te zoeken",
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
                viewingParent: "Bekijkt ouder",
                clickToView: "Klik om details te bekijken",
                parents: "Ouders",
                noHealthInfo: "Geen gezondheidsinformatie beschikbaar",
                noAdditionalInfo: "Geen extra informatie beschikbaar",
                selectDogToView: "Selecteer een hond om details te zien",
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
                grade: "Graad",
                status: "Status",
                notApplicable: "Niet van toepassing",
                viewMore: "Meer details",
                pedigreeButton: "Stamboom",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten"
            },
            en: {
                searchDog: "Search Dog",
                searchName: "Search dog by name (or name + kennel)",
                searchKennel: "Search dog by kennel name",
                searchPlaceholder: "Type dog name... or 'name kennelname'",
                kennelPlaceholder: "Type kennel name...",
                noDogsFound: "No dogs found",
                typeToSearch: "Start typing to search",
                typeToSearchKennel: "Type a kennel name to search",
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
                viewingParent: "Viewing parent",
                clickToView: "Click to view details",
                parents: "Parents",
                noHealthInfo: "No health information available",
                noAdditionalInfo: "No additional information available",
                selectDogToView: "Select a dog to view details",
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
                grade: "Grade",
                status: "Status",
                notApplicable: "Not applicable",
                viewMore: "View details",
                pedigreeButton: "Pedigree",
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close"
            },
            de: {
                searchDog: "Hund suchen",
                searchName: "Hund nach Namen suchen (oder Name + Kennel)",
                searchKennel: "Hund nach Kennelname suchen",
                searchPlaceholder: "Hundenamen eingeben... oder 'Name Kennelname'",
                kennelPlaceholder: "Kennelnamen eingeben...",
                noDogsFound: "Keine Hunde gefunden",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                typeToSearchKennel: "Kennelnamen eingeben um zu suchen",
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
                viewingParent: "Elternteil ansehen",
                clickToView: "Klicken für Details",
                parents: "Eltern",
                noHealthInfo: "Keine Gesundheitsinformationen verfügbar",
                noAdditionalInfo: "Keine zusätzlichen Informationen verfügbar",
                selectDogToView: "Wählen Sie einen Hund, um Details zu sehen",
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
                grade: "Grad",
                status: "Status",
                notApplicable: "Niet van toepassing",
                viewMore: "Mehr Details",
                pedigreeButton: "Ahnentafel",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen"
            }
        };
        
        this.setupGlobalEventListeners();
    }
    
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
        console.log('SearchManager: dependencies geïnjecteerd');
    }
    
    initialize() {
        console.log('SearchManager: initializing...');
        return Promise.resolve();
    }
    
    t(key, subKey = null) {
        if (subKey && this.translations[this.currentLang][key] && typeof this.translations[this.currentLang][key] === 'object') {
            return this.translations[this.currentLang][key][subKey] || subKey;
        }
        return this.translations[this.currentLang][key] || key;
    }
    
    setupGlobalEventListeners() {
        document.addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.photo-thumbnail');
            if (thumbnail) {
                e.preventDefault();
                e.stopPropagation();
                
                const photoSrc = thumbnail.getAttribute('data-photo-src');
                if (photoSrc && photoSrc.trim() !== '') {
                    const popupTitle = document.querySelector('.popup-title');
                    let dogName = '';
                    if (popupTitle) {
                        dogName = popupTitle.textContent.trim();
                        dogName = dogName.replace(/^[^a-zA-Z]*/, '').trim();
                    }
                    this.showLargePhoto(photoSrc, dogName);
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('photo-large-close') || 
                e.target.classList.contains('photo-large-close-btn') ||
                e.target.closest('.photo-large-close') ||
                e.target.closest('.photo-large-close-btn')) {
                const overlay = document.getElementById('photoLargeOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            if (e.target.id === 'photoLargeOverlay') {
                const overlay = e.target;
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        });
    }
    
    async getDogPhotos(dogId) {
        if (!dogId || dogId === 0) return [];
        
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog || !dog.stamboomnr) return [];
        
        const cacheKey = `${dogId}_${dog.stamboomnr}`;
        if (this.dogPhotosCache.has(cacheKey)) {
            return this.dogPhotosCache.get(cacheKey);
        }
        
        try {
            const photos = await this.db.getFotosVoorStamboomnr(dog.stamboomnr);
            this.dogPhotosCache.set(cacheKey, photos || []);
            return photos || [];
        } catch (error) {
            console.error('Fout bij ophalen foto\'s voor hond:', dogId, error);
            return [];
        }
    }
    
    async checkDogHasPhotos(dogId) {
        const photos = await this.getDogPhotos(dogId);
        return photos.length > 0;
    }
    
    showLargePhoto(photoData, dogName = '') {
        const existingOverlay = document.getElementById('photoLargeOverlay');
        if (existingOverlay) existingOverlay.remove();
        
        const overlayHTML = `
            <div class="photo-large-overlay" id="photoLargeOverlay" style="display: flex;">
                <div class="photo-large-container" id="photoLargeContainer">
                    <div class="photo-large-header">
                        <button type="button" class="btn-close btn-close-white photo-large-close" aria-label="${this.t('closePhoto')}"></button>
                    </div>
                    <div class="photo-large-content">
                        <img src="${photoData}" 
                             alt="${dogName || 'Foto'}" 
                             class="photo-large-img"
                             id="photoLargeImg"
                             style="max-width: 90vw; max-height: 70vh; object-fit: contain;">
                    </div>
                    <div class="photo-large-footer text-center py-3">
                        <button type="button" class="btn btn-secondary photo-large-close-btn">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('closePhoto')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('photoLargeOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
        };
        document.addEventListener('keydown', closeOnEscape);
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
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}" id="searchModalCloseBtn"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-5 border-end p-3" id="searchColumn">
                                        <div class="sticky-top" style="top: 15px;">
                                            <div class="d-flex mb-3 border-bottom">
                                                <button type="button" class="btn btn-search-type btn-outline-info active me-2" data-search-type="name">
                                                    ${t('searchName')}
                                                </button>
                                                <button type="button" class="btn btn-search-type btn-outline-info" data-search-type="kennel">
                                                    ${t('searchKennel')}
                                                </button>
                                            </div>
                                            
                                            <div class="mb-4" id="nameSearchField">
                                                <label for="searchNameInput" class="form-label fw-bold">${t('searchName')}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-white border-end-0">
                                                        <i class="bi bi-person text-muted"></i>
                                                    </span>
                                                    <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                           id="searchNameInput" 
                                                           placeholder="${t('searchPlaceholder')}" 
                                                           autocomplete="off">
                                                </div>
                                                <div class="form-text mt-1">${t('typeToSearch')}</div>
                                            </div>
                                            
                                            <div class="mb-4 d-none" id="kennelSearchField">
                                                <label for="searchKennelInput" class="form-label fw-bold">${t('searchKennel')}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-white border-end-0">
                                                        <i class="bi bi-house text-muted"></i>
                                                    </span>
                                                    <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                           id="searchKennelInput" 
                                                           placeholder="${t('kennelPlaceholder')}" 
                                                           autocomplete="off">
                                                </div>
                                                <div class="form-text mt-1">${t('typeToSearchKennel')}</div>
                                            </div>
                                            
                                            <div id="searchResultsContainer">
                                                <div class="text-center py-5">
                                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-7 p-3" id="detailsColumn">
                                        <div id="detailsContainer">
                                            <div class="text-center py-5">
                                                <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                                                <p class="mt-3 text-muted">${t('selectDogToView')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="searchModalCloseBtnFooter">
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
                
                .btn-search-type {
                    flex: 1;
                    border-radius: 8px;
                    padding: 8px 12px;
                    transition: all 0.3s;
                }
                
                .btn-search-type.active {
                    background-color: #0d6efd;
                    color: white;
                    border-color: #0d6efd;
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
                
                .dog-name-line {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #0d6efd;
                    margin-bottom: 8px;
                }
                
                .dog-details-line {
                    color: #495057;
                    font-size: 0.95rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    align-items: center;
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
                
                .dog-name-header {
                    color: #0d6efd;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                
                .dog-detail-header-line {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    align-items: center;
                    margin-top: 8px;
                    color: #495057;
                }
                
                .dog-detail-header-line .vachtkleur {
                    color: #d63384;
                    font-weight: 500;
                    font-size: 0.95rem;
                }
                
                @media (max-width: 768px) {
                    .modal-body {
                        max-height: calc(100vh - 200px);
                        overflow-y: auto;
                    }
                    
                    .mobile-back-button {
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        background: white;
                        padding: 10px 0;
                        margin-bottom: 15px;
                        border-bottom: 1px solid #dee2e6;
                    }
                    
                    .dog-details-line {
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        align-items: center !important;
                        gap: 8px !important;
                    }
                    
                    .dog-detail-header-line {
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        align-items: center !important;
                        gap: 8px !important;
                    }
                    
                    .dog-details-line .stamboom,
                    .dog-details-line .ras,
                    .dog-details-line .geslacht,
                    .dog-details-line .vachtkleur,
                    .dog-detail-header-line .stamboom,
                    .dog-detail-header-line .ras,
                    .dog-detail-header-line .geslacht,
                    .dog-detail-header-line .vachtkleur {
                        font-size: 0.85rem !important;
                    }
                }
            </style>
        `;
    }
    
    setupEvents() {
        this.setupSearch();
    }
    
    setupSearch() {
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const searchType = e.target.getAttribute('data-search-type');
                this.switchSearchType(searchType);
            });
        });
        
        this.setupNameSearch();
        this.setupKennelSearch();
    }
    
    switchSearchType(type) {
        this.searchType = type;
        
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            const btnType = btn.getAttribute('data-search-type');
            if (btnType === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        const nameField = document.getElementById('nameSearchField');
        const kennelField = document.getElementById('kennelSearchField');
        
        if (type === 'name') {
            nameField.classList.remove('d-none');
            kennelField.classList.add('d-none');
            document.getElementById('searchNameInput').focus();
        } else {
            nameField.classList.add('d-none');
            kennelField.classList.remove('d-none');
            document.getElementById('searchKennelInput').focus();
        }
        
        this.showInitialView();
        this.clearDetails();
    }
    
    setupNameSearch() {
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
                this.filterDogsForNameField(searchTerm);
            } else {
                this.showInitialView();
                this.clearDetails();
            }
        });
    }
    
    setupKennelSearch() {
        const searchInput = document.getElementById('searchKennelInput');
        if (!searchInput) return;
        
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadSearchData();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.filterDogsByKennel(searchTerm);
            } else {
                this.showInitialView();
                this.clearDetails();
            }
        });
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        const t = this.t.bind(this);
        const message = this.searchType === 'name' ? t('typeToSearch') : t('typeToSearchKennel');
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${message}</p>
            </div>
        `;
    }
    
    clearDetails() {
        const container = document.getElementById('detailsContainer');
        if (!container) return;
        
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${t('selectDogToView')}</p>
            </div>
        `;
    }
    
    async loadSearchData() {
        this.showProgress(this.t('loading'));
        
        try {
            if (!this.db) {
                console.error('Database niet beschikbaar in SearchManager');
                this.hideProgress();
                return;
            }
            
            this.allDogs = await this.db.getHonden();
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            this.hideProgress();
            
            console.log(`${this.allDogs.length} honden geladen voor zoeken`);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Laden mislukt: ${error.message}`);
        }
    }
    
    filterDogsForNameField(searchTerm = '') {
        this.filteredDogs = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            const combined = `${naam} ${kennelnaam}`;
            return combined.startsWith(searchTerm);
        });
        
        this.displaySearchResults();
    }
    
    filterDogsByKennel(searchTerm = '') {
        this.filteredDogs = this.allDogs.filter(dog => {
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            return kennelnaam.startsWith(searchTerm);
        });
        
        this.filteredDogs.sort((a, b) => a.naam.localeCompare(b.naam));
        
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
            
            html += `
                <div class="dog-result-item" data-id="${dog.id}">
                    <div class="dog-name-line">
                        <span class="dog-name">${dog.naam || t('unknown')}</span>
                        ${dog.kennelnaam ? `<span class="text-muted ms-2">${dog.kennelnaam}</span>` : ''}
                    </div>
                    
                    <div class="dog-details-line">
                        ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                        ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                        <span class="geslacht">${genderText}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const hondId = parseInt(item.getAttribute('data-id'));
                this.selectDogById(hondId);
            });
        });
    }
    
    selectDog(dog) {
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
    
    async showDogDetails(dog, isParentView = false, originalDogId = null) {
        const t = this.t.bind(this);
        const container = document.getElementById('detailsContainer');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        // BELANGRIJK: Debug log om te zien wat er in de database staat
        console.log('=== DEBUG SearchManager ===');
        console.log('Hond gevonden:', {
            id: dog.id,
            naam: dog.naam,
            vader: dog.vader,
            vaderId: dog.vaderId,
            moeder: dog.moeder,
            moederId: dog.moederId
        });
        
        let fatherInfo = { 
            naam: dog.vader || t('parentsUnknown'), 
            stamboomnr: '', 
            ras: '', 
            kennelnaam: '' 
        };
        
        let motherInfo = { 
            naam: dog.moeder || t('parentsUnknown'), 
            stamboomnr: '', 
            ras: '', 
            kennelnaam: '' 
        };
        
        // EERST: Zoek op ID zoals DogDataManager doet
        if (dog.vaderId) {
            const father = this.allDogs.find(d => d.id === dog.vaderId);
            if (father) {
                fatherInfo = { 
                    id: father.id,
                    naam: father.naam || dog.vader,
                    stamboomnr: father.stamboomnr || '',
                    ras: father.ras || '',
                    kennelnaam: father.kennelnaam || ''
                };
                console.log('Vader gevonden via ID:', fatherInfo);
            } else {
                console.log(`Vader ID ${dog.vaderId} niet gevonden in allDogs`);
                fatherInfo.naam = dog.vader || t('parentsUnknown');
            }
        }
        
        if (dog.moederId) {
            const mother = this.allDogs.find(d => d.id === dog.moederId);
            if (mother) {
                motherInfo = { 
                    id: mother.id,
                    naam: mother.naam || dog.moeder,
                    stamboomnr: mother.stamboomnr || '',
                    ras: mother.ras || '',
                    kennelnaam: mother.kennelnaam || ''
                };
                console.log('Moeder gevonden via ID:', motherInfo);
            } else {
                console.log(`Moeder ID ${dog.moederId} niet gevonden in allDogs`);
                motherInfo.naam = dog.moeder || t('parentsUnknown');
            }
        }
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 'en-US');
            } catch (e) {
                return dateString;
            }
        };
        
        const genderText = dog.geslacht === 'reuen' ? t('male') : 
                          dog.geslacht === 'teven' ? t('female') : t('unknown');
        
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        
        const html = `
            <div class="details-card">
                ${isParentView ? `
                <div class="details-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-sm btn-outline-secondary back-button" data-original-dog="${originalDogId}">
                            <i class="bi bi-arrow-left me-1"></i> ${t('backToSearch')}
                        </button>
                        <div class="text-muted small">
                            <i class="bi bi-info-circle me-1"></i> ${t('viewingParent')}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="details-header ${isParentView ? 'pt-0' : ''}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="dog-name-header">${dog.naam || t('unknown')}</div>
                            ${dog.kennelnaam ? `<div class="text-muted mb-2">${dog.kennelnaam}</div>` : ''}
                            
                            <div class="dog-detail-header-line mt-2">
                                ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                <span class="geslacht">${genderText}</span>
                                ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? 
                                  `<span class="vachtkleur">${dog.vachtkleur}</span>` : 
                                  `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                            </div>
                        </div>
                        <div class="text-end">
                            ${dog.geboortedatum ? `
                            <div class="text-muted">
                                <i class="bi bi-calendar me-1"></i>
                                ${formatDate(dog.geboortedatum)}
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="text-muted ${dog.geboortedatum ? 'mt-1' : ''}">
                                <i class="bi bi-calendar-x me-1"></i>
                                ${formatDate(dog.overlijdensdatum)}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="details-body">
                    ${hasPhotos ? `
                    <div class="photos-section">
                        <div class="photos-title">
                            <div class="photos-title-text">
                                <i class="bi bi-camera"></i>
                                <span>${t('photos')}</span>
                            </div>
                            <div class="click-hint-text">${t('clickToEnlarge')}</div>
                        </div>
                        <div class="photos-grid-container" id="photosGrid${dog.id}">
                            <!-- Foto's worden hier ingeladen -->
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="info-group">
                        <div class="info-group-title d-flex justify-content-between align-items-center">
                            <div>
                                <i class="bi bi-people me-1"></i> ${t('parents')}
                            </div>
                            <!-- STAMBOOM KNOOP TERUG -->
                            <button class="btn btn-sm btn-outline-primary btn-pedigree" data-dog-id="${dog.id}">
                                <i class="bi bi-diagram-3 me-1"></i> ${t('pedigreeButton')}
                            </button>
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
                                    ${fatherInfo.kennelnaam ? `<div class="parent-info">${fatherInfo.kennelnaam}</div>` : ''}
                                    ${fatherInfo.id ? `
                                    <div class="click-hint">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        ${t('clickToView')}
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
                                    ${motherInfo.kennelnaam ? `<div class="parent-info">${motherInfo.kennelnaam}</div>` : ''}
                                    ${motherInfo.id ? `
                                    <div class="click-hint">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        ${t('clickToView')}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-heart-pulse me-1"></i> ${t('healthInfo')}
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('hipDysplasia')}</div>
                                <div>${dog.heupdysplasie || t('unknown')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('elbowDysplasia')}</div>
                                <div>${dog.elleboogdysplasie || t('unknown')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('patellaLuxation')}</div>
                                <div>${dog.patella || t('unknown')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('eyes')}</div>
                                <div>${dog.ogen || t('unknown')}</div>
                                ${dog.ogenVerklaring ? `<div class="text-muted small mt-1">${dog.ogenVerklaring}</div>` : ''}
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('dandyWalker')}</div>
                                <div>${dog.dandyWalker || t('unknown')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('thyroid')}</div>
                                <div>${dog.schildklier || t('unknown')}</div>
                                ${dog.schildklierVerklaring ? `<div class="text-muted small mt-1">${dog.schildklierVerklaring}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-info-circle me-1"></i> ${t('additionalInfo')}
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="fw-bold mb-1">${t('country')}</div>
                                <div>${dog.land || t('unknown')}</div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="fw-bold mb-1">${t('zipCode')}</div>
                                <div>${dog.postcode || t('unknown')}</div>
                            </div>
                        </div>
                        
                        <div class="mt-3">
                            <div class="fw-bold mb-2">${t('remarks')}</div>
                            <div class="remarks-box">
                                ${dog.opmerkingen ? dog.opmerkingen : t('noAdditionalInfo')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
        
        // Laad foto's
        if (hasPhotos) {
            this.loadAndDisplayPhotos(dog);
        }
        
        // Event listeners voor ouders
        if (fatherInfo.id) {
            const fatherCard = container.querySelector('.father-card');
            if (fatherCard) {
                fatherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(fatherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        if (motherInfo.id) {
            const motherCard = container.querySelector('.mother-card');
            if (motherCard) {
                motherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(motherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        // Event listener voor stamboom knop TERUG
        const pedigreeBtn = container.querySelector('.btn-pedigree');
        if (pedigreeBtn) {
            pedigreeBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(pedigreeBtn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        }
        
        if (isParentView) {
            const backButton = container.querySelector('.back-button');
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
        
        console.log('=== EINDE DEBUG ===');
    }
    
    async loadAndDisplayPhotos(dog) {
        try {
            const photos = await this.getDogPhotos(dog.id);
            const container = document.getElementById('detailsContainer');
            const photosGrid = container.querySelector(`#photosGrid${dog.id}`);
            
            if (!photosGrid || photos.length === 0) {
                return;
            }
            
            let photosHTML = '';
            photos.forEach((photo, index) => {
                let photoUrl = '';
                if (photo.data && typeof photo.data === 'string') {
                    const mimeType = photo.type || 'image/jpeg';
                    let cleanData = photo.data;
                    if (cleanData.startsWith('data:')) {
                        cleanData = cleanData.split(',')[1];
                    }
                    photoUrl = `data:${mimeType};base64,${cleanData}`;
                } else if (photo.url) {
                    photoUrl = photo.url;
                } else if (photo.filePath) {
                    photoUrl = photo.filePath;
                }
                
                if (photoUrl) {
                    photosHTML += `
                        <div class="photo-thumbnail" 
                             data-photo-id="${photo.id}" 
                             data-dog-id="${dog.id}" 
                             data-photo-index="${index}"
                             data-photo-src="${photoUrl}">
                            <img src="${photoUrl}" 
                                 alt="${dog.naam || ''} - ${photo.filename || ''}" 
                                 class="thumbnail-img"
                                 loading="lazy">
                            <div class="photo-hover">
                                <i class="bi bi-zoom-in"></i>
                            </div>
                        </div>
                    `;
                }
            });
            
            photosGrid.innerHTML = photosHTML;
            
        } catch (error) {
            console.error('Fout bij laden foto\'s:', error);
        }
    }
    
    showParentDetails(parentId, originalDogId) {
        const parent = this.allDogs.find(d => d.id === parentId);
        if (parent) {
            this.showDogDetails(parent, true, originalDogId);
            
            document.querySelectorAll('.dog-result-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-id')) === parentId) {
                    item.classList.add('selected');
                }
            });
        }
    }
    
    async openPedigree(dogId) {
        try {
            if (!this.stamboomManager) {
                console.log('Initializing StamboomManager...');
                this.stamboomManager = new StamboomManager(this.db, this.currentLang);
                await this.stamboomManager.initialize();
            }
            
            const dog = this.allDogs.find(d => d.id === dogId);
            if (!dog) {
                this.showError("Hond niet gevonden");
                return;
            }
            
            this.stamboomManager.showPedigree(dog);
            
        } catch (error) {
            console.error('Fout bij openen stamboom:', error);
            this.showError(`Fout bij openen stamboom: ${error.message}`);
        }
    }
    
    showProgress(message) {
        if (typeof super.showProgress === 'function') {
            super.showProgress(message);
        }
    }
    
    hideProgress() {
        if (typeof super.hideProgress === 'function') {
            super.hideProgress();
        }
    }
    
    showError(message) {
        if (typeof super.showError === 'function') {
            super.showError(message);
        } else {
            console.error('Error:', message);
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (typeof super.showSuccess === 'function') {
            super.showSuccess(message);
        }
    }
}