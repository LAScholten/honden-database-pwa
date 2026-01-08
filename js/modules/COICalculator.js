// COICalculator SIMPLE & CORRECT
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator SIMPLE: ${this._dogMap.size} honden`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        dogId = Number(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        console.log(`\n🔍 COI voor: ${dog.naam} (ID: ${dog.id})`);
        
        // ✅ SIMPELE BEREKENING zoals officiële tabel
        const resultWithoutIK = this._calculateLikeOfficialTable(dogId, 6, false);
        const resultWithIK = this._calculateLikeOfficialTable(dogId, 6, true);
        
        const result = {
            coi6Gen: (resultWithIK * 100).toFixed(2),
            coiAllGen: (resultWithIK * 100).toFixed(2), // Voor nu hetzelfde
            withoutAncestorIK: (resultWithoutIK * 100).toFixed(2),
            withAncestorIK: (resultWithIK * 100).toFixed(2)
        };
        
        console.log(`\n✅ RESULTAAT:`);
        console.log(`   Zonder voorouder-IK: ${result.withoutAncestorIK}%`);
        console.log(`   Met voorouder-IK: ${result.withAncestorIK}%`);
        console.log(`   Officieel: 7.42% / 7.70%`);
        
        return result;
    }

    // ✅ BEREKEN ZOALS OFFICIËLE TABEL
    _calculateLikeOfficialTable(dogId, maxDepth, includeAncestorIK) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Vind alle voorouders van vader
        const vaderAncestors = this._getAllAncestors(dog.vaderId, maxDepth);
        const moederAncestors = this._getAllAncestors(dog.moederId, maxDepth);
        
        let total = 0;
        
        // Voor elke gemeenschappelijke voorouder
        for (const ancestorId of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                // Vind ALLE paden
                const pathsVader = this._findAllPathsSimple(dog.vaderId, ancestorId, maxDepth);
                const pathsMoeder = this._findAllPathsSimple(dog.moederId, ancestorId, maxDepth);
                
                // Voor ELKE combinatie
                for (const pathV of pathsVader) {
                    const n = pathV.length;
                    
                    for (const pathM of pathsMoeder) {
                        const m = pathM.length;
                        
                        // ✅ OFFICIËLE FORMULE: (0.5)^(n+m)
                        const base = Math.pow(0.5, n + m);
                        
                        let contribution = base;
                        
                        if (includeAncestorIK) {
                            // ✅ Voorouder COI toevoegen (niet recursief!)
                            // In officiële tabel: ze gebruiken VOORBEREKENDE IK waarden
                            const ancestor = this.getDogById(ancestorId);
                            if (ancestor && ancestor.ik) {
                                const F_a = ancestor.ik / 100;
                                contribution = base * (1 + F_a);
                            }
                        }
                        
                        total += contribution;
                    }
                }
            }
        }
        
        return total;
    }

    // ✅ SIMPELE pad-finding (zonder complexe recursie)
    _findAllPathsSimple(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allPaths = []) {
        if (!startId || currentDepth > maxDepth) return allPaths;
        
        if (startId === targetId) {
            allPaths.push([...currentPath]);
            return allPaths;
        }
        
        const dog = this.getDogById(startId);
        if (!dog) return allPaths;
        
        if (dog.vaderId) {
            currentPath.push(dog.vaderId);
            this._findAllPathsSimple(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths);
            currentPath.pop();
        }
        
        if (dog.moederId) {
            currentPath.push(dog.moederId);
            this._findAllPathsSimple(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allPaths);
            currentPath.pop();
        }
        
        return allPaths;
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

    // ✅ DEBUG: Toon hoe ANJA 6x voorkomt
    debugAnjaContributions(dogId) {
        console.log(`\n🔬 DEBUG ANJA BIJDRAGEN:`);
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return;
        
        const anjaId = 193; // ANJA ID uit jouw database
        const pathsVader = this._findAllPathsSimple(dog.vaderId, anjaId, 6);
        const pathsMoeder = this._findAllPathsSimple(dog.moederId, anjaId, 6);
        
        console.log(`   Paden via vader naar ANJA: ${pathsVader.length}`);
        console.log(`   Paden via moeder naar ANJA: ${pathsMoeder.length}`);
        console.log(`   Totale combinaties: ${pathsVader.length * pathsMoeder.length}`);
        
        // Bereken elke bijdrage
        let anjaTotal = 0;
        console.log(`\n   Individuele bijdragen:`);
        
        pathsVader.forEach((pathV, i) => {
            const n = pathV.length;
            
            pathsMoeder.forEach((pathM, j) => {
                const m = pathM.length;
                const contribution = Math.pow(0.5, n + m);
                anjaTotal += contribution;
                
                console.log(`   Route ${i+1}-${j+1}: n=${n}, m=${m} = ${(contribution*100).toFixed(5)}%`);
            });
        });
        
        console.log(`\n   TOTAAL ANJA: ${(anjaTotal*100).toFixed(5)}%`);
        console.log(`   Officieel: 3.51563%`);
    }

    // ✅ VERGELIJK MET OFFICIËLE TABEL
    compareWithOfficial(dogId) {
        console.log(`\n📊 VERGELIJKING MET OFFICIËLE TABEL:`);
        
        // Officiële getallen uit de tabel
        const official = {
            anja: 3.51563,
            aina: 0.58594, // 4 routes: 2x0.19531 + 1x0.09766 + 1x0.09766
            astor: 0.58594,
            aBonzo: 0.58594,
            cito: 0.78125,
            cinok: 0.39063,
            daiane: 0.09766,
            jago: 0.04883,
            droll: 0.14648
        };
        
        const totalOfficial = Object.values(official).reduce((a, b) => a + b, 0);
        console.log(`   Officieel totaal zonder IK: ${totalOfficial.toFixed(5)}%`);
        console.log(`   Officieel totaal met IK: 7.70369%`);
        
        // Onze berekening
        const ourWithoutIK = this._calculateLikeOfficialTable(dogId, 6, false);
        const ourWithIK = this._calculateLikeOfficialTable(dogId, 6, true);
        
        console.log(`\n   Onze berekening:`);
        console.log(`   Zonder IK: ${(ourWithoutIK*100).toFixed(5)}%`);
        console.log(`   Met IK: ${(ourWithIK*100).toFixed(5)}%`);
        
        console.log(`\n   Verschillen:`);
        console.log(`   Zonder IK: ${((ourWithoutIK*100) - totalOfficial).toFixed(5)}%`);
        console.log(`   Met IK: ${((ourWithIK*100) - 7.70369).toFixed(5)}%`);
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator SIMPLE geladen (officiële methode)');
}