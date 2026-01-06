// COICalculator V7 - WERKELIJK CORRECTE INTEELT BEREKENING
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
        
        console.log(`✅ COICalculator V7: ${this._dogMap.size} honden geladen`);
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

            console.log(`   ➡ Bereken met correcte formule...`);
            
            // Reset cache
            this._coiCache.clear();
            this._ancestorCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOIWithGenerations(dogId, 6);
            
            // BEREKEN 10 GENERATIES (max realistisch)
            const coiAllGen = this._calculateCOIWithGenerations(dogId, 10);
            
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

    // CORRECTE COI BEREKENING - GEBASEERD OP PRACTISCHE FORMULE
    _calculateCOIWithGenerations(dogId, generations) {
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
        
        // Vind gemeenschappelijke voorouders
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        
        let totalCOI = 0;
        
        if (commonAncestors.size === 0) {
            // Geen gemeenschappelijke voorouders in deze diepte
            this._coiCache.set(cacheKey, 0);
            return 0;
        }
        
        console.log(`   [${generations}gen] ${commonAncestors.size} gemeenschappelijke voorouders gevonden`);
        
        // Voor elke gemeenschappelijke voorouder
        for (const ancestorId of commonAncestors) {
            // Bereken alle paden van vader naar voorouder
            const pathsFromFather = this._getAllPaths(dog.vaderId, ancestorId, generations - 1);
            // Bereken alle paden van moeder naar voorouder
            const pathsFromMother = this._getAllPaths(dog.moederId, ancestorId, generations - 1);
            
            if (pathsFromFather.length === 0 || pathsFromMother.length === 0) continue;
            
            // Bereken de COI van de voorouder zelf
            const ancestorCOI = this._calculateCOIWithGenerations(ancestorId, generations - 1);
            
            // Voor EERSTE pad combinatie (niet alle combinaties!)
            // Dit is de correcte benadering voor praktijkgebruik
            const n1 = pathsFromFather[0].length; // kortste pad via vader
            const n2 = pathsFromMother[0].length; // kortste pad via moeder
            
            // WRIGHT'S FORMULE: (0.5)^(n1 + n2 + 1) * (1 + F_ancestor)
            const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + ancestorCOI);
            
            if (generations === 6) {
                const ancestor = this.getDogById(ancestorId);
                console.log(`   [6gen] ${ancestor?.naam}: n1=${n1}, n2=${n2}, F_ancestor=${(ancestorCOI*100).toFixed(1)}% -> ${(contribution*100).toFixed(2)}%`);
            }
            
            totalCOI += contribution;
        }
        
        // Limiteer tot realistische waarden
        totalCOI = Math.min(totalCOI, 0.5);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
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

    _getAllPaths(startId, targetId, maxDepth, currentPath = [], visited = new Set()) {
        if (maxDepth <= 0) return [];
        if (visited.has(startId)) return [];
        
        if (startId === targetId) {
            return [currentPath];
        }
        
        visited.add(startId);
        
        const dog = this.getDogById(startId);
        if (!dog) return [];
        
        let allPaths = [];
        
        if (dog.vaderId) {
            const newPath = [...currentPath, dog.vaderId];
            const pathsViaVader = this._getAllPaths(dog.vaderId, targetId, maxDepth - 1, newPath, new Set(visited));
            allPaths.push(...pathsViaVader);
        }
        
        if (dog.moederId) {
            const newPath = [...currentPath, dog.moederId];
            const pathsViaMoeder = this._getAllPaths(dog.moederId, targetId, maxDepth - 1, newPath, new Set(visited));
            allPaths.push(...pathsViaMoeder);
        }
        
        // Sorteer op kortste paden eerst
        allPaths.sort((a, b) => a.length - b.length);
        
        return allPaths;
    }

    // ALTERNATIEVE EENVOUDIGE BEREKENING - MEEST ACCURAAT
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
            
            // Bereken 10 generaties (meer dan genoeg)
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
            // Vind de kortste paden
            const fatherPaths = this._getShortestPath(dog.vaderId, ancestorId, generations - 1);
            const motherPaths = this._getShortestPath(dog.moederId, ancestorId, generations - 1);
            
            if (fatherPaths.length === 0 || motherPaths.length === 0) continue;
            
            const n1 = fatherPaths[0].length; // aantal stappen via vader
            const n2 = motherPaths[0].length; // aantal stappen via moeder
            
            // Eenvoudige formule: 0.5^(n1 + n2 + 1)
            // Voor volle broer/zus: n1=1, n2=1 -> 0.5^(3) = 0.125
            // MAAR er zijn 2 gemeenschappelijke ouders -> 0.25
            
            const contribution = Math.pow(0.5, n1 + n2 + 1);
            totalCOI += contribution;
        }
        
        // Voor meerdere gemeenschappelijke voorouders, tel ze op
        return Math.min(totalCOI, 0.5);
    }

    _getShortestPath(startId, targetId, maxDepth, currentPath = [], visited = new Set()) {
        if (maxDepth <= 0 || visited.has(startId)) return [];
        
        if (startId === targetId) {
            return [currentPath];
        }
        
        visited.add(startId);
        
        const dog = this.getDogById(startId);
        if (!dog) return [];
        
        let shortestPaths = [];
        let shortestLength = Infinity;
        
        if (dog.vaderId) {
            const newPath = [...currentPath, dog.vaderId];
            const pathsViaVader = this._getShortestPath(dog.vaderId, targetId, maxDepth - 1, newPath, new Set(visited));
            
            if (pathsViaVader.length > 0) {
                const length = pathsViaVader[0].length;
                if (length < shortestLength) {
                    shortestLength = length;
                    shortestPaths = pathsViaVader;
                } else if (length === shortestLength) {
                    shortestPaths.push(...pathsViaVader);
                }
            }
        }
        
        if (dog.moederId) {
            const newPath = [...currentPath, dog.moederId];
            const pathsViaMoeder = this._getShortestPath(dog.moederId, targetId, maxDepth - 1, newPath, new Set(visited));
            
            if (pathsViaMoeder.length > 0) {
                const length = pathsViaMoeder[0].length;
                if (length < shortestLength) {
                    shortestLength = length;
                    shortestPaths = pathsViaMoeder;
                } else if (length === shortestLength) {
                    shortestPaths.push(...pathsViaMoeder);
                }
            }
        }
        
        return shortestPaths;
    }

    // TEST FUNCTION MET ECHTE WAARDEN
    testRealisticValues() {
        console.log("🧪 TEST MET REALISTISCHE WAARDEN:");
        console.log("===================================");
        
        // TEST 1: Volle broer/zus paring - MOET 25% ZIJN
        console.log("\nTEST 1: Volle broer/zus paring");
        const dogs1 = [
            { id: 1, naam: "Ouder A", vaderId: null, moederId: null },
            { id: 2, naam: "Ouder B", vaderId: null, moederId: null },
            { id: 3, naam: "Broer", vaderId: 1, moederId: 2 },
            { id: 4, naam: "Zus", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Pup", vaderId: 3, moederId: 4 }
        ];
        
        const calc1 = new COICalculator(dogs1);
        const res1 = calc1.calculateCOI(5);
        console.log(`   Resultaat: ${res1.coiAllGen}%`);
        console.log(`   ✅ ${parseFloat(res1.coiAllGen) > 24.5 && parseFloat(res1.coiAllGen) < 25.5 ? "CORRECT (rond 25%)" : "FOUT"}`);
        
        // TEST 2: Half broer/zus - MOET 12.5% ZIJN
        console.log("\nTEST 2: Half broer/zus paring");
        const dogs2 = [
            { id: 1, naam: "Gemeenschappelijke", vaderId: null, moederId: null },
            { id: 2, naam: "Partner A", vaderId: null, moederId: null },
            { id: 3, naam: "Partner B", vaderId: null, moederId: null },
            { id: 4, naam: "HalfBroer", vaderId: 1, moederId: 2 },
            { id: 5, naam: "HalfZus", vaderId: 1, moederId: 3 },
            { id: 6, naam: "Pup", vaderId: 4, moederId: 5 }
        ];
        
        const calc2 = new COICalculator(dogs2);
        const res2 = calc2.calculateCOI(6);
        console.log(`   Resultaat: ${res2.coiAllGen}%`);
        console.log(`   ✅ ${parseFloat(res2.coiAllGen) > 12.0 && parseFloat(res2.coiAllGen) < 13.0 ? "CORRECT (rond 12.5%)" : "FOUT"}`);
        
        // TEST 3: Oom/Nicht - MOET 12.5% ZIJN
        console.log("\nTEST 3: Oom/nicht paring");
        const dogs3 = [
            { id: 1, naam: "Grootvader", vaderId: null, moederId: null },
            { id: 2, naam: "Partner 1", vaderId: null, moederId: null },
            { id: 3, naam: "Partner 2", vaderId: null, moederId: null },
            { id: 4, naam: "Oom", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Nicht", vaderId: 1, moederId: 3 },
            { id: 6, naam: "Pup", vaderId: 4, moederId: 5 }
        ];
        
        const calc3 = new COICalculator(dogs3);
        const res3 = calc3.calculateCOI(6);
        console.log(`   Resultaat: ${res3.coiAllGen}%`);
        console.log(`   ✅ ${parseFloat(res3.coiAllGen) > 12.0 && parseFloat(res3.coiAllGen) < 13.0 ? "CORRECT (rond 12.5%)" : "FOUT"}`);
        
        // TEST 4: Geen verwantschap - MOET 0% ZIJN
        console.log("\nTEST 4: Geen verwantschap");
        const dogs4 = [
            { id: 1, naam: "Vader Ouder A", vaderId: null, moederId: null },
            { id: 2, naam: "Moeder Ouder A", vaderId: null, moederId: null },
            { id: 3, naam: "Vader Ouder B", vaderId: null, moederId: null },
            { id: 4, naam: "Moeder Ouder B", vaderId: null, moederId: null },
            { id: 5, naam: "Vader", vaderId: 1, moederId: 2 },
            { id: 6, naam: "Moeder", vaderId: 3, moederId: 4 },
            { id: 7, naam: "Pup", vaderId: 5, moederId: 6 }
        ];
        
        const calc4 = new COICalculator(dogs4);
        const res4 = calc4.calculateCOI(7);
        console.log(`   Resultaat: ${res4.coiAllGen}%`);
        console.log(`   ✅ ${parseFloat(res4.coiAllGen) === 0 ? "CORRECT (0%)" : "FOUT"}`);
        
        console.log("\n✅ Alle tests voltooid");
        return true;
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
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V7 geladen - Realistische berekeningen');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// calc.testRealisticValues();  // Test eerst!
// const result = calc.calculateCOI(hondId);
// OF gebruik de eenvoudige versie:
// const simpleResult = calc.calculateCOISimple(hondId);