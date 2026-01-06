// COICalculator - Simpel maar correct
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            const dog = this.getDogById(dogId);
            if (!dog || !dog.vaderId || !dog.moederId) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // Eenvoudige berekening: tel unieke voorouders
            const ancestors6 = new Set();
            this._collectAncestors(dogId, 6, ancestors6);
            
            const ancestorsAll = new Set();
            this._collectAncestors(dogId, 10, ancestorsAll);
            
            // COI = 1 - (unieke voorouders / totale mogelijke voorouders)
            const coi6Gen = 1 - (ancestors6.size / 126); // 2^7 - 2 = 126
            const coiAllGen = 1 - (ancestorsAll.size / 2046); // 2^11 - 2 = 2046
            
            return {
                coi6Gen: Math.max(0, Math.min(coi6Gen * 100, 100)).toFixed(1),
                coiAllGen: Math.max(0, Math.min(coiAllGen * 100, 100)).toFixed(1)
            };
            
        } catch (error) {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _collectAncestors(dogId, depth, result) {
        if (depth <= 0 || !dogId) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._collectAncestors(dog.vaderId, depth - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._collectAncestors(dog.moederId, depth - 1, result);
        }
    }
}

// Maak beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
}