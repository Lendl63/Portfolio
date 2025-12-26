/* ===== CONFIGURATION MODIFIABLE ===== */
const CONFIG = {
    // Couches de particules
    BACKGROUND_STARS: {
        count: 150,
        minSize: 0.5,
        maxSize: 1.5,
        minOpacity: 0.1,
        maxOpacity: 0.4,
        speed: 0.01,
        glow: false
    },
    MID_STARS: {
        count: 80,
        minSize: 1,
        maxSize: 2.5,
        minOpacity: 0.3,
        maxOpacity: 0.7,
        speed: 0.03,
        glow: false
    },
    FOREGROUND_STARS: {
        count: 30,
        minSize: 1.5,
        maxSize: 3.5,
        minOpacity: 0.5,
        maxOpacity: 1,
        speed: 0.05,
        glow: true,
        glowSize: 8
    },
    // Gradient de fond
    GRADIENT: {
        top: '#0a0e27',
        middle: '#1a1f3a',
        bottom: '#0d1425'
    },
    // Interaction souris
    MOUSE_INFLUENCE: 0.3,
    // Performance
    MOBILE_STAR_REDUCTION: 0.5 // 50% d'étoiles sur mobile
};

// ===== DÉTECTION MOBILE =====
const isMobile = () => window.innerWidth < 768 || navigator.userAgent.match(/Android|iPhone|iPad|iPod/i);

// ===== CLASSE PARTICULE =====
        class Star {
            constructor(canvas, config, layer) {
                this.canvas = canvas;
                this.config = config;
                this.layer = layer;

                // Position initiale aléatoire
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.originalX = this.x;
                this.originalY = this.y;

                // Propriétés physiques
                this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
                this.opacity = Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity;
                this.baseOpacity = this.opacity;

                // Animation scintillement
                this.twinklePhase = Math.random() * Math.PI * 2;
                this.twinkleSpeed = Math.random() * 0.02 + 0.01;

                // Mouvement
                this.vx = (Math.random() - 0.5) * config.speed;
                this.vy = (Math.random() - 0.5) * config.speed;
            }

    update(mouseX, mouseY) {
        // Mouvement base
        this.x += this.vx;
        this.y += this.vy;

        // Wrapping écran
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;

        // Influence souris (couches visibles uniquement)
        if (mouseX && mouseY && this.layer >= 1) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 200;

            if (distance < maxDistance) {
                const force = (1 - distance / maxDistance) * CONFIG.MOUSE_INFLUENCE;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
        }

        // Scintillement (sinus)
        this.twinklePhase += this.twinkleSpeed;
        this.opacity = this.baseOpacity * (0.5 + 0.5 * Math.sin(this.twinklePhase));
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';

        // Dessin de base
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow pour les premières couches
        if (this.config.glow) {
            ctx.globalAlpha = this.opacity * 0.3;
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = this.config.glowSize;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
    }
}

// ===== GESTIONNAIRE CANVAS =====
class GalaxyCanvas {
    constructor() {
        this.canvas = document.getElementById('galaxyCanvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.stars = { bg: [], mid: [], fg: [] };
        this.mouseX = null;
        this.mouseY = null;
        this.animationId = null;

        // Initialisation
        this.setupCanvas();
        this.createStars();
        this.setupEventListeners();
        this.animate();
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;

        // Dimensions réelles (physiques)
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        // Dimensions CSS
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        // Scale pour Retina
        this.ctx.scale(dpr, dpr);
        this.logicalWidth = window.innerWidth;
        this.logicalHeight = window.innerHeight;
    }

    createStars() {
        // Vider les étoiles précédentes
        this.stars.bg = [];
        this.stars.mid = [];
        this.stars.fg = [];

        const multiplier = isMobile() ? CONFIG.MOBILE_STAR_REDUCTION : 1;

        // Couche background
        const bgCount = Math.floor(CONFIG.BACKGROUND_STARS.count * multiplier);
        for (let i = 0; i < bgCount; i++) {
            this.stars.bg.push(new Star(
                { width: this.logicalWidth, height: this.logicalHeight },
                CONFIG.BACKGROUND_STARS,
                0
            ));
        }

        // Couche mid
        const midCount = Math.floor(CONFIG.MID_STARS.count * multiplier);
        for (let i = 0; i < midCount; i++) {
            this.stars.mid.push(new Star(
                { width: this.logicalWidth, height: this.logicalHeight },
                CONFIG.MID_STARS,
                1
            ));
        }

        // Couche foreground
        const fgCount = Math.floor(CONFIG.FOREGROUND_STARS.count * multiplier);
        for (let i = 0; i < fgCount; i++) {
            this.stars.fg.push(new Star(
                { width: this.logicalWidth, height: this.logicalHeight },
                CONFIG.FOREGROUND_STARS,
                2
            ));
        }
    }

    drawGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.logicalHeight);
        gradient.addColorStop(0, CONFIG.GRADIENT.top);
        gradient.addColorStop(0.5, CONFIG.GRADIENT.middle);
        gradient.addColorStop(1, CONFIG.GRADIENT.bottom);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
    }

    setupEventListeners() {
        // Mouvement souris
        if (!isMobile()) {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            document.addEventListener('mouseleave', () => {
                this.mouseX = null;
                this.mouseY = null;
            });
        }

        // Redimensionnement
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createStars();
        });
    }

    animate() {
        // Fond gradient
        this.drawGradient();

        // Update et dessin background
        this.stars.bg.forEach(star => {
            star.update(this.mouseX, this.mouseY);
            star.draw(this.ctx);
        });

        // Update et dessin mid-layer
        this.stars.mid.forEach(star => {
            star.update(this.mouseX, this.mouseY);
            star.draw(this.ctx);
        });

        // Update et dessin foreground
        this.stars.fg.forEach(star => {
            star.update(this.mouseX, this.mouseY);
            star.draw(this.ctx);
        });

        // Boucle animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
    }
}

// ===== INITIALISATION =====
let galaxyCanvas = null;

document.addEventListener('DOMContentLoaded', () => {
    galaxyCanvas = new GalaxyCanvas();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (galaxyCanvas) {
        galaxyCanvas.destroy();
    }
});