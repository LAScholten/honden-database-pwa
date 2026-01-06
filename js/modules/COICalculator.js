// COICalculator FINAL - ECHTE BEREKENING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        
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
            const dog = this.getDogById(dogId);
            if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            console.log(`🔍 COI berekening voor: ${dog.naam} (ID: ${dog.id})`);
            
            // BEREKEN OP BASIS VAN ECHTE FORMULE
            const coi6Gen = this._calculateRealCOI(dogId, 6);
            const coiAllGen = this._calculateRealCOI(dogId, 10);
            
            const result = {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
            console.log(`✅ ${dog.naam}: COI 6-gen = ${result.coi6Gen}%, All-gen = ${result.coiAllGen}%`);
            return result;
            
        } catch (error) {
            console.error('Fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateRealCOI(dogId, generations) {
        if (generations <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        if (dog.vaderId === dog.moederId) return 0.25;
        
        // Vind gemeenschappelijke voorouders
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        
        let totalCOI = 0;
        
        for (const ancestorId of commonAncestors) {
            // Bereken afstanden
            const distVader = this._getDistance(dog.vaderId, ancestorId, generations - 1);
            const distMoeder = this._getDistance(dog.moederId, ancestorId, generations - 1);
            
            if (distVader > 0 && distMoeder > 0) {
                // WRIGHT'S FORMULE: (0.5)^(n1 + n2 + 1)
                totalCOI += Math.pow(0.5, distVader + distMoeder + 1);
            }
        }
        
        return totalCOI;
    }

    _findCommonAncestors(id1, id2, depth) {
        if (depth <= 0) return new Set();
        
        const ancestors1 = this._getAncestors(id1, depth);
        const ancestors2 = this._getAncestors(id2, depth);
        
        const common = new Set();
        for (const ancestor of ancestors1) {
            if (ancestors2.has(ancestor)) {
                common.add(ancestor);
            }
        }
        
        return common;
    }

    _getAncestors(dogId, depth, result = new Set()) {
        if (depth <= 0 || !dogId) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            result.add(dog.vaderId);
            this._getAncestors(dog.vaderId, depth - 1, result);
        }
        
        if (dog.moederId) {
            result.add(dog.moederId);
            this._getAncestors(dog.moederId, depth - 1, result);
        }
        
        return result;
    }

    _getDistance(startId, targetId, maxDepth, currentDepth = 0) {
        if (currentDepth > maxDepth) return -1;
        if (startId === targetId) return currentDepth;
        
        const dog = this.getDogById(startId);
        if (!dog) return -1;
        
        let minDistance = -1;
        
        if (dog.vaderId) {
            const dist = this._getDistance(dog.vaderId, targetId, maxDepth, currentDepth + 1);
            if (dist > 0 && (minDistance === -1 || dist < minDistance)) {
                minDistance = dist;
            }
        }
        
        if (dog.moederId) {
            const dist = this._getDistance(dog.moederId, targetId, maxDepth, currentDepth + 1);
            if (dist > 0 && (minDistance === -1 || dist < minDistance)) {
                minDistance = dist;
            }
        }
        
        return minDistance;
    }

    // DEBUG FUNCTIE
    debugCalculation(dogId, generations = 6) {
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        console.log(`\n=== DEBUG: ${dog.naam} (ID: ${dogId}) ===`);
        
        if (!dog.vaderId || !dog.moederId) {
            console.log("Geen ouders -> 0%");
            return;
        }
        
        if (dog.vaderId === dog.moederId) {
            console.log("Zelfde ouders -> 25%");
            return;
        }
        
        const commonAncestors = this._findCommonAncestors(dog.vaderId, dog.moederId, generations - 1);
        console.log(`${commonAncestors.size} gemeenschappelijke voorouders:`);
        
        let total = 0;
        for (const ancestorId of commonAncestors) {
            const ancestor = this.getDogById(ancestorId);
            const distVader = this._getDistance(dog.vaderId, ancestorId, generations - 1);
            const distMoeder = this._getDistance(dog.moederId, ancestorId, generations - 1);
            
            if (distVader > 0 && distMoeder > 0) {
                const contribution = Math.pow(0.5, distVader + distMoeder + 1);
                console.log(`  ${ancestor?.naam}: n1=${distVader}, n2=${distMoeder} -> ${(contribution*100).toFixed(2)}%`);
                total += contribution;
            }
        }
        
        console.log(`TOTAAL: ${(total*100).toFixed(1)}%`);
    }
}

// Test functie
function testCOICalculator() {
    console.log("🧪 COI TEST:");
    
    // Test 1: Broer/zus paring
    const dogs1 = [
        { id: 1, naam: "Ouder A", vaderId: null, moederId: null },
        { id: 2, naam: "Ouder B", vaderId: null, moederId: null },
        { id: 3, naam: "Broer", vaderId: 1, moederId: 2 },
        { id: 4, naam: "Zus", vaderId: 1, moederId: 2 },
        { id: 5, naam: "Pup", vaderId: 3, moederId: 4 }
    ];
    
    const calc1 = new COICalculator(dogs1);
    const result1 = calc1.calculateCOI(5);
    console.log(`Broer/zus: ${result1.coi6Gen}% (moet 25.0% zijn)`);
    calc1.debugCalculation(5);
    
    // Test 2: Half broer/zus
    const dogs2 = [
        { id: 10, naam: "Gemeenschappelijk", vaderId: null, moederId: null },
        { id: 11, naam: "Partner A", vaderId: null, moederId: null },
        { id: 12, naam: "Partner B", vaderId: null, moederId: null },
        { id: 13, naam: "HalfBroer", vaderId: 10, moederId: 11 },
        { id: 14, naam: "HalfZus", vaderId: 10, moederId: 12 },
        { id: 15, naam: "Pup", vaderId: 13, moederId: 14 }
    ];
    
    const calc2 = new COICalculator(dogs2);
    const result2 = calc2.calculateCOI(15);
    console.log(`\nHalf broer/zus: ${result2.coi6Gen}% (moet 12.5% zijn)`);
    calc2.debugCalculation(15);
    
    // Test 3: Oom/nicht
    const dogs3 = [
        { id: 20, naam: "Grootvader", vaderId: null, moederId: null },
        { id: 21, naam: "Partner 1", vaderId: null, moederId: null },
        { id: 22, naam: "Partner 2", vaderId: null, moederId: null },
        { id: 23, naam: "Oom", vaderId: 20, moederId: 21 },
        { id: 24, naam: "Nicht", vaderId: 20, moederId: 22 },
        { id: 25, naam: "Pup", vaderId: 23, moederId: 24 }
    ];
    
    const calc3 = new COICalculator(dogs3);
    const result3 = calc3.calculateCOI(25);
    console.log(`\nOom/nicht: ${result3.coi6Gen}% (moet 12.5% zijn)`);
    calc3.debugCalculation(25);
    
    console.log("\n✅ Test klaar");
}

// Maak beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    window.testCOICalculator = testCOICalculator;
    console.log('✅ COICalculator geladen');
}