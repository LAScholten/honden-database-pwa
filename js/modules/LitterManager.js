/**
 * Litter Management Module
 * Beheert toevoegen en bewerken van nesten
 */

class LitterManager extends BaseModule {
    constructor() {
        super('littermanager', 'Nest Beheer');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.savedDogs = [];
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
    }
    
    t(key) {
        if (window.dogManager && window.dogManager.t) {
            return window.dogManager.t(key);
        }
        return key;
    }
    
    getFormHTML() {
        return `
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm back-to-choice-btn">
                    <i class="bi bi-arrow-left me-1"></i> Terug
                </button>
            </div>
            
            <div id="litterFormContainer" class="litter-container">
                <h5 class="mb-3"><i class="bi bi-people"></i> Nest Toevoegen</h5>
                
                <!-- Moeder & Vader -->
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="motherDog" class="form-label">Moederhond *</label>
                            <input type="text" class="form-control" id="motherDog" 
                                   placeholder="Zoek moeder..."
                                   autocomplete="off" required>
                            <input type="hidden" id="motherId">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="fatherDog" class="form-label">Vaderhond *</label>
                            <input type="text" class="form-control" id="fatherDog" 
                                   placeholder="Zoek vader..."
                                   autocomplete="off" required>
                            <input type="hidden" id="fatherId">
                        </div>
                    </div>
                </div>
                
                <!-- Kennelnaam & Geboortedatum -->
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="kennelName" class="form-label">Kennelnaam</label>
                            <input type="text" class="form-control" id="kennelName" placeholder="Kennel naam">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="birthDate" class="form-label">Geboortedatum</label>
                            <input type="text" class="form-control" id="birthDate" 
                                   placeholder="DD/MM/JJJJ" 
                                   maxlength="10">
                        </div>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <!-- Hond Toevoegen Formulier -->
                <h6 class="mb-3"><i class="bi bi-heart"></i> Hond Toevoegen</h6>
                <div id="dogFormInLitter">
                    ${this.getDogFormHTML()}
                </div>
                
                <!-- Opgeslagen honden -->
                <div id="savedDogsSection" style="${this.savedDogs.length > 0 ? '' : 'display: none;'}">
                    <hr class="my-4">
                    <h6 class="mb-3"><i class="bi bi-list-ul"></i> Opgeslagen Honden</h6>
                    <div id="savedDogsList" class="mb-3"></div>
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
                    width: 100%;
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
                
                .saved-dog-card {
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    padding: 12px;
                    margin-bottom: 8px;
                }
            </style>
        `;
    }
    
    getDogFormHTML(dogData = null) {
        const data = dogData || {};
        
        // Genereer recente rassen opties
        let recentBreedsHTML = '';
        if (this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2">Recent gebruikte rassen:</div>
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
        
        return `
            <form id="addDogForm">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogName" class="form-label">Naam *</label>
                            <input type="text" class="form-control" id="dogName" value="${data.naam || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="pedigreeNumber" class="form-label">Stamboomnummer *</label>
                            <input type="text" class="form-control" id="pedigreeNumber" value="${data.stamboomnr || ''}" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="breed" class="form-label">Ras *</label>
                            <input type="text" class="form-control" id="breed" value="${data.ras || ''}" required>
                            ${recentBreedsHTML}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="gender" class="form-label">Reu/Teef *</label>
                            <select class="form-select" id="gender" required>
                                <option value="">Selecteer geslacht...</option>
                                <option value="reuen" ${data.geslacht === 'reuen' ? 'selected' : ''}>Reu</option>
                                <option value="teven" ${data.geslacht === 'teven' ? 'selected' : ''}>Teef</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="deathDate" class="form-label">Overlijdensdatum</label>
                            <input type="date" class="form-control" id="deathDate" value="${data.overlijdensdatum || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="hipDysplasia" class="form-label">Heupdysplasie</label>
                            <select class="form-select" id="hipDysplasia">
                                <option value="">Selecteer graad...</option>
                                <option value="A" ${data.heupdysplasie === 'A' ? 'selected' : ''}>A</option>
                                <option value="B" ${data.heupdysplasie === 'B' ? 'selected' : ''}>B</option>
                                <option value="C" ${data.heupdysplasie === 'C' ? 'selected' : ''}>C</option>
                                <option value="D" ${data.heupdysplasie === 'D' ? 'selected' : ''}>D</option>
                                <option value="E" ${data.heupdysplasie === 'E' ? 'selected' : ''}>E</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="elbowDysplasia" class="form-label">Elleboogdysplasie</label>
                            <select class="form-select" id="elbowDysplasia">
                                <option value="">Selecteer graad...</option>
                                <option value="0" ${data.elleboogdysplasie === '0' ? 'selected' : ''}>0</option>
                                <option value="1" ${data.elleboogdysplasie === '1' ? 'selected' : ''}>1</option>
                                <option value="2" ${data.elleboogdysplasie === '2' ? 'selected' : ''}>2</option>
                                <option value="3" ${data.elleboogdysplasie === '3' ? 'selected' : ''}>3</option>
                                <option value="NB" ${data.elleboogdysplasie === 'NB' ? 'selected' : ''}>NB (Niet bekend)</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="patellaLuxation" class="form-label">Patella Luxatie</label>
                            <select class="form-select" id="patellaLuxation">
                                <option value="">Selecteer graad...</option>
                                <option value="0" ${data.patella === '0' ? 'selected' : ''}>0</option>
                                <option value="1" ${data.patella === '1' ? 'selected' : ''}>1</option>
                                <option value="2" ${data.patella === '2' ? 'selected' : ''}>2</option>
                                <option value="3" ${data.patella === '3' ? 'selected' : ''}>3</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="eyes" class="form-label">Ogen</label>
                            <select class="form-select" id="eyes">
                                <option value="">Kies...</option>
                                <option value="Vrij" ${data.ogen === 'Vrij' ? 'selected' : ''}>Vrij</option>
                                <option value="Distichiasis" ${data.ogen === 'Distichiasis' ? 'selected' : ''}>Distichiasis</option>
                                <option value="Overig" ${data.ogen === 'Overig' ? 'selected' : ''}>Overig</option>
                            </select>
                        </div>
                        <div class="mb-3" id="eyesExplanationContainer" style="${data.ogen === 'Overig' ? '' : 'display: none;'}">
                            <label for="eyesExplanation" class="form-label">Verklaring overig</label>
                            <input type="text" class="form-control" id="eyesExplanation" value="${data.ogenVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dandyWalker" class="form-label">Dandy Walker Malformation</label>
                            <select class="form-select" id="dandyWalker">
                                <option value="">Selecteer status...</option>
                                <option value="Vrij op DNA" ${data.dandyWalker === 'Vrij op DNA' ? 'selected' : ''}>Vrij op DNA</option>
                                <option value="Vrij op ouders" ${data.dandyWalker === 'Vrij op ouders' ? 'selected' : ''}>Vrij op ouders</option>
                                <option value="Drager" ${data.dandyWalker === 'Drager' ? 'selected' : ''}>Drager</option>
                                <option value="Lijder" ${data.dandyWalker === 'Lijder' ? 'selected' : ''}>Lijder</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="thyroid" class="form-label">Schildklier</label>
                            <select class="form-select" id="thyroid">
                                <option value="">Kies...</option>
                                <option value="Negatief" ${data.schildklier === 'Negatief' ? 'selected' : ''}>Tgaa Negatief</option>
                                <option value="Positief" ${data.schildklier === 'Positief' ? 'selected' : ''}>Tgaa Positief</option>
                            </select>
                        </div>
                        <div class="mb-3" id="thyroidExplanationContainer" style="${data.schildklier === 'Positief' ? '' : 'display: none;'}">
                            <label for="thyroidExplanation" class="form-label">Toelichting schildklier</label>
                            <input type="text" class="form-control" id="thyroidExplanation" value="${data.schildklierVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="country" class="form-label">Land</label>
                            <input type="text" class="form-control" id="country" value="${data.land || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="zipCode" class="form-label">Postcode</label>
                            <input type="text" class="form-control" id="zipCode" value="${data.postcode || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="dogPhoto" class="form-label">Foto toevoegen</label>
                    <div class="input-group">
                        <input type="file" class="form-control" id="dogPhoto" accept="image/*">
                        <label class="input-group-text" for="dogPhoto">Kies bestand</label>
                    </div>
                    <div class="form-text">Geen bestand gekozen</div>
                </div>
                
                <div class="mb-3">
                    <label for="remarks" class="form-label">Opmerkingen</label>
                    <textarea class="form-control" id="remarks" rows="3">${data.opmerkingen || ''}</textarea>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    Velden met * zijn verplicht
                </div>
                
                <div class="text-end mb-3">
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        Hond Opslaan
                    </button>
                </div>
            </form>
            
            <!-- Knoppen onderaan -->
            <div class="text-end">
                <button type="button" class="btn btn-success me-2" id="addAnotherDogBtn">
                    <i class="bi bi-plus-circle me-1"></i> Nog een hond toevoegen
                </button>
                <button type="button" class="btn btn-primary" id="finishLitterBtn">
                    <i class="bi bi-check-circle me-1"></i> Nest Afronden
                </button>
            </div>
        `;
    }
    
    setupEvents() {
        // Wacht tot de DOM geladen is
        setTimeout(() => {
            this.initializeForm();
        }, 100);
    }
    
    initializeForm() {
        console.log('Initializing LitterManager form...');
        
        // Setup geboortedatum formatting
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput) {
            birthDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2 && value.length < 4) {
                    value = value.substring(0, 2) + '/' + value.substring(2);
                } else if (value.length >= 4 && value.length < 8) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
                }
                e.target.value = value;
            });
        }
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
        
        // Setup form events
        this.setupFormEvents();
        
        // Update saved dogs list
        this.updateSavedDogsList();
    }
    
    setupFormEvents() {
        console.log('Setting up form events...');
        
        // Save dog button
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            console.log('Found save dog button');
            saveBtn.addEventListener('click', () => {
                console.log('Save button clicked');
                this.saveDog();
            });
        } else {
            console.error('Save dog button not found!');
        }
        
        // Add another dog button
        const addAnotherBtn = document.getElementById('addAnotherDogBtn');
        if (addAnotherBtn) {
            addAnotherBtn.addEventListener('click', () => {
                this.resetDogForm();
            });
        }
        
        // Finish litter button
        const finishBtn = document.getElementById('finishLitterBtn');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                this.finishLitter();
            });
        }
        
        // Recent breed buttons
        document.querySelectorAll('.recent-breed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) {
                    breedInput.value = breed;
                }
            });
        });
        
        // Eyes dropdown
        const eyesSelect = document.getElementById('eyes');
        if (eyesSelect) {
            eyesSelect.addEventListener('change', (e) => {
                const container = document.getElementById('eyesExplanationContainer');
                if (container) {
                    container.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                }
            });
        }
        
        // Thyroid dropdown
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const container = document.getElementById('thyroidExplanationContainer');
                if (container) {
                    container.style.display = e.target.value === 'Positief' ? 'block' : 'none';
                }
            });
        }
    }
    
    setupParentAutocomplete() {
        // Maak dropdowns aan
        const motherInput = document.getElementById('motherDog');
        const fatherInput = document.getElementById('fatherDog');
        
        if (!motherInput || !fatherInput) return;
        
        const motherWrapper = motherInput.parentElement;
        const fatherWrapper = fatherInput.parentElement;
        
        // Verwijder bestaande dropdowns
        const existingMotherDropdown = motherWrapper.querySelector('.autocomplete-dropdown');
        const existingFatherDropdown = fatherWrapper.querySelector('.autocomplete-dropdown');
        if (existingMotherDropdown) existingMotherDropdown.remove();
        if (existingFatherDropdown) existingFatherDropdown.remove();
        
        // Maak nieuwe dropdowns
        const motherDropdown = document.createElement('div');
        motherDropdown.className = 'autocomplete-dropdown';
        motherDropdown.id = 'motherDropdown';
        motherDropdown.style.display = 'none';
        motherWrapper.appendChild(motherDropdown);
        
        const fatherDropdown = document.createElement('div');
        fatherDropdown.className = 'autocomplete-dropdown';
        fatherDropdown.id = 'fatherDropdown';
        fatherDropdown.style.display = 'none';
        fatherWrapper.appendChild(fatherDropdown);
        
        // Event listeners
        [motherInput, fatherInput].forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'motherDog' ? 'mother' : 'father';
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    const dropdown = document.getElementById(`${input.id}Dropdown`);
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            });
        });
    }
    
    async showParentAutocomplete(searchTerm, parentType) {
        await this.loadAllDogs();
        
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) return;
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        const filtered = this.allDogs.filter(dog => {
            const nameMatch = dog.naam.toLowerCase().includes(searchTerm);
            const genderMatch = parentType === 'mother' ? dog.geslacht === 'teven' : dog.geslacht === 'reuen';
            return nameMatch && genderMatch;
        }).slice(0, 8);
        
        if (filtered.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        dropdown.innerHTML = filtered.map(dog => `
            <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}">
                <div class="dog-name">${dog.naam}</div>
                <div class="dog-info">${dog.ras || ''} | ${dog.stamboomnr || ''}</div>
            </div>
        `).join('');
        
        dropdown.style.display = 'block';
        
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
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
    
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                if (this.db && typeof this.db.getHonden === 'function') {
                    this.allDogs = await this.db.getHonden();
                } else if (window.db && typeof window.db.getHonden === 'function') {
                    this.allDogs = await window.db.getHonden();
                }
                this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            } catch (error) {
                console.error('Fout bij laden honden:', error);
            }
        }
    }
    
    async saveDog() {
        console.log('Saving dog...');
        
        // Verzamel data
        const motherDog = document.getElementById('motherDog').value.trim();
        const fatherDog = document.getElementById('fatherDog').value.trim();
        const nestBirthDate = document.getElementById('birthDate').value.trim();
        
        if (!motherDog) {
            alert('Moederhond is verplicht');
            return;
        }
        
        if (!fatherDog) {
            alert('Vaderhond is verplicht');
            return;
        }
        
        const dogData = {
            naam: document.getElementById('dogName').value.trim(),
            stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
            ras: document.getElementById('breed').value.trim(),
            geslacht: document.getElementById('gender').value,
            vader: fatherDog,
            vaderId: document.getElementById('fatherId').value ? parseInt(document.getElementById('fatherId').value) : null,
            moeder: motherDog,
            moederId: document.getElementById('motherId').value ? parseInt(document.getElementById('motherId').value) : null,
            geboortedatum: this.formatDateForStorage(nestBirthDate),
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
            kennelnaam: document.getElementById('kennelName').value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('Dog data:', dogData);
        
        // Valideer
        if (!dogData.naam) {
            alert('Naam is verplicht');
            return;
        }
        
        if (!dogData.stamboomnr) {
            alert('Stamboomnummer is verplicht');
            return;
        }
        
        if (!dogData.ras) {
            alert('Ras is verplicht');
            return;
        }
        
        if (!dogData.geslacht) {
            alert('Geslacht is verplicht');
            return;
        }
        
        try {
            // Voeg ras toe aan recente rassen
            this.addToLastBreeds(dogData.ras);
            
            // Sla op in database
            let savedDog;
            if (this.db && typeof this.db.voegHondToe === 'function') {
                savedDog = await this.db.voegHondToe(dogData);
            } else if (window.db && typeof window.db.voegHondToe === 'function') {
                savedDog = await window.db.voegHondToe(dogData);
            } else {
                savedDog = { id: Date.now(), ...dogData }; // Fallback voor test
            }
            
            // Voeg toe aan lijst
            this.savedDogs.push({
                ...savedDog,
                displayIndex: this.savedDogs.length + 1
            });
            
            alert('Hond succesvol opgeslagen!');
            
            // Update UI
            this.updateSavedDogsList();
            this.resetDogForm();
            
            // Toon sectie
            const savedDogsSection = document.getElementById('savedDogsSection');
            if (savedDogsSection) {
                savedDogsSection.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Error saving dog:', error);
            alert('Fout bij opslaan: ' + error.message);
        }
    }
    
    addToLastBreeds(breed) {
        if (!breed) return;
        
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
    
    resetDogForm() {
        // Reset alleen de hond velden
        const fields = [
            'dogName', 'pedigreeNumber', 'breed', 'gender', 'deathDate',
            'hipDysplasia', 'elbowDysplasia', 'patellaLuxation', 'eyes',
            'eyesExplanation', 'dandyWalker', 'thyroid', 'thyroidExplanation',
            'country', 'zipCode', 'remarks'
        ];
        
        fields.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'SELECT') {
                    element.value = '';
                } else {
                    element.value = '';
                }
            }
        });
        
        // Reset file input
        const dogPhoto = document.getElementById('dogPhoto');
        if (dogPhoto) dogPhoto.value = '';
        
        // Verberg uitleg velden
        const eyesContainer = document.getElementById('eyesExplanationContainer');
        const thyroidContainer = document.getElementById('thyroidExplanationContainer');
        if (eyesContainer) eyesContainer.style.display = 'none';
        if (thyroidContainer) thyroidContainer.style.display = 'none';
        
        // Focus op naam
        const dogName = document.getElementById('dogName');
        if (dogName) dogName.focus();
    }
    
    updateSavedDogsList() {
        const list = document.getElementById('savedDogsList');
        if (!list) return;
        
        if (this.savedDogs.length === 0) {
            list.innerHTML = '<div class="text-muted">Nog geen honden toegevoegd</div>';
            return;
        }
        
        list.innerHTML = this.savedDogs.map(dog => `
            <div class="saved-dog-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${dog.displayIndex}. ${dog.naam}</strong>
                        <div class="text-muted small">
                            ${dog.stamboomnr} | ${dog.geslacht === 'reuen' ? 'Reu' : 'Teef'} | ${dog.ras || ''}
                        </div>
                    </div>
                    <span class="badge bg-success">Opgeslagen</span>
                </div>
            </div>
        `).join('');
    }
    
    async finishLitter() {
        if (this.savedDogs.length === 0) {
            const confirm = window.confirm("Je hebt nog geen honden toegevoegd. Wil je toch doorgaan?");
            if (!confirm) return;
        }
        
        const mother = document.getElementById('motherDog').value;
        const father = document.getElementById('fatherDog').value;
        const kennel = document.getElementById('kennelName').value;
        const birthDate = document.getElementById('birthDate').value;
        
        alert(`Nest afgerond!\n\nMoeder: ${mother}\nVader: ${father}\nKennel: ${kennel || 'Geen'}\nGeboortedatum: ${birthDate || 'Niet ingevuld'}\nAantal honden: ${this.savedDogs.length}`);
        
        // Reset alles
        this.savedDogs = [];
        document.getElementById('motherDog').value = '';
        document.getElementById('fatherDog').value = '';
        document.getElementById('motherId').value = '';
        document.getElementById('fatherId').value = '';
        document.getElementById('kennelName').value = '';
        document.getElementById('birthDate').value = '';
        
        this.resetDogForm();
        this.updateSavedDogsList();
        
        const section = document.getElementById('savedDogsSection');
        if (section) section.style.display = 'none';
        
        // Terug naar keuze scherm
        setTimeout(() => {
            if (window.dogManager && window.dogManager.showChoiceScreen) {
                window.dogManager.showChoiceScreen();
            }
        }, 1500);
    }
    
    formatDateForStorage(dateString) {
        if (!dateString) return '';
        
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