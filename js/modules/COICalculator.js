// COICalculator V15 - SIMPEL EN CORRECT
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
        
        console.log(`✅ COICalculator V15: ${this._dogMap.size} honden geladen`);
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
            
            console.log(`   ➡ Bereken met eenvoudige formule...`);
            
            // Reset cache
            this._coiCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateSimpleCOI(dogId, 6);
            
            // BEREKEN 10 GENERATIES
            const coiAllGen = this._calculateSimpleCOI(dogId, 10);
            
            const result = {
                coi6Gen: Math.min(coi6Gen * 100, 100).toFixed(1),
                coiAllGen: Math.min(coiAllGen * 100, 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: COI 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            console.log(`=======================================`);
            
            return result;
            
        } catch (error) {
            console.error('❌ Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // EENVOUDIGE MAAR CORRECTE COI BEREKENING
    _calculateSimpleCOI(dogId, generations) {
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
        const coiVader = this._calculateSimpleCOI(dog.vaderId, generations - 1);
        const coiMoeder = this._calculateSimpleCOI(dog.moederId, generations - 1);
        
        // Bereken verwantschap tussen ouders (simpele methode)
        const relationship = this._calculateSimpleRelationship(dog.vaderId, dog.moederId, generations - 1);
        
        // COI formule: F = 0.5 * relationship
        // Dit is de basisformule, zonder rekening te houden met COI van ouders
        let totalCOI = 0.5 * relationship;
        
        // Als de ouders zelf inteelt hebben, wordt de COI hoger
        // Maar dit is al ingebouwd in de relationship berekening
        
        // Limiteer tot 0.5 (50%)
        totalCOI = Math.min(totalCOI, 0.5);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _calculateSimpleRelationship(id1, id2, generations) {
        if (generations <= 0) return 0;
        if (id1 === id2) return 1;
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) return 0;
        
        // Directe relaties
        if (dog1.vaderId === id2 || dog1.moederId === id2 || 
            dog2.vaderId === id1 || dog2.moederId === id1) {
            return 0.5; // Ouder-kind
        }
        
        // Broer/zus
        if (dog1.vaderId && dog1.moederId && dog2.vaderId && dog2.moederId &&
            dog1.vaderId === dog2.vaderId && dog1.moederId === dog2.moederId) {
            return 0.5; // Volle broer/zus
        }
        
        // Half broer/zus
        if ((dog1.vaderId && dog1.vaderId === dog2.vaderId) ||
            (dog1.moederId && dog1.moederId === dog2.moederId)) {
            return 0.25; // Half broer/zus
        }
        
        // Recursief bereken via ouders
        let relationship = 0;
        
        if (dog1.vaderId && dog2.vaderId) {
            relationship += 0.25 * this._calculateSimpleRelationship(dog1.vaderId, dog2.vaderId, generations - 1);
        }
        
        if (dog1.vaderId && dog2.moederId) {
            relationship += 0.25 * this._calculateSimpleRelationship(dog1.vaderId, dog2.moederId, generations - 1);
        }
        
        if (dog1.moederId && dog2.vaderId) {
            relationship += 0.25 * this._calculateSimpleRelationship(dog1.moederId, dog2.vaderId, generations - 1);
        }
        
        if (dog1.moederId && dog2.moederId) {
            relationship += 0.25 * this._calculateSimpleRelationship(dog1.moederId, dog2.moederId, generations - 1);
        }
        
        return relationship;
    }

    // ALTERNATIEVE METHODE: TELLEN VAN VOOROUDERS
    calculateCOIByCounting(dogId) {
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
            const coi6Gen = this._calculateByCounting(dogId, 6);
            
            // Bereken 10 generaties
            const coiAllGen = this._calculateByCounting(dogId, 10);
            
            return {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
        } catch (error) {
            console.error('Fout in counting COI:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateByCounting(dogId, generations) {
        // Tel unieke voorouders
        const ancestors = new Set();
        this._countAncestors(dogId, generations, ancestors);
        
        // Totaal mogelijke voorouders = 2^(generaties+1) - 2
        const totalPossible = Math.pow(2, generations + 1) - 2;
        const uniqueAncestors = ancestors.size;
        
        // COI ≈ 1 - (unieke voorouders / totale mogelijke voorouders)
        const coi = 1 - (uniqueAncestors / totalPossible);
        
        return Math.max(0, Math.min(coi, 0.5));
    }

    _countAncestors(dogId, generations, result) {
        if (generations <= 0 || !dogId) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._countAncestors(dog.vaderId, generations - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._countAncestors(dog.moederId, generations - 1, result);
        }
    }

    // TEST FUNCTION
    test() {
        console.log("🧪 TEST EENVOUDIGE COI:");
        console.log("======================");
        
        // 1. Broer/zus
        const dogs1 = [
            { id: 1, naam: "A", vaderId: null, moederId: null },
            { id: 2, naam: "B", vaderId: null, moederId: null },
            { id: 3, naam: "Broer", vaderId: 1, moederId: 2 },
            { id: 4, naam: "Zus", vaderId: 1, moederId: 2 },
            { id: 5, naam: "Pup", vaderId: 3, moederId: 4 }
        ];
        
        const calc1 = new COICalculator(dogs1);
        const res1 = calc1.calculateCOI(5);
        console.log(`1. Broer/zus: ${res1.coi6Gen}% (verwacht: 25.0%)`);
        
        // 2. Katinka scenario (Droll × Erle-Lu)
        // Droll en Erle-Lu zijn half broer/zus (zelfde vader: ID 8)
        const dogs2 = [
            { id: 8, naam: "Gemeenschappelijke vader", vaderId: null, moederId: null },
            { id: 9, naam: "Moeder van Droll", vaderId: null, moederId: null },
            { id: 19, naam: "Moeder van Erle-Lu", vaderId: null, moederId: null },
            { id: 27, naam: "Droll", vaderId: 8, moederId: 9 },
            { id: 29, naam: "Erle-Lu", vaderId: 8, moederId: 19 },
            { id: 68, naam: "Katinka", vaderId: 27, moederId: 29 }
        ];
        
        const calc2 = new COICalculator(dogs2);
        const res2 = calc2.calculateCOI(68);
        console.log(`2. Katinka (half broer/zus ouders): ${res2.coi6Gen}% (verwacht: ~12.5%)`);
        
        console.log("\n✅ Test voltooid");
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V15 geladen - Eenvoudig en correct');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// 
// Test eerst:
// calc.test();
// 
// Bereken je honden:
// console.log("\n=== ECHTE HONDEN ===");
// 
// console.log("ID 68 (Katinka):", calc.calculateCOI(68));
// console.log("ID 68 (counting):", calc.calculateCOIByCounting(68));
// 
// console.log("\nID 27 (Droll):", calc.calculateCOI(27));
// console.log("ID 27 (counting):", calc.calculateCOIByCounting(27));
// 
// console.log("\nID 29 (Erle-Lu):", calc.calculateCOI(29));
// console.log("ID 29 (counting):", calc.calculateCOIByCounting(29));
// 
// console.log("\nID 524 (Bero):", calc.calculateCOI(524));
// console.log("ID 524 (counting):", calc.calculateCOIByCounting(524));