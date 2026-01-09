// COICalculator V8 - WERKENDE VERSIE MET DEBUG
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
        
        console.log(`✅ COICalculator V8: ${this._dogMap.size} honden geladen`);
        console.log(`   Eerste hond:`, this._dogMap.values().next().value);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            console.log(`\n🔍🔍🔍 START COI BEREKENING VOOR ID: ${dogId} 🔍🔍🔍`);
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden in database`);
                console.log(`   Totale honden in map: ${this._dogMap.size}`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            console.log(`📋 Hond gevonden: ${dog.naam} (ID: ${dog.id})`);
            console.log(`   Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);
            console.log(`   Vader object:`, this.getDogById(dog.vaderId));
            console.log(`   Moeder object:`, this.getDogById(dog.moederId));

            // Basis checks
            if (!dog.vaderId || !dog.moederId) {
                console.log(`⚠️ Geen complete ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`⚠️ Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }

            // DEBUG: Toon stamboom van Esther
            console.log(`\n🌳 STAMBOOM VAN ESTHER (3 generaties):`);
            this._debugStamboom(dogId, 3);

            // Bereken met eenvoudige methode eerst
            console.log(`\n🧮 BEREKENING MET EENVOUDIGE METHODE:`);
            const simpleCOI = this._calculateSimpleCOI(dogId, 6);
            console.log(`   Simple COI: ${(simpleCOI * 100).toFixed(4)}%`);

            // Complexe berekening
            console.log(`\n🧮 BEREKENING MET COMPLEXE METHODE:`);
            const coi6Gen = this._calculateComplexCOI(dogId, 6);
            const coiAllGen = this._calculateComplexCOI(dogId, 25);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`\n✅ RESULTAAT:`);
            console.log(`   ${dog.naam}: COI 6-gen = ${result.coi6Gen}%`);
            console.log(`   Officiële database: IK = 7.70%`);
            console.log(`🔍🔍🔍 EINDE BEREKENING 🔍🔍🔍\n`);
            
            return result;
            
        } catch (error) {
            console.error('❌ FATALE FOUT:', error);
            console.error(error.stack);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // ✅ EENVOUDIGE METHODE - Voor debug
    _calculateSimpleCOI(dogId, maxDepth) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Vind alle voorouders van vader
        const vaderAncestors = this._getAllAncestorsSimple(dog.vaderId, maxDepth);
        const moederAncestors = this._getAllAncestorsSimple(dog.moederId, maxDepth);
        
        console.log(`   Vader voorouders: ${vaderAncestors.size} unieke IDs`);
        console.log(`   Moeder voorouders: ${moederAncestors.size} unieke IDs`);
        
        // Vind gemeenschappelijke
        const common = new Set();
        for (const id of vaderAncestors) {
            if (moederAncestors.has(id)) {
                common.add(id);
            }
        }
        
        console.log(`   Gemeenschappelijke voorouders: ${common.size}`);
        
        if (common.size === 0) return 0;
        
        // Bereken eenvoudige bijdrage (zonder routes)
        let total = 0;
        common.forEach(id => {
            // Schatting: neem gemiddelde diepte van 4
            total += Math.pow(0.5, 4 + 4 + 1); // (0.5)^9 ≈ 0.00195
        });
        
        return total * common.size; // Vereenvoudiging
    }

    _getAllAncestorsSimple(dogId, maxDepth, currentDepth = 0, result = new Set()) {
        if (!dogId || currentDepth >= maxDepth) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getAllAncestorsSimple(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._getAllAncestorsSimple(dog.moederId, maxDepth, currentDepth + 1, result);
        }
        
        return result;
    }

    // ✅ COMPLEXE METHODE - Met routes
    _calculateComplexCOI(dogId, maxDepth) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Vind ALLE voorouders van vader
        const vaderAncestors = new Map(); // ID -> aantal routes
        this._findAncestorsWithCounts(dog.vaderId, maxDepth, 0, vaderAncestors);
        
        // Vind ALLE voorouders van moeder
        const moederAncestors = new Map();
        this._findAncestorsWithCounts(dog.moederId, maxDepth, 0, moederAncestors);
        
        console.log(`   Vader: ${vaderAncestors.size} unieke voorouders`);
        console.log(`   Moeder: ${moederAncestors.size} unieke voorouders`);
        
        // Vind gemeenschappelijke
        let totalCOI = 0;
        let commonCount = 0;
        
        for (const [ancestorId, vaderCount] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                commonCount++;
                
                // Bereken bijdrage voor deze voorouder
                const contribution = this._calculateAncestorContribution(
                    dog.vaderId,
                    dog.moederId,
                    ancestorId,
                    maxDepth
                );
                
                if (contribution > 0.00001) {
                    const ancestorDog = this.getDogById(ancestorId);
                    console.log(`   ➡ ${ancestorDog?.naam || 'Onbekend'} (${ancestorId}): ${(contribution*100).toFixed(4)}%`);
                    totalCOI += contribution;
                }
            }
        }
        
        console.log(`   ${commonCount} gemeenschappelijke voorouders gevonden`);
        console.log(`   Totaal COI: ${(totalCOI*100).toFixed(4)}%`);
        
        return totalCOI;
    }

    _findAncestorsWithCounts(dogId, maxDepth, currentDepth, resultMap) {
        if (!dogId || currentDepth >= maxDepth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        if (dog.vaderId) {
            const currentCount = resultMap.get(dog.vaderId) || 0;
            resultMap.set(dog.vaderId, currentCount + 1);
            this._findAncestorsWithCounts(dog.vaderId, maxDepth, currentDepth + 1, resultMap);
        }
        
        if (dog.moederId) {
            const currentCount = resultMap.get(dog.moederId) || 0;
            resultMap.set(dog.moederId, currentCount + 1);
            this._findAncestorsWithCounts(dog.moederId, maxDepth, currentDepth + 1, resultMap);
        }
    }

    _calculateAncestorContribution(vaderId, moederId, ancestorId, maxDepth) {
        // Vind alle routes van vader naar voorouder
        const routesVader = this._findRoutes(vaderId, ancestorId, maxDepth);
        const routesMoeder = this._findRoutes(moederId, ancestorId, maxDepth);
        
        if (routesVader.length === 0 || routesMoeder.length === 0) return 0;
        
        let total = 0;
        
        // Voor elke combinatie
        for (const routeV of routesVader) {
            const n = routeV.length;
            
            for (const routeM of routesMoeder) {
                const m = routeM.length;
                
                // Basis bijdrage
                const base = Math.pow(0.5, n + m + 1);
                
                // Voeg eventuele IK van voorouder toe
                const ancestor = this.getDogById(ancestorId);
                if (ancestor && ancestor.ik) {
                    const fAncestor = ancestor.ik / 100;
                    total += base * (1 + fAncestor);
                } else {
                    total += base;
                }
            }
        }
        
        return total;
    }

    _findRoutes(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allRoutes = [], visited = new Set()) {
        if (!startId || currentDepth > maxDepth || visited.has(startId)) {
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
                this._findRoutes(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
                currentPath.pop();
            }
            
            if (dog.moederId) {
                currentPath.push(dog.moederId);
                this._findRoutes(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
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
        const inVader = this._isAncestorOf(dog.vaderId, ancestorId, 6);
        const inMoeder = this._isAncestorOf(dog.moederId, ancestorId, 6);
        
        console.log(`   In vader's stamboom: ${inVader}`);
        console.log(`   In moeder's stamboom: ${inMoeder}`);
        
        if (inVader && inMoeder) {
            console.log(`   ✅ IS GEMEENSCHAPPELIJKE VOOROUDER!`);
            
            // Bereken routes
            const routesVader = this._findRoutes(dog.vaderId, ancestorId, 6);
            const routesMoeder = this._findRoutes(dog.moederId, ancestorId, 6);
            
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
        }
    }

    _isAncestorOf(dogId, ancestorId, maxDepth, currentDepth = 0, visited = new Set()) {
        if (!dogId || currentDepth > maxDepth || visited.has(dogId)) return false;
        
        if (dogId === ancestorId) return true;
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return false;
        
        if (dog.vaderId && this._isAncestorOf(dog.vaderId, ancestorId, maxDepth, currentDepth + 1, new Set(visited))) {
            return true;
        }
        
        if (dog.moederId && this._isAncestorOf(dog.moederId, ancestorId, maxDepth, currentDepth + 1, new Set(visited))) {
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
            console.log(`   Vader object: ${!!this.getDogById(esther.vaderId)}`);
            console.log(`   Moeder object: ${!!this.getDogById(esther.moederId)}`);
        }
        
        // Check een bekende voorouder
        const cito = this.getDogById(168); // CITO vom Pol
        console.log(`   CITO (168) gevonden: ${!!cito}`);
        
        // Tel honden met ouders
        let withParents = 0;
        for (const dog of this._dogMap.values()) {
            if (dog.vaderId && dog.moederId) withParents++;
        }
        console.log(`   Honden met beide ouders: ${withParents}`);
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V8 geladen (debug versie)');
}