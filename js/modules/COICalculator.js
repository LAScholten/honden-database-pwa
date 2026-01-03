class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map(allDogs.map(d => [d.id, d]));
        this._coiCache = new Map();
        this._ancestorCache = new Map();
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        dogId = Number(dogId);
        if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        console.log('COI CALC:', dog.id, dog.naam, 'vader:', dog.vaderId, 'moeder:', dog.moederId);

        // BASISGEWALEN
        if (!dog.vaderId || !dog.moederId) {
            console.log('GEEN OUDERS -> 0%');
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        if (dog.vaderId === dog.moederId) {
            console.log('ZELFDE OUDERS -> 25%');
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }

        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        if (!vader || !moeder) {
            console.log('OUDERS NIET GEVONDEN -> 0%');
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }

        // VOLLE BROER/ZUS
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            console.log('VOLLE BROER/ZUS -> 25%');
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }

        // HALF BROER/ZUS
        if ((vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
            (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
            console.log('HALF BROER/ZUS -> 12.5%');
            return { coi6Gen: '12.5', coiAllGen: '12.5' };
        }

        // COMPLEXE BEREKENING
        console.log('COMPLEX GEVAL -> bereken volledige COI');
        
        const coi6Gen = this._calculateWrightCOI(dogId, 6);
        const coiAllGen = this._calculateWrightCOI(dogId, 15);
        
        console.log(`RESULT: 6-gen=${(coi6Gen * 100).toFixed(1)}%, all-gen=${(coiAllGen * 100).toFixed(1)}%`);
        
        return {
            coi6Gen: (coi6Gen * 100).toFixed(1),
            coiAllGen: (coiAllGen * 100).toFixed(1)
        };
    }

    _calculateWrightCOI(dogId, maxGenerations) {
        if (!dogId || maxGenerations <= 0) return 0;
        
        const cacheKey = `${dogId}_${maxGenerations}`;
        if (this._coiCache.has(cacheKey)) {
            return this._coiCache.get(cacheKey);
        }
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Vind gemeenschappelijke voorouders tussen vader en moeder
        const vaderAncestors = this._getAncestors(dog.vaderId, maxGenerations - 1);
        const moederAncestors = this._getAncestors(dog.moederId, maxGenerations - 1);
        
        const commonAncestors = new Set();
        for (const ancestor of vaderAncestors) {
            if (moederAncestors.has(ancestor)) {
                commonAncestors.add(ancestor);
            }
        }
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Vind alle paden van vader naar voorouder
            const pathsViaVader = this._findAllPaths(dog.vaderId, ancestorId, maxGenerations - 1);
            // Vind alle paden van moeder naar voorouder
            const pathsViaMoeder = this._findAllPaths(dog.moederId, ancestorId, maxGenerations - 1);
            
            for (const pathVader of pathsViaVader) {
                for (const pathMoeder of pathsViaMoeder) {
                    // n1 + n2 + 1
                    const contribution = Math.pow(0.5, pathVader.length + pathMoeder.length + 1);
                    totalCOI += contribution;
                    
                    // Voeg COI van de voorouder zelf toe
                    const ancestorCOI = this._calculateWrightCOI(ancestorId, Math.max(pathVader.length, pathMoeder.length));
                    totalCOI += contribution * ancestorCOI;
                }
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _getAncestors(dogId, maxDepth, currentDepth = 0, result = new Set()) {
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
            this._getAncestors(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            tempSet.add(dog.moederId);
            this._getAncestors(dog.moederId, maxDepth, currentDepth + 1, result);
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
            allPaths.push(newPath.slice(1)); // Verwijder startpunt
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
}

window.COICalculator = COICalculator;