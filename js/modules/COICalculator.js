// COICalculator V4 - CORRECTE COI BEREKENING MET MEERDERE ROUTES
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._ancestorCache = new Map();
        this._pathCache = new Map(); // Cache voor paden
        
        // Bouw snelle lookup
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V4: ${this._dogMap.size} honden geladen (multi-route fix)`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            console.log(`🔍 COI berekening voor: ${dog.naam} (ID: ${dog.id})`);
            console.log(`   Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);

            // BASISGEWALEN
            if (!dog.vaderId || !dog.moederId) {
                console.log(`   ➡ Geen ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`   ➡ Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (!vader || !moeder) {
                console.log(`   ➡ Ouders niet gevonden -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            console.log(`   ➡ Vader: ${vader.naam} (${vader.id})`);
            console.log(`   ➡ Moeder: ${moeder.naam} (${moeder.id})`);

            // VOLLE BROER/ZUS
            const isFullSibling = vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                                 vader.moederId && moeder.moederId && vader.moederId === moeder.moederId;
            
            if (isFullSibling) {
                console.log(`   ➡ Ouders zijn volle broer/zus -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }

            // COMPLEXE BEREKENING - BEIDE VERSIES
            console.log(`   ➡ Complex geval - bereken 6 en 25 generaties`);
            
            const coi6Gen = this._calculateCOIWithDepth(dogId, 6);
            const coiAllGen = this._calculateCOIWithDepth(dogId, 25);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: COI 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            console.log(`=======================================`);
            
            return result;
            
        } catch (error) {
            console.error('❌ Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    // ✅ CORRECTE COI BEREKENING MET MULTIPLE ROUTES
    _calculateCOIWithDepth(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Vind alle unieke voorouders van vader (MET duplicaten geteld)
        const vaderAncestors = this._getAllAncestorsWithCounts(dog.vaderId, maxDepth);
        // Vind alle unieke voorouders van moeder (MET duplicaten geteld)
        const moederAncestors = this._getAllAncestorsWithCounts(dog.moederId, maxDepth);
        
        console.log(`   ➡ ${maxDepth}gen: vader heeft ${vaderAncestors.size} unieke voorouders`);
        console.log(`   ➡ ${maxDepth}gen: moeder heeft ${moederAncestors.size} unieke voorouders`);
        
        // Vind gemeenschappelijke voorouders
        let totalCOI = 0;
        let commonCount = 0;
        
        for (const [ancestorId, vaderCount] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                commonCount++;
                const contribution = this._calculateContributionForAncestor(dogId, ancestorId, maxDepth);
                console.log(`   ➡ ${maxDepth}gen Voorouder ${ancestorId}: bijdrage = ${(contribution*100).toFixed(4)}%`);
                totalCOI += contribution;
            }
        }
        
        console.log(`   ➡ ${maxDepth}gen: ${commonCount} gemeenschappelijke voorouders`);
        console.log(`   ➡ ${maxDepth}gen: Totaal COI = ${(totalCOI*100).toFixed(4)}%`);
        
        return totalCOI;
    }

    // ✅ VIND ALLE VOOROUDERS MET TELLING VAN VOORKOMEN
    _getAllAncestorsWithCounts(dogId, maxDepth, currentDepth = 0, result = new Map()) {
        if (!dogId || currentDepth >= maxDepth) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        // Voeg vader toe
        if (dog.vaderId) {
            const currentCount = result.get(dog.vaderId) || 0;
            result.set(dog.vaderId, currentCount + 1);
            
            // Ga recursief verder
            this._getAllAncestorsWithCounts(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        
        // Voeg moeder toe
        if (dog.moederId) {
            const currentCount = result.get(dog.moederId) || 0;
            result.set(dog.moederId, currentCount + 1);
            
            // Ga recursief verder
            this._getAllAncestorsWithCounts(dog.moederId, maxDepth, currentDepth + 1, result);
        }
        
        return result;
    }

    // ✅ BEREKEN BIJDRAGE VOOR ÉÉN VOOROUDER (ALLE ROUTES)
    _calculateContributionForAncestor(dogId, ancestorId, maxDepth) {
        const cacheKey = `${dogId}-${ancestorId}-${maxDepth}`;
        if (this._pathCache.has(cacheKey)) {
            return this._pathCache.get(cacheKey);
        }
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            this._pathCache.set(cacheKey, 0);
            return 0;
        }
        
        // Vind ALLE paden van vader naar voorouder
        const pathsFromFather = this._getAllPathsToAncestor(dog.vaderId, ancestorId, maxDepth);
        // Vind ALLE paden van moeder naar voorouder
        const pathsFromMother = this._getAllPathsToAncestor(dog.moederId, ancestorId, maxDepth);
        
        if (pathsFromFather.length === 0 || pathsFromMother.length === 0) {
            this._pathCache.set(cacheKey, 0);
            return 0;
        }
        
        let totalContribution = 0;
        let combinationCount = 0;
        
        // ✅ CRUCIAAL: Voor ELKE combinatie van paden berekenen
        for (const pathFather of pathsFromFather) {
            const n = pathFather.length; // stappen van vader naar voorouder
            
            for (const pathMother of pathsFromMother) {
                const m = pathMother.length; // stappen van moeder naar voorouder
                
                // Wright's formule: (0.5)^(n + m + 1)
                const contribution = Math.pow(0.5, n + m + 1);
                totalContribution += contribution;
                combinationCount++;
            }
        }
        
        // Debug info voor belangrijke voorouders
        if (totalContribution > 0.001) { // Meer dan 0.1%
            console.log(`     ⮑ Voorouder ${ancestorId}: ${pathsFromFather.length} vader-routes, ${pathsFromMother.length} moeder-routes`);
            console.log(`     ⮑ ${combinationCount} route-combinaties`);
        }
        
        this._pathCache.set(cacheKey, totalContribution);
        return totalContribution;
    }

    // ✅ VIND ALLE PADEN NAAR EEN VOOROUDER
    _getAllPathsToAncestor(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allPaths = [], visited = new Set()) {
        if (!startId || currentDepth > maxDepth || visited.has(startId)) return allPaths;
        
        // Voeg toe aan visited om oneindige loops te voorkomen
        visited.add(startId);
        
        if (startId === targetId) {
            // We hebben de voorouder gevonden - sla het pad op
            allPaths.push([...currentPath]);
        } else {
            const dog = this.getDogById(startId);
            if (dog) {
                // Ga naar vader
                if (dog.vaderId) {
                    currentPath.push(dog.vaderId);
                    this._getAllPathsToAncestor(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths, new Set(visited));
                    currentPath.pop();
                }
                
                // Ga naar moeder
                if (dog.moederId) {
                    currentPath.push(dog.moederId);
                    this._getAllPathsToAncestor(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths, new Set(visited));
                    currentPath.pop();
                }
            }
        }
        
        return allPaths;
    }

    // ✅ DEBUG FUNCTIE OM SPECIFIEKE VOOROUDER TE ANALYSEREN
    debugAncestor(dogId, ancestorId, maxDepth = 6) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            console.log(`❌ Hond ${dogId} of ouders niet gevonden`);
            return;
        }
        
        const ancestor = this.getDogById(ancestorId);
        console.log(`=== DEBUG VOOROUDER ${ancestorId} (${ancestor?.naam || 'onbekend'}) ===`);
        
        // Vind paden
        const pathsFromFather = this._getAllPathsToAncestor(dog.vaderId, ancestorId, maxDepth);
        const pathsFromMother = this._getAllPathsToAncestor(dog.moederId, ancestorId, maxDepth);
        
        console.log(`Paden van vader (${dog.vaderId}) naar voorouder:`);
        pathsFromFather.forEach((path, idx) => {
            console.log(`  Route ${idx+1}: ${path.length} stappen [${path.join(' -> ')}]`);
        });
        
        console.log(`Paden van moeder (${dog.moederId}) naar voorouder:`);
        pathsFromMother.forEach((path, idx) => {
            console.log(`  Route ${idx+1}: ${path.length} stappen [${path.join(' -> ')}]`);
        });
        
        // Bereken bijdrage
        let total = 0;
        console.log(`\nBijdrageberekeningen:`);
        for (const pathFather of pathsFromFather) {
            const n = pathFather.length;
            
            for (const pathMother of pathsFromMother) {
                const m = pathMother.length;
                const contribution = Math.pow(0.5, n + m + 1);
                total += contribution;
                console.log(`  n=${n}, m=${m}: (0.5)^${n+m+1} = ${(contribution*100).toFixed(4)}%`);
            }
        }
        
        console.log(`\nTOTALE BIJDRAGE voorouder ${ancestorId}: ${(total*100).toFixed(4)}%`);
        console.log(`=======================================`);
    }

    // DEBUG FUNCTIE (zelfde als origineel)
    debugStamboom(hondId, diepte = 3) {
        const hond = this.getDogById(hondId);
        if (!hond) {
            console.log(`Hond ${hondId} niet gevonden`);
            return;
        }
        
        console.log(`=== STAMBOOM DEBUG: ${hond.naam} (${hondId}) ===`);
        this._printStamboom(hondId, 0, diepte, '');
        console.log(`====================================`);
    }

    _printStamboom(hondId, huidigeDiepte, maxDiepte, prefix) {
        if (huidigeDiepte > maxDiepte) return;
        
        const hond = this.getDogById(hondId);
        if (!hond) return;
        
        console.log(`${prefix}${hond.naam} (${hond.id}) [vader:${hond.vaderId}, moeder:${hond.moederId}]`);
        
        if (hond.vaderId) {
            this._printStamboom(hond.vaderId, huidigeDiepte + 1, maxDiepte, prefix + '  ├─V: ');
        }
        if (hond.moederId) {
            this._printStamboom(hond.moederId, huidigeDiepte + 1, maxDiepte, prefix + '  └─M: ');
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V4 geladen met multi-route correctie');
}