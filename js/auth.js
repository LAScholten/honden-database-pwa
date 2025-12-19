# 1. Ga naar de juiste directory
cd /d/appProjecten/honden-database-pwa

# 2. Maak het nieuwe auth.js bestand
cat > js/auth.js << 'EOF'
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
            } catch (error) {
                localStorage.removeItem('currentUser');
            }
        }
    }

    login(username, password) {
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = { username: 'admin', role: 'admin' };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return true;
        } else if (username === 'user' && password === 'user123') {
            this.currentUser = { username: 'user', role: 'user' };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isLoggedIn() {
        return this.isAuthenticated();
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

if (typeof window !== 'undefined') {
    window.auth = new AuthManager();
}
EOF

# 3. Commit en push
git add js/auth.js
git commit -m "FIX: Working auth.js with proper global auth object"
git push origin main