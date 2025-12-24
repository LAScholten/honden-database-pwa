/**
 * Litter Management Module
 * Alleen het invulformulier, geen keuzemenu
 */

class LitterManager extends BaseModule {
    constructor() {
        super('littermanager', 'Nest Beheer');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
    }
    
    t(key) {
        if (window.dogManager && window.dogManager.t) {
            return window.dogManager.t(key);
        }
        return key;
    }
    
    getFormHTML() {
        const data = {};
        const t = this.t.bind(this);
        
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
        
        // Alleen het formulier, geen keuzemenu
        return `
            <form id="addDogForm">
                <input type="hidden" id="fatherId" value="${data.vaderId || ''}">
                <input type="hidden" id="motherId" value="${data.moederId || ''}">
                
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
                        <div class="mb-3 parent-input-wrapper">
                            <label for="father" class="form-label">Vader</label>
                            <input type="text" class="form-control" id="father" 
                                   value="${data.vader || ''}" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="father"
                                   autocomplete="off">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="mother" class="form-label">Moeder</label>
                            <input type="text" class="form-control" id="mother" 
                                   value="${data.moeder || ''}" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="mother"
                                   autocomplete="off">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="birthDate" class="form-label">Geboortedatum</label>
                            <input type="date" class="form-control" id="birthDate" value="${data.geboortedatum || ''}">
                        </div>
                    </div>
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
                
                <div class="text-end">
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        Hond Opslaan
                    </button>
                </div>
            </form>
            
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
            </style>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager setupEvents called');
        
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Wacht tot DOM geladen is
        setTimeout(() => {
            this.setupFormEvents();
        }, 100);
    }
    
    setupFormEvents() {
        console.log('Setting up LitterManager form events...');
        
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
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
    }
    
    setupParentAutocomplete() {
        console.log('Setting up parent autocomplete...');
        
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak nieuwe dropdown containers
        const fatherInputWrapper = document.querySelector('#father').closest('.parent-input-wrapper');
        const motherInputWrapper = document.querySelector('#mother').closest('.parent-input-wrapper');
        
        if (!fatherInputWrapper || !motherInputWrapper) {
            console.error('Parent input wrappers not found!');
            return;
        }
        
        const fatherDropdown = document.createElement('div');
        fatherDropdown.className = 'autocomplete-dropdown';
        fatherDropdown.id = 'fatherDropdown';
        fatherDropdown.style.display = 'none';
        fatherInputWrapper.appendChild(fatherDropdown);
        
        const motherDropdown = document.createElement('div');
        motherDropdown.className = 'autocomplete-dropdown';
        motherDropdown.id = 'motherDropdown';
        motherDropdown.style.display = 'none';
        motherInputWrapper.appendChild(motherDropdown);
        
        console.log('Created dropdowns');
        
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
            const dogName = dog.naam.toLowerCase();
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
                console.log('Loading all dogs for autocomplete...');
                if (this.db && typeof this.db.getHonden === 'function') {
                    this.allDogs = await this.db.getHonden();
                } else if (window.db && typeof window.db.getHonden === 'function') {
                    this.allDogs = await window.db.getHonden();
                }
                this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
                console.log('Loaded dogs for autocomplete:', this.allDogs.length);
            } catch (error) {
                console.error('Fout bij laden honden voor autocomplete:', error);
            }
        }
    }
    
    async saveDog() {
        console.log('saveDog method called in LitterManager');
        
        // Valideer eerst of gebruiker admin is
        const isAdmin = auth.isAdmin();
        if (!isAdmin) {
            alert('Alleen administrators mogen honden toevoegen/bewerken');
            return;
        }
        
        // Verzamel alle data
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
        
        console.log('Dog data collected:', dogData);
        
        // Valideer basisvelden
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            alert('Naam, stamboomnummer en ras zijn verplichte velden');
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        try {
            // Sla hond op in database
            let savedDog;
            if (this.db && typeof this.db.voegHondToe === 'function') {
                savedDog = await this.db.voegHondToe(dogData);
            } else if (window.db && typeof window.db.voegHondToe === 'function') {
                savedDog = await window.db.voegHondToe(dogData);
            } else {
                throw new Error('Database method voegHondToe niet beschikbaar');
            }
            
            console.log('Dog saved to database:', savedDog);
            
            alert('Hond succesvol opgeslagen!');
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput.files.length > 0) {
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
            // Reset formulier
            this.resetForm();
            
            // Terug naar keuze scherm (via DogManager)
            setTimeout(() => {
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            }, 1500);
            
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
                        } else if (window.db && typeof window.db.voegFotoToe === 'function') {
                            await window.db.voegFotoToe(photoData);
                        }
                        
                        console.log('Foto toegevoegd');
                        resolve();
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
            console.error('Fout bij uploaden foto:', error);
        }
    }
    
    resetForm() {
        // Reset het formulier
        document.getElementById('dogName').value = '';
        document.getElementById('pedigreeNumber').value = '';
        document.getElementById('breed').value = '';
        document.getElementById('gender').value = '';
        document.getElementById('father').value = '';
        document.getElementById('mother').value = '';
        document.getElementById('fatherId').value = '';
        document.getElementById('motherId').value = '';
        document.getElementById('birthDate').value = '';
        document.getElementById('deathDate').value = '';
        document.getElementById('hipDysplasia').value = '';
        document.getElementById('elbowDysplasia').value = '';
        document.getElementById('patellaLuxation').value = '';
        document.getElementById('eyes').value = '';
        document.getElementById('eyesExplanation').value = '';
        document.getElementById('dandyWalker').value = '';
        document.getElementById('thyroid').value = '';
        document.getElementById('thyroidExplanation').value = '';
        document.getElementById('country').value = '';
        document.getElementById('zipCode').value = '';
        document.getElementById('dogPhoto').value = '';
        document.getElementById('remarks').value = '';
        
        // Verberg uitleg velden
        document.getElementById('eyesExplanationContainer').style.display = 'none';
        document.getElementById('thyroidExplanationContainer').style.display = 'none';
        
        // Focus op naam veld
        document.getElementById('dogName').focus();
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}