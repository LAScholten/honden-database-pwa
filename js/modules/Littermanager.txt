/**
 * Litter Management Module
 * Beheert toevoegen en bewerken van nesten
 */

class LitterManager extends BaseModule {
    constructor() {
        super('littermanager', 'Nest Beheer');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.pups = [];
        this.currentPupIndex = 0;
        
        // Gebruik dezelfde vertalingen als DogManager
        // Deze worden overgenomen van de parent context
    }
    
    t(key) {
        // Gebruik DogManager vertalingen als beschikbaar, anders fallback
        if (window.dogManager && window.dogManager.t) {
            return window.dogManager.t(key);
        }
        
        // Fallback vertalingen
        const fallbackTranslations = {
            nl: {
                back: "Terug",
                litterTitle: "Nest Toevoegen",
                motherDog: "Moederhond *",
                fatherDog: "Vaderhond *",
                kennelName: "Kennelnaam",
                birthDate: "Geboortedatum (DD/MM/JJJJ) *",
                healthDataKnown: "Gezondheidsgegevens bekend?",
                yes: "Ja",
                no: "Nee",
                addAnotherPup: "Nog een pup toevoegen",
                finishLitter: "Nest Afronden",
                savedPups: "Opgeslagen Pups",
                motherRequired: "Moederhond is verplicht",
                fatherRequired: "Vaderhond is verplicht",
                birthDateRequired: "Geboortedatum is verplicht",
                invalidDate: "Ongeldige datum. Gebruik formaat DD/MM/JJJJ",
                pupSaved: "Pup succesvol opgeslagen!",
                litterSaved: "Nest succesvol opgeslagen!",
                saveError: "Fout bij opslaan: ",
                motherMustBeFemale: "Moederhond moet een teef zijn",
                fatherMustBeMale: "Vaderhond moet een reu zijn",
                saved: "Opgeslagen"
            },
            en: {
                back: "Back",
                litterTitle: "Add Litter",
                motherDog: "Mother Dog *",
                fatherDog: "Father Dog *",
                kennelName: "Kennel Name",
                birthDate: "Birth Date (DD/MM/YYYY) *",
                healthDataKnown: "Health data known?",
                yes: "Yes",
                no: "No",
                addAnotherPup: "Add Another Pup",
                finishLitter: "Finish Litter",
                savedPups: "Saved Pups",
                motherRequired: "Mother dog is required",
                fatherRequired: "Father dog is required",
                birthDateRequired: "Birth date is required",
                invalidDate: "Invalid date. Use format DD/MM/YYYY",
                pupSaved: "Pup successfully saved!",
                litterSaved: "Litter successfully saved!",
                saveError: "Error saving: ",
                motherMustBeFemale: "Mother dog must be female",
                fatherMustBeMale: "Father dog must be male",
                saved: "Saved"
            },
            de: {
                back: "Zurück",
                litterTitle: "Wurf Hinzufügen",
                motherDog: "Mutterhund *",
                fatherDog: "Vaterhund *",
                kennelName: "Kennelname",
                birthDate: "Geburtsdatum (TT/MM/JJJJ) *",
                healthDataKnown: "Gesundheitsdaten bekannt?",
                yes: "Ja",
                no: "Nein",
                addAnotherPup: "Noch einen Welpen hinzufügen",
                finishLitter: "Wurf Abschließen",
                savedPups: "Gespeicherte Welpen",
                motherRequired: "Mutterhund ist erforderlich",
                fatherRequired: "Vaterhund ist erforderlich",
                birthDateRequired: "Geburtsdatum ist erforderlich",
                invalidDate: "Ungültiges Datum. Verwenden Sie das Format TT/MM/JJJJ",
                pupSaved: "Welpe erfolgreich gespeichert!",
                litterSaved: "Wurf erfolgreich gespeichert!",
                saveError: "Fehler beim Speichern: ",
                motherMustBeFemale: "Mutterhund muss eine Hündin sein",
                fatherMustBeMale: "Vaterhund muss ein Rüde sein",
                saved: "Gespeichert"
            }
        };
        
        return fallbackTranslations[this.currentLang][key] || key;
    }
    
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                // Probeer honden te laden via beschikbare database methodes
                if (this.db && typeof this.db.getHonden === 'function') {
                    this.allDogs = await this.db.getHonden();
                    this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
                } else if (window.db && typeof window.db.getHonden === 'function') {
                    this.allDogs = await window.db.getHonden();
                    this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
                }
            } catch (error) {
                console.error('Fout bij laden honden voor autocomplete:', error);
            }
        }
    }
    
    getFormHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm back-to-choice-btn">
                    <i class="bi bi-arrow-left me-1"></i> ${t('back')}
                </button>
            </div>
            
            <div id="litterFormContainer">
                <h5 class="mb-3"><i class="bi bi-people"></i> ${t('litterTitle')}</h5>
                
                <form id="litterForm">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3 parent-input-wrapper">
                                <label for="motherDog" class="form-label">${t('motherDog')}</label>
                                <input type="text" class="form-control" id="motherDog" 
                                       placeholder="Begin met typen om te zoeken..."
                                       autocomplete="off" required>
                                <input type="hidden" id="motherId">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3 parent-input-wrapper">
                                <label for="fatherDog" class="form-label">${t('fatherDog')}</label>
                                <input type="text" class="form-control" id="fatherDog" 
                                       placeholder="Begin met typen om te zoeken..."
                                       autocomplete="off" required>
                                <input type="hidden" id="fatherId">
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="kennelName" class="form-label">${t('kennelName')}</label>
                                <input type="text" class="form-control" id="kennelName">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="birthDate" class="form-label">${t('birthDate')}</label>
                                <input type="text" class="form-control" id="birthDate" 
                                       placeholder="DD/MM/JJJJ" 
                                       maxlength="10"
                                       required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-12">
                            <label class="form-label">${t('healthDataKnown')}</label>
                            <div class="btn-group w-100" role="group">
                                <input type="radio" class="btn-check" name="healthData" id="healthYes" value="yes" autocomplete="off">
                                <label class="btn btn-outline-success" for="healthYes">
                                    <i class="bi bi-check-circle"></i> ${t('yes')}
                                </label>
                                
                                <input type="radio" class="btn-check" name="healthData" id="healthNo" value="no" autocomplete="off" checked>
                                <label class="btn btn-outline-danger" for="healthNo">
                                    <i class="bi bi-x-circle"></i> ${t('no')}
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-3 text-end">
                        <button type="button" class="btn btn-success" id="startAddingPupsBtn">
                            <i class="bi bi-plus-circle me-1"></i> ${t('addAnotherPup')}
                        </button>
                    </div>
                </form>
                
                <!-- Hier komt het DogManager formulier als pup formulier -->
                <div id="pupFormContainer" style="display: none;">
                    <hr class="my-4">
                    <h6 class="mb-3"><i class="bi bi-heart"></i> Pup Toevoegen</h6>
                    <div id="pupDogForm"></div>
                </div>
                
                <div id="pupsListContainer" style="display: none;">
                    <hr class="my-4">
                    <h6 class="mb-3"><i class="bi bi-list-ul"></i> ${t('savedPups')}</h6>
                    <div id="pupsList" class="mb-3"></div>
                    
                    <div class="text-end">
                        <button type="button" class="btn btn-success me-2" id="addMorePupsBtn">
                            <i class="bi bi-plus-circle me-1"></i> ${t('addAnotherPup')}
                        </button>
                        <button type="button" class="btn btn-primary" id="finishLitterBtn">
                            <i class="bi bi-check-circle me-1"></i> ${t('finishLitter')}
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: calc(100% - 2px);
                }
                
                .autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.85em;
                    color: #666;
                }
                
                .parent-input-wrapper {
                    position: relative;
                }
                
                .saved-pup-card {
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    padding: 12px;
                    margin-bottom: 8px;
                }
                
                .saved-pup-card .pup-info {
                    font-size: 0.9em;
                }
                
                @media (max-width: 768px) {
                    .btn-group.w-100 {
                        flex-wrap: wrap;
                    }
                    
                    .btn-group.w-100 .btn {
                        flex: 1;
                        min-width: 100px;
                    }
                }
            </style>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager setupEvents called');
        
        // Event listeners voor de terug knop
        const backBtn = document.querySelector('.back-to-choice-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                // Zoek de dogManager instance
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            });
        }
        
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Formaat validator voor geboortedatum
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput) {
            birthDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 2 && value.length <= 4) {
                    value = value.substring(0, 2) + '/' + value.substring(2);
                } else if (value.length > 4 && value.length <= 8) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
                }
                
                e.target.value = value;
            });
        }
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
        
        // Event listener voor start toevoegen pups
        const startAddingPupsBtn = document.getElementById('startAddingPupsBtn');
        if (startAddingPupsBtn) {
            startAddingPupsBtn.addEventListener('click', () => {
                this.startAddingPups();
            });
        }
        
        // Event listeners voor pup formulier worden later toegevoegd
    }
    
    setupParentAutocomplete() {
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak nieuwe dropdown containers
        const motherInputWrapper = document.querySelector('#motherDog')?.closest('.parent-input-wrapper');
        const fatherInputWrapper = document.querySelector('#fatherDog')?.closest('.parent-input-wrapper');
        
        if (!motherInputWrapper || !fatherInputWrapper) return;
        
        const motherDropdown = document.createElement('div');
        motherDropdown.className = 'autocomplete-dropdown';
        motherDropdown.id = 'motherDropdown';
        motherDropdown.style.display = 'none';
        motherInputWrapper.appendChild(motherDropdown);
        
        const fatherDropdown = document.createElement('div');
        fatherDropdown.className = 'autocomplete-dropdown';
        fatherDropdown.id = 'fatherDropdown';
        fatherDropdown.style.display = 'none';
        fatherInputWrapper.appendChild(fatherDropdown);
        
        // Event listeners voor vader en moeder velden
        document.querySelectorAll('.parent-input-wrapper input').forEach(input => {
            input.addEventListener('focus', () => {
                this.loadAllDogs();
            });
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'motherDog' ? 'mother' : 'father';
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
        
        // Filter honden voor autocomplete (filter op geslacht)
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam.toLowerCase();
            const matchesSearch = dogName.includes(searchTerm);
            
            // Filter op geslacht
            if (parentType === 'mother') {
                return matchesSearch && dog.geslacht === 'teven';
            } else if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
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
                <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}" data-pedigree="${dog.stamboomnr || ''}">
                    <div class="dog-name">${dog.naam}</div>
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
                const input = document.getElementById(`${parentType}Dog`);
                const idInput = document.getElementById(`${parentType}Id`);
                
                if (input) input.value = dogName;
                if (idInput) idInput.value = dogId;
                
                dropdown.style.display = 'none';
            });
        });
    }
    
    startAddingPups() {
        // Valideer verplichte velden
        const motherDog = document.getElementById('motherDog').value.trim();
        const fatherDog = document.getElementById('fatherDog').value.trim();
        const birthDate = document.getElementById('birthDate').value.trim();
        
        if (!motherDog) {
            alert(this.t('motherRequired'));
            return;
        }
        
        if (!fatherDog) {
            alert(this.t('fatherRequired'));
            return;
        }
        
        if (!birthDate) {
            alert(this.t('birthDateRequired'));
            return;
        }
        
        // Valideer datum formaat
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(birthDate)) {
            alert(this.t('invalidDate'));
            return;
        }
        
        // Reset pups array
        this.pups = [];
        this.currentPupIndex = 0;
        
        // Toon pup formulier
        this.showPupForm();
        
        // Verberg start button en toon pups list container
        const startBtn = document.getElementById('startAddingPupsBtn');
        const pupsListContainer = document.getElementById('pupsListContainer');
        if (startBtn) startBtn.style.display = 'none';
        if (pupsListContainer) pupsListContainer.style.display = 'block';
    }
    
    showPupForm() {
        // Haal DogManager formulier HTML op
        const pupFormContainer = document.getElementById('pupFormContainer');
        const pupDogForm = document.getElementById('pupDogForm');
        
        if (!pupFormContainer || !pupDogForm) return;
        
        // Toon container
        pupFormContainer.style.display = 'block';
        
        // Reset formulier
        pupDogForm.innerHTML = this.getDogFormHTML();
        
        // Scroll naar formulier
        pupFormContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Setup events voor het formulier
        this.setupPupFormEvents();
    }
    
    getDogFormHTML() {
        // Gebruik exact dezelfde velden als DogManager
        const t = this.t;
        const motherDog = document.getElementById('motherDog').value.trim();
        const fatherDog = document.getElementById('fatherDog').value.trim();
        const birthDate = this.formatDateForStorage(document.getElementById('birthDate').value.trim());
        
        // Genereer recente rassen opties
        let recentBreedsHTML = '';
        if (window.dogManager && window.dogManager.lastBreeds && window.dogManager.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2">${t('recentBreeds')}:</div>
                <div class="d-flex flex-wrap gap-2 mb-3">
            `;
            window.dogManager.lastBreeds.forEach(breed => {
                recentBreedsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                        ${breed}
                    </button>
                `;
            });
            recentBreedsHTML += `</div>`;
        }
        
        // Bepaal of gezondheidsgegevens moeten worden getoond
        const healthYes = document.getElementById('healthYes');
        const showHealthData = healthYes && healthYes.checked;
        
        return `
            <form id="addDogForm">
                <input type="hidden" id="fatherId" value="${document.getElementById('fatherId').value || ''}">
                <input type="hidden" id="motherId" value="${document.getElementById('motherId').value || ''}">
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogName" class="form-label">${t('nameRequired')}</label>
                            <input type="text" class="form-control" id="dogName" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                            <input type="text" class="form-control" id="pedigreeNumber" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="breed" class="form-label">${t('breedRequired')}</label>
                            <input type="text" class="form-control" id="breed" required>
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
                        <div class="mb-3">
                            <label for="father" class="form-label">${t('father')}</label>
                            <input type="text" class="form-control" id="father" 
                                   value="${fatherDog}" 
                                   readonly>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="mother" class="form-label">${t('mother')}</label>
                            <input type="text" class="form-control" id="mother" 
                                   value="${motherDog}" 
                                   readonly>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="birthDate" class="form-label">${t('birthDate')}</label>
                            <input type="date" class="form-control" id="birthDate" value="${birthDate}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="deathDate" class="form-label">${t('deathDate')}</label>
                            <input type="date" class="form-control" id="deathDate">
                        </div>
                    </div>
                </div>
                
                ${showHealthData ? this.getHealthDataHTML() : ''}
                
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
                    <button type="button" class="btn btn-secondary me-2" id="cancelPupBtn">
                        ${t('cancel')}
                    </button>
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        ${t('saveDog')}
                    </button>
                </div>
            </form>
        `;
    }
    
    getHealthDataHTML() {
        const t = this.t;
        
        return `
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
                        <input type="text" class="form-control" id="eyesExplanation">
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
                        <input type="text" class="form-control" id="thyroidExplanation">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="country" class="form-label">${t('country')}</label>
                        <input type="text" class="form-control" id="country">
                    </div>
                    <div class="mb-3">
                        <label for="zipCode" class="form-label">${t('zipCode')}</label>
                        <input type="text" class="form-control" id="zipCode">
                    </div>
                </div>
            </div>
        `;
    }
    
    setupPupFormEvents() {
        // Save dog button
        const saveDogBtn = document.getElementById('saveDogBtn');
        if (saveDogBtn) {
            saveDogBtn.addEventListener('click', () => {
                this.savePup();
            });
        }
        
        // Cancel pup button
        const cancelPupBtn = document.getElementById('cancelPupBtn');
        if (cancelPupBtn) {
            cancelPupBtn.addEventListener('click', () => {
                this.cancelPup();
            });
        }
        
        // Add more pups button
        const addMorePupsBtn = document.getElementById('addMorePupsBtn');
        if (addMorePupsBtn) {
            addMorePupsBtn.addEventListener('click', () => {
                this.showPupForm();
            });
        }
        
        // Finish litter button
        const finishLitterBtn = document.getElementById('finishLitterBtn');
        if (finishLitterBtn) {
            finishLitterBtn.addEventListener('click', () => {
                this.finishLitter();
            });
        }
        
        // Recente rassen knoppen
        document.querySelectorAll('.recent-breed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) {
                    breedInput.value = breed;
                }
            });
        });
        
        // Eyes dropdown handler
        const eyesSelect = document.getElementById('eyes');
        if (eyesSelect) {
            eyesSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('eyesExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                }
            });
        }
        
        // Thyroid dropdown handler
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('thyroidExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Positief' ? 'block' : 'none';
                }
            });
        }
    }
    
    async savePup() {
        try {
            // Verzamel alle data zoals in DogManager
            const pupData = {
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
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Voeg gezondheidsgegevens toe als nodig
            const healthYes = document.getElementById('healthYes');
            if (healthYes && healthYes.checked) {
                pupData.heupdysplasie = document.getElementById('hipDysplasia').value;
                pupData.elleboogdysplasie = document.getElementById('elbowDysplasia').value;
                pupData.patella = document.getElementById('patellaLuxation').value;
                pupData.ogen = document.getElementById('eyes').value;
                pupData.ogenVerklaring = document.getElementById('eyesExplanation')?.value.trim() || '';
                pupData.dandyWalker = document.getElementById('dandyWalker').value;
                pupData.schildklier = document.getElementById('thyroid').value;
                pupData.schildklierVerklaring = document.getElementById('thyroidExplanation')?.value.trim() || '';
                pupData.land = document.getElementById('country').value.trim();
                pupData.postcode = document.getElementById('zipCode').value.trim();
                pupData.opmerkingen = document.getElementById('remarks').value.trim();
            }
            
            // Valideer
            if (!pupData.naam || !pupData.stamboomnr || !pupData.ras) {
                alert(this.t('fieldsRequired'));
                return;
            }
            
            // Voeg ras toe aan recente rassen
            if (window.dogManager && window.dogManager.addToLastBreeds) {
                window.dogManager.addToLastBreeds(pupData.ras);
            }
            
            // Sla pup op
            let savedPup;
            if (this.db && typeof this.db.voegHondToe === 'function') {
                savedPup = await this.db.voegHondToe(pupData);
            } else if (window.db && typeof window.db.voegHondToe === 'function') {
                savedPup = await window.db.voegHondToe(pupData);
            } else {
                throw new Error('Database method voegHondToe niet beschikbaar');
            }
            
            // Voeg toe aan lokale lijst
            this.pups.push({
                ...savedPup,
                displayIndex: this.pups.length + 1
            });
            
            alert(this.t('pupSaved'));
            
            // Update lijst met opgeslagen pups
            this.updatePupsList();
            
            // Reset formulier voor volgende pup
            const pupFormContainer = document.getElementById('pupFormContainer');
            if (pupFormContainer) {
                pupFormContainer.style.display = 'none';
            }
            
        } catch (error) {
            alert(`${this.t('saveError')}${error.message}`);
        }
    }
    
    updatePupsList() {
        const pupsList = document.getElementById('pupsList');
        if (!pupsList) return;
        
        if (this.pups.length === 0) {
            pupsList.innerHTML = '<div class="text-muted">Nog geen pups toegevoegd</div>';
            return;
        }
        
        let html = '';
        this.pups.forEach((pup, index) => {
            html += `
                <div class="saved-pup-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${pup.displayIndex}. ${pup.naam}</strong>
                            <div class="pup-info">
                                Stamboom: ${pup.stamboomnr} | 
                                Geslacht: ${pup.geslacht === 'reuen' ? this.t('male') : this.t('female')} | 
                                Ras: ${pup.ras || 'Onbekend'}
                            </div>
                        </div>
                        <div>
                            <span class="badge bg-success">${this.t('saved')}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        pupsList.innerHTML = html;
    }
    
    cancelPup() {
        const pupFormContainer = document.getElementById('pupFormContainer');
        if (pupFormContainer) {
            pupFormContainer.style.display = 'none';
        }
    }
    
    async finishLitter() {
        try {
            if (this.pups.length === 0) {
                const confirmAdd = confirm("Je hebt nog geen pups toegevoegd. Wil je toch doorgaan?");
                if (!confirmAdd) return;
            }
            
            alert(this.t('litterSaved'));
            
            // Ga terug naar keuze scherm
            if (window.dogManager && window.dogManager.showChoiceScreen) {
                window.dogManager.showChoiceScreen();
            }
            
        } catch (error) {
            alert(`${this.t('saveError')}${error.message}`);
        }
    }
    
    formatDateForStorage(dateString) {
        // Converteer DD/MM/YYYY naar YYYY-MM-DD
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateString;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}