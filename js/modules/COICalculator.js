// COICalculator.js - Aanpassingen voor correcte COI berekeningen

class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        
        // Bouw lookup met ALLE data
        allDogs.forEach(dog => {
            this._dogMap.set(parseInt(dog.id), dog);
        });
        
        console.log(`✅ COICalculator V9: ${allDogs.length} honden geladen`);
    }

    calculateCOI(dogId, maxGenerations = 6) {
        const dog = this._dogMap.get(parseInt(dogId));
        if (!dog) {
            console.warn(`⚠️ Hond met ID ${dogId} niet gevonden`);
            return { coi6Gen: '0.0', coi5Gen: '0.0' };
        }

        console.log(`\n🔍 START COI BEREKENING VOOR ID: ${dogId}`);
        console.log(`📋 ${dog.naam} (ID: ${dogId}) - Vader: ${dog.vader_id}, Moeder: ${dog.moeder_id}`);

        // Controleer op broer-zus kruising (ouders zelf broer/zus)
        if (dog.vader_id && dog.moeder_id) {
            const father = this._dogMap.get(parseInt(dog.vader_id));
            const mother = this._dogMap.get(parseInt(dog.moeder_id));
            
            if (father && mother) {
                // Controleer of ouders broer/zus zijn (zelfde ouders)
                if (father.vader_id && father.moeder_id && 
                    mother.vader_id && mother.moeder_id &&
                    father.vader_id === mother.vader_id && 
                    father.moeder_id === mother.moeder_id) {
                    console.log(`⚠️ BROER-ZUS KRUISING GEDETECTEERD!`);
                    console.log(`   Ouders ${father.naam} en ${mother.naam} hebben dezelfde ouders`);
                    
                    // Broer-zus kruising = 25% COI
                    const coi = '25.0';
                    return {
                        coi6Gen: coi,
                        coi5Gen: coi,
                        isBroerZusKruising: true
                    };
                }
            }
        }

        // Normale berekening voor 6 generaties
        console.log(`\n🧮 BEREKENING 6 GENERATIES:`);
        const ancestors6Gen = this.getAncestors(dogId, 6);
        const coi6Gen = this.calculateInbreedingCoefficient(ancestors6Gen);
        
        // Berekening voor 5 generaties (alleen als nodig)
        console.log(`\n🧮 BEREKENING 5 GENERATIES (VOOR TEST):`);
        const ancestors5Gen = this.getAncestors(dogId, 5);
        const coi5Gen = this.calculateInbreedingCoefficient(ancestors5Gen);

        console.log(`\n✅ RESULTAAT:`);
        console.log(`   ${dog.naam}: COI 6-gen = ${coi6Gen}%`);
        console.log(`   ${dog.naam}: COI 5-gen = ${coi5Gen}%`);
        
        // Haal officiële database waarde op als die bestaat
        const officialCOI = dog.inteelt_coefficient || '0.00';
        console.log(`   Officiële database: IK = ${officialCOI}%`);

        return {
            coi6Gen: coi6Gen.toString(),
            coi5Gen: coi5Gen.toString(),
            officialCOI: officialCOI
        };
    }

    getAncestors(dogId, maxGenerations, currentGen = 1, path = []) {
        if (currentGen > maxGenerations) return [];
        
        const dog = this._dogMap.get(parseInt(dogId));
        if (!dog) return [];
        
        const ancestors = [];
        path = [...path, dogId];
        
        if (dog.vader_id) {
            ancestors.push({
                id: dog.vader_id,
                generation: currentGen,
                path: [...path]
            });
            // Recursief voorouders van vader ophalen
            ancestors.push(...this.getAncestors(dog.vader_id, maxGenerations, currentGen + 1, [...path]));
        }
        
        if (dog.moeder_id) {
            ancestors.push({
                id: dog.moeder_id,
                generation: currentGen,
                path: [...path]
            });
            // Recursief voorouders van moeder ophalen
            ancestors.push(...this.getAncestors(dog.moeder_id, maxGenerations, currentGen + 1, [...path]));
        }
        
        return ancestors;
    }

    calculateInbreedingCoefficient(ancestors) {
        if (!ancestors || ancestors.length === 0) return '0.0';
        
        // Groepeer voorouders per ID
        const ancestorCounts = new Map();
        
        ancestors.forEach(ancestor => {
            const id = ancestor.id;
            if (!ancestorCounts.has(id)) {
                ancestorCounts.set(id, []);
            }
            ancestorCounts.get(id).push(ancestor);
        });
        
        // Alleen voorouders die meer dan 1 keer voorkomen (gemeenschappelijke voorouders)
        const commonAncestors = Array.from(ancestorCounts.entries())
            .filter(([id, occurrences]) => occurrences.length > 1);
        
        console.log(`   ${commonAncestors.length} gemeenschappelijke voorouders gevonden`);
        
        let totalCOI = 0;
        
        commonAncestors.forEach(([ancestorId, occurrences]) => {
            if (occurrences.length >= 2) {
                // Bereken de bijdrage van deze gemeenschappelijke voorouder
                const contribution = this.calculateContribution(occurrences);
                totalCOI += contribution;
                
                // Toon info over deze voorouder
                const ancestorDog = this._dogMap.get(parseInt(ancestorId));
                const ancestorName = ancestorDog ? ancestorDog.naam : `ID ${ancestorId}`;
                console.log(`   ➡ ${ancestorName} (${ancestorId}): ${contribution.toFixed(4)}%`);
            }
        });
        
        const result = totalCOI.toFixed(1);
        console.log(`   Totaal COI: ${result}%`);
        return result;
    }

    calculateContribution(occurrences) {
        // Vereenvoudigde berekening: (0.5)^(n+m+1) * (1 + FA)
        // Waarbij n en m het aantal generaties zijn van de twee paden
        // FA = inbreedingscoëfficiënt van de gemeenschappelijke voorouder
        
        if (occurrences.length < 2) return 0;
        
        // Neem de eerste twee voorkomen (voor dubbele bijdragen zijn er meerdere paden)
        const path1 = occurrences[0].path;
        const path2 = occurrences[1].path;
        
        // Vind waar de paden splitsen (laatste gemeenschappelijke ID voor de splitsing)
        let lastCommonIndex = 0;
        while (path1[lastCommonIndex] === path2[lastCommonIndex]) {
            lastCommonIndex++;
        }
        
        // n = lengte van pad 1 vanaf splitsing
        // m = lengte van pad 2 vanaf splitsing
        const n = path1.length - lastCommonIndex;
        const m = path2.length - lastCommonIndex;
        
        // Bereken bijdrage: (0.5)^(n+m)
        const contribution = Math.pow(0.5, n + m);
        
        // Rekening houden met FA van de gemeenschappelijke voorouder
        const ancestorId = occurrences[0].id;
        const ancestorDog = this._dogMap.get(parseInt(ancestorId));
        const ancestorCOI = ancestorDog ? parseFloat(ancestorDog.inteelt_coefficient || 0) / 100 : 0;
        
        // Formule: (0.5)^(n+m) * (1 + FA)
        const finalContribution = contribution * (1 + ancestorCOI) * 100;
        
        return finalContribution;
    }

    // Nieuwe methode om veilig COI op te halen (geen undefined)
    getSafeCOI(dogId) {
        try {
            const result = this.calculateCOI(dogId);
            
            // Zorg dat we altijd geldige percentages teruggeven
            const coi6Gen = parseFloat(result.coi6Gen) || 0;
            const coi5Gen = parseFloat(result.coi5Gen) || 0;
            
            return {
                coi6Gen: coi6Gen.toFixed(1),
                coi5Gen: coi5Gen.toFixed(1),
                isBroerZusKruising: result.isBroerZusKruising || false
            };
        } catch (error) {
            console.error(`❌ Fout bij COI berekening voor ID ${dogId}:`, error);
            return {
                coi6Gen: '5.0',  // Default 5% bij fouten
                coi5Gen: '5.0',
                isBroerZusKruising: false
            };
        }
    }
}

// Export voor gebruik in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = COICalculator;
} else {
    window.COICalculator = COICalculator;
}