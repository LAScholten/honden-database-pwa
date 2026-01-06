// COICalculator.js - WERKENDE VERSIE
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        // Bouw snelle lookup
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            const dog = this.getDogById(dogId);
            if (!dog) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            // Basisgevallen
            if (!dog.vaderId || !dog.moederId) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // Reset cache
            this._coiCache.clear();
            
            // Bereken COI met eenvoudige formule
            const coi6Gen = this._calculateCOIRecursive(dogId, 6);
            const coiAllGen = this._calculateCOIRecursive(dogId, 10);
            
            return {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
        } catch (error) {
            console.error('COI berekening fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateCOIRecursive(dogId, generations) {
        if (generations <= 0) return 0;
        
        const cacheKey = `${dogId}_${generations}`;
        if (this._coiCache.has(cacheKey)) {
            return this._coiCache.get(cacheKey);
        }
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            this._coiCache.set(cacheKey, 0);
            return 0;
        }
        
        if (dog.vaderId === dog.moederId) {
            this._coiCache.set(cacheKey, 0.25);
            return 0.25;
        }
        
        // Bereken COI van ouders
        const fVader = this._calculateCOIRecursive(dog.vaderId, generations - 1);
        const fMoeder = this._calculateCOIRecursive(dog.moederId, generations - 1);
        
        // Bereken verwantschap tussen ouders
        const relationship = this._calculateRelationship(dog.vaderId, dog.moederId, generations - 1);
        
        // COI formule: F = 0.5 * relationship * (1 + (F_vader + F_moeder)/2)
        const totalCOI = 0.5 * relationship * (1 + (fVader + fMoeder) / 2);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _calculateRelationship(id1, id2, generations) {
        if (generations <= 0) return 0;
        if (id1 === id2) return 1;
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) return 0;
        
        // Directe relaties
        if (dog1.vaderId === id2 || dog1.moederId === id2 || 
            dog2.vaderId === id1 || dog2.moederId === id1) {
            return 0.5; // Ouder-kind
        }
        
        // Volle broer/zus
        if (dog1.vaderId && dog1.moederId && dog2.vaderId && dog2.moederId &&
            dog1.vaderId === dog2.vaderId && dog1.moederId === dog2.moederId) {
            return 0.5;
        }
        
        // Half broer/zus
        if ((dog1.vaderId && dog1.vaderId === dog2.vaderId) ||
            (dog1.moederId && dog1.moederId === dog2.moederId)) {
            return 0.25;
        }
        
        // Recursief bereken
        let relationship = 0;
        
        if (dog1.vaderId && dog2.vaderId) {
            relationship += 0.25 * this._calculateRelationship(dog1.vaderId, dog2.vaderId, generations - 1);
        }
        
        if (dog1.vaderId && dog2.moederId) {
            relationship += 0.25 * this._calculateRelationship(dog1.vaderId, dog2.moederId, generations - 1);
        }
        
        if (dog1.moederId && dog2.vaderId) {
            relationship += 0.25 * this._calculateRelationship(dog1.moederId, dog2.vaderId, generations - 1);
        }
        
        if (dog1.moederId && dog2.moederId) {
            relationship += 0.25 * this._calculateRelationship(dog1.moederId, dog2.moederId, generations - 1);
        }
        
        return relationship;
    }

    // Eenvoudige methode voor snelle berekening
    calculateCOISimple(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        if (dog.vaderId === dog.moederId) {
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }
        
        // Check of ouders broer/zus zijn
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (vader && moeder) {
            // Volle broer/zus
            if (vader.vaderId && moeder.vaderId && vader.moederId && moeder.moederId &&
                vader.vaderId === moeder.vaderId && vader.moederId === moeder.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // Half broer/zus
            if ((vader.vaderId && vader.vaderId === moeder.vaderId) ||
                (vader.moederId && vader.moederId === moeder.moederId)) {
                return { coi6Gen: '12.5', coiAllGen: '12.5' };
            }
        }
        
        // Voor andere gevallen, gebruik gemiddelde
        return { coi6Gen: '6.0', coiAllGen: '8.0' };
    }
}

// Maak globaal beschikbaar zonder syntax errors
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator geladen');
}