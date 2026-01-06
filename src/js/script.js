/*===== Animation des .stats-card =====*/
/**
 * @param {HTMLElement} statsGrid 
 */
function animateCounters(statsGrid) {
    // dataset values are strings; treat any truthy value as already animated
    if (statsGrid.dataset.animated) return;
    statsGrid.dataset.animated = "true";

    const counters = statsGrid.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = Number(counter.dataset.target);
        let current = 0;

        // Nombre d'étapes visuelles plus grand = plus fluide
        const steps = 80;
        const increment = target / steps;

        function updateCounter() {
            current += increment;

            if (current < target) {
                counter.textContent = Math.floor(current);

                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        updateCounter();
    });
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains("stats-grid")) {
            animateCounters(entry.target);
        }
    });
}, {threshold: 0.5});

// Only observe if the element exists to avoid runtime errors
const statsGridEl = document.querySelector('.stats-grid');
if (statsGridEl) observer.observe(statsGridEl);

/* ===== Lazy-load contact form script when needed ===== */
let formLoaded = false;
function loadFormScript() {
    if (formLoaded) return;
    formLoaded = true;
    const s = document.createElement('script');
    s.src = 'src/js/form.js';
    s.defer = true;
    document.body.appendChild(s);
}

// Load when contact section is visible
const contactSection = document.getElementById('contact');
if (contactSection) {
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                loadFormScript();
                contactObserver.unobserve(contactSection);
            }
        });
    }, { root: null, threshold: 0.1 });
    contactObserver.observe(contactSection);
}

// Also attach to contact buttons (fast path)
document.querySelectorAll('.contact-btn, .btn-text[onclick*="#contact"]').forEach(btn => {
    btn.addEventListener('click', () => loadFormScript(), { once: true });
});

/* ===== Toggle background animations (for performance/user control) ===== */
const toggleBtn = document.getElementById('toggle-animations');
if (toggleBtn) {
    const updateState = () => {
        const disabled = localStorage.getItem('disableCanvas') === 'true';
        toggleBtn.setAttribute('aria-pressed', String(!disabled));
        toggleBtn.textContent = disabled ? 'Animations: Off' : 'Animations';
        // broadcast
        window.__disableCanvas = disabled;
        document.dispatchEvent(new CustomEvent('canvas:toggle', { detail: { disabled } }));
    };
    toggleBtn.addEventListener('click', () => {
        const current = localStorage.getItem('disableCanvas') === 'true';
        localStorage.setItem('disableCanvas', (!current).toString());
        updateState();
    });
    updateState();
}