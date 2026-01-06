/*===== Navigation avec nav du header =====*/

/*===== Ouverture de la modal =====*/
const openModal = () => {
    const modalNav = document.querySelector('.modal-nav');
    const navMenu = document.querySelector('.nav-menu');
    navMenu.innerHTML = "&times;";
    navMenu.setAttribute('aria-expanded', 'true');
    modalNav.classList.add('active');
}

/*===== Fermeture de la modal =====*/
const closeModal = () => {
    const modalNav = document.querySelector('.modal-nav');
    const navMenu = document.querySelector('.nav-menu');
    navMenu.innerHTML = "&#9776;";
    navMenu.setAttribute('aria-expanded', 'false');
    modalNav.classList.remove('active');
}

const isDesktop = () => {
    const width = window.innerWidth;
    const navDiv = document.querySelector('.nav-div');
    const navMenu = document.querySelector('.nav-menu');

    if (width < 1025) {
        navDiv.style.display = "none";
        navMenu.style.display = "flex";
    } else {
        navDiv.style.display = "flex";
        navMenu.style.display = "none";
    }
}

/*===== Throttle helper pour performance =====*/
const throttle = (func, delay) => {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
};

/*===== Ajout de l'évenement au lien =====*/
let count = 0; // Compter les click sur .nav-menu

document.querySelector('.nav-menu').addEventListener('click', () => {
    count++;
    if (count === 1) {
        openModal();
    }
    if (count === 2) {
        closeModal();
        count = 0;
    }
});
const modalNavLinks = document.querySelectorAll('.modal-nav-link');

modalNavLinks.forEach(link => {
    // passive is safe here because we don't call preventDefault in closeModal
    link.addEventListener('click', closeModal, { passive: true });
});

/*===== Application du responsive (nav modal) sur tablette et modile =====*/
window.addEventListener('resize', throttle(isDesktop, 250));
isDesktop();



/*===== ANIMATION DES SECTIONS AU SCROLL =====*/
const sectionObserver = new IntersectionObserver( function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('show'); //appliquer l'animation
            observer.unobserve(entry.target); //ne repete pas l'animation
        }
    });
},{threshold: 0.4}); // section visible a 40%

const fadeEls = document.querySelectorAll('.fade-in');

fadeEls.forEach(fader => {
    sectionObserver.observe(fader);
});


/*===== ANIMATION NAV LINKS AU SCROLL =====*/

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const options = {
    root: null,
    threshold: 0.4,
}

const navObserver = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id"); // recuperation de l'id de la section observé

            // retire la class 'active de tous les liens        }
            navLinks.forEach((link) => {
                link.classList.remove("active");

                // Ajout de la classe active au lien correcpondant
                if (link.getAttribute("href") === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, options);

// observation de toutes les sections
sections.forEach((section) => {
    navObserver.observe(section);
});