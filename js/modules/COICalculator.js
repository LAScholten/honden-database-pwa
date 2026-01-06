// EENVOUDIGE COI BEREKENING
function calculateSimpleCOI(dog, allDogs, generations) {
    if (!dog.vaderId || !dog.moederId) return 0;
    if (dog.vaderId === dog.moederId) return 0.25;
    
    const vader = allDogs.find(d => d.id === dog.vaderId);
    const moeder = allDogs.find(d => d.id === dog.moederId);
    
    if (!vader || !moeder) return 0;
    
    // Check of ouders broer/zus zijn
    if (vader.vaderId === moeder.vaderId && vader.moederId === moeder.moederId) {
        // Broer/zus paring
        const fVader = calculateSimpleCOI(vader, allDogs, generations - 1);
        const fMoeder = calculateSimpleCOI(moeder, allDogs, generations - 1);
        return 0.25 * (1 + (fVader + fMoeder) / 2);
    }
    
    // Voor complexere gevallen, gebruik recursie
    return 0.5 * calculateRelationship(vader, moeder, allDogs, generations - 1);
}

function calculateRelationship(dog1, dog2, allDogs, generations) {
    if (generations <= 0) return 0;
    
    // Als ze dezelfde hond zijn
    if (dog1.id === dog2.id) return 1;
    
    // Ouder-kind relatie
    if (dog1.vaderId === dog2.id || dog1.moederId === dog2.id ||
        dog2.vaderId === dog1.id || dog2.moederId === dog1.id) {
        return 0.5;
    }
    
    // Broer/zus
    if (dog1.vaderId === dog2.vaderId && dog1.moederId === dog2.moederId) {
        return 0.5;
    }
    
    // Recursief bereken
    let relationship = 0;
    
    const vader1 = allDogs.find(d => d.id === dog1.vaderId);
    const moeder1 = allDogs.find(d => d.id === dog1.moederId);
    const vader2 = allDogs.find(d => d.id === dog2.vaderId);
    const moeder2 = allDogs.find(d => d.id === dog2.moederId);
    
    if (vader1 && vader2) {
        relationship += 0.25 * calculateRelationship(vader1, vader2, allDogs, generations - 1);
    }
    if (vader1 && moeder2) {
        relationship += 0.25 * calculateRelationship(vader1, moeder2, allDogs, generations - 1);
    }
    if (moeder1 && vader2) {
        relationship += 0.25 * calculateRelationship(moeder1, vader2, allDogs, generations - 1);
    }
    if (moeder1 && moeder2) {
        relationship += 0.25 * calculateRelationship(moeder1, moeder2, allDogs, generations - 1);
    }
    
    return relationship;
}

// Gebruik:
function calculateCOIForDog(dogId, allDogs) {
    const dog = allDogs.find(d => d.id === dogId);
    if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
    
    const coi6Gen = calculateSimpleCOI(dog, allDogs, 6);
    const coiAllGen = calculateSimpleCOI(dog, allDogs, 10);
    
    return {
        coi6Gen: (coi6Gen * 100).toFixed(1),
        coiAllGen: (coiAllGen * 100).toFixed(1)
    };
}

// Test met je data
const result = calculateCOIForDog(27, allDogs);
console.log("Droll COI:", result);