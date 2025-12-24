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
        // Gebruik DogManager's vertalingen als beschikbaar
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
                
                <!-- DogManager formulier -->
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
                .litter-container .form-label {
                    margin-bottom: 0.5rem;
                }
                
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
                
                .saved-dog-card .dog-info {
                    font-size: 0.85em;
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
                    <div class="col-md-6">
                        <!-- Reserve kolom voor toekomstige velden -->
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
        console.log('LitterManager setupEvents called');
        
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Wacht tot DOM volledig is geladen
        setTimeout(() => {
            this.setupFormEvents();
        }, 100);
    }
    
    setupFormEvents() {
        console.log('Setting up LitterManager form events...');
        
        // Setup voor geboortedatum formatting
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput) {
            birthDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                // Automatisch / toevoegen
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
        
        // Setup events voor DogManager formulier
        this.setupDogFormEvents();
        
        // Update saved dogs list
        this.updateSavedDogsList();
    }
    
    setupDogFormEvents() {
        console.log('Setting up dog form events in LitterManager...');
        
        // Save dog button
        const saveDogBtn = document.getElementById('saveDogBtn');
        if (saveDogBtn) {
            saveDogBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Save dog button clicked in LitterManager');
                this.saveDog();
            });
        }
        
        // Add another dog button
        const addAnotherDogBtn = document.getElementById('addAnotherDogBtn');
        if (addAnotherDogBtn) {
            addAnotherDogBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetDogForm();
            });
        }
        
        // Finish litter button
        const finishLitterBtn = document.getElementById('finishLitterBtn');
        if (finishLitterBtn) {
            finishLitterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.finishLitter();
            });
        }
        
        // Recente rassen knoppen
        document.querySelectorAll('.recent-breed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
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
                console.error('Fout bij laden honden voor autocomplete:', error);
            }
        }
    }
    
    setupParentAutocomplete() {
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak nieuwe dropdown containers
        const motherInputWrapper = document.querySelector('#motherDog')?.closest('.parent-input-wrapper');
        const fatherInputWrapper = document.querySelector('#fatherDog')?.closest('.parent-input-wrapper');
        
        if (!motherInputWrapper || !fatherInputWrapper) {
            console.log('Parent input wrappers not found');
            return;
        }
        
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
    
    async saveDog() {
        console.log('saveDog method called in LitterManager');
        
        try {
            // Valideer verplichte velden van nest
            const motherDog = document.getElementById('motherDog').value.trim();
            const fatherDog = document.getElementById('fatherDog').value.trim();
            
            console.log('Mother:', motherDog, 'Father:', fatherDog);
            
            if (!motherDog) {
                alert('Moederhond is verplicht');
                return;
            }
            
            if (!fatherDog) {
                alert('Vaderhond is verplicht');
                return;
            }
            
            // Verzamel alle data - EXACT zoals DogManager doet
            const dogData = {
                naam: document.getElementById('dogName').value.trim(),
                stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
                ras: document.getElementById('breed').value.trim(),
                geslacht: document.getElementById('gender').value,
                vader: fatherDog,
                vaderId: document.getElementById('fatherId').value ? parseInt(document.getElementById('fatherId').value) : null,
                moeder: motherDog,
                moederId: document.getElementById('motherId').value ? parseInt(document.getElementById('motherId').value) : null,
                geboortedatum: this.formatDateForStorage(document.getElementById('birthDate').value.trim()),
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
            
            console.log('Dog data collected:', dogData);
            
            // Valideer basisvelden - net zoals DogManager doet
            if (!dogData.naam || !dogData.stamboomnr || !dogData.ras || !dogData.geslacht) {
                const missingFields = [];
                if (!dogData.naam) missingFields.push('Naam');
                if (!dogData.stamboomnr) missingFields.push('Stamboomnummer');
                if (!dogData.ras) missingFields.push('Ras');
                if (!dogData.geslacht) missingFields.push('Geslacht');
                
                alert(`De volgende velden zijn verplicht: ${missingFields.join(', ')}`);
                return;
            }
            
            // Voeg ras toe aan recente rassen
            this.addToLastBreeds(dogData.ras);
            
            // Sla hond op in database - net zoals DogManager
            let savedDog;
            if (this.db && typeof this.db.voegHondToe === 'function') {
                savedDog = await this.db.voegHondToe(dogData);
                console.log('Dog saved to database:', savedDog);
            } else if (window.db && typeof window.db.voegHondToe === 'function') {
                savedDog = await window.db.voegHondToe(dogData);
                console.log('Dog saved to database:', savedDog);
            } else {
                throw new Error('Database method voegHondToe niet beschikbaar');
            }
            
            // Voeg toe aan lijst van opgeslagen honden
            this.savedDogs.push({
                ...savedDog,
                displayIndex: this.savedDogs.length + 1
            });
            
            console.log('Saved dogs list:', this.savedDogs);
            
            alert('Hond succesvol opgeslagen!');
            
            // Update lijst met opgeslagen honden
            this.updateSavedDogsList();
            
            // Reset alleen hond formulier, ouders blijven staan
            this.resetDogForm();
            
            // Toon sectie met opgeslagen honden
            const savedDogsSection = document.getElementById('savedDogsSection');
            if (savedDogsSection) {
                savedDogsSection.style.display = 'block';
            }
            
            // Focus op naam veld
            const dogNameInput = document.getElementById('dogName');
            if (dogNameInput) {
                dogNameInput.focus();
            }
            
        } catch (error) {
            console.error('Error in saveDog:', error);
            alert('Fout bij opslaan: ' + error.message);
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
    
    resetDogForm() {
        // Reset alleen hond velden, ouders blijven staan
        const dogName = document.getElementById('dogName');
        const pedigreeNumber = document.getElementById('pedigreeNumber');
        const breed = document.getElementById('breed');
        const gender = document.getElementById('gender');
        const deathDate = document.getElementById('deathDate');
        const hipDysplasia = document.getElementById('hipDysplasia');
        const elbowDysplasia = document.getElementById('elbowDysplasia');
        const patellaLuxation = document.getElementById('patellaLuxation');
        const eyes = document.getElementById('eyes');
        const eyesExplanation = document.getElementById('eyesExplanation');
        const dandyWalker = document.getElementById('dandyWalker');
        const thyroid = document.getElementById('thyroid');
        const thyroidExplanation = document.getElementById('thyroidExplanation');
        const country = document.getElementById('country');
        const zipCode = document.getElementById('zipCode');
        const dogPhoto = document.getElementById('dogPhoto');
        const remarks = document.getElementById('remarks');
        
        if (dogName) dogName.value = '';
        if (pedigreeNumber) pedigreeNumber.value = '';
        if (breed) breed.value = '';
        if (gender) gender.value = '';
        if (deathDate) deathDate.value = '';
        if (hipDysplasia) hipDysplasia.value = '';
        if (elbowDysplasia) elbowDysplasia.value = '';
        if (patellaLuxation) patellaLuxation.value = '';
        if (eyes) eyes.value = '';
        if (eyesExplanation) eyesExplanation.value = '';
        if (dandyWalker) dandyWalker.value = '';
        if (thyroid) thyroid.value = '';
        if (thyroidExplanation) thyroidExplanation.value = '';
        if (country) country.value = '';
        if (zipCode) zipCode.value = '';
        if (dogPhoto) dogPhoto.value = '';
        if (remarks) remarks.value = '';
        
        // Verberg uitleg velden
        const eyesExplanationContainer = document.getElementById('eyesExplanationContainer');
        const thyroidExplanationContainer = document.getElementById('thyroidExplanationContainer');
        if (eyesExplanationContainer) eyesExplanationContainer.style.display = 'none';
        if (thyroidExplanationContainer) thyroidExplanationContainer.style.display = 'none';
        
        // Focus op naam veld
        if (dogName) dogName.focus();
    }
    
    updateSavedDogsList() {
        const savedDogsList = document.getElementById('savedDogsList');
        if (!savedDogsList) {
            console.log('Saved dogs list element not found');
            return;
        }
        
        if (this.savedDogs.length === 0) {
            savedDogsList.innerHTML = '<div class="text-muted small">Nog geen honden toegevoegd</div>';
            return;
        }
        
        let html = '';
        this.savedDogs.forEach((dog, index) => {
            html += `
                <div class="saved-dog-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${dog.displayIndex}. ${dog.naam}</strong>
                            <div class="dog-info">
                                Stamboom: ${dog.stamboomnr} | 
                                Geslacht: ${dog.geslacht === 'reuen' ? 'Reu' : 'Teef'} | 
                                Ras: ${dog.ras || 'Onbekend'}
                            </div>
                        </div>
                        <div>
                            <span class="badge bg-success">Opgeslagen</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        savedDogsList.innerHTML = html;
    }
    
    async finishLitter() {
        console.log('finishLitter called, saved dogs:', this.savedDogs.length);
        try {
            if (this.savedDogs.length === 0) {
                const confirmAdd = confirm("Je hebt nog geen honden toegevoegd. Wil je toch doorgaan?");
                if (!confirmAdd) return;
            }
            
            // Valideer nest gegevens
            const motherDog = document.getElementById('motherDog').value.trim();
            const fatherDog = document.getElementById('fatherDog').value.trim();
            
            if (!motherDog || !fatherDog) {
                alert('Moeder en vader zijn verplicht voor het nest');
                return;
            }
            
            // Toon samenvatding
            const summary = `Nest succesvol afgerond!\n
Moeder: ${motherDog}\n
Vader: ${fatherDog}\n
Geboortedatum: ${document.getElementById('birthDate').value || 'Niet ingevuld'}\n
Aantal honden: ${this.savedDogs.length}\n
Kennel: ${document.getElementById('kennelName').value || 'Geen'}`;
            
            alert(summary);
            
            // Reset alle velden
            this.savedDogs = [];
            document.getElementById('motherDog').value = '';
            document.getElementById('fatherDog').value = '';
            document.getElementById('motherId').value = '';
            document.getElementById('fatherId').value = '';
            document.getElementById('kennelName').value = '';
            document.getElementById('birthDate').value = '';
            this.resetDogForm();
            this.updateSavedDogsList();
            
            const savedDogsSection = document.getElementById('savedDogsSection');
            if (savedDogsSection) {
                savedDogsSection.style.display = 'none';
            }
            
            // Wacht even en ga terug naar keuze scherm
            setTimeout(() => {
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            }, 1500);
            
        } catch (error) {
            console.error('Error in finishLitter:', error);
            alert('Fout bij afronden: ' + error.message);
        }
    }
    
    formatDateForStorage(dateString) {
        if (!dateString) return '';
        
        // Converteer DD/MM/YYYY naar YYYY-MM-DD
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateString;
    }
    
    showProgress(message) {
        // Implementeer progress indicator zoals DogManager
        console.log('Progress:', message);
    }
    
    hideProgress() {
        // Implementeer hide progress zoals DogManager
        console.log('Progress hidden');
    }
    
    showSuccess(message) {
        alert(message);
    }
    
    showError(message) {
        alert(message);
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}