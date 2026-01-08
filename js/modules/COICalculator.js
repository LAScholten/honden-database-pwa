// COICalculator FINAL - AUTO-DETECTIE
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator FINAL: ${this._dogMap.size} honden (auto-detectie)`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        dogId = Number(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        console.log(`\n🔍 COI voor: ${dog.naam} (ID: ${dog.id})`);
        
        // 1. Vind ALLE routes naar ALLE gemeenschappelijke voorouders
        const contributions = this._findAllRouteContributions(dogId, 6);
        
        // 2. Bereken zonder voorouder-IK
        let totalWithoutIK = 0;
        contributions.forEach(c => {
            totalWithoutIK += c.baseContribution;
        });
        
        // 3. Bereken MET voorouder-IK (recursief)
        let totalWithIK = 0;
        contributions.forEach(c => {
            // Bereken COI van deze voorouder (recursief)
            const ancestorCOI = this.calculateAncestorCOI(c.ancestorId, 5); // 1 generatie minder
            totalWithIK += c.baseContribution * (1 + ancestorCOI);
        });
        
        const result = {
            coi6Gen: (totalWithIK * 100).toFixed(2),
            coiAllGen: this._calculateAllGenerations(dogId, 25).toFixed(2),
            withoutAncestorIK: (totalWithoutIK * 100).toFixed(2),
            withAncestorIK: (totalWithIK * 100).toFixed(2)
        };
        
        console.log(`\n✅ FINALE RESULTAAT:`);
        console.log(`   Zonder voorouder-IK: ${result.withoutAncestorIK}%`);
        console.log(`   Met voorouder-IK: ${result.withAncestorIK}%`);
        console.log(`   Officieel: 7.42% / 7.70%`);
        
        return result;
    }

    // ✅ Vind ALLE route-bijdragen
    _findAllRouteContributions(dogId, maxDepth) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return [];
        
        const vaderPaths = this._getAllPathsToAncestors(dog.vaderId, maxDepth);
        const moederPaths = this._getAllPathsToAncestors(dog.moederId, maxDepth);
        
        const contributions = [];
        const processed = new Set();
        
        // Voor elke voorouder in vader's stamboom
        for (const [ancestorId, vaderRoutes] of vaderPaths) {
            if (moederPaths.has(ancestorId)) {
                const moederRoutes = moederPaths.get(ancestorId);
                
                // Voor elke combinatie van routes
                for (const routeV of vaderRoutes) {
                    const n = routeV.length;
                    
                    for (const routeM of moederRoutes) {
                        const m = routeM.length;
                        
                        const key = `${ancestorId}-${n}-${m}`;
                        if (!processed.has(key)) {
                            processed.add(key);
                            
                            // ✅ OFFICIËLE FORMULE: (0.5)^(n+m)
                            const baseContribution = Math.pow(0.5, n + m);
                            
                            contributions.push({
                                ancestorId,
                                n,
                                m,
                                baseContribution,
                                vaderRoute: routeV,
                                moederRoute: routeM
                            });
                        }
                    }
                }
            }
        }
        
        return contributions;
    }

    // ✅ Bereken COI van een voorouder (recursief)
    calculateAncestorCOI(ancestorId, maxDepth) {
        if (maxDepth <= 0) return 0;
        
        const cacheKey = `ancestor-${ancestorId}-${maxDepth}`;
        if (this._coiCache.has(cacheKey)) {
            return this._coiCache.get(cacheKey);
        }
        
        const dog = this.getDogById(ancestorId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            this._coiCache.set(cacheKey, 0);
            return 0;
        }
        
        // Bereken COI van deze voorouder
        const contributions = this._findAllRouteContributions(ancestorId, maxDepth);
        let total = 0;
        
        contributions.forEach(c => {
            // Recursie: bereken COI van díé voorouder
            const deeperCOI = this.calculateAncestorCOI(c.ancestorId, maxDepth - 1);
            total += c.baseContribution * (1 + deeperCOI);
        });
        
        this._coiCache.set(cacheKey, total);
        return total;
    }

    // ✅ Vind ALLE paden naar voorouders
    _getAllPathsToAncestors(dogId, maxDepth, currentDepth = 0, currentPath = [], result = new Map(), visited = new Set()) {
        if (!dogId || currentDepth >= maxDepth) return result;
        
        if (visited.has(dogId)) return result;
        visited.add(dogId);
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            const newPath = [...currentPath, dog.vaderId];
            
            if (!result.has(dog.vaderId)) {
                result.set(dog.vaderId, []);
            }
            result.get(dog.vaderId).push([...newPath]);
            
            this._getAllPathsToAncestors(dog.vaderId, maxDepth, currentDepth + 1, newPath, result, new Set(visited));
        }
        
        if (dog.moederId) {
            const newPath = [...currentPath, dog.moederId];
            
            if (!result.has(dog.moederId)) {
                result.set(dog.moederId, []);
            }
            result.get(dog.moederId).push([...newPath]);
            
            this._getAllPathsToAncestors(dog.moederId, maxDepth, currentDepth + 1, newPath, result, new Set(visited));
        }
        
        return result;
    }

    _calculateAllGenerations(dogId, maxDepth) {
        // Vergelijkbaar met calculateCOI maar met maxDepth
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        const contributions = this._findAllRouteContributions(dogId, maxDepth);
        
        let total = 0;
        contributions.forEach(c => {
            const ancestorCOI = this.calculateAncestorCOI(c.ancestorId, maxDepth - 1);
            total += c.baseContribution * (1 + ancestorCOI);
        });
        
        return total;
    }

    // ✅ SIMPELE INTERFACE VOOR JOUW CODE
    calculateSimpleCOI(dogId) {
        const result = this.calculateCOI(dogId);
        return {
            coi6Gen: result.coi6Gen,
            coiAllGen: result.coiAllGen
        };
    }

    // ✅ DEBUG: Toon wat we vinden
    debugEsther() {
        console.log(`\n🔬 DEBUG ESTHER:`);
        
        const esther = this.getDogById(637);
        if (!esther) return;
        
        console.log(`   Esther: ${esther.naam} (${esther.id})`);
        console.log(`   Vader: ${this.getDogById(esther.vaderId)?.naam || esther.vaderId}`);
        console.log(`   Moeder: ${this.getDogById(esther.moederId)?.naam || esther.moederId}`);
        
        // Vind alle bijdragen
        const contributions = this._findAllRouteContributions(637, 6);
        
        console.log(`\n   ${contributions.length} route-combinaties gevonden`);
        
        // Groepeer per voorouder
        const byAncestor = {};
        contributions.forEach(c => {
            if (!byAncestor[c.ancestorId]) {
                byAncestor[c.ancestorId] = [];
            }
            byAncestor[c.ancestorId].push(c);
        });
        
        console.log(`   ${Object.keys(byAncestor).length} unieke voorouders`);
        
        // Toon top 10
        const sorted = Object.entries(byAncestor)
            .map(([id, contribs]) => ({
                id,
                naam: this.getDogById(id)?.naam || `ID:${id}`,
                total: contribs.reduce((sum, c) => sum + c.baseContribution, 0)
            }))
            .sort((a, b) => b.total - a.total);
        
        console.log(`\n   TOP 10 VOOROUDERS:`);
        sorted.slice(0, 10).forEach((anc, i) => {
            console.log(`   ${i+1}. ${anc.naam.padEnd(30)} (${anc.id}): ${(anc.total * 100).toFixed(4)}%`);
        });
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator FINAL geladen (auto-detectie)');
}