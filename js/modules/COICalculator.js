// COICalculator V9.4 - GECORRIGEERDE VERSIE MET 3 DECIMALEN PRECISIE
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
        
        console.log(`✅ COICalculator V9.4: ${this._dogMap.size} honden geladen (25 gen voor ALL, 3 decimalen)`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            console.log(`\n🔍 START COI BEREKENING VOOR ID: ${dogId}`);
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden`);
                return { 
                    coiAllGen: '0.000', 
                    coi5Gen: '0.000', 
                    coi6Gen: '0.000'
                };
            }
            
            console.log(`📋 ${dog.naam} (ID: ${dog.id}) - Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);

            // Check broer-zus combinatie
            if (this._isFullSiblingCombination(dog)) {
                console.log(`⚠️ Broer-Zus combinatie -> 25.000%`);
                return { 
                    coiAllGen: '25.000', 
                    coi5Gen: '25.000',
                    coi6Gen: '25.000'
                };
            }

            // Basis checks
            if (!dog.vaderId || !dog.moederId) {
                console.log(`⚠️ Geen complete ouders -> 0.000%`);
                return { 
                    coiAllGen: '0.000', 
                    coi5Gen: '0.000',
                    coi6Gen: '0.000'
                };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`⚠️ Zelfde ouders -> 25.000%`);
                return { 
                    coiAllGen: '25.000', 
                    coi5Gen: '25.000',
                    coi6Gen: '25.000'
                };
            }

            // Bereken voor verschillende generaties
            console.log(`\n🧮 BEREKENING 5 GENERATIES (VOORALL TAB):`);
            const coi5Gen = this._calculateComplexCOI(dogId, 5);
            
            console.log(`\n🧮 BEREKENING 25 GENERATIES (ALL TAB):`);
            const coi25Gen = this._calculateComplexCOI(dogId, 25);
            
            console.log(`\n🧮 BEREKENING 6 GENERATIES (EXTRA INFO):`);
            const coi6Gen = this._calculateComplexCOI(dogId, 6);
            
            const result = {
                coiAllGen: (coi25Gen * 100).toFixed(3),  // 25 generaties voor ALL met 3 decimalen
                coi5Gen: (coi5Gen * 100).toFixed(3),     // 5 generaties voor VoorAll met 3 decimalen
                coi6Gen: (coi6Gen * 100).toFixed(3)      // 6 generaties met 3 decimalen
            };
            
            console.log(`\n✅ RESULTAAT:`);
            console.log(`   ${dog.naam}: COI ALL (25-gen) = ${result.coiAllGen}%`);
            console.log(`   ${dog.naam}: COI VoorAll (5-gen) = ${result.coi5Gen}%`);
            console.log(`   ${dog.naam}: COI 6-gen = ${result.coi6Gen}%`);
            
            // Toon officiële IK waarde als beschikbaar
            if (dog.ik !== undefined) {
                // Formatteer officiële IK ook met 3 decimalen
                const officialIK = parseFloat(dog.ik).toFixed(3);
                console.log(`   Officiële database: IK = ${officialIK}%`);
            } else {
                console.log(`   Officiële database: IK = n.v.t.`);
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ FATALE FOUT:', error);
            return { 
                coiAllGen: '0.000', 
                coi5Gen: '0.000',
                coi6Gen: '0.000'
            };
        }
    }

    // ✅ Check broer-zus combinatie
    _isFullSiblingCombination(dog) {
        if (!dog.vaderId || !dog.moederId) return false;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) return false;
        
        // Check of de ouders broer en zus zijn (zelfde ouders)
        return vader.vaderId && vader.moederId && 
               moeder.vaderId && moeder.moederId &&
               vader.vaderId === moeder.vaderId && 
               vader.moederId === moeder.moederId;
    }

    // ✅ CORRECTE COMPLEXE BEREKENING
    _calculateComplexCOI(dogId, maxGenerations) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        console.log(`   Berekenen over ${maxGenerations} generaties...`);
        
        // Vind ALLE unieke voorouders van vader en moeder
        const vaderAncestors = new Map(); // ID -> {depth: minimale diepte}
        const moederAncestors = new Map();
        
        this._findAncestorsWithDepth(dog.vaderId, 1, maxGenerations, vaderAncestors);
        this._findAncestorsWithDepth(dog.moederId, 1, maxGenerations, moederAncestors);
        
        console.log(`   Vader: ${vaderAncestors.size} unieke voorouders`);
        console.log(`   Moeder: ${moederAncestors.size} unieke voorouders`);
        
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
                    const ancestorDog = this.getDogById(ancestorId);
                    const ancestorName = ancestorDog?.naam || `ID:${ancestorId}`;
                    const viaVaderDepth = vaderAncestors.get(ancestorId);
                    const viaMoederDepth = moederAncestors.get(ancestorId);
                    console.log(`   ➡ ${ancestorName}: ${(contribution*100).toFixed(6)}% (via V:${viaVaderDepth}, M:${viaMoederDepth} gen)`);
                    totalCOI += contribution;
                }
            }
        }
        
        console.log(`   ${commonCount} gemeenschappelijke voorouders gevonden`);
        console.log(`   Totaal COI: ${(totalCOI*100).toFixed(6)}%`);
        
        return totalCOI;
    }

    _findAncestorsWithDepth(dogId, currentDepth, maxDepth, resultMap) {
        if (!dogId || currentDepth > maxDepth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            // Bewaar de minimale diepte waarop we deze voorouder vinden
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
            const n = routeV.length; // Aantal stappen van vader naar voorouder
            
            for (const routeM of routesMoeder) {
                const m = routeM.length; // Aantal stappen van moeder naar voorouder
                
                // Formule: (0.5)^(n + m + 1) * (1 + fA)
                // waar n = stappen van vader naar A, m = stappen van moeder naar A
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
        
        console.log(`${prefix}${dog.naam} (${dog.id}) [V:${dog.vaderId}, M:${dog.moederId}]`);
        
        if (dog.vaderId && currentDepth < depth) {
            this._debugStamboom(dog.vaderId, depth, currentDepth + 1, prefix + '  ├─V ');
        }
        if (dog.moederId && currentDepth < depth) {
            this._debugStamboom(dog.moederId, depth, currentDepth + 1, prefix + '  └─M ');
        }
    }

    // ✅ TEST SPECIFIEKE VOOROUDER
    testAncestor(dogId, ancestorId) {
        console.log(`\n🧪 TEST VOOROUDER ${ancestorId}:`);
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        const ancestor = this.getDogById(ancestorId);
        console.log(`   Voorouder: ${ancestor?.naam || 'Onbekend'} (${ancestorId})`);
        
        // Check of voorouder in vader's stamboom zit
        const inVader = this._isAncestorOf(dog.vaderId, ancestorId, 25);
        const inMoeder = this._isAncestorOf(dog.moederId, ancestorId, 25);
        
        console.log(`   In vader's stamboom (25 gen): ${inVader}`);
        console.log(`   In moeder's stamboom (25 gen): ${inMoeder}`);
        
        if (inVader && inMoeder) {
            console.log(`   ✅ IS GEMEENSCHAPPELIJKE VOOROUDER!`);
            
            // Bereken routes
            const routesVader = this._findAllRoutes(dog.vaderId, ancestorId, 24); // -1 voor start
            const routesMoeder = this._findAllRoutes(dog.moederId, ancestorId, 24);
            
            console.log(`   Routes via vader: ${routesVader.length}`);
            console.log(`   Routes via moeder: ${routesMoeder.length}`);
            
            // Toon kortste routes
            if (routesVader.length > 0) {
                const shortestV = Math.min(...routesVader.map(r => r.length));
                console.log(`   Kortste route via vader: ${shortestV} stappen`);
            }
            if (routesMoeder.length > 0) {
                const shortestM = Math.min(...routesMoeder.map(r => r.length));
                console.log(`   Kortste route via moeder: ${shortestM} stappen`);
            }
            
            // Bereken bijdrage voor 5 en 25 generaties
            console.log(`\n🧮 Bijdrage berekening:`);
            const contrib5 = this._calculateAncestorContributionCorrect(dog.vaderId, dog.moederId, ancestorId, 5);
            const contrib25 = this._calculateAncestorContributionCorrect(dog.vaderId, dog.moederId, ancestorId, 25);
            console.log(`   Bijdrage (5 gen): ${(contrib5*100).toFixed(6)}%`);
            console.log(`   Bijdrage (25 gen): ${(contrib25*100).toFixed(6)}%`);
        }
    }

    _isAncestorOf(dogId, ancestorId, maxDepth, currentDepth = 0) {
        if (!dogId || currentDepth > maxDepth) return false;
        
        if (dogId === ancestorId) return true;
        
        const dog = this.getDogById(dogId);
        if (!dog) return false;
        
        if (dog.vaderId && this._isAncestorOf(dog.vaderId, ancestorId, maxDepth, currentDepth + 1)) {
            return true;
        }
        
        if (dog.moederId && this._isAncestorOf(dog.moederId, ancestorId, maxDepth, currentDepth + 1)) {
            return true;
        }
        
        return false;
    }

    // ✅ CHECK DATABASE
    checkDatabase() {
        console.log(`\n📊 DATABASE CHECK:`);
        console.log(`   Totale honden: ${this._dogMap.size}`);
        
        // Check Esther
        const esther = this.getDogById(637);
        console.log(`   Esther gevonden: ${!!esther}`);
        if (esther) {
            console.log(`   Esther's ouders: ${esther.vaderId}, ${esther.moederId}`);
            
            // Check broer-zus combinatie
            console.log(`   Is broer-zus combinatie: ${this._isFullSiblingCombination(esther)}`);
            
            // Toon diepte informatie
            if (esther.vaderId && esther.moederId) {
                const vaderMap = new Map();
                const moederMap = new Map();
                this._findAncestorsWithDepth(esther.vaderId, 1, 25, vaderMap);
                this._findAncestorsWithDepth(esther.moederId, 1, 25, moederMap);
                console.log(`   Voorouders vader (25 gen): ${vaderMap.size}`);
                console.log(`   Voorouders moeder (25 gen): ${moederMap.size}`);
            }
        }
        
        // Tel honden met ouders
        let withParents = 0;
        for (const dog of this._dogMap.values()) {
            if (dog.vaderId && dog.moederId) withParents++;
        }
        console.log(`   Honden met beide ouders: ${withParents}`);
    }
    
    // ✅ QUICK TEST MULTIPLE GENERATIONS
    quickTest(dogId) {
        console.log(`\n⚡ QUICK TEST VOOR ID: ${dogId}`);
        
        for (let gen of [3, 4, 5, 6, 10, 25]) {
            const coi = this._calculateComplexCOI(dogId, gen);
            console.log(`   ${gen.toString().padStart(2)} generaties: ${(coi*100).toFixed(6)}%`);
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V9.4 geladen (25 generaties voor ALL, 5 gen voor VoorAll, 3 decimalen precisie)');
}