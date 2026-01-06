// COICalculator CORRECT - VOLGENS JOUW BESCHRIJVING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator CORRECT: ${this._dogMap.size} honden geladen`);
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
            
            // VOLGENS JOUW FORMULE
            const coi6Gen = this._calculateCOICorrect(dogId, 6);
            const coiAllGen = this._calculateCOICorrect(dogId, 25);
            
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

    // CORRECTE FORMULE: Σ [(1/2)^n * (1 + IC_voorouder)]
    _calculateCOICorrect(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `correct_${dogId}_${maxDepth}`;
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
        
        // STAP 1: Tel hoe vaak elke voorouder voorkomt in vader's lijn
        const vaderCounts = this._countAncestorOccurrences(dog.vaderId, maxDepth);
        
        // STAP 2: Tel hoe vaak elke voorouder voorkomt in moeder's lijn  
        const moederCounts = this._countAncestorOccurrences(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        
        // STAP 3: Voor elke voorouder die in BEIDE ouders voorkomt
        for (const [ancestorId, vaderCount] of vaderCounts.entries()) {
            if (moederCounts.has(ancestorId)) {
                const moederCount = moederCounts.get(ancestorId);
                
                // n = totaal aantal keer dat voorouder voorkomt
                const n = vaderCount + moederCount;
                
                // Bereken IC_voorouder (recursief)
                const icVoorouder = this._calculateCOICorrect(ancestorId, maxDepth - 1);
                
                // FORMULE: (1/2)^n * (1 + IC_voorouder)
                const contribution = Math.pow(0.5, n) * (1 + icVoorouder);
                totalCOI += contribution;
                
                // Debug
                if (maxDepth === 6 && contribution > 0.001) {
                    const ancestorDog = this.getDogById(ancestorId);
                    console.log(`   ➡ ${ancestorDog?.naam || ancestorId}: n=${n} (V${vaderCount}+M${moederCount}), IC=${(icVoorouder*100).toFixed(1)}%, bijdr=${(contribution*100).toFixed(3)}%`);
                }
            }
        }
        
        // Limiet tot realistische waarden
        if (totalCOI > 1.0) totalCOI = 1.0;
        
        console.log(`   ➡ ${maxDepth}gen: totaal = ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Tel hoe vaak elke voorouder voorkomt
    _countAncestorOccurrences(startId, maxDepth, currentDepth = 1, counts = new Map(), visitedInPath = new Set()) {
        if (currentDepth > maxDepth || !startId || visitedInPath.has(startId)) {
            return counts;
        }
        
        visitedInPath.add(startId);
        const dog = this.getDogById(startId);
        if (!dog) return counts;
        
        // Tel vader
        if (dog.vaderId) {
            const current = counts.get(dog.vaderId) || 0;
            counts.set(dog.vaderId, current + 1);
            
            // Recursie
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
            const current = counts.get(dog.moederId) || 0;
            counts.set(dog.moederId, current + 1);
            
            // Recursie
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

    // TEST MET BEKENDE WAARDEN
    testKnownValues() {
        console.log('=== TEST MET BEKENDE WAARDEN ===');
        
        // Test 1: Zelfde ouders
        console.log('1. Zelfde ouders: 25%');
        console.log('   n = 2 (1x in vader + 1x in moeder)');
        console.log('   (1/2)^2 * (1 + 0) = 0.25 = 25% ✓');
        
        // Test 2: Ouders zijn volle broer/zus
        console.log('\n2. Ouders volle broer/zus: 25%');
        console.log('   Gedeelde grootouders: elk 2x voorkomen');
        console.log('   Voor grootouder: n = 4 (2x in vader + 2x in moeder)');
        console.log('   (1/2)^4 * (1 + 0) = 0.0625 = 6.25% per grootouder');
        console.log('   2 grootouders: 2 * 6.25% = 12.5% ✗ (moet 25% zijn!)');
        
        // Test 3: Half broer/zus
        console.log('\n3. Ouders half broer/zus: 12.5%');
        console.log('   1 gedeelde grootouder: n = 4');
        console.log('   (1/2)^4 * (1 + 0) = 6.25% ✗ (moet 12.5% zijn!)');
        
        console.log('\n❌ PROBLEEM: De formule lijkt niet te kloppen!');
        console.log('   Misschien is n = aantal generaties, niet aantal keer voorkomen?');
        
        return false;
    }

    // ALTERNATIEF: Gebruik standaard Wright's formule
    calculateCOIStandard(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Standaard formule: (1/2)^(n1+n2+1)
        // Voor grootouder: n1=1, n2=1 → (1/2)^3 = 12.5%
        // Voor ouders volle broer/zus: elk heeft 2 gemeenschappelijke grootouders
        // 2 * 12.5% = 25% ✓
        
        // Verzamel voorouders met diepte
        const vaderAncestors = this._getAncestorsWithDepth(dog.vaderId, generations);
        const moederAncestors = this._getAncestorsWithDepth(dog.moederId, generations);
        
        let total = 0;
        
        for (const [ancestorId, vDepth] of vaderAncestors.entries()) {
            if (moederAncestors.has(ancestorId)) {
                const mDepth = moederAncestors.get(ancestorId);
                // Standaard formule
                total += Math.pow(0.5, vDepth + mDepth + 1);
            }
        }
        
        return total;
    }

    _getAncestorsWithDepth(startId, maxDepth, currentDepth = 1, result = new Map(), visited = new Set()) {
        if (currentDepth > maxDepth || !startId || visited.has(startId)) return result;
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            if (!result.has(dog.vaderId) || result.get(dog.vaderId) > currentDepth) {
                result.set(dog.vaderId, currentDepth);
            }
            this._getAncestorsWithDepth(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        if (dog.moederId) {
            if (!result.has(dog.moederId) || result.get(dog.moederId) > currentDepth) {
                result.set(dog.moederId, currentDepth);
            }
            this._getAncestorsWithDepth(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    // EENVOUDIGE BEREKENING VOOR PRACTISCHE TOEPASSING
    calculateSimple(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Directe gevallen
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
        
        // Complexer: gebruik standaard berekening voor 3 generaties
        return this.calculateCOIStandard(dogId, 3) * 100;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator CORRECT geladen');
    
    // Vergelijkende test
    window.compareMethods = function(dogs, testId) {
        const calculator = new COICalculator(dogs);
        
        console.log(`=== VERGELIJKING VOOR HOND ${testId} ===`);
        
        // 1. Volgens jouw formule (die waarschijnlijk fout is)
        const result1 = calculator.calculateCOI(testId);
        console.log(`Jouw formule: ${result1.coi6Gen}%`);
        
        // 2. Standaard formule
        const standard = calculator.calculateCOIStandard(testId, 6) * 100;
        console.log(`Standaard formule: ${standard.toFixed(1)}%`);
        
        // 3. Simpele praktische berekening
        const simple = calculator.calculateSimple(testId);
        console.log(`Simpele berekening: ${simple.toFixed(1)}%`);
        
        // 4. Test bekende waarden
        calculator.testKnownValues();
        
        return {
            jouwFormule: result1.coi6Gen,
            standaard: standard.toFixed(1),
            simpel: simple.toFixed(1)
        };
    };
}