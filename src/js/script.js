/*===== Animation des .stats-card =====*/
/**
 * @param {HTMLElement} statsGrid 
 */
function animateCounters(statsGrid) {
    if (statsGrid.dataset.animated === true) return;
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

observer.observe(document.querySelector('.stats-grid'));