// COICalculator CORRECT - RECURSIEVE BEREKENING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map(); // Cache voor alle COI berekeningen
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator CORRECT: ${this._dogMap.size} honden (recursief)`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    // ✅ HOOFDFUNCTIE: Bereken COI voor elke diepte
    calculateCOI(dogId) {
        dogId = Number(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        console.log(`\n🔍 COI voor: ${dog.naam} (ID: ${dog.id})`);
        
        // Bereken voor verschillende dieptes
        const coi6Gen = this._calculateCOIForDepth(dogId, 6);
        const coiAllGen = this._calculateCOIForDepth(dogId, 25);
        
        const result = {
            coi6Gen: (coi6Gen * 100).toFixed(1),
            coiAllGen: (coiAllGen * 100).toFixed(1)
        };
        
        console.log(`\n✅ RESULTAAT:`);
        console.log(`   6 generaties: ${result.coi6Gen}%`);
        console.log(`   Alle generaties: ${result.coiAllGen}%`);
        
        return result;
    }

    // ✅ KERNFUNCTIE: Bereken COI voor specifieke diepte
    _calculateCOIForDepth(dogId, maxDepth) {
        const cacheKey = `${dogId}-${maxDepth}`;
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
        
        // Vind alle voorouders van vader
        const vaderAncestors = this._getAllAncestors(dog.vaderId, maxDepth - 1);
        const moederAncestors = this._getAllAncestors(dog.moederId, maxDepth - 1);
        
        let total = 0;
        
        // Voor ELKE gemeenschappelijke voorouder
        for (const ancestorId of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                // Vind alle paden naar deze voorouder
                const pathsVader = this._findAllPaths(dog.vaderId, ancestorId, maxDepth - 1);
                const pathsMoeder = this._findAllPaths(dog.moederId, ancestorId, maxDepth - 1);
                
                // Voor ELKE combinatie van paden
                for (const pathV of pathsVader) {
                    const n = pathV.length;
                    
                    for (const pathM of pathsMoeder) {
                        const m = pathM.length;
                        
                        // ✅ OFFICIËLE FORMULE: (0.5)^(n+m)
                        const baseContribution = Math.pow(0.5, n + m);
                        
                        // ✅ RECURSIE: voeg COI van voorouder toe
                        const ancestorCOI = this._calculateCOIForDepth(ancestorId, maxDepth - 1);
                        total += baseContribution * (1 + ancestorCOI);
                    }
                }
            }
        }
        
        this._coiCache.set(cacheKey, total);
        return total;
    }

    // ✅ Vind alle voorouders (unieke IDs)
    _getAllAncestors(dogId, maxDepth, currentDepth = 0, result = new Set(), visited = new Set()) {
        if (!dogId || currentDepth >= maxDepth || visited.has(dogId)) {
            return result;
        }
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getAllAncestors(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._getAllAncestors(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    // ✅ Vind ALLE paden naar een voorouder
    _findAllPaths(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allPaths = [], visited = new Set()) {
        if (!startId || currentDepth > maxDepth) {
            return allPaths;
        }
        
        if (visited.has(startId)) {
            return allPaths;
        }
        
        visited.add(startId);
        
        if (startId === targetId) {
            allPaths.push([...currentPath]);
            visited.delete(startId);
            return allPaths;
        }
        
        const dog = this.getDogById(startId);
        if (!dog) {
            visited.delete(startId);
            return allPaths;
        }
        
        if (dog.vaderId) {
            currentPath.push(dog.vaderId);
            this._findAllPaths(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths, new Set(visited));
            currentPath.pop();
        }
        
        if (dog.moederId) {
            currentPath.push(dog.moederId);
            this._findAllPaths(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths, new Set(visited));
            currentPath.pop();
        }
        
        visited.delete(startId);
        return allPaths;
    }

    // ✅ DEBUG: Vergelijk dieptes
    debugDepthComparison(dogId) {
        console.log(`\n📊 DIEPTE VERGELIJKING voor ${this.getDogById(dogId)?.naam || dogId}:`);
        console.log('Diepte | COI (%) | Voorouders vader | Voorouders moeder');
        console.log('------|---------|-----------------|------------------');
        
        for (let depth = 1; depth <= 8; depth++) {
            const coi = this._calculateCOIForDepth(dogId, depth);
            const dog = this.getDogById(dogId);
            
            if (dog && dog.vaderId && dog.moederId) {
                const vaderCount = this._getAllAncestors(dog.vaderId, depth - 1).size;
                const moederCount = this._getAllAncestors(dog.moederId, depth - 1).size;
                
                console.log(`${depth.toString().padEnd(6)}| ${(coi * 100).toFixed(3).padEnd(8)}% | ${vaderCount.toString().padEnd(16)}| ${moederCount}`);
            }
        }
        
        // Voor 25 generaties (alleen COI)
        const coi25 = this._calculateCOIForDepth(dogId, 25);
        console.log(`25    | ${(coi25 * 100).toFixed(3).padEnd(8)}% | (niet geteld)      | (niet geteld)`);
    }

    // ✅ DEBUG: Toon waarom 0.09% absurd is
    debugWhyLowAllGen(dogId) {
        console.log(`\n🔍 ANALYSE WAAROM 0.09% TE LAAG IS:`);
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return;
        
        // Bereken voor 6 en 25 generaties
        const coi6 = this._calculateCOIForDepth(dogId, 6);
        const coi25 = this._calculateCOIForDepth(dogId, 25);
        
        console.log(`   COI 6-gen: ${(coi6 * 100).toFixed(2)}%`);
        console.log(`   COI 25-gen: ${(coi25 * 100).toFixed(2)}%`);
        console.log(`   Verhouding: ${(coi25 / coi6).toFixed(2)}x`);
        
        // Normaal zou dit 2-3x moeten zijn voor veel inteelt!
        console.log(`\n💡 VERKLARING:`);
        console.log(`   Als 25-gen < 6-gen, dan heeft _calculateCOIForDepth een bug!`);
        console.log(`   Mogelijk telt het niet alle routes voor diepe generaties.`);
        
        // Test specifieke voorouders
        console.log(`\n🧪 TEST SPECIFIEKE VOOROUDER:`);
        const testAncestor = 193; // ANJA
        const paths6 = this._findAllPaths(dog.vaderId, testAncestor, 5); // maxDepth-1
        const paths25 = this._findAllPaths(dog.vaderId, testAncestor, 24);
        
        console.log(`   ANJA paden naar vader (6-gen): ${paths6.length}`);
        console.log(`   ANJA paden naar vader (25-gen): ${paths25.length}`);
        
        if (paths25.length <= paths6.length) {
            console.log(`   ❌ PROBLEEM: _findAllPaths vindt niet meer paden bij 25-gen!`);
        }
    }

    // ✅ OPTIMALISATIE: Bereken voor meerdere honden tegelijk
    calculateCOIForMultiple(dogIds) {
        console.log(`\n📊 BATCH BEREKENING voor ${dogIds.length} honden:`);
        
        const results = {};
        dogIds.forEach(id => {
            const dog = this.getDogById(id);
            if (dog) {
                const coi6 = this._calculateCOIForDepth(id, 6);
                const coi25 = this._calculateCOIForDepth(id, 25);
                
                results[id] = {
                    naam: dog.naam,
                    coi6Gen: (coi6 * 100).toFixed(1),
                    coiAllGen: (coi25 * 100).toFixed(1)
                };
                
                console.log(`   ${dog.naam.padEnd(25)}: 6-gen=${(coi6 * 100).toFixed(1)}%, 25-gen=${(coi25 * 100).toFixed(1)}%`);
            }
        });
        
        return results;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator CORRECT geladen (recursief)');
}