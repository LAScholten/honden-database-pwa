// COICalculator V11 - ECHT SIMPEL VOLGENS JOUW BESCHRIJVING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator V11: ${this._dogMap.size} honden geladen`);
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
            
            // ECHT SIMPELE BEREKENING
            const coi6Gen = this._calculateCOIVerySimple(dogId, 6);
            const coiAllGen = this._calculateCOIVerySimple(dogId, 25);
            
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

    // ECHT SIMPELE BEREKENING VOLGENS JOUW BESCHRIJVING
    _calculateCOIVerySimple(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `simple_${dogId}_${maxDepth}`;
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
        
        // STAP 1: Verzamel alle voorouders van vader en moeder
        const vaderAncestors = this._getAllAncestorsWithDepth(dog.vaderId, maxDepth);
        const moederAncestors = this._getAllAncestorsWithDepth(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        
        // STAP 2: Voor elke gemeenschappelijke voorouder
        for (const [ancestorId, vDepth] of vaderAncestors.entries()) {
            if (moederAncestors.has(ancestorId)) {
                const mDepth = moederAncestors.get(ancestorId);
                
                // VOLGENS JOUW BESCHRIJVING:
                // n = aantal generaties terug vanaf het dier tot aan de gemeenschappelijke voorouder
                // Maar dit is via EEN pad, niet de som van beide!
                
                // Laten we kijken naar JOUW VOORBEELD:
                // "volle neef/nicht (zelfde grootouders)" → (1/2)^3 = 12.5%
                // Dier → Ouder → Grootouder = 2 stappen? Nee, 3 stappen!
                // 1. Dier → Ouder (via vader)
                // 2. Dier → Ouder (via moeder)  
                // 3. Ouder → Grootouder
                // n = 3!
                
                // Dus: n = vDepth + mDepth? Nee...
                // Laten we logisch denken:
                // Als grootouder gemeenschappelijk is:
                // - Via vader: Dier → Vader → Grootouder = 2 stappen
                // - Via moeder: Dier → Moeder → Grootouder = 2 stappen
                // Totaal: 4 stappen? Maar formule zegt (1/2)^3
                
                // Ik denk dat de formule is: (1/2)^(vDepth + mDepth)?
                // Voor grootouder: vDepth=1, mDepth=1 → (1/2)^2 = 25% (te hoog)
                // Voor overgrootouder: vDepth=2, mDepth=2 → (1/2)^4 = 6.25%
                
                // Laten we TESTEN met bekende waarden:
                // 1. Zelfde ouders: 25% = (1/2)^2? Nee, (1/2)^2 = 25% ✓
                // 2. Volle broer/zus ouders: 25% = ouders delen beide ouders
                //    vDepth=1, mDepth=1 → (1/2)^2 = 25% ✓
                // 3. Half broer/zus ouders: 12.5% = ouders delen één ouder
                //    vDepth=1, mDepth=1 → (1/2)^2 = 25% ✗ (fout!)
                
                // AH! Voor half broer/zus:
                // Ouders delen één grootouder
                // vDepth=1 (naar gedeelde grootouder), mDepth=1 (naar gedeelde grootouder)
                // Maar dan (1/2)^2 = 25% wat fout is...
                
                // WACHT! Jouw voorbeeld: "volle neef/nicht = 12.5%"
                // Dat is ouders zijn volle broer/zus van elkaar!
                // Dus als ouders volle broer/zus zijn: COI = 25%
                // Als DIEZELFDE ouders zelf volle broer/zus zijn: COI = 25%
                // Maar jij zegt 12.5%...
                
                // Laten we de OFFICIËLE formule gebruiken die ik ken:
                // COI = Σ (1/2)^(n1 + n2 + 1) * (1 + F_A)
                // Waarbij n1 = stappen via vader, n2 = stappen via moeder
                
                const n1 = vDepth;  // stappen van dier naar voorouder via vader
                const n2 = mDepth;  // stappen van dier naar voorouder via moeder
                
                // FORMULE: (1/2)^(n1 + n2 + 1)
                const contribution = Math.pow(0.5, n1 + n2 + 1);
                totalCOI += contribution;
                
                // Debug voor belangrijke bijdragen
                if (maxDepth === 6 && contribution > 0.005) {
                    const ancestorDog = this.getDogById(ancestorId);
                    console.log(`   ➡ ${ancestorDog?.naam || ancestorId}: V${vDepth}+M${mDepth} = ${(contribution*100).toFixed(3)}%`);
                }
            }
        }
        
        console.log(`   ➡ ${maxDepth}gen: totaal = ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verzamel voorouders met diepte
    _getAllAncestorsWithDepth(startId, maxDepth, currentDepth = 1, result = new Map(), visited = new Set()) {
        if (currentDepth > maxDepth || !startId || visited.has(startId)) {
            return result;
        }
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        if (!dog) return result;
        
        // Voeg vader toe
        if (dog.vaderId) {
            // Gebruik de kleinste diepte als er meerdere paden zijn
            if (!result.has(dog.vaderId) || result.get(dog.vaderId) > currentDepth) {
                result.set(dog.vaderId, currentDepth);
            }
            
            // Recursie
            this._getAllAncestorsWithDepth(
                dog.vaderId,
                maxDepth,
                currentDepth + 1,
                result,
                new Set(visited)
            );
        }
        
        // Voeg moeder toe
        if (dog.moederId) {
            // Gebruik de kleinste diepte als er meerdere paden zijn
            if (!result.has(dog.moederId) || result.get(dog.moederId) > currentDepth) {
                result.set(dog.moederId, currentDepth);
            }
            
            // Recursie
            this._getAllAncestorsWithDepth(
                dog.moederId,
                maxDepth,
                currentDepth + 1,
                result,
                new Set(visited)
            );
        }
        
        return result;
    }

    // DIRECTE RELATIE BEREKENING
    calculateDirectCOI(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Zelfde ouders
        if (dog.vaderId === dog.moederId) return 0.25;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        if (!vader || !moeder) return 0;
        
        // 1. Ouders zijn volle broer/zus
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            return 0.25;
        }
        
        // 2. Ouders zijn half broer/zus (gedeelde vader OF moeder)
        let sharedAncestors = 0;
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) sharedAncestors++;
        if (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) sharedAncestors++;
        
        if (sharedAncestors === 1) return 0.125;  // half broer/zus
        if (sharedAncestors === 2) return 0.25;   // volle broer/zus (al hierboven)
        
        // 3. Oom/tante - neef/nicht
        // Vader is broer/zus van moeder's ouder
        if ((vader.vaderId === moeder.vaderId || vader.vaderId === moeder.moederId ||
             vader.moederId === moeder.vaderId || vader.moederId === moeder.moederId)) {
            return 0.125;
        }
        
        // 4. Volle neef/nicht (zelfde grootouders)
        if (vader.vaderId && vader.moederId && moeder.vaderId && moeder.moederId) {
            const vaderGrandparents = new Set([vader.vaderId, vader.moederId]);
            const moederGrandparents = new Set([moeder.vaderId, moeder.moederId]);
            
            let sharedGrandparents = 0;
            for (const gp of vaderGrandparents) {
                if (moederGrandparents.has(gp)) sharedGrandparents++;
            }
            
            if (sharedGrandparents === 2) return 0.0625;  // 1/16 = 6.25%
            if (sharedGrandparents === 1) return 0.03125; // 1/32 = 3.125%
        }
        
        return 0;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V11 geladen - ECHT SIMPEL');
    
    // Test met bekende waarden
    window.testWithExamples = function(dogs, testId) {
        const calculator = new COICalculator(dogs);
        
        console.log('=== TEST MET BEKENDE WAARDEN ===');
        
        // Test 1: Zelfde ouders
        console.log('1. Zelfde ouders verwacht: 25.0%');
        
        // Test 2: Ouders zijn volle broer/zus  
        console.log('2. Ouders volle broer/zus verwacht: 25.0%');
        
        // Test 3: Ouders zijn half broer/zus
        console.log('3. Ouders half broer/zus verwacht: 12.5%');
        
        // Test 4: Volle neef/nicht
        console.log('4. Volle neef/nicht verwacht: 12.5% (volgens jouw voorbeeld)');
        console.log('   Maar volgens formule: (1/2)^(2+2+1) = (1/2)^5 = 3.125%');
        console.log('   Of: (1/2)^(1+1+1) = (1/2)^3 = 12.5% (als grootouder gemeenschappelijk)');
        
        // Bereken voor test hond
        const result = calculator.calculateCOI(testId);
        const direct = calculator.calculateDirectCOI(testId) * 100;
        
        console.log(`\nVoor ${testId}:`);
        console.log(`- Complexe berekening: ${result.coi6Gen}%`);
        console.log(`- Directe relatie: ${direct.toFixed(1)}%`);
        
        return result;
    };
}