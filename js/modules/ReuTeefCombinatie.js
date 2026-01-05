/**
 * Reu en Teef Combinatie Module
 * Voor het maken van fokplannen met specifieke reu en teef
 * HERGEBRUIKT StamboomManager voor stamboom visualisatie
 * MET GEZONDHEID ANALYSE 6 GENERATIES
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
        this.fullHondenCache = new Map(); // NIEUW: Cache voor volledige hond gegevens
        
        // Stamboom Manager instance
        this.stamboomManager = null;
        // COI Calculator instance
        this.coiCalculator = null;
        
        // Vertalingen
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
                title: "Male and Female Combination",
                description: "Select a specific male and female for your breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select a female...",
                father: "Male (Father)",
                selectFather: "Select a male...",
                searchPlaceholder: "Type to search...",
                back: "Back",
                showPedigree: "Show Future Pedigree",
                showFuturePuppy: "Show Future Puppy Pedigree",
                pedigreeTitle: "Future Puppy Pedigree",
                close: "Close",
                loading: "Loading...",
                noDogFound: "No dog found",
                unknownBreed: "Unknown breed",
                genderTeef: "Female",
                genderReu: "Male",
                kennel: "Kennel:",
                pedigreeNumber: "Pedigree nr:",
                birthDate: "Birth date:",
                healthInfo: "Health information",
                color: "Color:",
                searchByName: "Search by name or kennel",
                dogDetails: "Dog details",
                selectDogFirst: "Select both a male and a female first",
                loadingPedigree: "Loading pedigree...",
                unknownAncestor: "Unknown",
                fatherLabel: "Father",
                motherLabel: "Mother",
                grandfatherLabel: "Grandfather",
                grandmotherLabel: "Grandmother",
                greatGrandfatherLabel: "Great-grandfather",
                greatGrandmotherLabel: "Great-grandmother",
                typeToSearch: "Start typing to search",
                noDogsFound: "No dogs found",
                found: "found",
                futurePuppyName: "Future Puppy",
                futurePuppyDescription: "Prediction of combination {father} × {mother}",
                futurePuppyTitle: "Pedigree for future puppy from combination {father} × {mother}",
                predictedPedigree: "Predicted pedigree",
                combinedParents: "Combination parents",
                // COI labels added for popup
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Close",
                predictedCoi: "Predicted Inbreeding Coefficient",
                futurePuppyInfo: "Future Puppy Information",
                clickForDetails: "Click for details",
                healthInLine: "Health in the line 6 generations",
                healthCategory: "Health category",
                motherLine: "Mother line",
                fatherLine: "Father line",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD unknown",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED unknown",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL unknown",
                eyesFree: "Eyes free",
                eyesDist: "Eyes Dist",
                eyesOther: "Eyes other",
                eyesUnknown: "Eyes unknown",
                dwlmDnaFree: "Dandy Walker (DNA) free",
                dwlmParentsFree: "Dandy Walker (parents) free",
                dwlmUnknown: "Dandy Walker unknown",
                thyroidTested: "Thyroid tested",
                thyroidUnknown: "Thyroid unknown",
                occurrences: "Occurrences"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie einen bestimmten Rüden und eine Hündin für Ihren Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie eine Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie einen Rüden...",
                searchPlaceholder: "Tippen Sie zum Suchen...",
                back: "Zurück",
                showPedigree: "Zukünftigen Stammbaum Zeigen",
                showFuturePuppy: "Zukünftigen Welpen-Stammbaum Zeigen",
                pedigreeTitle: "Zukünftiger Welpen-Stammbaum",
                close: "Schließen",
                loading: "Laden...",
                noDogFound: "Kein Hund gefonden",
                unknownBreed: "Unbekannte Rasse",
                genderTeef: "Hündin",
                genderReu: "Rüde",
                kennel: "Zwingername:",
                pedigreeNumber: "Stammbuchnr:",
                birthDate: "Geburtsdatum:",
                healthInfo: "Health information",
                color: "Fellfarbe:",
                searchByName: "Suche nach Name oder Zwingername",
                dogDetails: "Hund Details",
                selectDogFirst: "Wählen Sie zuerst einen Rüden und eine Hündin",
                loadingPedigree: "Stammbaum wird geladen...",
                unknownAncestor: "Unbekannt",
                fatherLabel: "Vater",
                motherLabel: "Mutter",
                grandfatherLabel: "Großvater",
                grandmotherLabel: "Großmutter",
                greatGrandfatherLabel: "Urgroßvater",
                greatGrandmotherLabel: "Urgroßmutter",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                noDogsFound: "Keine Hunde gefonden",
                found: "gefunden",
                futurePuppyName: "Zukünftiger Welpe",
                futurePuppyDescription: "Vorhersage der Kombination {father} × {mother}",
                futurePuppyTitle: "Stamboom für zukünftigen Welpen aus Kombination {father} × {mother}",
                predictedPedigree: "Vorhergesagter Stammbaum",
                combinedParents: "Kombination Eltern",
                // COI labels hinzugefügt für Popup
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                closePopup: "Schließen",
                predictedCoi: "Vorhergesagter Inzuchtkoeffizient",
                futurePuppyInfo: "Zukünftiger Welpen-Informationen",
                clickForDetails: "Klicken für Details",
                healthInLine: "Gesundheit in der Linie 6 Generationen",
                healthCategory: "Gesundheitskategorie",
                motherLine: "Mutterlinie",
                fatherLine: "Vaterlinie",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD unbekannt",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED unbekannt",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL unbekannt",
                eyesFree: "Augen frei",
                eyesDist: "Augen Dist",
                eyesOther: "Augen sonstige",
                eyesUnknown: "Augen unbekannt",
                dwlmDnaFree: "Dandy Walker (DNA) frei",
                dwlmParentsFree: "Dandy Walker (Eltern) frei",
                dwlmUnknown: "Dandy Walker unbekannt",
                thyroidTested: "Schilddrüse getestet",
                thyroidUnknown: "Schilddrüse unbekannt",
                occurrences: "Anzahl Mal"
            }
        };
    }
    
    injectDependencies(db, auth, stamboomManager) {
        this.db = db;
        this.auth = auth;
        this.stamboomManager = stamboomManager;
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
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Reset geselecteerde honden
        this.selectedTeef = null;
        this.selectedReu = null;
        this.hondenCache.clear();
        this.fullHondenCache.clear();
        
        // Laad honden data
        await this.loadAllHonden();
        
        // Initialiseer COI Calculator DIRECT met alle honden
        if (typeof COICalculator !== 'undefined') {
            this.coiCalculator = new COICalculator(this.allHonden);
            console.log('✅ COICalculator direct geïnitialiseerd in ReuTeefCombinatie');
        } else {
            console.error('❌ COICalculator klasse niet gevonden!');
        }
        
        // Initialiseer StamboomManager als deze nog niet bestaat
        if (!this.stamboomManager && this.db) {
            this.stamboomManager = new StamboomManager(this.db, this.currentLang);
            await this.stamboomManager.initialize();
        }
        
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
                                <div class="autocomplete-container">
                                    <div class="input-group">
                                        <span class="input-group-text bg-white border-end-0">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <input type="text" 
                                               class="form-control search-input border-start-0 ps-0" 
                                               id="teefSearch" 
                                               placeholder="${t('searchPlaceholder')}"
                                               autocomplete="off">
                                    </div>
                                    <div class="autocomplete-dropdown" id="teefDropdown"></div>
                                </div>
                                <div class="form-text text-muted small mt-2">
                                    <i class="bi bi-info-circle me-1"></i> ${t('typeToSearch')}
                                </div>
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
                                <div class="autocomplete-container">
                                    <div class="input-group">
                                        <span class="input-group-text bg-white border-end-0">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <input type="text" 
                                               class="form-control search-input border-start-0 ps-0" 
                                               id="reuSearch" 
                                               placeholder="${t('searchPlaceholder')}"
                                               autocomplete="off">
                                    </div>
                                    <div class="autocomplete-dropdown" id="reuDropdown"></div>
                                </div>
                                <div class="form-text text-muted small mt-2">
                                    <i class="bi bi-info-circle me-1"></i> ${t('typeToSearch')}
                                </div>
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
        
        document.getElementById('showPedigreeBtn').addEventListener('click', () => {
            this.showFuturePuppyPedigree();
        });
        
        // Setup autocomplete voor teef
        this.setupAutocomplete('teefSearch', 'teefSearchResults', 'teven', (hond) => {
            this.selectTeef(hond);
        });
        
        // Setup autocomplete voor reu
        this.setupAutocomplete('reuSearch', 'reuSearchResults', 'reuen', (hond) => {
            this.selectReu(hond);
        });
        
        // Update button states
        this.updateButtonStates();
    }
    
    addStyles() {
        // [Dezelfde CSS code als eerder]
    }
    
    async loadAllHonden() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                this.allHonden = await this.db.getHonden();
                console.log(`✅ Geladen: ${this.allHonden.length} honden uit database voor ReuTeefCombinatie`);
                
                // DEBUG: Controleer of de gegevens compleet zijn
                if (this.allHonden.length > 0) {
                    const sampleHond = this.allHonden[0];
                    console.log(`📊 Voorbeeld hond ${sampleHond.id}:`, {
                        naam: sampleHond.naam,
                        heupdysplasie: sampleHond.heupdysplasie,
                        elleboogdysplasie: sampleHond.elleboogdysplasie,
                        patella: sampleHond.patella,
                        ogen: sampleHond.ogen,
                        dandyWalker: sampleHond.dandyWalker,
                        schildklier: sampleHond.schildklier
                    });
                }
                
                // Voeg alle honden toe aan cache
                this.allHonden.forEach(hond => {
                    this.hondenCache.set(hond.id, hond);
                    if (hond.stamboomnr) {
                        this.hondenCache.set(hond.stamboomnr, hond);
                    }
                });
            } else {
                console.error('❌ Database niet beschikbaar of getHonden functie ontbreekt');
                this.allHonden = [];
            }
        } catch (error) {
            console.error('❌ Fout bij laden honden:', error);
            this.allHonden = [];
        }
    }
    
    async getHondById(id) {
        // Controleer eerst cache
        if (this.hondenCache.has(id)) {
            const cached = this.hondenCache.get(id);
            // Controleer of cache compleet is (heeft gezondheidsinformatie)
            if (cached.heupdysplasie !== undefined || cached.elleboogdysplasie !== undefined) {
                return cached;
            }
        }
        
        try {
            const hond = await this.db.getHondById(id);
            if (hond) {
                console.log(`✅ Volledige hond ${id} uit database: HD=${hond.heupdysplasie}, ED=${hond.elleboogdysplasie}`);
                // Voeg toe aan cache
                this.hondenCache.set(id, hond);
                if (hond.stamboomnr) {
                    this.hondenCache.set(hond.stamboomnr, hond);
                }
            }
            return hond;
        } catch (error) {
            console.error(`❌ Fout bij ophalen hond ${id}:`, error);
            return null;
        }
    }
    
    async getHondByIdFromDb(id) {
        // Directe database call voor volledige informatie
        try {
            // Controleer eerst volledige cache
            if (this.fullHondenCache.has(id)) {
                const cached = this.fullHondenCache.get(id);
                console.log(`✅ getHondByIdFromDb(${id}) uit volledige cache: HD=${cached.heupdysplasie}, ED=${cached.elleboogdysplasie}`);
                return cached;
            }
            
            const hond = await this.db.getHondById(id);
            if (hond) {
                console.log(`✅ getHondByIdFromDb(${id}) uit database: HD=${hond.heupdysplasie}, ED=${hond.elleboogdysplasie}`);
                // Voeg toe aan beide caches
                this.hondenCache.set(id, hond);
                this.fullHondenCache.set(id, hond);
                if (hond.stamboomnr) {
                    this.hondenCache.set(hond.stamboomnr, hond);
                    this.fullHondenCache.set(hond.stamboomnr, hond);
                }
            }
            return hond;
        } catch (error) {
            console.error(`❌ Fout in getHondByIdFromDb(${id}):`, error);
            return null;
        }
    }
    
    async findHondByNameOrPedigree(name) {
        if (!name || !name.trim()) return null;
        
        // Controleer eerst in cache
        const searchName = name.toLowerCase().trim();
        for (const hond of this.allHonden) {
            const hondNaam = hond.naam?.toLowerCase() || '';
            const stamboomnr = hond.stamboomnr?.toLowerCase() || '';
            if (hondNaam === searchName || stamboomnr === searchName) {
                return hond;
            }
        }
        
        // Zoek in database als niet gevonden in cache
        try {
            const result = await this.db.zoekHonden({ naam: name });
            if (result && result.length > 0) {
                // Voeg gevonden hond toe aan cache
                result.forEach(hond => {
                    this.hondenCache.set(hond.id, hond);
                    if (hond.stamboomnr) {
                        this.hondenCache.set(hond.stamboomnr, hond);
                    }
                });
                return result[0];
            }
        } catch (error) {
            console.error(`❌ Fout bij zoeken hond op naam ${name}:`, error);
        }
        
        return null;
    }
    
    setupAutocomplete(inputId, resultsId, geslacht, onSelect) {
        // [Dezelfde autocomplete code als eerder]
    }
    
    updateActiveItem(items, activeIndex) {
        // [Dezelfde code als eerder]
    }
    
    updateActiveResultItem(resultItems, activeIndex) {
        // [Dezelfde code als eerder]
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
        // [Dezelfde code als eerder]
    }
    
    clearSelection(detailsId, resultsId) {
        // [Dezelfde code als eerder]
    }
    
    async getOudersInfo(hond) {
        const result = { vader: null, moeder: null };
        
        // Zoek vader
        if (hond.vaderId) {
            result.vader = await this.getHondByIdFromDb(hond.vaderId); // Gebruik volledige info
        } else if (hond.vader) {
            // Zoek vader op naam of stamboomnummer
            result.vader = await this.findHondByNameOrPedigree(hond.vader);
        }
        
        // Zoek moeder
        if (hond.moederId) {
            result.moeder = await this.getHondByIdFromDb(hond.moederId); // Gebruik volledige info
        } else if (hond.moeder) {
            // Zoek moeder op naam of stamboomnummer
            result.moeder = await this.findHondByNameOrPedigree(hond.moeder);
        }
        
        return result;
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
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert(this.t('selectDogFirst'), 'warning');
            return;
        }
        
        if (!this.stamboomManager) {
            this.showAlert('StamboomManager niet geïnitialiseerd', 'danger');
            return;
        }
        
        if (!this.coiCalculator) {
            console.error('❌ COICalculator niet beschikbaar');
            this.showAlert('COI berekening niet beschikbaar', 'danger');
            return;
        }
        
        console.log('🚀 Start toekomstige pup stamboom...');
        console.log(`👥 Ouders: Reu=${this.selectedReu?.id} ${this.selectedReu?.naam}, Teef=${this.selectedTeef?.id} ${this.selectedTeef?.naam}`);
        
        // Maak een virtuele toekomstige pup
        const futurePuppy = {
            id: -999999, // Uniek ID voor virtuele pup
            naam: this.t('futurePuppyName'),
            geslacht: 'onbekend',
            vaderId: this.selectedReu.id,
            moederId: this.selectedTeef.id,
            vader: this.selectedReu.naam,
            moeder: this.selectedTeef.naam,
            kennelnaam: this.t('combinedParents'),
            // Ras wordt nu leeg gelaten
            stamboomnr: 'VOORSPELD',
            geboortedatum: new Date().toISOString().split('T')[0],
            vachtkleur: `${this.selectedReu.vachtkleur || ''}/${this.selectedTeef.vachtkleur || ''}`.trim(),
            heupdysplasie: null,
            elleboogdysplasie: null,
            patella: null,
            ogen: null,
            ogenVerklaring: null,
            dandyWalker: null,
            schildklier: null,
            schildklierVerklaring: null,
            land: null,
            postcode: null,
            opmerkingen: null
        };
        
        console.log('🔍 Toekomstige pup aangemaakt voor COI berekening:', futurePuppy);
        
        try {
            // ZORG DAT OUDERS VOLLEDIGE INFO HEBBEN IN CACHE
            console.log('📥 Controleren ouders informatie...');
            
            // Haal ouders op met volledige informatie uit database
            const fullReu = await this.getHondByIdFromDb(this.selectedReu.id);
            const fullTeef = await this.getHondByIdFromDb(this.selectedTeef.id);
            
            console.log(`✅ Reu volledige info: HD=${fullReu?.heupdysplasie}, ED=${fullReu?.elleboogdysplasie}`);
            console.log(`✅ Teef volledige info: HD=${fullTeef?.heupdysplasie}, ED=${fullTeef?.elleboogdysplasie}`);
            
            // MAKEN VIRTUELE HOND VOOR COI BEREKENING
            // Voeg virtuele pup toe aan allHonden tijdelijk voor COI berekening
            const originalHonden = [...this.allHonden];
            this.allHonden.push(futurePuppy);
            
            // HERINITIALISEER COICalculator met de uitgebreide lijst
            this.coiCalculator = new COICalculator(this.allHonden);
            
            // BEREKEN COI DIRECT MET COICalculator
            const coiResult = this.coiCalculator.calculateCOI(futurePuppy.id);
            console.log('✅ COI resultaat via COICalculator:', coiResult);
            
            // BEREKEN GEZONDHEIDSANALYSE MET CORRECTE LOGICA
            const healthAnalysis = await this.analyzeHealthInLine(futurePuppy);
            console.log('✅ Gezondheidsanalyse resultaat:', healthAnalysis);
            
            // Herstel originele lijst
            this.allHonden = originalHonden;
            this.coiCalculator = new COICalculator(this.allHonden);
            
            // Toon stamboom via StamboomManager
            await this.showStamboomWithFuturePuppy(futurePuppy, coiResult, healthAnalysis);
            
        } catch (error) {
            console.error('❌ Fout bij tonen toekomstige pup stamboom:', error);
            this.showAlert('Kon stamboom niet genereren. Probeer opnieuw.', 'danger');
        }
    }
    
    async analyzeHealthInLine(futurePuppy) {
        // [Dezelfde code als eerder]
    }
    
    async collectAncestorsFromParent(parentDog, generations) {
        // [Dezelfde code als eerder]
    }
    
    updateHealthCounts(counts, ancestor) {
        // [Dezelfde code als eerder]
    }
    
    getHDKey(hdValue) {
        // [Dezelfde code als eerder]
    }
    
    getEDKey(edValue) {
        // [Dezelfde code als eerder]
    }
    
    getPLKey(plValue) {
        // [Dezelfde code als eerder]
    }
    
    getEyesKey(eyesValue) {
        // [Dezelfde code als eerder]
    }
    
    getDWLMKey(dwlmValue) {
        // [Dezelfde code als eerder]
    }
    
    async showStamboomWithFuturePuppy(futurePuppy, coiResult, healthAnalysis) {
        console.log('🔄 Toon stamboom via StamboomManager...');
        
        // Probeer eerst via StamboomManager
        if (this.stamboomManager && this.stamboomManager.allDogs) {
            const originalDogs = [...this.stamboomManager.allDogs];
            
            // Zorg dat ouders in de StamboomManager cache zitten
            // MAAR gebruik de volledige gegevens uit getHondByIdFromDb
            if (this.selectedReu) {
                const fullReu = await this.getHondByIdFromDb(this.selectedReu.id);
                if (fullReu) {
                    this.stamboomManager.allDogs.push(fullReu);
                }
            }
            if (this.selectedTeef) {
                const fullTeef = await this.getHondByIdFromDb(this.selectedTeef.id);
                if (fullTeef) {
                    this.stamboomManager.allDogs.push(fullTeef);
                }
            }
            
            this.stamboomManager.allDogs.push(futurePuppy);
            
            try {
                await this.stamboomManager.showPedigree(futurePuppy);
                
                // VOEG CLICK EVENT TOE - PASS DE VOLLEDIGE HOND DOOR
                setTimeout(async () => {
                    this.addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis);
                }, 100);
                
            } finally {
                // Herstel originele lijst
                this.stamboomManager.allDogs = originalDogs;
            }
        } else {
            // Fallback
            console.log('⚠️ Gebruik fallback stamboom');
            await this.showCustomFuturePuppyPedigree(futurePuppy, coiResult, healthAnalysis);
        }
    }
    
    addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis) {
        const futurePuppyCard = document.querySelector('.pedigree-card-compact.horizontal.main-dog-compact.gen0');
        if (futurePuppyCard) {
            futurePuppyCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis);
            });
            
            futurePuppyCard.style.cursor = 'pointer';
            
            const clickHint = futurePuppyCard.querySelector('.click-hint-compact');
            if (clickHint) {
                clickHint.innerHTML = '<i class="bi bi-info-circle"></i> ' + this.t('clickForDetails');
            }
        }
        
        // OOK: VERVANG DE BESTAANDE CLICK HANDLERS VOOR DE OUDERDIEREN
        const setupExistingClickHandlers = () => {
            const parentCards = document.querySelectorAll('.pedigree-card-compact.horizontal[data-dog-id]:not(.main-dog-compact)');
            parentCards.forEach(async (card) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId <= 0 || dogId === futurePuppy.id) return;
                
                // Haal de volledige hond op voor de details
                const fullDog = await this.getHondByIdFromDb(dogId);
                if (!fullDog) return;
                
                // Verwijder bestaande event listener
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
                
                // Voeg nieuwe event listener toe met volledige hond
                newCard.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    
                    const relation = newCard.getAttribute('data-relation') || '';
                    const generation = parseInt(newCard.getAttribute('data-generation') || '0');
                    
                    // Toon de details popup met volledige hond informatie
                    await this.showDogDetailPopupInPedigree(fullDog, relation, generation);
                });
                
                newCard.style.cursor = 'pointer';
            });
        };
        
        setTimeout(setupExistingClickHandlers, 200);
    }
    
    async showDogDetailPopupInPedigree(dog, relation, generation) {
        console.log('🔄 Toon details popup voor hond:', dog.id, dog.naam);
        console.log('🔍 Hond gegevens:', {
            id: dog.id,
            naam: dog.naam,
            heupdysplasie: dog.heupdysplasie,
            elleboogdysplasie: dog.elleboogdysplasie,
            patella: dog.patella,
            ogen: dog.ogen
        });
        
        // Controleer of de hond volledige gegevens heeft
        if (!dog.heupdysplasie && !dog.elleboogdysplasie && !dog.patella && !dog.ogen) {
            console.warn('⚠️ Hond heeft geen gezondheidsinformatie, probeer opnieuw op te halen...');
            const freshDog = await this.getHondByIdFromDb(dog.id);
            if (freshDog) {
                dog = freshDog;
                console.log('✅ Nieuwe hond gegevens:', {
                    heupdysplasie: dog.heupdysplasie,
                    elleboogdysplasie: dog.elleboogdysplasie
                });
            }
        }
        
        // Toon een debug popup eerst
        const debugInfo = `
            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                <strong>Debug Info:</strong><br>
                ID: ${dog.id}<br>
                Naam: ${dog.naam}<br>
                HD: ${dog.heupdysplasie || 'GEEN'}<br>
                ED: ${dog.elleboogdysplasie || 'GEEN'}<br>
                Patella: ${dog.patella || 'GEEN'}<br>
                Ogen: ${dog.ogen || 'GEEN'}
            </div>
        `;
        
        // Gebruik de bestaande stamboomManager popup functionaliteit
        if (this.stamboomManager && typeof this.stamboomManager.showDogDetailPopup === 'function') {
            // Probeer eerst met StamboomManager
            try {
                await this.stamboomManager.showDogDetailPopup(dog, relation);
                return;
            } catch (error) {
                console.error('❌ Fout bij StamboomManager popup:', error);
                // Val terug op eigen popup
            }
        }
        
        // Fallback naar aangepaste popup
        const popupHTML = this.getDogDetailPopupHTML(dog, relation);
        this.ensurePopupContainer();
        
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (container) {
            container.innerHTML = popupHTML;
            overlay.style.display = 'flex';
            this.setupPopupEventListeners();
        }
    }
    
    getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const genderText = dog.geslacht === 'reuen' ? this.t('genderReu') : 
                          dog.geslacht === 'teven' ? this.t('genderTeef') : this.t('unknown');
        
        // Bereken COI waarden
        let coiValues = { coi6Gen: '0.0', coiAllGen: '0.0' };
        if (this.coiCalculator) {
            try {
                coiValues = this.coiCalculator.calculateCOI(dog.id);
            } catch (error) {
                console.warn('Kon COI niet berekenen voor hond:', dog.id, error);
            }
        }
        
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.getCOIColor(coiValues.coiAllGen);
        
        // DEBUG: Log de gezondheidsinformatie
        console.log('🔍 getDogDetailPopupHTML - Hond gezondheidsinformatie:', {
            naam: dog.naam,
            heupdysplasie: dog.heupdysplasie,
            elleboogdysplasie: dog.elleboogdysplasie,
            patella: dog.patella,
            ogen: dog.ogen,
            dandyWalker: dog.dandyWalker,
            schildklier: dog.schildklier
        });
        
        // Maak een gecombineerde naam+kennel string voor de header
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const headerText = combinedName + kennelSuffix;
        
        return `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${headerText}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="${this.t('close')}"></button>
                </div>
                <div class="popup-body">
                    <!-- BASISGEGEVENS -->
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="info-grid">
                            <!-- Stamboomnummer en Ras naast elkaar -->
                            <div class="info-row">
                                ${dog.stamboomnr ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('pedigreeNumber')}:</span>
                                    <span class="info-value">${dog.stamboomnr}</span>
                                </div>
                                ` : ''}
                                
                                ${dog.ras ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('breed')}:</span>
                                    <span class="info-value">${dog.ras}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- Geslacht en Vachtkleur naast elkaar -->
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('gender')}:</span>
                                    <span class="info-value">${genderText}</span>
                                </div>
                                
                                ${dog.vachtkleur ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coatColor')}:</span>
                                    <span class="info-value">${dog.vachtkleur}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- COI waarden naast elkaar -->
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coi6Gen')}:</span>
                                    <span class="info-value coi-value" style="color: ${coi6Color}; font-weight: bold;">
                                        ${coiValues.coi6Gen}%
                                    </span>
                                </div>
                                
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coiAllGen')}:</span>
                                    <span class="info-value coi-value" style="color: ${coiAllColor}; font-weight: bold;">
                                        ${coiValues.coiAllGen}%
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Datums -->
                            ${dog.geboortedatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('birthDate')}:</span>
                                    <span class="info-value">${this.formatDate(dog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('deathDate')}:</span>
                                    <span class="info-value">${this.formatDate(dog.overlijdensdatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            <!-- Land en postcode -->
                            ${dog.land ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('country')}:</span>
                                    <span class="info-value">${dog.land}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.postcode ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('zipCode')}:</span>
                                    <span class="info-value">${dog.postcode}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- GEZONDHEIDSINFORMATIE - MET WERKELIJKE WAARDEN -->
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}</h6>
                        <div class="info-grid">
                            ${dog.heupdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('hipDysplasia')}:</span>
                                    <span class="info-value"><strong>${dog.heupdysplasie}</strong></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('elbowDysplasia')}:</span>
                                    <span class="info-value"><strong>${dog.elleboogdysplasie}</strong></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('patellaLuxation')}:</span>
                                    <span class="info-value"><strong>${dog.patella}</strong></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('eyes')}:</span>
                                    <span class="info-value"><strong>${dog.ogen}</strong></span>
                                    ${dog.ogenVerklaring ? `
                                    <div class="mt-1 small text-muted">
                                        ${this.t('eyesExplanation')}: ${dog.ogenVerklaring}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('dandyWalker')}:</span>
                                    <span class="info-value"><strong>${dog.dandyWalker}</strong></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('thyroid')}:</span>
                                    <span class="info-value"><strong>${dog.schildklier}</strong></span>
                                    ${dog.schildklierVerklaring ? `
                                    <div class="mt-1 small text-muted">
                                        ${this.t('thyroidExplanation')}: ${dog.schildklierVerklaring}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${dog.opmerkingen ? `
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : `
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="text-muted">${this.t('noRemarks')}</div>
                    </div>
                    `}
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        } catch {
            return dateString;
        }
    }
    
    showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis) {
        // [Dezelfde code als eerder]
    }
    
    generateHealthAnalysisHTML(analysis) {
        // [Dezelfde code als eerder]
    }
    
    ensurePopupContainer() {
        // [Dezelfde code als eerder]
    }
    
    setupPopupEventListeners() {
        // [Dezelfde code als eerder]
    }
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    async showCustomFuturePuppyPedigree(futurePuppy, coiResult, healthAnalysis) {
        // [Dezelfde code als eerder]
    }
    
    async renderFuturePuppyPedigree(futurePuppy) {
        // [Dezelfde code als eerder]
    }
    
    async buildFuturePuppyPedigreeTree(futurePuppy) {
        // [Dezelfde code als eerder]
    }
    
    getDogById(id) {
        // [Dezelfde code als eerder]
    }
    
    async generateDogCard(dog, relation, isMainDog = false, generation = 0) {
        // [Dezelfde code als eerder]
    }
    
    showAlert(message, type = 'info') {
        // [Dezelfde code als eerder]
    }
}

window.reuTeefCombinatie = null;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}