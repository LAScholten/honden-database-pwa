// COICalculator - ECHTE BEREKENING
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
        
        console.log(`✅ COICalculator: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            const dog = this.getDogById(dogId);
            if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            console.log(`🔍 ${dog.naam} (ID: ${dog.id}) - Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);
            
            // Basisgevallen
            if (!dog.vaderId || !dog.moederId) {
                console.log(`Geen ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // Reset cache voor nieuwe berekening
            this._coiCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateRealCOI(dogId, 6);
            
            // BEREKEN 10 GENERATIES
            const coiAllGen = this._calculateRealCOI(dogId, 10);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: ${result.coi6Gen}% / ${result.coiAllGen}%`);
            return result;
            
        } catch (error) {
            console.error('Fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateRealCOI(dogId, maxDepth) {
        if (maxDepth <= 0) return 0;
        
        const cacheKey = `${dogId}_${maxDepth}`;
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
        
        // Vind gemeenschappelijke voorouders van de ouders
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, maxDepth - 1);
        
        let totalCOI = 0;
        
        // Voor ELKE gemeenschappelijke voorouder
        for (const ancestorId of commonAncestors) {
            // Bereken KORTSTE afstand via vader
            const distViaVader = this._findShortestDistance(dog.vaderId, ancestorId, maxDepth - 1);
            // Bereken KORTSTE afstand via moeder
            const distViaMoeder = this._findShortestDistance(dog.moederId, ancestorId, maxDepth - 1);
            
            if (distViaVader > 0 && distViaMoeder > 0) {
                // WRIGHT'S FORMULE: (0.5)^(n1 + n2 + 1)
                const contribution = Math.pow(0.5, distViaVader + distViaMoeder + 1);
                totalCOI += contribution;
                
                // Debug info
                if (maxDepth === 6) {
                    const ancestor = this.getDogById(ancestorId);
                    console.log(`   Voorouder ${ancestor?.naam}: n1=${distViaVader}, n2=${distViaMoeder} -> ${(contribution*100).toFixed(2)}%`);
                }
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _findCommonAncestors(id1, id2, maxDepth) {
        if (maxDepth <= 0) return new Set();
        
        const ancestors1 = new Set();
        const ancestors2 = new Set();
        
        this._collectAncestors(id1, maxDepth, ancestors1);
        this._collectAncestors(id2, maxDepth, ancestors2);
        
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
        return common;
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

    _findShortestDistance(startId, targetId, maxDepth, currentDepth = 0, visited = new Set()) {
        if (currentDepth > maxDepth || visited.has(startId)) return -1;
        
        if (startId === targetId) return currentDepth;
        
        visited.add(startId);
        
        const dog = this.getDogById(startId);
        if (!dog) return -1;
        
        let shortest = -1;
        
        if (dog.vaderId) {
            const dist = this._findShortestDistance(dog.vaderId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (dist > 0 && (shortest === -1 || dist < shortest)) {
                shortest = dist;
            }
        }
        
        if (dog.moederId) {
            const dist = this._findShortestDistance(dog.moederId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (dist > 0 && (shortest === -1 || dist < shortest)) {
                shortest = dist;
            }
        }
        
        return shortest;
    }

    // DEBUG: Toon gemeenschappelijke voorouders
    debugCommonAncestors(id1, id2, depth = 5) {
        console.log(`\n=== GEMEENSCHAPPELIJKE VOOROUDERS ===`);
        
        const common = this._findCommonAncestors(id1, id2, depth);
        console.log(`${common.size} gemeenschappelijke voorouders gevonden:`);
        
        for (const ancestorId of common) {
            const ancestor = this.getDogById(ancestorId);
            console.log(`  ID ${ancestorId}: ${ancestor?.naam}`);
        }
        
        return common.size;
    }
}

// TEST FUNCTION
function testCOI() {
    console.log("🧪 COI TEST");
    
    // Test 1: Broer/zus paring
    const dogs = [
        { id: 1, naam: "A", vaderId: null, moederId: null },
        { id: 2, naam: "B", vaderId: null, moederId: null },
        { id: 3, naam: "Broer", vaderId: 1, moederId: 2 },
        { id: 4, naam: "Zus", vaderId: 1, moederId: 2 },
        { id: 5, naam: "Pup", vaderId: 3, moederId: 4 }
    ];
    
    const calc = new COICalculator(dogs);
    const result = calc.calculateCOI(5);
    console.log(`Broer/zus: ${result.coi6Gen}% (moet ~25%)`);
    
    // Debug
    console.log("\nDebug broer/zus:");
    calc.debugCommonAncestors(3, 4, 5);
}

// Maak beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    window.testCOI = testCOI;
    console.log('✅ COICalculator geladen - Echte berekening');
}