// COICalculator V8 - EXACT VOLGENS JOUW BESCHRIJVING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator V8: ${this._dogMap.size} honden geladen`);
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
            
            // VOLGENS JOUW BESCHRIJVING
            const coi6Gen = this._calculateCOIExact(dogId, 6);
            const coiAllGen = this._calculateCOIExact(dogId, 25);
            
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

    // EXACT VOLGENS JOUW BESCHRIJVING
    _calculateCOIExact(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `exact_${dogId}_${maxDepth}`;
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
        
        // STAP 1: Vind alle voorouders van vader en moeder
        const vaderAncestors = this._countAncestorOccurrences(dog.vaderId, maxDepth);
        const moederAncestors = this._countAncestorOccurrences(dog.moederId, maxDepth);
        
        // STAP 2: Vind gemeenschappelijke voorouders
        const commonAncestors = new Map();
        
        for (const [ancestorId, vaderCount] of vaderAncestors.entries()) {
            if (moederAncestors.has(ancestorId)) {
                const moederCount = moederAncestors.get(ancestorId);
                // n = hoe vaak de voorouder voorkomt in BEIDE ouders
                const n = vaderCount + moederCount;
                commonAncestors.set(ancestorId, {
                    vaderCount: vaderCount,
                    moederCount: moederCount,
                    totalCount: n
                });
            }
        }
        
        // STAP 3: Bereken COI volgens formule
        let totalCOI = 0;
        const contributions = [];
        
        for (const [ancestorId, counts] of commonAncestors.entries()) {
            // Bereken IC_voorouder (recursief)
            const icVoorouder = this._calculateCOIExact(ancestorId, maxDepth - 1);
            
            // FORMULE: (1/2)^n * (1 + IC_voorouder)
            const n = counts.totalCount;
            const contribution = Math.pow(0.5, n) * (1 + icVoorouder);
            totalCOI += contribution;
            
            // Voor debug
            if (maxDepth === 6 && contribution > 0.001) {
                const ancestorDog = this.getDogById(ancestorId);
                contributions.push({
                    name: ancestorDog?.naam || `ID:${ancestorId}`,
                    n: n,
                    vaderCount: counts.vaderCount,
                    moederCount: counts.moederCount,
                    icVoorouder: icVoorouder * 100,
                    contribution: contribution * 100
                });
            }
        }
        
        // Toon bijdragen voor 6 generaties
        if (maxDepth === 6 && contributions.length > 0) {
            console.log(`   ➡ 6gen bijdragers volgens jouw formule:`);
            contributions.sort((a, b) => b.contribution - a.contribution);
            
            contributions.slice(0, 10).forEach(c => {
                console.log(`      ${c.name}: n=${c.n} (V${c.vaderCount}+M${c.moederCount}), IC_voorouder=${c.icVoorouder.toFixed(1)}%, bijdrage=${c.contribution.toFixed(3)}%`);
            });
        }
        
        console.log(`   ➡ ${maxDepth}gen: totaal COI = ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Tel hoe vaak elke voorouder voorkomt
    _countAncestorOccurrences(dogId, maxDepth, currentDepth = 1, counts = new Map(), visitedInPath = new Set()) {
        if (currentDepth > maxDepth || !dogId) return counts;
        
        // Voorkom oneindige loops
        if (visitedInPath.has(dogId)) return counts;
        visitedInPath.add(dogId);
        
        const dog = this.getDogById(dogId);
        if (!dog) return counts;
        
        // Tel vader
        if (dog.vaderId) {
            const currentCount = counts.get(dog.vaderId) || 0;
            counts.set(dog.vaderId, currentCount + 1);
            
            // Recursie voor vader's voorouders
            this._countAncestorOccurrences(
                dog.vaderId,
                maxDepth,
                currentDepth + 1,
                counts,
                new Set(visitedInPath)
            );
        }
        
        // Tel moeder
        if (dog.moederId) {
            const currentCount = counts.get(dog.moederId) || 0;
            counts.set(dog.moederId, currentCount + 1);
            
            // Recursie voor moeder's voorouders
            this._countAncestorOccurrences(
                dog.moederId,
                maxDepth,
                currentDepth + 1,
                counts,
                new Set(visitedInPath)
            );
        }
        
        return counts;
    }

    // DEBUG: Toon stamboom met tellingen
    debugPedigreeWithCounts(dogId, depth = 3) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`=== STAMBOOM MET VOOROUDER-TELLING voor ${dog.naam} ===`);
        const counts = this._countAncestorOccurrences(dogId, depth);
        
        // Toon voorouders gesorteerd op aantal keer
        const sorted = Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);
        
        sorted.forEach(([ancestorId, count]) => {
            const ancestorDog = this.getDogById(ancestorId);
            console.log(`  ${ancestorDog?.naam || `ID:${ancestorId}`}: ${count} keer`);
        });
        
        console.log(`=============================================`);
    }

    // SNEL BEREKENING (zonder recursie voor IC_voorouder)
    calculateQuickCOI(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        const vaderCounts = this._countAncestorOccurrences(dog.vaderId, generations);
        const moederCounts = this._countAncestorOccurrences(dog.moederId, generations);
        
        let total = 0;
        
        for (const [ancestorId, vCount] of vaderCounts.entries()) {
            if (moederCounts.has(ancestorId)) {
                const mCount = moederCounts.get(ancestorId);
                const n = vCount + mCount;
                // ZONDER (1 + IC_voorouder) - gewoon (1/2)^n
                total += Math.pow(0.5, n);
            }
        }
        
        return total;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V8 geladen EXACT VOLGENS JOUW BESCHRIJVING');
    
    // Test functie
    window.testCOIExact = function(dogs, testId) {
        const calculator = new COICalculator(dogs);
        
        // 1. Exact volgens jouw formule
        const result = calculator.calculateCOI(testId);
        
        // 2. Toon vooroudertellingen
        calculator.debugPedigreeWithCounts(testId, 4);
        
        // 3. Snel berekening voor vergelijking
        const quick = calculator.calculateQuickCOI(testId, 6);
        console.log(`Snel (zonder IC_voorouder): ${(quick * 100).toFixed(1)}%`);
        
        return result;
    };
}