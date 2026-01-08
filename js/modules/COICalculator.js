// COICalculator V11 - OPTIMALISATIE VOOR OFFICIËLE WAARDEN
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V11: ${this._dogMap.size} honden (officiële optimalisatie)`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    // ✅ HOOFDFUNCTIE met verschillende methodes
    calculateCOI(dogId) {
        dogId = Number(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        console.log(`\n🔍 COI voor: ${dog.naam} (ID: ${dog.id})`);
        console.log(`   Officiële waarde: 7.70%`);
        
        // Probeer verschillende methodes
        const methods = {
            'A. Onze methode (12.0%)': this._calculateOurMethod(dogId, 6),
            'B. Alleen kortste routes': this._calculateShortestOnly(dogId, 6),
            'C. Met diepte correctie': this._calculateDepthCorrected(dogId, 6),
            'D. 5 generaties (ipv 6)': this._calculate5Generations(dogId),
            'E. Met F_a correctie': this._calculateWithFa(dogId, 6)
        };
        
        console.log(`\n📊 METHODE VERGELIJKING:`);
        Object.entries(methods).forEach(([name, value]) => {
            console.log(`   ${name}: ${(value * 100).toFixed(2)}%`);
        });
        
        // Kies de methode die het dichtst bij 7.70% zit
        let bestMethod = 'A';
        let bestDiff = Math.abs(methods['A. Onze methode (12.0%)'] * 100 - 7.70);
        
        Object.entries(methods).forEach(([name, value]) => {
            const diff = Math.abs(value * 100 - 7.70);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestMethod = name;
            }
        });
        
        console.log(`\n🎯 BESTE BENADERING: ${bestMethod} (verschil: ${bestDiff.toFixed(2)}%)`);
        
        // Gebruik onze standaard methode voor output
        const coi6Gen = methods['A. Onze methode (12.0%)'];
        const coiAllGen = this._calculateOurMethod(dogId, 25);
        
        return {
            coi6Gen: (coi6Gen * 100).toFixed(1),
            coiAllGen: (coiAllGen * 100).toFixed(1),
            bestMethod: bestMethod.replace('. ', '.')
        };
    }

    // ✅ A. ONZE HUIDIGE METHODE (12.0%)
    _calculateOurMethod(dogId, maxDepth) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Zoals in V10
        const vaderAncestors = this._getAllAncestorsMulti(dog.vaderId, maxDepth);
        const moederAncestors = this._getAllAncestorsMulti(dog.moederId, maxDepth);
        
        let total = 0;
        
        for (const [ancestorId, vaderCount] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                const pathsVader = this._findAllPaths(dog.vaderId, ancestorId, maxDepth);
                const pathsMoeder = this._findAllPaths(dog.moederId, ancestorId, maxDepth);
                
                for (const pathV of pathsVader) {
                    const n = pathV.length;
                    for (const pathM of pathsMoeder) {
                        const m = pathM.length;
                        total += Math.pow(0.5, n + m + 1);
                    }
                }
            }
        }
        
        return total;
    }

    // ✅ B. ALLEEN KORTSTE ROUTES PER VOOROUDER
    _calculateShortestOnly(dogId, maxDepth) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        const vaderAncestors = new Set(this._getAllAncestors(dog.vaderId, maxDepth));
        const moederAncestors = new Set(this._getAllAncestors(dog.moederId, maxDepth));
        
        let total = 0;
        
        for (const ancestorId of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                const n = this._findShortestPath(dog.vaderId, ancestorId, maxDepth);
                const m = this._findShortestPath(dog.moederId, ancestorId, maxDepth);
                
                if (n > 0 && m > 0) {
                    total += Math.pow(0.5, n + m + 1);
                }
            }
        }
        
        return total;
    }

    // ✅ C. MET DIEPTECORRECTIE (minder gewicht voor verre voorouders)
    _calculateDepthCorrected(dogId, maxDepth) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        const vaderAncestors = this._getAllAncestorsMulti(dog.vaderId, maxDepth);
        const moederAncestors = this._getAllAncestorsMulti(dog.moederId, maxDepth);
        
        let total = 0;
        
        for (const [ancestorId, vaderCount] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                const pathsVader = this._findAllPaths(dog.vaderId, ancestorId, maxDepth);
                const pathsMoeder = this._findAllPaths(dog.moederId, ancestorId, maxDepth);
                
                for (const pathV of pathsVader) {
                    const n = pathV.length;
                    for (const pathM of pathsMoeder) {
                        const m = pathM.length;
                        
                        // ✅ CORRECTIE: minder gewicht voor verre routes
                        const totalSteps = n + m;
                        let weight = 1.0;
                        
                        if (totalSteps > 8) weight = 0.8;      // 20% minder
                        if (totalSteps > 10) weight = 0.6;     // 40% minder
                        if (totalSteps > 12) weight = 0.4;     // 60% minder
                        
                        total += Math.pow(0.5, n + m + 1) * weight;
                    }
                }
            }
        }
        
        return total;
    }

    // ✅ D. 5 GENERATIES (ipv 6) - zoals sommige systemen doen
    _calculate5Generations(dogId) {
        return this._calculateOurMethod(dogId, 5);
    }

    // ✅ E. MET F_a CORRECTIE (voorouder COI)
    _calculateWithFa(dogId, maxDepth) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        const vaderAncestors = this._getAllAncestorsMulti(dog.vaderId, maxDepth);
        const moederAncestors = this._getAllAncestorsMulti(dog.moederId, maxDepth);
        
        let total = 0;
        
        for (const [ancestorId, vaderCount] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                // Bereken F_a voor deze voorouder (recursief)
                const F_a = this._calculateWithFa(ancestorId, maxDepth - 1);
                
                const pathsVader = this._findAllPaths(dog.vaderId, ancestorId, maxDepth);
                const pathsMoeder = this._findAllPaths(dog.moederId, ancestorId, maxDepth);
                
                for (const pathV of pathsVader) {
                    const n = pathV.length;
                    for (const pathM of pathsMoeder) {
                        const m = pathM.length;
                        total += Math.pow(0.5, n + m + 1) * (1 + F_a);
                    }
                }
            }
        }
        
        return total;
    }

    // ✅ HULPFUNCTIES
    _getAllAncestorsMulti(dogId, maxDepth, currentDepth = 0, result = new Map(), visited = new Set()) {
        if (!dogId || currentDepth >= maxDepth || visited.has(dogId)) return result;
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.set(dog.vaderId, (result.get(dog.vaderId) || 0) + 1);
            this._getAllAncestorsMulti(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        if (dog.moederId) {
            result.set(dog.moederId, (result.get(dog.moederId) || 0) + 1);
            this._getAllAncestorsMulti(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    _getAllAncestors(dogId, maxDepth, currentDepth = 0, result = new Set(), visited = new Set()) {
        if (!dogId || currentDepth >= maxDepth || visited.has(dogId)) return result;
        
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

    _findAllPaths(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allPaths = [], visited = new Set()) {
        if (!startId || currentDepth > maxDepth) return allPaths;
        
        if (visited.has(startId)) return allPaths;
        visited.add(startId);
        
        if (startId === targetId) {
            allPaths.push([...currentPath]);
            visited.delete(startId);
            return allPaths;
        }
        
        const dog = this.getDogById(startId);
        if (!dog) {
            visited.delete(startId);
            return allPaths;
        }
        
        if (dog.vaderId) {
            currentPath.push(dog.vaderId);
            this._findAllPaths(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths, new Set(visited));
            currentPath.pop();
        }
        
        if (dog.moederId) {
            currentPath.push(dog.moederId);
            this._findAllPaths(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths, new Set(visited));
            currentPath.pop();
        }
        
        visited.delete(startId);
        return allPaths;
    }

    _findShortestPath(startId, targetId, maxDepth, currentDepth = 0, visited = new Set()) {
        if (!startId || currentDepth > maxDepth || visited.has(startId)) return -1;
        
        if (startId === targetId) return currentDepth;
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        if (!dog) return -1;
        
        let shortest = -1;
        
        if (dog.vaderId) {
            const dist = this._findShortestPath(dog.vaderId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (dist !== -1 && (shortest === -1 || dist < shortest)) {
                shortest = dist;
            }
        }
        
        if (dog.moederId) {
            const dist = this._findShortestPath(dog.moederId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (dist !== -1 && (shortest === -1 || dist < shortest)) {
                shortest = dist;
            }
        }
        
        return shortest;
    }

    // ✅ ANALYSE: Waarom 12% vs 7.7%?
    analyzeDifference(dogId) {
        console.log(`\n🔬 ANALYSE VERSCHIL 12% vs 7.7%:`);
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        // Top voorouders uit onze berekening
        const topAncestors = [
            { id: 193, naam: "ANJA", ourContribution: 3.516 },
            { id: 169, naam: "ASTOR", ourContribution: 1.758 },
            { id: 170, naam: "AINA", ourContribution: 1.758 },
            { id: 77, naam: "A-BONZO", ourContribution: 0.684 },
            { id: 168, naam: "CITO", ourContribution: 1.172 }
        ];
        
        console.log(`   Onze top 5 bijdragen: ${topAncestors.reduce((sum, a) => sum + a.ourContribution, 0).toFixed(2)}%`);
        console.log(`   Officieel totaal: 7.70%`);
        console.log(`\n   Mogelijke verklaringen:`);
        console.log(`   1. Officiële database gebruikt 5 generaties ipv 6`);
        console.log(`   2. Ze tellen niet ALLE routes, alleen belangrijkste`);
        console.log(`   3. Ze hebben een maximum per voorouder`);
        console.log(`   4. Ze gebruiken aangepaste gewichten`);
        
        // Test hypothese: 5 generaties
        const fiveGen = this._calculate5Generations(dogId);
        console.log(`\n   Test 5 generaties: ${(fiveGen * 100).toFixed(2)}%`);
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V11 geladen (officiële optimalisatie)');
}