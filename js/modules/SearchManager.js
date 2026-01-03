    // NIEUWE METHODE: Setup event listeners voor modal sluiten
    setupModalCloseEvents() {
        // Event listener voor wanneer de modal gesloten wordt
        const searchModal = document.getElementById('searchModal');
        if (searchModal) {
            searchModal.addEventListener('hidden.bs.modal', () => {
                // Wacht 100ms om zeker te zijn dat de modal volledig gesloten is
                setTimeout(() => {
                    this.resetSearchState();
                }, 100);
            });
        }
        
        // Event listeners voor sluitknoppen
        const closeBtn = document.getElementById('searchModalCloseBtn');
        const closeBtnFooter = document.getElementById('searchModalCloseBtnFooter');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Wacht even voordat we resetten
                setTimeout(() => {
                    this.resetSearchState();
                }, 50);
            });
        }
        
        if (closeBtnFooter) {
            closeBtnFooter.addEventListener('click', () => {
                // Wacht even voordat we resetten
                setTimeout(() => {
                    this.resetSearchState();
                }, 50);
            });
        }
    }