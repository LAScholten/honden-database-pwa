// COICalculator V3 - DUBBELE BEREKENING (6 generaties + alle generaties)
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache6 = new Map();
        this._coiCacheAll = new Map();
        this._ancestorCache6 = new Map();
        this._ancestorCacheAll = new Map();
        
        // Bouw snelle lookup
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V4: ${this._dogMap.size} honden geladen`);
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
            
            // BASISGEWALEN
            if (!dog.vaderId || !dog.moederId) {
                console.log(`   ➡ Geen ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`   ➡ Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // ✅ BEREKEN BEIDE VERSIES
            const coi6Gen = this._calculateCOIWithDepth(dogId, 6, '6gen');
            const coiAllGen = this._calculateCOIWithDepth(dogId, 25, 'allgen'); // 25 generaties = "alle"
            
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

    // KERNFUNCTIE voor berekening met variabele diepte
    _calculateCOIWithDepth(dogId, maxGenerations, cacheType = '6gen') {
        if (!dogId) return 0;
        
        const cacheKey = `${cacheType}_${dogId}`;
        const cache = cacheType === '6gen' ? this._coiCache6 : this._coiCacheAll;
        
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            cache.set(cacheKey, 0);
            return 0;
        }
        
        if (dog.vaderId === dog.moederId) {
            cache.set(cacheKey, 0.25);
            return 0.25;
        }
        
        // Zoek gemeenschappelijke voorouders met de juiste diepte
        const vaderAncestors = this._getAllAncestorsWithDepth(dog.vaderId, maxGenerations, cacheType);
        const moederAncestors = this._getAllAncestorsWithDepth(dog.moederId, maxGenerations, cacheType);
        
        const commonAncestors = new Set();
        for (const ancestor of vaderAncestors) {
            if (moederAncestors.has(ancestor)) {
                commonAncestors.add(ancestor);
            }
        }
        
        console.log(`   ➡ ${cacheType}: ${commonAncestors.size} gemeenschappelijke voorouders`);
        
        if (commonAncestors.size === 0) {
            cache.set(cacheKey, 0);
            return 0;
        }
        
        // Wright's formule
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            const distanceViaVader = this._getDistanceWithDepth(dog.vaderId, ancestorId, maxGenerations);
            const distanceViaMoeder = this._getDistanceWithDepth(dog.moederId, ancestorId, maxGenerations);
            
            if (distanceViaVader > 0 && distanceViaMoeder > 0) {
                const contribution = Math.pow(0.5, distanceViaVader + distanceViaMoeder + 1);
                console.log(`   ➡ ${cacheType} Voorouder ${ancestorId}: ${distanceViaVader}+${distanceViaMoeder} -> ${(contribution*100).toFixed(4)}%`);
                totalCOI += contribution;
                
                // Recursief COI van de voorouder zelf
                const ancestorCOI = this._calculateAncestorCOIWithDepth(ancestorId, maxGenerations - 1);
                totalCOI += contribution * ancestorCOI;
            }
        }
        
        cache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // Verbeterde functie met diepte-parameter
    _getAllAncestorsWithDepth(dogId, maxDepth, cacheType) {
        if (!dogId || maxDepth <= 0) return new Set();
        
        const cacheKey = `${cacheType}_ancestors_${dogId}_${maxDepth}`;
        const cache = cacheType === '6gen' ? this._ancestorCache6 : this._ancestorCacheAll;
        
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }
        
        const result = new Set();
        const stack = [{id: dogId, depth: 0}];
        
        while (stack.length > 0) {
            const current = stack.pop();
            
            if (current.depth >= maxDepth) continue;
            
            const dog = this.getDogById(current.id);
            if (!dog) continue;
            
            if (dog.vaderId) {
                result.add(dog.vaderId);
                stack.push({id: dog.vaderId, depth: current.depth + 1});
            }
            
            if (dog.moederId) {
                result.add(dog.moederId);
                stack.push({id: dog.moederId, depth: current.depth + 1});
            }
        }
        
        cache.set(cacheKey, result);
        return result;
    }

    _getDistanceWithDepth(startId, targetId, maxDepth) {
        if (!startId || !targetId) return -1;
        
        // BFS voor afstand zoeken
        const queue = [{id: startId, depth: 0}];
        const visited = new Set();
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.id === targetId) {
                return current.depth;
            }
            
            if (current.depth >= maxDepth || visited.has(current.id)) {
                continue;
            }
            
            visited.add(current.id);
            const dog = this.getDogById(current.id);
            if (!dog) continue;
            
            if (dog.vaderId) {
                queue.push({id: dog.vaderId, depth: current.depth + 1});
            }
            
            if (dog.moederId) {
                queue.push({id: dog.moederId, depth: current.depth + 1});
            }
        }
        
        return -1;
    }

    _calculateAncestorCOIWithDepth(ancestorId, remainingDepth) {
        if (!ancestorId || remainingDepth <= 0) return 0;
        
        return this._calculateCOIWithDepth(ancestorId, remainingDepth, 'ancestor');
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V4 geladen met 6-gen en All-gen berekeningen');
}