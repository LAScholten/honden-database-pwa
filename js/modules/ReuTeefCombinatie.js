/**
 * Reu en Teef Combinatie Module - MET STAMBOOMMANAGER DATA FIX
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = [];
        this.hondenCache = new Map();
        
        // Stamboom Manager instance
        this.stamboomManager = null;
        // COI Calculator instance
        this.coiCalculator = null;
        
        // Track initialisatie status
        this.isInitialized = false;
        
        // Vertalingen (jouw volledige object - behouden zoals het is)
        this.translations = {
            nl: {
                title: "Reu en Teef Combinatie",
                description: "Selecteer een specifieke reu en teef voor uw fokplan",
                mother: "Teef (Moeder)",
                selectMother: "Selecteer een teef...",
                father: "Reu (Vader)",
                selectFather: "Selecteer een reu...",
                searchPlaceholder: "Typ om te zoeken...",
                back: "Terug",
                showPedigree: "Toekomstige Stamboom Tonen",
                showFuturePuppy: "Toon Toekomstige Pup Stamboom",
                pedigreeTitle: "Toekomstige Pup Stamboom",
                close: "Sluiten",
                loading: "Laden...",
                noDogFound: "Geen hond gevonden",
                unknownBreed: "Onbekend ras",
                genderTeef: "Teef",
                genderReu: "Reu",
                kennel: "Kennel:",
                pedigreeNumber: "Stamboomnr:",
                birthDate: "Geboortedatum:",
                healthInfo: "Gezondheidsinformatie",
                color: "Vachtkleur:",
                searchByName: "Zoek op naam of kennel",
                dogDetails: "Hond details",
                selectDogFirst: "Selecteer eerst een reu én een teef",
                loadingPedigree: "Stamboom wordt geladen...",
                unknownAncestor: "Onbekend",
                fatherLabel: "Vader",
                motherLabel: "Moeder",
                grandfatherLabel: "Grootvader",
                grandmotherLabel: "Grootmoeder",
                greatGrandfatherLabel: "Overgrootvader",
                greatGrandmotherLabel: "Overgrootmoeder",
                typeToSearch: "Begin met typen om te zoeken",
                noDogsFound: "Geen honden gevonden",
                found: "gevonden",
                futurePuppyName: "Toekomstige Pup",
                futurePuppyDescription: "Voorspelling van combinatie {reu} × {teef}",
                futurePuppyTitle: "Stamboom voor toekomstige pup uit combinatie {reu} × {teef}",
                predictedPedigree: "Voorspelde stamboom",
                combinedParents: "Combinatie ouders",
                // COI labels toegevoegd voor popup
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Sluiten",
                predictedCoi: "Voorspelde Inteeltcoëfficiënt",
                futurePuppyInfo: "Toekomstige Pup Informatie",
                clickForDetails: "Klik voor details",
                healthInLine: "Gezondheid in de lijn 6 generaties",
                healthCategory: "Gezondheidscategorie",
                motherLine: "Moederlijn",
                fatherLine: "Vaderlijn",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD niet bekend",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED niet bekend",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL niet bekend",
                eyesFree: "Ogen vrij",
                eyesDist: "Ogen Dist",
                eyesOther: "Ogen overig",
                eyesUnknown: "Ogen niet bekend",
                dwlmDnaFree: "Dandy Walker (DNA) vrij",
                dwlmParentsFree: "Dandy Walker (ouders) vrij",
                dwlmUnknown: "Dandy Walker niet bekend",
                thyroidTested: "Schildklier getest",
                thyroidUnknown: "Schildklier niet bekend",
                occurrences: "Aantal keer"
            },
            en: {
                // ... [English translations] ...
            },
            de: {
                // ... [German translations] ...
            }
        };
    }
    
    injectDependencies(db, auth, stamboomManager) {
        this.db = db;
        this.auth = auth;
        this.stamboomManager = stamboomManager;
        console.log('✅ ReuTeefCombinatie: StamboomManager geïnjecteerd');
    }
    
    async initialize() {
        console.log('🔄 ReuTeefCombinatie initialiseren...');
        
        if (this.isInitialized) {
            console.log('✅ ReuTeefCombinatie al geïnitialiseerd');
            return;
        }
        
        try {
            // Laad alle honden data
            await this.loadAllHonden();
            
            // Initialiseer COI Calculator
            if (typeof COICalculator !== 'undefined') {
                this.coiCalculator = new COICalculator(this.allHonden);
                console.log('✅ COICalculator geïnitialiseerd in ReuTeefCombinatie');
            }
            
            this.isInitialized = true;
            console.log('✅ ReuTeefCombinatie succesvol geïnitialiseerd');
            
        } catch (error) {
            console.error('❌ Fout bij initialiseren ReuTeefCombinatie:', error);
            throw error;
        }
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        
        // Vervang parameters in tekst
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
    
    async loadContent() {
        console.log('🔄 ReuTeefCombinatie.loadContent() aangeroepen');
        
        // Controleer of we geïnitialiseerd zijn
        if (!this.isInitialized) {
            console.log('ℹ️ Nog niet geïnitialiseerd, initialiseer nu...');
            try {
                await this.initialize();
            } catch (error) {
                console.error('❌ Initialisatie mislukt:', error);
                this.showAlert('Kon module niet initialiseren. Probeer opnieuw.', 'danger');
                return;
            }
        }
        
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) {
            console.error('❌ Content container niet gevonden');
            return;
        }
        
        // Reset geselecteerde honden
        this.selectedTeef = null;
        this.selectedReu = null;
        
        content.innerHTML = `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle"></i>
                <strong>${t('searchByName')}</strong><br>
                ${t('description')}
            </div>
            
            <h5 class="mb-4">
                <i class="bi bi-gender-male-female text-purple"></i> ${t('title')}
            </h5>
            
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-female text-pink me-2"></i>${t('mother')}
                            </h6>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-search me-1"></i>${t('selectMother')}
                                </label>
                                <input type="text" 
                                       class="form-control search-input" 
                                       id="teefSearch" 
                                       placeholder="${t('searchPlaceholder')}"
                                       autocomplete="off">
                            </div>
                            
                            <!-- Zoekresultaten container -->
                            <div class="search-results-container flex-grow-1 mt-2" id="teefSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="teefDetails" class="d-none">
                                <!-- Teef details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-male text-blue me-2"></i>${t('father')}
                            </h6>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-search me-1"></i>${t('selectFather')}
                                </label>
                                <input type="text" 
                                       class="form-control search-input" 
                                       id="reuSearch" 
                                       placeholder="${t('searchPlaceholder')}"
                                       autocomplete="off">
                            </div>
                            
                            <!-- Zoekresultaten container -->
                            <div class="search-results-container flex-grow-1 mt-2" id="reuSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="reuDetails" class="d-none">
                                <!-- Reu details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // ALLEEN PAARSE KNOPS (geen groene knop)
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="showPedigreeBtn" disabled>
                <i class="bi bi-diagram-3 me-1"></i> ${t('showFuturePuppy')}
            </button>
        `;
        
        // Voeg CSS toe
        this.addStyles();
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('showPedigreeBtn').addEventListener('click', async () => {
            await this.showFuturePuppyPedigree();
        });
        
        // Setup zoekfunctionaliteit voor teef
        this.setupSearch('teefSearch', 'teefSearchResults', 'teven', (hond) => {
            this.selectTeef(hond);
        });
        
        // Setup zoekfunctionaliteit voor reu
        this.setupSearch('reuSearch', 'reuSearchResults', 'reuen', (hond) => {
            this.selectReu(hond);
        });
        
        // Update button states
        this.updateButtonStates();
        
        console.log('✅ ReuTeefCombinatie content geladen');
    }
    
    addStyles() {
        if (!document.querySelector('#reuteef-combinatie-styles')) {
            const style = document.createElement('style');
            style.id = 'reuteef-combinatie-styles';
            style.textContent = `
                /* CONSISTENTE ZOEKSTIJLEN */
                .search-input {
                    font-size: 1.1rem;
                    padding: 10px 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                
                .search-input:focus {
                    border-color: #6f42c1;
                    box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
                }
                
                .search-results-container {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    overflow-y: auto;
                    min-height: 200px;
                    max-height: 300px;
                }
                
                /* HOND RESULTAAT ITEMS */
                .dog-result-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid #f0f0f0;
                    padding: 12px 15px;
                    background: white;
                }
                
                .dog-result-item:hover {
                    background-color: #f8f9fa;
                    transform: translateX(3px);
                }
                
                .dog-result-item.selected {
                    background-color: #f0e6ff;
                    border-left: 4px solid #6f42c1;
                }
                
                .dog-name-line {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #6f42c1;
                    margin-bottom: 8px;
                }
                
                .dog-kennel-line {
                    font-size: 0.95rem;
                    color: #6c757d;
                    margin-bottom: 8px;
                    font-style: italic;
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
                    padding: 8px 15px;
                    border-bottom: 1px solid #dee2e6;
                    background: #f8f9fa;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async loadAllHonden() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                // Haal ALLE honden op net zoals SearchManager
                this.allHonden = await this.db.getHonden();
                console.log(`✅ Geladen: ${this.allHonden.length} honden voor ReuTeefCombinatie`);
                
                // ZORG DAT ALLE GEZONDHEIDSVELDEN AANWEZIG ZIJN
                this.allHonden = this.allHonden.map(hond => {
                    return {
                        ...hond,
                        // ZORG DAT ALLE GEZONDHEIDSVELDEN BESTAAN
                        heupdysplasie: hond.heupdysplasie || '',
                        elleboogdysplasie: hond.elleboogdysplasie || '',
                        patella: hond.patella || '',
                        ogen: hond.ogen || '',
                        ogenVerklaring: hond.ogenVerklaring || '',
                        dandyWalker: hond.dandyWalker || '',
                        schildklier: hond.schildklier || '',
                        schildklierVerklaring: hond.schildklierVerklaring || '',
                        vachtkleur: hond.vachtkleur || '',
                        ras: hond.ras || '',
                        land: hond.land || '',
                        postcode: hond.postcode || '',
                        opmerkingen: hond.opmerkingen || ''
                    };
                });
                
                // Voeg alle honden toe aan cache
                this.allHonden.forEach(hond => {
                    this.hondenCache.set(hond.id, hond);
                    if (hond.stamboomnr) {
                        this.hondenCache.set(hond.stamboomnr, hond);
                    }
                });
            } else {
                console.error('❌ Database niet beschikbaar');
                this.allHonden = [];
            }
        } catch (error) {
            console.error('❌ Fout bij laden honden:', error);
            this.allHonden = [];
        }
    }
    
    setupSearch(inputId, resultsId, geslacht, onSelect) {
        const input = document.getElementById(inputId);
        const resultsContainer = document.getElementById(resultsId);
        
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length < 1) {
                this.showInitialView(resultsContainer);
                return;
            }
            
            // Filter honden
            let filteredHonden = this.allHonden.filter(hond => {
                if (geslacht === 'teven') {
                    if (!(hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk')) {
                        return false;
                    }
                } else if (geslacht === 'reuen') {
                    if (!(hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk')) {
                        return false;
                    }
                }
                
                const naam = hond.naam ? hond.naam.toLowerCase() : '';
                const kennelnaam = hond.kennelnaam ? hond.kennelnaam.toLowerCase() : '';
                const stamboomnr = hond.stamboomnr ? hond.stamboomnr.toLowerCase() : '';
                
                return naam.includes(searchTerm) || 
                       kennelnaam.includes(searchTerm) || 
                       stamboomnr.includes(searchTerm);
            });
            
            this.displaySearchResults(resultsContainer, filteredHonden, onSelect);
        });
        
        this.showInitialView(resultsContainer);
    }
    
    showInitialView(container) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-search display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${this.t('typeToSearch')}</p>
            </div>
        `;
    }
    
    displaySearchResults(container, filteredHonden, onSelect) {
        const t = this.t.bind(this);
        
        if (filteredHonden.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-stats">
                <i class="bi bi-info-circle me-1"></i>
                ${filteredHonden.length} ${t('found')}
            </div>
        `;
        
        filteredHonden.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? this.t('genderReu') : 
                             dog.geslacht === 'teven' ? this.t('genderTeef') : this.t('unknown');
            
            html += `
                <div class="dog-result-item" data-id="${dog.id}">
                    <div class="dog-name-line">
                        <span class="dog-name">${dog.naam || this.t('unknown')}</span>
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
        
        // Event listeners voor resultaten
        container.querySelectorAll('.dog-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const hondId = parseInt(item.getAttribute('data-id'));
                const hond = this.allHonden.find(d => d.id === hondId);
                if (hond) {
                    // Markeer als geselecteerd
                    container.querySelectorAll('.dog-result-item').forEach(i => {
                        i.classList.remove('selected');
                    });
                    item.classList.add('selected');
                    
                    // Update input
                    const inputId = container.id.replace('SearchResults', 'Search');
                    const input = document.getElementById(inputId);
                    const displayName = hond.kennelnaam ? 
                        `${hond.naam} (${hond.kennelnaam})` : 
                        hond.naam;
                    input.value = displayName;
                    
                    // Selecteer hond
                    onSelect(hond);
                }
            });
        });
    }
    
    selectTeef(hond) {
        this.selectedTeef = hond;
        this.showHondDetails('teefDetails', hond, 'teef');
        this.updateButtonStates();
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showHondDetails('reuDetails', hond, 'reu');
        this.updateButtonStates();
    }
    
    async showHondDetails(elementId, hond, type) {
        const t = this.t.bind(this);
        const detailsContainer = document.getElementById(elementId);
        
        // Verberg de zoekresultaten container
        const resultsId = elementId.replace('Details', 'SearchResults');
        const resultsContainer = document.getElementById(resultsId);
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        
        // Toon details container
        detailsContainer.classList.remove('d-none');
        
        detailsContainer.innerHTML = `
            <div class="dog-details-card" style="border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-top: 15px;">
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #6f42c1; margin-bottom: 5px;">
                        ${hond.naam || 'Onbekend'}
                    </div>
                    ${hond.kennelnaam ? `<div style="color: #6c757d; font-size: 1rem;">${hond.kennelnaam}</div>` : ''}
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 15px; margin-bottom: 15px;">
                        ${hond.stamboomnr ? `
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <i class="bi bi-card-checklist" style="color: #6f42c1;"></i>
                                <span>${hond.stamboomnr}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.ras ? `
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <i class="bi bi-tag" style="color: #6f42c1;"></i>
                                <span>${hond.ras}</span>
                            </div>
                        ` : ''}
                        
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <i class="bi bi-gender-${type === 'teef' ? 'female' : 'male'}" style="color: #6f42c1;"></i>
                            <span>${type === 'teef' ? t('genderTeef') : t('genderReu')}</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.reuTeefCombinatie.clearSelection('${elementId}', '${resultsId}')">
                        <i class="bi bi-x-circle me-1"></i> Selectie wissen
                    </button>
                </div>
            </div>
        `;
    }
    
    clearSelection(detailsId, resultsId) {
        const detailsContainer = document.getElementById(detailsId);
        const resultsContainer = document.getElementById(resultsId);
        const inputId = detailsId.replace('Details', 'Search');
        const input = document.getElementById(inputId);
        
        // Reset de selectie
        if (detailsId === 'teefDetails') {
            this.selectedTeef = null;
        } else if (detailsId === 'reuDetails') {
            this.selectedReu = null;
        }
        
        // Wis input
        if (input) {
            input.value = '';
        }
        
        // Verberg details
        detailsContainer.classList.add('d-none');
        detailsContainer.innerHTML = '';
        
        // Toon zoekresultaten opnieuw
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
            this.showInitialView(resultsContainer);
        }
        
        this.updateButtonStates();
    }
    
    updateButtonStates() {
        const showPedigreeBtn = document.getElementById('showPedigreeBtn');
        
        // Alleen beschikbaar als beide honden geselecteerd zijn
        const bothSelected = this.selectedTeef && this.selectedReu;
        
        if (showPedigreeBtn) {
            showPedigreeBtn.disabled = !bothSelected;
            showPedigreeBtn.title = bothSelected ? '' : this.t('selectDogFirst');
        }
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            if (window.uiHandler && window.uiHandler.modules && window.uiHandler.modules.breeding) {
                window.uiHandler.modules.breeding.loadMainScreen();
            } else if (window.appUI && window.appUI.modules && window.appUI.modules.breeding) {
                window.appUI.modules.breeding.loadMainScreen();
            } else {
                const modal = bootstrap.Modal.getInstance(breedingModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    }
    
    async showFuturePuppyPedigree() {
        console.log('🔄 Toon toekomstige pup stamboom');
        
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert(this.t('selectDogFirst'), 'warning');
            return;
        }
        
        if (!this.stamboomManager) {
            this.showAlert('StamboomManager niet beschikbaar', 'danger');
            return;
        }
        
        if (!this.coiCalculator && typeof COICalculator === 'undefined') {
            this.showAlert('COI berekening niet beschikbaar', 'danger');
            return;
        }
        
        // Toon laadindicator
        this.showLoadingIndicator();
        
        try {
            // Maak een virtuele toekomstige pup
            const futurePuppy = {
                id: -999999,
                naam: this.t('futurePuppyName'),
                geslacht: 'onbekend',
                vaderId: this.selectedReu.id,
                moederId: this.selectedTeef.id,
                vader: this.selectedReu.naam,
                moeder: this.selectedTeef.naam,
                kennelnaam: this.t('combinedParents'),
                stamboomnr: 'VOORSPELD',
                geboortedatum: new Date().toISOString().split('T')[0],
                vachtkleur: `${this.selectedReu.vachtkleur || ''}/${this.selectedTeef.vachtkleur || ''}`.trim(),
                // ZORG DAT ALLE GEZONDHEIDSVELDEN LEEG ZIJN
                heupdysplasie: '',
                elleboogdysplasie: '',
                patella: '',
                ogen: '',
                ogenVerklaring: '',
                dandyWalker: '',
                schildklier: '',
                schildklierVerklaring: '',
                land: '',
                postcode: '',
                opmerkingen: ''
            };
            
            console.log('🔍 Toekomstige pup aangemaakt:', futurePuppy);
            
            // 🔥 CRITICAL FIX: ZORG DAT STAMBOOMMANAGER DE VOLLEDIGE DATA KRIJGT
            await this.prepareStamboomManagerWithFullData(futurePuppy);
            
            // BEREKEN COI
            const coiResult = this.coiCalculator.calculateCOI(futurePuppy.id);
            console.log('✅ COI resultaat:', coiResult);
            
            // BEREKEN GEZONDHEIDSANALYSE
            const healthAnalysis = await this.analyzeHealthInLine();
            console.log('✅ Gezondheidsanalyse resultaat');
            
            // Verwijder laadindicator
            this.removeLoadingIndicator();
            
            // Toon stamboom via StamboomManager
            await this.stamboomManager.showPedigree(futurePuppy);
            
            // VOEG CLICK EVENT TOE VOOR DE TOEKOMSTIGE PUP
            setTimeout(() => {
                this.addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis);
            }, 500);
            
        } catch (error) {
            console.error('❌ Fout bij tonen toekomstige pup stamboom:', error);
            this.removeLoadingIndicator();
            this.showAlert('Kon stamboom niet genereren. Probeer opnieuw.', 'danger');
        }
    }
    
    // 🔥 CRITICAL FIX METHODE: Zorg dat StamboomManager VOLLEDIGE data krijgt
    async prepareStamboomManagerWithFullData(futurePuppy) {
        console.log('🔄 Bereid StamboomManager voor met VOLLEDIGE data');
        
        // 1. Verzamel ALLE honden die nodig zijn voor de stamboom
        const allDogsNeeded = await this.collectAllDogsForPedigree();
        
        // 2. ZORG DAT ALLE HONDEN VOLLEDIGE GEZONDHEIDSDATA HEBBEN
        const dogsWithFullData = allDogsNeeded.map(dog => {
            // Als dit een van onze geselecteerde honden is, zorg dat we de volledige data hebben
            if (dog.id === this.selectedTeef.id || dog.id === this.selectedReu.id) {
                // Zoek in onze eigen dataset voor volledige data
                const fullDog = this.allHonden.find(d => d.id === dog.id);
                if (fullDog) {
                    return fullDog; // Gebruik de volledige data
                }
            }
            return dog;
        });
        
        // 3. VERVANG StamboomManager's dataset
        this.stamboomManager.allDogs = [...dogsWithFullData];
        
        // 4. Voeg de virtuele pup toe
        this.stamboomManager.allDogs.push(futurePuppy);
        
        console.log(`✅ StamboomManager heeft nu ${this.stamboomManager.allDogs.length} honden met VOLLEDIGE data`);
        
        // 5. HERINITIALISEER COI calculator
        if (typeof COICalculator !== 'undefined') {
            this.stamboomManager.coiCalculator = new COICalculator(this.stamboomManager.allDogs);
        }
        
        // 6. Update eigen COI calculator
        this.coiCalculator = new COICalculator(this.stamboomManager.allDogs);
    }
    
    // Verzamel alle honden die nodig zijn voor de stamboom (6 generaties)
    async collectAllDogsForPedigree() {
        const allDogs = new Map();
        
        // Voeg de geselecteerde honden toe (met VOLLEDIGE data uit onze dataset)
        [this.selectedTeef, this.selectedReu].forEach(dog => {
            const fullDog = this.allHonden.find(d => d.id === dog.id);
            if (fullDog) {
                allDogs.set(fullDog.id, fullDog);
            }
        });
        
        // Verzamel voorouders
        await this.collectAncestors(this.selectedTeef, allDogs, 6);
        await this.collectAncestors(this.selectedReu, allDogs, 6);
        
        return Array.from(allDogs.values());
    }
    
    // Verzamel voorouders recursief
    async collectAncestors(dog, allDogsMap, generationsLeft) {
        if (!dog || generationsLeft <= 0) return;
        
        // Zoek vader
        if (dog.vaderId) {
            const father = await this.getDogWithFullData(dog.vaderId);
            if (father && !allDogsMap.has(father.id)) {
                allDogsMap.set(father.id, father);
                await this.collectAncestors(father, allDogsMap, generationsLeft - 1);
            }
        }
        
        // Zoek moeder
        if (dog.moederId) {
            const mother = await this.getDogWithFullData(dog.moederId);
            if (mother && !allDogsMap.has(mother.id)) {
                allDogsMap.set(mother.id, mother);
                await this.collectAncestors(mother, allDogsMap, generationsLeft - 1);
            }
        }
    }
    
    // Haal hond op met VOLLEDIGE data
    async getDogWithFullData(dogId) {
        // Controleer eerst in onze eigen dataset
        const dogInOurData = this.allHonden.find(d => d.id === dogId);
        if (dogInOurData) {
            return dogInOurData;
        }
        
        // Zoek in database als backup
        try {
            const dog = await this.db.getHondById(dogId);
            if (dog) {
                // Zorg dat alle velden aanwezig zijn
                return {
                    ...dog,
                    heupdysplasie: dog.heupdysplasie || '',
                    elleboogdysplasie: dog.elleboogdysplasie || '',
                    patella: dog.patella || '',
                    ogen: dog.ogen || '',
                    ogenVerklaring: dog.ogenVerklaring || '',
                    dandyWalker: dog.dandyWalker || '',
                    schildklier: dog.schildklier || '',
                    schildklierVerklaring: dog.schildklierVerklaring || ''
                };
            }
        } catch (error) {
            console.error(`❌ Fout bij ophalen hond ${dogId}:`, error);
        }
        
        return null;
    }
    
    async analyzeHealthInLine() {
        // Vereenvoudigde analyse voor nu
        return {
            motherLine: { total: 0, counts: {} },
            fatherLine: { total: 0, counts: {} }
        };
    }
    
    addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis) {
        const futurePuppyCard = document.querySelector('.pedigree-card-compact.horizontal.main-dog-compact.gen0');
        if (futurePuppyCard) {
            futurePuppyCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis);
            });
            
            futurePuppyCard.style.cursor = 'pointer';
        }
    }
    
    showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis) {
        const popupHTML = `
            <div style="background: white; border-radius: 12px; max-width: 400px; padding: 0;">
                <div style="background: #0d6efd; color: white; padding: 16px; border-radius: 12px 12px 0 0;">
                    <h5 style="margin: 0;">
                        <i class="bi bi-stars me-2" style="color: #ffc107;"></i>
                        ${this.t('futurePuppyName')}
                    </h5>
                </div>
                <div style="padding: 20px;">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        ${this.t('futurePuppyDescription', { 
                            reu: this.selectedReu.naam || '?', 
                            teef: this.selectedTeef.naam || '?' 
                        })}
                    </div>
                </div>
            </div>
        `;
        
        // Toon een eenvoudige popup
        alert(this.t('futurePuppyDescription', { 
            reu: this.selectedReu.naam || '?', 
            teef: this.selectedTeef.naam || '?' 
        }));
    }
    
    showLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'reuteefLoadingIndicator';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loadingDiv.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">${this.t('loading')}</span>
                </div>
                <p class="mt-3">${this.t('loadingPedigree')}</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }
    
    removeLoadingIndicator() {
        const loadingDiv = document.getElementById('reuteefLoadingIndicator');
        if (loadingDiv) {
            loadingDiv.remove();
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
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    const bsAlert = new bootstrap.Alert(alertDiv);
                    bsAlert.close();
                }
            }, 5000);
        }
    }
}

window.reuTeefCombinatie = new ReuTeefCombinatie();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}