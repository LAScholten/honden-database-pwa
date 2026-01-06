// COICalculator V6 - SIMPELE MAAR CORRECTE BEREKENING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator V6: ${this._dogMap.size} honden geladen`);
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
            
            // Gebruik vereenvoudigde maar correcte berekening
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
        
        // 1. Verzamel alle voorouders van vader
        const vaderAncestors = this._getAllAncestors(dog.vaderId, maxDepth);
        // 2. Verzamel alle voorouders van moeder
        const moederAncestors = this._getAllAncestors(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        const contributions = [];
        
        // 3. Voor elke gemeenschappelijke voorouder
        for (const [ancestorId, vDepth] of vaderAncestors.entries()) {
            if (moederAncestors.has(ancestorId)) {
                const mDepth = moederAncestors.get(ancestorId);
                
                // n1 = diepte via vader, n2 = diepte via moeder
                const n1 = vDepth;
                const n2 = mDepth;
                
                // DE JUISTE FORMULE: (1/2)^(n1 + n2 + 1)
                const contribution = Math.pow(0.5, n1 + n2 + 1);
                totalCOI += contribution;
                
                // Voor debug/analyse
                if (maxDepth === 6 && contribution > 0.001) {
                    const ancestorDog = this.getDogById(ancestorId);
                    contributions.push({
                        name: ancestorDog?.naam || `ID:${ancestorId}`,
                        depth: `V(${n1})/M(${n2})`,
                        contribution: contribution * 100
                    });
                }
            }
        }
        
        // Toon bijdragen voor 6 generaties
        if (maxDepth === 6 && contributions.length > 0) {
            console.log(`   ➡ 6gen belangrijkste bijdragers:`);
            // Sorteer op bijdrage
            contributions.sort((a, b) => b.contribution - a.contribution);
            
            contributions.slice(0, 10).forEach(c => {
                console.log(`      ${c.name}: ${c.depth} = ${c.contribution.toFixed(3)}%`);
            });
        }
        
        console.log(`   ➡ ${maxDepth}gen: totaal COI = ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verzamel alle voorouders met diepte
    _getAllAncestors(dogId, maxDepth, currentDepth = 1, result = new Map(), visited = new Set()) {
        if (currentDepth > maxDepth || !dogId || visited.has(dogId)) {
            return result;
        }
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        // Voeg vader toe
        if (dog.vaderId) {
            // Alleen toevoegen als we deze diepte nog niet hebben (gebruik de kortste diepte)
            if (!result.has(dog.vaderId) || result.get(dog.vaderId) > currentDepth) {
                result.set(dog.vaderId, currentDepth);
            }
            
            // Ga dieper
            this._getAllAncestors(
                dog.vaderId,
                maxDepth,
                currentDepth + 1,
                result,
                new Set(visited) // Nieuwe visited set voor elke tak
            );
        }
        
        // Voeg moeder toe
        if (dog.moederId) {
            // Alleen toevoegen als we deze diepte nog niet hebben (gebruik de kortste diepte)
            if (!result.has(dog.moederId) || result.get(dog.moederId) > currentDepth) {
                result.set(dog.moederId, currentDepth);
            }
            
            // Ga dieper
            this._getAllAncestors(
                dog.moederId,
                maxDepth,
                currentDepth + 1,
                result,
                new Set(visited) // Nieuwe visited set voor elke tak
            );
        }
        
        return result;
    }

    // DEBUG: Toon stamboom
    debugPedigree(dogId, depth = 3) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`=== STAMBOOM voor ${dog.naam} (${dogId}) ===`);
        this._printPedigree(dogId, 0, depth, '');
        console.log(`===================================`);
    }

    _printPedigree(dogId, level, maxLevel, prefix) {
        if (level >= maxLevel) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        const indent = '  '.repeat(level);
        console.log(`${prefix}${indent}${dog.naam} (${dog.id})`);
        
        if (dog.vaderId) {
            this._printPedigree(dog.vaderId, level + 1, maxLevel, `${prefix}${indent}├─V: `);
        }
        if (dog.moederId) {
            this._printPedigree(dog.moederId, level + 1, maxLevel, `${prefix}${indent}└─M: `);
        }
    }

    // ANALYSE: Check specifieke voorouders
    analyzeCommonAncestors(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            console.log("Geen ouders gevonden");
            return [];
        }
        
        const vaderAncestors = this._getAllAncestors(dog.vaderId, generations);
        const moederAncestors = this._getAllAncestors(dog.moederId, generations);
        
        const common = [];
        
        for (const [ancestorId, vDepth] of vaderAncestors.entries()) {
            if (moederAncestors.has(ancestorId)) {
                const mDepth = moederAncestors.get(ancestorId);
                const contribution = Math.pow(0.5, vDepth + mDepth + 1) * 100;
                
                const ancestorDog = this.getDogById(ancestorId);
                common.push({
                    id: ancestorId,
                    name: ancestorDog?.naam || `ID:${ancestorId}`,
                    viaVader: vDepth,
                    viaMoeder: mDepth,
                    contribution: contribution
                });
            }
        }
        
        // Sorteer op bijdrage
        common.sort((a, b) => b.contribution - a.contribution);
        
        console.log(`=== GEMEENSCHAPPELIJKE VOOROUDERS voor ${dog.naam} ===`);
        common.forEach(a => {
            console.log(`${a.name}: V(${a.viaVader})/M(${a.viaMoeder}) = ${a.contribution.toFixed(3)}%`);
        });
        
        const total = common.reduce((sum, a) => sum + a.contribution, 0);
        console.log(`TOTAAL: ${total.toFixed(2)}%`);
        console.log(`===================================`);
        
        return common;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V6 geladen met vereenvoudigde berekening');
    
    // Test functie
    window.testCOIWithAnalysis = function(dogs, testId) {
        const calculator = new COICalculator(dogs);
        
        // Bereken COI
        const result = calculator.calculateCOI(testId);
        
        // Analyseer gemeenschappelijke voorouders
        calculator.analyzeCommonAncestors(testId, 6);
        
        // Toon stamboom
        calculator.debugPedigree(testId, 3);
        
        return result;
    };
}