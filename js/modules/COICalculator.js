// COICalculator V5 - OPTIMALISATIE EN LOOP PREVENTIE
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        // Bouw snelle lookup
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V5: ${this._dogMap.size} honden geladen (loop preventie)`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            const dog = this.getDogById(dogId);
            if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            console.log(`🔍 COI berekening voor: ${dog.naam} (ID: ${dog.id})`);
            
            // Cache check
            const cacheKey = `coi-${dogId}`;
            if (this._coiCache.has(cacheKey)) {
                return this._coiCache.get(cacheKey);
            }

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

            // Bereken beide dieptes
            const coi6Gen = this._calculateWrightCOI(dogId, 6);
            const coiAllGen = this._calculateWrightCOI(dogId, 25);
            
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

    // ✅ KORRECTE WRIGHT'S FORMULE IMPLEMENTATIE
    _calculateWrightCOI(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Vind alle voorouders van vader (zonder duplicaten binnen dezelfde lijn)
        const vaderAncestors = this._getUniqueAncestors(dog.vaderId, maxDepth);
        const moederAncestors = this._getUniqueAncestors(dog.moederId, maxDepth);
        
        console.log(`   ➡ ${maxDepth}gen: vader ${vaderAncestors.size} unieke voorouders`);
        console.log(`   ➡ ${maxDepth}gen: moeder ${moederAncestors.size} unieke voorouders`);
        
        let totalCOI = 0;
        let commonCount = 0;
        
        // Voor ELKE gemeenschappelijke voorouder
        for (const ancestorId of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                commonCount++;
                
                // ✅ CRUCIAAL: Bereken F_a voor deze voorouder
                const F_a = this._calculateWrightCOI(ancestorId, maxDepth - 1); // Recursie!
                
                // Vind alle paden van vader naar voorouder
                const pathsViaVader = this._getAllSimplePaths(dog.vaderId, ancestorId, maxDepth);
                const pathsViaMoeder = this._getAllSimplePaths(dog.moederId, ancestorId, maxDepth);
                
                let ancestorContribution = 0;
                
                // Voor elke combinatie van paden
                for (const pathVader of pathsViaVader) {
                    const n = pathVader.length;
                    
                    for (const pathMoeder of pathsViaMoeder) {
                        const m = pathMoeder.length;
                        
                        // Wright's formule: (0.5)^(n+m+1) * (1 + F_a)
                        const contribution = Math.pow(0.5, n + m + 1) * (1 + F_a);
                        ancestorContribution += contribution;
                    }
                }
                
                if (ancestorContribution > 0.0001) { // Meer dan 0.01%
                    console.log(`   ➡ Voorouder ${ancestorId}: ${(ancestorContribution*100).toFixed(4)}% (${pathsViaVader.length}x${pathsViaMoeder.length} routes, F_a=${(F_a*100).toFixed(2)}%)`);
                }
                
                totalCOI += ancestorContribution;
            }
        }
        
        console.log(`   ➡ ${maxDepth}gen: ${commonCount} gemeenschappelijke voorouders, totaal: ${(totalCOI*100).toFixed(4)}%`);
        
        return totalCOI;
    }

    // ✅ VIND UNIEKE VOOROUDERS (ZONDER LOOPS)
    _getUniqueAncestors(dogId, maxDepth, currentDepth = 0, result = new Set(), visited = new Set()) {
        if (!dogId || currentDepth >= maxDepth || visited.has(dogId)) {
            return result;
        }
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getUniqueAncestors(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._getUniqueAncestors(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    // ✅ VIND ALLE EENVOUDIGE PADEN (ZONDER CYCLI)
    _getAllSimplePaths(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allPaths = [], visited = new Set()) {
        if (!startId || currentDepth > maxDepth) return allPaths;
        
        // Voorkom loops en terugkeren
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
        
        // Probeer vader
        if (dog.vaderId) {
            currentPath.push(dog.vaderId);
            this._getAllSimplePaths(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths, new Set(visited));
            currentPath.pop();
        }
        
        // Probeer moeder
        if (dog.moederId) {
            currentPath.push(dog.moederId);
            this._getAllSimplePaths(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths, new Set(visited));
            currentPath.pop();
        }
        
        visited.delete(startId);
        return allPaths;
    }

    // ✅ SIMPELERE ALTERNATIEVE BEREKENING (voor verificatie)
    calculateCOISimple(dogId, maxDepth = 6) {
        // Deze methode gebruikt een andere aanpak voor verificatie
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Bereken via genotype frequenties (alternatieve methode)
        return this._calculateViaAncestorPaths(dogId, maxDepth);
    }

    _calculateViaAncestorPaths(dogId, maxDepth) {
        // Deze functie gebruikt een meer directe pad-accumulatie
        const dog = this.getDogById(dogId);
        if (!dog) return 0;
        
        // Genereer alle voorouder-paden
        const fatherPaths = this._generateAncestorPaths(dog.vaderId, maxDepth);
        const motherPaths = this._generateAncestorPaths(dog.moederId, maxDepth);
        
        let total = 0;
        
        // Vergelijk alle paden
        for (const fPath of fatherPaths) {
            for (const mPath of motherPaths) {
                // Zoek gemeenschappelijke voorouders in deze paden
                const commonAncestors = this._findCommonInPaths(fPath, mPath);
                
                for (const ancestor of commonAncestors) {
                    const n = fPath.indexOf(ancestor) + 1; // diepte in vader pad
                    const m = mPath.indexOf(ancestor) + 1; // diepte in moeder pad
                    
                    if (n > 0 && m > 0) {
                        total += Math.pow(0.5, n + m + 1);
                    }
                }
            }
        }
        
        return total;
    }

    _generateAncestorPaths(dogId, maxDepth, currentDepth = 0, currentPath = [], allPaths = []) {
        if (!dogId || currentDepth >= maxDepth) {
            allPaths.push([...currentPath]);
            return allPaths;
        }
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            allPaths.push([...currentPath]);
            return allPaths;
        }
        
        currentPath.push(dogId);
        
        if (dog.vaderId && dog.moederId) {
            // Splits in beide ouders
            this._generateAncestorPaths(dog.vaderId, maxDepth, currentDepth + 1, [...currentPath], allPaths);
            this._generateAncestorPaths(dog.moederId, maxDepth, currentDepth + 1, [...currentPath], allPaths);
        } else if (dog.vaderId) {
            this._generateAncestorPaths(dog.vaderId, maxDepth, currentDepth + 1, currentPath, allPaths);
        } else if (dog.moederId) {
            this._generateAncestorPaths(dog.moederId, maxDepth, currentDepth + 1, currentPath, allPaths);
        } else {
            allPaths.push([...currentPath]);
        }
        
        return allPaths;
    }

    _findCommonInPaths(path1, path2) {
        const set1 = new Set(path1);
        const set2 = new Set(path2);
        const common = new Set();
        
        for (const item of set1) {
            if (set2.has(item)) {
                common.add(item);
            }
        }
        
        return Array.from(common);
    }

    // ✅ DEBUG FUNCTIE VOOR ESTHER
    debugEsther() {
        const ESTHER_ID = 637;
        console.log("=== DEBUG ESTHER (ID: 637) ===");
        
        const dog = this.getDogById(ESTHER_ID);
        if (!dog) return;
        
        console.log(`Esther: Vader=${dog.vaderId}, Moeder=${dog.moederId}`);
        
        // Analyseer belangrijke voorouders
        const importantAncestors = [168, 193, 77, 51, 53, 8, 9, 19, 27, 58, 65];
        
        for (const ancId of importantAncestors) {
            const ancestor = this.getDogById(ancId);
            if (ancestor) {
                console.log(`\nVoorouder ${ancId}: ${ancestor.naam}`);
                
                // Tel hoe vaak deze voorkomt in vader's stamboom
                const inFather = this._countOccurrences(dog.vaderId, ancId, 6);
                const inMother = this._countOccurrences(dog.moederId, ancId, 6);
                
                console.log(`   In vader's stamboom: ${inFather} keer`);
                console.log(`   In moeder's stamboom: ${inMother} keer`);
                
                if (inFather > 0 && inMother > 0) {
                    // Bereken minimale bijdrage (kortste route)
                    const minDistFather = this._findMinDistance(dog.vaderId, ancId, 6);
                    const minDistMother = this._findMinDistance(dog.moederId, ancId, 6);
                    
                    if (minDistFather > 0 && minDistMother > 0) {
                        const minContribution = Math.pow(0.5, minDistFather + minDistMother + 1);
                        console.log(`   Minimale bijdrage: ${(minContribution*100).toFixed(4)}% (n=${minDistFather}, m=${minDistMother})`);
                    }
                }
            }
        }
    }

    _countOccurrences(startId, targetId, maxDepth, currentDepth = 0) {
        if (!startId || currentDepth > maxDepth) return 0;
        
        if (startId === targetId) return 1;
        
        const dog = this.getDogById(startId);
        if (!dog) return 0;
        
        let count = 0;
        if (dog.vaderId) {
            count += this._countOccurrences(dog.vaderId, targetId, maxDepth, currentDepth + 1);
        }
        if (dog.moederId) {
            count += this._countOccurrences(dog.moederId, targetId, maxDepth, currentDepth + 1);
        }
        
        return count;
    }

    _findMinDistance(startId, targetId, maxDepth, currentDepth = 0, visited = new Set()) {
        if (!startId || currentDepth > maxDepth || visited.has(startId)) return -1;
        
        if (startId === targetId) return currentDepth;
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        if (!dog) return -1;
        
        let minDist = -1;
        
        if (dog.vaderId) {
            const dist = this._findMinDistance(dog.vaderId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (dist > 0 && (minDist === -1 || dist < minDist)) {
                minDist = dist;
            }
        }
        
        if (dog.moederId) {
            const dist = this._findMinDistance(dog.moederId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (dist > 0 && (minDist === -1 || dist < minDist)) {
                minDist = dist;
            }
        }
        
        return minDist;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V5 geladen met loop preventie');
}