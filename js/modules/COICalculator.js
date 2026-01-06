// COICalculator V5 - GECORRIGEERDE COI BEREKENING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._pathCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator V5: ${this._dogMap.size} honden geladen`);
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
            
            // Gebruik verbeterde berekening
            const coi6Gen = this._calculateCOIByPathSum(dogId, 6);
            const coiAllGen = this._calculateCOIByPathSum(dogId, 25);
            
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

    // VERBETERDE BEREKENING: Correcte pad-sommatie
    _calculateCOIByPathSum(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `${dogId}_${maxDepth}`;
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
        
        // Verzamel alle paden van vader en moeder
        const vaderPaths = this._getAllPaths(dog.vaderId, maxDepth);
        const moederPaths = this._getAllPaths(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        
        // Voor elk uniek voorouder ID dat in beide lijsten voorkomt
        const commonAncestorIds = new Set();
        
        vaderPaths.forEach(path => {
            if (path.ancestorId) commonAncestorIds.add(path.ancestorId);
        });
        
        moederPaths.forEach(path => {
            if (path.ancestorId) commonAncestorIds.add(path.ancestorId);
        });
        
        console.log(`   ➡ ${maxDepth}gen: ${vaderPaths.length} vader-paden, ${moederPaths.length} moeder-paden`);
        
        // Voor elke gemeenschappelijke voorouder
        for (const ancestorId of commonAncestorIds) {
            // Vind alle paden van vader naar deze voorouder
            const vaderPathsToAncestor = vaderPaths.filter(p => p.ancestorId === ancestorId);
            const moederPathsToAncestor = moederPaths.filter(p => p.ancestorId === ancestorId);
            
            if (vaderPathsToAncestor.length === 0 || moederPathsToAncestor.length === 0) continue;
            
            // Bereken COI van de voorouder zelf
            const fAncestor = this._calculateCOIByPathSum(ancestorId, maxDepth - 1);
            
            // Voor elk pad van vader naar de voorouder
            for (const vPath of vaderPathsToAncestor) {
                // Voor elk pad van moeder naar de voorouder
                for (const mPath of moederPathsToAncestor) {
                    // n1 = aantal stappen van vader naar voorouder
                    // n2 = aantal stappen van moeder naar voorouder
                    const n1 = vPath.depth;
                    const n2 = mPath.depth;
                    
                    // CORRECTE FORMULE: (1/2)^(n1 + n2 + 1) * (1 + F_A)
                    const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + fAncestor);
                    totalCOI += contribution;
                    
                    if (maxDepth <= 6 && contribution > 0.001) { // Alleen grote bijdragen tonen
                        const ancestorDog = this.getDogById(ancestorId);
                        console.log(`   ➡ ${maxDepth}gen: ${ancestorDog?.naam || ancestorId} via V(${n1})/M(${n2}) = ${(contribution*100).toFixed(3)}%`);
                    }
                }
            }
        }
        
        // LIMITEER TOT 100% (praktische limiet)
        if (totalCOI > 1.0) {
            console.log(`   ⚠️  ${maxDepth}gen: COI gecapped van ${(totalCOI*100).toFixed(1)}% naar 100.0%`);
            totalCOI = 1.0;
        }
        
        console.log(`   ➡ ${maxDepth}gen: totaal = ${(totalCOI*100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verzamel alle paden naar voorouders
    _getAllPaths(dogId, maxDepth, currentDepth = 1, currentPath = [], paths = []) {
        if (currentDepth > maxDepth) return paths;
        
        const dog = this.getDogById(dogId);
        if (!dog) return paths;
        
        // Voeg vader toe als voorouder
        if (dog.vaderId) {
            paths.push({
                ancestorId: dog.vaderId,
                depth: currentDepth,
                path: [...currentPath, 'V']
            });
            
            // Recursie voor diepere voorouders via vader
            this._getAllPaths(
                dog.vaderId,
                maxDepth,
                currentDepth + 1,
                [...currentPath, 'V'],
                paths
            );
        }
        
        // Voeg moeder toe als voorouder
        if (dog.moederId) {
            paths.push({
                ancestorId: dog.moederId,
                depth: currentDepth,
                path: [...currentPath, 'M']
            });
            
            // Recursie voor diepere voorouders via moeder
            this._getAllPaths(
                dog.moederId,
                maxDepth,
                currentDepth + 1,
                [...currentPath, 'M'],
                paths
            );
        }
        
        return paths;
    }

    // SIMPELE MAAR EFFECTIEVE BEREKENING (alternatief)
    calculateSimpleCOI(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Verzamel alle voorouders met diepte
        const vaderAncestors = this._getAncestorsWithDepth(dog.vaderId, generations);
        const moederAncestors = this._getAncestorsWithDepth(dog.moederId, generations);
        
        let totalCOI = 0;
        
        // Voor elke voorouder in vader's lijst
        for (const [vAncestorId, vDepth] of vaderAncestors) {
            // Kijk of deze ook in moeder's lijst zit
            if (moederAncestors.has(vAncestorId)) {
                const mDepth = moederAncestors.get(vAncestorId);
                
                // Bereken COI van de voorouder zelf (vereenvoudigd)
                const ancestorCOI = 0; // Voor nu, we negeren F_A voor simpliciteit
                
                // Wright's formule
                const contribution = Math.pow(0.5, vDepth + mDepth + 1) * (1 + ancestorCOI);
                totalCOI += contribution;
            }
        }
        
        return totalCOI;
    }

    _getAncestorsWithDepth(dogId, maxDepth, currentDepth = 1, result = new Map()) {
        if (currentDepth > maxDepth) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.set(dog.vaderId, currentDepth);
            this._getAncestorsWithDepth(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        
        if (dog.moederId) {
            result.set(dog.moederId, currentDepth);
            this._getAncestorsWithDepth(dog.moederId, maxDepth, currentDepth + 1, result);
        }
        
        return result;
    }

    // DEBUG: Toon belangrijkste bijdragers
    debugCOIContributors(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            console.log("Geen ouders gevonden");
            return;
        }
        
        console.log(`=== COI BIJDRAGERS voor ${dog.naam} (${dogId}) ===`);
        
        const vaderAncestors = this._getAncestorsWithDepth(dog.vaderId, generations);
        const moederAncestors = this._getAncestorsWithDepth(dog.moederId, generations);
        
        const contributors = [];
        
        for (const [ancestorId, vDepth] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                const mDepth = moederAncestors.get(ancestorId);
                const contribution = Math.pow(0.5, vDepth + mDepth + 1);
                
                const ancestorDog = this.getDogById(ancestorId);
                contributors.push({
                    name: ancestorDog?.naam || `ID:${ancestorId}`,
                    viaVader: vDepth,
                    viaMoeder: mDepth,
                    contribution: contribution * 100
                });
            }
        }
        
        // Sorteer op bijdrage (hoogste eerst)
        contributors.sort((a, b) => b.contribution - a.contribution);
        
        // Toon top 10
        contributors.slice(0, 10).forEach(c => {
            console.log(`${c.name}: V(${c.viaVader})/M(${c.viaMoeder}) = ${c.contribution.toFixed(3)}%`);
        });
        
        const total = contributors.reduce((sum, c) => sum + c.contribution, 0);
        console.log(`TOTAAL: ${total.toFixed(2)}%`);
        console.log(`===================================`);
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V5 geladen met gecorrigeerde pad-berekening');
}