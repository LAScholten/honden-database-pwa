/**
 * LitterManager
 */

class LitterManager {
    constructor() {
        console.log('LitterManager aangemaakt');
    }
    
    getFormHTML() {
        return `
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm" id="litterBackBtn">
                    <i class="bi bi-arrow-left me-1"></i> Terug
                </button>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Vader</label>
                <input type="text" class="form-control" id="litterFather" value="">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Moeder</label>
                <input type="text" class="form-control" id="litterMother" value="">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Naam hond *</label>
                <input type="text" class="form-control" id="litterDogName" value="">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Stamboomnummer *</label>
                <input type="text" class="form-control" id="litterPedigreeNumber" value="">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Ras *</label>
                <input type="text" class="form-control" id="litterBreed" value="">
            </div>
            
            <button type="button" class="btn btn-primary mt-3" id="litterSaveBtn">
                Opslaan
            </button>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager events setup');
        
        // Terug knop
        const backBtn = document.getElementById('litterBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('Terug knop geklikt');
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            });
        } else {
            console.error('Terug knop niet gevonden');
        }
        
        // Opslaan knop
        const saveBtn = document.getElementById('litterSaveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                console.log('Opslaan knop geklikt');
                this.saveDog();
            });
        } else {
            console.error('Opslaan knop niet gevonden');
        }
        
        console.log('Events ingesteld voor:', {
            backBtn: !!backBtn,
            saveBtn: !!saveBtn
        });
    }
    
    saveDog() {
        console.log('saveDog aangeroepen');
        
        const name = document.getElementById('litterDogName').value;
        const pedigree = document.getElementById('litterPedigreeNumber').value;
        const breed = document.getElementById('litterBreed').value;
        
        console.log('Veld waarden:', {
            name: name,
            pedigree: pedigree,
            breed: breed
        });
        
        if (!name || !pedigree || !breed) {
            alert('Vul naam, stamboomnummer en ras in');
            return;
        }
        
        alert(`Hond opgeslagen!\nNaam: ${name}\nStamboom: ${pedigree}\nRas: ${breed}`);
    }
}

// Maak beschikbaar
window.LitterManager = LitterManager;
console.log('LitterManager class beschikbaar in window');