// COICalculator V13 - ECHTE BEREKENING OP BASIS VAN VOOROUDERS
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
        
        console.log(`✅ COICalculator V13: ${this._dogMap.size} honden geladen`);
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
            
            console.log(`   ➡ Bereken op basis van gemeenschappelijke voorouders...`);
            
            // Reset cache
            this._coiCache.clear();
            this._ancestorCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOIByAncestors(dogId, 6);
            
            // BEREKEN 10 GENERATIES
            const coiAllGen = this._calculateCOIByAncestors(dogId, 10);
            
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

    // ECHTE BEREKENING OP BASIS VAN GEMEENSCHAPPELIJKE VOOROUDERS
    _calculateCOIByAncestors(dogId, generations) {
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
        
        // Vind alle gemeenschappelijke voorouders van de ouders
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        
        let totalCOI = 0;
        
        // Voor ELKE gemeenschappelijke voorouder
        for (const ancestorId of commonAncestors) {
            // Vind ALLE paden van vader naar voorouder
            const pathsFromFather = this._findAllPaths(dog.vaderId, ancestorId, generations - 1);
            // Vind ALLE paden van moeder naar voorouder
            const pathsFromMother = this._findAllPaths(dog.moederId, ancestorId, generations - 1);
            
            if (pathsFromFather.length === 0 || pathsFromMother.length === 0) continue;
            
            // Bereken COI van de voorouder zelf
            const ancestorCOI = this._calculateCOIByAncestors(ancestorId, generations - 1);
            
            // Voor ELKE combinatie van paden
            for (const pathFather of pathsFromFather) {
                for (const pathMother of pathsFromMother) {
                    const n1 = pathFather.length; // stappen via vader
                    const n2 = pathMother.length; // stappen via moeder
                    
                    // WRIGHT'S FORMULE: (0.5)^(n1 + n2 + 1) * (1 + F_ancestor)
                    const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + ancestorCOI);
                    totalCOI += contribution;
                }
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _findCommonAncestors(id1, id2, generations) {
        if (generations <= 0) return new Set();
        
        const cacheKey = `common_${id1}_${id2}_${generations}`;
        if (this._ancestorCache.has(cacheKey)) {
            return this._ancestorCache.get(cacheKey);
        }
        
        const ancestors1 = new Set();
        const ancestors2 = new Set();
        
        this._collectAllAncestors(id1, generations, ancestors1);
        this._collectAllAncestors(id2, generations, ancestors2);
        
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
        this._ancestorCache.set(cacheKey, common);
        return common;
    }

    _collectAllAncestors(dogId, generations, result) {
        if (generations <= 0 || !dogId) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._collectAllAncestors(dog.vaderId, generations - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._collectAllAncestors(dog.moederId, generations - 1, result);
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

    // DEBUG: Toon gedetailleerde berekening
    debugCOIDetailed(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`=== DETAILED COI: ${dog.naam} (ID: ${dogId}) ===`);
        console.log(`Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);
        
        if (!dog.vaderId || !dog.moederId) {
            console.log(`Geen ouders -> 0%`);
            return;
        }
        
        if (dog.vaderId === dog.moederId) {
            console.log(`Zelfde ouders -> 25%`);
            return;
        }
        
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        console.log(`\n${commonAncestors.size} gemeenschappelijke voorouders:`);
        
        let total = 0;
        for (const ancestorId of commonAncestors) {
            const ancestor = this.getDogById(ancestorId);
            const pathsFather = this._findAllPaths(dog.vaderId, ancestorId, generations - 1);
            const pathsMother = this._findAllPaths(dog.moederId, ancestorId, generations - 1);
            
            const ancestorCOI = this._calculateCOIByAncestors(ancestorId, generations - 1);
            
            console.log(`\n${ancestor?.naam} (ID: ${ancestorId}, eigen COI: ${(ancestorCOI*100).toFixed(1)}%):`);
            console.log(`  Paden via vader: ${pathsFather.length}`);
            console.log(`  Paden via moeder: ${pathsMother.length}`);
            
            let ancestorTotal = 0;
            for (let i = 0; i < pathsFather.length; i++) {
                for (let j = 0; j < pathsMother.length; j++) {
                    const n1 = pathsFather[i].length;
                    const n2 = pathsMother[j].length;
                    const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + ancestorCOI);
                    ancestorTotal += contribution;
                    
                    if (pathsFather.length <= 3 && pathsMother.length <= 3) {
                        console.log(`    Pad ${i+1} (n1=${n1}) × Pad ${j+1} (n2=${n2}) = ${(contribution*100).toFixed(3)}%`);
                    }
                }
            }
            
            console.log(`  Totaal voor ${ancestor?.naam}: ${(ancestorTotal*100).toFixed(3)}%`);
            total += ancestorTotal;
        }
        
        console.log(`\nTOTAAL COI: ${(total*100).toFixed(1)}%`);
        console.log(`====================================`);
    }

    // TEST VOOR SPECIFIEKE HONDEN
    testSpecificDogs() {
        console.log("🧪 TEST SPECIFIEKE HONDEN:");
        console.log("===========================");
        
        // Deze functie moet worden aangeroepen met echte data
        return "Roep debugCOIDetailed aan voor elke hond";
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V13 geladen - Echte voorouder berekening');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// 
// Voor ID 68 (moet ~37% zijn):
// calc.debugCOIDetailed(68, 6);
// 
// Voor ID 27 (broer/zus):
// calc.debugCOIDetailed(27, 6);
// 
// Voor ID 524 (moet ~25% zijn):
// calc.debugCOIDetailed(524, 6);
// 
// Voor ID 29 (vader/dochter):
// calc.debugCOIDetailed(29, 6);