// COICalculator V9 - SIMPEL EN CORRECT
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
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
            
            const cacheKey = `full_${dogId}`;
            if (this._coiCache.has(cacheKey)) {
                return this._coiCache.get(cacheKey);
            }
            
            const dog = this.getDogById(dogId);
            if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            console.log(`🔍 COI berekening voor: ${dog.naam} (ID: ${dog.id})`);
            
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
            
            // SIMPELE MAAR CORRECTE BEREKENING
            const coi6Gen = this._calculateSimpleCOI(dogId, 6);
            const coiAllGen = this._calculateSimpleCOI(dogId, 25);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: COI 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            
            this._coiCache.set(cacheKey, result);
            return result;
            
        } catch (error) {
            console.error('❌ Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // SIMPELE MAAR CORRECTE BEREKENING
    _calculateSimpleCOI(dogId, maxDepth) {
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
        
        // VOOR ELKE GEMEENSCHAPPELIJKE VOOROUDER:
        // 1. Zoek alle paden van vader naar voorouder
        // 2. Zoek alle paden van moeder naar voorouder
        // 3. Voor elk pad-paar: (1/2)^(diepte_vader + diepte_moeder + 1)
        
        // Verzamel alle voorouders
        const vaderAncestors = this._getAncestorsWithDepths(dog.vaderId, maxDepth);
        const moederAncestors = this._getAncestorsWithDepths(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        const contributions = [];
        
        // Voor elke voorouder in vaders lijst
        for (const [ancestorId, vaderDepths] of vaderAncestors.entries()) {
            // Kijk of deze ook in moeders lijst zit
            if (moederAncestors.has(ancestorId)) {
                const moederDepths = moederAncestors.get(ancestorId);
                
                // Voor elk pad van vader
                for (const vDepth of vaderDepths) {
                    // Voor elk pad van moeder
                    for (const mDepth of moederDepths) {
                        // FORMULE: (1/2)^(vDepth + mDepth + 1)
                        const contribution = Math.pow(0.5, vDepth + mDepth + 1);
                        totalCOI += contribution;
                        
                        // Voor debug (alleen grote bijdragen)
                        if (maxDepth === 6 && contribution > 0.001) {
                            const ancestorDog = this.getDogById(ancestorId);
                            contributions.push({
                                name: ancestorDog?.naam || `ID:${ancestorId}`,
                                vDepth: vDepth,
                                mDepth: mDepth,
                                contribution: contribution * 100
                            });
                        }
                    }
                }
            }
        }
        
        // Toon bijdragen
        if (maxDepth === 6 && contributions.length > 0) {
            console.log(`   ➡ 6gen belangrijkste bijdragers:`);
            
            // Groepeer per voorouder
            const grouped = {};
            contributions.forEach(c => {
                if (!grouped[c.name]) grouped[c.name] = { total: 0, details: [] };
                grouped[c.name].total += c.contribution;
                grouped[c.name].details.push(`V(${c.vDepth})/M(${c.mDepth})`);
            });
            
            // Sorteer en toon top 10
            Object.entries(grouped)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 10)
                .forEach(([name, data]) => {
                    console.log(`      ${name}: ${data.total.toFixed(3)}% (${data.details.join(', ')})`);
                });
        }
        
        // Limiet tot 100%
        if (totalCOI > 1.0) totalCOI = 1.0;
        
        console.log(`   ➡ ${maxDepth}gen: totaal COI = ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verzamel alle voorouders met ALLE dieptes
    _getAncestorsWithDepths(dogId, maxDepth, currentDepth = 1, result = new Map(), visitedInPath = new Set()) {
        if (currentDepth > maxDepth || !dogId) return result;
        
        // Voorkom cirkels in huidig pad
        if (visitedInPath.has(dogId)) return result;
        visitedInPath.add(dogId);
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        // Vader toevoegen
        if (dog.vaderId) {
            if (!result.has(dog.vaderId)) {
                result.set(dog.vaderId, []);
            }
            result.get(dog.vaderId).push(currentDepth);
            
            // Recursie
            this._getAncestorsWithDepths(
                dog.vaderId,
                maxDepth,
                currentDepth + 1,
                result,
                new Set(visitedInPath)
            );
        }
        
        // Moeder toevoegen
        if (dog.moederId) {
            if (!result.has(dog.moederId)) {
                result.set(dog.moederId, []);
            }
            result.get(dog.moederId).push(currentDepth);
            
            // Recursie
            this._getAncestorsWithDepths(
                dog.moederId,
                maxDepth,
                currentDepth + 1,
                result,
                new Set(visitedInPath)
            );
        }
        
        return result;
    }

    // VOLLE BROER/ZUS CHECK
    isFullSiblings(vaderId, moederId) {
        const vader = this.getDogById(vaderId);
        const moeder = this.getDogById(moederId);
        
        if (!vader || !moeder) return false;
        
        return vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
               vader.moederId && moeder.moederId && vader.moederId === moeder.moederId;
    }

    // HALF BROER/ZUS CHECK
    isHalfSiblings(vaderId, moederId) {
        const vader = this.getDogById(vaderId);
        const moeder = this.getDogById(moederId);
        
        if (!vader || !moeder) return false;
        
        // Gemeenschappelijke vader OF moeder
        return (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
               (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId);
    }

    // SCHATTING OP BASIS VAN RELATIE
    estimateCOIByRelationship(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        if (this.isFullSiblings(dog.vaderId, dog.moederId)) return 0.25;
        
        if (this.isHalfSiblings(dog.vaderId, dog.moederId)) return 0.125;
        
        // Oom/tante - neef/nicht
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (vader && moeder) {
            // Als vader van een ouder gelijk is aan grootouder van andere ouder
            if (vader.vaderId && moeder.vaderId && moeder.moederId) {
                if (vader.vaderId === moeder.vaderId || vader.vaderId === moeder.moederId) {
                    return 0.125;
                }
            }
            if (vader.moederId && moeder.vaderId && moeder.moederId) {
                if (vader.moederId === moeder.vaderId || vader.moederId === moeder.moederId) {
                    return 0.125;
                }
            }
        }
        
        return 0; // Geen directe relatie gevonden
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V9 geladen - Simpel maar correct');
}