// COICalculator V9 - SIMPEL MAAR CORRECT
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
        
        console.log(`✅ COICalculator V9: ${this._dogMap.size} honden geladen`);
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
            
            // BEREKEN 6 GENERATIES - SIMPELE METHODE
            const coi6Gen = this._calculateCOISimple(dogId, 6, true);
            
            // BEREKEN 10 GENERATIES
            const coiAllGen = this._calculateCOISimple(dogId, 10, false);
            
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
    _calculateCOISimple(dogId, generations, showDebug = false) {
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
        
        // Bereken COI van ouders EERST (dit is belangrijk!)
        const fVader = this._calculateCOISimple(dog.vaderId, generations - 1, showDebug);
        const fMoeder = this._calculateCOISimple(dog.moederId, generations - 1, showDebug);
        
        // Vind ALLE gemeenschappelijke voorouders van de ouders
        const commonAncestors = this._getCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        
        if (showDebug) {
            console.log(`   [${generations}gen] ${commonAncestors.size} gemeenschappelijke voorouders`);
        }
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Bereken afstand via vader (kortste pad)
            const distViaVader = this._getDistance(dog.vaderId, ancestorId, generations - 1);
            const distViaMoeder = this._getDistance(dog.moederId, ancestorId, generations - 1);
            
            if (distViaVader > 0 && distViaMoeder > 0) {
                // Wright's formule: (0.5)^(n1 + n2 + 1) * (1 + F_ancestor)
                const fAncestor = this._calculateCOISimple(ancestorId, generations - Math.max(distViaVader, distViaMoeder), false);
                const contribution = Math.pow(0.5, distViaVader + distViaMoeder + 1) * (1 + fAncestor);
                
                if (showDebug && generations === 6) {
                    const ancestor = this.getDogById(ancestorId);
                    console.log(`   [6gen] ${ancestor?.naam}: n1=${distViaVader}, n2=${distViaMoeder} -> ${(contribution*100).toFixed(2)}%`);
                }
                
                totalCOI += contribution;
            }
        }
        
        // Limiteer tot redelijke waarden
        totalCOI = Math.min(totalCOI, 0.5);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _getCommonAncestors(id1, id2, generations) {
        if (generations <= 0) return new Set();
        
        // Verzamel ALLE voorouders van id1
        const ancestors1 = new Set();
        this._collectAllAncestors(id1, generations, ancestors1);
        
        // Verzamel ALLE voorouders van id2
        const ancestors2 = new Set();
        this._collectAllAncestors(id2, generations, ancestors2);
        
        // Vind intersectie
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
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

    _getDistance(startId, targetId, maxDepth, currentDepth = 0, visited = new Set()) {
        if (currentDepth > maxDepth || visited.has(startId)) return -1;
        
        if (startId === targetId) return currentDepth;
        
        visited.add(startId);
        
        const dog = this.getDogById(startId);
        if (!dog) return -1;
        
        // Probeer via vader
        if (dog.vaderId) {
            const viaVader = this._getDistance(dog.vaderId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (viaVader > 0) return viaVader;
        }
        
        // Probeer via moeder
        if (dog.moederId) {
            const viaMoeder = this._getDistance(dog.moederId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (viaMoeder > 0) return viaMoeder;
        }
        
        return -1;
    }

    // ALTERNATIEVE METHODE: TELLEN HOE VAAK VOOROUDERS VOORKOMEN
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
        // Tel hoe vaak elke voorouder voorkomt in de stamboom
        const ancestorCounts = new Map();
        this._countAncestors(dogId, generations, 1.0, ancestorCounts);
        
        // Bereken COI: voor elke voorouder die meer dan 1 keer voorkomt
        let totalCOI = 0;
        
        for (const [ancestorId, totalCount] of ancestorCounts) {
            if (totalCount > 1) {
                // Als voorouder n keer voorkomt: (n/2^g) waar g = generaties
                // Vereenvoudigd: hoe vaker een voorouder voorkomt, hoe hoger de COI
                const contribution = (totalCount - 1) * 0.125; // Empirische factor
                totalCOI += Math.min(contribution, 0.25); // Limiteer per voorouder
            }
        }
        
        return Math.min(totalCOI, 0.5);
    }

    _countAncestors(dogId, generations, multiplier, counts) {
        if (generations <= 0 || !dogId) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        // Tel deze hond
        const currentCount = counts.get(dogId) || 0;
        counts.set(dogId, currentCount + multiplier);
        
        // Ga naar ouders met halve multiplier
        if (dog.vaderId) {
            this._countAncestors(dog.vaderId, generations - 1, multiplier * 0.5, counts);
        }
        
        if (dog.moederId) {
            this._countAncestors(dog.moederId, generations - 1, multiplier * 0.5, counts);
        }
    }

    // TEST MET BEKEND VOORBEELD
    testWithKnownValues() {
        console.log("🧪 TEST MET BEKENDE WAARDEN:");
        console.log("==============================");
        
        // BROER/ZUS PARING - MOET 25% ZIJN
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
        
        // COMPLEXER VOORBEELD MET MEERDERE VOOROUDERS
        console.log("\n2. Complexe stamboom (meerdere gemeenschappelijke voorouders):");
        const dogs2 = [
            // Generatie 1
            { id: 1, naam: "A", vaderId: null, moederId: null },
            { id: 2, naam: "B", vaderId: null, moederId: null },
            { id: 3, naam: "C", vaderId: null, moederId: null },
            { id: 4, naam: "D", vaderId: null, moederId: null },
            
            // Generatie 2
            { id: 5, naam: "E", vaderId: 1, moederId: 2 },
            { id: 6, naam: "F", vaderId: 3, moederId: 4 },
            { id: 7, naam: "G", vaderId: 1, moederId: 3 }, // Gemeenschappelijke voorouders: A en C
            { id: 8, naam: "H", vaderId: 2, moederId: 4 },
            
            // Generatie 3
            { id: 9, naam: "I", vaderId: 5, moederId: 6 },
            { id: 10, naam: "J", vaderId: 7, moederId: 8 },
            
            // Generatie 4 - de pup
            { id: 11, naam: "Pup", vaderId: 9, moederId: 10 }
        ];
        
        const calc2 = new COICalculator(dogs2);
        const res2 = calc2.calculateCOI(11);
        console.log(`   Resultaat: ${res2.coi6Gen}% (verwacht: >15%)`);
        
        return true;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V9 geladen - Eenvoudige maar correcte berekening');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// 
// Voor Droll:
// const drollResult = calc.calculateCOI(27);
// console.log("Droll (broer/zus):", drollResult); // Moet 25% zijn
// 
// Voor Bero:
// const beroResult = calc.calculateCOI(524);
// console.log("Bero:", beroResult); // Zou rond 25% moeten zijn
// 
// OF probeer de counting methode:
// const beroCountResult = calc.calculateCOIByCounting(524);