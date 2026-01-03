/**
 * COICalculator.js
 * Onafhankelijke, herbruikbare COI berekeningsmodule
 * Gebruik: const calculator = new COICalculator(hondenArray);
 * const result = calculator.calculateCOI(dogId);
 */

class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._coiCache = new Map();
        this._ancestorCache = new Map();
        this._dogMap = new Map();
        
        // Maak een snelle lookup map
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(dog.id, dog);
            }
        });
    }
    
    setDogs(allDogs) {
        this.allDogs = allDogs;
        this._dogMap.clear();
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(dog.id, dog);
            }
        });
        this.clearCache();
    }
    
    clearCache() {
        this._coiCache.clear();
        this._ancestorCache.clear();
    }
    
    getDogById(id) {
        return this._dogMap.get(id) || null;
    }
    
    calculateCOI(dogId) {
        if (!dogId || dogId === 0) {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        // BASISGEWAL: Hond zonder ouders = 0%
        if (!dog.vaderId || !dog.moederId) {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        // BASISGEWAL: Zelfde ouders = 25%
        if (dog.vaderId === dog.moederId) {
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        // BASISGEWAL: Volle broer/zus = 25%
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }
        
        // BASISGEWAL: Half broer/zus = 12.5%
        if ((vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
            (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
            return { coi6Gen: '12.5', coiAllGen: '12.5' };
        }
        
        // Complexe berekeningen
        const coi6Gen = this._calculateWrightCOI(dogId, 6);
        const coiAllGen = this._calculateWrightCOI(dogId, 10);
        
        return {
            coi6Gen: (coi6Gen * 100).toFixed(1),
            coiAllGen: (coiAllGen * 100).toFixed(1)
        };
    }
    
    _calculateWrightCOI(dogId, maxGenerations) {
        if (!dogId || maxGenerations <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Cache check
        const cacheKey = `${dogId}_${maxGenerations}`;
        if (this._coiCache.has(cacheKey)) {
            return this._coiCache.get(cacheKey);
        }
        
        // Wright's formule: COI(x) = Σ[(0.5)^(n1+n2+1) * (1 + COI(a))]
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, maxGenerations);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            const n1 = this._getGenerationsBetween(dog.vaderId, ancestorId, maxGenerations);
            const n2 = this._getGenerationsBetween(dog.moederId, ancestorId, maxGenerations);
            
            if (n1 === -1 || n2 === -1) continue;
            
            const baseContribution = Math.pow(0.5, n1 + n2 + 1);
            const ancestorCOI = (maxGenerations > 1) ? 
                this._calculateWrightCOI(ancestorId, Math.max(n1, n2)) : 0;
            
            totalCOI += baseContribution * (1 + ancestorCOI);
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }
    
    _findCommonAncestors(dogId1, dogId2, maxGenerations) {
        const ancestors1 = this._getAncestorsSet(dogId1, maxGenerations);
        const ancestors2 = this._getAncestorsSet(dogId2, maxGenerations);
        
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        return common;
    }
    
    _getAncestorsSet(dogId, maxGenerations, currentGen = 0, result = new Set()) {
        if (!dogId || currentGen >= maxGenerations) return result;
        
        const cacheKey = `${dogId}_${maxGenerations}_${currentGen}`;
        if (this._ancestorCache.has(cacheKey)) {
            const cached = this._ancestorCache.get(cacheKey);
            cached.forEach(id => result.add(id));
            return result;
        }
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        const tempSet = new Set();
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            tempSet.add(dog.vaderId);
            this._getAncestorsSet(dog.vaderId, maxGenerations, currentGen + 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            tempSet.add(dog.moederId);
            this._getAncestorsSet(dog.moederId, maxGenerations, currentGen + 1, result);
        }
        
        this._ancestorCache.set(cacheKey, tempSet);
        return result;
    }
    
    _getGenerationsBetween(descendantId, ancestorId, maxDepth) {
        if (!descendantId || !ancestorId) return -1;
        if (descendantId === ancestorId) return 0;
        
        const queue = [{ id: descendantId, depth: 0 }];
        const visited = new Set();
        
        while (queue.length > 0) {
            const { id, depth } = queue.shift();
            
            if (depth >= maxDepth) continue;
            if (visited.has(id)) continue;
            visited.add(id);
            
            const dog = this.getDogById(id);
            if (!dog) continue;
            
            if (dog.vaderId === ancestorId) return depth + 1;
            if (dog.moederId === ancestorId) return depth + 1;
            
            if (dog.vaderId) {
                queue.push({ id: dog.vaderId, depth: depth + 1 });
            }
            if (dog.moederId) {
                queue.push({ id: dog.moederId, depth: depth + 1 });
            }
        }
        
        return -1;
    }
    
    // Batch berekening voor pre-calculatie
    calculateBatchCOI(dogIds = []) {
        const results = {};
        
        for (const dogId of dogIds) {
            results[dogId] = this.calculateCOI(dogId);
        }
        
        return results;
    }
    
    // Snelle check voor eenvoudige gevallen (voor pre-calculatie)
    isSimpleCase(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog) return true;
        
        if (!dog.vaderId || !dog.moederId) return true;
        if (dog.vaderId === dog.moederId) return true;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) return true;
        
        // Check voor broer/zus gevallen
        const fullSibling = vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                           vader.moederId && moeder.moederId && vader.moederId === moeder.moederId;
        
        const halfSibling = (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
                           (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId);
        
        return fullSibling || halfSibling;
    }
}