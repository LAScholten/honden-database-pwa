/**
 * DEFINITIEVE FIX VOOR BOOTSTRAP MODAL ARIA-HIDDEN BUG
 * Deze fix werkt op ATOMIEM niveau - patcht Bootstrap intern
 */

// ========== DEEL 1: CRITICAL BOOTSTRAP PATCH ==========
(function() {
    console.log('🔧 Bootstrap Modal Atomic Patch installeren...');
    
    if (typeof bootstrap === 'undefined' || !bootstrap.Modal) {
        console.error('Bootstrap niet gevonden');
        return;
    }
    
    const Modal = bootstrap.Modal;
    
    // ===== PATCH 1: VERVANG COMPLEET _showElement =====
    const originalShowElement = Modal.prototype._showElement;
    Modal.prototype._showElement = function() {
        console.log(`🔄 Modal show: ${this._element?.id || 'unknown'}`);
        
        // CRITICAL: Verwijder aria-hidden VOORDAT modal getoond wordt
        this._element.removeAttribute('aria-hidden');
        this._element.setAttribute('aria-modal', 'true');
        
        // Voeg inert attribute toe als ondersteund
        if ('inert' in HTMLElement.prototype) {
            this._element.inert = false;
        }
        
        // Roep originele functie aan
        return originalShowElement.call(this);
    };
    
    // ===== PATCH 2: VERVANG COMPLEET hide =====
    const originalHide = Modal.prototype.hide;
    Modal.prototype.hide = function() {
        const modal = this._element;
        const modalId = modal?.id || 'unknown';
        console.log(`🔒 Modal hide start: ${modalId}`);
        
        // CRITICAL: Verwijder focus van ALLES in modal VOORDAT hide
        if (modal) {
            // 1. Verwijder focus van close buttons en andere elementen
            const focused = modal.querySelector(':focus');
            if (focused) {
                console.log(`🔍 Focus verwijderen van:`, focused);
                focused.blur();
            }
            
            // 2. Forceer focus op body
            document.body.focus();
            
            // 3. Verwijder alle event listeners van close buttons
            const closeButtons = modal.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]');
            closeButtons.forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
            });
        }
        
        // Roep originele hide aan
        const result = originalHide.call(this);
        
        // CRITICAL: Zet aria-hidden pas NA hide completion
        setTimeout(() => {
            if (modal && !modal.classList.contains('show')) {
                console.log(`✅ Modal hidden: ${modalId} - aria-hidden=true`);
                modal.setAttribute('aria-hidden', 'true');
                modal.removeAttribute('aria-modal');
                
                if ('inert' in HTMLElement.prototype) {
                    modal.inert = true;
                }
                
                // Cleanup backdrops
                cleanupModalBackdrops();
            }
        }, 150);
        
        return result;
    };
    
    // ===== PATCH 3: VERVANG _enforceFocus =====
    Modal.prototype._enforceFocus = function() {
        try {
            // Skip focus enforcement als modal niet getoond wordt
            if (!this._element || !this._element.classList.contains('show')) {
                return;
            }
            
            // Original logic maar zonder errors
            const isActive = this._element === document.activeElement || 
                            this._element.contains(document.activeElement);
            
            if (!isActive) {
                const firstFocusable = this._element.querySelector(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (firstFocusable) {
                    firstFocusable.focus();
                } else {
                    this._element.focus();
                }
            }
        } catch (error) {
            console.warn('Focus enforcement error:', error);
        }
    };
    
    console.log('✅ Bootstrap Modal Atomic Patch geïnstalleerd');
})();

// ========== DEEL 2: DIRECTE MODAL MANIPULATIE ==========
(function fixAllModalsOnPage() {
    // Deze functie draait direct als de pagina laadt
    console.log('🔍 Alle modals op pagina fixen...');
    
    function applyModalFix(modal) {
        const modalId = modal.id || 'anonymous-modal';
        
        // 1. Verwijder ALLE Bootstrap data attributes die problemen veroorzaken
        modal.removeAttribute('data-bs-backdrop');
        modal.removeAttribute('data-bs-keyboard');
        modal.removeAttribute('data-bs-focus');
        
        // 2. Zet onze eigen attributes
        modal.setAttribute('data-bs-backdrop', 'static');
        modal.setAttribute('data-bs-keyboard', 'false');
        modal.setAttribute('data-bs-focus', 'false');
        
        // 3. Verwijder aria-hidden (Bootstrap zal dit zelf zetten)
        modal.removeAttribute('aria-hidden');
        
        // 4. Voeg directe event listeners toe aan close buttons
        const closeButtons = modal.querySelectorAll('.btn-close');
        closeButtons.forEach(btn => {
            // Verwijder bestaande listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Voeg onze listener toe
            newBtn.addEventListener('click', function(e) {
                console.log(`🔘 Close button clicked: ${modalId}`);
                
                // DIRECTE FIX: Verwijder focus onmiddellijk
                this.blur();
                document.body.focus();
                
                // DIRECTE FIX: Verwijder aria-hidden onmiddellijk
                modal.removeAttribute('aria-hidden');
                
                // Forceer modal hide via Bootstrap
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                }
            });
        });
        
        console.log(`✅ Modal gefixt: ${modalId}`);
    }
    
    // Fix bestaande modals
    document.querySelectorAll('.modal').forEach(applyModalFix);
    
    // Fix nieuwe modals die later worden toegevoegd
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    if (node.classList && node.classList.contains('modal')) {
                        applyModalFix(node);
                    }
                    node.querySelectorAll?.('.modal').forEach(applyModalFix);
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ========== DEEL 3: GLOBAL EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM geladen - Global listeners installeren');
    
    // GLOBAL HIDE LISTENER - vangt ALLE modal hides
    document.addEventListener('hide.bs.modal', function(event) {
        const modal = event.target;
        console.log(`🌑 Global hide event: ${modal.id}`);
        
        // ATOMIEKE FOCUS VERWIJDERING
        const focused = modal.querySelector(':focus');
        if (focused) {
            focused.blur();
            console.log(`👋 Focus verwijderd van element in ${modal.id}`);
        }
        document.body.focus();
        
        // FORCEER aria-hidden removal
        modal.removeAttribute('aria-hidden');
    });
    
    // GLOBAL HIDDEN LISTENER
    document.addEventListener('hidden.bs.modal', function(event) {
        const modal = event.target;
        console.log(`🌌 Global hidden event: ${modal.id}`);
        
        // Cleanup na 100ms
        setTimeout(() => {
            // Alleen aria-hidden zetten als modal echt hidden is
            if (!modal.classList.contains('show')) {
                modal.setAttribute('aria-hidden', 'true');
            }
            
            // Backdrop cleanup
            cleanupModalBackdrops();
        }, 100);
    });
    
    // EMERGENCY CLEANUP BUTTON
    createEmergencyButton();
    
    // SERVICE WORKER DISABLE
    disableServiceWorkers();
});

// ========== DEEL 4: CLEANUP FUNCTIES ==========
function cleanupModalBackdrops() {
    setTimeout(() => {
        const openModals = document.querySelectorAll('.modal.show');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        
        console.log(`🧹 Cleanup: ${openModals.length} modals open, ${backdrops.length} backdrops`);
        
        if (openModals.length === 0 && backdrops.length > 0) {
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.cssText = '';
            console.log('✅ Backdrops opgeruimd');
        }
    }, 50);
}

function createEmergencyButton() {
    // Verwijder oude button
    const oldBtn = document.getElementById('nuclearFixBtn');
    if (oldBtn) oldBtn.remove();
    
    // Maak nieuwe button
    const btn = document.createElement('button');
    btn.id = 'nuclearFixBtn';
    btn.innerHTML = '💥 NUCLEAR FIX';
    btn.title = 'Klik bij aria-hidden errors';
    btn.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        z-index: 99999;
        background: linear-gradient(45deg, #ff0000, #dc3545);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
        display: none;
        animation: pulse 2s infinite;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5); }
            50% { transform: scale(1.05); box-shadow: 0 6px 25px rgba(255, 0, 0, 0.7); }
            100% { transform: scale(1); box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5); }
        }
    `;
    document.head.appendChild(style);
    
    btn.addEventListener('click', function() {
        console.log('💣 NUCLEAR FIX geactiveerd!');
        
        // STAP 1: Verwijder ALLE backdrops
        document.querySelectorAll('.modal-backdrop').forEach(b => {
            b.style.transition = 'opacity 0.3s';
            b.style.opacity = '0';
            setTimeout(() => b.remove(), 300);
        });
        
        // STAP 2: Sluit ALLE modals
        document.querySelectorAll('.modal').forEach(modal => {
            // Verwijder aria-hidden van ALLE modals
            modal.removeAttribute('aria-hidden');
            
            if (modal.classList.contains('show')) {
                // Bootstrap modal sluiten
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    try { bsModal.hide(); } catch(e) {}
                }
                
                // Forceer hide
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
        });
        
        // STAP 3: Reset body
        document.body.classList.remove('modal-open');
        document.body.style.cssText = '';
        
        // STAP 4: Forceer reflow
        document.body.offsetHeight;
        
        // STAP 5: Verwijder de button tijdelijk
        btn.style.display = 'none';
        setTimeout(() => {
            if (document.querySelectorAll('.modal.show').length > 0) {
                btn.style.display = 'block';
            }
        }, 1000);
        
        console.log('✅ Nuclear fix voltooid');
    });
    
    document.body.appendChild(btn);
    
    // Show/hide button based on modal state
    setInterval(() => {
        const hasOpenModals = document.querySelectorAll('.modal.show').length > 0;
        btn.style.display = hasOpenModals ? 'block' : 'none';
    }, 500);
}

function disableServiceWorkers() {
    if ('serviceWorker' in navigator) {
        // Verwijder bestaande SWs
        navigator.serviceWorker.getRegistrations().then(regs => {
            regs.forEach(reg => reg.unregister());
        });
        
        // Blokkeer nieuwe registraties
        navigator.serviceWorker.register = () => {
            return Promise.reject(new Error('SW disabled'));
        };
    }
}

// ========== DEEL 5: ONLINE/OFFLINE ==========
window.addEventListener('online', () => {
    console.log('🌐 Online');
    showNotification('Online - verbinding hersteld', 'success');
});

window.addEventListener('offline', () => {
    console.log('📴 Offline');
    showNotification('Offline - geen internet', 'warning');
});

function showNotification(message, type) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-warning';
    const icon = type === 'success' ? 'bi-wifi' : 'bi-wifi-off';
    
    const html = `
        <div class="alert ${alertClass} alert-dismissible fade show m-3">
            <i class="bi ${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', html);
    
    setTimeout(() => {
        const alert = document.querySelector(`.${alertClass}`);
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 3000);
}

console.log('🎯 Modal Fix System geladen - klaar voor gebruik!');