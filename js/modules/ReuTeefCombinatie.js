/**
 * Reu en Teef Combinatie Module
 * Voor het maken van fokplannen met specifieke reu en teef
 * ZELFSTANDIG - niet afhankelijk van StamboomManager voor popups
 * Werkt direct met SearchManager's data
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // DIRECTE DATA BRON: Gebruik SearchManager als die bestaat
        this.searchManager = null;
        this.allHonden = [];
        
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
                occurrences: "Aantal keer",
                noData: "Geen gegevens",
                print: "Afdrukken",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                gender: "Geslacht",
                breed: "Ras",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker",
                thyroid: "Schildklier"
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
                occurrences: "Occurrences",
                noData: "No data",
                print: "Print",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great-grandparents",
                gender: "Gender",
                breed: "Breed",
                hipDysplasia: "Hip dysplasia",
                elbowDysplasia: "Elbow dysplasia",
                patellaLuxation: "Patella luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker",
                thyroid: "Thyroid"
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
                showFuturePuppy: "Zukünftigen Welpen-Stammbaum Zeigen",
                pedigreeTitle: "Zukünftiger Welpen-Stammbaum",
                close: "Schließen",
                loading: "Laden...",
                noDogFound: "Kein Hund gefunden",
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
                dwlmParentsFree: "Dandy Walker (Eltern) vrij",
                dwlmUnknown: "Dandy Walker unbekannt",
                thyroidTested: "Schilddrüse getestet",
                thyroidUnknown: "Schilddrüse unbekannt",
                occurrences: "Anzahl Mal",
                noData: "Keine Daten",
                print: "Drucken",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                gender: "Geschlecht",
                breed: "Rasse",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker",
                thyroid: "Schilddrüse"
            }
        };
    }
    
    injectDependencies(db, auth, searchManager) {
        this.db = db;
        this.auth = auth;
        this.searchManager = searchManager; // Alleen SearchManager nodig
        
        // Gebruik SearchManager's data als die beschikbaar is
        if (this.searchManager && this.searchManager.allDogs) {
            this.allHonden = this.searchManager.allDogs;
            console.log('✅ ReuTeefCombinatie gebruikt SearchManager dataset van', this.allHonden.length, 'honden');
        }
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        
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
        
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // Laad data via SearchManager of direct
        await this.loadData();
        
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
                            
                            <div class="search-results-container flex-grow-1 mt-2" id="teefSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="teefDetails" class="d-none"></div>
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
                            
                            <div class="search-results-container flex-grow-1 mt-2" id="reuSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="reuDetails" class="d-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="showPedigreeBtn" disabled>
                <i class="bi bi-diagram-3 me-1"></i> ${t('showFuturePuppy')}
            </button>
        `;
        
        this.addStyles();
        
        document.getElementById('backBtn').addEventListener('click', () => this.goBack());
        document.getElementById('showPedigreeBtn').addEventListener('click', () => this.showFuturePuppyPedigree());
        
        this.setupAutocomplete('teefSearch', 'teefSearchResults', 'teven', (hond) => this.selectTeef(hond));
        this.setupAutocomplete('reuSearch', 'reuSearchResults', 'reuen', (hond) => this.selectReu(hond));
        
        this.updateButtonStates();
    }
    
    async loadData() {
        if (this.searchManager) {
            if (!this.searchManager.allDogs || this.searchManager.allDogs.length === 0) {
                await this.searchManager.loadSearchData();
            }
            this.allHonden = this.searchManager.allDogs;
            console.log('✅ Data geladen via SearchManager:', this.allHonden.length, 'honden');
        } else if (this.db) {
            this.allHonden = await this.db.getHonden();
            console.log('✅ Data geladen via database:', this.allHonden.length, 'honden');
        }
    }
    
    getHondById(id) {
        if (!id || id === 0) return null;
        
        if (this.searchManager && this.searchManager.allDogs) {
            const dog = this.searchManager.allDogs.find(d => d.id === id);
            if (dog) return dog;
        }
        
        return this.allHonden.find(d => d.id === id) || null;
    }
    
    setupAutocomplete(inputId, resultsId, geslacht, onSelect) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId.replace('Search', 'Dropdown'));
        const resultsContainer = document.getElementById(resultsId);
        let activeIndex = -1;
        let currentResults = [];
        
        const showInitialView = () => {
            resultsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${this.t('typeToSearch')}</p>
                </div>
            `;
        };
        
        const displaySearchResults = (filteredHonden) => {
            const t = this.t.bind(this);
            
            if (filteredHonden.length === 0) {
                resultsContainer.innerHTML = `
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
            
            resultsContainer.innerHTML = html;
            
            resultsContainer.querySelectorAll('.dog-result-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const hondId = parseInt(item.getAttribute('data-id'));
                    const hond = currentResults.find(d => d.id === hondId);
                    if (hond) {
                        resultsContainer.querySelectorAll('.dog-result-item').forEach(i => i.classList.remove('selected'));
                        item.classList.add('selected');
                        
                        const displayName = hond.kennelnaam ? 
                            `${hond.naam} (${hond.kennelnaam})` : 
                            hond.naam;
                        input.value = displayName;
                        
                        onSelect(hond);
                    }
                });
            });
        };
        
        showInitialView();
        
        input.addEventListener('focus', async () => {
            if (this.allHonden.length === 0) {
                await this.loadData();
            }
        });
        
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length === 0) {
                dropdown.style.display = 'none';
                showInitialView();
                return;
            }
            
            let filteredHonden = this.allHonden.filter(hond => {
                if (geslacht === 'teven') {
                    return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                } else if (geslacht === 'reuen') {
                    return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                }
                return true;
            });
            
            if (searchTerm.length >= 1) {
                filteredHonden = filteredHonden.filter(dog => {
                    const naam = dog.naam ? dog.naam.toLowerCase() : '';
                    const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
                    const combined = `${naam} ${kennelnaam}`;
                    return combined.startsWith(searchTerm);
                });
            }
            
            currentResults = filteredHonden;
            displaySearchResults(filteredHonden);
            
            if (filteredHonden.length > 0) {
                dropdown.innerHTML = filteredHonden.map((hond, index) => {
                    const geboortejaar = hond.geboortedatum ? 
                        new Date(hond.geboortedatum).getFullYear() : '?';
                    
                    return `
                        <div class="autocomplete-item ${index === activeIndex ? 'active' : ''}" 
                             data-index="${index}"
                             data-id="${hond.id}">
                            <div class="d-flex justify-content-between align-items-start">
                                <div style="flex: 1;">
                                    <div class="dog-name">${hond.naam || 'Onbekend'}</div>
                                    <div class="dog-details">
                                        ${hond.kennelnaam ? `
                                            <span class="kennel-name">
                                                <i class="bi bi-house-door me-1"></i>${hond.kennelnaam}
                                            </span> • 
                                        ` : ''}
                                        ${hond.ras || this.t('unknownBreed')}
                                        ${hond.stamboomnr ? ` • ${hond.stamboomnr}` : ''}
                                    </div>
                                </div>
                                <div class="text-muted small ms-2" style="white-space: nowrap;">
                                    ${geboortejaar}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                dropdown.style.display = 'block';
                
                dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const index = parseInt(item.getAttribute('data-index'));
                        const hond = currentResults[index];
                        if (hond) {
                            const displayName = hond.kennelnaam ? 
                                `${hond.naam} (${hond.kennelnaam})` : 
                                hond.naam;
                            input.value = displayName;
                            dropdown.style.display = 'none';
                            
                            const resultsItems = resultsContainer.querySelectorAll('.dog-result-item');
                            resultsItems.forEach((resultItem, idx) => {
                                resultItem.classList.remove('selected');
                                if (idx === index) {
                                    resultItem.classList.add('selected');
                                }
                            });
                            
                            onSelect(hond);
                        }
                    });
                });
            } else {
                dropdown.style.display = 'none';
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                activeIndex = -1;
            }
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
        const resultsId = elementId.replace('Details', 'SearchResults');
        const resultsContainer = document.getElementById(resultsId);
        
        if (resultsContainer) resultsContainer.style.display = 'none';
        detailsContainer.classList.remove('d-none');
        
        detailsContainer.innerHTML = `
            <div class="dog-details-card">
                <div class="dog-details-header">
                    <div class="dog-details-name">${hond.naam || 'Onbekend'}</div>
                    ${hond.kennelnaam ? `<div class="dog-details-subtitle">${hond.kennelnaam}</div>` : ''}
                    
                    <div class="dog-details-info mt-3">
                        ${hond.stamboomnr ? `
                            <div class="info-item">
                                <i class="bi bi-card-checklist"></i>
                                <span>${hond.stamboomnr}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.ras ? `
                            <div class="info-item">
                                <i class="bi bi-tag"></i>
                                <span>${hond.ras}</span>
                            </div>
                        ` : ''}
                        
                        <div class="info-item">
                            <i class="bi bi-gender-${type === 'teef' ? 'female' : 'male'}"></i>
                            <span>${type === 'teef' ? t('genderTeef') : t('genderReu')}</span>
                        </div>
                        
                        ${hond.geboortedatum ? `
                            <div class="info-item">
                                <i class="bi bi-calendar"></i>
                                <span>${new Date(hond.geboortedatum).toLocaleDateString(this.currentLang)}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.vachtkleur ? `
                            <div class="info-item">
                                <i class="bi bi-palette"></i>
                                <span>${hond.vachtkleur}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="mt-3 pt-3 border-top">
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
        
        if (detailsId === 'teefDetails') this.selectedTeef = null;
        if (detailsId === 'reuDetails') this.selectedReu = null;
        
        if (input) input.value = '';
        detailsContainer.classList.add('d-none');
        detailsContainer.innerHTML = '';
        
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${this.t('typeToSearch')}</p>
                </div>
            `;
        }
        
        this.updateButtonStates();
    }
    
    updateButtonStates() {
        const showPedigreeBtn = document.getElementById('showPedigreeBtn');
        const bothSelected = this.selectedTeef && this.selectedReu;
        
        if (showPedigreeBtn) {
            showPedigreeBtn.disabled = !bothSelected;
            showPedigreeBtn.title = bothSelected ? '' : this.t('selectDogFirst');
        }
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            const modal = bootstrap.Modal.getInstance(breedingModal);
            if (modal) modal.hide();
        }
    }
    
    async showFuturePuppyPedigree() {
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert(this.t('selectDogFirst'), 'warning');
            return;
        }
        
        // Maak virtuele toekomstige pup
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
            vachtkleur: `${this.selectedReu.vachtkleur || ''}/${this.selectedTeef.vachtkleur || ''}`.trim()
        };
        
        // Bereken COI en gezondheidsanalyse
        const coiResult = this.calculateCOIForFuturePuppy(futurePuppy);
        
        // Toon eigen stamboom modal (NIET StamboomManager)
        this.showCustomPedigreeModal(futurePuppy, coiResult);
    }
    
    calculateCOIForFuturePuppy(futurePuppy) {
        // Eenvoudige COI berekening
        let coi6Gen = '0.0';
        let coiAllGen = '0.0';
        
        // Basis gevallen
        if (this.selectedReu.vaderId && this.selectedTeef.vaderId && 
            this.selectedReu.vaderId === this.selectedTeef.vaderId) {
            coi6Gen = '12.5';
            coiAllGen = '12.5';
        }
        
        // Complexere gevallen zouden hier komen
        // Voor nu retourneren we basiswaarden
        
        return { coi6Gen, coiAllGen };
    }
    
    showCustomPedigreeModal(futurePuppy, coiResult) {
        const modalId = 'futurePuppyModal';
        let existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();
        
        const title = this.t('futurePuppyTitle', { 
            reu: this.selectedReu.naam || '?', 
            teef: this.selectedTeef.naam || '?' 
        });
        
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-stars me-2"></i>${title}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0">
                            <div class="pedigree-mobile-wrapper">
                                <div class="pedigree-container-compact" id="futurePuppyContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-success" role="status">
                                            <span class="visually-hidden">${this.t('loadingPedigree')}</span>
                                        </div>
                                        <p class="mt-3">${this.t('loadingPedigree')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        // Event listener voor print knop
        document.getElementById(modalId).addEventListener('shown.bs.modal', () => {
            const printBtn = document.querySelector('#' + modalId + ' .btn-print');
            if (printBtn) {
                printBtn.addEventListener('click', () => {
                    window.print();
                });
            }
        });
        
        this.renderFuturePuppyPedigree(futurePuppy, coiResult);
        
        // Voeg CSS toe voor de modal
        this.addPedigreeStyles();
    }
    
    async renderFuturePuppyPedigree(futurePuppy, coiResult) {
        const container = document.getElementById('futurePuppyContainer');
        if (!container) return;
        
        // Haal overgrootouders op
        const paternalGrandfather = this.getHondById(this.selectedReu.vaderId);
        const paternalGrandmother = this.getHondById(this.selectedReu.moederId);
        const maternalGrandfather = this.getHondById(this.selectedTeef.vaderId);
        const maternalGrandmother = this.getHondById(this.selectedTeef.moederId);
        
        // Haal overgrootouders op
        const paternalGreatGrandfather = paternalGrandfather ? this.getHondById(paternalGrandfather.vaderId) : null;
        const paternalGreatGrandmother = paternalGrandfather ? this.getHondById(paternalGrandfather.moederId) : null;
        const paternalGreatGrandfather2 = paternalGrandmother ? this.getHondById(paternalGrandmother.vaderId) : null;
        const paternalGreatGrandmother2 = paternalGrandmother ? this.getHondById(paternalGrandmother.moederId) : null;
        const maternalGreatGrandfather = maternalGrandfather ? this.getHondById(maternalGrandfather.vaderId) : null;
        const maternalGreatGrandmother = maternalGrandfather ? this.getHondById(maternalGrandfather.moederId) : null;
        const maternalGreatGrandfather2 = maternalGrandmother ? this.getHondById(maternalGrandmother.vaderId) : null;
        const maternalGreatGrandmother2 = maternalGrandmother ? this.getHondById(maternalGrandmother.moederId) : null;
        
        // Genereer cards voor alle 3 generaties
        const cards = [
            // Generation 0: Toekomstige pup
            this.generateDogCard(futurePuppy, this.t('futurePuppyName'), true, 0, true),
            
            // Generation 1: Ouders
            this.generateDogCard(this.selectedReu, this.t('fatherLabel'), false, 1),
            this.generateDogCard(this.selectedTeef, this.t('motherLabel'), false, 1),
            
            // Generation 2: Grootouders
            this.generateDogCard(paternalGrandfather, this.t('grandfatherLabel'), false, 2),
            this.generateDogCard(paternalGrandmother, this.t('grandmotherLabel'), false, 2),
            this.generateDogCard(maternalGrandfather, this.t('grandfatherLabel'), false, 2),
            this.generateDogCard(maternalGrandmother, this.t('grandmotherLabel'), false, 2),
            
            // Generation 3: Overgrootouders (kleinere cards)
            this.generateDogCard(paternalGreatGrandfather, this.t('greatGrandfatherLabel'), false, 3),
            this.generateDogCard(paternalGreatGrandmother, this.t('greatGrandmotherLabel'), false, 3),
            this.generateDogCard(paternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3),
            this.generateDogCard(paternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3),
            this.generateDogCard(maternalGreatGrandfather, this.t('greatGrandfatherLabel'), false, 3),
            this.generateDogCard(maternalGreatGrandmother, this.t('greatGrandmotherLabel'), false, 3),
            this.generateDogCard(maternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3),
            this.generateDogCard(maternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3)
        ];
        
        const gridHTML = `
            <div class="pedigree-grid-compact">
                <!-- Generation 0: Toekomstige Pup -->
                <div class="pedigree-generation-col gen0">
                    <div class="generation-label" style="background: #198754; color: white;">
                        <i class="bi bi-stars me-1"></i>${this.t('futurePuppyName')}
                    </div>
                    ${cards[0]}
                </div>
                
                <!-- Generation 1: Ouders -->
                <div class="pedigree-generation-col gen1">
                    <div class="generation-label">${this.t('parents')}</div>
                    ${cards[1]}
                    ${cards[2]}
                </div>
                
                <!-- Generation 2: Grootouders -->
                <div class="pedigree-generation-col gen2">
                    <div class="generation-label">${this.t('grandparents')}</div>
                    ${cards[3]}
                    ${cards[4]}
                    ${cards[5]}
                    ${cards[6]}
                </div>
                
                <!-- Generation 3: Overgrootouders -->
                <div class="pedigree-generation-col gen3">
                    <div class="generation-label">${this.t('greatGrandparents')}</div>
                    ${cards[7]}
                    ${cards[8]}
                    ${cards[9]}
                    ${cards[10]}
                    ${cards[11]}
                    ${cards[12]}
                    ${cards[13]}
                    ${cards[14]}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        // Voeg click events toe aan alle cards
        this.addCardClickEvents();
        
        // Speciale click event voor toekomstige pup
        const futurePuppyCard = container.querySelector('.pedigree-card-compact.horizontal.main-dog-compact');
        if (futurePuppyCard) {
            futurePuppyCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFuturePuppyDetailsPopup(futurePuppy, coiResult);
            });
        }
    }
    
    generateDogCard(dog, relation, isMainDog = false, generation = 0, isFuturePuppy = false) {
        if (!dog) {
            const emptyClass = generation === 3 ? 'gen3-small' : '';
            return `
                <div class="pedigree-card-compact horizontal empty gen${generation} ${emptyClass}" data-dog-id="0">
                    <div class="pedigree-card-header-compact horizontal">
                        <div class="relation-compact">${relation}</div>
                    </div>
                    <div class="pedigree-card-body-compact horizontal text-center py-3">
                        <div class="no-data-text">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? (isFuturePuppy ? 'bg-success' : 'bg-primary') : 'bg-secondary';
        const isGen3 = generation === 3;
        const gen3Class = isGen3 ? 'gen3-small' : '';
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        return `
            <div class="pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation} ${gen3Class}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}"
                 data-is-future-puppy="${isFuturePuppy}">
                <div class="pedigree-card-header-compact horizontal ${headerColor}">
                    <div class="relation-compact">
                        <span class="relation-text">${relation}</span>
                        ${isMainDog ? '<span class="main-dot">★</span>' : ''}
                    </div>
                    <div class="gender-icon-compact">
                        <i class="bi ${genderIcon}"></i>
                    </div>
                </div>
                <div class="pedigree-card-body-compact horizontal">
                    <div class="card-row card-row-1">
                        <div class="dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <div class="card-row card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${dog.ras && !isFuturePuppy ? `
                        <div class="dog-breed-compact" title="${dog.ras}">
                            ${dog.ras}
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="card-row card-row-3">
                        <div class="click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    addCardClickEvents() {
        const cards = document.querySelectorAll('#futurePuppyContainer .pedigree-card-compact.horizontal:not(.empty)');
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                const isFuturePuppy = card.getAttribute('data-is-future-puppy') === 'true';
                const relation = card.getAttribute('data-relation') || '';
                
                if (isFuturePuppy) {
                    // Toon toekomstige pup details
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
                        vachtkleur: `${this.selectedReu.vachtkleur || ''}/${this.selectedTeef.vachtkleur || ''}`.trim()
                    };
                    
                    const coiResult = this.calculateCOIForFuturePuppy(futurePuppy);
                    this.showFuturePuppyDetailsPopup(futurePuppy, coiResult);
                } else if (dogId && dogId !== 0) {
                    // Toon normale hond details
                    const dog = this.getHondById(dogId);
                    if (dog) {
                        this.showDogDetailPopup(dog, relation);
                    }
                }
            });
        });
    }
    
    showDogDetailPopup(dog, relation) {
        // Toon popup MET VOLLEDIGE DATA uit SearchManager
        const fullDog = this.getHondById(dog.id) || dog;
        
        const popupHTML = this.createDogDetailPopupHTML(fullDog, relation);
        
        // Maak popup overlay
        const overlayId = 'dogDetailOverlay-' + Date.now();
        let overlay = document.getElementById(overlayId);
        if (overlay) overlay.remove();
        
        overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.className = 'dog-detail-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 1090;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s;
        `;
        
        overlay.innerHTML = `
            <div class="dog-detail-popup" style="
                background: white;
                border-radius: 12px;
                max-width: 450px;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideUp 0.3s;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                width: calc(100% - 20px);
                margin: 10px;
            ">
                ${popupHTML}
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Event listeners voor sluiten
        const closePopup = () => {
            overlay.remove();
            document.removeEventListener('keydown', handleEscape);
        };
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') closePopup();
        };
        
        // Voeg event listeners toe aan sluitknoppen
        overlay.querySelectorAll('.btn-close, .popup-close-btn').forEach(btn => {
            btn.addEventListener('click', closePopup);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
        
        // Escape key
        document.addEventListener('keydown', handleEscape);
    }
    
    createDogDetailPopupHTML(dog, relation) {
        const genderText = dog.geslacht === 'reuen' ? this.t('genderReu') : 
                          dog.geslacht === 'teven' ? this.t('genderTeef') : this.t('unknown');
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                              this.currentLang === 'de' ? 'de-DE' : 'en-US');
            } catch {
                return dateString;
            }
        };
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const headerText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        // Helper functie voor gezondheidsbadges
        const getHealthBadge = (value, type) => {
            if (!value || value === '') {
                return `<span class="badge bg-secondary">${this.t('unknown')}</span>`;
            }
            
            let badgeClass = '';
            let badgeText = value;
            
            switch(type) {
                case 'hip':
                    badgeClass = 'badge-hd';
                    break;
                case 'elbow':
                    badgeClass = 'badge-ed';
                    break;
                case 'patella':
                    badgeClass = 'badge-pl';
                    break;
                case 'eyes':
                    badgeClass = 'badge-eyes';
                    break;
                case 'dandy':
                    badgeClass = 'badge-dandy';
                    break;
                case 'thyroid':
                    badgeClass = 'badge-thyroid';
                    break;
                default:
                    badgeClass = 'badge bg-secondary';
            }
            
            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
        };
        
        return `
            <div class="dog-detail-popup">
                <div class="popup-header" style="
                    background: #0d6efd;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h5 class="popup-title" style="margin: 0; font-size: 1.1rem; display: flex; align-items: center; flex: 1;">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${headerText}
                    </h5>
                    <button type="button" class="btn-close btn-close-white popup-close-btn" aria-label="${this.t('close')}" style="
                        background: transparent;
                        border: none;
                        color: white;
                        opacity: 0.8;
                        font-size: 1.3rem;
                        cursor: pointer;
                        margin-left: 10px;
                    "></button>
                </div>
                
                <div class="popup-body" style="padding: 15px;">
                    <!-- BASISGEGEVENS -->
                    <div class="info-section mb-3">
                        <h6 style="color: #495057; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #e9ecef; display: flex; align-items: center; font-size: 1rem;">
                            <i class="bi bi-card-text me-1"></i> Basisgegevens
                        </h6>
                        <div class="info-grid" style="display: flex; flex-direction: column; gap: 8px;">
                            ${dog.stamboomnr ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('pedigreeNumber')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${dog.stamboomnr}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('gender')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${genderText}</span>
                                </div>
                            </div>
                            
                            ${dog.ras ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('breed')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${dog.ras}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.geboortedatum ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('birthDate')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${formatDate(dog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.vachtkleur ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('color')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${dog.vachtkleur}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- GEZONDHEIDSINFORMATIE -->
                    <div class="info-section mb-3">
                        <h6 style="color: #495057; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #e9ecef; display: flex; align-items: center; font-size: 1rem;">
                            <i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}
                        </h6>
                        <div class="info-grid" style="display: flex; flex-direction: column; gap: 8px;">
                            ${dog.heupdysplasie ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('hipDysplasia')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${getHealthBadge(dog.heupdysplasie, 'hip')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('elbowDysplasia')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${getHealthBadge(dog.elleboogdysplasie, 'elbow')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('patellaLuxation')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${getHealthBadge(dog.patella, 'patella')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('eyes')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${getHealthBadge(dog.ogen, 'eyes')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('dandyWalker')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${getHealthBadge(dog.dandyWalker, 'dandy')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('thyroid')}:</span>
                                    <span class="info-value" style="color: #212529; font-size: 0.95rem;">${getHealthBadge(dog.schildklier, 'thyroid')}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="popup-footer" style="padding: 16px 20px; border-top: 1px solid #dee2e6; display: flex; justify-content: center; background: #f8f9fa; border-radius: 0 0 12px 12px;">
                    <button type="button" class="btn btn-secondary popup-close-btn" style="min-width: 130px; padding: 10px 25px; font-size: 1rem;">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    showFuturePuppyDetailsPopup(futurePuppy, coiResult) {
        const coi6Color = this.getCOIColor(coiResult.coi6Gen);
        const coiAllColor = this.getCOIColor(coiResult.coiAllGen);
        
        const popupHTML = `
            <div class="dog-detail-popup">
                <div class="popup-header" style="background: #198754; color: white; padding: 12px 16px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <h5 class="popup-title" style="margin: 0; font-size: 1.1rem; display: flex; align-items: center;">
                        <i class="bi bi-stars me-2"></i>
                        ${this.t('futurePuppyName')}
                    </h5>
                    <button type="button" class="btn-close btn-close-white popup-close-btn" aria-label="${this.t('close')}"></button>
                </div>
                
                <div class="popup-body" style="padding: 15px;">
                    <div class="info-section mb-4">
                        <h6 style="color: #495057; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #e9ecef; display: flex; align-items: center; font-size: 1rem;">
                            <i class="bi bi-calculator me-1"></i> ${this.t('predictedCoi')}
                        </h6>
                        <div class="info-grid" style="display: flex; flex-direction: column; gap: 8px;">
                            <div class="info-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('coi6Gen')}:</span>
                                    <span class="info-value" style="color: ${coi6Color}; font-weight: bold; font-size: 1.05rem;">
                                        ${coiResult.coi6Gen}%
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label" style="font-weight: 600; color: #495057; font-size: 0.9rem;">${this.t('coiAllGen')}:</span>
                                    <span class="info-value" style="color: ${coiAllColor}; font-weight: bold; font-size: 1.05rem;">
                                        ${coiResult.coiAllGen}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>${this.t('predictedPedigree')}</strong><br>
                        ${this.t('futurePuppyDescription', { 
                            reu: this.selectedReu.naam || '?', 
                            teef: this.selectedTeef.naam || '?' 
                        })}
                    </div>
                </div>
                
                <div class="popup-footer" style="padding: 16px 20px; border-top: 1px solid #dee2e6; display: flex; justify-content: center; background: #f8f9fa;">
                    <button type="button" class="btn btn-secondary popup-close-btn" style="min-width: 130px; padding: 10px 25px;">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
        
        // Toon popup
        const overlayId = 'futurePuppyDetailOverlay-' + Date.now();
        let overlay = document.getElementById(overlayId);
        if (overlay) overlay.remove();
        
        overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.className = 'dog-detail-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 1090;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        overlay.innerHTML = `
            <div class="dog-detail-popup" style="
                background: white;
                border-radius: 12px;
                max-width: 450px;
                max-height: 80vh;
                overflow-y: auto;
                width: calc(100% - 20px);
                margin: 10px;
            ">
                ${popupHTML}
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Event listeners voor sluiten
        const closePopup = () => {
            overlay.remove();
            document.removeEventListener('keydown', handleEscape);
        };
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') closePopup();
        };
        
        overlay.querySelectorAll('.btn-close, .popup-close-btn').forEach(btn => {
            btn.addEventListener('click', closePopup);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
        
        document.addEventListener('keydown', handleEscape);
    }
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    addStyles() {
        if (!document.querySelector('#reuteef-combinatie-styles')) {
            const style = document.createElement('style');
            style.id = 'reuteef-combinatie-styles';
            style.textContent = `
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
                
                .autocomplete-container {
                    position: relative;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 1050;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                    display: none;
                }
                
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
                
                .dog-details-card {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    padding: 20px;
                    margin-top: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .dog-details-header {
                    margin-bottom: 20px;
                }
                
                .dog-details-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #6f42c1;
                    margin-bottom: 5px;
                }
                
                .dog-details-subtitle {
                    color: #6c757d;
                    font-size: 1rem;
                }
                
                .dog-details-info {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 15px;
                }
                
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .info-item i {
                    color: #6f42c1;
                }
                
                /* Gezondheidsbadges */
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
                
                .dog-detail-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 1090;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addPedigreeStyles() {
        const styleId = 'future-puppy-pedigree-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .pedigree-mobile-wrapper {
                width: 100%;
                display: flex;
                flex-direction: column;
                background: #f8f9fa;
                position: relative;
                border-radius: 12px;
                overflow-x: auto;
                padding: 10px;
            }
            
            .pedigree-container-compact {
                padding: 10px !important;
                margin: 0 !important;
                width: 100% !important;
                background: #f8f9fa;
                min-height: 400px;
                box-sizing: border-box !important;
            }
            
            .pedigree-grid-compact {
                display: flex;
                flex-direction: row;
                height: auto;
                min-width: fit-content;
                padding: 10px !important;
                gap: 15px;
                align-items: flex-start;
                box-sizing: border-box !important;
                margin: 0 auto;
            }
            
            .pedigree-generation-col {
                display: flex;
                flex-direction: column;
                height: auto;
                justify-content: flex-start;
                min-width: 0;
                gap: 8px;
            }
            
            .generation-label {
                font-weight: bold;
                color: white;
                text-align: center;
                margin-bottom: 8px !important;
                font-size: 0.75rem;
                padding: 6px 10px;
                border-radius: 4px;
                white-space: nowrap;
                flex-shrink: 0;
                background: #6c757d;
            }
            
            .pedigree-generation-col.gen0 .generation-label {
                background: #198754;
            }
            
            .pedigree-generation-col.gen1 .generation-label {
                background: #0d6efd;
            }
            
            .pedigree-generation-col.gen2 .generation-label {
                background: #6f42c1;
            }
            
            .pedigree-generation-col.gen3 .generation-label {
                background: #fd7e14;
            }
            
            .pedigree-card-compact.horizontal {
                background: white;
                border-radius: 6px;
                border: 1px solid #dee2e6;
                box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                margin: 0 !important;
                padding: 0 !important;
                flex-shrink: 0;
            }
            
            /* Generation 0: Toekomstige Pup */
            .pedigree-card-compact.horizontal.gen0 {
                width: 180px !important;
                height: 130px !important;
            }
            
            /* Generation 1: Ouders */
            .pedigree-card-compact.horizontal.gen1 {
                width: 160px !important;
                height: 120px !important;
            }
            
            /* Generation 2: Grootouders */
            .pedigree-card-compact.horizontal.gen2 {
                width: 150px !important;
                height: 110px !important;
            }
            
            /* Generation 3: Overgrootouders - kleinere cards */
            .pedigree-card-compact.horizontal.gen3.gen3-small {
                width: 140px !important;
                height: 90px !important;
            }
            
            .pedigree-card-compact.horizontal.main-dog-compact {
                border: 2px solid #198754 !important;
                background: #f0fff4;
            }
            
            .pedigree-card-compact.horizontal.male {
                border-left: 4px solid #0d6efd !important;
            }
            
            .pedigree-card-compact.horizontal.female {
                border-left: 4px solid #dc3545 !important;
            }
            
            .pedigree-card-compact.horizontal:hover {
                box-shadow: 0 2px 5px rgba(0,0,0,0.12);
                transform: translateY(-1px);
                z-index: 1;
                position: relative;
            }
            
            .pedigree-card-compact.horizontal.empty {
                background: #f8f9fa;
                cursor: default;
                opacity: 0.6;
            }
            
            .pedigree-card-header-compact.horizontal {
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                overflow: hidden;
                flex-shrink: 0;
                padding: 4px 8px;
                font-size: 0.7rem;
                min-height: 22px;
            }
            
            /* Kleinere header voor overgrootouders */
            .pedigree-card-compact.horizontal.gen3.gen3-small .pedigree-card-header-compact.horizontal {
                padding: 3px 6px;
                font-size: 0.65rem;
                min-height: 20px;
            }
            
            .pedigree-card-header-compact.horizontal.bg-primary {
                background: #0d6efd !important;
            }
            
            .pedigree-card-header-compact.horizontal.bg-success {
                background: #198754 !important;
            }
            
            .pedigree-card-header-compact.horizontal.bg-secondary {
                background: #6c757d !important;
            }
            
            .relation-compact {
                display: flex;
                align-items: center;
                gap: 3px;
                font-weight: 600;
                overflow: hidden;
                flex: 1;
            }
            
            .relation-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .main-dot {
                color: #ffc107;
                font-size: 0.7rem;
                flex-shrink: 0;
            }
            
            .gender-icon-compact {
                flex-shrink: 0;
                margin-left: 4px;
                font-size: 0.8rem;
            }
            
            /* Kleinere gender icon voor overgrootouders */
            .pedigree-card-compact.horizontal.gen3.gen3-small .gender-icon-compact {
                font-size: 0.7rem;
            }
            
            .pedigree-card-body-compact.horizontal {
                display: flex;
                flex-direction: column;
                overflow: hidden;
                flex: 1;
                padding: 6px 8px;
            }
            
            /* Kleinere body voor overgrootouders */
            .pedigree-card-compact.horizontal.gen3.gen3-small .pedigree-card-body-compact.horizontal {
                padding: 4px 6px;
            }
            
            .card-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 4px;
                overflow: hidden;
            }
            
            .card-row-1 {
                margin-bottom: 2px;
            }
            
            .card-row-2 {
                margin-bottom: 2px;
            }
            
            .card-row-3 {
                margin-top: auto;
            }
            
            .dog-name-kennel-compact {
                font-weight: 600;
                color: #0d6efd;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.1;
                width: 100%;
                font-size: 0.85rem;
            }
            
            /* Kleinere tekst voor overgrootouders */
            .pedigree-card-compact.horizontal.gen3.gen3-small .dog-name-kennel-compact {
                font-size: 0.75rem;
            }
            
            .dog-pedigree-compact {
                font-weight: 600;
                color: #495057;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.1;
                flex: 1;
                font-size: 0.75rem;
            }
            
            /* Kleinere tekst voor overgrootouders */
            .pedigree-card-compact.horizontal.gen3.gen3-small .dog-pedigree-compact {
                font-size: 0.7rem;
            }
            
            .dog-breed-compact {
                color: #28a745;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.1;
                flex: 1;
                text-align: right;
                font-size: 0.75rem;
            }
            
            /* Kleinere tekst voor overgrootouders */
            .pedigree-card-compact.horizontal.gen3.gen3-small .dog-breed-compact {
                font-size: 0.7rem;
            }
            
            .no-data-text {
                color: #6c757d;
                font-style: italic;
                line-height: 1.3;
                font-size: 0.8rem;
            }
            
            /* Kleinere tekst voor overgrootouders */
            .pedigree-card-compact.horizontal.gen3.gen3-small .no-data-text {
                font-size: 0.7rem;
            }
            
            .click-hint-compact {
                color: #6c757d;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 3px;
                line-height: 1;
                width: 100%;
                padding-top: 2px;
                border-top: 1px dashed #dee2e6;
                font-size: 0.65rem;
            }
            
            /* Kleinere hint voor overgrootouders */
            .pedigree-card-compact.horizontal.gen3.gen3-small .click-hint-compact {
                font-size: 0.6rem;
                padding-top: 1px;
            }
        `;
        document.head.appendChild(style);
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

window.reuTeefCombinatie = null;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}