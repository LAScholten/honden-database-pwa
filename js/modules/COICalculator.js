// COICalculator WORKING - DEFINITIEF WERKENDE VERSIE
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._ancestorCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        
        console.log(`✅ COICalculator WORKING: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            const cacheKey = `coi_${dogId}`;
            if (this._coiCache.has(cacheKey)) {
                return this._coiCache.get(cacheKey);
            }
            
            const dog = this.getDogById(dogId);
            if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            console.log(`🔍 COI voor ${dog.naam} (ID: ${dog.id})`);
            
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
            
            // GEBRUIK DE BEWEZEN FORMULE
            const coi6Gen = this._calculateCOIProven(dogId, 6);
            const coiAllGen = this._calculateCOIProven(dogId, 25);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            
            this._coiCache.set(cacheKey, result);
            return result;
            
        } catch (error) {
            console.error('❌ Fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // BEWEZEN FORMULE: Wright's methode
    _calculateCOIProven(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const cacheKey = `proven_${dogId}_${maxDepth}`;
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
        
        // 1. Zoek alle gemeenschappelijke voorouders
        const vaderAncestors = this._getAllAncestors(dog.vaderId, maxDepth);
        const moederAncestors = this._getAllAncestors(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        
        // 2. Voor elke gemeenschappelijke voorouder
        for (const ancestorId of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                // 3. Bereken F_A (COI van voorouder)
                const fAncestor = this._calculateCOIProven(ancestorId, maxDepth - 1);
                
                // 4. Bereken bijdrage volgens Wright
                // EERST: vind alle paden naar deze voorouder
                const vaderPaths = this._getPathsToAncestor(dog.vaderId, ancestorId, maxDepth);
                const moederPaths = this._getPathsToAncestor(dog.moederId, ancestorId, maxDepth);
                
                // Voor elk pad van vader
                for (const vPath of vaderPaths) {
                    // Voor elk pad van moeder
                    for (const mPath of moederPaths) {
                        // WRIGHT'S FORMULE: (1/2)^(n1 + n2 + 1) * (1 + F_A)
                        const n1 = vPath.length;  // aantal stappen via vader
                        const n2 = mPath.length;  // aantal stappen via moeder
                        
                        const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + fAncestor);
                        totalCOI += contribution;
                        
                        // Debug voor belangrijke bijdragen
                        if (maxDepth === 6 && contribution > 0.01) {
                            const ancestorDog = this.getDogById(ancestorId);
                            console.log(`   ${ancestorDog?.naam}: V${n1}+M${n2}, F_A=${(fAncestor*100).toFixed(1)}%, ${(contribution*100).toFixed(2)}%`);
                        }
                    }
                }
            }
        }
        
        // Maximaal 100%
        if (totalCOI > 1.0) totalCOI = 1.0;
        
        console.log(`   Totaal ${maxDepth}gen: ${(totalCOI * 100).toFixed(2)}%`);
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verzamel alle voorouders
    _getAllAncestors(dogId, maxDepth, currentDepth = 1, result = new Set(), visited = new Set()) {
        if (currentDepth > maxDepth || !dogId || visited.has(dogId)) {
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

    // Vind alle paden naar een specifieke voorouder
    _getPathsToAncestor(startId, targetId, maxDepth, currentDepth = 1, currentPath = [], paths = [], visited = new Set()) {
        if (currentDepth > maxDepth || !startId || visited.has(startId)) {
            return paths;
        }
        
        visited.add(startId);
        
        // Als we de target hebben gevonden, sla het pad op
        if (startId === targetId) {
            paths.push([...currentPath]);
            return paths;
        }
        
        const dog = this.getDogById(startId);
        if (!dog) return paths;
        
        // Zoek via vader
        if (dog.vaderId) {
            this._getPathsToAncestor(
                dog.vaderId,
                targetId,
                maxDepth,
                currentDepth + 1,
                [...currentPath, 'V'],
                paths,
                new Set(visited)
            );
        }
        
        // Zoek via moeder
        if (dog.moederId) {
            this._getPathsToAncestor(
                dog.moederId,
                targetId,
                maxDepth,
                currentDepth + 1,
                [...currentPath, 'M'],
                paths,
                new Set(visited)
            );
        }
        
        return paths;
    }

    // SIMPELE PRAKTISCHE BEREKENING (voor snelle schatting)
    calculateSimpleCOI(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Basisgevallen
        if (dog.vaderId === dog.moederId) return 0.25;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        if (!vader || !moeder) return 0;
        
        // 1. Ouders zijn volle broer/zus
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            return 0.25;
        }
        
        // 2. Ouders zijn half broer/zus
        let sharedParents = 0;
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) sharedParents++;
        if (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) sharedParents++;
        
        if (sharedParents === 1) return 0.125;
        
        // 3. Grootouders gemeenschappelijk
        const vaderGrandparents = new Set([vader.vaderId, vader.moederId].filter(Boolean));
        const moederGrandparents = new Set([moeder.vaderId, moeder.moederId].filter(Boolean));
        
        let sharedGrandparents = 0;
        for (const gp of vaderGrandparents) {
            if (moederGrandparents.has(gp)) sharedGrandparents++;
        }
        
        if (sharedGrandparents === 1) return 0.0625;  // 1/16
        if (sharedGrandparents === 2) return 0.125;   // 1/8
        
        // 4. Voor complexere gevallen, gebruik beperkte berekening
        return this._calculateCOIProven(dogId, 3);
    }

    // TOON STAMBOOM MET COI
    showPedigreeWithCOI(dogId, depth = 3) {
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`\n=== STAMBOOM MET COI VOOR ${dog.naam} ===`);
        this._printPedigreeWithCOI(dogId, 0, depth, '');
        console.log(`=======================================`);
    }

    _printPedigreeWithCOI(dogId, level, maxLevel, prefix) {
        if (level >= maxLevel) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        // Bereken COI voor deze hond
        const coi = this.calculateSimpleCOI(dogId) * 100;
        
        const indent = '  '.repeat(level);
        console.log(`${prefix}${indent}${dog.naam} (${dog.id}) - COI: ${coi.toFixed(1)}%`);
        
        if (dog.vaderId) {
            this._printPedigreeWithCOI(dog.vaderId, level + 1, maxLevel, `${prefix}${indent}├─V: `);
        }
        if (dog.moederId) {
            this._printPedigreeWithCOI(dog.moederId, level + 1, maxLevel, `${prefix}${indent}└─M: `);
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator WORKING - BEWEZEN FORMULE');
    
    // Test met bekende relaties
    window.testWorking = function(dogs) {
        const calculator = new COICalculator(dogs);
        
        console.log('=== TEST MET BEKENDE RELATIES ===');
        
        // Test Droll (ID: 27) - ouders zijn volle broer/zus
        console.log('\n1. Droll (ID: 27) - ouders volle broer/zus:');
        console.log('   Verwacht: 25%');
        const drollResult = calculator.calculateCOI(27);
        console.log(`   Resultaat: ${drollResult.coi6Gen}%`);
        
        // Test Erle-Lu (ID: 29) - ouders zijn half broer/zus?  
        console.log('\n2. Erle-Lu (ID: 29):');
        console.log('   Gedeelde vader Brumbo, verschillende moeders');
        console.log('   Verwacht: 12.5% (half broer/zus ouders)');
        const erleResult = calculator.calculateCOI(29);
        console.log(`   Resultaat: ${erleResult.coi6Gen}%`);
        
        // Test Katinka (ID: 68) - ouders zijn Droll en Erle-Lu
        console.log('\n3. Katinka (ID: 68):');
        console.log('   Vader: Droll (25%), Moeder: Erle-Lu (12.5%)');
        console.log('   Gedeelde grootouder Brumbo');
        console.log('   Verwacht: ~37.5%');
        const katinkaResult = calculator.calculateCOI(68);
        console.log(`   Resultaat: ${katinkaResult.coi6Gen}%`);
        
        // Test Chris (ID: 86)
        console.log('\n4. Chris (ID: 86):');
        console.log('   Verre verwantschap');
        console.log('   Verwacht: ~5-15%');
        const chrisResult = calculator.calculateCOI(86);
        console.log(`   Resultaat: ${chrisResult.coi6Gen}%`);
        
        return {
            droll: drollResult.coi6Gen,
            erle: erleResult.coi6Gen,
            katinka: katinkaResult.coi6Gen,
            chris: chrisResult.coi6Gen
        };
    };
}