/**
 * Litter Manager - Simpel
 */

class LitterManager {
    constructor(db = null) {
        console.log('LitterManager aangemaakt');
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = [];
        this.db = db || window.db;
        
        // Laad honden voor autocomplete
        this.loadDogs();
    }
    
    async loadDogs() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                this.allDogs = await this.db.getHonden();
                console.log('Honden geladen voor autocomplete:', this.allDogs.length);
            }
        } catch (error) {
            console.error('Fout bij laden honden:', error);
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
            <!-- Terug knop -->
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm" id="backBtn">
                    <i class="bi bi-arrow-left me-1"></i> Terug
                </button>
            </div>
            
            <!-- Vader veld -->
            <div class="mb-3 parent-input-wrapper">
                <label for="father" class="form-label">Vader</label>
                <input type="text" class="form-control" id="father" placeholder="Typ naam...">
            </div>
            
            <!-- Moeder veld -->
            <div class="mb-3 parent-input-wrapper">
                <label for="mother" class="form-label">Moeder</label>
                <input type="text" class="form-control" id="mother" placeholder="Typ naam...">
            </div>
            
            <!-- Naam hond -->
            <div class="mb-3">
                <label for="dogName" class="form-label">Naam hond</label>
                <input type="text" class="form-control" id="dogName" placeholder="Naam van de hond">
            </div>
            
            <!-- Stamboomnummer -->
            <div class="mb-3">
                <label for="pedigreeNumber" class="form-label">Stamboomnummer</label>
                <input type="text" class="form-control" id="pedigreeNumber" placeholder="Stamboomnummer">
            </div>
            
            <!-- Ras met recente rassen -->
            <div class="mb-3">
                <label for="breed" class="form-label">Ras</label>
                <input type="text" class="form-control" id="breed" placeholder="Ras">
                ${recentBreedsHTML}
            </div>
            
            <!-- Opslaan knop -->
            <div class="mt-4">
                <button type="button" class="btn btn-primary w-100" id="saveBtn">
                    Opslaan
                </button>
            </div>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager events instellen');
        
        // Terug knop
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('Terug knop geklikt');
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            });
        }
        
        // Opslaan knop
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                console.log('Opslaan knop geklikt');
                this.saveDog();
            });
        }
        
        // Recente rassen knoppen
        setTimeout(() => {
            const breedBtns = document.querySelectorAll('.recent-breed-btn');
            console.log('Aantal ras knoppen:', breedBtns.length);
            
            breedBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const breed = e.target.getAttribute('data-breed');
                    document.getElementById('breed').value = breed;
                    console.log('Ras gekozen:', breed);
                });
            });
        }, 100);
        
        // Autocomplete voor ouders
        this.setupAutocomplete();
    }
    
    setupAutocomplete() {
        console.log('Autocomplete instellen voor ouders');
        
        // Maak dropdown containers
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
                    
                    // Event listener
                    input.addEventListener('input', (e) => {
                        this.showAutocomplete(e.target.value, parentType);
                    });
                    
                    // Verberg dropdown bij blur
                    input.addEventListener('blur', () => {
                        setTimeout(() => {
                            dropdown.style.display = 'none';
                        }, 200);
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
        
        // Filter honden op geslacht en naam
        const filteredDogs = this.allDogs.filter(dog => {
            if (!dog.naam) return false;
            
            const naam = dog.naam.toLowerCase();
            const search = searchTerm.toLowerCase();
            
            // Filter op geslacht
            if (parentType === 'father' && dog.geslacht !== 'reuen') return false;
            if (parentType === 'mother' && dog.geslacht !== 'teven') return false;
            
            return naam.includes(search);
        }).slice(0, 5);
        
        if (filteredDogs.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        // Toon suggesties
        dropdown.innerHTML = filteredDogs.map(dog => `
            <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}">
                <div class="dog-name">${dog.naam}</div>
                <div class="dog-info">${dog.ras || ''} | ${dog.stamboomnr || ''}</div>
            </div>
        `).join('');
        
        dropdown.style.display = 'block';
        
        // Event listeners voor items
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const dogName = item.getAttribute('data-name');
                document.getElementById(parentType).value = dogName;
                dropdown.style.display = 'none';
                console.log(`${parentType} geselecteerd:`, dogName);
            });
        });
    }
    
    async saveDog() {
        console.log('Hond opslaan...');
        
        // Valideer admin
        if (!window.auth || !window.auth.isAdmin()) {
            alert('Alleen administrators kunnen honden toevoegen!');
            return;
        }
        
        const dogData = {
            vader: document.getElementById('father').value,
            moeder: document.getElementById('mother').value,
            naam: document.getElementById('dogName').value,
            stamboomnr: document.getElementById('pedigreeNumber').value,
            ras: document.getElementById('breed').value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Valideer
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            alert('Naam, stamboomnummer en ras zijn verplicht!');
            return;
        }
        
        try {
            // Toon voortgang
            const saveBtn = document.getElementById('saveBtn');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = 'Opslaan...';
            saveBtn.disabled = true;
            
            // Sla op
            if (this.db && typeof this.db.voegHondToe === 'function') {
                const savedDog = await this.db.voegHondToe(dogData);
                console.log('Hond opgeslagen:', savedDog);
                
                // Voeg ras toe aan recente rassen
                this.addToRecentBreeds(dogData.ras);
                
                alert('Hond succesvol opgeslagen!');
                
                // Reset formulier
                document.getElementById('father').value = '';
                document.getElementById('mother').value = '';
                document.getElementById('dogName').value = '';
                document.getElementById('pedigreeNumber').value = '';
                document.getElementById('breed').value = '';
                
                // Terug naar keuze
                setTimeout(() => {
                    if (window.dogManager && window.dogManager.showChoiceScreen) {
                        window.dogManager.showChoiceScreen();
                    }
                }, 1000);
                
            } else {
                throw new Error('Database niet beschikbaar');
            }
            
            // Herstel button
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
            
        } catch (error) {
            console.error('Fout bij opslaan:', error);
            alert('Fout bij opslaan: ' + error.message);
            
            // Herstel button
            const saveBtn = document.getElementById('saveBtn');
            if (saveBtn) {
                saveBtn.innerHTML = 'Opslaan';
                saveBtn.disabled = false;
            }
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
    }
}

// Maak beschikbaar
window.LitterManager = LitterManager;