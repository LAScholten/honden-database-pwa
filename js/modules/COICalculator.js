// COICalculator V7 - MET VOOROUDER IK WAARDEN
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._ancestorIKCache = new Map(); // Cache voor IK van voorouders
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                const dogWithIK = {
                    ...dog,
                    // Extraheer IK uit database als beschikbaar
                    ik: this._extractIKFromData(dog)
                };
                this._dogMap.set(Number(dog.id), dogWithIK);
            }
        });
        
        console.log(`✅ COICalculator V7: ${this._dogMap.size} honden (met IK waarden)`);
    }

    // Helper om IK uit honddata te halen
    _extractIKFromData(dog) {
        // Als je database IK waarden heeft, haal ze hier
        // Voor nu gebruiken we een placeholder
        return dog.ik || 0;
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    // ✅ BELANGRIJK: Deze functie moet de IK van voorouders gebruiken
    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            const dog = this.getDogById(dogId);
            if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            console.log(`🔍 COI berekening voor: ${dog.naam} (ID: ${dog.id})`);
            
            // Basisgevallen
            if (!dog.vaderId || !dog.moederId) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }

            // Bereken met correcte formule
            const coi6Gen = this._calculateWithAncestorIK(dogId, 6);
            const coiAllGen = this._calculateWithAncestorIK(dogId, 25);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: COI 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            console.log(`   Officiële database: IK = 7.70%`);
            
            return result;
            
        } catch (error) {
            console.error('❌ Fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // ✅ KERNFUNCTIE: Bereken met voorouder IK
    _calculateWithAncestorIK(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // DIRECTE BROER/ZUS CHECK
        if (this._areFullSiblings(dog.vaderId, dog.moederId)) {
            console.log(`   ⚠️ Directe volle broer/zus paring -> 25%`);
            return 0.25;
        }
        
        // Vind gemeenschappelijke voorouders
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, maxDepth);
        
        let totalCOI = 0;
        
        for (const ancestor of commonAncestors) {
            const contribution = this._calculateContributionWithIK(
                dog.vaderId, 
                dog.moederId, 
                ancestor.id, 
                maxDepth
            );
            
            if (contribution > 0.0001) {
                console.log(`   ➡ ${ancestor.naam} (${ancestor.id}): ${(contribution*100).toFixed(4)}% [IK=${ancestor.ik}%]`);
            }
            
            totalCOI += contribution;
        }
        
        return totalCOI;
    }

    // ✅ BIJDRAGE MET IK VAN VOOROUDER
    _calculateContributionWithIK(vaderId, moederId, ancestorId, maxDepth) {
        // Vind alle routes (gebruik je bestaande functie)
        const routesViaVader = this._findAllRoutes(vaderId, ancestorId, maxDepth);
        const routesViaMoeder = this._findAllRoutes(moederId, ancestorId, maxDepth);
        
        if (routesViaVader.length === 0 || routesViaMoeder.length === 0) return 0;
        
        const ancestorDog = this.getDogById(ancestorId);
        const F_ancestor = (ancestorDog?.ik || 0) / 100; // Converteer % naar decimaal
        
        let total = 0;
        
        // Voor elke combinatie van routes
        for (const routeV of routesViaVader) {
            const n = routeV.length;
            
            for (const routeM of routesViaMoeder) {
                const m = routeM.length;
                
                // ✅ CRUCIAAL: Wright's formule met F_ancestor
                const contribution = Math.pow(0.5, n + m + 1) * (1 + F_ancestor);
                total += contribution;
            }
        }
        
        return total;
    }

    // Hulpfuncties (gebruik je bestaande implementaties)
    _areFullSiblings(id1, id2) {
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) return false;
        
        return dog1.vaderId && dog2.vaderId && dog1.vaderId === dog2.vaderId &&
               dog1.moederId && dog2.moederId && dog1.moederId === dog2.moederId;
    }

    _findCommonAncestors(id1, id2, maxDepth) {
        const ancestors1 = this._getAncestors(id1, maxDepth);
        const ancestors2 = this._getAncestors(id2, maxDepth);
        
        const common = [];
        
        for (const anc1 of ancestors1) {
            if (ancestors2.has(anc1.id)) {
                common.push(anc1);
            }
        }
        
        return common;
    }

    _getAncestors(dogId, maxDepth, currentDepth = 0, result = new Set(), visited = new Set()) {
        if (!dogId || currentDepth >= maxDepth || visited.has(dogId)) {
            return result;
        }
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            const vader = this.getDogById(dog.vaderId);
            if (vader) {
                result.add(vader);
                this._getAncestors(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
            }
        }
        
        if (dog.moederId) {
            const moeder = this.getDogById(dog.moederId);
            if (moeder) {
                result.add(moeder);
                this._getAncestors(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
            }
        }
        
        return result;
    }

    _findAllRoutes(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allRoutes = [], visited = new Set()) {
        // Jouw bestaande implementatie
        if (!startId || currentDepth > maxDepth || visited.has(startId)) return allRoutes;
        
        if (startId === targetId) {
            allRoutes.push([...currentPath]);
            return allRoutes;
        }
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        
        if (dog?.vaderId) {
            currentPath.push(dog.vaderId);
            this._findAllRoutes(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
            currentPath.pop();
        }
        
        if (dog?.moederId) {
            currentPath.push(dog.moederId);
            this._findAllRoutes(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
            currentPath.pop();
        }
        
        return allRoutes;
    }

    // ✅ DEBUG: Toon IK waarden van belangrijke voorouders
    debugIKValues() {
        console.log("=== OFFICIËLE IK WAARDEN UIT DATABASE ===");
        
        // Belangrijke voorouders met hoge IK
        const importantIds = [
            15,    // PIROSCHKA (25%)
            12,    // PASCHA (25%)
            306,   // CSCHACSCHA (39.3%)
            301,   // ANJA vom Weidenhof (50.18%)
            358,   // ESKIMO (45.8%)
            306,   // FABIA (25.31%) - zelfde ID? check
            342    // ASKA (40.35%)
        ];
        
        for (const id of importantIds) {
            const dog = this.getDogById(id);
            if (dog) {
                console.log(`${dog.naam} (${id}): IK = ${dog.ik}%`);
            }
        }
        
        console.log("=========================================");
    }

    // ✅ SIMULATIE: Wat als we de officiële IK waarden gebruiken?
    simulateWithOfficialIK() {
        console.log("=== SIMULATIE MET OFFICIËLE IK WAARDEN ===");
        
        // Handmatig de officiële IK waarden instellen voor belangrijke voorouders
        const officialIK = {
            15: 25.00,   // PIROSCHKA
            12: 25.00,   // PASCHA
            306: 39.30,  // CSCHACSCHA
            301: 50.18,  // ANJA vom Weidenhof
            358: 45.80,  // ESKIMO
            342: 40.35   // ASKA
        };
        
        // Update de IK waarden in onze database
        for (const [id, ik] of Object.entries(officialIK)) {
            const dog = this.getDogById(Number(id));
            if (dog) {
                dog.ik = ik;
                console.log(`   Set ${dog.naam} (${id}) IK = ${ik}%`);
            }
        }
        
        // Bereken opnieuw
        return this.calculateCOI(637); // Esther
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V7 geladen (met IK correctie)');
}