// COICalculator V12 - ALLE PADEN TELLEN
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator V12: ${this._dogMap.size} honden geladen`);
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
            
            // BEREKEN MET ALLE PADEN
            const coi6Gen = this._calculateCOIAllPaths(dogId, 6);
            const coiAllGen = this._calculateCOIAllPaths(dogId, 25);
            
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

    // BEREKEN MET ALLE PADEN
    _calculateCOIAllPaths(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `allpaths_${dogId}_${maxDepth}`;
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
        
        // Verzamel ALLE paden van vader naar alle voorouders
        const vaderPaths = this._getAllPathsComplete(dog.vaderId, maxDepth);
        const moederPaths = this._getAllPathsComplete(dog.moederId, maxDepth);
        
        // Groepeer paden per voorouder
        const vaderByAncestor = this._groupPathsByAncestor(vaderPaths);
        const moederByAncestor = this._groupPathsByAncestor(moederPaths);
        
        let totalCOI = 0;
        const contributions = [];
        
        // Voor elke voorouder die in BEIDE ouders voorkomt
        for (const [ancestorId, vaderDepths] of vaderByAncestor.entries()) {
            if (moederByAncestor.has(ancestorId)) {
                const moederDepths = moederByAncestor.get(ancestorId);
                
                // Voor elk pad van vader
                for (const vDepth of vaderDepths) {
                    // Voor elk pad van moeder
                    for (const mDepth of moederDepths) {
                        // FORMULE: (1/2)^(vDepth + mDepth + 1)
                        const contribution = Math.pow(0.5, vDepth + mDepth + 1);
                        totalCOI += contribution;
                        
                        // Voor debug
                        if (maxDepth === 6 && contribution > 0.001) {
                            contributions.push({
                                ancestorId: ancestorId,
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
            console.log(`   ➡ 6gen bijdragers (alle paden):`);
            
            // Groepeer per voorouder
            const grouped = {};
            contributions.forEach(c => {
                const ancestorDog = this.getDogById(c.ancestorId);
                const name = ancestorDog?.naam || `ID:${c.ancestorId}`;
                
                if (!grouped[name]) grouped[name] = { total: 0, details: [] };
                grouped[name].total += c.contribution;
                grouped[name].details.push(`V${c.vDepth}+M${c.mDepth}`);
            });
            
            // Sorteer en toon
            Object.entries(grouped)
                .sort((a, b) => b[1].total - a[1].total)
                .forEach(([name, data]) => {
                    if (data.total > 0.1) {
                        console.log(`      ${name}: ${data.total.toFixed(3)}% (${data.details.join(', ')})`);
                    }
                });
        }
        
        console.log(`   ➡ ${maxDepth}gen: totaal = ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verzamel ALLE paden (niet alleen kortste)
    _getAllPathsComplete(dogId, maxDepth, currentDepth = 1, paths = [], visitedInPath = new Set()) {
        if (currentDepth > maxDepth || !dogId) return paths;
        
        // Voorkom cirkels in huidig pad
        if (visitedInPath.has(dogId)) return paths;
        visitedInPath.add(dogId);
        
        const dog = this.getDogById(dogId);
        if (!dog) return paths;
        
        // Voeg vader toe
        if (dog.vaderId) {
            paths.push({
                ancestorId: dog.vaderId,
                depth: currentDepth
            });
            
            // Ga dieper
            this._getAllPathsComplete(
                dog.vaderId,
                maxDepth,
                currentDepth + 1,
                paths,
                new Set(visitedInPath)
            );
        }
        
        // Voeg moeder toe
        if (dog.moederId) {
            paths.push({
                ancestorId: dog.moederId,
                depth: currentDepth
            });
            
            // Ga dieper
            this._getAllPathsComplete(
                dog.moederId,
                maxDepth,
                currentDepth + 1,
                paths,
                new Set(visitedInPath)
            );
        }
        
        return paths;
    }

    // Groepeer paden per voorouder
    _groupPathsByAncestor(paths) {
        const grouped = new Map();
        
        for (const path of paths) {
            if (!grouped.has(path.ancestorId)) {
                grouped.set(path.ancestorId, []);
            }
            grouped.get(path.ancestorId).push(path.depth);
        }
        
        return grouped;
    }

    // SNELLE SCHATTING
    quickEstimate(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Bekende relaties
        if (dog.vaderId === dog.moederId) return 25.0;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        if (!vader || !moeder) return 0;
        
        // Ouders zijn volle broer/zus
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            return 25.0;
        }
        
        // Ouders zijn half broer/zus
        let sharedParents = 0;
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) sharedParents++;
        if (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) sharedParents++;
        
        if (sharedParents === 1) return 12.5;
        if (sharedParents === 2) return 25.0;
        
        // Voor complexere gevallen, gebruik berekening
        return this._calculateCOIAllPaths(dogId, 6) * 100;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V12 geladen - ALLE PADEN');
    
    // Test functie
    window.testDetailed = function(dogs, testId) {
        const calculator = new COICalculator(dogs);
        
        console.log(`=== GEDETAILLEERDE COI ANALYSE VOOR ${testId} ===`);
        
        // 1. Bereken COI
        const result = calculator.calculateCOI(testId);
        
        // 2. Snel schatting
        const quick = calculator.quickEstimate(testId);
        console.log(`Snel schatting: ${quick.toFixed(1)}%`);
        
        // 3. Controleer ouders
        const dog = calculator.getDogById(testId);
        if (dog && dog.vaderId && dog.moederId) {
            const vader = calculator.getDogById(dog.vaderId);
            const moeder = calculator.getDogById(dog.moederId);
            
            if (vader && moeder) {
                console.log(`\nOuders:`);
                console.log(`- Vader: ${vader.naam} (${vader.id})`);
                console.log(`- Moeder: ${moeder.naam} (${moeder.id})`);
                
                if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) {
                    console.log(`  ♂️ Gedeelde grootvader: ID ${vader.vaderId}`);
                }
                if (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
                    console.log(`  ♀️ Gedeelde grootmoeder: ID ${vader.moederId}`);
                }
            }
        }
        
        console.log(`===================================`);
        
        return result;
    };
}