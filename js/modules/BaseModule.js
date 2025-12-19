/**
 * Base Module Class
 * Basis functionaliteit voor alle modules
 */

class BaseModule {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = {};
        this.auth = window.auth || null;
        this.db = window.db || null;
        this.uiHandler = null;
    }
    
    t(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('appLanguage', lang);
    }
    
    showAlert(message, type = 'info', duration = 3000) {
        if (this.uiHandler && this.uiHandler.showAlert) {
            this.uiHandler.showAlert(message, type, duration);
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        this.showAlert(message, 'danger', 5000);
    }
    
    showSuccess(message) {
        this.showAlert(message, 'success', 3000);
    }
    
    showProgress(message) {
        if (this.uiHandler && this.uiHandler.showProgress) {
            this.uiHandler.showProgress(message);
        } else {
            console.log('Progress:', message);
        }
    }
    
    hideProgress() {
        if (this.uiHandler && this.uiHandler.hideProgress) {
            this.uiHandler.hideProgress();
        }
    }
    
    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    formatDate(dateString, format = 'short') {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(this.currentLang, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString(this.currentLang, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validateRequired(fields) {
        for (const [field, value] of Object.entries(fields)) {
            if (!value || value.toString().trim() === '') {
                return { valid: false, field: field, message: `${field} is verplicht` };
            }
        }
        return { valid: true };
    }
    
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    getRandomId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    
    truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
    
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (ua.indexOf('Safari') > -1) browser = 'Safari';
        else if (ua.indexOf('Edge') > -1) browser = 'Edge';
        else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) browser = 'IE';
        
        return browser;
    }
    
    generateColorFromString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 60%)`;
    }
}

// GLOBALE EXPORT - DIT MOET ALLEEN AAN HET EINDE STAAN

// Global export
if (typeof window !== 'undefined') {
    window.BaseModule = BaseModule;
}
