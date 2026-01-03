/**
 * COICalculator.js - Werkende COI berekening voor hondenstambomen
 * Gebruikt de correcte Wright's formule
 */

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
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        dogId = Number(dogId);
        if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        console.log('🔍 COI voor:', dog.naam, 'ID:', dog.id, 'Vader:', dog.vaderId, 'Moeder:', dog.moederId);

        // BASISGEWALEN
        if (!dog.vaderId || !dog.moederId) {
            console.log('➡ Geen ouders bekend -> 0%');
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        if (dog.vaderId === dog.moederId) {
            console.log('➡ Zelfde ouders -> 25%');
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }

        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) {
            console.log('➡ Ouders niet gevonden -> 0%');
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }

        // VOLLE BROER/ZUS
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            console.log('➡ Volle broer/zus ouders -> 25%');
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }

        // HALF BROER/ZUS
        if ((vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
            (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
            console.log('➡ Half broer/zus ouders -> 12.5%');
            return { coi6Gen: '12.5', coiAllGen: '12.5' };
        }

        // COMPLEXE BEREKENING - WERKENDE VERSIE
        console.log('➡ Complex geval -> bereken volledige COI');
        
        const coi6Gen = this._calculateCOIRecursive(dogId, 6);
        const coiAllGen = this._calculateCOIRecursive(dogId, 10);
        
        const result6 = (coi6Gen * 100).toFixed(1);
        const resultAll = (coiAllGen * 100).toFixed(1);
        
        console.log(`✅ Resultaat: ${dog.naam} = 6-gen: ${result6}%, all-gen: ${resultAll}%`);
        
        return {
            coi6Gen: result6,
            coiAllGen: resultAll
        };
    }

    _calculateCOIRecursive(dogId, generations) {
        if (!dogId || generations <= 0) return 0;
        
        const cacheKey = `${dogId}_${generations}`;
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

        // Vind gemeenschappelijke voorouders tussen ouders
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Bereken afstanden
            const pathsVader = this._findPaths(dog.vaderId, ancestorId, generations - 1);
            const pathsMoeder = this._findPaths(dog.moederId, ancestorId, generations - 1);
            
            for (const pathV of pathsVader) {
                for (const pathM of pathsMoeder) {
                    // Wright's formule: (0.5)^(n1 + n2 + 1) * (1 + FA)
                    const n1 = pathV.length;
                    const n2 = pathM.length;
                    const base = Math.pow(0.5, n1 + n2 + 1);
                    
                    // COI van de voorouder zelf
                    const ancestorCOI = this._calculateCOIRecursive(ancestorId, Math.max(n1, n2));
                    
                    totalCOI += base * (1 + ancestorCOI);
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

    _findPaths(startId, targetId, maxDepth, currentPath = [], allPaths = []) {
        if (currentPath.length > maxDepth) return allPaths;
        
        const dog = this.getDogById(startId);
        if (!dog) return allPaths;
        
        const newPath = [...currentPath, startId];
        
        if (startId === targetId) {
            allPaths.push(newPath.slice(1)); // Verwijder startpunt
            return allPaths;
        }
        
        if (dog.vaderId) {
            this._findPaths(dog.vaderId, targetId, maxDepth, newPath, allPaths);
        }
        
        if (dog.moederId) {
            this._findPaths(dog.moederId, targetId, maxDepth, newPath, allPaths);
        }
        
        return allPaths;
    }

    // Hulpfunctie voor debugging
    debugDog(dogId) {
        const dog = this.getDogById(dogId);
        if (!dog) return 'Hond niet gevonden';
        
        console.log('=== DEBUG HOND ===');
        console.log('ID:', dog.id);
        console.log('Naam:', dog.naam);
        console.log('Vader ID:', dog.vaderId, 'Moeder ID:', dog.moederId);
        
        if (dog.vaderId) {
            const vader = this.getDogById(dog.vaderId);
            console.log('Vader:', vader ? vader.naam : 'Niet gevonden');
        }
        
        if (dog.moederId) {
            const moeder = this.getDogById(dog.moederId);
            console.log('Moeder:', moeder ? moeder.naam : 'Niet gevonden');
        }
        
        console.log('=================');
    }
}

window.COICalculator = COICalculator;