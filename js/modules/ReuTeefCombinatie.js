async showHondDetails(elementId, hond, type) {
    const t = this.t.bind(this);
    const detailsContainer = document.getElementById(elementId);
    
    // Verberg de zoekresultaten container
    const resultsId = elementId.replace('Details', 'SearchResults');
    const resultsContainer = document.getElementById(resultsId);
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
    
    // Toon details container
    detailsContainer.classList.remove('d-none');
    
    // 🔴 CRITIEK: HAAL DE VOLLEDIGE HOND GEGEVENS OP UIT DE DATABASE
    // Dit zorgt ervoor dat we altijd de complete gezondheidsinformatie hebben
    const fullHond = await this.getHondByIdFromDb(hond.id);
    
    // Gebruik de volledige hond informatie voor de details
    const displayHond = fullHond || hond;
    
    // Haal ouders informatie op
    const oudersInfo = await this.getOudersInfo(displayHond);
    
    detailsContainer.innerHTML = `
        <div class="dog-details-card">
            <div class="dog-details-header">
                <div class="dog-details-name">${displayHond.naam || 'Onbekend'}</div>
                ${displayHond.kennelnaam ? `<div class="dog-details-subtitle">${displayHond.kennelnaam}</div>` : ''}
                
                <div class="dog-details-info mt-3">
                    ${displayHond.stamboomnr ? `
                        <div class="info-item">
                            <i class="bi bi-card-checklist"></i>
                            <span>${displayHond.stamboomnr}</span>
                        </div>
                    ` : ''}
                    
                    ${displayHond.ras ? `
                        <div class="info-item">
                            <i class="bi bi-tag"></i>
                            <span>${displayHond.ras}</span>
                        </div>
                    ` : ''}
                    
                    <div class="info-item">
                        <i class="bi bi-gender-${type === 'teef' ? 'female' : 'male'}"></i>
                        <span>${type === 'teef' ? t('genderTeef') : t('genderReu')}</span>
                    </div>
                    
                    ${displayHond.geboortedatum ? `
                        <div class="info-item">
                            <i class="bi bi-calendar"></i>
                            <span>${new Date(displayHond.geboortedatum).toLocaleDateString(this.currentLang)}</span>
                        </div>
                    ` : ''}
                    
                    ${displayHond.vachtkleur ? `
                        <div class="info-item">
                            <i class="bi bi-palette"></i>
                            <span>${displayHond.vachtkleur}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="dog-details-row">
                <div class="dog-details-label">${t('parents')}:</div>
                <div class="dog-details-value">
                    <div class="row">
                        ${oudersInfo.vader ? `
                            <div class="col-md-6 mb-2">
                                <strong>${t('fatherLabel')}:</strong><br>
                                ${oudersInfo.vader.naam || 'Onbekend'}
                                ${oudersInfo.vader.stamboomnr ? `(${oudersInfo.vader.stamboomnr})` : ''}
                            </div>
                        ` : `
                            <div class="col-md-6 mb-2">
                                <strong>${t('fatherLabel')}:</strong><br>
                                <span class="text-muted">${t('unknownAncestor')}</span>
                            </div>
                        `}
                        
                        ${oudersInfo.moeder ? `
                            <div class="col-md-6 mb-2">
                                <strong>${t('motherLabel')}:</strong><br>
                                ${oudersInfo.moeder.naam || 'Onbekend'}
                                ${oudersInfo.moeder.stamboomnr ? `(${oudersInfo.moeder.stamboomnr})` : ''}
                            </div>
                        ` : `
                            <div class="col-md-6 mb-2">
                                <strong>${t('motherLabel')}:</strong><br>
                                <span class="text-muted">${t('unknownAncestor')}</span>
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            ${displayHond.heupdysplasie || displayHond.elleboogdysplasie || displayHond.patella || displayHond.ogen || displayHond.dandyWalker || displayHond.schildklier ? `
                <div class="dog-details-row">
                    <div class="dog-details-label">${t('healthInfo')}:</div>
                    <div class="dog-details-value">
                        <div class="row">
                            ${displayHond.heupdysplasie ? `
                                <div class="col-md-6 mb-2">
                                    <strong>HD:</strong> ${displayHond.heupdysplasie}
                                </div>
                            ` : ''}
                            
                            ${displayHond.elleboogdysplasie ? `
                                <div class="col-md-6 mb-2">
                                    <strong>ED:</strong> ${displayHond.elleboogdysplasie}
                                </div>
                            ` : ''}
                            
                            ${displayHond.patella ? `
                                <div class="col-md-6 mb-2">
                                    <strong>Patella:</strong> ${displayHond.patella}
                                </div>
                            ` : ''}
                            
                            ${displayHond.ogen ? `
                                <div class="col-md-6 mb-2">
                                    <strong>Ogen:</strong> ${displayHond.ogen}
                                    ${displayHond.ogenVerklaring ? `<br><small>${displayHond.ogenVerklaring}</small>` : ''}
                                </div>
                            ` : ''}
                            
                            ${displayHond.dandyWalker ? `
                                <div class="col-md-6 mb-2">
                                    <strong>Dandy Walker:</strong> ${displayHond.dandyWalker}
                                </div>
                            ` : ''}
                            
                            ${displayHond.schildklier ? `
                                <div class="col-md-6 mb-2">
                                    <strong>Schildklier:</strong> ${displayHond.schildkl