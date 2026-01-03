// COICalculator V5 - GECORRIGEERDE FORMULE
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache6 = new Map();
        this._coiCacheAll = new Map();
        this._ancestorCache6 = new Map();
        this._ancestorCacheAll = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        console.log(`✅ COICalculator V5: ${this._dogMap.size} honden geladen`);
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
            
            console.log(`🔍 COI voor: ${dog.naam} (ID: ${dog.id})`);
            
            if (!dog.vaderId || !dog.moederId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            if (dog.vaderId === dog.moederId) return { coi6Gen: '25.0', coiAllGen: '25.0' };
            
            const coi6Gen = this._calculateCOIWithDepth(dogId, 6, '6gen');
            const coiAllGen = this._calculateCOIWithDepth(dogId, 25, 'allgen');
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            return result;
            
        } catch (error) {
            console.error('❌ Fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateCOIWithDepth(dogId, maxGenerations, cacheType = '6gen') {
        if (!dogId) return 0;
        
        const cacheKey = `${cacheType}_${dogId}`;
        const cache = cacheType === '6gen' ? this._coiCache6 : this._coiCacheAll;
        if (cache.has(cacheKey)) return cache.get(cacheKey);
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            cache.set(cacheKey, 0);
            return 0;
        }
        
        if (dog.vaderId === dog.moederId) {
            cache.set(cacheKey, 0.25);
            return 0.25;
        }
        
        const vaderAncestors = this._getAllAncestorsWithDepth(dog.vaderId, maxGenerations, cacheType);
        const moederAncestors = this._getAllAncestorsWithDepth(dog.moederId, maxGenerations, cacheType);
        
        const commonAncestors = new Set();
        for (const ancestor of vaderAncestors) {
            if (moederAncestors.has(ancestor)) commonAncestors.add(ancestor);
        }
        
        let totalCOI = 0;
        for (const ancestorId of commonAncestors) {
            const distVader = this._getDistanceWithDepth(dog.vaderId, ancestorId, maxGenerations);
            const distMoeder = this._getDistanceWithDepth(dog.moederId, ancestorId, maxGenerations);
            
            if (distVader > 0 && distMoeder > 0) {
                const contribution = Math.pow(0.5, distVader + distMoeder + 1);
                
                // ✅ CORRECTE FORMULE: (0.5)^(n₁+n₂+1) × (1 + Fₐ)
                const ancestorCOI = this._calculateAncestorCOIWithDepth(ancestorId, Math.max(distVader, distMoeder));
                totalCOI += contribution * (1 + ancestorCOI);
            }
        }
        
        cache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _getAllAncestorsWithDepth(dogId, maxDepth, cacheType) {
        if (!dogId || maxDepth <= 0) return new Set();
        
        const cacheKey = `${cacheType}_ancestors_${dogId}_${maxDepth}`;
        const cache = cacheType === '6gen' ? this._ancestorCache6 : this._ancestorCacheAll;
        if (cache.has(cacheKey)) return cache.get(cacheKey);
        
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
        
        const queue = [{id: startId, depth: 0}];
        const visited = new Set();
        
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.id === targetId) return current.depth;
            if (current.depth >= maxDepth || visited.has(current.id)) continue;
            
            visited.add(current.id);
            const dog = this.getDogById(current.id);
            if (!dog) continue;
            
            if (dog.vaderId) queue.push({id: dog.vaderId, depth: current.depth + 1});
            if (dog.moederId) queue.push({id: dog.moederId, depth: current.depth + 1});
        }
        
        return -1;
    }

    _calculateAncestorCOIWithDepth(ancestorId, remainingDepth) {
        if (!ancestorId || remainingDepth <= 0) return 0;
        
        const cacheKey = `ancestor_${ancestorId}_${remainingDepth}`;
        if (this._coiCache6.has(cacheKey)) return this._coiCache6.get(cacheKey);
        
        const dog = this.getDogById(ancestorId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            this._coiCache6.set(cacheKey, 0);
            return 0;
        }
        
        if (dog.vaderId === dog.moederId) {
            this._coiCache6.set(cacheKey, 0.25);
            return 0.25;
        }
        
        // Simpele berekening voor voorouders - alleen directe gemeenschappelijke ouders
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) {
            this._coiCache6.set(cacheKey, 0);
            return 0;
        }
        
        let ancestorCOI = 0;
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) {
            // Gemeenschappelijke grootvader
            ancestorCOI += Math.pow(0.5, 3); // (0.5)³ = 0.125
        }
        if (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            // Gemeenschappelijke grootmoeder
            ancestorCOI += Math.pow(0.5, 3); // (0.5)³ = 0.125
        }
        
        this._coiCache6.set(cacheKey, ancestorCOI);
        return ancestorCOI;
    }
}

if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V5 geladen - gecorrigeerde formule');
}