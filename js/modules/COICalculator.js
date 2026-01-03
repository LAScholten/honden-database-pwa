// COICalculator V6 - SIMPEL EN CORRECT
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) this._dogMap.set(Number(dog.id), dog);
        });
        console.log(`✅ COICalculator V6: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            const dog = this.getDogById(dogId);
            if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
            
            console.log(`🔍 COI voor: ${dog.naam} (ID: ${dog.id})`);
            
            // Basisgevallen
            if (!dog.vaderId || !dog.moederId) {
                return { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            if (dog.vaderId === dog.moederId) {
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            // ✅ Simpele detectie broer/zus
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (vader && moeder && 
                vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
                vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
                // VOLLE BROER/ZUS
                console.log(`   ➡ Ouders zijn volle broer/zus -> 25%`);
                return { coi6Gen: '25.0', coiAllGen: '25.0' };
            }
            
            if ((vader && moeder && vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
                (vader && moeder && vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
                // HALF BROER/ZUS
                console.log(`   ➡ Ouders zijn half broer/zus -> 12.5%`);
                return { coi6Gen: '12.5', coiAllGen: '12.5' };
            }
            
            // Complexe gevallen - gebruik eenvoudige berekening
            const coi6Gen = this._calculateSimpleCOI(dogId, 6);
            const coiAllGen = this._calculateSimpleCOI(dogId, 10); // 10 generaties is voldoende
            
            return {
                coi6Gen: (coi6Gen * 100).toFixed(1),
                coiAllGen: (coiAllGen * 100).toFixed(1)
            };
            
        } catch (error) {
            console.error('❌ Fout:', error);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
    }

    _calculateSimpleCOI(dogId, maxDepth) {
        if (!dogId || maxDepth <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Recursief alle paden vinden
        const paths = [];
        this._findCommonAncestorPaths(dog.vaderId, dog.moederId, maxDepth, [], [], paths);
        
        if (paths.length === 0) return 0;
        
        // Bereken COI voor elk pad
        let totalCOI = 0;
        for (const path of paths) {
            // path = {vaderPath: [id1, id2...], moederPath: [id3, id4...]}
            const n1 = path.vaderPath.length;
            const n2 = path.moederPath.length;
            totalCOI += Math.pow(0.5, n1 + n2 + 1);
        }
        
        return totalCOI;
    }

    _findCommonAncestorPaths(id1, id2, maxDepth, path1, path2, results) {
        if (maxDepth <= 0) return;
        
        const dog1 = this.getDogById(id1);
        const dog2 = this.getDogById(id2);
        if (!dog1 || !dog2) return;
        
        // Check of dit dezelfde hond is (gemeenschappelijke voorouder)
        if (id1 === id2) {
            results.push({
                vaderPath: [...path1],
                moederPath: [...path2],
                commonAncestor: id1
            });
            return;
        }
        
        // Ga dieper - maximale 2 takken per kant
        if (dog1.vaderId) {
            this._findCommonAncestorPaths(
                dog1.vaderId, id2, maxDepth - 1, 
                [...path1, dog1.vaderId], path2, results
            );
        }
        
        if (dog1.moederId) {
            this._findCommonAncestorPaths(
                dog1.moederId, id2, maxDepth - 1, 
                [...path1, dog1.moederId], path2, results
            );
        }
        
        if (dog2.vaderId) {
            this._findCommonAncestorPaths(
                id1, dog2.vaderId, maxDepth - 1, 
                path1, [...path2, dog2.vaderId], results
            );
        }
        
        if (dog2.moederId) {
            this._findCommonAncestorPaths(
                id1, dog2.moederId, maxDepth - 1, 
                path1, [...path2, dog2.moederId], results
            );
        }
    }
}

if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V6 geladen - eenvoudige correcte berekening');
}