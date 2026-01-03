/**
 * COICalculator.js - WERKENDE COI BEREKENING MET PARENT RELATIES
 * Gebruikt exact dezelfde data als StamboomManager
 */

class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._ancestorCache = new Map();
        this._parentPathsCache = new Map();
        
        // Bouw snelle lookup net zoals StamboomManager
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`COICalculator: ${this._dogMap.size} honden geladen`);
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
                console.warn(`Hond ${dogId} niet gevonden`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            console.log(`🔍 COI voor ${dog.naam} (${dog.id}) - Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);
            
            // BASISGEWALEN
            if (!dog.vaderId || !dog.moederId) {
                console.log(`➡ ${dog.naam}: Geen ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`➡ ${dog.naam}: Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (!vader || !moeder) {
                console.log(`➡ ${dog.naam}: Ouders niet gevonden -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            console.log(`➡ Vader: ${vader.naam} (${vader.id}), Moeder: ${moeder.naam} (${moeder.id})`);
            
            // VOLLE BROER/ZUS
            const isFullSibling = vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                                 vader.moederId && moeder.moederId && vader.moederId === moeder.moederId;
            
            if (isFullSibling) {
                console.log(`➡ ${dog.naam}: Ouders zijn volle broer/zus -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // HALF BROER/ZUS
            const isHalfSibling = (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
                                 (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId);
            
            if (isHalfSibling) {
                console.log(`➡ ${dog.naam}: Ouders zijn half broer/zus -> 12.5%`);
                return { coi6Gen: '12.5', coiAllGen: '12.5' };
            }
            
            // COMPLEXE BEREKENING
            console.log(`➡ ${dog.naam}: Complex geval - bereken COI`);
            
            // Vind ALLE voorouders van beide ouders (max 15 generaties)
            const vaderAncestors = this._getAllAncestorsWithDepth(dog.vaderId, 15);
            const moederAncestors = this._getAllAncestorsWithDepth(dog.moederId, 15);
            
            console.log(`   Vader voorouders: ${vaderAncestors.size}, Moeder voorouders: ${moederAncestors.size}`);
            
            // Vind gemeenschappelijke voorouders
            const commonAncestors = new Set();
            for (const ancestor of vaderAncestors.keys()) {
                if (moederAncestors.has(ancestor)) {
                    commonAncestors.add(ancestor);
                }
            }
            
            console.log(`   Gemeenschappelijke voorouders: ${commonAncestors.size}`);
            
            if (commonAncestors.size === 0) {
                console.log(`➡ ${dog.naam}: Geen gemeenschappelijke voorouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            // Bereken COI volgens Wright's formule
            let totalCOI6 = 0;
            let totalCOIAll = 0;
            
            for (const ancestorId of commonAncestors) {
                const depthVader = vaderAncestors.get(ancestorId);
                const depthMoeder = moederAncestors.get(ancestorId);
                
                if (depthVader && depthMoeder) {
                    // Bijdrage voor 6 generaties
                    if (depthVader <= 6 && depthMoeder <= 6) {
                        totalCOI6 += Math.pow(0.5, depthVader + depthMoeder + 1);
                    }
                    
                    // Bijdrage voor alle generaties
                    totalCOIAll += Math.pow(0.5, depthVader + depthMoeder + 1);
                    
                    // Voeg COI van de voorouder zelf toe (recursief)
                    const ancestorCOI = this._calculateAncestorCOI(ancestorId, Math.max(depthVader, depthMoeder));
                    totalCOIAll += Math.pow(0.5, depthVader + depthMoeder + 1) * ancestorCOI;
                }
            }
            
            const result6 = (totalCOI6 * 100).toFixed(1);
            const resultAll = (totalCOIAll * 100).toFixed(1);
            
            console.log(`✅ ${dog.naam}: COI 6-gen = ${result6}%, COI all-gen = ${resultAll}%`);
            
            return {
                coi6Gen: result6,
                coiAllGen: resultAll
            };
            
        } catch (error) {
            console.error('Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _getAllAncestorsWithDepth(startId, maxDepth, currentDepth = 1, result = new Map(), visited = new Set()) {
        if (!startId || currentDepth > maxDepth || visited.has(startId)) {
            return result;
        }
        
        visited.add(startId);
        
        const dog = this.getDogById(startId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            if (!result.has(dog.vaderId) || result.get(dog.vaderId) > currentDepth) {
                result.set(dog.vaderId, currentDepth);
            }
            this._getAllAncestorsWithDepth(dog.vaderId, maxDepth, currentDepth + 1, result, visited);
        }
        
        if (dog.moederId) {
            if (!result.has(dog.moederId) || result.get(dog.moederId) > currentDepth) {
                result.set(dog.moederId, currentDepth);
            }
            this._getAllAncestorsWithDepth(dog.moederId, maxDepth, currentDepth + 1, result, visited);
        }
        
        return result;
    }

    _calculateAncestorCOI(ancestorId, maxDepth) {
        if (!ancestorId || maxDepth <= 0) return 0;
        
        const cacheKey = `ancestor_${ancestorId}_${maxDepth}`;
        if (this._coiCache.has(cacheKey)) {
            return this._coiCache.get(cacheKey);
        }
        
        const dog = this.getDogById(ancestorId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            this._coiCache.set(cacheKey, 0);
            return 0;
        }
        
        if (dog.vaderId === dog.moederId) {
            this._coiCache.set(cacheKey, 0.25);
            return 0.25;
        }
        
        let totalCOI = 0;
        
        // Voor de voorouder zelf, gebruik kleinere diepte
        const vaderAncestors = this._getAllAncestorsWithDepth(dog.vaderId, maxDepth - 1);
        const moederAncestors = this._getAllAncestorsWithDepth(dog.moederId, maxDepth - 1);
        
        const commonAncestors = new Set();
        for (const ancestor of vaderAncestors.keys()) {
            if (moederAncestors.has(ancestor)) {
                commonAncestors.add(ancestor);
            }
        }
        
        for (const commonId of commonAncestors) {
            const depthVader = vaderAncestors.get(commonId);
            const depthMoeder = moederAncestors.get(commonId);
            
            if (depthVader && depthMoeder) {
                totalCOI += Math.pow(0.5, depthVader + depthMoeder + 1);
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    // DEBUG FUNCTIE
    debugDogHierarchy(dogId, depth = 3) {
        console.log(`=== STAMBOOM HIERARCHIE VOOR HOND ${dogId} ===`);
        
        const printHierarchy = (currentId, currentDepth, prefix = '') => {
            if (currentDepth > depth) return;
            
            const dog = this.getDogById(currentId);
            if (!dog) return;
            
            console.log(`${prefix}${dog.naam} (${dog.id})`);
            
            if (dog.vaderId) {
                printHierarchy(dog.vaderId, currentDepth + 1, prefix + '  ├─ V: ');
            }
            if (dog.moederId) {
                printHierarchy(dog.moederId, currentDepth + 1, prefix + '  └─ M: ');
            }
        };
        
        printHierarchy(dogId, 0);
        console.log('==================================');
    }
}

window.COICalculator = COICalculator;