// COICalculator FINAL - COMPLETE FORMULE
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
            
            // COMPLETE FORMULE
            const coi6Gen = this._calculateCOIComplete(dogId, 6);
            const coiAllGen = this._calculateCOIComplete(dogId, 25);
            
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

    // COMPLETE FORMULE: Σ [(1/2)^(n1+n2+1) * (1 + F_A)]
    _calculateCOIComplete(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `complete_${dogId}_${maxDepth}`;
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
        
        // Verzamel alle paden
        const vaderPaths = this._getAllPaths(dog.vaderId, maxDepth);
        const moederPaths = this._getAllPaths(dog.moederId, maxDepth);
        
        // Groepeer per voorouder
        const vaderByAncestor = this._groupPaths(vaderPaths);
        const moederByAncestor = this._groupPaths(moederPaths);
        
        let totalCOI = 0;
        const contributions = [];
        
        // Voor elke gemeenschappelijke voorouder
        for (const [ancestorId, vaderDepths] of vaderByAncestor.entries()) {
            if (moederByAncestor.has(ancestorId)) {
                const moederDepths = moederByAncestor.get(ancestorId);
                
                // Bereken F_A (COI van de voorouder zelf)
                const fAncestor = this._calculateCOIComplete(ancestorId, maxDepth - 1);
                
                // Voor elk pad van vader
                for (const vDepth of vaderDepths) {
                    // Voor elk pad van moeder
                    for (const mDepth of moederDepths) {
                        // COMPLETE FORMULE: (1/2)^(vDepth + mDepth + 1) * (1 + F_A)
                        const contribution = Math.pow(0.5, vDepth + mDepth + 1) * (1 + fAncestor);
                        totalCOI += contribution;
                        
                        // Voor debug
                        if (maxDepth === 6 && contribution > 0.001) {
                            contributions.push({
                                ancestorId: ancestorId,
                                vDepth: vDepth,
                                mDepth: mDepth,
                                fAncestor: fAncestor * 100,
                                contribution: contribution * 100
                            });
                        }
                    }
                }
            }
        }
        
        // Toon analyse voor 6 generaties
        if (maxDepth === 6 && contributions.length > 0) {
            console.log(`   ➡ 6gen analyse (met F_A):`);
            
            // Groepeer per voorouder
            const grouped = {};
            contributions.forEach(c => {
                const ancestorDog = this.getDogById(c.ancestorId);
                const name = ancestorDog?.naam || `ID:${c.ancestorId}`;
                
                if (!grouped[name]) grouped[name] = { 
                    total: 0, 
                    fAncestor: c.fAncestor,
                    details: [] 
                };
                grouped[name].total += c.contribution;
                grouped[name].details.push(`V${c.vDepth}+M${c.mDepth}`);
            });
            
            // Toon top bijdragers
            Object.entries(grouped)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 8)
                .forEach(([name, data]) => {
                    if (data.total > 0.1) {
                        console.log(`      ${name}: ${data.total.toFixed(3)}% (F_A=${data.fAncestor.toFixed(1)}%)`);
                    }
                });
        }
        
        // Maximaal 100%
        if (totalCOI > 1.0) totalCOI = 1.0;
        
        console.log(`   ➡ ${maxDepth}gen: totaal = ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _getAllPaths(dogId, maxDepth, currentDepth = 1, paths = [], visitedInPath = new Set()) {
        if (currentDepth > maxDepth || !dogId) return paths;
        
        if (visitedInPath.has(dogId)) return paths;
        visitedInPath.add(dogId);
        
        const dog = this.getDogById(dogId);
        if (!dog) return paths;
        
        // Vader
        if (dog.vaderId) {
            paths.push({
                ancestorId: dog.vaderId,
                depth: currentDepth
            });
            
            this._getAllPaths(
                dog.vaderId,
                maxDepth,
                currentDepth + 1,
                paths,
                new Set(visitedInPath)
            );
        }
        
        // Moeder
        if (dog.moederId) {
            paths.push({
                ancestorId: dog.moederId,
                depth: currentDepth
            });
            
            this._getAllPaths(
                dog.moederId,
                maxDepth,
                currentDepth + 1,
                paths,
                new Set(visitedInPath)
            );
        }
        
        return paths;
    }

    _groupPaths(paths) {
        const grouped = new Map();
        
        for (const path of paths) {
            if (!grouped.has(path.ancestorId)) {
                grouped.set(path.ancestorId, []);
            }
            grouped.get(path.ancestorId).push(path.depth);
        }
        
        return grouped;
    }

    // INTERPRETATIE
    interpretCOI(coiPercent) {
        const coi = parseFloat(coiPercent);
        
        if (coi === 0) return "Geen inteelt";
        if (coi < 3.125) return "Zeer laag (< 1/32)";
        if (coi < 6.25) return "Laag (< 1/16)";
        if (coi < 12.5) return "Matig (< 1/8)";
        if (coi < 25) return "Hoog (< 1/4)";
        return "Zeer hoog (≥ 1/4)";
    }

    // BEREKEN VOOR MEERDERE HONDEN
    calculateBatch(dogIds) {
        const results = [];
        
        for (const dogId of dogIds) {
            const result = this.calculateCOI(dogId);
            const dog = this.getDogById(dogId);
            
            results.push({
                id: dogId,
                naam: dog?.naam || `ID:${dogId}`,
                coi6Gen: result.coi6Gen,
                coiAllGen: result.coiAllGen,
                interpretatie: this.interpretCOI(result.coiAllGen)
            });
        }
        
        // Sorteer op COI
        results.sort((a, b) => parseFloat(b.coiAllGen) - parseFloat(a.coiAllGen));
        
        console.log('\n=== BATCH RESULTATEN ===');
        results.forEach(r => {
            console.log(`${r.naam}: ${r.coiAllGen}% (${r.interpretatie})`);
        });
        
        return results;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator FINAL geladen - COMPLETE FORMULE');
    
    // Complete test
    window.testComplete = function(dogs, testIds = [68, 86, 27, 29]) {
        const calculator = new COICalculator(dogs);
        
        console.log('=== COMPLETE COI TEST ===');
        
        // Batch berekening
        const results = calculator.calculateBatch(testIds);
        
        // Samenvatting
        console.log('\n=== SAMENVATTING ===');
        console.log(`Aantal geteste honden: ${testIds.length}`);
        
        const avgCOI = results.reduce((sum, r) => sum + parseFloat(r.coiAllGen), 0) / results.length;
        console.log(`Gemiddelde COI: ${avgCOI.toFixed(1)}%`);
        
        const maxCOI = Math.max(...results.map(r => parseFloat(r.coiAllGen)));
        const minCOI = Math.min(...results.map(r => parseFloat(r.coiAllGen)));
        console.log(`Hoogste COI: ${maxCOI.toFixed(1)}%`);
        console.log(`Laagste COI: ${minCOI.toFixed(1)}%`);
        
        return results;
    };
}