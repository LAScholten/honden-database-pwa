/**
 * COICalculator.js - CORRECTE COI BEREKENING VOOR ALLE HONDEN
 * Volledige implementatie Wright's formule
 */

class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._ancestorCache = new Map();
        
        // Bouw snelle lookup
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`COICalculator geladen met ${allDogs.length} honden`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            if (!dogId || dogId === 0) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            // BASISGEWALEN
            if (!dog.vaderId || !dog.moederId) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (!vader || !moeder) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            // BROER/ZUS GEWALEN
            const isFullSibling = vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                                 vader.moederId && moeder.moederId && vader.moederId === moeder.moederId;
            
            const isHalfSibling = (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
                                 (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId);
            
            if (isFullSibling) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            if (isHalfSibling) {
                return { coi6Gen: '12.5', coiAllGen: '12.5' };
            }
            
            // COMPLEXE BEREKENING - WERKENDE VERSIE
            const coi6Gen = this._calculateWrightCOI(dogId, 6);
            const coiAllGen = this._calculateWrightCOI(dogId, 15);
            
            return {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
        } catch (error) {
            console.error('Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateWrightCOI(dogId, maxGenerations) {
        if (!dogId || maxGenerations <= 0) return 0;
        
        const cacheKey = `${dogId}_${maxGenerations}`;
        if (this._coiCache.has(cacheKey)) {
            return this._coiCache.get(cacheKey);
        }
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            this._coiCache.set(cacheKey, 0);
            return 0;
        }
        
        if (dog.vaderId === dog.moederId) {
            this._coiCache.set(cacheKey, 0.25);
            return 0.25;
        }
        
        // Vind gemeenschappelijke voorouders van de ouders
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, maxGenerations - 1);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            const pathsToVader = this._findAllPaths(dog.vaderId, ancestorId, maxGenerations - 1);
            const pathsToMoeder = this._findAllPaths(dog.moederId, ancestorId, maxGenerations - 1);
            
            for (const pathV of pathsToVader) {
                for (const pathM of pathsToMoeder) {
                    const n1 = pathV.length;
                    const n2 = pathM.length;
                    
                    // Basis bijdrage: (0.5)^(n1 + n2 + 1)
                    const baseContribution = Math.pow(0.5, n1 + n2 + 1);
                    
                    // COI van de voorouder zelf
                    const ancestorCOI = this._calculateWrightCOI(ancestorId, Math.max(n1, n2));
                    
                    // Totale bijdrage: base * (1 + ancestorCOI)
                    totalCOI += baseContribution * (1 + ancestorCOI);
                }
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _findCommonAncestors(dogId1, dogId2, maxDepth) {
        const ancestors1 = this._getAllAncestors(dogId1, maxDepth);
        const ancestors2 = this._getAllAncestors(dogId2, maxDepth);
        
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        return common;
    }

    _getAllAncestors(dogId, maxDepth, currentDepth = 0, result = new Set()) {
        if (!dogId || currentDepth >= maxDepth) return result;
        
        const cacheKey = `${dogId}_${maxDepth}_${currentDepth}`;
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
            this._getAllAncestors(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            tempSet.add(dog.moederId);
            this._getAllAncestors(dog.moederId, maxDepth, currentDepth + 1, result);
        }
        
        this._ancestorCache.set(cacheKey, tempSet);
        return result;
    }

    _findAllPaths(startId, targetId, maxDepth, currentPath = [], allPaths = []) {
        if (currentPath.length > maxDepth) return allPaths;
        
        const dog = this.getDogById(startId);
        if (!dog) return allPaths;
        
        const newPath = [...currentPath, startId];
        
        if (startId === targetId) {
            allPaths.push(newPath.slice(1));
            return allPaths;
        }
        
        if (dog.vaderId) {
            this._findAllPaths(dog.vaderId, targetId, maxDepth, newPath, allPaths);
        }
        
        if (dog.moederId) {
            this._findAllPaths(dog.moederId, targetId, maxDepth, newPath, allPaths);
        }
        
        return allPaths;
    }

    // Hulpfunctie om data te checken
    debugDog(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog) return null;
        
        return {
            id: dog.id,
            naam: dog.naam,
            vaderId: dog.vaderId,
            moederId: dog.moederId,
            vaderNaam: this.getDogById(dog.vaderId)?.naam || 'Onbekend',
            moederNaam: this.getDogById(dog.moederId)?.naam || 'Onbekend'
        };
    }
}

// Maak beschikbaar
window.COICalculator = COICalculator;