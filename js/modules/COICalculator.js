// COICalculator V4 - CORRECTE INTEELT BEREKENING MET WRIGHT'S FORMULE
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._pathsCache = new Map();
        
        // Bouw snelle lookup
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V4 geladen: ${this._dogMap.size} honden`);
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

            // CORRECTE BEREKENINGEN
            console.log(`   ➡ Bereken met WRIGHT's formule...`);
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOIWright(dogId, 6);
            
            // BEREKEN 25 GENERATIES (bijna volledig)
            const coiAllGen = this._calculateCOIWright(dogId, 25);
            
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

    // CORRECTE IMPLEMENTATIE VAN WRIGHT'S FORMULE
    _calculateCOIWright(dogId, maxDepth) {
        const cacheKey = `${dogId}_${maxDepth}`;
        if (this._coiCache.has(cacheKey)) {
            return this._coiCache.get(cacheKey);
        }
        
        // Basisgevallen
        if (!dogId || maxDepth <= 0) {
            this._coiCache.set(cacheKey, 0);
            return 0;
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
        
        // Zoek alle gemeenschappelijke voorouders
        const commonAncestors = this._findCommonAncestors(dogId, maxDepth);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Vind alle paden van vader naar voorouder
            const pathsFromFather = this._findAllPaths(dog.vaderId, ancestorId, maxDepth - 1);
            // Vind alle paden van moeder naar voorouder
            const pathsFromMother = this._findAllPaths(dog.moederId, ancestorId, maxDepth - 1);
            
            const ancestorCOI = this._calculateCOIWright(ancestorId, maxDepth - 1);
            
            // Combineer alle pad combinaties
            for (const pathFather of pathsFromFather) {
                for (const pathMother of pathsFromMother) {
                    const n1 = pathFather.length; // aantal stappen van vader naar voorouder
                    const n2 = pathMother.length; // aantal stappen van moeder naar voorouder
                    
                    // WRIGHT'S FORMULE: (0.5)^(n1 + n2 + 1) * (1 + F_ancestor)
                    const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + ancestorCOI);
                    totalCOI += contribution;
                }
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _findCommonAncestors(dogId, maxDepth) {
        const ancestorsFather = new Set();
        const ancestorsMother = new Set();
        const commonAncestors = new Set();
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            return commonAncestors;
        }
        
        // Verzamel voorouders van vader
        this._collectAncestors(dog.vaderId, maxDepth - 1, ancestorsFather);
        
        // Verzamel voorouders van moeder
        this._collectAncestors(dog.moederId, maxDepth - 1, ancestorsMother);
        
        // Vind intersectie
        for (const ancestor of ancestorsFather) {
            if (ancestorsMother.has(ancestor)) {
                commonAncestors.add(ancestor);
            }
        }
        
        return commonAncestors;
    }

    _collectAncestors(dogId, remainingDepth, result) {
        if (remainingDepth <= 0 || !dogId) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._collectAncestors(dog.vaderId, remainingDepth - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._collectAncestors(dog.moederId, remainingDepth - 1, result);
        }
    }

    _findAllPaths(startId, targetId, maxDepth, currentPath = []) {
        const cacheKey = `${startId}_${targetId}_${maxDepth}_${currentPath.length}`;
        if (this._pathsCache.has(cacheKey)) {
            return this._pathsCache.get(cacheKey);
        }
        
        if (maxDepth < 0) {
            return [];
        }
        
        if (startId === targetId) {
            return [currentPath];
        }
        
        const dog = this.getDogById(startId);
        if (!dog || (!dog.vaderId && !dog.moederId)) {
            return [];
        }
        
        let allPaths = [];
        
        // Ga via vader
        if (dog.vaderId) {
            const newPath = [...currentPath, dog.vaderId];
            const pathsViaVader = this._findAllPaths(dog.vaderId, targetId, maxDepth - 1, newPath);
            allPaths.push(...pathsViaVader);
        }
        
        // Ga via moeder
        if (dog.moederId) {
            const newPath = [...currentPath, dog.moederId];
            const pathsViaMoeder = this._findAllPaths(dog.moederId, targetId, maxDepth - 1, newPath);
            allPaths.push(...pathsViaMoeder);
        }
        
        this._pathsCache.set(cacheKey, allPaths);
        return allPaths;
    }

    // Voorbeeld van correcte berekening - TEST CASES
    testWrightFormula() {
        console.log("🧪 TEST WRIGHT'S FORMULE:");
        
        // TEST 1: Eenvoudig geval - volle broer/zus paring
        // Stamboom: A = B × C, D = B × C, E = A × D
        // A en D zijn volle broer/zus, hun ouders B en C zijn onverwant
        // COI van E zou moeten zijn: 0.25 (25%)
        
        const testDogs = [
            { id: 1, naam: "B", vaderId: null, moederId: null },
            { id: 2, naam: "C", vaderId: null, moederId: null },
            { id: 3, naam: "A", vaderId: 1, moederId: 2 },
            { id: 4, naam: "D", vaderId: 1, moederId: 2 },
            { id: 5, naam: "E", vaderId: 3, moederId: 4 }
        ];
        
        const testCalculator = new COICalculator(testDogs);
        const result = testCalculator.calculateCOI(5);
        console.log(`TEST 1 - Volle broer/zus paring:`);
        console.log(`   Verwacht: ~25%`);
        console.log(`   Resultaat: ${result.coiAllGen}%`);
        
        // TEST 2: Oom/nicht paring
        // B = A × X, C = A × Y, D = B × C
        // D is product van oom/nicht paring (B is oom van C via A)
        // COI zou moeten zijn: 0.125 (12.5%)
        
        const testDogs2 = [
            { id: 1, naam: "A", vaderId: null, moederId: null },
            { id: 2, naam: "X", vaderId: null, moederId: null },
            { id: 3, naam: "Y", vaderId: null, moederId: null },
            { id: 4, naam: "B", vaderId: 1, moederId: 2 },
            { id: 5, naam: "C", vaderId: 1, moederId: 3 },
            { id: 6, naam: "D", vaderId: 4, moederId: 5 }
        ];
        
        const testCalculator2 = new COICalculator(testDogs2);
        const result2 = testCalculator2.calculateCOI(6);
        console.log(`TEST 2 - Oom/nicht paring:`);
        console.log(`   Verwacht: ~12.5%`);
        console.log(`   Resultaat: ${result2.coiAllGen}%`);
        
        return "✅ Tests voltooid";
    }

    // DEBUG functies
    debugStamboom(hondId, diepte = 3) {
        const hond = this.getDogById(hondId);
        if (!hond) {
            console.log(`Hond ${hondId} niet gevonden`);
            return;
        }
        
        console.log(`=== STAMBOOM DEBUG: ${hond.naam} (${hondId}) ===`);
        this._printStamboom(hondId, 0, diepte, '');
        console.log(`====================================`);
    }

    _printStamboom(hondId, huidigeDiepte, maxDiepte, prefix) {
        if (huidigeDiepte > maxDiepte) return;
        
        const hond = this.getDogById(hondId);
        if (!hond) return;
        
        console.log(`${prefix}${hond.naam} (${hond.id}) [vader:${hond.vaderId}, moeder:${hond.moederId}]`);
        
        if (hond.vaderId) {
            this._printStamboom(hond.vaderId, huidigeDiepte + 1, maxDiepte, prefix + '  ├─V: ');
        }
        if (hond.moederId) {
            this._printStamboom(hond.moederId, huidigeDiepte + 1, maxDiepte, prefix + '  └─M: ');
        }
    }
    
    // Toon gedetailleerde berekening voor debugging
    showDetailedCalculation(dogId, maxDepth = 6) {
        dogId = Number(dogId);
        const dog = this.getDogById(dogId);
        
        if (!dog || !dog.vaderId || !dog.moederId) {
            console.log("Geen ouders voor gedetailleerde berekening");
            return;
        }
        
        console.log(`📊 GEDETAILLEERDE BEREKENING voor ${dog.naam}:`);
        console.log(`Vader: ${this.getDogById(dog.vaderId)?.naam}`);
        console.log(`Moeder: ${this.getDogById(dog.moederId)?.naam}`);
        
        const commonAncestors = this._findCommonAncestors(dogId, maxDepth);
        
        console.log(`\nGemeenschappelijke voorouders (${commonAncestors.size}):`);
        for (const ancestorId of commonAncestors) {
            const ancestor = this.getDogById(ancestorId);
            const ancestorCOI = this._calculateCOIWright(ancestorId, maxDepth - 1);
            console.log(`  - ${ancestor?.naam} (ID: ${ancestorId}), COI: ${(ancestorCOI * 100).toFixed(1)}%`);
            
            const pathsFather = this._findAllPaths(dog.vaderId, ancestorId, maxDepth - 1);
            const pathsMother = this._findAllPaths(dog.moederId, ancestorId, maxDepth - 1);
            
            console.log(`    Paden via vader: ${pathsFather.length}`);
            console.log(`    Paden via moeder: ${pathsMother.length}`);
            
            let totalForAncestor = 0;
            for (const pf of pathsFather) {
                for (const pm of pathsMother) {
                    const contribution = Math.pow(0.5, pf.length + pm.length + 1) * (1 + ancestorCOI);
                    totalForAncestor += contribution;
                }
            }
            
            console.log(`    Bijdrage: ${(totalForAncestor * 100).toFixed(2)}%`);
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V4 geladen met CORRECTE Wright formule');
}

// Voorbeeld gebruik:
// const calculator = new COICalculator(allDogs);
// const result = calculator.calculateCOI(hondId);
// calculator.testWrightFormula(); // Voer tests uit