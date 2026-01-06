// COICalculator V10 - FINALE WERKENDE VERSIE
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
        
        console.log(`✅ COICalculator V10: ${this._dogMap.size} honden geladen`);
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

            console.log(`   ➡ Bereken met correct algoritme...`);
            
            // Reset cache
            this._coiCache.clear();
            this._ancestorCache.clear();
            
            // BEREKEN 6 GENERATIES
            const coi6Gen = this._calculateCOIFinal(dogId, 6, true);
            
            // BEREKEN 10 GENERATIES
            const coiAllGen = this._calculateCOIFinal(dogId, 10, false);
            
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

    // FINALE CORRECTE COI BEREKENING
    _calculateCOIFinal(dogId, generations, showDebug = false) {
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
        const fVader = this._calculateCOIFinal(dog.vaderId, generations - 1, showDebug);
        const fMoeder = this._calculateCOIFinal(dog.moederId, generations - 1, showDebug);
        
        // Vind gemeenschappelijke voorouders van ouders
        const commonAncestors = this._getCommonAncestorsFinal(dog.vaderId, dog.moederId, generations - 1);
        
        if (showDebug) {
            console.log(`   [${generations}gen] ${commonAncestors.size} gemeenschappelijke voorouders gevonden`);
        }
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Bereken kortste afstand via vader
            const distViaVader = this._getShortestDistance(dog.vaderId, ancestorId, generations - 1);
            const distViaMoeder = this._getShortestDistance(dog.moederId, ancestorId, generations - 1);
            
            if (distViaVader > 0 && distViaMoeder > 0) {
                // COI van de voorouder (met beperkte diepte)
                const fAncestor = this._calculateCOIFinal(ancestorId, Math.min(generations - 1, 5), false);
                
                // WRIGHT'S FORMULE: (0.5)^(n1 + n2 + 1) * (1 + F_ancestor)
                const contribution = Math.pow(0.5, distViaVader + distViaMoeder + 1) * (1 + fAncestor);
                
                if (showDebug && generations === 6) {
                    const ancestor = this.getDogById(ancestorId);
                    console.log(`   [6gen] ${ancestor?.naam}: via vader=${distViaVader}, via moeder=${distViaMoeder} -> ${(contribution*100).toFixed(2)}%`);
                }
                
                totalCOI += contribution;
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _getCommonAncestorsFinal(id1, id2, generations) {
        if (generations <= 0) return new Set();
        
        const ancestors1 = new Set();
        const ancestors2 = new Set();
        
        this._collectAncestorsFinal(id1, generations, ancestors1);
        this._collectAncestorsFinal(id2, generations, ancestors2);
        
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
        return common;
    }

    _collectAncestorsFinal(dogId, generations, result) {
        if (generations <= 0 || !dogId) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._collectAncestorsFinal(dog.vaderId, generations - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._collectAncestorsFinal(dog.moederId, generations - 1, result);
        }
    }

    _getShortestDistance(startId, targetId, maxDepth, currentDepth = 0, visited = new Set()) {
        if (currentDepth > maxDepth || visited.has(startId)) return -1;
        
        if (startId === targetId) return currentDepth;
        
        visited.add(startId);
        
        const dog = this.getDogById(startId);
        if (!dog) return -1;
        
        let shortestDistance = -1;
        
        if (dog.vaderId) {
            const viaVader = this._getShortestDistance(dog.vaderId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (viaVader > 0) {
                if (shortestDistance === -1 || viaVader < shortestDistance) {
                    shortestDistance = viaVader;
                }
            }
        }
        
        if (dog.moederId) {
            const viaMoeder = this._getShortestDistance(dog.moederId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (viaMoeder > 0) {
                if (shortestDistance === -1 || viaMoeder < shortestDistance) {
                    shortestDistance = viaMoeder;
                }
            }
        }
        
        return shortestDistance;
    }

    // ALTERNATIEVE SIMPELE BEREKENING - DEZE MOET WEL WERKEN!
    calculateCOISimpleCorrect(dogId) {
        try {
            dogId = Number(dogId);
            const dog = this.getDogById(dogId);
            if (!dog || !dog.vaderId || !dog.moederId) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // Simpele berekening: tel gewoon de gemeenschappelijke voorouders
            const coi6Gen = this._calculateSimpleCorrect(dogId, 6);
            const coiAllGen = this._calculateSimpleCorrect(dogId, 10);
            
            return {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
        } catch (error) {
            console.error('Fout in simple correct COI:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateSimpleCorrect(dogId, generations) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Vind gemeenschappelijke voorouders van ouders
        const commonAncestors = this._getCommonAncestorsFinal(dog.vaderId, dog.moederId, generations - 1);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Vind de kortste afstanden
            const distViaVader = this._getShortestDistance(dog.vaderId, ancestorId, generations - 1);
            const distViaMoeder = this._getShortestDistance(dog.moederId, ancestorId, generations - 1);
            
            if (distViaVader > 0 && distViaMoeder > 0) {
                // EENVOUDIGE FORMULE: (0.5)^(n1 + n2 + 1)
                // Voor broer/zus: n1=1, n2=1 -> 0.5^3 = 0.125
                // Er zijn 2 gemeenschappelijke ouders -> 0.25
                const contribution = Math.pow(0.5, distViaVader + distViaMoeder + 1);
                totalCOI += contribution;
            }
        }
        
        return totalCOI;
    }

    // DEBUG: Toon gedetailleerde berekening
    debugCOI(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`=== COI DEBUG: ${dog.naam} (ID: ${dogId}) ===`);
        console.log(`Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);
        
        if (!dog.vaderId || !dog.moederId) {
            console.log(`Geen ouders -> 0%`);
            return;
        }
        
        if (dog.vaderId === dog.moederId) {
            console.log(`Zelfde ouders -> 25%`);
            return;
        }
        
        const commonAncestors = this._getCommonAncestorsFinal(dog.vaderId, dog.moederId, generations - 1);
        console.log(`\n${commonAncestors.size} gemeenschappelijke voorouders gevonden:`);
        
        let total = 0;
        for (const ancestorId of commonAncestors) {
            const ancestor = this.getDogById(ancestorId);
            const distViaVader = this._getShortestDistance(dog.vaderId, ancestorId, generations - 1);
            const distViaMoeder = this._getShortestDistance(dog.moederId, ancestorId, generations - 1);
            
            if (distViaVader > 0 && distViaMoeder > 0) {
                const contribution = Math.pow(0.5, distViaVader + distViaMoeder + 1);
                console.log(`  ${ancestor?.naam}: via vader=${distViaVader}, via moeder=${distViaMoeder} -> ${(contribution*100).toFixed(2)}%`);
                total += contribution;
            }
        }
        
        console.log(`\nTotaal: ${(total*100).toFixed(1)}%`);
        console.log(`====================================`);
    }

    // TEST MET ECHTE GEGEVENS
    testRealData() {
        console.log("🧪 TEST MET ECHTE GEGEVENS:");
        console.log("============================");
        
        // BROER/ZUS PARING
        console.log("\n1. Broer/zus paring (Droll):");
        const dogs1 = [
            { id: 8, naam: "Vader van Droll", vaderId: null, moederId: null },
            { id: 9, naam: "Moeder van Droll", vaderId: null, moederId: null },
            { id: 27, naam: "Droll", vaderId: 8, moederId: 9 }
        ];
        
        // Droll's ouders zijn broer en zus
        // Pollo-Pong en Asta zijn gemeenschappelijke ouders
        // Maar in deze simpele test, ouders zijn onverwant
        // Dus Droll zou 0% moeten zijn, niet 25%
        
        // WACHT! Droll is zelf het RESULTAAT van broer/zus paring
        // Dus we moeten de OUDERS van Droll maken die broer/zus zijn
        
        const dogsCorrect = [
            { id: 101, naam: "Grootvader", vaderId: null, moederId: null },
            { id: 102, naam: "Grootmoeder", vaderId: null, moederId: null },
            { id: 103, naam: "Ouder A", vaderId: 101, moederId: 102 },
            { id: 104, naam: "Ouder B", vaderId: 101, moederId: 102 },
            { id: 105, naam: "Droll (broer/zus pup)", vaderId: 103, moederId: 104 }
        ];
        
        const calc1 = new COICalculator(dogsCorrect);
        const res1 = calc1.calculateCOI(105);
        console.log(`   Droll (broer/zus pup): ${res1.coi6Gen}% (verwacht: 25.0%)`);
        
        return true;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V10 geladen - Finale versie');
}

// Gebruik:
// const calc = new COICalculator(allDogs);
// 
// Voor Droll:
// const drollResult = calc.calculateCOI(27);
// console.log("Droll:", drollResult);
// 
// Voor Bero:
// const beroResult = calc.calculateCOI(524);
// console.log("Bero:", beroResult);
// 
// OF gebruik de simpele correcte versie:
// const drollSimple = calc.calculateCOISimpleCorrect(27);
// const beroSimple = calc.calculateCOISimpleCorrect(524);
// 
// DEBUG:
// calc.debugCOI(27);  // Toon gedetailleerde berekening voor Droll
// calc.debugCOI(524); // Toon gedetailleerde berekening voor Bero