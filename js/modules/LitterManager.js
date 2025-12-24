/**
 * LitterManager - Zelfde IDs als DogManager
 */

class LitterManager {
    constructor() {
        console.log('LitterManager aangemaakt');
        this.db = window.db;
        this.allDogs = [];
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.loadAllDogs();
    }
    
    async loadAllDogs() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                this.allDogs = await this.db.getHonden();
                console.log('Honden geladen:', this.allDogs.length);
            }
        } catch (error) {
            console.error('Fout:', error);
        }
    }
    
    getFormHTML() {
        // Recente rassen knoppen
        let recentBreedsHTML = '';
        if (this.lastBreeds.length > 0) {
            recentBreedsHTML = '<div class="d-flex flex-wrap gap-2 mb-3">';
            this.lastBreeds.forEach(breed => {
                recentBreedsHTML += `<button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">${breed}</button>`;
            });
            recentBreedsHTML += '</div>';
        }
        
        return `
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm back-to-choice-btn">
                    <i class="bi bi-arrow-left me-1"></i> Terug
                </button>
            </div>
            
            <form id="addDogForm">
                <input type="hidden" id="fatherId">
                <input type="hidden" id="motherId">
                
                <div class="mb-3 parent-input-wrapper">
                    <label for="father" class="form-label">Vader</label>
                    <input type="text" class="form-control" id="father" placeholder="Typ naam...">
                </div>
                
                <div class="mb-3 parent-input-wrapper">
                    <label for="mother" class="form-label">Moeder</label>
                    <input type="text" class="form-control" id="mother" placeholder="Typ naam...">
                </div>
                
                <div class="mb-3">
                    <label for="dogName" class="form-label">Naam hond *</label>
                    <input type="text" class="form-control" id="dogName">
                </div>
                
                <div class="mb-3">
                    <label for="pedigreeNumber" class="form-label">Stamboomnummer *</label>
                    <input type="text" class="form-control" id="pedigreeNumber">
                </div>
                
                <div class="mb-3">
                    <label for="breed" class="form-label">Ras *</label>
                    <input type="text" class="form-control" id="breed">
                    ${recentBreedsHTML}
                </div>
                
                <button type="button" class="btn btn-primary mt-3" id="saveDogBtn">
                    Opslaan
                </button>
            </form>
        `;
    }
    
    setupEvents() {
        console.log('Events instellen');
        
        // Terug knop
        document.querySelector('.back-to-choice-btn').addEventListener('click', () => {
            if (window.dogManager?.showChoiceScreen) {
                window.dogManager.showChoiceScreen();
            }
        });
        
        // Opslaan knop
        document.getElementById('saveDogBtn').addEventListener('click', async () => {
            await this.saveDog();
        });
        
        // Recente rassen knoppen
        document.querySelectorAll('.recent-breed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const breed = e.target.getAttribute('data-breed');
                document.getElementById('breed').value = breed;
            });
        });
        
        // Autocomplete voor ouders
        this.setupAutocomplete();
    }
    
    setupAutocomplete() {
        ['father', 'mother'].forEach(parentType => {
            const input = document.getElementById(parentType);
            if (input) {
                const wrapper = input.closest('.parent-input-wrapper');
                if (wrapper) {
                    const dropdown = document.createElement('div');
                    dropdown.className = 'autocomplete-dropdown';
                    dropdown.id = `${parentType}Dropdown`;
                    dropdown.style.display = 'none';
                    wrapper.appendChild(dropdown);
                    
                    input.addEventListener('input', (e) => {
                        this.showAutocomplete(e.target.value, parentType);
                    });
                }
            }
        });
    }
    
    showAutocomplete(searchTerm, parentType) {
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown || !searchTerm || searchTerm.length < 2) {
            if (dropdown) dropdown.style.display = 'none';
            return;
        }
        
        const filtered = this.allDogs.filter(dog => {
            if (!dog.naam) return false;
            const matches = dog.naam.toLowerCase().includes(searchTerm.toLowerCase());
            if (parentType === 'father') return matches && dog.geslacht === 'reuen';
            if (parentType === 'mother') return matches && dog.geslacht === 'teven';
            return matches;
        }).slice(0, 5);
        
        if (filtered.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        dropdown.innerHTML = filtered.map(dog => `
            <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}">
                <div class="dog-name">${dog.naam}</div>
                <div class="dog-info">${dog.ras || ''}</div>
            </div>
        `).join('');
        
        dropdown.style.display = 'block';
        
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById(parentType).value = item.getAttribute('data-name');
                document.getElementById(`${parentType}Id`).value = item.getAttribute('data-id');
                dropdown.style.display = 'none';
            });
        });
    }
    
    async saveDog() {
        try {
            const dogData = {
                naam: document.getElementById('dogName').value.trim(),
                stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
                ras: document.getElementById('breed').value.trim(),
                vader: document.getElementById('father').value.trim(),
                vaderId: document.getElementById('fatherId').value || null,
                moeder: document.getElementById('mother').value.trim(),
                moederId: document.getElementById('motherId').value || null,
                geslacht: 'reuen',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
                alert('Vul naam, stamboomnummer en ras in');
                return;
            }
            
            if (!window.auth.isAdmin()) {
                alert('Alleen administrators kunnen honden toevoegen');
                return;
            }
            
            const saveBtn = document.getElementById('saveDogBtn');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Opslaan...';
            
            // Opslaan
            await this.db.voegHondToe(dogData);
            
            // Update recente rassen
            this.addToRecentBreeds(dogData.ras);
            
            // Reset
            document.getElementById('addDogForm').reset();
            document.getElementById('fatherId').value = '';
            document.getElementById('motherId').value = '';
            
            saveBtn.disabled = false;
            saveBtn.textContent = 'Opslaan';
            
            alert('Hond opgeslagen!');
            
        } catch (error) {
            console.error('Fout:', error);
            alert('Fout: ' + error.message);
            const saveBtn = document.getElementById('saveDogBtn');
            saveBtn.disabled = false;
            saveBtn.textContent = 'Opslaan';
        }
    }
    
    addToRecentBreeds(breed) {
        if (!breed) return;
        const breedStr = breed.trim();
        const index = this.lastBreeds.indexOf(breedStr);
        if (index > -1) this.lastBreeds.splice(index, 1);
        this.lastBreeds.unshift(breedStr);
        if (this.lastBreeds.length > 5) this.lastBreeds = this.lastBreeds.slice(0, 5);
        localStorage.setItem('lastBreeds', JSON.stringify(this.lastBreeds));
    }
}

window.LitterManager = LitterManager;