// COICalculator V14 - CORRECTE BEREKENING
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
        
        console.log(`✅ COICalculator V14: ${this._dogMap.size} honden geladen`);
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
            
            console.log(`   ➡ Bereken...`);
            
            // Reset cache
            this._coiCache.clear();
            this._ancestorCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOICorrect(dogId, 6);
            
            // BEREKEN 10 GENERATIES
            const coiAllGen = this._calculateCOICorrect(dogId, 10);
            
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

    // CORRECTE COI BEREKENING
    _calculateCOICorrect(dogId, generations) {
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
        const fVader = this._calculateCOICorrect(dog.vaderId, generations - 1);
        const fMoeder = this._calculateCOICorrect(dog.moederId, generations - 1);
        
        // Bereken verwantschap tussen ouders
        const relationship = this._calculateRelationshipCorrect(dog.vaderId, dog.moederId, generations - 1);
        
        // COI = 0.5 * relationship * (1 + (fVader + fMoeder)/2)
        const totalCOI = 0.5 * relationship * (1 + (fVader + fMoeder) / 2);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _calculateRelationshipCorrect(id1, id2, generations) {
        if (generations <= 0) return 0;
        if (id1 === id2) return 1;
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) return 0;
        
        // Vind gemeenschappelijke voorouders
        const commonAncestors = this._findCommonAncestors(id1, id2, generations);
        
        let relationship = 0;
        
        for (const ancestorId of commonAncestors) {
            // Vind de som van (0.5)^(n1 + n2) voor ALLE pad combinaties
            const totalFromAncestor = this._calculateTotalFromAncestor(id1, id2, ancestorId, generations);
            relationship += totalFromAncestor;
        }
        
        return relationship;
    }

    _calculateTotalFromAncestor(id1, id2, ancestorId, generations) {
        // Vind alle paden van id1 naar ancestor
        const paths1 = this._findAllPaths(id1, ancestorId, generations);
        // Vind alle paden van id2 naar ancestor
        const paths2 = this._findAllPaths(id2, ancestorId, generations);
        
        let total = 0;
        
        // Voor elke combinatie van paden
        for (const path1 of paths1) {
            for (const path2 of paths2) {
                const n1 = path1.length;
                const n2 = path2.length;
                
                // (0.5)^(n1 + n2)
                total += Math.pow(0.5, n1 + n2);
            }
        }
        
        return total;
    }

    _findCommonAncestors(id1, id2, generations) {
        if (generations <= 0) return new Set();
        
        const ancestors1 = new Set();
        const ancestors2 = new Set();
        
        this._collectAncestors(id1, generations, ancestors1);
        this._collectAncestors(id2, generations, ancestors2);
        
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
        return common;
    }

    _collectAncestors(dogId, generations, result) {
        if (generations <= 0 || !dogId) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._collectAncestors(dog.vaderId, generations - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._collectAncestors(dog.moederId, generations - 1, result);
        }
    }

    _findAllPaths(startId, targetId, maxDepth, currentPath = [], visited = new Set()) {
        if (maxDepth < 0 || visited.has(startId)) return [];
        
        if (startId === targetId) {
            return [currentPath];
        }
        
        visited.add(startId);
        
        const dog = this.getDogById(startId);
        if (!dog) return [];
        
        let allPaths = [];
        
        if (dog.vaderId) {
            const newPath = [...currentPath, dog.vaderId];
            const pathsViaVader = this._findAllPaths(dog.vaderId, targetId, maxDepth - 1, newPath, new Set(visited));
            allPaths.push(...pathsViaVader);
        }
        
        if (dog.moederId) {
            const newPath = [...currentPath, dog.moederId];
            const pathsViaMoeder = this._findAllPaths(dog.moederId, targetId, maxDepth - 1, newPath, new Set(visited));
            allPaths.push(...pathsViaMoeder);
        }
        
        return allPaths;
    }

    // EENVOUDIGE PRAKTISCHE BEREKENING
    calculateCOISimple(dogId) {
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
            const coi6Gen = this._calculateSimple(dogId, 6);
            
            // Bereken 10 generaties
            const coiAllGen = this._calculateSimple(dogId, 10);
            
            return {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
        } catch (error) {
            console.error('Fout in simple COI:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateSimple(dogId, generations) {
        if (generations <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Vind gemeenschappelijke voorouders
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Vind de KORTSTE paden
            const shortestPathFather = this._findShortestPath(dog.vaderId, ancestorId, generations - 1);
            const shortestPathMother = this._findShortestPath(dog.moederId, ancestorId, generations - 1);
            
            if (shortestPathFather.length === 0 || shortestPathMother.length === 0) continue;
            
            const n1 = shortestPathFather.length;
            const n2 = shortestPathMother.length;
            
            // (0.5)^(n1 + n2 + 1)
            totalCOI += Math.pow(0.5, n1 + n2 + 1);
        }
        
        return totalCOI;
    }

    _findShortestPath(startId, targetId, maxDepth, currentPath = [], visited = new Set()) {
        if (maxDepth < 0 || visited.has(startId)) return [];
        
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

    // TEST VOOR BEKENDE WAARDEN
    testKnownValues() {
        console.log("🧪 TEST BEKENDE WAARDEN:");
        console.log("=========================");
        
        // 1. Broer/zus paring
        const dogs1 = [
            { id: 1, naam: "Ouder A", vaderId: null, moederId: null },
            { id: 2, naam: "Ouder B", vaderId: null, moederId: null },
            { id: 3, naam: "Broer", vaderId: 1, moederId: 2 },
            { id: 4, naam: "Zus", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Pup", vaderId: 3, moederId: 4 }
        ];
        
        const calc1 = new COICalculator(dogs1);
        const res1 = calc1.calculateCOI(5);
        console.log(`1. Broer/zus: ${res1.coi6Gen}% (verwacht: 25.0%)`);
        
        // 2. Half broer/zus
        const dogs2 = [
            { id: 10, naam: "Gemeenschappelijke", vaderId: null, moederId: null },
            { id: 11, naam: "Partner A", vaderId: null, moederId: null },
            { id: 12, naam: "Partner B", vaderId: null, moederId: null },
            { id: 13, naam: "HalfBroer", vaderId: 10, moederId: 11 },
            { id: 14, naam: "HalfZus", vaderId: 10, moederId: 12 },
            { id: 15, naam: "Pup", vaderId: 13, moederId: 14 }
        ];
        
        const calc2 = new COICalculator(dogs2);
        const res2 = calc2.calculateCOI(15);
        console.log(`2. Half broer/zus: ${res2.coi6Gen}% (verwacht: 12.5%)`);
        
        // 3. Oom/nicht
        const dogs3 = [
            { id: 20, naam: "Grootvader", vaderId: null, moederId: null },
            { id: 21, naam: "Partner 1", vaderId: null, moederId: null },
            { id: 22, naam: "Partner 2", vaderId: null, moederId: null },
            { id: 23, naam: "Oom", vaderId: 20, moederId: 21 },
            { id: 24, naam: "Nicht", vaderId: 20, moederId: 22 },
            { id: 25, naam: "Pup", vaderId: 23, moederId: 24 }
        ];
        
        const calc3 = new COICalculator(dogs3);
        const res3 = calc3.calculateCOI(25);
        console.log(`3. Oom/nicht: ${res3.coi6Gen}% (verwacht: 12.5%)`);
        
        return true;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V14 geladen - Verbeterde berekening');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// 
// Test eerst:
// calc.testKnownValues();
// 
// Bereken je honden:
// console.log("\nID 68 (Katinka):", calc.calculateCOI(68));
// console.log("ID 68 (simple):", calc.calculateCOISimple(68));
// 
// console.log("\nID 27 (Droll):", calc.calculateCOI(27));
// console.log("ID 27 (simple):", calc.calculateCOISimple(27));
// 
// console.log("\nID 29 (Erle-Lu):", calc.calculateCOI(29));
// console.log("ID 29 (simple):", calc.calculateCOISimple(29));
// 
// console.log("\nID 524 (Bero):", calc.calculateCOI(524));
// console.log("ID 524 (simple):", calc.calculateCOISimple(524));