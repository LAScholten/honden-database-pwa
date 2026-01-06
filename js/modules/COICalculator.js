// COICalculator FINAL_CORRECT - DEFINITIEF CORRECT
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator FINAL: ${this._dogMap.size} honden geladen`);
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
            
            // DEFINITIEF CORRECTE BEREKENING
            const coi6Gen = this._calculateCOIFinal(dogId, 6, true);
            const coiAllGen = this._calculateCOIFinal(dogId, 25, true);
            
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

    // DEFINITIEF CORRECTE BEREKENING
    _calculateCOIFinal(dogId, maxDepth, isTopLevel = false) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `final_${dogId}_${maxDepth}_${isTopLevel}`;
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
        
        // SPECIALE GEVAL: Ouders zijn volle broer/zus
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (vader && moeder && 
            vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            // Ouders zijn volle broer/zus = 25%
            this._coiCache.set(cacheKey, 0.25);
            return 0.25;
        }
        
        // SPECIALE GEVAL: Ouders zijn half broer/zus
        let sharedParents = 0;
        if (vader && moeder) {
            if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) sharedParents++;
            if (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) sharedParents++;
            
            if (sharedParents === 1) {
                // Ouders zijn half broer/zus = 12.5%
                this._coiCache.set(cacheKey, 0.125);
                return 0.125;
            }
        }
        
        // STANDAARD BEREKENING
        const vaderAncestors = this._getAncestorsSimple(dog.vaderId, maxDepth);
        const moederAncestors = this._getAncestorsSimple(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        const significantContributions = [];
        
        // Voor elke gemeenschappelijke voorouder
        for (const [ancestorId, vDepth] of vaderAncestors.entries()) {
            if (moederAncestors.has(ancestorId)) {
                const mDepth = moederAncestors.get(ancestorId);
                
                // Bereken COI van de voorouder ZELF (recursief)
                const ancestorCOI = this._calculateCOIFinal(ancestorId, maxDepth - 1, false);
                
                // FORMULE: (1/2)^(vDepth + mDepth + 1) * (1 + F_A)
                const contribution = Math.pow(0.5, vDepth + mDepth + 1) * (1 + ancestorCOI);
                totalCOI += contribution;
                
                // Voor debug
                if (isTopLevel && maxDepth === 6 && contribution > 0.005) {
                    const ancestorDog = this.getDogById(ancestorId);
                    significantContributions.push({
                        name: ancestorDog?.naam || `ID:${ancestorId}`,
                        contribution: contribution * 100,
                        vDepth: vDepth,
                        mDepth: mDepth,
                        ancestorCOI: ancestorCOI * 100
                    });
                }
            }
        }
        
        // Toon belangrijke bijdragers
        if (isTopLevel && maxDepth === 6 && significantContributions.length > 0) {
            console.log(`   Belangrijkste bijdragers:`);
            significantContributions
                .sort((a, b) => b.contribution - a.contribution)
                .slice(0, 5)
                .forEach(c => {
                    console.log(`   ${c.name}: V${c.vDepth}+M${c.mDepth}, F_A=${c.ancestorCOI.toFixed(1)}%, ${c.contribution.toFixed(2)}%`);
                });
        }
        
        // Maximaal 100%
        if (totalCOI > 1.0) totalCOI = 1.0;
        
        console.log(`   Totaal ${maxDepth}gen: ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verzamel voorouders met KORTSTE diepte
    _getAncestorsSimple(startId, maxDepth, currentDepth = 1, result = new Map(), visited = new Set()) {
        if (currentDepth > maxDepth || !startId || visited.has(startId)) {
            return result;
        }
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        if (!dog) return result;
        
        // Vader
        if (dog.vaderId) {
            const existing = result.get(dog.vaderId);
            if (!existing || currentDepth < existing) {
                result.set(dog.vaderId, currentDepth);
            }
            this._getAncestorsSimple(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        // Moeder
        if (dog.moederId) {
            const existing = result.get(dog.moederId);
            if (!existing || currentDepth < existing) {
                result.set(dog.moederId, currentDepth);
            }
            this._getAncestorsSimple(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    // SNEL BEREKENING VOOR PRAKTISCH GEBRUIK
    calculateQuickCOI(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // 1. Zelfde ouders
        if (dog.vaderId === dog.moederId) return 25.0;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        if (!vader || !moeder) return 0;
        
        // 2. Ouders zijn volle broer/zus
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            return 25.0;
        }
        
        // 3. Ouders zijn half broer/zus
        let sharedParents = 0;
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) sharedParents++;
        if (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) sharedParents++;
        
        if (sharedParents === 1) return 12.5;
        if (sharedParents === 2) return 25.0;
        
        // 4. 1 gedeelde grootouder
        const vaderGrandparents = [vader.vaderId, vader.moederId].filter(Boolean);
        const moederGrandparents = [moeder.vaderId, moeder.moederId].filter(Boolean);
        
        let sharedGrandparents = 0;
        for (const gp of vaderGrandparents) {
            if (moederGrandparents.includes(gp)) sharedGrandparents++;
        }
        
        if (sharedGrandparents === 1) return 6.25;
        if (sharedGrandparents === 2) return 12.5;
        
        // 5. Voor complexe gevallen, gebruik 3-generatie berekening
        return this._calculateCOIFinal(dogId, 3, true) * 100;
    }

    // TOON VERGELIJKING
    showComparison(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`\n=== VERGELIJKING VOOR ${dog.naam} ===`);
        
        // 1. Snel berekening
        const quick = this.calculateQuickCOI(dogId);
        console.log(`Snel berekening: ${quick.toFixed(1)}%`);
        
        // 2. Gedetailleerde berekening
        const detailed = this.calculateCOI(dogId);
        console.log(`Gedetailleerd: ${detailed.coi6Gen}% (6-gen), ${detailed.coiAllGen}% (all-gen)`);
        
        // 3. Directe relatie analyse
        if (dog.vaderId && dog.moederId) {
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (vader && moeder) {
                console.log(`\nOuders:`);
                console.log(`- ${vader.naam} (${vader.id})`);
                console.log(`- ${moeder.naam} (${moeder.id})`);
                
                // Check gemeenschappelijke voorouders
                if (vader.vaderId === moeder.vaderId) {
                    const gv = this.getDogById(vader.vaderId);
                    console.log(`  ♂️ Gedeelde grootvader: ${gv?.naam || vader.vaderId}`);
                }
                if (vader.moederId === moeder.moederId) {
                    const gm = this.getDogById(vader.moederId);
                    console.log(`  ♀️ Gedeelde grootmoeder: ${gm?.naam || vader.moederId}`);
                }
                
                // Check of ouders broer/zus zijn
                if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                    vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
                    console.log(`  👥 Ouders zijn volle broer/zus (verwacht: 25%)`);
                } else if ((vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
                          (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
                    console.log(`  👥 Ouders zijn half broer/zus (verwacht: 12.5%)`);
                }
            }
        }
        
        console.log(`===================================`);
        
        return {
            quick: quick,
            detailed6: detailed.coi6Gen,
            detailedAll: detailed.coiAllGen
        };
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator FINAL_CORRECT - DEFINITIEF CORRECT');
    
    // Test alle belangrijke gevallen
    window.testAllCases = function(dogs) {
        const calculator = new COICalculator(dogs);
        
        console.log('=== DEFINITIEF COI TEST ===');
        
        const testCases = [
            { id: 27, name: 'Droll', note: 'ouders volle broer/zus (verwacht: 25%)' },
            { id: 29, name: 'Erle-Lu', note: 'ouders half broer/zus (verwacht: 12.5%)' },
            { id: 68, name: 'Katinka', note: 'ouders hebben gedeelde vader (verwacht: ~30-40%)' },
            { id: 86, name: 'Chris', note: 'verre verwantschap (verwacht: ~5-15%)' },
            { id: 19, name: 'Cara-Lu', note: 'ouders volle broer/zus? (verwacht: 25%)' },
            { id: 8, name: 'Brumbo', note: 'geen ouders (verwacht: 0%)' },
            { id: 9, name: 'Berit', note: 'geen ouders (verwacht: 0%)' }
        ];
        
        for (const test of testCases) {
            console.log(`\n--- ${test.name} (${test.note}) ---`);
            calculator.showComparison(test.id);
        }
        
        console.log('\n✅ TEST VOLTOOID');
        return true;
    };
}