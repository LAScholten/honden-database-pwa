// COICalculator V3 - WERKENDE COI BEREKENING MET 6 EN 25 GENERATIES
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
            


            // COMPLEXE BEREKENING - BEIDE VERSIES
            console.log(`   ➡ Complex geval - bereken 6 en 25 generaties`);
            
            // ✅ BEREKEN BEIDE VERSIES
            const coi6Gen = this._calculateCOIWithDepth(dogId, 6);
            const coiAllGen = this._calculateCOIWithDepth(dogId, 25);
            
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

    // ✅ NIEUWE FUNCTIE: bereken COI met variabele diepte
    _calculateCOIWithDepth(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Vind alle voorouders van vader
        const vaderAncestors = this._getAllAncestors(dog.vaderId, maxDepth);
        // Vind alle voorouders van moeder
        const moederAncestors = this._getAllAncestors(dog.moederId, maxDepth);
        
        console.log(`   ➡ ${maxDepth}gen: vader=${vaderAncestors.size}, moeder=${moederAncestors.size} voorouders`);
        
        // Vind gemeenschappelijke voorouders
        const commonAncestors = new Set();
        for (const ancestor of vaderAncestors) {
            if (moederAncestors.has(ancestor)) {
                commonAncestors.add(ancestor);
            }
        }
        
        console.log(`   ➡ ${maxDepth}gen: ${commonAncestors.size} gemeenschappelijke voorouders`);
        
        if (commonAncestors.size === 0) return 0;
        
        // Bereken COI volgens Wright's formule
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Bereken afstand via vader
            const distanceViaVader = this._getDistance(dog.vaderId, ancestorId, maxDepth);
            // Bereken afstand via moeder
            const distanceViaMoeder = this._getDistance(dog.moederId, ancestorId, maxDepth);
            
            if (distanceViaVader > 0 && distanceViaMoeder > 0) {
                // Wright's formule: (0.5)^(n1 + n2 + 1)
                const contribution = Math.pow(0.5, distanceViaVader + distanceViaMoeder + 1);
                console.log(`   ➡ ${maxDepth}gen Voorouder ${ancestorId}: ${distanceViaVader}+${distanceViaMoeder} = ${(contribution*100).toFixed(2)}%`);
                totalCOI += contribution;
            }
        }
        
        return totalCOI;
    }

    // Deze functies blijven precies hetzelfde als in je origineel
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

    // DEBUG FUNCTIE (zelfde als origineel)
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
    console.log('✅ COICalculator V3+ geladen met 6-gen en 25-gen berekeningen');
}