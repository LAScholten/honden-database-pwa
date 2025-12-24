/**
 * Litter Management Module
 * EXACTE KOPIE van DogManager met zelfde IDs
 */

class LitterManager extends BaseModule {
    constructor(db = null) {
        super('littermanager', 'Nest Beheer');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = [];
        
        // Gebruik de doorgegeven database
        this.db = db || window.db || window.dogManager?.db;
        
        console.log('LitterManager constructor: Database beschikbaar?', !!this.db);
        
        // EXACTE ZELFDE vertalingen als DogManager
        this.translations = window.dogManager?.translations || {
            nl: {
                newDog: "Nieuwe Hond Toevoegen",
                editDog: "Hond Bewerken",
                dogLitterChoice: "Hond of Nest Toevoegen",
                addNewDog: "Nieuwe Hond",
                addNewLitter: "Nieuw Nest",
                development: "In Ontwikkeling",
                name: "Naam",
                nameRequired: "Naam *",
                pedigreeNumber: "Stamboomnummer *",
                breed: "Ras",
                breedRequired: "Ras *",
                recentBreeds: "Recent gebruikte rassen",
                father: "Vader",
                mother: "Moeder",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                gender: "Geslacht",
                chooseGender: "Selecteer geslacht...",
                male: "Reu",
                female: "Teef",
                hipDysplasia: "Heupdysplasie",
                hipGrades: "Selecteer graad...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Elleboogdysplasie",
                elbowGrades: "Selecteer graad...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Niet bekend)",
                patellaLuxation: "Patella Luxatie",
                patellaGrades: "Selecteer graad...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Ogen",
                eyesFree: "Vrij",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Overig",
                eyesExplanation: "Verklaring overig",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Selecteer status...",
                dandyFreeDNA: "Vrij op DNA",
                dandyFreeParents: "Vrij op ouders",
                dandyCarrier: "Drager",
                dandyAffected: "Lijder",
                thyroid: "Schildklier",
                thyroidNegative: "Tgaa Negatief",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                addPhoto: "Foto toevoegen",
                chooseFile: "Kies bestand",
                noFileChosen: "Geen bestand gekozen",
                remarks: "Opmerkingen",
                requiredFields: "Velden met * zijn verplicht",
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                choose: "Kies...",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd",
                back: "Terug",
                insufficientPermissions: "Onvoldoende rechten",
                insufficientPermissionsText: "U heeft geen toestemming om honden te bewerken. Alleen administrators kunnen deze functie gebruiken.",
                loggedInAs: "U bent ingelogd als:",
                user: "Gebruiker",
                availableFeatures: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewGallery: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                adminOnly: "Alleen administrators mogen honden toevoegen/bewerken",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
                dogUpdated: "Hond succesvol bijgewerkt!",
                dogDeleted: "Hond succesvol verwijderen!",
                addFailed: "Fout bij toevoegen hond: ",
                updateFailed: "Fout bij bijwerken hond: ",
                deleteFailed: "Fout bij verwijderen hond: ",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                photoError: "Fout bij uploaden foto: "
            }
        };
    }
    
    t(key) {
        if (window.dogManager && window.dogManager.t) {
            return window.dogManager.t(key);
        }
        return this.translations[this.currentLang]?.[key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    getFormHTML() {
        const t = this.t.bind(this);
        
        // Recente rassen - EXACT zoals DogManager
        let recentBreedsHTML = '';
        if (this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2">${t('recentBreeds')}:</div>
                <div class="d-flex flex-wrap gap-2 mb-3">
            `;
            this.lastBreeds.forEach(breed => {
                recentBreedsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                        ${breed}
                    </button>
                `;
            });
            recentBreedsHTML += `</div>`;
        }
        
        // Formulier - EXACTE ZELFDE IDs als DogManager
        return `
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm back-to-choice-btn">
                    <i class="bi bi-arrow-left me-1"></i> ${t('back')}
                </button>
            </div>
            
            <form id="addDogForm">
                <input type="hidden" id="fatherId" value="">
                <input type="hidden" id="motherId" value="">
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogName" class="form-label">${t('nameRequired')}</label>
                            <input type="text" class="form-control" id="dogName" value="" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                            <input type="text" class="form-control" id="pedigreeNumber" value="" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="breed" class="form-label">${t('breedRequired')}</label>
                            <input type="text" class="form-control" id="breed" value="" required>
                            ${recentBreedsHTML}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="gender" class="form-label">${t('gender')}</label>
                            <select class="form-select" id="gender">
                                <option value="">${t('chooseGender')}</option>
                                <option value="reuen">${t('male')}</option>
                                <option value="teven">${t('female')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="father" class="form-label">${t('father')}</label>
                            <input type="text" class="form-control" id="father" 
                                   value="" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="father"
                                   autocomplete="off">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="mother" class="form-label">${t('mother')}</label>
                            <input type="text" class="form-control" id="mother" 
                                   value="" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="mother"
                                   autocomplete="off">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="birthDate" class="form-label">${t('birthDate')}</label>
                            <input type="date" class="form-control" id="birthDate" value="">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="deathDate" class="form-label">${t('deathDate')}</label>
                            <input type="date" class="form-control" id="deathDate" value="">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="hipDysplasia" class="form-label">${t('hipDysplasia')}</label>
                            <select class="form-select" id="hipDysplasia">
                                <option value="">${t('hipGrades')}</option>
                                <option value="A">${t('hipA')}</option>
                                <option value="B">${t('hipB')}</option>
                                <option value="C">${t('hipC')}</option>
                                <option value="D">${t('hipD')}</option>
                                <option value="E">${t('hipE')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="elbowDysplasia" class="form-label">${t('elbowDysplasia')}</label>
                            <select class="form-select" id="elbowDysplasia">
                                <option value="">${t('elbowGrades')}</option>
                                <option value="0">${t('elbow0')}</option>
                                <option value="1">${t('elbow1')}</option>
                                <option value="2">${t('elbow2')}</option>
                                <option value="3">${t('elbow3')}</option>
                                <option value="NB">${t('elbowNB')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="patellaLuxation" class="form-label">${t('patellaLuxation')}</label>
                            <select class="form-select" id="patellaLuxation">
                                <option value="">${t('patellaGrades')}</option>
                                <option value="0">${t('patella0')}</option>
                                <option value="1">${t('patella1')}</option>
                                <option value="2">${t('patella2')}</option>
                                <option value="3">${t('patella3')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="eyes" class="form-label">${t('eyes')}</label>
                            <select class="form-select" id="eyes">
                                <option value="">${t('choose')}</option>
                                <option value="Vrij">${t('eyesFree')}</option>
                                <option value="Distichiasis">${t('eyesDistichiasis')}</option>
                                <option value="Overig">${t('eyesOther')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="eyesExplanationContainer" style="display: none;">
                            <label for="eyesExplanation" class="form-label">${t('eyesExplanation')}</label>
                            <input type="text" class="form-control" id="eyesExplanation" value="">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dandyWalker" class="form-label">${t('dandyWalker')}</label>
                            <select class="form-select" id="dandyWalker">
                                <option value="">${t('dandyOptions')}</option>
                                <option value="Vrij op DNA">${t('dandyFreeDNA')}</option>
                                <option value="Vrij op ouders">${t('dandyFreeParents')}</option>
                                <option value="Drager">${t('dandyCarrier')}</option>
                                <option value="Lijder">${t('dandyAffected')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="thyroid" class="form-label">${t('thyroid')}</label>
                            <select class="form-select" id="thyroid">
                                <option value="">${t('choose')}</option>
                                <option value="Negatief">${t('thyroidNegative')}</option>
                                <option value="Positief">${t('thyroidPositive')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="thyroidExplanationContainer" style="display: none;">
                            <label for="thyroidExplanation" class="form-label">${t('thyroidExplanation')}</label>
                            <input type="text" class="form-control" id="thyroidExplanation" value="">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="country" class="form-label">${t('country')}</label>
                            <input type="text" class="form-control" id="country" value="">
                        </div>
                        <div class="mb-3">
                            <label for="zipCode" class="form-label">${t('zipCode')}</label>
                            <input type="text" class="form-control" id="zipCode" value="">
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="dogPhoto" class="form-label">${t('addPhoto')}</label>
                    <div class="input-group">
                        <input type="file" class="form-control" id="dogPhoto" accept="image/*">
                        <label class="input-group-text" for="dogPhoto">${t('chooseFile')}</label>
                    </div>
                    <div class="form-text">${t('noFileChosen')}</div>
                </div>
                
                <div class="mb-3">
                    <label for="remarks" class="form-label">${t('remarks')}</label>
                    <textarea class="form-control" id="remarks" rows="3"></textarea>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    ${t('requiredFields')}
                </div>
                
                <div class="text-end">
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        ${t('saveDog')}
                    </button>
                </div>
            </form>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager setupEvents called');
        
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Wacht even om DOM te laten renderen
        setTimeout(() => {
            this.setupFormEvents();
        }, 100);
    }
    
    setupFormEvents() {
        console.log('LitterManager: Setting up form events');
        
        // 1. Save dog button
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            console.log('LitterManager: Found save button');
            saveBtn.addEventListener('click', (e) => {
                console.log('LitterManager: Save button clicked');
                this.saveDog();
            });
        } else {
            console.error('LitterManager: Save button not found!');
        }
        
        // 2. Terug knop
        const backBtn = document.querySelector('.back-to-choice-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('LitterManager: Back button clicked');
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            });
        }
        
        // 3. Recente rassen knoppen - gebruik EVENT DELEGATION
        const form = document.getElementById('addDogForm');
        if (form) {
            form.addEventListener('click', (e) => {
                if (e.target.classList.contains('recent-breed-btn')) {
                    console.log('LitterManager: Recent breed button clicked via delegation');
                    const breed = e.target.getAttribute('data-breed');
                    const breedInput = document.getElementById('breed');
                    if (breedInput) {
                        breedInput.value = breed;
                        console.log('LitterManager: Ras ingevuld:', breed);
                    }
                }
            });
        } else {
            console.error('LitterManager: Form not found!');
        }
        
        // 4. Eyes dropdown handler
        const eyesSelect = document.getElementById('eyes');
        if (eyesSelect) {
            eyesSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('eyesExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                }
            });
        }
        
        // 5. Thyroid dropdown handler
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('thyroidExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Positief' ? 'block' : 'none';
                }
            });
        }
        
        // 6. Setup autocomplete voor ouders
        this.setupParentAutocomplete();
    }
    
    setupParentAutocomplete() {
        console.log('LitterManager: Setting up parent autocomplete');
        
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak nieuwe dropdown containers
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        
        if (!fatherInput || !motherInput) {
            console.error('LitterManager: Parent inputs not found!');
            return;
        }
        
        const fatherInputWrapper = fatherInput.closest('.parent-input-wrapper');
        const motherInputWrapper = motherInput.closest('.parent-input-wrapper');
        
        if (fatherInputWrapper) {
            const fatherDropdown = document.createElement('div');
            fatherDropdown.className = 'autocomplete-dropdown';
            fatherDropdown.id = 'fatherDropdown';
            fatherDropdown.style.display = 'none';
            fatherInputWrapper.appendChild(fatherDropdown);
        }
        
        if (motherInputWrapper) {
            const motherDropdown = document.createElement('div');
            motherDropdown.className = 'autocomplete-dropdown';
            motherDropdown.id = 'motherDropdown';
            motherDropdown.style.display = 'none';
            motherInputWrapper.appendChild(motherDropdown);
        }
        
        console.log('LitterManager: Created dropdowns');
        
        // Event listeners voor vader en moeder velden
        document.querySelectorAll('.parent-input-wrapper input').forEach(input => {
            input.addEventListener('focus', () => {
                this.loadAllDogs();
            });
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'father' ? 'father' : 'mother';
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', (e) => {
                setTimeout(() => {
                    const dropdown = document.getElementById(`${input.id}Dropdown`);
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            });
        });
        
        // Klik buiten dropdown om te verbergen
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input-wrapper')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    showParentAutocomplete(searchTerm, parentType) {
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) return;
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        // Filter honden voor autocomplete
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
            const matchesSearch = dogName.includes(searchTerm);
            
            // Filter op geslacht
            if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
            } else if (parentType === 'mother') {
                return matchesSearch && dog.geslacht === 'teven';
            }
            return matchesSearch;
        }).slice(0, 8);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            html += `
                <div class="autocomplete-item" data-id="${dog.id || ''}" data-name="${dog.naam || ''}" data-pedigree="${dog.stamboomnr || ''}">
                    <div class="dog-name">${dog.naam || 'Onbekend'}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'}
                    </div>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        // Event listeners voor autocomplete items
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                const input = document.getElementById(parentType);
                const idInput = document.getElementById(`${parentType}Id`);
                
                if (input) {
                    input.value = dogName;
                }
                if (idInput) {
                    idInput.value = dogId;
                }
                
                dropdown.style.display = 'none';
            });
        });
    }
    
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                console.log('LitterManager: Loading all dogs for autocomplete...');
                if (this.db && typeof this.db.getHonden === 'function') {
                    this.allDogs = await this.db.getHonden();
                    console.log('LitterManager: Loaded dogs for autocomplete:', this.allDogs.length);
                } else {
                    console.error('LitterManager: Database not available!');
                    this.allDogs = [];
                }
            } catch (error) {
                console.error('LitterManager: Fout bij laden honden voor autocomplete:', error);
                this.allDogs = [];
            }
        }
    }
    
    async saveDog() {
        console.log('LitterManager: saveDog called');
        
        // Valideer eerst of gebruiker admin is
        const isAdmin = auth.isAdmin();
        if (!isAdmin) {
            alert(this.t('adminOnly'));
            return;
        }
        
        // Verzamel alle data - EXACTE ZELFDE IDs als DogManager
        const dogData = {
            naam: document.getElementById('dogName').value.trim(),
            stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
            ras: document.getElementById('breed').value.trim(),
            geslacht: document.getElementById('gender').value,
            vader: document.getElementById('father').value.trim(),
            vaderId: document.getElementById('fatherId').value ? parseInt(document.getElementById('fatherId').value) : null,
            moeder: document.getElementById('mother').value.trim(),
            moederId: document.getElementById('motherId').value ? parseInt(document.getElementById('motherId').value) : null,
            geboortedatum: document.getElementById('birthDate').value,
            overlijdensdatum: document.getElementById('deathDate').value,
            heupdysplasie: document.getElementById('hipDysplasia').value,
            elleboogdysplasie: document.getElementById('elbowDysplasia').value,
            patella: document.getElementById('patellaLuxation').value,
            ogen: document.getElementById('eyes').value,
            ogenVerklaring: document.getElementById('eyesExplanation')?.value.trim() || '',
            dandyWalker: document.getElementById('dandyWalker').value,
            schildklier: document.getElementById('thyroid').value,
            schildklierVerklaring: document.getElementById('thyroidExplanation')?.value.trim() || '',
            land: document.getElementById('country').value.trim(),
            postcode: document.getElementById('zipCode').value.trim(),
            opmerkingen: document.getElementById('remarks').value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('LitterManager: Form data collected:', dogData);
        
        // Valideer basisvelden
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            alert(this.t('fieldsRequired'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        // Toon voortgang
        this.showProgress(this.t('savingDog'));
        
        try {
            // Sla hond op in database
            if (!this.db || typeof this.db.voegHondToe !== 'function') {
                throw new Error('Database method voegHondToe niet beschikbaar');
            }
            
            console.log('LitterManager: Saving to database...');
            const savedDog = await this.db.voegHondToe(dogData);
            console.log('LitterManager: Dog saved:', savedDog);
            
            this.hideProgress();
            alert(this.t('dogAdded'));
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput.files.length > 0) {
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
            // Reset formulier en ga terug
            setTimeout(() => {
                this.resetForm();
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('LitterManager: Fout bij opslaan:', error);
            alert(this.t('addFailed') + error.message);
        }
    }
    
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        
        const breedStr = breed.trim();
        const index = this.lastBreeds.indexOf(breedStr);
        
        if (index > -1) {
            this.lastBreeds.splice(index, 1);
        }
        
        this.lastBreeds.unshift(breedStr);
        
        if (this.lastBreeds.length > 5) {
            this.lastBreeds = this.lastBreeds.slice(0, 5);
        }
        
        localStorage.setItem('lastBreeds', JSON.stringify(this.lastBreeds));
    }
    
    async uploadPhoto(pedigreeNumber, file) {
        try {
            const reader = new FileReader();
            
            return new Promise((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        const photoData = {
                            stamboomnr: pedigreeNumber,
                            data: e.target.result,
                            filename: file.name,
                            size: file.size,
                            type: file.type,
                            uploadedAt: new Date().toISOString()
                        };
                        
                        if (this.db && typeof this.db.voegFotoToe === 'function') {
                            await this.db.voegFotoToe(photoData);
                            alert(this.t('photoAdded'));
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                };
                
                reader.onerror = () => {
                    reject(new Error('Fout bij lezen bestand'));
                };
                
                reader.readAsDataURL(file);
            });
        } catch (error) {
            alert(this.t('photoError') + error.message);
        }
    }
    
    resetForm() {
        const form = document.getElementById('addDogForm');
        if (form) {
            form.reset();
            document.getElementById('fatherId').value = '';
            document.getElementById('motherId').value = '';
            document.getElementById('eyesExplanationContainer').style.display = 'none';
            document.getElementById('thyroidExplanationContainer').style.display = 'none';
            document.getElementById('dogName').focus();
        }
    }
    
    // Helper methods
    showError(message) {
        alert(message);
    }
    
    showSuccess(message) {
        alert(message);
    }
    
    showProgress(message) {
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${message}`;
            saveBtn.disabled = true;
        }
    }
    
    hideProgress() {
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.innerHTML = this.t('saveDog');
            saveBtn.disabled = false;
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}