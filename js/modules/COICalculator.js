// COICalculator V5 - CORRECTE INTEELT BEREKENING
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
        
        console.log(`✅ COICalculator V5: ${this._dogMap.size} honden geladen`);
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

            // CORRECTE BEREKENING
            console.log(`   ➡ Bereken COI volgens Wright's formule...`);
            
            // Reset cache voor nieuwe berekening
            this._coiCache.clear();
            this._ancestorCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOICorrect(dogId, 6);
            
            // BEREKEN 25 GENERATIES
            const coiAllGen = this._calculateCOICorrect(dogId, 25);
            
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

    // CORRECTE COI BEREKENING - SIMPEL EN ACCURAAT
    _calculateCOICorrect(dogId, maxDepth) {
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
        
        // Bereken COI volgens de formule: Fx = Σ [ (0.5)^(n1+n2+1) * (1 + Fa) ]
        // Waarbij Fa de COI is van de gemeenschappelijke voorouder
        
        const commonAncestors = this._findCommonAncestorsCorrect(dogId, maxDepth);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Bereken alle UNIEKE paden van vader naar voorouder
            const pathsFather = this._findAllUniquePaths(dog.vaderId, ancestorId, maxDepth - 1);
            // Bereken alle UNIEKE paden van moeder naar voorouder
            const pathsMother = this._findAllUniquePaths(dog.moederId, ancestorId, maxDepth - 1);
            
            if (pathsFather.length === 0 || pathsMother.length === 0) continue;
            
            // Bereken COI van de voorouder (recursief)
            const ancestorCOI = this._calculateCOICorrect(ancestorId, maxDepth - 1);
            
            // Voor ELK PAD van vader en ELK PAD van moeder:
            // Bij volle broer/zus paring: 1 pad van vader en 1 pad van moeder
            // Wright's formule: (0.5)^(n1 + n2 + 1) * (1 + Fa)
            // n1 = lengte pad van vader, n2 = lengte pad van moeder
            
            for (let i = 0; i < pathsFather.length; i++) {
                for (let j = 0; j < pathsMother.length; j++) {
                    const n1 = pathsFather[i].length;
                    const n2 = pathsMother[j].length;
                    
                    // VOORBEELD: volle broer/zus
                    // n1 = 1 (vader -> gemeenschappelijke ouder)
                    // n2 = 1 (moeder -> gemeenschappelijke ouder)
                    // (0.5)^(1+1+1) = (0.5)^3 = 0.125
                    // MAAR dit moet 0.25 zijn voor volle broer/zus!
                    
                    // AH! Ik zie het: bij volle broer/zus hebben we 2 gemeenschappelijke ouders!
                    // Ouder B via vader: n1=1, via moeder: n2=1 -> (0.5)^3 = 0.125
                    // Ouder C via vader: n1=1, via moeder: n2=1 -> (0.5)^3 = 0.125
                    // Totaal: 0.25
                    
                    const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + ancestorCOI);
                    totalCOI += contribution;
                    
                    // Debug logging
                    if (maxDepth === 6) {
                        const ancestor = this.getDogById(ancestorId);
                        console.log(`   [6gen] Voorouder ${ancestor?.naam}: pad ${i+1}(n1=${n1}) + pad ${j+1}(n2=${n2}) -> ${(contribution*100).toFixed(3)}%`);
                    }
                }
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _findCommonAncestorsCorrect(dogId, maxDepth) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            return new Set();
        }
        
        // Verzamel voorouders van vader
        const fatherAncestors = new Set();
        this._collectAllAncestors(dog.vaderId, maxDepth - 1, fatherAncestors);
        
        // Verzamel voorouders van moeder
        const motherAncestors = new Set();
        this._collectAllAncestors(dog.moederId, maxDepth - 1, motherAncestors);
        
        // Vind intersectie
        const common = new Set();
        for (const ancestor of fatherAncestors) {
            if (motherAncestors.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
        return common;
    }

    _collectAllAncestors(dogId, depth, result) {
        if (depth <= 0 || !dogId) return;
        
        const cacheKey = `${dogId}_${depth}`;
        if (this._ancestorCache.has(cacheKey)) {
            const cached = this._ancestorCache.get(cacheKey);
            cached.forEach(id => result.add(id));
            return;
        }
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        const tempResult = new Set(result);
        
        if (dog.vaderId) {
            tempResult.add(dog.vaderId);
            this._collectAllAncestors(dog.vaderId, depth - 1, tempResult);
        }
        
        if (dog.moederId) {
            tempResult.add(dog.moederId);
            this._collectAllAncestors(dog.moederId, depth - 1, tempResult);
        }
        
        // Cache het resultaat
        this._ancestorCache.set(cacheKey, new Set(tempResult));
        tempResult.forEach(id => result.add(id));
    }

    _findAllUniquePaths(startId, targetId, maxDepth, currentPath = [], visited = new Set()) {
        if (maxDepth < 0) return [];
        if (visited.has(startId)) return []; // Voorkom cycli
        
        if (startId === targetId) {
            return [currentPath];
        }
        
        const dog = this.getDogById(startId);
        if (!dog) return [];
        
        visited.add(startId);
        
        let allPaths = [];
        
        // Ga via vader
        if (dog.vaderId) {
            const newPath = [...currentPath, dog.vaderId];
            const pathsViaVader = this._findAllUniquePaths(dog.vaderId, targetId, maxDepth - 1, newPath, new Set(visited));
            allPaths.push(...pathsViaVader);
        }
        
        // Ga via moeder
        if (dog.moederId) {
            const newPath = [...currentPath, dog.moederId];
            const pathsViaMoeder = this._findAllUniquePaths(dog.moederId, targetId, maxDepth - 1, newPath, new Set(visited));
            allPaths.push(...pathsViaMoeder);
        }
        
        return allPaths;
    }

    // TEST FUNCTION om berekening te verifiëren
    testCOICalculation() {
        console.log("🧪 TEST COI BEREKENINGEN:");
        console.log("==========================");
        
        // TEST 1: VOLLE BROER/ZUS PARING (moet 25% zijn)
        console.log("\nTEST 1: Volle broer/zus paring");
        const dogs1 = [
            { id: 1, naam: "A", vaderId: null, moederId: null },
            { id: 2, naam: "B", vaderId: null, moederId: null },
            { id: 3, naam: "C", vaderId: 1, moederId: 2 },
            { id: 4, naam: "D", vaderId: 1, moederId: 2 },
            { id: 5, naam: "E", vaderId: 3, moederId: 4 }
        ];
        
        const calc1 = new COICalculator(dogs1);
        const res1 = calc1.calculateCOI(5);
        console.log(`   Verwacht: 25.0%`);
        console.log(`   Resultaat: ${res1.coiAllGen}%`);
        console.log(`   ✅ ${Math.abs(parseFloat(res1.coiAllGen) - 25.0) < 0.1 ? "CORRECT" : "FOUT"}`);
        
        // TEST 2: OOM/NICHT PARING (moet 12.5% zijn)
        console.log("\nTEST 2: Oom/nicht paring");
        const dogs2 = [
            { id: 1, naam: "Grootvader", vaderId: null, moederId: null },
            { id: 2, naam: "X", vaderId: null, moederId: null },
            { id: 3, naam: "Y", vaderId: null, moederId: null },
            { id: 4, naam: "Oom", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Nicht", vaderId: 1, moederId: 3 },
            { id: 6, naam: "Pup", vaderId: 4, moederId: 5 }
        ];
        
        const calc2 = new COICalculator(dogs2);
        const res2 = calc2.calculateCOI(6);
        console.log(`   Verwacht: 12.5%`);
        console.log(`   Resultaat: ${res2.coiAllGen}%`);
        console.log(`   ✅ ${Math.abs(parseFloat(res2.coiAllGen) - 12.5) < 0.1 ? "CORRECT" : "FOUT"}`);
        
        // TEST 3: NE/NICHT PARING (moet 6.25% zijn)
        console.log("\nTEST 3: Neef/nicht paring (overgrootouder)");
        const dogs3 = [
            { id: 1, naam: "Overgrootouder", vaderId: null, moederId: null },
            { id: 2, naam: "A", vaderId: null, moederId: null },
            { id: 3, naam: "B", vaderId: null, moederId: null },
            { id: 4, naam: "C", vaderId: null, moederId: null },
            { id: 5, naam: "Opa1", vaderId: 1, moederId: 2 },
            { id: 6, naam: "Oma1", vaderId: 3, moederId: 4 },
            { id: 7, naam: "Opa2", vaderId: 1, moederId: 4 },
            { id: 8, naam: "Oma2", vaderId: 2, moederId: 3 },
            { id: 9, naam: "Vader", vaderId: 5, moederId: 6 },
            { id: 10, naam: "Moeder", vaderId: 7, moederId: 8 },
            { id: 11, naam: "Pup", vaderId: 9, moederId: 10 }
        ];
        
        const calc3 = new COICalculator(dogs3);
        const res3 = calc3.calculateCOI(11);
        console.log(`   Verwacht: 6.25%`);
        console.log(`   Resultaat: ${res3.coiAllGen}%`);
        console.log(`   ✅ ${Math.abs(parseFloat(res3.coiAllGen) - 6.25) < 0.1 ? "CORRECT" : "FOUT"}`);
        
        // TEST 4: HALF BROER/ZUS PARING (moet 12.5% zijn)
        console.log("\nTEST 4: Half broer/zus paring");
        const dogs4 = [
            { id: 1, naam: "Gemeenschappelijke ouder", vaderId: null, moederId: null },
            { id: 2, naam: "Ouder A", vaderId: null, moederId: null },
            { id: 3, naam: "Ouder B", vaderId: null, moederId: null },
            { id: 4, naam: "HalfBroer", vaderId: 1, moederId: 2 },
            { id: 5, naam: "HalfZus", vaderId: 1, moederId: 3 },
            { id: 6, naam: "Pup", vaderId: 4, moederId: 5 }
        ];
        
        const calc4 = new COICalculator(dogs4);
        const res4 = calc4.calculateCOI(6);
        console.log(`   Verwacht: 12.5%`);
        console.log(`   Resultaat: ${res4.coiAllGen}%`);
        console.log(`   ✅ ${Math.abs(parseFloat(res4.coiAllGen) - 12.5) < 0.1 ? "CORRECT" : "FOUT"}`);
        
        console.log("\n==========================");
        console.log("✅ Alle tests voltooid");
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
    
    // Toon gedetailleerde berekening
    showCalculationDetails(dogId, maxDepth = 6) {
        dogId = Number(dogId);
        const dog = this.getDogById(dogId);
        
        if (!dog) {
            console.log("Hond niet gevonden");
            return;
        }
        
        console.log(`📊 BEREKENINGSDETAILS voor ${dog.naam}:`);
        console.log(`Maximale diepte: ${maxDepth} generaties`);
        
        if (!dog.vaderId || !dog.moederId) {
            console.log("Geen ouders bekend -> COI = 0%");
            return;
        }
        
        const commonAncestors = this._findCommonAncestorsCorrect(dogId, maxDepth);
        console.log(`\nGemeenschappelijke voorouders: ${commonAncestors.size}`);
        
        for (const ancestorId of commonAncestors) {
            const ancestor = this.getDogById(ancestorId);
            console.log(`\n${ancestor?.naam} (ID: ${ancestorId}):`);
            
            const pathsFather = this._findAllUniquePaths(dog.vaderId, ancestorId, maxDepth - 1);
            const pathsMother = this._findAllUniquePaths(dog.moederId, ancestorId, maxDepth - 1);
            
            console.log(`  Paden via vader: ${pathsFather.length}`);
            console.log(`  Paden via moeder: ${pathsMother.length}`);
            
            for (let i = 0; i < pathsFather.length; i++) {
                for (let j = 0; j < pathsMother.length; j++) {
                    const n1 = pathsFather[i].length;
                    const n2 = pathsMother[j].length;
                    console.log(`  Pad ${i+1}x${j+1}: n1=${n1}, n2=${n2}`);
                }
            }
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V5 geladen met gecorrigeerde formule');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// calc.testCOICalculation();  // Test eerst de berekening
// const result = calc.calculateCOI(hondId);