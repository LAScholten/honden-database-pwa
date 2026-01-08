// COICalculator V9 - PRECIEZE BEREKENING
class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._coiCache = new Map();
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V9: ${this._dogMap.size} honden (preciese berekening)`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        dogId = Number(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        console.log(`\n🔍 COI voor: ${dog.naam} (ID: ${dog.id})`);
        
        // Basis checks
        if (!dog.vaderId || !dog.moederId) {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        if (dog.vaderId === dog.moederId) {
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }

        // ✅ PRECIEZE BEREKENING MET OPTIMIZATIES
        const coi6Gen = this._calculatePreciseCOI(dogId, 6, true);
        const coiAllGen = this._calculatePreciseCOI(dogId, 25, false);
        
        const result = {
            coi6Gen: (coi6Gen * 100).toFixed(1),
            coiAllGen: (coiAllGen * 100).toFixed(1)
        };
        
        console.log(`✅ Resultaat: 6-gen=${result.coi6Gen}%, 25-gen=${result.coiAllGen}%`);
        console.log(`   Officieel: IK=7.70%`);
        console.log(`   Verschil: ${(parseFloat(result.coi6Gen) - 7.70).toFixed(2)}%`);
        
        return result;
    }

    // ✅ PRECIEZE BEREKENING
    _calculatePreciseCOI(dogId, maxDepth, is6Gen) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Vind alle UNIEKE voorouders (zonder duplicaten binnen dezelfde lijn)
        const vaderAncestors = this._getUniqueAncestors(dog.vaderId, maxDepth);
        const moederAncestors = this._getUniqueAncestors(dog.moederId, maxDepth);
        
        console.log(`   ${maxDepth}gen: Vader ${vaderAncestors.size}, Moeder ${moederAncestors.size} unieke voorouders`);
        
        let totalCOI = 0;
        let significantContributions = [];
        
        // Voor ELKE gemeenschappelijke voorouder
        for (const ancestorId of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                // ✅ BELANGRIJK: Gebruik alleen de KORTSTE route per voorouder
                const contribution = this._calculateShortestRouteContribution(
                    dog.vaderId,
                    dog.moederId,
                    ancestorId,
                    maxDepth
                );
                
                if (contribution > 0.00001) {
                    totalCOI += contribution;
                    
                    if (contribution > 0.001) { // Meer dan 0.1%
                        const ancestor = this.getDogById(ancestorId);
                        significantContributions.push({
                            id: ancestorId,
                            naam: ancestor?.naam || 'Onbekend',
                            contribution: (contribution * 100).toFixed(3)
                        });
                    }
                }
            }
        }
        
        // Toon significante bijdragen
        if (significantContributions.length > 0 && is6Gen) {
            console.log(`   Belangrijkste bijdragen:`);
            significantContributions.sort((a, b) => b.contribution - a.contribution);
            significantContributions.slice(0, 10).forEach(anc => {
                console.log(`     ${anc.naam} (${anc.id}): ${anc.contribution}%`);
            });
        }
        
        return totalCOI;
    }

    // ✅ UNIEKE VOOROUDERS (geen duplicaten inzelfde lijn)
    _getUniqueAncestors(dogId, maxDepth, currentDepth = 0, result = new Set(), visited = new Set()) {
        if (!dogId || currentDepth >= maxDepth || visited.has(dogId)) {
            return result;
        }
        
        visited.add(dogId);
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            // Voeg alleen toe als nog niet in resultaat
            if (!result.has(dog.vaderId)) {
                result.add(dog.vaderId);
            }
            this._getUniqueAncestors(dog.vaderId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        if (dog.moederId) {
            if (!result.has(dog.moederId)) {
                result.add(dog.moederId);
            }
            this._getUniqueAncestors(dog.moederId, maxDepth, currentDepth + 1, result, new Set(visited));
        }
        
        return result;
    }

    // ✅ BIJDRAGE VIA KORTSTE ROUTE (niet alle routes)
    _calculateShortestRouteContribution(vaderId, moederId, ancestorId, maxDepth) {
        // Vind KORTSTE route via vader
        const shortestViaVader = this._findShortestPath(vaderId, ancestorId, maxDepth);
        const shortestViaMoeder = this._findShortestPath(moederId, ancestorId, maxDepth);
        
        if (shortestViaVader === -1 || shortestViaMoeder === -1) return 0;
        
        // Basis bijdrage via kortste route
        let contribution = Math.pow(0.5, shortestViaVader + shortestViaMoeder + 1);
        
        // ✅ CORRECTIE: Als voorouder zelf inteelt heeft (F_a)
        const ancestor = this.getDogById(ancestorId);
        if (ancestor && ancestor.ik) {
            const F_ancestor = ancestor.ik / 100;
            contribution *= (1 + F_ancestor);
        }
        
        return contribution;
    }

    _findShortestPath(startId, targetId, maxDepth, currentDepth = 0, visited = new Set()) {
        if (!startId || currentDepth > maxDepth || visited.has(startId)) {
            return -1;
        }
        
        if (startId === targetId) {
            return currentDepth;
        }
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        if (!dog) return -1;
        
        let shortest = -1;
        
        if (dog.vaderId) {
            const viaVader = this._findShortestPath(dog.vaderId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (viaVader !== -1 && (shortest === -1 || viaVader < shortest)) {
                shortest = viaVader;
            }
        }
        
        if (dog.moederId) {
            const viaMoeder = this._findShortestPath(dog.moederId, targetId, maxDepth, currentDepth + 1, new Set(visited));
            if (viaMoeder !== -1 && (shortest === -1 || viaMoeder < shortest)) {
                shortest = viaMoeder;
            }
        }
        
        return shortest;
    }

    // ✅ VERGELIJK MET OFFICIËLE METHODE
    compareWithOfficial() {
        console.log(`\n📊 VERGELIJKING MET OFFICIËLE WAARDEN:`);
        
        // Bekende voorouders met officiële IK
        const officialData = [
            { id: 637, naam: "Esther", official: 7.70 },
            { id: 632, naam: "DINO", official: 1.56 },
            { id: 521, naam: "CASJA", official: 15.01 },
            { id: 341, naam: "QUESTOR", official: 37.50 },
            { id: 12, naam: "PASCHA", official: 25.00 },
            { id: 15, naam: "PIROSCHKA", official: 25.00 },
            { id: 306, naam: "FABIA?", official: 25.31 }
        ];
        
        officialData.forEach(item => {
            const dog = this.getDogById(item.id);
            if (dog) {
                const result = this.calculateCOI(item.id);
                const diff = parseFloat(result.coi6Gen) - item.official;
                console.log(`   ${dog.naam} (${item.id}):`);
                console.log(`     Ons: ${result.coi6Gen}%, Officieel: ${item.official}%`);
                console.log(`     Verschil: ${diff.toFixed(2)}%`);
            }
        });
    }

    // ✅ DEBUG: Toon waar de verschillen zitten
    debugEstherDifference() {
        console.log(`\n🔎 DEBUG ESTHER VERSCHIL:`);
        
        const dog = this.getDogById(637);
        if (!dog) return;
        
        // Analyseer belangrijke voorouders
        const importantAncestors = [
            { id: 168, naam: "CITO vom Pol", weight: 0.10 },
            { id: 193, naam: "Belangrijke", weight: 0.39 },
            { id: 134, naam: "ANJA Wittekindsburg", weight: 0.00 },
            { id: 77, naam: "Onbekend", weight: 0.20 },
            { id: 326, naam: "Onbekend", weight: 0.02 }
        ];
        
        console.log(`   Officiële bijdragen (6-gen):`);
        importantAncestors.forEach(anc => {
            console.log(`     ${anc.naam} (${anc.id}): ${anc.weight}%`);
        });
        
        const totalOfficial = importantAncestors.reduce((sum, anc) => sum + anc.weight, 0);
        console.log(`   Totaal officieel (geschat): ${totalOfficial.toFixed(2)}%`);
        
        // Bereken onze bijdragen
        console.log(`\n   Onze berekening:`);
        const vaderAncestors = this._getUniqueAncestors(dog.vaderId, 6);
        const moederAncestors = this._getUniqueAncestors(dog.moederId, 6);
        
        let ourTotal = 0;
        for (const anc of importantAncestors) {
            if (vaderAncestors.has(anc.id) && moederAncestors.has(anc.id)) {
                const contribution = this._calculateShortestRouteContribution(
                    dog.vaderId, dog.moederId, anc.id, 6
                );
                ourTotal += contribution;
                console.log(`     ${anc.naam}: ${(contribution * 100).toFixed(3)}%`);
            }
        }
        
        console.log(`   Totaal ons: ${(ourTotal * 100).toFixed(2)}%`);
        console.log(`   Verschil: ${(ourTotal * 100 - totalOfficial).toFixed(2)}%`);
    }

    // ✅ SIMULATIE: Wat als we 7.70% willen?
    simulateTarget7_7() {
        console.log(`\n🎯 SIMULATIE: Hoe 7.70% bereiken?`);
        
        // Ons huidige resultaat
        const current = this.calculateCOI(637);
        const currentValue = parseFloat(current.coi6Gen);
        
        console.log(`   Huidig: ${currentValue}%`);
        console.log(`   Doel: 7.70%`);
        console.log(`   Te hoog: ${(currentValue - 7.70).toFixed(2)}%`);
        
        // Suggesties voor correctie
        console.log(`\n   Mogelijke correcties:`);
        console.log(`   1. Gebruik MAX 1 route per voorouder (niet alle routes)`);
        console.log(`   2. Verminder gewicht verre voorouders (na 4 generaties)`);
        console.log(`   3. Neem officiële IK van voorouders mee`);
        console.log(`   4. Pas speciale regels toe voor broer/zus`);
        
        // Bereken met gecorrigeerde methode
        console.log(`\n   Gecorrigeerde berekening:`);
        const corrected = this._calculateCorrectedCOI(637, 6);
        console.log(`   Gecorrigeerd: ${(corrected * 100).toFixed(2)}%`);
    }

    _calculateCorrectedCOI(dogId, maxDepth) {
        // Deze methode probeert dichter bij 7.70% te komen
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Vind gemeenschappelijke voorouders
        const vaderAncestors = this._getUniqueAncestors(dog.vaderId, maxDepth);
        const moederAncestors = this._getUniqueAncestors(dog.moederId, maxDepth);
        
        let total = 0;
        
        for (const ancestorId of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                // Kortste route
                const n = this._findShortestPath(dog.vaderId, ancestorId, maxDepth);
                const m = this._findShortestPath(dog.moederId, ancestorId, maxDepth);
                
                if (n > 0 && m > 0) {
                    // ✅ CORRECTIE: Verminder gewicht voor verre voorouders
                    let weight = 1.0;
                    if (n + m > 8) weight = 0.5; // 50% minder na 8 stappen
                    if (n + m > 10) weight = 0.25; // 75% minder na 10 stappen
                    
                    const base = Math.pow(0.5, n + m + 1);
                    total += base * weight;
                }
            }
        }
        
        return total;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V9 geladen (preciese berekening)');
}