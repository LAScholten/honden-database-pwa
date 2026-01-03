// COICalculator V3 - WERKENDE COI BEREKENING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        this._ancestorCache = new Map();
        
        // Bouw snelle lookup net zoals StamboomManager
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V3: ${this._dogMap.size} honden geladen`);
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
            console.log(`   Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);

            // BASISGEWALEN
            if (!dog.vaderId || !dog.moederId) {
                console.log(`   ➡ Geen ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`   ➡ Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (!vader || !moeder) {
                console.log(`   ➡ Ouders niet gevonden -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            console.log(`   ➡ Vader: ${vader.naam} (${vader.id})`);
            console.log(`   ➡ Moeder: ${moeder.naam} (${moeder.id})`);

            // VOLLE BROER/ZUS
            const isFullSibling = vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                                 vader.moederId && moeder.moederId && vader.moederId === moeder.moederId;
            
            if (isFullSibling) {
                console.log(`   ➡ Ouders zijn volle broer/zus -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }

            // COMPLEXE BEREKENING
            console.log(`   ➡ Complex geval - zoek gemeenschappelijke voorouders`);
            
            // Vind alle voorouders van vader (6 generaties)
            const vaderAncestors = this._getAllAncestors(dog.vaderId, 6);
            // Vind alle voorouders van moeder (6 generaties)
            const moederAncestors = this._getAllAncestors(dog.moederId, 6);
            
            console.log(`   ➡ Voorouders vader: ${vaderAncestors.size}, voorouders moeder: ${moederAncestors.size}`);
            
            // Vind gemeenschappelijke voorouders
            const commonAncestors = new Set();
            for (const ancestor of vaderAncestors) {
                if (moederAncestors.has(ancestor)) {
                    commonAncestors.add(ancestor);
                }
            }
            
            console.log(`   ➡ Gemeenschappelijke voorouders: ${commonAncestors.size}`);
            
            if (commonAncestors.size === 0) {
                console.log(`   ➡ Geen gemeenschappelijke voorouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            // Bereken COI volgens Wright's formule
            let totalCOI = 0;
            
            for (const ancestorId of commonAncestors) {
                // Bereken afstand via vader
                const distanceViaVader = this._getDistance(dog.vaderId, ancestorId, 6);
                // Bereken afstand via moeder
                const distanceViaMoeder = this._getDistance(dog.moederId, ancestorId, 6);
                
                if (distanceViaVader > 0 && distanceViaMoeder > 0) {
                    // Wright's formule: (0.5)^(n1 + n2 + 1)
                    const contribution = Math.pow(0.5, distanceViaVader + distanceViaMoeder + 1);
                    console.log(`   ➡ Voorouder ${ancestorId}: afstand ${distanceViaVader}+${distanceViaMoeder} -> ${(contribution*100).toFixed(2)}%`);
                    totalCOI += contribution;
                    
                    // Voeg COI van de voorouder zelf toe (recursief)
                    const ancestorCOI = this._calculateAncestorCOI(ancestorId, Math.max(distanceViaVader, distanceViaMoeder));
                    totalCOI += contribution * ancestorCOI;
                }
            }
            
            const result = (totalCOI * 100).toFixed(1);
            console.log(`✅ ${dog.naam}: COI = ${result}%`);
            console.log(`=======================================`);
            
            return {
                coi6Gen: result,
                coiAllGen: result
            };
            
        } catch (error) {
            console.error('❌ Fout in COI berekening:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
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

    _getDistance(startId, targetId, maxDepth, currentDepth = 0, visited = new Set()) {
        if (!startId || currentDepth > maxDepth || visited.has(startId)) return -1;
        
        if (startId === targetId) return currentDepth;
        
        visited.add(startId);
        
        const dog = this.getDogById(startId);
        if (!dog) return -1;
        
        if (dog.vaderId) {
            const viaVader = this._getDistance(dog.vaderId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (viaVader > 0) return viaVader;
        }
        
        if (dog.moederId) {
            const viaMoeder = this._getDistance(dog.moederId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (viaMoeder > 0) return viaMoeder;
        }
        
        return -1;
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
        
        // Voor de voorouder zelf, gebruik recursie met verminderde diepte
        const vaderAncestors = this._getAllAncestors(dog.vaderId, maxDepth - 1);
        const moederAncestors = this._getAllAncestors(dog.moederId, maxDepth - 1);
        
        const commonAncestors = new Set();
        for (const ancestor of vaderAncestors) {
            if (moederAncestors.has(ancestor)) {
                commonAncestors.add(ancestor);
            }
        }
        
        let total = 0;
        for (const commonId of commonAncestors) {
            const distVader = this._getDistance(dog.vaderId, commonId, maxDepth - 1);
            const distMoeder = this._getDistance(dog.moederId, commonId, maxDepth - 1);
            
            if (distVader > 0 && distMoeder > 0) {
                total += Math.pow(0.5, distVader + distMoeder + 1);
            }
        }
        
        this._coiCache.set(cacheKey, total);
        return total;
    }
    
    // DEBUG FUNCTIE
    debugStamboom(hondId, diepte = 3) {
        const hond = this.getDogById(hondId);
        if (!hond) {
            console.log(`Hond ${hondId} niet gevonden`);
            return;
        }
        
        console.log(`=== STAMBOOM DEBUG: ${hond.naam} (${hondId}) ===`);
        this._printStamboom(hondId, 0, diepte, '');
        console.log(`====================================`);
    }

    _printStamboom(hondId, huidigeDiepte, maxDiepte, prefix) {
        if (huidigeDiepte > maxDiepte) return;
        
        const hond = this.getDogById(hondId);
        if (!hond) return;
        
        console.log(`${prefix}${hond.naam} (${hond.id}) [vader:${hond.vaderId}, moeder:${hond.moederId}]`);
        
        if (hond.vaderId) {
            this._printStamboom(hond.vaderId, huidigeDiepte + 1, maxDiepte, prefix + '  ├─V: ');
        }
        if (hond.moederId) {
            this._printStamboom(hond.moederId, huidigeDiepte + 1, maxDiepte, prefix + '  └─M: ');
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V3 geladen en globaal beschikbaar');
}