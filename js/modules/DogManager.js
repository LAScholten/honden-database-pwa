/**
 * Hond Management Module
 * Beheert toevoegen, zoeken en bewerken van honden
 */

class DogManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = {
            nl: {
                // Modal titels
                newDog: "Nieuwe Hond Toevoegen",
                searchDog: "Hond Zoeken",
                
                // Form velden
                name: "Naam",
                nameRequired: "Naam *",
                breed: "Ras",
                breedRequired: "Ras *",
                chipNumber: "Chipnummer",
                chipRequired: "Chipnummer *",
                uniqueId: "Uniek identificatienummer",
                birthDate: "Geboortedatum",
                gender: "Geslacht",
                choose: "Kies...",
                male: "Reu",
                female: "Teef",
                color: "Kleur",
                weight: "Gewicht (kg)",
                owner: "Eigenaar",
                remarks: "Opmerkingen",
                requiredFields: "Velden met een * zijn verplicht. Het chipnummer moet uniek zijn.",
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                
                // Zoek velden
                searchName: "Naam",
                searchBreed: "Ras",
                searchChip: "Chipnummer",
                searchOwner: "Eigenaar",
                searchGender: "Geslacht",
                allGenders: "Alle geslachten",
                enterName: "Voer naam in...",
                enterBreed: "Voer ras in...",
                enterChip: "Voer chipnummer in...",
                enterOwner: "Voer eigenaar in...",
                search: "Zoeken",
                reset: "Reset",
                enterCriteria: "Voer zoekcriteria in en klik op zoeken",
                
                // Resultaten
                searchResults: "Zoekresultaten",
                found: "gevonden",
                exportResults: "Exporteer",
                actions: "Acties",
                view: "Bekijken",
                edit: "Bewerken",
                
                // Details modal
                basicInfo: "Basis Informatie",
                extraInfo: "Extra Informatie",
                created: "Aangemaakt",
                lastUpdated: "Laatst bijgewerkt",
                
                // Alerts
                adminOnly: "Alleen administrators mogen nieuwe honden toevoegen",
                fieldsRequired: "Naam, ras en chipnummer zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
                addFailed: "Fout bij toevoegen hond: ",
                enterCriteriaError: "Voer minstens één zoekcriterium in",
                searching: "Zoeken...",
                searchFailed: "Zoeken mislukt: ",
                resetForm: "Zoekformulier gereset",
                noDogsFound: "Geen honden gevonden met de opgegeven criteria",
                exportSearch: "Zoekresultaten geëxporteerd!",
                exportFailed: "Export mislukt: "
            },
            en: {
                // Modal titles
                newDog: "Add New Dog",
                searchDog: "Search Dog",
                
                // Form fields
                name: "Name",
                nameRequired: "Name *",
                breed: "Breed",
                breedRequired: "Breed *",
                chipNumber: "Chip number",
                chipRequired: "Chip number *",
                uniqueId: "Unique identification number",
                birthDate: "Birth date",
                gender: "Gender",
                choose: "Choose...",
                male: "Male",
                female: "Female",
                color: "Color",
                weight: "Weight (kg)",
                owner: "Owner",
                remarks: "Remarks",
                requiredFields: "Fields with * are required. Chip number must be unique.",
                saveDog: "Save Dog",
                cancel: "Cancel",
                
                // Search fields
                searchName: "Name",
                searchBreed: "Breed",
                searchChip: "Chip number",
                searchOwner: "Owner",
                searchGender: "Gender",
                allGenders: "All genders",
                enterName: "Enter name...",
                enterBreed: "Enter breed...",
                enterChip: "Enter chip number...",
                enterOwner: "Enter owner...",
                search: "Search",
                reset: "Reset",
                enterCriteria: "Enter search criteria and click search",
                
                // Results
                searchResults: "Search Results",
                found: "found",
                exportResults: "Export",
                actions: "Actions",
                view: "View",
                edit: "Edit",
                
                // Details modal
                basicInfo: "Basic Information",
                extraInfo: "Extra Information",
                created: "Created",
                lastUpdated: "Last updated",
                
                // Alerts
                adminOnly: "Only administrators can add new dogs",
                fieldsRequired: "Name, breed and chip number are required fields",
                savingDog: "Saving dog...",
                dogAdded: "Dog successfully added!",
                addFailed: "Error adding dog: ",
                enterCriteriaError: "Enter at least one search criterion",
                searching: "Searching...",
                searchFailed: "Search failed: ",
                resetForm: "Search form reset",
                noDogsFound: "No dogs found with the specified criteria",
                exportSearch: "Search results exported!",
                exportFailed: "Export failed: "
            },
            de: {
                // Modal Titel
                newDog: "Neuen Hund hinzufügen",
                searchDog: "Hund suchen",
                
                // Formular Felder
                name: "Name",
                nameRequired: "Name *",
                breed: "Rasse",
                breedRequired: "Rasse *",
                chipNumber: "Chipnummer",
                chipRequired: "Chipnummer *",
                uniqueId: "Eindeutige Identifikationsnummer",
                birthDate: "Geburtsdatum",
                gender: "Geschlecht",
                choose: "Wählen...",
                male: "Rüde",
                female: "Hündin",
                color: "Farbe",
                weight: "Gewicht (kg)",
                owner: "Besitzer",
                remarks: "Bemerkungen",
                requiredFields: "Felder mit * sind Pflichtfelder. Die Chipnummer muss eindeutig sein.",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                
                // Suchfelder
                searchName: "Name",
                searchBreed: "Rasse",
                searchChip: "Chipnummer",
                searchOwner: "Besitzer",
                searchGender: "Geschlecht",
                allGenders: "Alle Geschlechter",
                enterName: "Name eingeben...",
                enterBreed: "Rasse eingeben...",
                enterChip: "Chipnummer eingeben...",
                enterOwner: "Besitzer eingeben...",
                search: "Suchen",
                reset: "Zurücksetzen",
                enterCriteria: "Suchkriterien eingeben und auf Suchen klicken",
                
                // Ergebnisse
                searchResults: "Suchergebnisse",
                found: "gefunden",
                exportResults: "Exportieren",
                actions: "Aktionen",
                view: "Ansehen",
                edit: "Bearbeiten",
                
                // Details Modal
                basicInfo: "Basisinformation",
                extraInfo: "Zusatzinformation",
                created: "Erstellt",
                lastUpdated: "Zuletzt aktualisiert",
                
                // Meldungen
                adminOnly: "Nur Administratoren können neue Hunde hinzufügen",
                fieldsRequired: "Name, Rasse und Chipnummer sind Pflichtfelder",
                savingDog: "Hund wird gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                addFailed: "Fehler beim Hinzufügen des Hundes: ",
                enterCriteriaError: "Geben Sie mindestens ein Suchkriterium ein",
                searching: "Suche läuft...",
                searchFailed: "Suche fehlgeschlagen: ",
                resetForm: "Suchformular zurückgesetzt",
                noDogsFound: "Keine Hunde mit den angegebenen Kriterien gefunden",
                exportSearch: "Suchergebnisse exportiert!",
                exportFailed: "Export fehlgeschlagen: "
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="addDogModal" tabindex="-1" aria-labelledby="addDogModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="addDogModalLabel">
                                <i class="bi bi-plus-circle"></i> ${t('newDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addDogForm">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="hondNaam" class="form-label">${t('nameRequired')}</label>
                                            <input type="text" class="form-control" id="hondNaam" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="hondRas" class="form-label">${t('breedRequired')}</label>
                                            <input type="text" class="form-control" id="hondRas" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="hondChipnummer" class="form-label">${t('chipRequired')}</label>
                                            <input type="text" class="form-control" id="hondChipnummer" required>
                                            <div class="form-text">${t('uniqueId')}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="hondGeboortedatum" class="form-label">${t('birthDate')}</label>
                                            <input type="date" class="form-control" id="hondGeboortedatum">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="hondGeslacht" class="form-label">${t('gender')}</label>
                                            <select class="form-select" id="hondGeslacht">
                                                <option value="">${t('choose')}</option>
                                                <option value="reuen">${t('male')}</option>
                                                <option value="teven">${t('female')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="hondKleur" class="form-label">${t('color')}</label>
                                            <input type="text" class="form-control" id="hondKleur">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="hondGewicht" class="form-label">${t('weight')}</label>
                                            <input type="number" step="0.1" class="form-control" id="hondGewicht">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="hondEigenaar" class="form-label">${t('owner')}</label>
                                    <input type="text" class="form-control" id="hondEigenaar">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="hondOpmerkingen" class="form-label">${t('remarks')}</label>
                                    <textarea class="form-control" id="hondOpmerkingen" rows="3"></textarea>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i>
                                    ${t('requiredFields')}
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
                            <button type="button" class="btn btn-primary" id="saveDogBtn">${t('saveDog')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getSearchModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search"></i> ${t('searchDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <label for="searchNaam" class="form-label">${t('searchName')}</label>
                                            <input type="text" class="form-control" id="searchNaam" placeholder="${t('enterName')}">
                                        </div>
                                        <div class="col-md-4">
                                            <label for="searchRas" class="form-label">${t('searchBreed')}</label>
                                            <input type="text" class="form-control" id="searchRas" placeholder="${t('enterBreed')}">
                                        </div>
                                        <div class="col-md-4">
                                            <label for="searchChipnummer" class="form-label">${t('searchChip')}</label>
                                            <input type="text" class="form-control" id="searchChipnummer" placeholder="${t('enterChip')}">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchEigenaar" class="form-label">${t('searchOwner')}</label>
                                            <input type="text" class="form-control" id="searchEigenaar" placeholder="${t('enterOwner')}">
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
                                    <div class="mt-3">
                                        <button class="btn btn-info" id="searchBtn">
                                            <i class="bi bi-search"></i> ${t('search')}
                                        </button>
                                        <button class="btn btn-secondary" id="resetSearchBtn">
                                            <i class="bi bi-arrow-clockwise"></i> ${t('reset')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="searchResultsContainer">
                                <div class="text-center py-5">
                                    <i class="bi bi-search display-1 text-muted"></i>
                                    <p class="mt-3 text-muted">${t('enterCriteria')}</p>
                                </div>
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
    
    setupEvents() {
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveNewDog();
            });
        }
    }
    
    setupSearchEvents() {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }
        
        const resetBtn = document.getElementById('resetSearchBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSearchForm();
            });
        }
    }
    
    async saveNewDog() {
        if (!this.auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        const hond = {
            naam: document.getElementById('hondNaam').value.trim(),
            ras: document.getElementById('hondRas').value.trim(),
            chipnummer: document.getElementById('hondChipnummer').value.trim(),
            geboortedatum: document.getElementById('hondGeboortedatum').value,
            geslacht: document.getElementById('hondGeslacht').value,
            kleur: document.getElementById('hondKleur').value.trim(),
            gewicht: document.getElementById('hondGewicht').value ? parseFloat(document.getElementById('hondGewicht').value) : null,
            eigenaar: document.getElementById('hondEigenaar').value.trim(),
            opmerkingen: document.getElementById('hondOpmerkingen').value.trim()
        };
        
        if (!hond.naam || !hond.ras || !hond.chipnummer) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        this.showProgress(this.t('savingDog'));
        
        try {
            await this.db.voegHondToe(hond);
            this.hideProgress();
            this.showSuccess(`"${hond.naam}" ${this.t('dogAdded')}`);
            
            document.getElementById('addDogForm').reset();
            
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addDogModal'));
                if (modal) modal.hide();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('addFailed')}${error.message}`);
        }
    }
    
    async performSearch() {
        const criteria = {
            naam: document.getElementById('searchNaam').value.trim(),
            ras: document.getElementById('searchRas').value.trim(),
            chipnummer: document.getElementById('searchChipnummer').value.trim(),
            eigenaar: document.getElementById('searchEigenaar').value.trim(),
            geslacht: document.getElementById('searchGeslacht').value
        };
        
        Object.keys(criteria).forEach(key => {
            if (!criteria[key]) delete criteria[key];
        });
        
        if (Object.keys(criteria).length === 0) {
            this.showError(this.t('enterCriteriaError'));
            return;
        }
        
        this.showProgress(this.t('searching'));
        
        try {
            const results = await this.db.zoekHonden(criteria);
            this.hideProgress();
            this.displaySearchResults(results);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    resetSearchForm() {
        document.getElementById('searchNaam').value = '';
        document.getElementById('searchRas').value = '';
        document.getElementById('searchChipnummer').value = '';
        document.getElementById('searchEigenaar').value = '';
        document.getElementById('searchGeslacht').value = '';
        
        const resultsContainer = document.getElementById('searchResultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="mt-3 text-muted">${this.t('enterCriteria')}</p>
                </div>
            `;
        }
        
        this.showSuccess(this.t('resetForm'));
    }
    
    displaySearchResults(results) {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        if (results.length === 0) {
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
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${t('searchResults')} (${results.length} ${t('found')})</h6>
                        <button class="btn btn-sm btn-outline-info" id="exportSearchResultsBtn">
                            <i class="bi bi-download"></i> ${t('exportResults')}
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>${t('name')}</th>
                                    <th>${t('breed')}</th>
                                    <th>${t('chipNumber')}</th>
                                    <th>${t('gender')}</th>
                                    <th>${t('birthDate')}</th>
                                    <th>${t('owner')}</th>
                                    <th>${t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        results.forEach(hond => {
            const genderText = hond.geslacht === 'reuen' ? t('male') : 
                             hond.geslacht === 'teven' ? t('female') : '-';
            
            html += `
                <tr>
                    <td><strong>${hond.naam}</strong></td>
                    <td>${hond.ras || '-'}</td>
                    <td><code>${hond.chipnummer || '-'}</code></td>
                    <td>${genderText}</td>
                    <td>${hond.geboortedatum ? new Date(hond.geboortedatum).toLocaleDateString(this.currentLang) : '-'}</td>
                    <td>${hond.eigenaar || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-dog-btn" data-id="${hond.id}">
                            <i class="bi bi-eye"></i> ${t('view')}
                        </button>
                        <button class="btn btn-sm btn-outline-warning edit-dog-btn" data-id="${hond.id}">
                            <i class="bi bi-pencil"></i> ${t('edit')}
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
        
        document.querySelectorAll('.view-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.view-dog-btn').dataset.id;
                this.viewDogDetails(hondId);
            });
        });
        
        document.querySelectorAll('.edit-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.edit-dog-btn').dataset.id;
                this.editDog(hondId);
            });
        });
        
        const exportBtn = document.getElementById('exportSearchResultsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSearchResults(results);
            });
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
                                        <h6 class="border-bottom pb-2">${t('basicInfo')}</h6>
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
                                                <th>${t('chipNumber')}:</th>
                                                <td><code>${hond.chipnummer || '-'}</code></td>
                                            </tr>
                                            <tr>
                                                <th>${t('gender')}:</th>
                                                <td>${genderText}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('birthDate')}:</th>
                                                <td>${hond.geboortedatum ? new Date(hond.geboortedatum).toLocaleDateString(this.currentLang) : '-'}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">${t('extraInfo')}</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">${t('color')}:</th>
                                                <td>${hond.kleur || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('weight')}:</th>
                                                <td>${hond.gewicht ? hond.gewicht + ' kg' : '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('owner')}:</th>
                                                <td>${hond.eigenaar || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('created')}:</th>
                                                <td>${new Date(hond.createdAt).toLocaleString(this.currentLang)}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('lastUpdated')}:</th>
                                                <td>${new Date(hond.updatedAt).toLocaleString(this.currentLang)}</td>
                                            </tr>
                                        </table>
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
    
    async editDog(hondId) {
        if (!this.auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        try {
            const honden = await this.db.getHonden();
            const hond = honden.find(h => h.id === parseInt(hondId));
            
            if (!hond) {
                this.showError('Hond niet gevonden');
                return;
            }
            
            this.showError('Bewerken functie wordt binnenkort geïmplementeerd');
            
        } catch (error) {
            this.showError(`Fout bij bewerken hond: ${error.message}`);
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
            const filename = `zoekresultaten-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.showSuccess(this.t('exportSearch'));
            
        } catch (error) {
            this.showError(`${this.t('exportFailed')}${error.message}`);
        }
    }
}