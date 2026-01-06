// COICalculator V11 - FINALE WERKENDE VERSIE
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
        
        console.log(`✅ COICalculator V11: ${this._dogMap.size} honden geladen`);
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
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOIExact(dogId, 6);
            
            // BEREKEN 10 GENERATIES
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

    // EXACTE COI BEREKENING
    _calculateCOIExact(dogId, maxGenerations) {
        if (maxGenerations <= 0) return 0;
        
        const cacheKey = `${dogId}_${maxGenerations}`;
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
        const coiVader = this._calculateCOIExact(dog.vaderId, maxGenerations - 1);
        const coiMoeder = this._calculateCOIExact(dog.moederId, maxGenerations - 1);
        
        // Bereken verwantschap tussen ouders
        const relationship = this._calculateRelationshipExact(dog.vaderId, dog.moederId, maxGenerations - 1);
        
        // COI = 0.5 * verwantschap tussen ouders * (1 + gemiddelde COI van ouders)
        const totalCOI = 0.5 * relationship * (1 + (coiVader + coiMoeder) / 2);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _calculateRelationshipExact(id1, id2, maxGenerations) {
        if (maxGenerations <= 0) return 0;
        if (id1 === id2) return 1;
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) return 0;
        
        // Check voor directe verwantschap
        if (dog1.vaderId === id2 || dog1.moederId === id2 || 
            dog2.vaderId === id1 || dog2.moederId === id1) {
            return 0.5; // Ouder-kind relatie
        }
        
        // Check voor broer/zus
        if (dog1.vaderId && dog1.moederId && dog2.vaderId && dog2.moederId) {
            if (dog1.vaderId === dog2.vaderId && dog1.moederId === dog2.moederId) {
                return 0.5; // Volle broer/zus
            }
            if (dog1.vaderId === dog2.vaderId || dog1.moederId === dog2.moederId ||
                dog1.vaderId === dog2.moederId || dog1.moederId === dog2.vaderId) {
                return 0.25; // Half broer/zus
            }
        }
        
        // Recursief bereken via ouders
        let relationship = 0;
        
        if (dog1.vaderId && dog2.vaderId) {
            relationship += 0.25 * this._calculateRelationshipExact(dog1.vaderId, dog2.vaderId, maxGenerations - 1);
        }
        
        if (dog1.vaderId && dog2.moederId) {
            relationship += 0.25 * this._calculateRelationshipExact(dog1.vaderId, dog2.moederId, maxGenerations - 1);
        }
        
        if (dog1.moederId && dog2.vaderId) {
            relationship += 0.25 * this._calculateRelationshipExact(dog1.moederId, dog2.vaderId, maxGenerations - 1);
        }
        
        if (dog1.moederId && dog2.moederId) {
            relationship += 0.25 * this._calculateRelationshipExact(dog1.moederId, dog2.moederId, maxGenerations - 1);
        }
        
        return relationship;
    }

    // ALTERNATIEVE: EENVOUDIGE BEREKENING OP BASIS VAN PEDIGREE
    calculateCOIPedigree(dogId) {
        try {
            dogId = Number(dogId);
            const dog = this.getDogById(dogId);
            if (!dog || !dog.vaderId || !dog.moederId) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // Simpele berekening: tel unieke voorouders
            const ancestors = new Set();
            this._collectAllAncestorsPedigree(dogId, 6, ancestors);
            
            const totalPossibleAncestors = Math.pow(2, 7) - 2; // 126 voor 6 generaties
            const uniqueAncestors = ancestors.size;
            
            // COI ≈ 1 - (unieke voorouders / totale mogelijke voorouders)
            const coi = 1 - (uniqueAncestors / totalPossibleAncestors);
            
            return {
                coi6Gen: (coi * 100).toFixed(1),
                coiAllGen: (coi * 100).toFixed(1) // Zelfde voor nu
            };
            
        } catch (error) {
            console.error('Fout in pedigree COI:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _collectAllAncestorsPedigree(dogId, depth, result) {
        if (depth <= 0 || !dogId) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._collectAllAncestorsPedigree(dog.vaderId, depth - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._collectAllAncestorsPedigree(dog.moederId, depth - 1, result);
        }
    }

    // DEBUG: Toon stamboom
    debugPedigree(dogId, depth = 3) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`=== PEDIGREE: ${dog.naam} (ID: ${dogId}) ===`);
        this._printPedigree(dogId, 0, depth, '');
        console.log(`====================================`);
    }

    _printPedigree(dogId, currentDepth, maxDepth, prefix) {
        if (currentDepth > maxDepth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        console.log(`${prefix}${dog.naam} (${dog.id}) [vader:${dog.vaderId}, moeder:${dog.moederId}]`);
        
        if (dog.vaderId) {
            this._printPedigree(dog.vaderId, currentDepth + 1, maxDepth, prefix + '  ├─V: ');
        }
        if (dog.moederId) {
            this._printPedigree(dog.moederId, currentDepth + 1, maxDepth, prefix + '  └─M: ');
        }
    }

    // TEST FUNCTIE
    test() {
        console.log("🧪 COI TEST:");
        console.log("============");
        
        // TEST 1: Broer/zus paring
        console.log("\n1. Broer/zus paring:");
        const dogs1 = [
            { id: 1, naam: "Ouder A", vaderId: null, moederId: null },
            { id: 2, naam: "Ouder B", vaderId: null, moederId: null },
            { id: 3, naam: "Broer", vaderId: 1, moederId: 2 },
            { id: 4, naam: "Zus", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Pup", vaderId: 3, moederId: 4 }
        ];
        
        const calc1 = new COICalculator(dogs1);
        const res1 = calc1.calculateCOI(5);
        console.log(`   Resultaat: ${res1.coi6Gen}% (verwacht: 25.0%)`);
        
        // TEST 2: Droll scenario (ouders zijn broer/zus via Pollo-Pong en Asta)
        console.log("\n2. Droll scenario (broer/zus via 2 voorouders):");
        const dogs2 = [
            { id: 101, naam: "Pollo-Pong", vaderId: null, moederId: null },
            { id: 102, naam: "Asta", vaderId: null, moederId: null },
            { id: 8, naam: "Vader van Droll", vaderId: 101, moederId: 102 },
            { id: 9, naam: "Moeder van Droll", vaderId: 101, moederId: 102 },
            { id: 27, naam: "Droll", vaderId: 8, moederId: 9 }
        ];
        
        const calc2 = new COICalculator(dogs2);
        const res2 = calc2.calculateCOI(27);
        console.log(`   Resultaat: ${res2.coi6Gen}% (verwacht: 25.0%)`);
        
        console.log("\n✅ Test voltooid");
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V11 geladen - Exacte berekening');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// 
// Test eerst:
// calc.test();
// 
// Voor Droll:
// const drollResult = calc.calculateCOI(27);
// console.log("Droll:", drollResult);
// 
// Voor Bero:
// const beroResult = calc.calculateCOI(524);
// console.log("Bero:", beroResult);
// 
// Probeer ook pedigree methode:
// const drollPedigree = calc.calculateCOIPedigree(27);
// console.log("Droll (pedigree):", drollPedigree);
// 
// Debug stamboom:
// calc.debugPedigree(27, 3);