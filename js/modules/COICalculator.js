// COICalculator SIMPLE - WERKENDE VERSIE
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator SIMPLE: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            const cacheKey = `coi_${dogId}`;
            if (this._coiCache.has(cacheKey)) {
                return this._coiCache.get(cacheKey);
            }
            
            const dog = this.getDogById(dogId);
            if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            console.log(`🔍 COI voor ${dog.naam} (ID: ${dog.id})`);
            
            // Basisgevallen
            if (!dog.vaderId || !dog.moederId) {
                const result = { coi6Gen: '0.0', coiAllGen: '0.0' };
                this._coiCache.set(cacheKey, result);
                return result;
            }
            
            if (dog.vaderId === dog.moederId) {
                const result = { coi6Gen: '25.0', coiAllGen: '25.0' };
                this._coiCache.set(cacheKey, result);
                return result;
            }
            
            // SIMPELE MAAR WERKENDE BEREKENING
            const coi6Gen = this._calculateCOISimple(dogId, 6);
            const coiAllGen = this._calculateCOISimple(dogId, 25);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            
            this._coiCache.set(cacheKey, result);
            return result;
            
        } catch (error) {
            console.error('❌ Fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // SIMPELE MAAR WERKENDE BEREKENING
    _calculateCOISimple(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `simple_${dogId}_${maxDepth}`;
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
        
        // 1. Verzamel voorouders van vader (alleen unieke)
        const vaderAncestors = this._getUniqueAncestors(dog.vaderId, maxDepth);
        // 2. Verzamel voorouders van moeder (alleen unieke)
        const moederAncestors = this._getUniqueAncestors(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        
        // 3. Voor elke gemeenschappelijke voorouder
        for (const [ancestorId, vDepth] of vaderAncestors.entries()) {
            if (moederAncestors.has(ancestorId)) {
                const mDepth = moederAncestors.get(ancestorId);
                
                // FORMULE: (1/2)^(vDepth + mDepth + 1)
                const contribution = Math.pow(0.5, vDepth + mDepth + 1);
                totalCOI += contribution;
                
                // Debug
                if (maxDepth === 6 && contribution > 0.001) {
                    const ancestorDog = this.getDogById(ancestorId);
                    console.log(`   ${ancestorDog?.naam}: V${vDepth}+M${mDepth} = ${(contribution*100).toFixed(2)}%`);
                }
            }
        }
        
        // Maximaal 100%
        if (totalCOI > 1.0) totalCOI = 1.0;
        
        console.log(`   Totaal ${maxDepth}gen: ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verzamel unieke voorouders met KORTSTE diepte
    _getUniqueAncestors(dogId, maxDepth, currentDepth = 1, result = new Map(), visited = new Set()) {
        if (currentDepth > maxDepth || !dogId || visited.has(dogId)) {
            return result;
        }
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        // Vader toevoegen (alleen als we hem nog niet hebben, of kortere diepte)
        if (dog.vaderId) {
            const existingDepth = result.get(dog.vaderId);
            if (!existingDepth || currentDepth < existingDepth) {
                result.set(dog.vaderId, currentDepth);
            }
            
            this._getUniqueAncestors(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        // Moeder toevoegen (alleen als we haar nog niet hebben, of kortere diepte)
        if (dog.moederId) {
            const existingDepth = result.get(dog.moederId);
            if (!existingDepth || currentDepth < existingDepth) {
                result.set(dog.moederId, currentDepth);
            }
            
            this._getUniqueAncestors(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    // DIRECTE RELATIE CHECK
    checkDirectRelationship(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return null;
        
        // Zelfde ouders
        if (dog.vaderId === dog.moederId) return { type: 'zelfde ouders', coi: 25.0 };
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        if (!vader || !moeder) return null;
        
        // Ouders zijn volle broer/zus
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            return { type: 'ouders volle broer/zus', coi: 25.0 };
        }
        
        // Ouders zijn half broer/zus
        let sharedParents = 0;
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) sharedParents++;
        if (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) sharedParents++;
        
        if (sharedParents === 1) return { type: 'ouders half broer/zus', coi: 12.5 };
        if (sharedParents === 2) return { type: 'ouders volle broer/zus', coi: 25.0 };
        
        // Grootouders gemeenschappelijk
        const vaderGrandparents = [vader.vaderId, vader.moederId].filter(Boolean);
        const moederGrandparents = [moeder.vaderId, moeder.moederId].filter(Boolean);
        
        let sharedGrandparents = 0;
        for (const gp of vaderGrandparents) {
            if (moederGrandparents.includes(gp)) sharedGrandparents++;
        }
        
        if (sharedGrandparents === 1) return { type: '1 gedeelde grootouder', coi: 6.25 };
        if (sharedGrandparents === 2) return { type: '2 gedeelde grootouders', coi: 12.5 };
        
        return { type: 'geen directe relatie', coi: 0 };
    }

    // TOON ANALYSE
    analyze(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`\n=== ANALYSE VOOR ${dog.naam} (${dog.id}) ===`);
        
        // Directe relatie
        const direct = this.checkDirectRelationship(dogId);
        if (direct) {
            console.log(`Directe relatie: ${direct.type}`);
            console.log(`Verwachte COI: ${direct.coi.toFixed(1)}%`);
        }
        
        // Bereken COI
        const result = this.calculateCOI(dogId);
        
        // Toon ouders
        if (dog.vaderId && dog.moederId) {
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (vader && moeder) {
                console.log(`\nOuders:`);
                console.log(`- Vader: ${vader.naam} (${vader.id})`);
                console.log(`- Moeder: ${moeder.naam} (${moeder.id})`);
                
                // Check voor gemeenschappelijke voorouders in ouders
                if (vader.vaderId === moeder.vaderId) {
                    const grootvader = this.getDogById(vader.vaderId);
                    console.log(`  ♂️ Gedeelde grootvader: ${grootvader?.naam || vader.vaderId}`);
                }
                if (vader.moederId === moeder.moederId) {
                    const grootmoeder = this.getDogById(vader.moederId);
                    console.log(`  ♀️ Gedeelde grootmoeder: ${grootmoeder?.naam || vader.moederId}`);
                }
            }
        }
        
        console.log(`\nCOI resultaat:`);
        console.log(`- 6 generaties: ${result.coi6Gen}%`);
        console.log(`- Alle generaties: ${result.coiAllGen}%`);
        
        // Interpretatie
        const coi = parseFloat(result.coiAllGen);
        if (coi === 0) console.log(`Interpretatie: Geen inteelt`);
        else if (coi < 6.25) console.log(`Interpretatie: Zeer laag (< 1/16)`);
        else if (coi < 12.5) console.log(`Interpretatie: Laag (< 1/8)`);
        else if (coi < 25) console.log(`Interpretatie: Matig (< 1/4)`);
        else console.log(`Interpretatie: Hoog (≥ 1/4)`);
        
        console.log(`===================================`);
        
        return result;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator SIMPLE - WERKENDE VERSIE');
    
    // Test de werkelijke waarden
    window.testRealistic = function(dogs) {
        const calculator = new COICalculator(dogs);
        
        console.log('=== REALISTISCHE COI TEST ===');
        
        // Test gevallen
        const testCases = [
            { id: 27, name: 'Droll', expected: '25% (ouders volle broer/zus)' },
            { id: 29, name: 'Erle-Lu', expected: '12.5% (ouders half broer/zus)' },
            { id: 68, name: 'Katinka', expected: '~37.5%' },
            { id: 86, name: 'Chris', expected: '~5-15%' },
            { id: 8, name: 'Brumbo', expected: '0%' },
            { id: 9, name: 'Berit', expected: '0%' }
        ];
        
        for (const test of testCases) {
            console.log(`\n--- ${test.name} (ID: ${test.id}) ---`);
            console.log(`Verwacht: ${test.expected}`);
            calculator.analyze(test.id);
        }
        
        return true;
    };
}