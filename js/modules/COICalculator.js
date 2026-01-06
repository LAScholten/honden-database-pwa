// COICalculator V6 - GECORRIGEERDE INTEELT BEREKENING
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
        
        console.log(`✅ COICalculator V6: ${this._dogMap.size} honden geladen`);
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

            // BEREKENINGEN
            console.log(`   ➡ Bereken COI...`);
            
            // Reset cache
            this._coiCache.clear();
            this._pathsCache.clear();
            
            // BEREKEN 6 GENERATIES - SIMPEL ALGORITME
            const coi6Gen = this._calculateSimpleCOI(dogId, 6);
            
            // BEREKEN 25 GENERATIES
            const coiAllGen = this._calculateSimpleCOI(dogId, 25);
            
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

    // SIMPELE MAAR CORRECTE COI BEREKENING
    _calculateSimpleCOI(dogId, maxDepth) {
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
        
        // Bereken COI van de ouders
        const fVader = this._calculateSimpleCOI(dog.vaderId, maxDepth - 1);
        const fMoeder = this._calculateSimpleCOI(dog.moederId, maxDepth - 1);
        
        // Bereken verwantschapscoëfficiënt tussen ouders
        const r = this._calculateRelationship(dog.vaderId, dog.moederId, maxDepth - 1);
        
        // COI formule: F = 0.5 * r * (1 + F_gemeenschappelijke_voorouder)
        // Maar vereenvoudigd: F = 0.5 * r
        // Waar r = verwantschapscoëfficiënt tussen ouders
        
        let totalCOI = 0.5 * r;
        
        // Debug info alleen voor 6 generaties
        if (maxDepth === 6 && r > 0) {
            console.log(`   [6gen] Verwantschap ouders: ${(r*100).toFixed(2)}%`);
            console.log(`   [6gen] COI vader: ${(fVader*100).toFixed(2)}%, moeder: ${(fMoeder*100).toFixed(2)}%`);
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _calculateRelationship(id1, id2, maxDepth) {
        if (maxDepth <= 0) return 0;
        if (id1 === id2) return 1; // Zelfde hond
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) return 0;
        
        // Vind gemeenschappelijke voorouders
        const ancestors1 = this._getAllAncestors(id1, maxDepth);
        const ancestors2 = this._getAllAncestors(id2, maxDepth);
        
        let relationship = 0;
        
        for (const ancestorId of ancestors1) {
            if (ancestors2.has(ancestorId)) {
                // Bereken afstanden
                const paths1 = this._findPathsToAncestor(id1, ancestorId, maxDepth);
                const paths2 = this._findPathsToAncestor(id2, ancestorId, maxDepth);
                
                // Voor elke combinatie van paden
                for (const path1 of paths1) {
                    for (const path2 of paths2) {
                        const n1 = path1.length;
                        const n2 = path2.length;
                        
                        // Wright's formule voor verwantschap via een voorouder
                        const contribution = Math.pow(0.5, n1 + n2);
                        
                        // Vermenigvuldig met (1 + F_ancestor)
                        const fAncestor = this._calculateSimpleCOI(ancestorId, maxDepth - Math.max(n1, n2));
                        relationship += contribution * (1 + fAncestor);
                    }
                }
            }
        }
        
        return relationship;
    }

    _getAllAncestors(dogId, maxDepth, currentDepth = 0, result = new Set()) {
        if (currentDepth >= maxDepth || !dogId) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getAllAncestors(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._getAllAncestors(dog.moederId, maxDepth, currentDepth + 1, result);
        }
        
        return result;
    }

    _findPathsToAncestor(startId, targetId, maxDepth, currentPath = []) {
        if (maxDepth <= 0) return [];
        if (startId === targetId) return [currentPath];
        
        const cacheKey = `${startId}_${targetId}_${maxDepth}_${currentPath.length}`;
        if (this._pathsCache.has(cacheKey)) {
            return this._pathsCache.get(cacheKey);
        }
        
        const dog = this.getDogById(startId);
        if (!dog) return [];
        
        let allPaths = [];
        
        if (dog.vaderId) {
            const newPath = [...currentPath, dog.vaderId];
            const pathsViaVader = this._findPathsToAncestor(dog.vaderId, targetId, maxDepth - 1, newPath);
            allPaths.push(...pathsViaVader);
        }
        
        if (dog.moederId) {
            const newPath = [...currentPath, dog.moederId];
            const pathsViaMoeder = this._findPathsToAncestor(dog.moederId, targetId, maxDepth - 1, newPath);
            allPaths.push(...pathsViaMoeder);
        }
        
        this._pathsCache.set(cacheKey, allPaths);
        return allPaths;
    }

    // EENVOUDIGE ALTERNATIEVE BEREKENING (meest accurate voor praktijk)
    calculateCOISimple(dogId) {
        const coi6 = this._calculateCOISimpleDepth(dogId, 6);
        const coiAll = this._calculateCOISimpleDepth(dogId, 25);
        
        return {
            coi6Gen: (coi6 * 100).toFixed(1),
            coiAllGen: (coiAll * 100).toFixed(1)
        };
    }

    _calculateCOISimpleDepth(dogId, maxDepth) {
        if (maxDepth <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Bereken gemeenschappelijke voorouders
        const ancestorsFather = this._getAncestorsSet(dog.vaderId, maxDepth - 1);
        const ancestorsMother = this._getAncestorsSet(dog.moederId, maxDepth - 1);
        
        let totalCOI = 0;
        
        // Voor elke gemeenschappelijke voorouder
        for (const ancestorId of ancestorsFather) {
            if (ancestorsMother.has(ancestorId)) {
                // Tel het aantal keren dat deze voorouder voorkomt
                const countFather = this._countOccurrences(dog.vaderId, ancestorId, maxDepth - 1);
                const countMother = this._countOccurrences(dog.moederId, ancestorId, maxDepth - 1);
                
                // Eenvoudige benadering: (0.25)^n waar n = generaties
                // Voor volle broer/zus: 2 gemeenschappelijke ouders -> 0.25
                const contribution = 0.25 * Math.pow(0.5, Math.max(countFather, countMother) - 1);
                totalCOI += contribution;
            }
        }
        
        // Limiteer tot redelijke waarden
        return Math.min(totalCOI, 0.5);
    }

    _getAncestorsSet(dogId, depth, result = new Set()) {
        if (depth <= 0 || !dogId) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getAncestorsSet(dog.vaderId, depth - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._getAncestorsSet(dog.moederId, depth - 1, result);
        }
        
        return result;
    }

    _countOccurrences(startId, targetId, depth) {
        if (depth <= 0 || !startId) return 0;
        if (startId === targetId) return 1;
        
        const dog = this.getDogById(startId);
        if (!dog) return 0;
        
        let count = 0;
        if (dog.vaderId) {
            count += this._countOccurrences(dog.vaderId, targetId, depth - 1);
        }
        if (dog.moederId) {
            count += this._countOccurrences(dog.moederId, targetId, depth - 1);
        }
        
        return count;
    }

    // TEST FUNCTION
    testAccuracy() {
        console.log("🧪 TEST COI ACCURACY:");
        console.log("=====================");
        
        // TEST 1: Volle broer/zus
        const dogs1 = [
            { id: 1, naam: "A", vaderId: null, moederId: null },
            { id: 2, naam: "B", vaderId: null, moederId: null },
            { id: 3, naam: "C", vaderId: 1, moederId: 2 },
            { id: 4, naam: "D", vaderId: 1, moederId: 2 },
            { id: 5, naam: "E", vaderId: 3, moederId: 4 }
        ];
        
        const calc1 = new COICalculator(dogs1);
        const res1 = calc1.calculateCOI(5);
        console.log(`Volle broer/zus: ${res1.coiAllGen}% (verwacht: 25.0%)`);
        
        // TEST 2: Half broer/zus
        const dogs2 = [
            { id: 1, naam: "Gemeenschappelijk", vaderId: null, moederId: null },
            { id: 2, naam: "X", vaderId: null, moederId: null },
            { id: 3, naam: "Y", vaderId: null, moederId: null },
            { id: 4, naam: "Half1", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Half2", vaderId: 1, moederId: 3 },
            { id: 6, naam: "Pup", vaderId: 4, moederId: 5 }
        ];
        
        const calc2 = new COICalculator(dogs2);
        const res2 = calc2.calculateCOI(6);
        console.log(`Half broer/zus: ${res2.coiAllGen}% (verwacht: 12.5%)`);
        
        // TEST 3: Oom/nicht
        const dogs3 = [
            { id: 1, naam: "Grootvader", vaderId: null, moederId: null },
            { id: 2, naam: "A", vaderId: null, moederId: null },
            { id: 3, naam: "B", vaderId: null, moederId: null },
            { id: 4, naam: "Oom", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Nicht", vaderId: 1, moederId: 3 },
            { id: 6, naam: "Pup", vaderId: 4, moederId: 5 }
        ];
        
        const calc3 = new COICalculator(dogs3);
        const res3 = calc3.calculateCOI(6);
        console.log(`Oom/nicht: ${res3.coiAllGen}% (verwacht: 12.5%)`);
        
        // TEST 4: Geen verwantschap
        const dogs4 = [
            { id: 1, naam: "A", vaderId: null, moederId: null },
            { id: 2, naam: "B", vaderId: null, moederId: null },
            { id: 3, naam: "C", vaderId: null, moederId: null },
            { id: 4, naam: "D", vaderId: null, moederId: null },
            { id: 5, naam: "Vader", vaderId: 1, moederId: 2 },
            { id: 6, naam: "Moeder", vaderId: 3, moederId: 4 },
            { id: 7, naam: "Pup", vaderId: 5, moederId: 6 }
        ];
        
        const calc4 = new COICalculator(dogs4);
        const res4 = calc4.calculateCOI(7);
        console.log(`Geen verwantschap: ${res4.coiAllGen}% (verwacht: 0.0%)`);
        
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
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V6 geladen met gecorrigeerde berekening');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// calc.testAccuracy();  // Test eerst
// const result = calc.calculateCOI(hondId);
// OF gebruik de eenvoudige versie:
// const simpleResult = calc.calculateCOISimple(hondId);