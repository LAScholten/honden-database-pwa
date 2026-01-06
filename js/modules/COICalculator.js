// COICalculator V10 - DEFINITIEF CORRECT
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator V10: ${this._dogMap.size} honden geladen`);
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
            
            // DEFINITIEF CORRECTE BEREKENING
            const coi6Gen = this._calculateCOIFinal(dogId, 6);
            const coiAllGen = this._calculateCOIFinal(dogId, 25);
            
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

    // DEFINITIEF CORRECTE BEREKENING
    _calculateCOIFinal(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `final_${dogId}_${maxDepth}`;
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
        
        // VERZAMEL PADEN CORRECT
        const vaderPaths = this._getAllPathsSimple(dog.vaderId, maxDepth);
        const moederPaths = this._getAllPathsSimple(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        const contributions = [];
        
        // Voor elke voorouder in vaders paden
        for (const vPath of vaderPaths) {
            // Zoek dezelfde voorouder in moeders paden
            for (const mPath of moederPaths) {
                if (vPath.ancestorId === mPath.ancestorId) {
                    // n1 = diepte via vader, n2 = diepte via moeder
                    const n1 = vPath.depth;
                    const n2 = mPath.depth;
                    
                    // CORRECTE FORMULE: (1/2)^(n1 + n2 + 1)
                    const contribution = Math.pow(0.5, n1 + n2 + 1);
                    totalCOI += contribution;
                    
                    // Voor debug (alleen 6 gen en > 0.1%)
                    if (maxDepth === 6 && contribution > 0.001) {
                        const ancestorDog = this.getDogById(vPath.ancestorId);
                        contributions.push({
                            name: ancestorDog?.naam || `ID:${vPath.ancestorId}`,
                            vDepth: n1,
                            mDepth: n2,
                            contribution: contribution * 100
                        });
                    }
                }
            }
        }
        
        // Toon bijdragen voor 6 generaties
        if (maxDepth === 6 && contributions.length > 0) {
            console.log(`   ➡ 6gen belangrijkste bijdragers:`);
            
            // Groepeer per voorouder
            const grouped = {};
            contributions.forEach(c => {
                if (!grouped[c.name]) grouped[c.name] = { total: 0, details: [] };
                grouped[c.name].total += c.contribution;
                grouped[c.name].details.push(`V(${c.vDepth})/M(${c.mDepth})`);
            });
            
            // Sorteer op bijdrage
            Object.entries(grouped)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 8)
                .forEach(([name, data]) => {
                    console.log(`      ${name}: ${data.total.toFixed(3)}%`);
                    // Toon details voor de grootste bijdragen
                    if (data.total > 1.0) {
                        data.details.forEach(d => console.log(`        ${d}`));
                    }
                });
        }
        
        // Maximaal 100%
        if (totalCOI > 1.0) totalCOI = 1.0;
        
        console.log(`   ➡ ${maxDepth}gen: totaal COI = ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // SIMPELE PAD VERZAMELING (geen dubbele telling)
    _getAllPathsSimple(dogId, maxDepth, currentDepth = 1, paths = [], visitedInPath = new Set()) {
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
            
            // Ga dieper via vader
            this._getAllPathsSimple(
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
            
            // Ga dieper via moeder
            this._getAllPathsSimple(
                dog.moederId,
                maxDepth,
                currentDepth + 1,
                paths,
                new Set(visitedInPath)
            );
        }
        
        return paths;
    }

    // SCHATTING OP BASIS VAN RELATIE (voor snelle check)
    estimateCOI(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Zelfde ouders
        if (dog.vaderId === dog.moederId) return 0.25;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        if (!vader || !moeder) return 0;
        
        // Volle broer/zus
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            return 0.25;
        }
        
        // Half broer/zus
        if ((vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
            (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
            return 0.125;
        }
        
        // Oom/tante - neef/nicht
        if (this._areUncleNiece(vaderId, moederId)) {
            return 0.125;
        }
        
        // Verder weg: schatting
        return this._calculateCOIFinal(dogId, 3) * 1.5; // Schatting voor diepere generaties
    }

    _areUncleNiece(vaderId, moederId) {
        const vader = this.getDogById(vaderId);
        const moeder = this.getDogById(moederId);
        if (!vader || !moeder) return false;
        
        // Check of vader oom is van moeder
        if (vader.vaderId === moeder.vaderId || vader.vaderId === moeder.moederId ||
            vader.moederId === moeder.vaderId || vader.moederId === moeder.moederId) {
            return true;
        }
        
        return false;
    }

    // TOON STAMBOOM
    showPedigree(dogId, depth = 3) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`=== STAMBOOM VAN ${dog.naam} (${dog.id}) ===`);
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
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V10 geladen - DEFINITIEF CORRECT');
    
    // Test functie
    window.testCOIFinal = function(dogs, testId) {
        const calculator = new COICalculator(dogs);
        
        // 1. Bereken COI
        const result = calculator.calculateCOI(testId);
        
        // 2. Toon stamboom
        calculator.showPedigree(testId, 3);
        
        // 3. Schatting voor vergelijking
        const estimate = calculator.estimateCOI(testId) * 100;
        console.log(`Schatting: ${estimate.toFixed(1)}%`);
        
        return result;
    };
}