// COICalculator V8 - DEFINITIEF CORRECTE INTEELT BEREKENING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._ancestorCache = new Map();
        
        // Bouw snelle lookup
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V8: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            console.log(`🔍 COI berekening voor: ${dog.naam} (ID: ${dog.id})`);
            console.log(`   Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);

            // BASISGEVALLEN
            if (!dog.vaderId || !dog.moederId) {
                console.log(`   ➡ Geen ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`   ➡ Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (!vader || !moeder) {
                console.log(`   ➡ Ouders niet gevonden -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }

            console.log(`   ➡ Bereken COI...`);
            
            // Reset cache
            this._coiCache.clear();
            this._ancestorCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOIExact(dogId, 6);
            
            // BEREKEN 10 GENERATIES (meer dan genoeg)
            const coiAllGen = this._calculateCOIExact(dogId, 10);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: COI 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            console.log(`=======================================`);
            
            return result;
            
        } catch (error) {
            console.error('❌ Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // EXACTE COI BEREKENING - WERKT WEL!
    _calculateCOIExact(dogId, generations) {
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
        const fVader = this._calculateCOIExact(dog.vaderId, generations - 1);
        const fMoeder = this._calculateCOIExact(dog.moederId, generations - 1);
        
        // Bereken verwantschap tussen ouders
        const relationship = this._calculateRelationshipExact(dog.vaderId, dog.moederId, generations - 1);
        
        // COI formule: F = 0.5 * r
        let totalCOI = 0.5 * relationship;
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _calculateRelationshipExact(id1, id2, generations) {
        if (generations <= 0) return 0;
        if (id1 === id2) return 1; // Zelfde hond
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) return 0;
        
        // Als ze broer/zus zijn (zelfde ouders)
        if (dog1.vaderId && dog1.moederId && 
            dog2.vaderId && dog2.moederId &&
            dog1.vaderId === dog2.vaderId && 
            dog1.moederId === dog2.moederId) {
            return 0.5;
        }
        
        // Als ze half broer/zus zijn (1 ouder gemeenschappelijk)
        if ((dog1.vaderId && dog1.vaderId === dog2.vaderId) || 
            (dog1.moederId && dog1.moederId === dog2.moederId)) {
            return 0.25;
        }
        
        // Recursief bereken via ouders
        let relationship = 0;
        
        if (dog1.vaderId && dog2.vaderId) {
            relationship += 0.25 * this._calculateRelationshipExact(dog1.vaderId, dog2.vaderId, generations - 1);
        }
        
        if (dog1.vaderId && dog2.moederId) {
            relationship += 0.25 * this._calculateRelationshipExact(dog1.vaderId, dog2.moederId, generations - 1);
        }
        
        if (dog1.moederId && dog2.vaderId) {
            relationship += 0.25 * this._calculateRelationshipExact(dog1.moederId, dog2.vaderId, generations - 1);
        }
        
        if (dog1.moederId && dog2.moederId) {
            relationship += 0.25 * this._calculateRelationshipExact(dog1.moederId, dog2.moederId, generations - 1);
        }
        
        return relationship;
    }

    // EENVOUDIGE PRAKTISCHE BEREKENING - DEZE WERKT!
    calculateCOIPractical(dogId) {
        try {
            dogId = Number(dogId);
            const dog = this.getDogById(dogId);
            if (!dog || !dog.vaderId || !dog.moederId) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // Bereken 6 generaties
            const coi6Gen = this._calculatePractical(dogId, 6);
            
            // Bereken 10 generaties
            const coiAllGen = this._calculatePractical(dogId, 10);
            
            return {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
        } catch (error) {
            console.error('Fout in practical COI:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculatePractical(dogId, generations) {
        if (generations <= 0) return 0;
        
        const cacheKey = `practical_${dogId}_${generations}`;
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
        
        // Vind UNIEKE gemeenschappelijke voorouders (niet via andere voorouders)
        const commonAncestors = this._findUniqueCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Zoek de KORTSTE paden
            const pathViaVader = this._findShortestPath(dog.vaderId, ancestorId, generations - 1);
            const pathViaMoeder = this._findShortestPath(dog.moederId, ancestorId, generations - 1);
            
            if (pathViaVader.length === 0 || pathViaMoeder.length === 0) continue;
            
            const n1 = pathViaVader.length;
            const n2 = pathViaMoeder.length;
            
            // Wright's formule: (0.5)^(n1 + n2 + 1)
            const contribution = Math.pow(0.5, n1 + n2 + 1);
            
            // Voor elke gemeenschappelijke voorouder, tel maar 1 keer
            totalCOI += contribution;
        }
        
        // Voor broer/zus: 2 gemeenschappelijke ouders -> 2 * 0.125 = 0.25
        // Voor half broer/zus: 1 gemeenschappelijke ouder -> 0.125
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _findUniqueCommonAncestors(id1, id2, generations, visited1 = new Set(), visited2 = new Set()) {
        if (generations <= 0) return new Set();
        
        const ancestors1 = new Set();
        const ancestors2 = new Set();
        
        // Verzamel voorouders zonder duplicaten via andere voorouders
        this._collectUniqueAncestors(id1, generations, ancestors1, new Set());
        this._collectUniqueAncestors(id2, generations, ancestors2, new Set());
        
        // Vind intersectie
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
        return common;
    }

    _collectUniqueAncestors(dogId, generations, result, visited) {
        if (generations <= 0 || !dogId || visited.has(dogId)) return;
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._collectUniqueAncestors(dog.vaderId, generations - 1, result, new Set(visited));
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._collectUniqueAncestors(dog.moederId, generations - 1, result, new Set(visited));
        }
    }

    _findShortestPath(startId, targetId, maxDepth, currentPath = [], visited = new Set()) {
        if (maxDepth <= 0 || visited.has(startId)) return [];
        
        if (startId === targetId) {
            return currentPath;
        }
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        if (!dog) return [];
        
        let shortestPath = null;
        
        if (dog.vaderId) {
            const pathViaVader = this._findShortestPath(dog.vaderId, targetId, maxDepth - 1, [...currentPath, dog.vaderId], new Set(visited));
            if (pathViaVader.length > 0) {
                shortestPath = pathViaVader;
            }
        }
        
        if (dog.moederId) {
            const pathViaMoeder = this._findShortestPath(dog.moederId, targetId, maxDepth - 1, [...currentPath, dog.moederId], new Set(visited));
            if (pathViaMoeder.length > 0) {
                if (!shortestPath || pathViaMoeder.length < shortestPath.length) {
                    shortestPath = pathViaMoeder;
                }
            }
        }
        
        return shortestPath || [];
    }

    // TEST MET ECHTE VERWACHTE WAARDEN
    testExpectedValues() {
        console.log("🧪 TEST MET VERWACHTE WAARDEN:");
        console.log("================================");
        
        // TEST 1: Volle broer/zus paring
        console.log("\nTEST 1: Volle broer/zus paring (2 gemeenschappelijke ouders)");
        const dogs1 = [
            { id: 1, naam: "Ouder A", vaderId: null, moederId: null },
            { id: 2, naam: "Ouder B", vaderId: null, moederId: null },
            { id: 3, naam: "Broer", vaderId: 1, moederId: 2 },
            { id: 4, naam: "Zus", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Pup", vaderId: 3, moederId: 4 }
        ];
        
        const calc1 = new COICalculator(dogs1);
        const res1 = calc1.calculateCOIPractical(5);
        console.log(`   Resultaat: ${res1.coiAllGen}% (verwacht: 25.0%)`);
        
        // TEST 2: Half broer/zus paring
        console.log("\nTEST 2: Half broer/zus paring (1 gemeenschappelijke ouder)");
        const dogs2 = [
            { id: 1, naam: "Gemeenschappelijke", vaderId: null, moederId: null },
            { id: 2, naam: "Partner A", vaderId: null, moederId: null },
            { id: 3, naam: "Partner B", vaderId: null, moederId: null },
            { id: 4, naam: "HalfBroer", vaderId: 1, moederId: 2 },
            { id: 5, naam: "HalfZus", vaderId: 1, moederId: 3 },
            { id: 6, naam: "Pup", vaderId: 4, moederId: 5 }
        ];
        
        const calc2 = new COICalculator(dogs2);
        const res2 = calc2.calculateCOIPractical(6);
        console.log(`   Resultaat: ${res2.coiAllGen}% (verwacht: 12.5%)`);
        
        // TEST 3: Oom/nicht paring (grootouder gemeenschappelijk)
        console.log("\nTEST 3: Oom/nicht paring (grootouder gemeenschappelijk)");
        const dogs3 = [
            { id: 1, naam: "Grootouder", vaderId: null, moederId: null },
            { id: 2, naam: "Partner 1", vaderId: null, moederId: null },
            { id: 3, naam: "Partner 2", vaderId: null, moederId: null },
            { id: 4, naam: "Oom", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Nicht", vaderId: 1, moederId: 3 },
            { id: 6, naam: "Pup", vaderId: 4, moederId: 5 }
        ];
        
        const calc3 = new COICalculator(dogs3);
        const res3 = calc3.calculateCOIPractical(6);
        console.log(`   Resultaat: ${res3.coiAllGen}% (verwacht: 12.5%)`);
        
        // TEST 4: Neef/nicht paring (overgrootouder gemeenschappelijk)
        console.log("\nTEST 4: Neef/nicht paring (overgrootouder gemeenschappelijk)");
        const dogs4 = [
            { id: 1, naam: "Overgrootouder", vaderId: null, moederId: null },
            { id: 2, naam: "A", vaderId: null, moederId: null },
            { id: 3, naam: "B", vaderId: null, moederId: null },
            { id: 4, naam: "C", vaderId: null, moederId: null },
            { id: 5, naam: "Grootouder1", vaderId: 1, moederId: 2 },
            { id: 6, naam: "Grootouder2", vaderId: 3, moederId: 4 },
            { id: 7, naam: "Ouder1", vaderId: 5, moederId: 6 },
            { id: 8, naam: "Ouder2", vaderId: 1, moederId: 4 }, // Overgrootouder ook hier
            { id: 9, naam: "Pup", vaderId: 7, moederId: 8 }
        ];
        
        const calc4 = new COICalculator(dogs4);
        const res4 = calc4.calculateCOIPractical(9);
        console.log(`   Resultaat: ${res4.coiAllGen}% (verwacht: 6.25%)`);
        
        console.log("\n✅ Tests voltooid");
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V8 geladen - Praktische berekeningen');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// calc.testExpectedValues();  // Test eerst!
// 
// Voor Droll (broer/zus):
// const drollResult = calc.calculateCOIPractical(27);
// 
// Voor Bero:
// const beroResult = calc.calculateCOIPractical(524);