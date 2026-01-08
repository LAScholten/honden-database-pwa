// COICalculator V6 - OFFICIËLE SYSTEM BEREKENING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._siblingCache = new Map(); // Cache voor broer/zus relaties
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V6: ${this._dogMap.size} honden (officiële methode)`);
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

            // BASISGEWALEN
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

            // ✅ OFFICIËLE METHODE: Check eerst op broer/zus paringen
            const siblingType = this._checkSiblingMating(dog.vaderId, dog.moederId);
            
            if (siblingType === 'FULL') {
                console.log(`   ⚠️ OFFICIEEL: Volle broer/zus paring -> 25%`);
                const result = { coi6Gen: '25.0', coiAllGen: '25.0' };
                this._coiCache.set(cacheKey, result);
                return result;
            }
            
            if (siblingType === 'HALF') {
                console.log(`   ⚠️ OFFICIEEL: Half broer/zus paring -> 12.5%`);
                const result = { coi6Gen: '12.5', coiAllGen: '12.5' };
                this._coiCache.set(cacheKey, result);
                return result;
            }

            // ✅ Check op oom/nicht, tante/neef (avuncular)
            const avuncularType = this._checkAvuncularMating(dog.vaderId, dog.moederId);
            if (avuncularType) {
                console.log(`   ⚠️ OFFICIEEL: ${avuncularType} paring -> 12.5%`);
                const result = { coi6Gen: '12.5', coiAllGen: '12.5' };
                this._coiCache.set(cacheKey, result);
                return result;
            }

            // Pas daarna normale berekening
            const coi6Gen = this._calculateOfficialCOI(dogId, 6);
            const coiAllGen = this._calculateOfficialCOI(dogId, 25);
            
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

    // ✅ CHECK OP BROER/ZUS PARINGEN
    _checkSiblingMating(vaderId, moederId) {
        if (!vaderId || !moederId) return null;
        
        const vader = this.getDogById(vaderId);
        const moeder = this.getDogById(moederId);
        
        if (!vader || !moeder) return null;
        
        // Volle broer/zus: zelfde vader EN zelfde moeder
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            return 'FULL';
        }
        
        // Half broer/zus: zelfde vader OF zelfde moeder
        if ((vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
            (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
            return 'HALF';
        }
        
        return null;
    }

    // ✅ CHECK OP OOM/NICHT, TANTE/NEEF
    _checkAvuncularMating(vaderId, moederId) {
        if (!vaderId || !moederId) return null;
        
        const vader = this.getDogById(vaderId);
        const moeder = this.getDogById(moederId);
        
        if (!vader || !moeder) return null;
        
        // Oom/Nicht: vader is broer van moeder's vader of moeder
        if (this._areSiblings(vaderId, moeder.vaderId) || this._areSiblings(vaderId, moeder.moederId)) {
            return 'Oom/Nicht';
        }
        
        // Tante/Neef: moeder is zus van vader's vader of moeder
        if (this._areSiblings(moederId, vader.vaderId) || this._areSiblings(moederId, vader.moederId)) {
            return 'Tante/Neef';
        }
        
        return null;
    }

    _areSiblings(id1, id2) {
        if (!id1 || !id2) return false;
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        
        if (!dog1 || !dog2) return false;
        
        // Zelfde vader EN moeder = volle broer/zus
        if (dog1.vaderId && dog2.vaderId && dog1.vaderId === dog2.vaderId &&
            dog1.moederId && dog2.moederId && dog1.moederId === dog2.moederId) {
            return true;
        }
        
        return false;
    }

    // ✅ OFFICIËLE COI BEREKENING (na broer/zus checks)
    _calculateOfficialCOI(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Check of ouders broer/zus zijn (snelle exit)
        const siblingType = this._checkSiblingMating(dog.vaderId, dog.moederId);
        if (siblingType === 'FULL') return 0.25;
        if (siblingType === 'HALF') return 0.125;
        
        // Vind voorouders, maar SKIP degene die uit broer/zus paringen komen
        const vaderAncestors = this._getAncestorsSkipSiblings(dog.vaderId, maxDepth);
        const moederAncestors = this._getAncestorsSkipSiblings(dog.moederId, maxDepth);
        
        let totalCOI = 0;
        
        for (const ancestorId of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                // Bereken bijdrage voor deze voorouder
                const contribution = this._calculateAncestorContributionOfficial(
                    dog.vaderId, dog.moederId, ancestorId, maxDepth
                );
                
                if (contribution > 0.0001) {
                    console.log(`   ➡ Voorouder ${ancestorId}: ${(contribution*100).toFixed(4)}%`);
                }
                
                totalCOI += contribution;
            }
        }
        
        return totalCOI;
    }

    // ✅ VOOROUDERS ZONDER BROER/ZUS LIJNEN
    _getAncestorsSkipSiblings(dogId, maxDepth, currentDepth = 0, result = new Set(), visited = new Set()) {
        if (!dogId || currentDepth >= maxDepth || visited.has(dogId)) {
            return result;
        }
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        // Voeg ouders toe, TENZIJ ze uit broer/zus paring komen
        if (dog.vaderId && dog.moederId) {
            // Check of deze ouders broer/zus zijn
            const areSiblings = this._checkSiblingMating(dog.vaderId, dog.moederId);
            
            if (!areSiblings) {
                // Normale ouders - voeg beide toe
                result.add(dog.vaderId);
                result.add(dog.moederId);
                
                // Ga recursief verder
                this._getAncestorsSkipSiblings(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
                this._getAncestorsSkipSiblings(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
            } else {
                // Ouders zijn broer/zus - STOP HIER volgens officiële methode
                console.log(`     ⮑ Stop bij ${dog.naam}: ouders zijn ${areSiblings === 'FULL' ? 'volle' : 'half'} broer/zus`);
                // Voeg ouders niet toe aan result!
            }
        } else if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getAncestorsSkipSiblings(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        } else if (dog.moederId) {
            result.add(dog.moederId);
            this._getAncestorsSkipSiblings(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    // ✅ BIJDRAGE BEREKENING VOLGENS OFFICIËLE METHODE
    _calculateAncestorContributionOfficial(vaderId, moederId, ancestorId, maxDepth) {
        // Vind kortste routes (officiële systemen gebruiken vaak kortste route)
        const shortestViaVader = this._findShortestPath(vaderId, ancestorId, maxDepth);
        const shortestViaMoeder = this._findShortestPath(moederId, ancestorId, maxDepth);
        
        if (shortestViaVader === -1 || shortestViaMoeder === -1) return 0;
        
        // ✅ OFFICIEEL: Gebruik alleen kortste route, niet alle routes
        const contribution = Math.pow(0.5, shortestViaVader + shortestViaMoeder + 1);
        
        // Check ook of de voorouder zelf inteelt heeft
        const ancestorCOI = this._calculateOfficialCOI(ancestorId, maxDepth - 1);
        
        return contribution * (1 + ancestorCOI);
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

    // ✅ DEBUG: TOON ALLE BROER/ZUS PARINGEN IN STAMBOOM
    findSiblingMatingsInPedigree(dogId, maxDepth = 6) {
        const dog = this.getDogById(dogId);
        if (!dog) return [];
        
        console.log(`=== BROER/ZUS PARINGEN IN STAMBOOM VAN ${dog.naam} ===`);
        
        const siblings = [];
        this._findSiblingMatingsRecursive(dogId, maxDepth, 0, new Set(), siblings);
        
        siblings.forEach(s => {
            console.log(`Niveau ${s.depth}: ${s.parent1Name} × ${s.parent2Name} = ${s.type}`);
        });
        
        return siblings;
    }

    _findSiblingMatingsRecursive(dogId, maxDepth, currentDepth, visited, result) {
        if (!dogId || currentDepth >= maxDepth || visited.has(dogId)) return;
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return;
        
        // Check of ouders broer/zus zijn
        const siblingType = this._checkSiblingMating(dog.vaderId, dog.moederId);
        if (siblingType) {
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            result.push({
                depth: currentDepth,
                parent1Name: vader ? vader.naam : dog.vaderId,
                parent2Name: moeder ? moeder.naam : dog.moederId,
                type: siblingType === 'FULL' ? 'Volle broer/zus' : 'Half broer/zus'
            });
            
            // Volgens officiële methode stoppen we hier
            return;
        }
        
        // Ga verder met ouders
        this._findSiblingMatingsRecursive(dog.vaderId, maxDepth, currentDepth + 1, new Set(visited), result);
        this._findSiblingMatingsRecursive(dog.moederId, maxDepth, currentDepth + 1, new Set(visited), result);
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V6 geladen (officiële methode)');
}