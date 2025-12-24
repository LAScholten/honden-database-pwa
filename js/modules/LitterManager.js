/**
 * Simpele Litter Manager
 * Basis functionaliteit die wel werkt
 */

class LitterManager extends BaseModule {
    constructor(db = null) {
        super('littermanager', 'Nest Beheer');
        this.currentLang = 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = [];
        this.db = db || window.db || window.dogManager?.db;
    }
    
    getFormHTML() {
        return `
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm back-to-choice-btn">
                    <i class="bi bi-arrow-left me-1"></i> Terug
                </button>
            </div>
            
            <form id="litterForm">
                <!-- Verborgen velden voor ouders IDs -->
                <input type="hidden" id="fatherId" value="">
                <input type="hidden" id="motherId" value="">
                
                <!-- Ouders -->
                <div class="card mb-3">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Ouders</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3 parent-input-wrapper">
                                    <label for="father" class="form-label">Vader *</label>
                                    <input type="text" class="form-control" id="father" 
                                           placeholder="Typ naam van vader..."
                                           autocomplete="off">
                                    <small class="text-muted">Selecteer een reu uit de database</small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3 parent-input-wrapper">
                                    <label for="mother" class="form-label">Moeder *</label>
                                    <input type="text" class="form-control" id="mother" 
                                           placeholder="Typ naam van moeder..."
                                           autocomplete="off">
                                    <small class="text-muted">Selecteer een teef uit de database</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Pup gegevens -->
                <div class="card mb-3">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">Pup Gegevens</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="dogName" class="form-label">Naam pup *</label>
                                    <input type="text" class="form-control" id="dogName" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="pedigreeNumber" class="form-label">Stamboomnummer *</label>
                                    <input type="text" class="form-control" id="pedigreeNumber" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="breed" class="form-label">Ras *</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="breed" required>
                                <button type="button" class="btn btn-outline-secondary" id="clearBreedBtn">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                            
                            <!-- Recente rassen knoppen -->
                            <div id="recentBreedsContainer" class="mt-2"></div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="gender" class="form-label">Geslacht *</label>
                            <select class="form-select" id="gender" required>
                                <option value="">Selecteer geslacht...</option>
                                <option value="reuen">Reu</option>
                                <option value="teven">Teef</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Extra gegevens -->
                <div class="card mb-3">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">Extra Informatie</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="birthDate" class="form-label">Geboortedatum</label>
                                    <input type="date" class="form-control" id="birthDate">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="deathDate" class="form-label">Overlijdensdatum</label>
                                    <input type="date" class="form-control" id="deathDate">
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="remarks" class="form-label">Opmerkingen</label>
                            <textarea class="form-control" id="remarks" rows="3"></textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Opslaan knop -->
                <div class="text-center">
                    <button type="button" class="btn btn-primary btn-lg" id="saveLitterBtn">
                        <i class="bi bi-save me-2"></i> Pup Opslaan
                    </button>
                </div>
                
                <!-- Info -->
                <div class="alert alert-info mt-3">
                    <i class="bi bi-info-circle"></i>
                    Velden met * zijn verplicht
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
                    width: calc(100% - 2px);
                    margin-top: 2px;
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
                
                .recent-breed-btn {
                    margin: 2px;
                }
            </style>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager: setupEvents gestart');
        
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Wacht even
        setTimeout(() => {
            this.initializeEvents();
        }, 100);
    }
    
    initializeEvents() {
        console.log('LitterManager: Events initialiseren');
        
        // 1. Terug knop
        const backBtn = document.querySelector('.back-to-choice-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('Terug knop geklikt');
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            });
        }
        
        // 2. Opslaan knop
        const saveBtn = document.getElementById('saveLitterBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Opslaan knop geklikt');
                this.saveDog();
            });
        }
        
        // 3. Ras veld wissen knop
        const clearBreedBtn = document.getElementById('clearBreedBtn');
        if (clearBreedBtn) {
            clearBreedBtn.addEventListener('click', () => {
                document.getElementById('breed').value = '';
            });
        }
        
        // 4. Toon recente rassen
        this.showRecentBreeds();
        
        // 5. Setup autocomplete voor ouders
        this.setupParentAutocomplete();
    }
    
    showRecentBreeds() {
        const container = document.getElementById('recentBreedsContainer');
        if (!container || this.lastBreeds.length === 0) return;
        
        let html = '<div class="form-text mb-2">Recent gebruikte rassen:</div><div class="d-flex flex-wrap">';
        this.lastBreeds.forEach(breed => {
            html += `
                <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                    ${breed}
                </button>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
        
        // Event listeners voor rassen knoppen
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-breed-btn')) {
                const breed = e.target.getAttribute('data-breed');
                document.getElementById('breed').value = breed;
                console.log('Ras geselecteerd:', breed);
            }
        });
    }
    
    setupParentAutocomplete() {
        console.log('LitterManager: Autocomplete instellen');
        
        // Maak dropdowns voor vader en moeder
        ['father', 'mother'].forEach(parentType => {
            const input = document.getElementById(parentType);
            if (input) {
                const wrapper = input.closest('.parent-input-wrapper');
                if (wrapper) {
                    // Verwijder oude dropdown
                    const oldDropdown = wrapper.querySelector('.autocomplete-dropdown');
                    if (oldDropdown) oldDropdown.remove();
                    
                    // Maak nieuwe dropdown
                    const dropdown = document.createElement('div');
                    dropdown.className = 'autocomplete-dropdown';
                    dropdown.id = `${parentType}Dropdown`;
                    dropdown.style.display = 'none';
                    wrapper.appendChild(dropdown);
                    
                    // Event listeners
                    input.addEventListener('input', (e) => {
                        this.handleParentInput(e, parentType);
                    });
                    
                    input.addEventListener('blur', () => {
                        setTimeout(() => {
                            dropdown.style.display = 'none';
                        }, 200);
                    });
                }
            }
        });
    }
    
    handleParentInput(event, parentType) {
        const input = event.target;
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) return;
        
        const searchTerm = input.value.trim().toLowerCase();
        if (searchTerm.length < 2) {
            dropdown.style.display = 'none';
            return;
        }
        
        // Filter honden
        const suggestions = this.allDogs.filter(dog => {
            if (!dog.naam) return false;
            const matches = dog.naam.toLowerCase().includes(searchTerm);
            
            // Filter op geslacht
            if (parentType === 'father') {
                return matches && dog.geslacht === 'reuen';
            } else {
                return matches && dog.geslacht === 'teven';
            }
        }).slice(0, 5);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        // Toon suggesties
        dropdown.innerHTML = suggestions.map(dog => `
            <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}">
                <div class="dog-name">${dog.naam}</div>
                <div class="dog-info">
                    ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'}
                </div>
            </div>
        `).join('');
        
        dropdown.style.display = 'block';
        
        // Event listeners voor items
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                input.value = dogName;
                document.getElementById(`${parentType}Id`).value = dogId;
                dropdown.style.display = 'none';
                console.log(`${parentType} geselecteerd:`, dogName);
            });
        });
    }
    
    async loadAllDogs() {
        if (this.allDogs.length > 0) return;
        
        try {
            console.log('LitterManager: Honden laden voor autocomplete...');
            if (this.db && typeof this.db.getHonden === 'function') {
                this.allDogs = await this.db.getHonden();
                console.log('LitterManager: Aantal honden geladen:', this.allDogs.length);
            } else {
                console.error('LitterManager: Geen database beschikbaar!');
            }
        } catch (error) {
            console.error('LitterManager: Fout bij laden honden:', error);
        }
    }
    
    async saveDog() {
        console.log('LitterManager: Pup opslaan...');
        
        // Controleer admin rechten
        if (!auth.isAdmin()) {
            alert('Alleen administrators kunnen honden toevoegen!');
            return;
        }
        
        // Verzamel data
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
            opmerkingen: document.getElementById('remarks').value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Valideer
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras || !dogData.geslacht) {
            alert('Naam, stamboomnummer, ras en geslacht zijn verplicht!');
            return;
        }
        
        // Toon voortgang
        const saveBtn = document.getElementById('saveLitterBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Opslaan...';
        saveBtn.disabled = true;
        
        try {
            // Sla op
            if (!this.db || typeof this.db.voegHondToe !== 'function') {
                throw new Error('Database niet beschikbaar');
            }
            
            console.log('LitterManager: Data om op te slaan:', dogData);
            const savedDog = await this.db.voegHondToe(dogData);
            console.log('LitterManager: Pup opgeslagen:', savedDog);
            
            // Voeg ras toe aan recente rassen
            this.addToRecentBreeds(dogData.ras);
            
            // Succes
            alert('Pup succesvol opgeslagen!');
            
            // Reset formulier
            this.resetForm();
            
            // Terug naar keuze scherm
            setTimeout(() => {
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            }, 1000);
            
        } catch (error) {
            console.error('LitterManager: Fout bij opslaan:', error);
            alert('Fout bij opslaan: ' + error.message);
        } finally {
            // Herstel button
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    }
    
    addToRecentBreeds(breed) {
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
        this.showRecentBreeds();
    }
    
    resetForm() {
        const form = document.getElementById('litterForm');
        if (form) {
            form.reset();
            document.getElementById('fatherId').value = '';
            document.getElementById('motherId').value = '';
            document.getElementById('dogName').focus();
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
    console.log('LitterManager geladen');
}