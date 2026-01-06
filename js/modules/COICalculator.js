// COICalculator.js - COMPLEET WERKEND BESTAND
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
        
        console.log(`✅ COICalculator: ${this._dogMap.size} honden geladen`);
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
            
            console.log(`🔍 ${dog.naam} (ID: ${dog.id})`);

            // BASISGEVALLEN
            if (!dog.vaderId || !dog.moederId) {
                console.log(`   ➡ Geen ouders -> 0%`);
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                console.log(`   ➡ Zelfde ouders -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // BEREKENING
            const coi6Gen = this._calculateCOIDepth(dogId, 6);
            const coiAllGen = this._calculateCOIDepth(dogId, 10);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: ${result.coi6Gen}% / ${result.coiAllGen}%`);
            return result;
            
        } catch (error) {
            console.error('❌ Fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateCOIDepth(dogId, maxDepth) {
        if (maxDepth <= 0) return 0;
        
        const cacheKey = `${dogId}_${maxDepth}`;
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
        
        // Vind voorouders van ouders
        const vaderAncestors = this._getAncestorsWithDistance(dog.vaderId, maxDepth - 1);
        const moederAncestors = this._getAncestorsWithDistance(dog.moederId, maxDepth - 1);
        
        // Bereken COI
        let totalCOI = 0;
        
        for (const [ancestorId, distVader] of vaderAncestors) {
            const distMoeder = moederAncestors.get(ancestorId);
            if (distMoeder !== undefined) {
                // Wright's formule: (0.5)^(n1 + n2 + 1)
                totalCOI += Math.pow(0.5, distVader + distMoeder + 1);
            }
        }
        
        this._coiCache.set(cacheKey, totalCOI);
        return totalCOI;
    }

    _getAncestorsWithDistance(dogId, maxDepth, currentDepth = 0, result = new Map(), visited = new Set()) {
        if (currentDepth > maxDepth || !dogId || visited.has(dogId)) {
            return result;
        }
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        visited.add(dogId);
        
        // Voeg ouders toe aan resultaat
        if (dog.vaderId) {
            result.set(dog.vaderId, currentDepth + 1);
            this._getAncestorsWithDistance(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        if (dog.moederId) {
            result.set(dog.moederId, currentDepth + 1);
            this._getAncestorsWithDistance(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    // Helper functie om voorouders te tellen
    countAncestors(dogId, depth) {
        const ancestors = this._getAncestorsWithDistance(dogId, depth);
        return ancestors.size;
    }

    // DEBUG: Toon gemeenschappelijke voorouders
    showCommonAncestors(id1, id2, depth = 5) {
        const ancestors1 = this._getAncestorsWithDistance(id1, depth);
        const ancestors2 = this._getAncestorsWithDistance(id2, depth);
        
        console.log(`\n=== Gemeenschappelijke voorouders ===`);
        console.log(`ID ${id1}: ${ancestors1.size} voorouders`);
        console.log(`ID ${id2}: ${ancestors2.size} voorouders`);
        
        const common = [];
        for (const [ancestorId, dist1] of ancestors1) {
            const dist2 = ancestors2.get(ancestorId);
            if (dist2 !== undefined) {
                const ancestor = this.getDogById(ancestorId);
                common.push({
                    id: ancestorId,
                    naam: ancestor?.naam || 'Onbekend',
                    dist1: dist1,
                    dist2: dist2,
                    bijdrage: Math.pow(0.5, dist1 + dist2 + 1) * 100
                });
            }
        }
        
        console.log(`${common.length} gemeenschappelijke voorouders:`);
        common.forEach(a => {
            console.log(`  ${a.naam} (ID: ${a.id}):`);
            console.log(`    Afstand via eerste: ${a.dist1}, via tweede: ${a.dist2}`);
            console.log(`    Bijdrage: ${a.bijdrage.toFixed(2)}%`);
        });
        
        return common;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator geladen - Volledig werkend bestand');
}

// Gebruiksvoorbeelden (optioneel):
// const calc = new COICalculator(allDogs);
// 
// // Bereken COI
// const result = calc.calculateCOI(27); // Droll
// console.log("Droll COI:", result);
// 
// // Debug gemeenschappelijke voorouders
// calc.showCommonAncestors(8, 9, 5); // Brumbo en Berit
// 
// // Tel voorouders
// const count = calc.countAncestors(68, 6); // Katinka
// console.log(`Katinka heeft ${count} unieke voorouders in 6 generaties`);