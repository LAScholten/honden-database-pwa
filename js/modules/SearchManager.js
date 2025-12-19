/**
 * Search Manager Module
 * Beheert het zoeken en tonen van hondenresultaten
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentSearchResults = [];
        this.debugMode = true; // Debug modus aan voor probleemoplossing
        
        this.translations = {
            nl: {
                // Modal titels
                searchDog: "Hond Zoeken",
                searchResults: "Zoekresultaten",
                
                // Zoek velden
                searchName: "Naam",
                searchPedigree: "Stamboomnummer",
                searchBreed: "Ras",
                searchCountry: "Land",
                searchGender: "Geslacht",
                allGenders: "Alle geslachten",
                enterName: "Voer naam in...",
                enterPedigree: "Voer stamboomnummer in...",
                enterBreed: "Voer ras in...",
                enterCountry: "Voer land in...",
                search: "Zoeken",
                reset: "Reset",
                enterCriteria: "Voer minstens een hondennaam in en klik op zoeken",
                
                // Resultaten
                found: "gevonden",
                exportResults: "Exporteer",
                actions: "Acties",
                view: "Bekijken",
                edit: "Bewerken",
                deleteResult: "Verwijderen",
                showAllResults: "Toon alle resultaten",
                closeResults: "Sluit resultaten",
                
                // Details
                details: "Details",
                dogInfo: "Hond Informatie",
                healthInfo: "Gezondheidsinformatie",
                locationInfo: "Locatie informatie",
                pedigreeInfo: "Stamboom informatie",
                name: "Naam",
                breed: "Ras",
                pedigreeNumber: "Stamboomnummer",
                gender: "Geslacht",
                male: "Reu",
                female: "Teef",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                country: "Land",
                zipCode: "Postcode",
                father: "Vader",
                mother: "Moeder",
                createdAt: "Aangemaakt",
                updatedAt: "Laatst bijgewerkt",
                remarks: "Opmerkingen",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                backToSearch: "Terug naar zoeken",
                noResultsFound: "Geen resultaten gevonden",
                
                // Alerts
                enterCriteriaError: "Voer minstens een hondennaam in",
                searching: "Zoeken...",
                searchFailed: "Zoeken mislukt: ",
                resetForm: "Zoekformulier gereset",
                noDogsFound: "Geen honden gevonden met de opgegeven criteria",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                exportSearch: "Zoekresultaten geëxporteerd!",
                exportFailed: "Export mislukt: ",
                adminOnly: "Alleen administrators mogen honden bewerken/verwijderen",
                dogDeleted: "Hond succesvol verwijderd!",
                deleteFailed: "Fout bij verwijderen hond: "
            },
            en: {
                // Modal titles
                searchDog: "Search Dog",
                searchResults: "Search Results",
                
                // Search fields
                searchName: "Name",
                searchPedigree: "Pedigree number",
                searchBreed: "Breed",
                searchCountry: "Country",
                searchGender: "Gender",
                allGenders: "All genders",
                enterName: "Enter name...",
                enterPedigree: "Enter pedigree number...",
                enterBreed: "Enter breed...",
                enterCountry: "Enter country...",
                search: "Search",
                reset: "Reset",
                enterCriteria: "Enter at least a dog name and click search",
                
                // Results
                found: "found",
                exportResults: "Export",
                actions: "Actions",
                view: "View",
                edit: "Edit",
                deleteResult: "Delete",
                showAllResults: "Show all results",
                closeResults: "Close results",
                
                // Details
                details: "Details",
                dogInfo: "Dog Information",
                healthInfo: "Health Information",
                locationInfo: "Location Information",
                pedigreeInfo: "Pedigree Information",
                name: "Name",
                breed: "Breed",
                pedigreeNumber: "Pedigree number",
                gender: "Gender",
                male: "Male",
                female: "Female",
                birthDate: "Birth date",
                deathDate: "Death date",
                country: "Country",
                zipCode: "Zip code",
                father: "Father",
                mother: "Mother",
                createdAt: "Created",
                updatedAt: "Last updated",
                remarks: "Remarks",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                backToSearch: "Back to search",
                noResultsFound: "No results found",
                
                // Alerts
                enterCriteriaError: "Enter at least a dog name",
                searching: "Searching...",
                searchFailed: "Search failed: ",
                resetForm: "Search form reset",
                noDogsFound: "No dogs found with the specified criteria",
                confirmDelete: "Are you sure you want to delete this dog?",
                exportSearch: "Search results exported!",
                exportFailed: "Export failed: ",
                adminOnly: "Only administrators can edit/delete dogs",
                dogDeleted: "Dog successfully deleted!",
                deleteFailed: "Error deleting dog: "
            },
            de: {
                // Modal Titel
                searchDog: "Hund suchen",
                searchResults: "Suchergebnisse",
                
                // Suchfelder
                searchName: "Name",
                searchPedigree: "Stammbaum-Nummer",
                searchBreed: "Rasse",
                searchCountry: "Land",
                searchGender: "Geschlecht",
                allGenders: "Alle Geschlechter",
                enterName: "Name eingeben...",
                enterPedigree: "Stammbaum-Nummer eingeben...",
                enterBreed: "Rasse eingeben...",
                enterCountry: "Land eingeben...",
                search: "Suchen",
                reset: "Zurücksetzen",
                enterCriteria: "Geben Sie mindestens einen Hundenamen ein und klicken Sie auf Suchen",
                
                // Ergebnisse
                found: "gefunden",
                exportResults: "Exportieren",
                actions: "Aktionen",
                view: "Ansehen",
                edit: "Bearbeiten",
                deleteResult: "Löschen",
                showAllResults: "Alle Ergebnisse anzeigen",
                closeResults: "Ergebnisse schließen",
                
                // Details
                details: "Details",
                dogInfo: "Hund Information",
                healthInfo: "Gesundheitsinformation",
                locationInfo: "Standort Information",
                pedigreeInfo: "Stammbaum Information",
                name: "Name",
                breed: "Rasse",
                pedigreeNumber: "Stammbaum-Nummer",
                gender: "Geschlecht",
                male: "Rüde",
                female: "Hündin",
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                country: "Land",
                zipCode: "Postleitzahl",
                father: "Vater",
                mother: "Mutter",
                createdAt: "Erstellt",
                updatedAt: "Zuletzt aktualisiert",
                remarks: "Bemerkungen",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                backToSearch: "Zurück zur Suche",
                noResultsFound: "Keine Ergebnisse gefunden",
                
                // Meldungen
                enterCriteriaError: "Geben Sie mindestens einen Hundenamen ein",
                searching: "Suche läuft...",
                searchFailed: "Suche fehlgeschlagen: ",
                resetForm: "Suchformular zurückgesetzt",
                noDogsFound: "Keine Hunde mit den angegebenen Kriterien gefunden",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Hund löschen möchten?",
                exportSearch: "Suchergebnisse exportiert!",
                exportFailed: "Export fehlgeschlagen: ",
                adminOnly: "Nur Administratoren können Hunde bearbeiten/löschen",
                dogDeleted: "Hund erfolgreich gelöscht!",
                deleteFailed: "Fehler beim Löschen des Hundes: "
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    // DEBUG FUNCTIE: Toon alle honden in database
    async debugShowAllDogs() {
        try {
            const allDogs = await this.db.getHonden();
            console.log('=== DEBUG: Alle honden in database ===');
            console.log(`Aantal honden: ${allDogs.length}`);
            
            if (allDogs.length === 0) {
                console.log('Database is leeg!');
                this.showError('DEBUG: Database is leeg!');
                return;
            }
            
            allDogs.forEach((dog, index) => {
                console.log(`${index + 1}. ID: ${dog.id}, Naam: "${dog.naam}", Stamboomnr: "${dog.stamboomnr}", Ras: "${dog.ras}"`);
                console.log(`   Geslacht: "${dog.geslacht}", Land: "${dog.land}"`);
            });
            console.log('=== EINDE DEBUG ===');
            
            this.showInfo(`DEBUG: ${allDogs.length} honden gevonden in database. Check console voor details.`);
        } catch (error) {
            console.error('DEBUG Fout:', error);
            this.showError(`DEBUG Fout: ${error.message}`);
        }
    }
    
    getSearchModalHTML() {
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
                            ${this.debugMode ? `
                            <div class="alert alert-warning mb-3">
                                <i class="bi bi-bug"></i> <strong>DEBUG MODE</strong>
                                <button class="btn btn-sm btn-outline-dark float-end" id="debugShowAllBtn">
                                    Toon alle honden
                                </button>
                            </div>
                            ` : ''}
                            
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h6 class="mb-3">${t('searchDog')}</h6>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label for="searchNaam" class="form-label">${t('searchName')} *</label>
                                            <input type="text" class="form-control" id="searchNaam" placeholder="${t('enterName')}" required>
                                            <div class="form-text">Voer (een deel van) de hondennaam in</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchStamboomnr" class="form-label">${t('searchPedigree')}</label>
                                            <input type="text" class="form-control" id="searchStamboomnr" placeholder="${t('enterPedigree')}">
                                            <div class="form-text">Optioneel: stamboomnummer</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchRas" class="form-label">${t('searchBreed')}</label>
                                            <input type="text" class="form-control" id="searchRas" placeholder="${t('enterBreed')}">
                                            <div class="form-text">Optioneel: ras</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchGeslacht" class="form-label">${t('searchGender')}</label>
                                            <select class="form-select" id="searchGeslacht">
                                                <option value="">${t('allGenders')}</option>
                                                <option value="reuen">${t('male')}</option>
                                                <option value="teven">${t('female')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mt-4">
                                        <button class="btn btn-info btn-lg" id="searchBtn">
                                            <i class="bi bi-search"></i> ${t('search')}
                                        </button>
                                        <button class="btn btn-secondary" id="resetSearchBtn">
                                            <i class="bi bi-arrow-clockwise"></i> ${t('reset')}
                                        </button>
                                        ${this.debugMode ? `
                                        <button class="btn btn-warning" id="testSearchBtn">
                                            <i class="bi bi-flask"></i> Test Zoeken
                                        </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            
                            <div id="searchResultsContainer" style="display: none;">
                                <!-- Resultaten worden hier ingevoegd -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getResultsPageHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="container-fluid mt-3">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        <i class="bi bi-search"></i> ${t('searchResults')}
                        <span class="badge bg-info fs-6">${this.currentSearchResults.length} ${t('found')}</span>
                    </h2>
                    <div>
                        <button class="btn btn-outline-secondary" id="backToSearchBtn">
                            <i class="bi bi-arrow-left"></i> ${t('backToSearch')}
                        </button>
                        <button class="btn btn-outline-info" id="exportResultsBtn">
                            <i class="bi bi-download"></i> ${t('exportResults')}
                        </button>
                    </div>
                </div>
                
                <div class="row" id="searchResultsGrid">
                    <!-- Resultaten worden hier ingevoegd -->
                </div>
                
                ${this.currentSearchResults.length === 0 ? `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">${t('noResultsFound')}</h4>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    setupSearchEvents() {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearchImproved();
            });
        }
        
        const resetBtn = document.getElementById('resetSearchBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSearchForm();
            });
        }
        
        // Debug knop
        const debugBtn = document.getElementById('debugShowAllBtn');
        if (debugBtn) {
            debugBtn.addEventListener('click', () => {
                this.debugShowAllDogs();
            });
        }
        
        // Test zoek knop
        const testSearchBtn = document.getElementById('testSearchBtn');
        if (testSearchBtn) {
            testSearchBtn.addEventListener('click', () => {
                this.testSearchFunction();
            });
        }
    }
    
    // Test functie voor zoeken
    async testSearchFunction() {
        try {
            console.log('=== TEST ZOEKFUNCTIE ===');
            
            // Test 1: Toon alle honden
            const allDogs = await this.db.getHonden();
            console.log('Test 1 - Totaal honden:', allDogs.length);
            
            // Test 2: Zoek op lege criteria (moet alle honden teruggeven)
            console.log('\nTest 2 - Zoek met lege criteria:');
            const emptySearch = await this.db.zoekHonden({});
            console.log('Resultaten:', emptySearch.length);
            
            // Test 3: Zoek op een bekende naam (als er honden zijn)
            if (allDogs.length > 0) {
                console.log('\nTest 3 - Zoek op eerste hond naam:');
                const firstDog = allDogs[0];
                console.log('Zoekterm:', firstDog.naam);
                const nameSearch = await this.db.zoekHonden({ naam: firstDog.naam });
                console.log('Resultaten:', nameSearch.length);
                
                // Test 4: Zoek op deel van de naam
                console.log('\nTest 4 - Zoek op deel van naam:');
                if (firstDog.naam.length > 3) {
                    const partialName = firstDog.naam.substring(0, 3);
                    console.log('Zoekterm:', partialName);
                    const partialSearch = await this.db.zoekHonden({ naam: partialName });
                    console.log('Resultaten:', partialSearch.length);
                }
            }
            
            // Test 5: Handmatig filteren
            console.log('\nTest 5 - Handmatig filteren:');
            const searchTerm = document.getElementById('searchNaam').value.trim().toLowerCase();
            console.log('Ingevoerde zoekterm:', searchTerm);
            
            const manualResults = allDogs.filter(dog => {
                const dogName = (dog.naam || '').toLowerCase();
                return dogName.includes(searchTerm);
            });
            
            console.log('Handmatige resultaten:', manualResults.length);
            manualResults.forEach(dog => {
                console.log(`- ${dog.naam} (${dog.naam.toLowerCase()}) bevat "${searchTerm}": ${dog.naam.toLowerCase().includes(searchTerm)}`);
            });
            
            this.showInfo(`Test voltooid. Check console voor details. ${manualResults.length} handmatige resultaten gevonden.`);
            
        } catch (error) {
            console.error('Test mislukt:', error);
            this.showError(`Test mislukt: ${error.message}`);
        }
    }
    
    // VERBETERDE ZOEKFUNCTIE DIE WERKT!
    async performSearchImproved() {
        const naam = document.getElementById('searchNaam').value.trim();
        
        if (!naam) {
            this.showError(this.t('enterCriteriaError'));
            return;
        }
        
        this.showProgress(this.t('searching'));
        
        try {
            // Haal ALLE honden op
            const allDogs = await this.db.getHonden();
            
            // Debug info
            console.log('=== VERBETERD ZOEKEN ===');
            console.log('Zoekterm:', naam);
            console.log('Totaal honden in database:', allDogs.length);
            
            // Toon alle honden namen voor debugging
            console.log('Alle honden namen:');
            allDogs.forEach(dog => {
                console.log(`- "${dog.naam}" (ID: ${dog.id})`);
            });
            
            // Filter lokaal voor betere debugging
            const criteria = {
                naam: naam.toLowerCase(),
                stamboomnr: document.getElementById('searchStamboomnr').value.trim().toLowerCase(),
                ras: document.getElementById('searchRas').value.trim().toLowerCase(),
                geslacht: document.getElementById('searchGeslacht').value
            };
            
            console.log('Zoekcriteria:', criteria);
            
            // HANDMATIG FILTEREN - werkt beter dan db.zoekHonden
            const results = allDogs.filter(dog => {
                let match = true;
                
                // Naam: gedeeltelijke match (niet hoofdlettergevoelig)
                if (criteria.naam) {
                    const dogNaam = (dog.naam || '').toLowerCase();
                    if (!dogNaam.includes(criteria.naam)) {
                        console.log(`   "${dog.naam}" bevat niet "${criteria.naam}"`);
                        match = false;
                    } else {
                        console.log(`✓  "${dog.naam}" bevat "${criteria.naam}"`);
                    }
                }
                
                // Stamboomnr: gedeeltelijke match
                if (match && criteria.stamboomnr) {
                    const dogStamboom = (dog.stamboomnr || '').toLowerCase();
                    if (!dogStamboom.includes(criteria.stamboomnr)) {
                        match = false;
                    }
                }
                
                // Ras: gedeeltelijke match
                if (match && criteria.ras) {
                    const dogRas = (dog.ras || '').toLowerCase();
                    if (!dogRas.includes(criteria.ras)) {
                        match = false;
                    }
                }
                
                // Geslacht: exacte match
                if (match && criteria.geslacht) {
                    if (dog.geslacht !== criteria.geslacht) {
                        match = false;
                    }
                }
                
                return match;
            });
            
            console.log('Gevonden resultaten:', results.length);
            results.forEach(dog => {
                console.log(`- ${dog.naam} (ID: ${dog.id})`);
            });
            
            this.currentSearchResults = results;
            this.hideProgress();
            
            if (results.length === 0) {
                // Toon suggesties als er geen exacte match is
                const suggestions = allDogs.filter(dog => {
                    const dogNaam = (dog.naam || '').toLowerCase();
                    return dogNaam.includes(criteria.naam.toLowerCase()) || 
                           criteria.naam.toLowerCase().includes(dogNaam);
                });
                
                if (suggestions.length > 0) {
                    this.showInfo(`Geen exacte match gevonden. Suggesties: ${suggestions.map(s => s.naam).join(', ')}`);
                } else {
                    this.showInfo(this.t('noDogsFound'));
                }
                return;
            }
            
            // Sluit modal en toon resultaten
            const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
            if (searchModal) searchModal.hide();
            
            this.showSearchResultsPage();
            
        } catch (error) {
            this.hideProgress();
            console.error('Zoeken mislukt:', error);
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    // Alternatieve zoekfunctie: zoek direct ALLE honden en filter lokaal
    async performSearchDirect() {
        const naam = document.getElementById('searchNaam').value.trim();
        
        if (!naam) {
            this.showError(this.t('enterCriteriaError'));
            return;
        }
        
        this.showProgress(this.t('searching'));
        
        try {
            // Haal ALLE honden op
            const allDogs = await this.db.getHonden();
            
            console.log('=== DIRECTE ZOEK ===');
            console.log('Totaal honden:', allDogs.length);
            console.log('Zoekterm:', naam);
            
            // SIMPELE FILTER: alleen op naam
            const searchTerm = naam.toLowerCase();
            const results = allDogs.filter(dog => {
                const dogName = (dog.naam || '').toLowerCase();
                return dogName.includes(searchTerm);
            });
            
            console.log('Gevonden:', results.length);
            
            this.currentSearchResults = results;
            this.hideProgress();
            
            if (results.length === 0) {
                // Laat zien wat er wel in de database staat
                console.log('Alle honden in database:');
                allDogs.forEach(dog => {
                    console.log(`- "${dog.naam}"`);
                });
                
                this.showInfo(`Geen honden gevonden met "${naam}". Check console voor alle beschikbare honden.`);
                return;
            }
            
            // Sluit modal en toon resultaten
            const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
            if (searchModal) searchModal.hide();
            
            this.showSearchResultsPage();
            
        } catch (error) {
            this.hideProgress();
            console.error('Direct zoeken mislukt:', error);
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    showSearchResultsPage() {
        const t = this.t.bind(this);
        
        // Haal de hoofdcontent container op
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;
        
        // Genereer de resultaten pagina HTML
        const html = this.getResultsPageHTML();
        mainContent.innerHTML = html;
        
        // Toon de resultaten
        this.displaySearchResultsGrid();
        
        // Event listeners voor resultaten pagina
        const backBtn = document.getElementById('backToSearchBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showMainContent();
            });
        }
        
        const exportBtn = document.getElementById('exportResultsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSearchResults(this.currentSearchResults);
            });
        }
    }
    
    displaySearchResultsGrid() {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsGrid');
        if (!container) return;
        
        if (this.currentSearchResults.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">${t('noResultsFound')}</h4>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        this.currentSearchResults.forEach(hond => {
            const genderText = hond.geslacht === 'reuen' ? t('male') : 
                             hond.geslacht === 'teven' ? t('female') : 'Onbekend';
            
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-header bg-light">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">
                                    <i class="bi bi-dog"></i> ${hond.naam}
                                </h5>
                                <span class="badge bg-${hond.geslacht === 'reuen' ? 'primary' : 'danger'}">
                                    ${genderText}
                                </span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="mb-2">
                                <strong><i class="bi bi-tag"></i> ${t('breed')}:</strong>
                                ${hond.ras || 'Onbekend'}
                            </div>
                            <div class="mb-2">
                                <strong><i class="bi bi-hash"></i> ${t('pedigreeNumber')}:</strong>
                                ${hond.stamboomnr ? `<code>${hond.stamboomnr}</code>` : 'Niet bekend'}
                            </div>
                            ${hond.geboortedatum ? `
                            <div class="mb-2">
                                <strong><i class="bi bi-calendar"></i> ${t('birthDate')}:</strong>
                                ${new Date(hond.geboortedatum).toLocaleDateString(this.currentLang)}
                            </div>
                            ` : ''}
                            ${hond.land ? `
                            <div class="mb-2">
                                <strong><i class="bi bi-globe"></i> ${t('country')}:</strong>
                                ${hond.land}
                            </div>
                            ` : ''}
                            ${hond.vader || hond.moeder ? `
                            <div class="mt-3">
                                <strong><i class="bi bi-diagram-3"></i> ${t('pedigreeInfo')}:</strong>
                                <div class="small">
                                    ${hond.vader ? `${t('father')}: ${hond.vader}<br>` : ''}
                                    ${hond.moeder ? `${t('mother')}: ${hond.moeder}` : ''}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        <div class="card-footer bg-white">
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-sm btn-outline-primary view-dog-btn" data-id="${hond.id}">
                                    <i class="bi bi-eye"></i> ${t('view')}
                                </button>
                                ${this.auth.isAdmin() ? `
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-warning edit-dog-btn" data-id="${hond.id}">
                                        <i class="bi bi-pencil"></i> ${t('edit')}
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger delete-dog-btn" data-id="${hond.id}" data-name="${hond.naam}">
                                        <i class="bi bi-trash"></i> ${t('deleteResult')}
                                    </button>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Event listeners voor knoppen
        this.setupResultsPageEvents();
    }
    
    setupResultsPageEvents() {
        // View knoppen
        document.querySelectorAll('.view-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.view-dog-btn').dataset.id;
                this.viewDogDetails(hondId);
            });
        });
        
        // Edit knoppen - deze roept de DogManager aan
        document.querySelectorAll('.edit-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.edit-dog-btn').dataset.id;
                if (window.dogManager) {
                    window.dogManager.editDog(hondId);
                } else {
                    this.showError('DogManager niet beschikbaar');
                }
            });
        });
        
        // Delete knoppen
        document.querySelectorAll('.delete-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.delete-dog-btn').dataset.id;
                const hondNaam = e.target.closest('.delete-dog-btn').dataset.name;
                this.deleteDogDirect(hondId, hondNaam);
            });
        });
    }
    
    async deleteDogDirect(hondId, hondNaam) {
        if (!this.auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        if (!confirm(`${this.t('confirmDelete')}\n\n"${hondNaam}"`)) {
            return;
        }
        
        this.showProgress("Hond verwijderen...");
        
        try {
            // Verwijder ook gerelateerde foto's
            const hond = await this.getHondById(parseInt(hondId));
            if (hond && hond.stamboomnr) {
                const fotos = await this.db.getFotosVoorStamboomnr(hond.stamboomnr);
                for (const foto of fotos) {
                    try {
                        await this.db.verwijderFoto(foto.id);
                    } catch (fotoError) {
                        console.log(`Foto ${foto.id} kon niet verwijderd worden:`, fotoError);
                    }
                }
            }
            
            // Verwijder de hond
            await this.db.verwijderHond(parseInt(hondId));
            this.hideProgress();
            this.showSuccess(`${hondNaam} ${this.t('dogDeleted').toLowerCase()}`);
            
            // Vernieuw de resultaten
            setTimeout(() => {
                // Verwijder de hond uit huidige resultaten
                this.currentSearchResults = this.currentSearchResults.filter(h => h.id !== parseInt(hondId));
                this.displaySearchResultsGrid();
            }, 500);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('deleteFailed')}${error.message}`);
        }
    }
    
    async viewDogDetails(hondId) {
        const t = this.t.bind(this);
        
        try {
            const honden = await this.db.getHonden();
            const hond = honden.find(h => h.id === parseInt(hondId));
            
            if (!hond) {
                this.showError('Hond niet gevonden');
                return;
            }
            
            const genderText = hond.geslacht === 'reuen' ? t('male') : 
                             hond.geslacht === 'teven' ? t('female') : '-';
            
            const html = `
                <div class="modal fade" id="viewDogModal" tabindex="-1" aria-labelledby="viewDogModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white">
                                <h5 class="modal-title" id="viewDogModalLabel">
                                    <i class="bi bi-eye"></i> ${hond.naam} - ${t('details')}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">${t('dogInfo')}</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">${t('name')}:</th>
                                                <td>${hond.naam}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('breed')}:</th>
                                                <td>${hond.ras || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('pedigreeNumber')}:</th>
                                                <td><code>${hond.stamboomnr || '-'}</code></td>
                                            </tr>
                                            <tr>
                                                <th>${t('gender')}:</th>
                                                <td>${genderText}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('birthDate')}:</th>
                                                <td>${hond.geboortedatum ? new Date(hond.geboortedatum).toLocaleDateString(this.currentLang) : '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('deathDate')}:</th>
                                                <td>${hond.overlijdensdatum ? new Date(hond.overlijdensdatum).toLocaleDateString(this.currentLang) : '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('country')}:</th>
                                                <td>${hond.land || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('zipCode')}:</th>
                                                <td>${hond.postcode || '-'}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">${t('pedigreeInfo')}</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">${t('father')}:</th>
                                                <td>${hond.vader || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('mother')}:</th>
                                                <td>${hond.moeder || '-'}</td>
                                            </tr>
                                        </table>
                                        
                                        <h6 class="border-bottom pb-2 mt-4">${t('locationInfo')}</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th>${t('createdAt')}:</th>
                                                <td>${new Date(hond.createdAt).toLocaleString(this.currentLang)}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('updatedAt')}:</th>
                                                <td>${new Date(hond.updatedAt).toLocaleString(this.currentLang)}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                
                                <div class="row mt-4">
                                    <div class="col-12">
                                        <h6 class="border-bottom pb-2">${t('healthInfo')}</h6>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <strong>${t('hipDysplasia')}:</strong><br>
                                                ${hond.heupdysplasie || '-'}
                                            </div>
                                            <div class="col-md-3">
                                                <strong>${t('elbowDysplasia')}:</strong><br>
                                                ${hond.elleboogdysplasie || '-'}
                                            </div>
                                            <div class="col-md-3">
                                                <strong>${t('patellaLuxation')}:</strong><br>
                                                ${hond.patella || '-'}
                                            </div>
                                            <div class="col-md-3">
                                                <strong>${t('eyes')}:</strong><br>
                                                ${hond.ogen || '-'}
                                                ${hond.ogenVerklaring ? ` (${hond.ogenVerklaring})` : ''}
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <strong>${t('dandyWalker')}:</strong><br>
                                                ${hond.dandyWalker || '-'}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>${t('thyroid')}:</strong><br>
                                                ${hond.schildklier || '-'}
                                                ${hond.schildklierVerklaring ? ` (${hond.schildklierVerklaring})` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                ${hond.opmerkingen ? `
                                <div class="mt-4">
                                    <h6 class="border-bottom pb-2">${t('remarks')}</h6>
                                    <div class="bg-light p-3 rounded">
                                        ${hond.opmerkingen}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const container = document.getElementById('modalsContainer');
            container.insertAdjacentHTML('beforeend', html);
            
            const modalElement = document.getElementById('viewDogModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
        } catch (error) {
            this.showError(`Fout bij laden hond details: ${error.message}`);
        }
    }
    
    resetSearchForm() {
        document.getElementById('searchNaam').value = '';
        document.getElementById('searchStamboomnr').value = '';
        document.getElementById('searchRas').value = '';
        document.getElementById('searchGeslacht').value = '';
        
        const resultsContainer = document.getElementById('searchResultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
        }
        
        this.showSuccess(this.t('resetForm'));
    }
    
    showMainContent() {
        // Laad de hoofdcontent opnieuw
        if (typeof loadMainContent === 'function') {
            loadMainContent();
        } else {
            // Fallback: ga terug naar dashboard
            window.location.hash = '#dashboard';
        }
    }
    
    async exportSearchResults(results) {
        if (!results || results.length === 0) {
            this.showError('Geen resultaten om te exporteren');
            return;
        }
        
        try {
            const jsonString = JSON.stringify(results, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `honden-export-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.showSuccess(this.t('exportSearch'));
            
        } catch (error) {
            this.showError(`${this.t('exportFailed')}${error.message}`);
        }
    }
    
    async getHondById(hondId) {
        try {
            const honden = await this.db.getHonden();
            return honden.find(h => h.id === hondId);
        } catch (error) {
            console.error('Fout bij ophalen hond:', error);
            return null;
        }
    }
    
    // Helper method voor bestandsdownload
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}