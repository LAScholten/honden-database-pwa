class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        console.log(`COICalculator V3: ${this._dogMap.size} honden geladen`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        dogId = Number(dogId);
        if (!dogId) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`Hond ${dogId} niet gevonden`);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        console.log(`📊 COI voor: ${dog.naam} (ID: ${dog.id})`);
        console.log(`   Ouders: vader=${dog.vaderId}, moeder=${dog.moederId}`);

        // BASISGEWALEN
        if (!dog.vaderId || !dog.moederId) {
            console.log(`   -> Geen ouders -> 0%`);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        if (dog.vaderId === dog.moederId) {
            console.log(`   -> Zelfde ouders -> 25%`);
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) {
            console.log(`   -> Ouders niet gevonden -> 0%`);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        console.log(`   Vader: ${vader.naam} (${vader.id})`);
        console.log(`   Moeder: ${moeder.naam} (${moeder.id})`);

        // VOLLE BROER/ZUS
        if (vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId &&
            vader.moederId && moeder.moederId && vader.moederId === moeder.moederId) {
            console.log(`   -> Ouders zijn volle broer/zus -> 25%`);
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }

        // HALF BROER/ZUS
        if ((vader.vaderId && moeder.vaderId && vader.vaderId === moeder.vaderId) ||
            (vader.moederId && moeder.moederId && vader.moederId === moeder.moederId)) {
            console.log(`   -> Ouders zijn half broer/zus -> 12.5%`);
            return { coi6Gen: '12.5', coiAllGen: '12.5' };
        }

        // COMPLEXE BEREKENING - Vind gemeenschappelijke voorouders
        console.log(`   -> Complex geval: zoek gemeenschappelijke voorouders`);
        
        // Zoek alle voorouders van vader (max 6 generaties)
        const vaderVoorouders = this._zoekAlleVoorouders(dog.vaderId, 6);
        console.log(`   Voorouders vader (${vader.naam}): ${vaderVoorouders.size}`);
        
        // Zoek alle voorouders van moeder (max 6 generaties)
        const moederVoorouders = this._zoekAlleVoorouders(dog.moederId, 6);
        console.log(`   Voorouders moeder (${moeder.naam}): ${moederVoorouders.size}`);
        
        // Vind gemeenschappelijke voorouders
        const gemeenschappelijk = new Set();
        for (const voorouder of vaderVoorouders) {
            if (moederVoorouders.has(voorouder)) {
                gemeenschappelijk.add(voorouder);
                console.log(`   Gemeenschappelijke voorouder gevonden: ID ${voorouder}`);
            }
        }
        
        console.log(`   Totaal gemeenschappelijke voorouders: ${gemeenschappelijk.size}`);
        
        if (gemeenschappelijk.size === 0) {
            console.log(`   -> Geen gemeenschappelijke voorouders gevonden -> 0%`);
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        // Bereken COI volgens Wright's formule: Σ(0.5)^(n1+n2+1)
        let totaleCOI = 0;
        
        for (const voorouderId of gemeenschappelijk) {
            // Vind de afstand van vader naar voorouder
            const afstandViaVader = this._zoekAfstand(dog.vaderId, voorouderId, 6);
            // Vind de afstand van moeder naar voorouder
            const afstandViaMoeder = this._zoekAfstand(dog.moederId, voorouderId, 6);
            
            if (afstandViaVader > 0 && afstandViaMoeder > 0) {
                const bijdrage = Math.pow(0.5, afstandViaVader + afstandViaMoeder + 1);
                console.log(`   Voorouder ${voorouderId}: afstand ${afstandViaVader}+${afstandViaMoeder}, bijdrage: ${(bijdrage*100).toFixed(3)}%`);
                totaleCOI += bijdrage;
                
                // Voeg COI van de voorouder zelf toe (recursief)
                const voorouderCOI = this._berekenVoorouderCOI(voorouderId, Math.max(afstandViaVader, afstandViaMoeder));
                totaleCOI += bijdrage * voorouderCOI;
            }
        }
        
        const resultaat = (totaleCOI * 100).toFixed(1);
        console.log(`   ✅ TOTAAL COI voor ${dog.naam}: ${resultaat}%`);
        console.log(`=======================================`);
        
        return {
            coi6Gen: resultaat,
            coiAllGen: resultaat
        };
    }

    _zoekAlleVoorouders(startId, maxDiepte, huidigeDiepte = 0, resultaat = new Set()) {
        if (!startId || huidigeDiepte >= maxDiepte) return resultaat;
        
        const hond = this.getDogById(startId);
        if (!hond) return resultaat;
        
        if (hond.vaderId) {
            resultaat.add(hond.vaderId);
            this._zoekAlleVoorouders(hond.vaderId, maxDiepte, huidigeDiepte + 1, resultaat);
        }
        
        if (hond.moederId) {
            resultaat.add(hond.moederId);
            this._zoekAlleVoorouders(hond.moederId, maxDiepte, huidigeDiepte + 1, resultaat);
        }
        
        return resultaat;
    }

    _zoekAfstand(startId, doelId, maxDiepte, huidigeDiepte = 0, bezocht = new Set()) {
        if (!startId || huidigeDiepte > maxDiepte || bezocht.has(startId)) return -1;
        
        if (startId === doelId) return huidigeDiepte;
        
        bezocht.add(startId);
        
        const hond = this.getDogById(startId);
        if (!hond) return -1;
        
        if (hond.vaderId) {
            const viaVader = this._zoekAfstand(hond.vaderId, doelId, maxDiepte, huidigeDiepte + 1, new Set(bezocht));
            if (viaVader > 0) return viaVader;
        }
        
        if (hond.moederId) {
            const viaMoeder = this._zoekAfstand(hond.moederId, doelId, maxDiepte, huidigeDiepte + 1, new Set(bezocht));
            if (viaMoeder > 0) return viaMoeder;
        }
        
        return -1;
    }

    _berekenVoorouderCOI(voorouderId, maxDiepte) {
        if (!voorouderId || maxDiepte <= 0) return 0;
        
        const voorouder = this.getDogById(voorouderId);
        if (!voorouder || !voorouder.vaderId || !voorouder.moederId) return 0;
        
        if (voorouder.vaderId === voorouder.moederId) return 0.25;
        
        const vooroudersVader = this._zoekAlleVoorouders(voorouder.vaderId, maxDiepte - 1);
        const vooroudersMoeder = this._zoekAlleVoorouders(voorouder.moederId, maxDiepte - 1);
        
        const gemeenschappelijk = new Set();
        for (const v of vooroudersVader) {
            if (vooroudersMoeder.has(v)) {
                gemeenschappelijk.add(v);
            }
        }
        
        let totaal = 0;
        for (const g van gemeenschappelijk) {
            const afstandV = this._zoekAfstand(voorouder.vaderId, g, maxDiepte - 1);
            const afstandM = this._zoekAfstand(voorouder.moederId, g, maxDiepte - 1);
            
            if (afstandV > 0 && afstandM > 0) {
                totaal += Math.pow(0.5, afstandV + afstandM + 1);
            }
        }
        
        return totaal;
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

window.COICalculator = COICalculator;