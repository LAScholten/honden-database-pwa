/**
 * SIMPELE LitterManager die WEL werkt
 */

class LitterManager {
    constructor() {
        console.log('✅ LitterManager aangemaakt');
    }
    
    getFormHTML() {
        return `
            <!-- Terug knop -->
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="window.dogManager.showChoiceScreen()">
                    <i class="bi bi-arrow-left me-1"></i> Terug
                </button>
            </div>
            
            <!-- Vader -->
            <div class="mb-3">
                <label class="form-label">Vader</label>
                <input type="text" class="form-control" id="litterFather" placeholder="Vader naam">
            </div>
            
            <!-- Moeder -->
            <div class="mb-3">
                <label class="form-label">Moeder</label>
                <input type="text" class="form-control" id="litterMother" placeholder="Moeder naam">
            </div>
            
            <!-- Naam hond -->
            <div class="mb-3">
                <label class="form-label">Naam hond</label>
                <input type="text" class="form-control" id="litterName" placeholder="Naam hond">
            </div>
            
            <!-- Stamboomnummer -->
            <div class="mb-3">
                <label class="form-label">Stamboomnummer</label>
                <input type="text" class="form-control" id="litterPedigree" placeholder="Stamboomnummer">
            </div>
            
            <!-- Ras -->
            <div class="mb-3">
                <label class="form-label">Ras</label>
                <input type="text" class="form-control" id="litterBreed" placeholder="Ras">
            </div>
            
            <!-- Opslaan knop -->
            <div class="mt-4">
                <button type="button" class="btn btn-primary w-100" onclick="window.litterManager.saveDog()">
                    Opslaan
                </button>
            </div>
        `;
    }
    
    saveDog() {
        console.log('🟢 SAVE DOG KNOP GEKLIKT');
        
        // Haal waarden op
        const father = document.getElementById('litterFather').value;
        const mother = document.getElementById('litterMother').value;
        const name = document.getElementById('litterName').value;
        const pedigree = document.getElementById('litterPedigree').value;
        const breed = document.getElementById('litterBreed').value;
        
        console.log('📝 Gegevens:', { father, mother, name, pedigree, breed });
        
        // Simpele validatie
        if (!name || !pedigree || !breed) {
            alert('❌ Vul naam, stamboomnummer en ras in!');
            return;
        }
        
        alert(`✅ Hond zou opgeslagen worden:\nNaam: ${name}\nStamboom: ${pedigree}\nRas: ${breed}\nVader: ${father}\nMoeder: ${mother}`);
        
        // Reset formulier
        document.getElementById('litterFather').value = '';
        document.getElementById('litterMother').value = '';
        document.getElementById('litterName').value = '';
        document.getElementById('litterPedigree').value = '';
        document.getElementById('litterBreed').value = '';
    }
}

// Maak meteen beschikbaar in window
window.LitterManager = LitterManager;
console.log('✅ LitterManager script geladen');