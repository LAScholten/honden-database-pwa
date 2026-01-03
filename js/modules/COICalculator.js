class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map(allDogs.map(d => [d.id, d]));
        this._coiCache = new Map();
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        dogId = Number(dogId);
        if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        console.log('CALC FOR:', dog.naam, 'vader:', dog.vaderId, 'moeder:', dog.moederId);

        // GEEN OUDERS = 0%
        if (!dog.vaderId || !dog.moederId) {
            console.log('GEEN OUDERS -> 0%');
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }

        // ZELFDE OUDERS = 25%
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

        // VOLLE BROER/ZUS = 25%
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            console.log('VOLLE BROER/ZUS -> 25%');
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }

        // HALF BROER/ZUS = 12.5%
        if ((vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
            (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
            console.log('HALF BROER/ZUS -> 12.5%');
            return { coi6Gen: '12.5', coiAllGen: '12.5' };
        }

        // COMPLEXE BEREKENING
        const ancestors1 = this._getAllAncestors(dog.vaderId, 6);
        const ancestors2 = this._getAllAncestors(dog.moederId, 6);
        const common = this._findCommonAncestors(ancestors1, ancestors2);

        let totalCOI = 0;
        for (const ancId of common) {
            const paths1 = this._findAllPaths(dog.vaderId, ancId, 6);
            const paths2 = this._findAllPaths(dog.moederId, ancId, 6);
            
            for (const path1 of paths1) {
                for (const path2 of paths2) {
                    const n = path1.length;
                    const m = path2.length;
                    totalCOI += Math.pow(0.5, n + m + 1);
                }
            }
        }

        const coiPercent = (totalCOI * 100).toFixed(1);
        console.log('COMPLEX RESULT:', coiPercent + '%');
        
        return {
            coi6Gen: coiPercent,
            coiAllGen: coiPercent
        };
    }

    _getAllAncestors(dogId, maxDepth, currentDepth = 0, result = new Set()) {
        if (!dogId || currentDepth >= maxDepth) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getAllAncestors(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        if (dog.moederId) {
            result.add(dog.moederId);
            this._getAllAncestors(dog.moederId, maxDepth, currentDepth + 1, result);
        }
        
        return result;
    }

    _findCommonAncestors(set1, set2) {
        const common = new Set();
        for (const id of set1) {
            if (set2.has(id)) common.add(id);
        }
        return common;
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
}

window.COICalculator = COICalculator;