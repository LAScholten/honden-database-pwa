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
                <button type="button" class="btn btn-outline-secondary btn-sm" id="backBtn">
                    <i class="bi bi-arrow-left me-1"></i> Terug
                </button>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Vader</label>
                <input type="text" class="form-control" id="father">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Moeder</label>
                <input type="text" class="form-control" id="mother">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Naam hond</label>
                <input type="text" class="form-control" id="dogName">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Stamboomnummer</label>
                <input type="text" class="form-control" id="pedigree">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Ras</label>
                <input type="text" class="form-control" id="breed">
            </div>
            
            <button type="button" class="btn btn-primary mt-3" id="saveBtn">
                Opslaan
            </button>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager events setup');
        
        // Terug knop
        document.getElementById('backBtn').addEventListener('click', () => {
            if (window.dogManager) {
                window.dogManager.showChoiceScreen();
            }
        });
        
        // Opslaan knop
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveDog();
        });
    }
    
    saveDog() {
        const dogData = {
            vader: document.getElementById('father').value,
            moeder: document.getElementById('mother').value,
            naam: document.getElementById('dogName').value,
            stamboomnr: document.getElementById('pedigree').value,
            ras: document.getElementById('breed').value
        };
        
        console.log('Hond opslaan:', dogData);
        
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            alert('Vul naam, stamboomnummer en ras in');
            return;
        }
        
        alert('Hond zou opgeslagen worden');
    }
}

// Maak beschikbaar
window.LitterManager = LitterManager;