// COICalculator V9.5 - MET OUDER-KIND COMBINATIE DETECTIE
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        
        // Bouw lookup met ALLE data
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V9.5: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            console.log(`\n🔍 COI voor ID: ${dogId}`);
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden`);
                return { 
                    coiAllGen: '0.000', 
                    coi6Gen: '0.000'
                };
            }
            
            console.log(`📋 ${dog.naam} (ID: ${dog.id})`);

            // Check directe ouder-kind combinatie (vader-dochter of moeder-zoon)
            if (this._isParentChildCombination(dog)) {
                console.log(`⚠️ Ouder-Kind combinatie -> 25.000%`);
                return { 
                    coiAllGen: '25.000', 
                    coi6Gen: '25.000'
                };
            }

            // Check broer-zus combinatie
            if (this._isFullSiblingCombination(dog)) {
                console.log(`⚠️ Broer-Zus combinatie -> 25.000%`);
                return { 
                    coiAllGen: '25.000', 
                    coi6Gen: '25.000'
                };
            }

            // Basis checks
            if (!dog.vaderId || !dog.moederId) {
                console.log(`⚠️ Geen complete ouders -> 0.000%`);
                return { 
                    coiAllGen: '0.000', 
                    coi6Gen: '0.000'
                };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`⚠️ Zelfde ouders -> 25.000%`);
                return { 
                    coiAllGen: '25.000', 
                    coi6Gen: '25.000'
                };
            }

            // Bereken voor verschillende generaties
            console.log(`\n🧮 25 GENERATIES:`);
            const coi25Gen = this._calculateComplexCOI(dogId, 25);
            
            console.log(`\n🧮 6 GENERATIES:`);
            const coi6Gen = this._calculateComplexCOI(dogId, 6);
            
            const result = {
                coiAllGen: (coi25Gen * 100).toFixed(3),  // 25 generaties voor ALL met 3 decimalen
                coi6Gen: (coi6Gen * 100).toFixed(3),     // 6 generaties met 3 decimalen
            };
            
            console.log(`\n✅ RESULTAAT:`);
            console.log(`   25-gen: ${result.coiAllGen}%`);
            console.log(`   6-gen: ${result.coi6Gen}%`);
            
            // Toon officiële IK waarde als beschikbaar
            if (dog.ik !== undefined) {
                const officialIK = parseFloat(dog.ik).toFixed(3);
                console.log(`   Officiële IK: ${officialIK}%`);
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ FOUT:', error);
            return { 
                coiAllGen: '0.000', 
                coi6Gen: '0.000'
            };
        }
    }

    // ✅ Check ouder-kind combinatie (vader-dochter of moeder-zoon)
    _isParentChildCombination(dog) {
        if (!dog.vaderId || !dog.moederId) return false;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) return false;
        
        // Vader-dochter: vader = vader van moeder
        if (vader.id === moeder.vaderId) {
            console.log(`   ✅ Vader-dochter combinatie gedetecteerd!`);
            return true;
        }
        
        // Moeder-zoon: moeder = moeder van vader
        if (moeder.id === vader.moederId) {
            console.log(`   ✅ Moeder-zoon combinatie gedetecteerd!`);
            return true;
        }
        
        return false;
    }

    // ✅ Check broer-zus combinatie
    _isFullSiblingCombination(dog) {
        if (!dog.vaderId || !dog.moederId) return false;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) return false;
        
        // Check of de ouders broer en zus zijn (zelfde ouders)
        const isSiblings = vader.vaderId && vader.moederId && 
               moeder.vaderId && moeder.moederId &&
               vader.vaderId === moeder.vaderId && 
               vader.moederId === moeder.moederId;
        
        if (isSiblings) {
            console.log(`   ✅ Broer-zus combinatie gedetecteerd!`);
        }
        
        return isSiblings;
    }

    // ✅ SIMPELE COMPLEXE BEREKENING
    _calculateComplexCOI(dogId, maxGenerations) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        console.log(`   Max generaties: ${maxGenerations}`);
        
        // Vind alle voorouders van vader en moeder
        const vaderAncestors = new Map();
        const moederAncestors = new Map();
        
        this._findAncestorsWithDepth(dog.vaderId, 1, maxGenerations, vaderAncestors);
        this._findAncestorsWithDepth(dog.moederId, 1, maxGenerations, moederAncestors);
        
        console.log(`   Vader: ${vaderAncestors.size} voorouders`);
        console.log(`   Moeder: ${moederAncestors.size} voorouders`);
        
        // Vind gemeenschappelijke voorouders
        let totalCOI = 0;
        let commonCount = 0;
        
        for (const [ancestorId, vaderDepth] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                commonCount++;
                
                // Bereken bijdrage voor deze voorouder
                const contribution = this._calculateAncestorContributionCorrect(
                    dog.vaderId,
                    dog.moederId,
                    ancestorId,
                    maxGenerations
                );
                
                if (contribution > 0.00001) {
                    totalCOI += contribution;
                }
            }
        }
        
        console.log(`   ${commonCount} gemeenschappelijke voorouders`);
        console.log(`   COI: ${(totalCOI*100).toFixed(6)}%`);
        
        return totalCOI;
    }

    _findAncestorsWithDepth(dogId, currentDepth, maxDepth, resultMap) {
        if (!dogId || currentDepth > maxDepth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            const existingDepth = resultMap.get(dog.vaderId);
            if (!existingDepth || currentDepth + 1 < existingDepth) {
                resultMap.set(dog.vaderId, currentDepth + 1);
            }
            this._findAncestorsWithDepth(dog.vaderId, currentDepth + 1, maxDepth, resultMap);
        }
        
        if (dog.moederId) {
            const existingDepth = resultMap.get(dog.moederId);
            if (!existingDepth || currentDepth + 1 < existingDepth) {
                resultMap.set(dog.moederId, currentDepth + 1);
            }
            this._findAncestorsWithDepth(dog.moederId, currentDepth + 1, maxDepth, resultMap);
        }
    }

    _calculateAncestorContributionCorrect(vaderId, moederId, ancestorId, maxGenerations) {
        // Vind ALLE routes van vader naar voorouder
        const routesVader = this._findAllRoutes(vaderId, ancestorId, maxGenerations - 1);
        const routesMoeder = this._findAllRoutes(moederId, ancestorId, maxGenerations - 1);
        
        if (routesVader.length === 0 || routesMoeder.length === 0) return 0;
        
        let totalContribution = 0;
        
        // Voor elke combinatie van routes
        for (const routeV of routesVader) {
            const n = routeV.length;
            
            for (const routeM of routesMoeder) {
                const m = routeM.length;
                
                // Formule: (0.5)^(n + m + 1) * (1 + fA)
                const baseContribution = Math.pow(0.5, n + m + 1);
                
                // Voeg eventuele COI van voorouder zelf toe
                const ancestorDog = this.getDogById(ancestorId);
                let fA = 0;
                if (ancestorDog && ancestorDog.ik) {
                    fA = ancestorDog.ik / 100;
                }
                
                const contribution = baseContribution * (1 + fA);
                totalContribution += contribution;
            }
        }
        
        return totalContribution;
    }

    _findAllRoutes(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allRoutes = [], visited = new Set()) {
        if (currentDepth > maxDepth || visited.has(startId)) {
            return allRoutes;
        }
        
        if (startId === targetId) {
            allRoutes.push([...currentPath]);
            return allRoutes;
        }
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        
        if (dog) {
            if (dog.vaderId) {
                currentPath.push(dog.vaderId);
                this._findAllRoutes(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
                currentPath.pop();
            }
            
            if (dog.moederId) {
                currentPath.push(dog.moederId);
                this._findAllRoutes(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
                currentPath.pop();
            }
        }
        
        return allRoutes;
    }

    // ✅ DEBUG FUNCTIES
    _debugStamboom(dogId, depth, currentDepth = 0, prefix = '') {
        if (currentDepth > depth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        console.log(`${prefix}${dog.naam} (${dog.id})`);
        
        if (dog.vaderId && currentDepth < depth) {
            this._debugStamboom(dog.vaderId, depth, currentDepth + 1, prefix + '  ├─V ');
        }
        if (dog.moederId && currentDepth < depth) {
            this._debugStamboom(dog.moederId, depth, currentDepth + 1, prefix + '  └─M ');
        }
    }

    // ✅ TEST OUDER-KIND COMBINATIE
    testParentChildCombination(dogId) {
        console.log(`\n🧪 TEST voor ID: ${dogId}`);
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        console.log(`   Hond: ${dog.naam} (ID: ${dog.id})`);
        
        const isParentChild = this._isParentChildCombination(dog);
        const isSiblings = this._isFullSiblingCombination(dog);
        
        console.log(`   Ouder-kind: ${isParentChild}`);
        console.log(`   Broer-zus: ${isSiblings}`);
    }

    // ✅ CHECK DATABASE
    checkDatabase() {
        console.log(`\n📊 DATABASE CHECK:`);
        console.log(`   Totale honden: ${this._dogMap.size}`);
        
        // Tel honden met ouders
        let withParents = 0;
        for (const dog of this._dogMap.values()) {
            if (dog.vaderId && dog.moederId) withParents++;
        }
        console.log(`   Met beide ouders: ${withParents}`);
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V9.5 geladen');
}