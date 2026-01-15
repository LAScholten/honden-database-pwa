/**
 * Installatie Wizard voor PWA installatie instructies
 * Bestand: js/installatie-wizard.js
 */

class InstallatieWizard {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        this.setupInstallatieWizard();
    }
    
    setupInstallatieWizard() {
        // Installatie wizard CSS styling
        this.injectStyles();
        
        // Maak de wizard beschikbaar in window object
        window.installatieWizard = this;
    }
    
    injectStyles() {
        // De CSS is al in de app.html ingevoegd, dus hier niet nodig
        console.log('🎨 Installatie Wizard styles zijn al in app.html');
    }
    
    /**
     * Toon installatie instructies
     */
    showInstallInstructions() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let stepsHTML = '';
        
        if (isMobile) {
            // Mobiele instructies
            if (isIOS) {
                stepsHTML = `
                    <div class="step">
                        <span class="step-number">1</span> Druk op het <strong>deel icoon</strong> <i class="bi bi-share"></i> onderin Safari
                    </div>
                    <div class="step">
                        <span class="step-number">2</span> Scroll naar beneden en klik op <strong>"Toevoegen aan beginscherm"</strong>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span> Klik op <strong>"Toevoegen"</strong> in de popup
                    </div>
                    <div class="step">
                        <span class="step-number">4</span> De app verschijnt nu op je beginscherm!
                    </div>
                `;
            } else if (isAndroid) {
                stepsHTML = `
                    <div class="step">
                        <span class="step-number">1</span> Druk op de <strong>3 puntjes</strong> <i class="bi bi-three-dots-vertical"></i> in Chrome
                    </div>
                    <div class="step">
                        <span class="step-number">2</span> Kies <strong>"Toevoegen aan beginscherm"</strong>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span> Klik op <strong>"Toevoegen"</strong>
                    </div>
                    <div class="step">
                        <span class="step-number">4</span> De app verschijnt nu op je beginscherm!
                    </div>
                `;
            }
        } else {
            // Desktop instructies
            stepsHTML = `
                <div class="step">
                    <span class="step-number">1</span> Zoek in je browser naar de <strong>installatie knop</strong>:
                </div>
                <div class="row text-center mt-3">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <i class="bi bi-browser-chrome" style="font-size: 2rem; color: #4285f4;"></i>
                                <h6>Chrome</h6>
                                <small>Klik op install icoon rechts van adresbalk</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <i class="bi bi-browser-edge" style="font-size: 2rem; color: #0078d7;"></i>
                                <h6>Edge</h6>
                                <small>Klik op "+" icoon rechts van adresbalk</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <i class="bi bi-apple" style="font-size: 2rem;"></i>
                                <h6>Safari</h6>
                                <small>Kies "Toevoegen aan Dock" in menu</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="step mt-3">
                    <span class="step-number">2</span> Als er geen installatie knop verschijnt:
                    <ul class="mt-2">
                        <li>Druk op <kbd>F12</kbd> voor Developer Tools</li>
                        <li>Ga naar tab <strong>"Application"</strong></li>
                        <li>Klik op <strong>"Install"</strong> knop</li>
                    </ul>
                </div>
            `;
        }
        
        // Toon de modal
        const installStepsElement = document.getElementById('installSteps');
        if (installStepsElement) {
            installStepsElement.innerHTML = stepsHTML;
        }
        
        const installModal = new bootstrap.Modal(document.getElementById('installModal'));
        installModal.show();
        
        // Probeer ook automatische browser prompt als die beschikbaar is
        this.tryBrowserInstallPrompt();
    }
    
    /**
     * Probeer automatische browser installatie prompt
     */
    tryBrowserInstallPrompt() {
        if (window.deferredPrompt) {
            setTimeout(() => {
                window.deferredPrompt.prompt();
            }, 1000);
        }
    }
    
    /**
     * Update installatie knop tekst als PWA installatie beschikbaar is
     */
    updateInstallButtonText() {
        const updateButton = (btn) => {
            if (btn) {
                btn.innerHTML = '<i class="bi bi-download"></i> Klik om te Installeren';
                btn.classList.add('btn-warning');
            }
        };
        
        updateButton(document.getElementById('pwaInstallBtn'));
        updateButton(document.getElementById('pwaInstallBtnMobile'));
    }
    
    /**
     * Update knop naar "geïnstalleerd" status
     */
    markAsInstalled() {
        const updateButton = (btn) => {
            if (btn) {
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Geïnstalleerd!';
                btn.classList.remove('btn-warning', 'btn-success');
                btn.classList.add('btn-secondary');
                btn.disabled = true;
            }
        };
        
        updateButton(document.getElementById('pwaInstallBtn'));
        updateButton(document.getElementById('pwaInstallBtnMobile'));
    }
}

// Auto-initialiseer de wizard wanneer het script wordt geladen
document.addEventListener('DOMContentLoaded', function() {
    new InstallatieWizard();
});