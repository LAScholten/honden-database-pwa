// COICalculator V12 - MET DETAILED DEBUG
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._relationshipCache = new Map();
        
        // Bouw snelle lookup
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V12: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId, debug = false) {
        try {
            dogId = Number(dogId);
            if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (debug) {
                console.log(`🔍 DETAILED COI berekening voor: ${dog.naam} (ID: ${dog.id})`);
                console.log(`   Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);
            }

            // BASISGEVALLEN
            if (!dog.vaderId || !dog.moederId) {
                if (debug) console.log(`   ➡ Geen ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                if (debug) console.log(`   ➡ Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            if (debug) console.log(`   ➡ Bereken COI...`);
            
            // Reset cache
            this._coiCache.clear();
            this._relationshipCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOIDetailed(dogId, 6, debug);
            
            // BEREKEN 10 GENERATIES
            const coiAllGen = this._calculateCOIDetailed(dogId, 10, debug);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            if (debug) {
                console.log(`✅ ${dog.naam}: COI 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
                console.log(`=======================================`);
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // DETAILED BEREKENING MET DEBUG
    _calculateCOIDetailed(dogId, maxGenerations, debug = false, indent = '') {
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
        
        if (debug) {
            console.log(`${indent}[Gen ${maxGenerations}] ${dog.naam}: vader=${dog.vaderId}, moeder=${dog.moederId}`);
        }
        
        // Bereken COI van ouders
        const coiVader = this._calculateCOIDetailed(dog.vaderId, maxGenerations - 1, debug, indent + '  ');
        const coiMoeder = this._calculateCOIDetailed(dog.moederId, maxGenerations - 1, debug, indent + '  ');
        
        // Bereken verwantschap tussen ouders
        const relationship = this._calculateRelationshipDetailed(dog.vaderId, dog.moederId, maxGenerations - 1, debug, indent);
        
        // COI formule: F = 0.5 * r * (1 + (F_vader + F_moeder)/2)
        const avgParentCOI = (coiVader + coiMoeder) / 2;
        const totalCOI = 0.5 * relationship * (1 + avgParentCOI);
        
        if (debug && maxGenerations >= 5) {
            const vaderDog = this.getDogById(dog.vaderId);
            const moederDog = this.getDogById(dog.moederId);
            console.log(`${indent}  COI ${dog.naam}:`);
            console.log(`${indent}    - COI vader (${vaderDog?.naam}): ${(coiVader*100).toFixed(1)}%`);
            console.log(`${indent}    - COI moeder (${moederDog?.naam}): ${(coiMoeder*100).toFixed(1)}%`);
            console.log(`${indent}    - Verwantschap ouders: ${(relationship*100).toFixed(1)}%`);
            console.log(`${indent}    - Bereken: 0.5 × ${relationship.toFixed(3)} × (1 + ${avgParentCOI.toFixed(3)}) = ${(totalCOI*100).toFixed(1)}%`);
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _calculateRelationshipDetailed(id1, id2, maxGenerations, debug = false, indent = '') {
        if (maxGenerations <= 0) return 0;
        if (id1 === id2) return 1;
        
        const cacheKey = `rel_${id1}_${id2}_${maxGenerations}`;
        if (this._relationshipCache.has(cacheKey)) {
            return this._relationshipCache.get(cacheKey);
        }
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) {
            this._relationshipCache.set(cacheKey, 0);
            return 0;
        }
        
        // Debug info
        if (debug && maxGenerations >= 5) {
            console.log(`${indent}  Verwantschap tussen ${dog1.naam} en ${dog2.naam}:`);
        }
        
        // Check voor directe relaties
        let relationship = 0;
        
        // Ouder-kind
        if (dog1.vaderId === id2 || dog1.moederId === id2 || 
            dog2.vaderId === id1 || dog2.moederId === id1) {
            relationship = 0.5;
            if (debug && maxGenerations >= 5) {
                console.log(`${indent}    -> Ouder-kind: 0.5`);
            }
        }
        // Volle broer/zus
        else if (dog1.vaderId && dog1.moederId && dog2.vaderId && dog2.moederId &&
                 dog1.vaderId === dog2.vaderId && dog1.moederId === dog2.moederId) {
            relationship = 0.5;
            if (debug && maxGenerations >= 5) {
                console.log(`${indent}    -> Volle broer/zus: 0.5`);
                console.log(`${indent}      Gemeenschappelijke ouders: ${dog1.vaderId} en ${dog1.moederId}`);
            }
        }
        // Half broer/zus
        else if (dog1.vaderId && dog2.vaderId && dog1.vaderId === dog2.vaderId) {
            relationship = 0.25;
            if (debug && maxGenerations >= 5) {
                console.log(`${indent}    -> Half broer/zus (zelfde vader): 0.25`);
            }
        }
        else if (dog1.moederId && dog2.moederId && dog1.moederId === dog2.moederId) {
            relationship = 0.25;
            if (debug && maxGenerations >= 5) {
                console.log(`${indent}    -> Half broer/zus (zelfde moeder): 0.25`);
            }
        }
        else {
            // Recursief bereken via ouders
            if (debug && maxGenerations >= 5) {
                console.log(`${indent}    -> Complexe verwantschap, bereken recursief...`);
            }
            
            if (dog1.vaderId && dog2.vaderId) {
                relationship += 0.25 * this._calculateRelationshipDetailed(dog1.vaderId, dog2.vaderId, maxGenerations - 1, debug, indent + '    ');
            }
            
            if (dog1.vaderId && dog2.moederId) {
                relationship += 0.25 * this._calculateRelationshipDetailed(dog1.vaderId, dog2.moederId, maxGenerations - 1, debug, indent + '    ');
            }
            
            if (dog1.moederId && dog2.vaderId) {
                relationship += 0.25 * this._calculateRelationshipDetailed(dog1.moederId, dog2.vaderId, maxGenerations - 1, debug, indent + '    ');
            }
            
            if (dog1.moederId && dog2.moederId) {
                relationship += 0.25 * this._calculateRelationshipDetailed(dog1.moederId, dog2.moederId, maxGenerations - 1, debug, indent + '    ');
            }
            
            if (debug && maxGenerations >= 5) {
                console.log(`${indent}    -> Totaal complexe verwantschap: ${relationship.toFixed(3)}`);
            }
        }
        
        this._relationshipCache.set(cacheKey, relationship);
        return relationship;
    }

    // TEST FUNCTIE VOOR BROER/ZUS
    testBroerZus() {
        console.log("🧪 TEST BROER/ZUS PARING:");
        console.log("=========================");
        
        // Simpele broer/zus paring
        const dogs = [
            { id: 1, naam: "Ouder A", vaderId: null, moederId: null },
            { id: 2, naam: "Ouder B", vaderId: null, moederId: null },
            { id: 3, naam: "Broer", vaderId: 1, moederId: 2 },
            { id: 4, naam: "Zus", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Pup", vaderId: 3, moederId: 4 }
        ];
        
        const calc = new COICalculator(dogs);
        console.log("\n1. Simpele broer/zus paring (ouders geen inteelt):");
        const result1 = calc.calculateCOI(5, true);
        console.log(`   Resultaat: ${result1.coi6Gen}% (verwacht: 25.0%)`);
        
        // Complexere broer/zus (ouders hebben zelf inteelt)
        const dogs2 = [
            { id: 10, naam: "Grootvader", vaderId: null, moederId: null },
            { id: 11, naam: "Grootmoeder", vaderId: null, moederId: null },
            { id: 12, naam: "Grootvader2", vaderId: null, moederId: null },
            { id: 13, naam: "Grootmoeder2", vaderId: null, moederId: null },
            
            // Ouders met inteelt (half broer/zus paring)
            { id: 14, naam: "Ouder Met Inteelt", vaderId: 10, moederId: 11 },
            { id: 15, naam: "Ouder Met Inteelt2", vaderId: 10, moederId: 12 }, // Half broer/zus van 14
            
            // Broer en zus (kinderen van ouders met inteelt)
            { id: 16, naam: "Broer2", vaderId: 14, moederId: 15 },
            { id: 17, naam: "Zus2", vaderId: 14, moederId: 15 },
            
            // Pup uit broer/zus paring
            { id: 18, naam: "Pup2", vaderId: 16, moederId: 17 }
        ];
        
        console.log("\n2. Broer/zus paring (ouders hebben zelf inteelt):");
        const calc2 = new COICalculator(dogs2);
        const result2 = calc2.calculateCOI(18, true);
        console.log(`   Resultaat: ${result2.coi6Gen}% (verwacht: >25%)`);
        
        console.log("\n✅ Test voltooid");
    }

    // CHECK OF HOND BROER/ZUS IS
    isBroerZusParing(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return false;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) return false;
        
        // Check of ouders volle broer/zus zijn
        return (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                vader.moederId && moeder.moederId && vader.moederId === moeder.moederId);
    }

    // TOON PEDIGREE MET VERWANTSCHAP
    showPedigreeWithCOI(dogId, depth = 3) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`=== PEDIGREE MET COI: ${dog.naam} (ID: ${dogId}) ===`);
        this._printPedigreeWithCOI(dogId, 0, depth, '');
        console.log(`============================================`);
    }

    _printPedigreeWithCOI(dogId, currentDepth, maxDepth, prefix) {
        if (currentDepth > maxDepth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        // Bereken COI voor deze hond
        const coi = this._calculateCOIDetailed(dogId, 6, false) * 100;
        
        console.log(`${prefix}${dog.naam} (${dog.id}) [COI: ${coi.toFixed(1)}%]`);
        
        if (dog.vaderId) {
            this._printPedigreeWithCOI(dog.vaderId, currentDepth + 1, maxDepth, prefix + '  ├─V: ');
        }
        if (dog.moederId) {
            this._printPedigreeWithCOI(dog.moederId, currentDepth + 1, maxDepth, prefix + '  └─M: ');
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V12 geladen - Met detailed debug');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// 
// Test eerst:
// calc.testBroerZus();
// 
// Voor Droll met debug:
// const drollResult = calc.calculateCOI(27, true);
// 
// Check of Droll broer/zus is:
// console.log("Is Droll broer/zus?", calc.isBroerZusParing(27));
// 
// Toon pedigree met COI:
// calc.showPedigreeWithCOI(27, 3);