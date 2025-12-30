/**
 * Stamboom Manager Module
 * Beheert 4-generatie stambomen voor honden - Zelfde layout op alle schermen
 * HORIZONTALE LAYOUT - Van links naar rechts met liggende cards
 * Overgrootouders 60% hoogte, zelfde breedte voor alle generaties
 */

class StamboomManager extends BaseModule {
    constructor(db, currentLang = 'nl') {
        super();
        this.db = db;
        this.currentLang = currentLang;
        this.allDogs = [];
        this.coiCache = new Map(); // Cache voor COI berekeningen
        this.translations = {
            nl: {
                pedigreeTitle: "Stamboom van {name}",
                pedigree4Gen: "4-generatie stamboom",
                generatingPedigree: "Stamboom genereren...",
                close: "Sluiten",
                print: "Afdrukken",
                noData: "Geen gegevens",
                unknown: "Onbekend",
                
                // Familierelaties
                currentDog: "Huidige hond",
                mainDog: "Hoofdhond",
                father: "Vader",
                mother: "Moeder",
                grandfather: "Grootvader",
                grandmother: "Grootmoeder",
                greatGrandfather: "Overgrootvader",
                greatGrandmother: "Overgrootmoeder",
                
                // Hond gegevens
                name: "Naam",
                kennel: "Kennel",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                coatColor: "Vachtkleur",
                country: "Land",
                zipCode: "Postcode",
                
                // Gezondheid
                healthInfo: "Gezondheidsinformatie",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                eyesExplanation: "Verklaring ogen",
                thyroidExplanation: "Toelichting schildklier",
                
                // COI
                coi: "Inteeltcoëfficiënt",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                calculating: "Berekent...",
                
                // Geslacht
                male: "Reu",
                female: "Teef",
                
                // Labels
                paternal: "Paternaal",
                maternal: "Maternaal",
                clickForDetails: "Klik voor details",
                closePopup: "Sluiten",
                remarks: "Opmerkingen",
                noRemarks: "Geen opmerkingen",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders"
            },
            en: {
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "4-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                close: "Close",
                print: "Print",
                noData: "No data",
                unknown: "Unknown",
                
                // Family relations
                currentDog: "Current Dog",
                mainDog: "Main Dog",
                father: "Father",
                mother: "Mother",
                grandfather: "Grandfather",
                grandmother: "Grandmother",
                greatGrandfather: "Great Grandfather",
                greatGrandmother: "Great Grandmother",
                
                // Dog details
                name: "Name",
                kennel: "Kennel",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                birthDate: "Birth date",
                deathDate: "Death date",
                coatColor: "Coat color",
                country: "Country",
                zipCode: "Zip code",
                
                // Health
                healthInfo: "Health Information",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                eyesExplanation: "Eye explanation",
                thyroidExplanation: "Thyroid explanation",
                
                // COI
                coi: "Inbreeding Coefficient",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                calculating: "Calculating...",
                
                // Gender
                male: "Male",
                female: "Female",
                
                // Labels
                paternal: "Paternal",
                maternal: "Maternaal",
                clickForDetails: "Click for details",
                closePopup: "Close",
                remarks: "Remarks",
                noRemarks: "No remarks",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents"
            },
            de: {
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "4-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wird generiert...",
                close: "Schließen",
                print: "Drucken",
                noData: "Keine Daten",
                unknown: "Unbekannt",
                
                // Familienbeziehungen
                currentDog: "Aktueller Hund",
                mainDog: "Haupt-Hund",
                father: "Vater",
                mother: "Mutter",
                grandfather: "Großvater",
                grandmother: "Großmutter",
                greatGrandfather: "Urgroßvater",
                greatGrandmother: "Urgroßmutter",
                
                // Hund Details
                name: "Name",
                kennel: "Kennel",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geslacht",
                birthDate: "Geboortedatum",
                deathDate: "Sterbedatum",
                coatColor: "Fellfarbe",
                country: "Country",
                zipCode: "Postleitzahl",
                
                // Gesundheit
                healthInfo: "Gesundheitsinformationen",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                eyesExplanation: "Augenerklärung",
                thyroidExplanation: "Schilddrüse Erklärung",
                
                // COI
                coi: "Inzuchtkoeffizient",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                calculating: "Berechne...",
                
                // Geschlecht
                male: "Rüde",
                female: "Hündin",
                
                // Labels
                paternal: "Väterlich",
                maternal: "Mütterlich",
                clickForDetails: "Klicken voor Details",
                closePopup: "Schließen",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async initialize() {
        this.allDogs = await this.db.getHonden();
        console.log(`${this.allDogs.length} honden geladen voor stambomen`);
    }
    
    getDogById(id) {
        return this.allDogs.find(dog => dog.id === id);
    }
    
    // VERBETERDE METHODE: Bereken inteeltcoëfficiënt met echte "All Gen"
    calculateInbreedingCoefficient(dogId) {
        // Check cache eerst
        const cacheKey6 = `${dogId}_6`;
        const cacheKeyAll = `${dogId}_all`;
        
        if (this.coiCache.has(cacheKey6) && this.coiCache.has(cacheKeyAll)) {
            return {
                coi6Gen: this.coiCache.get(cacheKey6),
                coiAllGen: this.coiCache.get(cacheKeyAll)
            };
        }
        
        if (!dogId) {
            const result = { coi6Gen: 0, coiAllGen: 0 };
            this.coiCache.set(cacheKey6, 0);
            this.coiCache.set(cacheKeyAll, 0);
            return result;
        }
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            const result = { coi6Gen: 0, coiAllGen: 0 };
            this.coiCache.set(cacheKey6, 0);
            this.coiCache.set(cacheKeyAll, 0);
            return result;
        }
        
        try {
            // Bereken voor 6 generaties
            const coi6Gen = this.calculateCoiWithLimit(dogId, 6);
            
            // Bereken voor ALLE generaties (zonder vaste limiet, maar met veiligheidsmaatregelen)
            const coiAllGen = this.calculateCoiAllGenerations(dogId);
            
            const result = {
                coi6Gen: Math.round(coi6Gen * 10000) / 100, // 2 decimalen
                coiAllGen: Math.round(coiAllGen * 10000) / 100
            };
            
            this.coiCache.set(cacheKey6, result.coi6Gen);
            this.coiCache.set(cacheKeyAll, result.coiAllGen);
            return result;
            
        } catch (error) {
            console.error("Fout bij COI berekening voor hond", dogId, error);
            const result = { coi6Gen: 0, coiAllGen: 0 };
            this.coiCache.set(cacheKey6, 0);
            this.coiCache.set(cacheKeyAll, 0);
            return result;
        }
    }
    
    // NIEUWE METHODE: Bereken COI voor ALLE generaties
    calculateCoiAllGenerations(dogId) {
        if (!dogId) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            return 0;
        }
        
        // Gebruik een benadering die werkt met circulaire relaties
        // Deze methode gebruikt een iteratieve benadering in plaats van diepe recursie
        
        // Verzamel alle paden naar gemeenschappelijke voorouders
        const findCommonAncestors = (startId) => {
            const ancestors = new Map(); // Map van ancestorId -> Set van paden
            const queue = [{ id: startId, path: [], depth: 0 }];
            const maxDepth = 100; // Veilige limiet
            
            while (queue.length > 0) {
                const current = queue.shift();
                
                if (current.depth > maxDepth) {
                    continue;
                }
                
                const currentDog = this.getDogById(current.id);
                if (!currentDog) {
                    continue;
                }
                
                // Voeg toe aan ancestors map
                if (!ancestors.has(current.id)) {
                    ancestors.set(current.id, new Set());
                }
                ancestors.get(current.id).add(current.path.join(''));
                
                // Voeg ouders toe aan queue (als ze bestaan)
                if (currentDog.vaderId) {
                    queue.push({
                        id: currentDog.vaderId,
                        path: [...current.path, 'V'],
                        depth: current.depth + 1
                    });
                }
                
                if (currentDog.moederId) {
                    queue.push({
                        id: currentDog.moederId,
                        path: [...current.path, 'M'],
                        depth: current.depth + 1
                    });
                }
            }
            
            return ancestors;
        };
        
        // Verzamel voorouders van vader en moeder
        const paternalAncestors = findCommonAncestors(dog.vaderId);
        const maternalAncestors = findCommonAncestors(dog.moederId);
        
        // Zoek gemeenschappelijke voorouders
        let totalCoi = 0;
        const processedAncestors = new Set();
        
        paternalAncestors.forEach((paternalPaths, ancestorId) => {
            if (maternalAncestors.has(ancestorId)) {
                const maternalPaths = maternalAncestors.get(ancestorId);
                
                // Voorkom dubbele verwerking
                if (processedAncestors.has(ancestorId)) {
                    return;
                }
                processedAncestors.add(ancestorId);
                
                // Voor elke combinatie van paden berekenen we de bijdrage
                paternalPaths.forEach(paternalPath => {
                    maternalPaths.forEach(maternalPath => {
                        // Bereken n en m (lengte van paden + 1 voor de ouder)
                        const n = paternalPath.length + 1;
                        const m = maternalPath.length + 1;
                        
                        // Bereken COI van de voorouder (recursief maar met cache)
                        const fa = this.calculateCoiAllGenerations(ancestorId);
                        
                        // Formule van Wright: (0.5)^(n+m+1) * (1 + Fa)
                        totalCoi += Math.pow(0.5, n + m + 1) * (1 + fa);
                    });
                });
            }
        });
        
        return totalCoi;
    }
    
    // Helper methode voor berekening met limiet
    calculateCoiWithLimit(dogId, maxGenerations) {
        if (!dogId || maxGenerations <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Gebruik een set om circulaire paden te detecteren
        const getAllPaths = (startId, maxDepth, currentDepth = 0, currentPath = [], visited = new Set()) => {
            if (currentDepth >= maxDepth || !startId) {
                return [currentPath];
            }
            
            // Voorkom circulaire paden
            if (visited.has(startId)) {
                return [currentPath];
            }
            
            const currentDog = this.getDogById(startId);
            if (!currentDog) {
                return [currentPath];
            }
            
            // Voeg huidige hond toe aan pad
            const newPath = [...currentPath, {
                id: startId,
                depth: currentDepth
            }];
            
            const newVisited = new Set([...visited, startId]);
            
            // Als er geen ouders zijn, retourneer huidig pad
            if (!currentDog.vaderId && !currentDog.moederId) {
                return [newPath];
            }
            
            // Verzamel paden van beide ouders
            let allPaths = [];
            
            if (currentDog.vaderId) {
                const paternalPaths = getAllPaths(
                    currentDog.vaderId,
                    maxDepth,
                    currentDepth + 1,
                    newPath,
                    newVisited
                );
                allPaths = allPaths.concat(paternalPaths);
            }
            
            if (currentDog.moederId) {
                const maternalPaths = getAllPaths(
                    currentDog.moederId,
                    maxDepth,
                    currentDepth + 1,
                    newPath,
                    newVisited
                );
                allPaths = allPaths.concat(maternalPaths);
            }
            
            // Als er geen verdere paden zijn, retourneer huidig pad
            if (allPaths.length === 0) {
                return [newPath];
            }
            
            return allPaths;
        };
        
        // Verzamel alle paden naar voorouders
        const paternalPaths = getAllPaths(dog.vaderId, maxGenerations - 1, 0, [], new Set());
        const maternalPaths = getAllPaths(dog.moederId, maxGenerations - 1, 0, [], new Set());
        
        // Zoek gemeenschappelijke voorouders
        let totalCoi = 0;
        const processedAncestors = new Set();
        
        paternalPaths.forEach(paternalPath => {
            maternalPaths.forEach(maternalPath => {
                // Vind gemeenschappelijke voorouders in de paden
                for (let i = 0; i < paternalPath.length; i++) {
                    for (let j = 0; j < maternalPath.length; j++) {
                        if (paternalPath[i].id === maternalPath[j].id) {
                            const ancestorId = paternalPath[i].id;
                            
                            // Voorkom dubbele verwerking van dezelfde voorouder
                            if (processedAncestors.has(ancestorId)) {
                                break;
                            }
                            processedAncestors.add(ancestorId);
                            
                            // Bereken n en m
                            const n = i + 1; // +1 voor de vader
                            const m = j + 1; // +1 voor de moeder
                            
                            // Bereken COI van de voorouder (recursief, maar met beperkte diepte)
                            const remainingDepth = Math.max(maxGenerations - Math.max(n, m), 1);
                            const fa = this.calculateCoiWithLimit(ancestorId, remainingDepth);
                            
                            // Formule van Wright
                            totalCoi += Math.pow(0.5, n + m + 1) * (1 + fa);
                            break;
                        }
                    }
                }
            });
        });
        
        return totalCoi;
    }
    
    // Eenvoudige fallback methode voor als de complexe faalt
    calculateSimpleCoi(dogId, maxGenerations = 6) {
        if (!dogId) return { coi6Gen: 0, coiAllGen: 0 };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: 0, coiAllGen: 0 };
        
        // Bereken voor 6 generaties
        const coi6Gen = this.calculateSimpleCoiValue(dogId, 6);
        
        // Voor "All Gen" gebruiken we een hogere limiet (50 generaties is praktisch oneindig)
        const coiAllGen = this.calculateSimpleCoiValue(dogId, 50);
        
        return {
            coi6Gen: Math.round(coi6Gen * 10000) / 100,
            coiAllGen: Math.round(coiAllGen * 10000) / 100
        };
    }
    
    calculateSimpleCoiValue(dogId, maxGenerations) {
        if (!dogId || maxGenerations <= 0) return 0;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        // Verzamel alle voorouders (breadth-first)
        const collectAncestorsBFS = (startId, maxDepth) => {
            const ancestors = new Map();
            const queue = [{ id: startId, depth: 0 }];
            const visited = new Set();
            
            while (queue.length > 0) {
                const current = queue.shift();
                
                if (current.depth >= maxDepth || visited.has(current.id)) {
                    continue;
                }
                visited.add(current.id);
                
                const currentDog = this.getDogById(current.id);
                if (!currentDog) continue;
                
                // Voeg toe aan ancestors (niet de start hond zelf)
                if (current.depth > 0) {
                    ancestors.set(current.id, {
                        depth: current.depth,
                        dog: currentDog
                    });
                }
                
                // Voeg ouders toe aan queue
                if (currentDog.vaderId) {
                    queue.push({ id: currentDog.vaderId, depth: current.depth + 1 });
                }
                if (currentDog.moederId) {
                    queue.push({ id: currentDog.moederId, depth: current.depth + 1 });
                }
            }
            
            return ancestors;
        };
        
        const paternalAncestors = collectAncestorsBFS(dog.vaderId, maxGenerations);
        const maternalAncestors = collectAncestorsBFS(dog.moederId, maxGenerations);
        
        let totalCoi = 0;
        
        paternalAncestors.forEach((paternalData, ancestorId) => {
            if (maternalAncestors.has(ancestorId)) {
                const maternalData = maternalAncestors.get(ancestorId);
                const n = paternalData.depth + 1;
                const m = maternalData.depth + 1;
                
                // Bereken COI van de voorouder (recursief met beperkte diepte)
                const remainingDepth = Math.max(maxGenerations - Math.max(n, m), 1);
                const fa = this.calculateSimpleCoiValue(ancestorId, remainingDepth);
                
                totalCoi += Math.pow(0.5, n + m + 1) * (1 + fa);
            }
        });
        
        return totalCoi;
    }
    
    // Wis cache wanneer nodig
    clearCoiCache() {
        this.coiCache.clear();
    }
    
    buildPedigreeTree(dogId) {
        const pedigreeTree = {
            mainDog: null,
            father: null,
            mother: null,
            paternalGrandfather: null,
            paternalGrandmother: null,
            maternalGrandfather: null,
            maternalGrandmother: null,
            paternalGreatGrandfather1: null,
            paternalGreatGrandmother1: null,
            paternalGreatGrandfather2: null,
            paternalGreatGrandmother2: null,
            maternalGreatGrandfather1: null,
            maternalGreatGrandmother1: null,
            maternalGreatGrandfather2: null,
            maternalGreatGrandmother2: null
        };
        
        const mainDog = this.getDogById(dogId);
        if (!mainDog) return null;
        
        pedigreeTree.mainDog = mainDog;
        
        // Ouders
        if (mainDog.vaderId) {
            pedigreeTree.father = this.getDogById(mainDog.vaderId);
        }
        
        if (mainDog.moederId) {
            pedigreeTree.mother = this.getDogById(mainDog.moederId);
        }
        
        // Grootouders
        if (pedigreeTree.father && pedigreeTree.father.vaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(pedigreeTree.father.vaderId);
        }
        
        if (pedigreeTree.father && pedigreeTree.father.moederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(pedigreeTree.father.moederId);
        }
        
        if (pedigreeTree.mother && pedigreeTree.mother.vaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(pedigreeTree.mother.vaderId);
        }
        
        if (pedigreeTree.mother && pedigreeTree.mother.moederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(pedigreeTree.mother.moederId);
        }
        
        // Overgrootouders
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.vaderId) {
            pedigreeTree.paternalGreatGrandfather1 = this.getDogById(pedigreeTree.paternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.moederId) {
            pedigreeTree.paternalGreatGrandmother1 = this.getDogById(pedigreeTree.paternalGrandfather.moederId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.vaderId) {
            pedigreeTree.paternalGreatGrandfather2 = this.getDogById(pedigreeTree.paternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.moederId) {
            pedigreeTree.paternalGreatGrandmother2 = this.getDogById(pedigreeTree.paternalGrandmother.moederId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.vaderId) {
            pedigreeTree.maternalGreatGrandfather1 = this.getDogById(pedigreeTree.maternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.moederId) {
            pedigreeTree.maternalGreatGrandmother1 = this.getDogById(pedigreeTree.maternalGrandfather.moederId);
        }
        
        if (pedigreeTree.maternalGrandmother && pedigreeTree.maternalGrandmother.vaderId) {
            pedigreeTree.maternalGreatGrandfather2 = this.getDogById(pedigreeTree.maternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.maternalGrandmother && pedigreeTree.maternalGrandmother.moederId) {
            pedigreeTree.maternalGreatGrandmother2 = this.getDogById(pedigreeTree.maternalGrandmother.moederId);
        }
        
        return pedigreeTree;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        } catch {
            return dateString;
        }
    }
    
    getHealthBadge(value, type) {
        if (!value || value === '') {
            return `<span class="badge bg-secondary">${this.t('unknown')}</span>`;
        }
        
        let badgeClass = 'badge ';
        switch(type) {
            case 'hip': badgeClass += 'badge-hd'; break;
            case 'elbow': badgeClass += 'badge-ed'; break;
            case 'patella': badgeClass += 'badge-pl'; break;
            case 'eyes': badgeClass += 'badge-eyes'; break;
            case 'dandy': badgeClass += 'badge-dandy'; break;
            case 'thyroid': badgeClass += 'badge-thyroid'; break;
            default: badgeClass += 'bg-secondary';
        }
        
        return `<span class="${badgeClass}">${value}</span>`;
    }
    
    getCoiBadge(coiValue) {
        if (coiValue === null || coiValue === undefined || isNaN(coiValue)) {
            return `<span class="badge bg-secondary">${this.t('calculating')}</span>`;
        }
        
        let badgeClass = 'badge ';
        if (coiValue === 0) {
            badgeClass += 'bg-success';
        } else if (coiValue < 5) {
            badgeClass += 'bg-info';
        } else if (coiValue < 10) {
            badgeClass += 'bg-warning';
        } else {
            badgeClass += 'bg-danger';
        }
        return `<span class="${badgeClass}">${coiValue.toFixed(2)}%</span>`;
    }
    
    // LIGGENDE CARD VOOR STAMBOOM - overgrootouders kleinere hoogte
    getDogCompactCardHTML(dog, relation = '', isMainDog = false, generation = 0) {
        if (!dog) {
            return `
                <div class="pedigree-card-compact horizontal empty gen${generation}" data-dog-id="0">
                    <div class="pedigree-card-header-compact horizontal">
                        <div class="relation-compact">${relation}</div>
                    </div>
                    <div class="pedigree-card-body-compact horizontal text-center py-3">
                        <div class="no-data-text">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-primary' : 'bg-secondary';
        
        // Bepaal of we de kennelnaam moeten tonen
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        
        // Maak een gecombineerde naam+kennel string voor automatische aanpassing
        const combinedName = dog.naam || this.t('unknown');
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const fullDisplayText = combinedName + kennelSuffix;
        
        return `
            <div class="pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}">
                <div class="pedigree-card-header-compact horizontal ${headerColor}">
                    <div class="relation-compact">
                        <span class="relation-text">${relation}</span>
                        ${isMainDog ? '<span class="main-dot">★</span>' : ''}
                    </div>
                    <div class="gender-icon-compact">
                        <i class="bi ${genderIcon}"></i>
                    </div>
                </div>
                <div class="pedigree-card-body-compact horizontal">
                    <!-- Regel 1: Naam en kennelnaam in één regel -->
                    <div class="card-row card-row-1">
                        <div class="dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <!-- Regel 2: Stamboomnummer en ras -->
                    <div class="card-row card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${dog.ras ? `
                        <div class="dog-breed-compact" title="${dog.ras}">
                            ${dog.ras}
                        </div>
                        ` : ''}
                    </div>
                    
                    <!-- Regel 3: Klik hint -->
                    <div class="card-row card-row-3">
                        <div class="click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // DETAIL POPUP voor wanneer op card geklikt wordt
    getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        // Bereken COI waarden
        const coiValues = this.calculateInbreedingCoefficient(dog.id);
        
        return `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${relation}
                    </h5>
                    <button type="button" class="btn-close btn-close-white popup-close"></button>
                </div>
                <div class="popup-body">
                    <div class="dog-popup-name mb-2">
                        <h4>${dog.naam || this.t('unknown')}</h4>
                        ${dog.kennelnaam ? `<div class="text-muted">${dog.kennelnaam}</div>` : ''}
                    </div>
                    
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="info-grid">
                            ${dog.stamboomnr ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('pedigreeNumber')}:</span>
                                <span class="info-value">${dog.stamboomnr}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.ras ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('breed')}:</span>
                                <span class="info-value">${dog.ras}</span>
                            </div>
                            ` : ''}
                            
                            <div class="info-item">
                                <span class="info-label">${this.t('gender')}:</span>
                                <span class="info-value">${genderText}</span>
                            </div>
                            
                            ${dog.vachtkleur ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('coatColor')}:</span>
                                <span class="info-value">${dog.vachtkleur}</span>
                            </div>
                            ` : ''}
                            
                            <!-- COI toegevoegd onder vachtkleur -->
                            <div class="info-item coi-item">
                                <span class="info-label">${this.t('coi')}:</span>
                                <div class="coi-values">
                                    <div class="coi-value">
                                        <span class="coi-label">${this.t('coi6Gen')}:</span>
                                        <span class="coi-badge">${this.getCoiBadge(coiValues.coi6Gen)}</span>
                                    </div>
                                    <div class="coi-value">
                                        <span class="coi-label">${this.t('coiAllGen')}:</span>
                                        <span class="coi-badge">${this.getCoiBadge(coiValues.coiAllGen)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            ${dog.geboortedatum ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('birthDate')}:</span>
                                <span class="info-value">${this.formatDate(dog.geboortedatum)}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('deathDate')}:</span>
                                <span class="info-value">${this.formatDate(dog.overlijdensdatum)}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.land ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('country')}:</span>
                                <span class="info-value">${dog.land}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.postcode ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('zipCode')}:</span>
                                <span class="info-value">${dog.postcode}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}</h6>
                        <div class="info-grid">
                            ${dog.heupdysplasie ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('hipDysplasia')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.heupdysplasie, 'hip')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('elbowDysplasia')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.elleboogdysplasie, 'elbow')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('patellaLuxation')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.patella, 'patella')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('eyes')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.ogen, 'eyes')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.ogenVerklaring ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('eyesExplanation')}:</span>
                                <span class="info-value">${dog.ogenVerklaring}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('dandyWalker')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.dandyWalker, 'dandy')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('thyroid')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.schildklier, 'thyroid')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklierVerklaring ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('thyroidExplanation')}:</span>
                                <span class="info-value">${dog.schildklierVerklaring}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${dog.opmerkingen ? `
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : `
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="text-muted">${this.t('noRemarks')}</div>
                    </div>
                    `}
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    showPedigree(dog) {
        if (!document.getElementById('pedigreeModal')) {
            this.createPedigreeModal();
        }
        
        const pedigreeTree = this.buildPedigreeTree(dog.id);
        if (!pedigreeTree) {
            this.showError("Kon stamboom niet genereren");
            return;
        }
        
        const title = this.t('pedigreeTitle').replace('{name}', dog.naam || this.t('unknown'));
        document.getElementById('pedigreeModalLabel').textContent = title;
        
        this.renderCompactPedigree(pedigreeTree);
        
        const modal = new bootstrap.Modal(document.getElementById('pedigreeModal'));
        modal.show();
    }
    
    createPedigreeModal() {
        const modalHTML = `
            <div class="modal fade" id="pedigreeModal" tabindex="-1" aria-labelledby="pedigreeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="pedigreeModalLabel">
                                <i class="bi bi-diagram-3 me-2"></i> ${this.t('pedigree4Gen')}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0" style="overflow: hidden;">
                            <!-- MOBIELE CONTAINER - 6.5 inch hoog -->
                            <div class="pedigree-mobile-wrapper" id="pedigreeMobileWrapper">
                                <div class="pedigree-container-compact" id="pedigreeContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">${this.t('generatingPedigree')}</span>
                                        </div>
                                        <p class="mt-3">${this.t('generatingPedigree')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- FOOTER VERWIJDERD -->
                    </div>
                </div>
            </div>
            
            <!-- Popup overlay voor hond details -->
            <div class="pedigree-popup-overlay" id="pedigreePopupOverlay" style="display: none;">
                <div class="pedigree-popup-container" id="pedigreePopupContainer">
                    <!-- Hier komt de popup content -->
                </div>
            </div>
            
            <style>
                /* MOBIELE WRAPPER */
                .pedigree-mobile-wrapper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f8f9fa;
                    position: relative;
                    border-radius: 12px;
                }
                
                /* HORIZONTALE PEDIGREE CONTAINER */
                .pedigree-container-compact {
                    padding: 15px !important;
                    margin: 0 !important;
                    width: 100% !important;
                    background: #f8f9fa;
                    overflow-x: auto !important;
                    overflow-y: auto !important;
                    position: relative;
                    min-height: 0 !important;
                    box-sizing: border-box !important;
                    border-radius: inherit;
                }
                
                .pedigree-grid-compact {
                    display: flex;
                    flex-direction: row;
                    height: auto;
                    min-width: fit-content;
                    padding: 10px 15px !important;
                    gap: 20px;
                    align-items: flex-start;
                    box-sizing: border-box !important;
                    margin: 0 auto;
                }
                
                /* GENERATIE KOLOM - VERTICALE STACK VAN LIGGENDE CARDS */
                .pedigree-generation-col {
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    justify-content: flex-start;
                    min-width: 0;
                }
                
                /* ZELFDE SPACING PER GENERATIE - ALLES GELIJK ZETTEN */
                .pedigree-generation-col.gen0 {
                    gap: 4px !important; /* Gelijk aan andere generaties */
                }
                
                .pedigree-generation-col.gen1 {
                    gap: 4px !important;
                }
                
                .pedigree-generation-col.gen2 {
                    gap: 4px !important;
                }
                
                .pedigree-generation-col.gen3 {
                    gap: 4px !important;  /* Gelijk aan andere generaties */
                }
                
                /* BASIS LIGGENDE CARDS */
                .pedigree-card-compact.horizontal {
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin: 0 !important;
                    padding: 0 !important;
                    flex-shrink: 0;
                }
                
                /* ZELFDE BREEDTE VOOR ALLE GENERATIES - ANDERE HOOGTE VOOR OVERGROOTOUDERS */
                .pedigree-card-compact.horizontal.gen0,
                .pedigree-card-compact.horizontal.gen1,
                .pedigree-card-compact.horizontal.gen2 {
                    width: 160px !important;
                    height: 120px !important;
                }
                
                /* OVERGROOTOUDERS: 60% HOOGTE VAN NORMALE CARDS */
                .pedigree-card-compact.horizontal.gen3 {
                    width: 160px !important;
                    height: 60px !important;  /* 60% van 100px */
                }
                
                /* Hoofdhond extra styling */
                .pedigree-card-compact.horizontal.main-dog-compact {
                    border: 2px solid #0d6efd !important;
                    background: #f0f7ff;
                    width: 170px !important;
                    height: 110px !important;
                }
                
                /* Geslacht kleuren */
                .pedigree-card-compact.horizontal.male {
                    border-left: 4px solid #0d6efd !important;
                }
                
                .pedigree-card-compact.horizontal.female {
                    border-left: 4px solid #dc3545 !important;
                }
                
                .pedigree-card-compact.horizontal:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
                    transform: translateY(-1px);
                    z-index: 1;
                    position: relative;
                }
                
                .pedigree-card-compact.horizontal.empty {
                    background: #f8f9fa;
                    cursor: default;
                    opacity: 0.6;
                }
                
                .pedigree-card-compact.horizontal.empty:hover {
                    transform: none !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
                }
                
                /* CARD HEADER - VERSCHILLENDE GROOTTES PER GENERATIE */
                .pedigree-card-header-compact.horizontal {
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                
                /* Header voor gen0, gen1, gen2 */
                .pedigree-card-compact.horizontal.gen0 .pedigree-card-header-compact.horizontal,
                .pedigree-card-compact.horizontal.gen1 .pedigree-card-header-compact.horizontal,
                .pedigree-card-compact.horizontal.gen2 .pedigree-card-header-compact.horizontal {
                    padding: 5px 8px;
                    font-size: 0.7rem;
                    min-height: 22px;
                }
                
                /* Header voor gen3 (overgrootouders) - 60% van normale grootte */
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-header-compact.horizontal {
                    padding: 3px 6px;
                    font-size: 0.56rem;  /* 80% van 0.7rem */
                    min-height: 16px;
                }
                
                .pedigree-card-header-compact.horizontal.bg-primary {
                    background: #0d6efd !important;
                }
                
                .pedigree-card-header-compact.horizontal.bg-secondary {
                    background: #6c757d !important;
                }
                
                .relation-compact {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    font-weight: 600;
                    overflow: hidden;
                    flex: 1;
                }
                
                .relation-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .main-dot {
                    color: #ffc107;
                    font-size: 0.7rem;
                    flex-shrink: 0;
                }
                
                .gender-icon-compact {
                    flex-shrink: 0;
                    margin-left: 4px;
                }
                
                /* CARD BODY - VERSCHILLENDE PADDING PER GENERATIE */
                .pedigree-card-body-compact.horizontal {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex: 1;
                }
                
                /* Body voor gen0, gen1, gen2 */
                .pedigree-card-compact.horizontal.gen0 .pedigree-card-body-compact.horizontal,
                .pedigree-card-compact.horizontal.gen1 .pedigree-card-body-compact.horizontal,
                .pedigree-card-compact.horizontal.gen2 .pedigree-card-body-compact.horizontal {
                    padding: 6px 8px;
                }
                
                /* Body voor gen3 (overgrootouders) - 60% van normale grootte */
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-body-compact.horizontal {
                    padding: 4px 6px;
                }
                
                /* CARD ROWS voor liggende layout */
                .card-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                }
                
                .card-row-1 {
                    margin-bottom: 2px;
                }
                
                .card-row-2 {
                    margin-bottom: 2px;
                }
                
                .card-row-3 {
                    margin-top: auto;
                }
                
                /* NAAM + KENNEL COMBINATIE STYLING */
                .dog-name-kennel-compact {
                    font-weight: 600;
                    color: #0d6efd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    width: 100%;
                }
                
                /* TEKST GROOTTES PER GENERATIE */
                /* Hoofdhond, ouders en grootouders (gen0, gen1, gen2) */
                .pedigree-card-compact.horizontal.gen0 .dog-name-kennel-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-name-kennel-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-name-kennel-compact {
                    font-size: 0.75rem;
                }
                
                .pedigree-card-compact.horizontal.gen0 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen0 .dog-breed-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-breed-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-breed-compact {
                    font-size: 0.65rem;
                }
                
                .pedigree-card-compact.horizontal.gen0 .click-hint-compact,
                .pedigree-card-compact.horizontal.gen1 .click-hint-compact,
                .pedigree-card.compact.horizontal.gen2 .click-hint-compact {
                    font-size: 0.55rem;
                }
                
                /* Overgrootouders (gen3): 60% van normale tekstgrootte */
                .pedigree-card-compact.horizontal.gen3 .dog-name-kennel-compact {
                    font-size: 0.6rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen3 .dog-breed-compact {
                    font-size: 0.52rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .click-hint-compact {
                    font-size: 0.44rem;
                }
                
                /* Algemene tekst styling voor andere elementen */
                .dog-pedigree-compact {
                    font-weight: 600;
                    color: #495057;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                }
                
                .dog-breed-compact {
                    color: #28a745;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                    text-align: right;
                }
                
                .no-data-text {
                    color: #6c757d;
                    font-style: italic;
                    line-height: 1.3;
                    font-size: 0.7rem;
                }
                
                .click-hint-compact {
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    line-height: 1;
                    width: 100%;
                    padding-top: 2px;
                    border-top: 1px dashed #dee2e6;
                }
                
                /* Generation labels styling - GELIJKE RUIMTE VOOR ALLE GENERATIES */
                .generation-label {
                    font-weight: bold;
                    color: #495057;
                    text-align: center;
                    margin-bottom: 8px !important; /* Gelijk voor alle generaties */
                    font-size: 0.75rem;
                    background: #e9ecef;
                    padding: 4px 8px;
                    border-radius: 4px;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                
                /* ============================================= */
                /* START MOBIELE AANPASSINGEN (max-width: 767px) */
                /* ============================================= */
                @media (max-width: 767px) {
                    /* EENVOUDIGE MODAL ZONDER FULLSCREEN */
                    #pedigreeModal.modal.fade .modal-dialog {
                        max-width: 100%;
                        margin: 0.5rem auto;
                        height: auto;
                    }
                    
                    #pedigreeModal.modal.fade .modal-content {
                        width: 100%;
                        height: auto;
                        margin: 0;
                        border-radius: 12px; /* Afgeronde hoeken */
                        display: flex;
                        flex-direction: column;
                    }
                    
                    #pedigreeModal.modal.fade .modal-header {
                        margin: 0;
                        padding: 0.75rem 1rem;
                        border: none;
                        width: 100%;
                        flex-shrink: 0;
                        min-height: auto;
                        z-index: 1;
                        border-radius: 12px 12px 0 0; /* Afgeronde bovenhoeken */
                    }
                    
                    #pedigreeModal.modal.fade .modal-body {
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        flex: 1 1 auto;
                        overflow: hidden;
                        min-height: 0;
                        max-height: 640px;
                        border-radius: 0 0 12px 12px; /* Afgeronde onderhoeken */
                    }
                    
                    .pedigree-mobile-wrapper {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        background: #f8f9fa;
                        border-radius: 0 0 12px 12px; /* Afgeronde onderhoeken */
                    }
                    
                    /* CONTAINER HOOGTE */
                    .pedigree-container-compact {
                        height: 640px !important;
                        overflow-x: auto !important; /* Horizontale scroll */
                        overflow-y: hidden !important; /* Geen verticale scroll */
                        padding: 10px !important;
                        -webkit-overflow-scrolling: touch;
                        display: flex;
                        flex-direction: column;
                        border-radius: 0 0 12px 12px; /* Afgeronde onderhoeken */
                    }
                    
                    /* Horizontale grid - generaties naast elkaar */
                    .pedigree-grid-compact {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        height: 100% !important;
                        min-width: max-content !important;
                        padding: 10px 15px !important;
                        gap: 15px !important;
                        margin: 0 !important;
                        align-items: stretch !important;
                        box-sizing: border-box !important;
                        width: auto !important;
                    }
                    
                    /* Elke generatie kolom - centraal uitlijnen van cards */
                    .pedigree-generation-col {
                        display: flex !important;
                        flex-direction: column !important;
                        height: 100% !important;
                        flex-shrink: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        position: relative;
                        justify-content: center !important; /* Centreren voor alle generaties */
                        align-items: flex-start !important;
                    }
                    
                    /* Generatie 0: Huidige hond - links in het midden */
                    .pedigree-generation-col.gen0 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important; /* Gelijk aan andere generaties */
                    }
                    
                    /* Generatie 1: Ouders - vader boven midden, moeder onder midden */
                    .pedigree-generation-col.gen1 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important; /* Gelijk aan andere generaties */
                    }
                    
                    /* Vader: 2px boven het midden */
                    .pedigree-generation-col.gen1 > .pedigree-card-compact.horizontal:nth-child(2) {
                        margin-top: -2px !important; /* 2px boven midden */
                    }
                    
                    /* Moeder: 2px onder het midden */
                    .pedigree-generation-col.gen1 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: 2px !important; /* 2px onder midden */
                    }
                    
                    /* Generatie 2: Grootouders - 4 cards vanuit het midden uitgelijnd */
                    .pedigree-generation-col.gen2 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important; /* Gelijk aan andere generaties */
                    }
                    
                    /* Grootouders: eerste 2 cards iets boven midden, laatste 2 cards iets onder midden */
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(2),
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -4px !important; /* Bovenste paar */
                    }
                    
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(4),
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: 4px !important; /* Onderste paar */
                    }
                    
                    /* Generatie 3: Overgrootouders - 8 cards centraal uitgelijnd */
                    .pedigree-generation-col.gen3 {
                        justify-content: center !important; /* CENTREREN net als andere generaties */
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important; /* Gelijk aan andere generaties */
                    }
                    
                    /* Overgrootouders: verdeel de 8 cards symmetrisch rond het midden */
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(2),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -8px !important; /* Eerste paar: 8px boven midden */
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(4),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: -4px !important; /* Tweede paar: 4px boven midden */
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(6),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(7) {
                        margin-top: 0px !important; /* Derde paar: exact midden */
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(8),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(9) {
                        margin-top: 4px !important; /* Vierde paar: 4px onder midden */
                    }
                    
                    /* Generation labels - GELIJKE RUIMTE VOOR ALLE GENERATIES */
                    .pedigree-generation-col .generation-label {
                        font-size: 0.7rem !important;
                        padding: 3px 6px !important;
                        margin-bottom: 8px !important; /* Gelijk voor alle generaties */
                        white-space: nowrap !important;
                        width: 100%;
                        text-align: center;
                        position: static !important;
                        margin-top: 0 !important;
                    }
                    
                    /* ALLE CARDS 220px BREED OP MOBIEL */
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important; /* 220px breed */
                        height: 120px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important; /* 220px breed */
                        height: 62px !important;  /* 2px hoger (was 60px) */
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important; /* 220px */
                        height: 120px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    /* Zorg dat alle cards in hun kolom blijven */
                    .pedigree-generation-col > * {
                        width: 100% !important;
                    }
                    
                    /* POPUP CENTRERING OP MOBIEL */
                    .pedigree-popup-container {
                        width: 95% !important;
                        max-width: 95% !important;
                        margin: 10px auto !important;
                        max-height: 85vh !important;
                    }
                    
                    .popup-body {
                        padding: 15px !important;
                    }
                    
                    .info-section {
                        margin-bottom: 15px !important;
                    }
                    
                    .info-section h6 {
                        margin-bottom: 8px !important;
                        padding-bottom: 6px !important;
                        font-size: 0.9rem !important;
                    }
                    
                    .info-grid {
                        gap: 8px !important;
                    }
                    
                    .info-item {
                        padding: 4px 0 !important;
                    }
                    
                    .info-label {
                        font-size: 0.8rem !important;
                        margin-bottom: 2px !important;
                    }
                    
                    .info-value {
                        font-size: 0.85rem !important;
                    }
                }
                
                /* Kleine mobiele schermen */
                @media (max-width: 480px) {
                    .pedigree-container-compact {
                        height: 600px !important; /* Blijft */
                        padding: 8px !important;
                    }
                    
                    .pedigree-grid-compact {
                        padding: 8px 12px !important;
                        gap: 4px !important;
                    }
                    
                    /* Cards blijven 220px breed, maar kolommen iets smaller */
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important; /* 200px breed */
                        height: 105px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important; /* 200px breed */
                        height: 59px !important;  /* 2px hoger (was 57px) */
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important; /* 220px border */
                        height: 105px !important;
                    }
                    
                    .pedigree-generation-col {
                        min-width: 220px !important; /* 220px breed */
                        width: 220px !important;
                    }
                    
                    .pedigree-generation-col.gen0,
                    .pedigree-generation-col.gen1,
                    .pedigree-generation-col.gen2,
                    .pedigree-generation-col.gen3 {
                        min-width: 220px !important;
                        width: 220px !important;
                    }
                    
                    .generation-label {
                        font-size: 0.65rem !important;
                        padding: 2px 5px !important;
                        margin-bottom: 8px !important; /* Gelijk voor alle generaties */
                    }
                    
                    /* Popup op hele kleine schermen */
                    .pedigree-popup-container {
                        width: 98% !important;
                        max-width: 98% !important;
                        margin: 5px auto !important;
                    }
                    
                    .popup-body {
                        padding: 12px !important;
                    }
                }
                /* ============================================= */
                /* EINDE MOBIELE AANPASSINGEN */
                /* ============================================= */
                
                /* ============================================= */
                /* START DESKTOP STYLES (min-width: 768px) */
                /* ============================================= */
                @media (min-width: 768px) {
                    #pedigreeModal.modal.fade .modal-dialog.modal-fullscreen {
                        width: 100vw !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        max-width: none !important;
                        padding: 0 !important;
                    }
                    
                    #pedigreeModal.modal.fade .modal-content {
                        width: 100% !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        border-radius: 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    
                    #pedigreeModal.modal.fade .modal-header {
                        margin: 0 !important;
                        padding: 0.75rem 1rem !important;
                        border: none !important;
                        width: 100% !important;
                        flex-shrink: 0 !important;
                        min-height: auto !important;
                        z-index: 1;
                    }
                    
                    #pedigreeModal.modal.fade .modal-body {
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        flex: 1 1 auto !important;
                        overflow: hidden !important;
                        min-height: 0 !important;
                    }
                    
                    .pedigree-mobile-wrapper {
                        height: 100%;
                        border-radius: 0;
                    }
                    
                    .pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        align-items: center;
                        padding: 0 !important;
                        display: flex;
                        border-radius: 0;
                    }
                    
                    .pedigree-grid-compact {
                        flex-direction: row;
                        height: 100%;
                        min-width: fit-content;
                        padding: 0 20px !important;
                        gap: 25px;
                        align-items: center;
                        box-sizing: border-box !important;
                        margin: 0 auto;
                    }
                    
                    .pedigree-generation-col {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        justify-content: center;
                        min-width: 0;
                    }
                    
                    /* ZELFDE GAP VOOR ALLE GENERATIES OP DESKTOP */
                    .pedigree-generation-col.gen0 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 {
                        gap: 4px !important;
                        justify-content: center; /* Overgrootouders centreren op desktop */
                    }
                    
                    /* Desktop cards - originele grootte (geen 200px op desktop) */
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 132px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 66px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 132px !important;
                    }
                    
                    /* Desktop tekstgrootte */
                    .pedigree-card-compact.horizontal.gen0 .dog-name-kennel-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-name-kennel-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-name-kennel-compact {
                        font-size: 0.8rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen0 .dog-breed-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-breed-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-breed-compact {
                        font-size: 0.7rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .click-hint-compact,
                    .pedigree-card-compact.horizontal.gen1 .click-hint-compact,
                    .pedigree-card-compact.horizontal.gen2 .click-hint-compact {
                        font-size: 0.6rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .dog-name-kennel-compact {
                        font-size: 0.64rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen3 .dog-breed-compact {
                        font-size: 0.56rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .click-hint-compact {
                        font-size: 0.48rem;
                    }
                    
                    .generation-label {
                        font-size: 0.8rem;
                        padding: 4px 8px;
                        margin-bottom: 8px !important; /* Gelijk voor alle generaties */
                    }
                    
                    /* Popup centering op desktop */
                    .pedigree-popup-container {
                        max-width: 400px !important;
                    }
                }
                
                @media (min-width: 1024px) and (max-width: 1365px) {
                    .pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                    }
                    
                    .pedigree-grid-compact {
                        gap: 15px;
                        padding: 0 12px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 132px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 63px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 132px !important;
                    }
                }
                /* ============================================= */
                /* EINDE DESKTOP STYLES */
                /* ============================================= */
                
                /* POPUP STYLES */
                .pedigree-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1060;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    animation: fadeIn 0.3s;
                    overflow-y: auto;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .pedigree-popup-container {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 350px;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                    margin: auto;
                    position: relative;
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .dog-detail-popup {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .popup-header {
                    background: #0d6efd;
                    color: white;
                    padding: 16px 20px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                .popup-title {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                
                .popup-close {
                    background: none;
                    border: none;
                    font-size: 1.3rem;
                    cursor: pointer;
                    opacity: 0.8;
                    color: white;
                    flex-shrink: 0;
                    margin-left: 15px;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .popup-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                }
                
                .popup-body {
                    padding: 20px;
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
                .dog-popup-name {
                    margin-bottom: 20px;
                }
                
                .dog-popup-name h4 {
                    color: #0d6efd;
                    margin-bottom: 8px;
                    font-size: 1.4rem;
                }
                
                .info-section {
                    margin-bottom: 15px; /* Verminderd van 25px */
                }
                
                .info-section h6 {
                    color: #495057;
                    margin-bottom: 10px; /* Verminderd van 12px */
                    padding-bottom: 6px; /* Verminderd van 8px */
                    border-bottom: 2px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    font-size: 1rem;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px; /* Verminderd van 12px */
                }
                
                @media (min-width: 400px) {
                    .info-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    padding: 6px 0; /* Verminderd van 8px */
                }
                
                .coi-item {
                    grid-column: span 2; /* COI neemt 2 kolommen */
                }
                
                .coi-values {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                
                .coi-value {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .coi-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                }
                
                .coi-badge {
                    flex-shrink: 0;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                    margin-bottom: 2px; /* Verminderd van 4px */
                    line-height: 1.3;
                }
                
                .info-value {
                    color: #212529;
                    font-size: 0.95rem;
                    line-height: 1.3; /* Verminderd van 1.4 */
                    word-break: break-word;
                }
                
                .remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 12px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                .popup-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    background: #f8f9fa;
                    border-radius: 0 0 12px 12px;
                }
                
                .popup-close-btn {
                    min-width: 130px;
                    padding: 10px 25px;
                    font-size: 1rem;
                }
                
                /* Print styles */
                @media print {
                    .modal-dialog {
                        max-width: none;
                        margin: 0;
                    }
                    
                    .modal-header {
                        display: none !important;
                    }
                    
                    .pedigree-container-compact {
                        padding: 0;
                        background: white;
                        height: auto !important;
                        overflow-x: visible !important;
                        height: 100vh !important;
                    }
                    
                    .pedigree-grid-compact {
                        flex-direction: row !important;
                        height: auto;
                        padding: 20px !important;
                        gap: 15px;
                    }
                    
                    .pedigree-generation-col {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .pedigree-card-compact.horizontal {
                        break-inside: avoid;
                        box-shadow: none;
                        border: 1px solid #ccc !important;
                        margin-bottom: 10px;
                    }
                    
                    .main-dog-compact {
                        border: 2px solid #000 !important;
                    }
                }
                
                /* Lege card styling */
                .pedigree-card-compact.horizontal.empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* VISUELE VERBINDINGEN */
                .pedigree-generation-col {
                    position: relative;
                }
                
                .pedigree-generation-col:not(:first-child)::before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 50%;
                    width: 10px;
                    height: 1px;
                    background: #adb5bd;
                    opacity: 0.5;
                }
                
                /* Overgrootouder styling - subtiele opacity */
                .pedigree-card-compact.horizontal.gen3 {
                    opacity: 0.9;
                }
                
                .pedigree-card-compact.horizontal.gen3:hover {
                    opacity: 1;
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupPedigreeModalEvents();
    }
    
    setupPedigreeModalEvents() {
        const modal = document.getElementById('pedigreeModal');
        if (!modal) return;
        
        // Print functionaliteit
        const printBtn = modal.querySelector('.btn-print');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
    
    renderCompactPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        const gridHTML = `
            <div class="pedigree-grid-compact">
                <!-- Generatie 0: Hoofdhond -->
                <div class="pedigree-generation-col gen0">
                    <div class="generation-label">${this.t('currentDog')}</div>
                    ${this.getDogCompactCardHTML(pedigreeTree.mainDog, this.t('mainDog'), true, 0)}
                </div>
                
                <!-- Generatie 1: Ouders -->
                <div class="pedigree-generation-col gen1">
                    <div class="generation-label">${this.t('parents')}</div>
                    ${this.getDogCompactCardHTML(pedigreeTree.father, this.t('father'), false, 1)}
                    ${this.getDogCompactCardHTML(pedigreeTree.mother, this.t('mother'), false, 1)}
                </div>
                
                <!-- Generatie 2: Grootouders -->
                <div class="pedigree-generation-col gen2">
                    <div class="generation-label">${this.t('grandparents')}</div>
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGrandfather, this.t('grandfather'), false, 2)}
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGrandmother, this.t('grandmother'), false, 2)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGrandfather, this.t('grandfather'), false, 2)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGrandmother, this.t('grandmother'), false, 2)}
                </div>
                
                <!-- Generatie 3: Overgrootouders -->
                <div class="pedigree-generation-col gen3">
                    <div class="generation-label">${this.t('greatGrandparents')}</div>
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother'), false, 3)}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        // Add click events to cards
        this.setupCardClickEvents();
    }
    
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.pedigree-card-compact.horizontal:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0) return; // Skip empty cards
                
                const dog = this.getDogById(dogId);
                if (!dog) return;
                
                const relation = card.getAttribute('data-relation') || '';
                this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    showDogDetailPopup(dog, relation) {
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (!overlay || !container) return;
        
        const popupHTML = this.getDogDetailPopupHTML(dog, relation);
        container.innerHTML = popupHTML;
        
        // Show overlay - center in viewport
        overlay.style.display = 'flex';
        
        // Ensure popup is visible and centered
        setTimeout(() => {
            container.style.marginTop = '0';
            container.style.transform = 'translateY(0)';
        }, 10);
        
        // Add close event listeners
        const closeButtons = container.querySelectorAll('.popup-close, .popup-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
        });
        
        // Close when clicking outside popup
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
        
        // Close with Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.style.display = 'none';
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Clean up event listener when popup closes
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    // Helper methodes van BaseModule
    showProgress(message) {
        if (typeof super.showProgress === 'function') {
            super.showProgress(message);
        } else {
            console.log('Progress:', message);
        }
    }
    
    hideProgress() {
        if (typeof super.hideProgress === 'function') {
            super.hideProgress();
        } else {
            console.log('Progress hidden');
        }
    }
    
    showError(message) {
        if (typeof super.showError === 'function') {
            super.showError(message);
        } else {
            console.error('Error:', message);
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (typeof super.showSuccess === 'function') {
            super.showSuccess(message);
        } else {
            console.log('Success:', message);
        }
    }
}