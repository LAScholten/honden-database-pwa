// COICalculator V4 - VOLLEDIG WERKENDE COI BEREKENING MET PATH-TRACKING EN CACHING
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
        
        console.log(`✅ COICalculator V4: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            // Check cache voor volledig resultaat
            const cacheKey = `full_${dogId}`;
            if (this._coiCache.has(cacheKey)) {
                const cached = this._coiCache.get(cacheKey);
                console.log(`📊 Cached resultaat voor ${dogId}: 6-gen=${cached.coi6Gen}%, all-gen=${cached.coiAllGen}%`);
                return cached;
            }
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            console.log(`🔍 COI berekening voor: ${dog.naam} (ID: ${dog.id})`);
            console.log(`   Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);

            // BASISGEWALEN
            if (!dog.vaderId || !dog.moederId) {
                console.log(`   ➡ Geen ouders -> 0%`);
                const result = { coi6Gen: '0.0', coiAllGen: '0.0' };
                this._coiCache.set(cacheKey, result);
                return result;
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`   ➡ Zelfde ouders -> 25%`);
                const result = { coi6Gen: '25.0', coiAllGen: '25.0' };
                this._coiCache.set(cacheKey, result);
                return result;
            }
            
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (!vader || !moeder) {
                console.log(`   ➡ Ouders niet gevonden -> 0%`);
                const result = { coi6Gen: '0.0', coiAllGen: '0.0' };
                this._coiCache.set(cacheKey, result);
                return result;
            }
            
            console.log(`   ➡ Vader: ${vader.naam} (${vader.id})`);
            console.log(`   ➡ Moeder: ${moeder.naam} (${moeder.id})`);

            // VOLLE BROER/ZUS (directe check)
            const isFullSibling = vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                                 vader.moederId && moeder.moederId && vader.moederId === moeder.moederId;
            
            if (isFullSibling) {
                console.log(`   ➡ Ouders zijn volle broer/zus -> 25%`);
                const result = { coi6Gen: '25.0', coiAllGen: '25.0' };
                this._coiCache.set(cacheKey, result);
                return result;
            }

            // COMPLEXE BEREKENING
            console.log(`   ➡ Complex geval - bereken 6 en 25 generaties`);
            
            // Bereken met optimale methode
            const coi6Gen = this._calculateCOIWithPathTracking(dogId, 6);
            const coiAllGen = this._calculateCOIWithPathTracking(dogId, 25);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: COI 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            console.log(`=======================================`);
            
            // Cache resultaat
            this._coiCache.set(cacheKey, result);
            return result;
            
        } catch (error) {
            console.error('❌ Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // OPTIMALE BEREKENING MET PATH TRACKING
    _calculateCOIWithPathTracking(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        // Cache check voor deze specifieke berekening
        const cacheKey = `${dogId}_${maxDepth}`;
        if (this._coiCache.has(cacheKey)) {
            return this._coiCache.get(cacheKey);
        }
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            this._coiCache.set(cacheKey, 0);
            return 0;
        }
        
        // Basisgeval:zelfde ouders
        if (dog.vaderId === dog.moederId) {
            this._coiCache.set(cacheKey, 0.25);
            return 0.25;
        }
        
        // Bereken COI van ouders (recursief)
        const fVader = this._calculateCOIWithPathTracking(dog.vaderId, maxDepth - 1);
        const fMoeder = this._calculateCOIWithPathTracking(dog.moederId, maxDepth - 1);
        
        // Vind alle gemeenschappelijke voorouders met paden
        const commonAncestors = this._findCommonAncestorsWithPaths(dog.vaderId, dog.moederId, maxDepth);
        
        let totalCOI = 0;
        let contributorCount = 0;
        
        for (const [ancestorId, paths] of commonAncestors.entries()) {
            // COI van de voorouder zelf
            const fAncestor = this._calculateCOIWithPathTracking(ancestorId, maxDepth - 1);
            
            // Tel alle pad-combinaties
            for (const pathVader of paths.fromVader) {
                for (const pathMoeder of paths.fromMoeder) {
                    const n1 = pathVader;  // aantal stappen via vader
                    const n2 = pathMoeder; // aantal stappen via moeder
                    
                    // Wright's formule: (1/2)^(n1+n2+1) * (1 + F_A)
                    const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + fAncestor);
                    totalCOI += contribution;
                    contributorCount++;
                    
                    if (maxDepth === 6 || maxDepth === 25) {
                        const ancestorDog = this.getDogById(ancestorId);
                        console.log(`   ➡ ${maxDepth}gen: ${ancestorDog?.naam || ancestorId} via V(${n1})/M(${n2}) = ${(contribution*100).toFixed(4)}%`);
                    }
                }
            }
        }
        
        if (contributorCount > 0) {
            console.log(`   ➡ ${maxDepth}gen: ${contributorCount} pad-combinaties, totaal = ${(totalCOI*100).toFixed(2)}%`);
        }
        
        // Cache resultaat
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // VIND GEMEENSCHAPPELIJKE VOOROUDERS MET PAD LENGHTES
    _findCommonAncestorsWithPaths(vaderId, moederId, maxDepth) {
        const cacheKey = `common_${vaderId}_${moederId}_${maxDepth}`;
        if (this._ancestorCache.has(cacheKey)) {
            return this._ancestorCache.get(cacheKey);
        }
        
        // Verzamel voorouders met pad-lengtes
        const vaderAncestors = this._collectAncestorsWithPathLengths(vaderId, maxDepth, 1);
        const moederAncestors = this._collectAncestorsWithPathLengths(moederId, maxDepth, 1);
        
        const common = new Map();
        
        // Vind overlap
        for (const [ancestorId, vaderPaths] of vaderAncestors.entries()) {
            if (moederAncestors.has(ancestorId)) {
                common.set(ancestorId, {
                    fromVader: vaderPaths,
                    fromMoeder: moederAncestors.get(ancestorId)
                });
            }
        }
        
        // Cache resultaat
        this._ancestorCache.set(cacheKey, common);
        return common;
    }

    // VERZAMEL VOOROUDERS MET PAD LENGTES
    _collectAncestorsWithPathLengths(dogId, maxDepth, currentDepth, result = new Map()) {
        if (currentDepth > maxDepth) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        // Verwerk vader
        if (dog.vaderId) {
            if (!result.has(dog.vaderId)) {
                result.set(dog.vaderId, []);
            }
            result.get(dog.vaderId).push(currentDepth);
            
            // Recursie voor diepere voorouders
            this._collectAncestorsWithPathLengths(
                dog.vaderId, 
                maxDepth, 
                currentDepth + 1, 
                result
            );
        }
        
        // Verwerk moeder
        if (dog.moederId) {
            if (!result.has(dog.moederId)) {
                result.set(dog.moederId, []);
            }
            result.get(dog.moederId).push(currentDepth);
            
            // Recursie voor diepere voorouders
            this._collectAncestorsWithPathLengths(
                dog.moederId, 
                maxDepth, 
                currentDepth + 1, 
                result
            );
        }
        
        return result;
    }

    // SIMPELE BEREKENING VOOR SNELHEID (alternatieve methode)
    calculateSimpleCOI(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Snelle ancestor collectie zonder paden
        const vaderAncestors = this._getAllAncestorsSimple(dog.vaderId, generations);
        const moederAncestors = this._getAllAncestorsSimple(dog.moederId, generations);
        
        // Vind gemeenschappelijke voorouders
        const common = new Set();
        for (const ancestor of vaderAncestors) {
            if (moederAncestors.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
        // Schatting: 0.5^(gemiddelde diepte) * aantal gemeenschappelijke
        if (common.size === 0) return 0;
        
        // Heel simplistische schatting - niet exact maar snel
        const estimated = Math.min(0.25, common.size * 0.01 * Math.pow(0.8, generations));
        return estimated;
    }

    _getAllAncestorsSimple(dogId, maxDepth, currentDepth = 0, result = new Set()) {
        if (currentDepth >= maxDepth) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getAllAncestorsSimple(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._getAllAncestorsSimple(dog.moederId, maxDepth, currentDepth + 1, result);
        }
        
        return result;
    }

    // DEBUG FUNCTIES
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

    // ANALYSE FUNCTIE
    analyzeInbreeding(dogId) {
        const result = this.calculateCOI(dogId);
        const dog = this.getDogById(dogId);
        
        const analysis = {
            naam: dog?.naam || 'Onbekend',
            id: dogId,
            coi6Gen: result.coi6Gen,
            coiAllGen: result.coiAllGen,
            interpretatie: '',
            aanbevelingen: []
        };
        
        const coi6 = parseFloat(result.coi6Gen);
        const coiAll = parseFloat(result.coiAllGen);
        
        // Interpretatie
        if (coiAll === 0) {
            analysis.interpretatie = "Geen inteelt gedetecteerd in de stamboom";
        } else if (coiAll < 3.125) { // < 1/32
            analysis.interpretatie = "Zeer lage inteelt - uitstekend";
        } else if (coiAll < 6.25) { // < 1/16
            analysis.interpretatie = "Lage inteelt - goed";
        } else if (coiAll < 12.5) { // < 1/8
            analysis.interpretatie = "Matige inteelt - acceptabel";
        } else if (coiAll < 25) { // < 1/4
            analysis.interpretatie = "Hoge inteelt - zorgvuldig fokken";
        } else {
            analysis.interpretatie = "Zeer hoge inteelt - risicovol";
        }
        
        // Aanbevelingen
        if (coiAll > 6.25) {
            analysis.aanbevelingen.push("Overweeg outcross met onverwante lijnen");
        }
        if (coiAll > 12.5) {
            analysis.aanbevelingen.push("Laat gezondheidstesten uitvoeren");
            analysis.aanbevelingen.push("Vermijd verder inteelt op deze voorouders");
        }
        if (coi6 < coiAll * 0.5) {
            analysis.aanbevelingen.push("Inteelt komt voornamelijk van verre voorouders");
        }
        
        return analysis;
    }

    // CLEAR CACHE (bij nieuwe data)
    clearCache() {
        this._coiCache.clear();
        this._ancestorCache.clear();
        console.log('🧹 COI cache geleegd');
    }

    // STATISTIEKEN
    getStatistics() {
        return {
            totalDogs: this._dogMap.size,
            cachedResults: this._coiCache.size,
            cachedAncestors: this._ancestorCache.size
        };
    }
}

// TEST DATA EN INITIALISATIE
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V4 geladen met:');
    console.log('   - Path-tracking algoritme');
    console.log('   - Dubbele caching (resultaten & voorouders)');
    console.log('   - 6-gen & 25-gen berekeningen');
    console.log('   - Inbreeding analyse functie');
    console.log('   - Statistieken en cache management');
    
    // Voorbeeld test functie
    window.testCOI = function(dogs, testId) {
        const calculator = new COICalculator(dogs);
        const result = calculator.calculateCOI(testId);
        const analysis = calculator.analyzeInbreeding(testId);
        calculator.debugStamboom(testId, 3);
        
        console.log('\n📊 ANALYSE RESULTATEN:');
        console.log(`Hond: ${analysis.naam}`);
        console.log(`COI 6 generaties: ${result.coi6Gen}%`);
        console.log(`COI alle generaties: ${result.coiAllGen}%`);
        console.log(`Interpretatie: ${analysis.interpretatie}`);
        if (analysis.aanbevelingen.length > 0) {
            console.log(`Aanbevelingen:`);
            analysis.aanbevelingen.forEach(a => console.log(`  - ${a}`));
        }
        
        return { result, analysis };
    };
}