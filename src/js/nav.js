/*===== Navigation avec nav du header =====*/

/*===== Ouverture de la modal =====*/
const openModal = () => {
    const modalNav = document.querySelector('.modal-nav');
    const navMenu = document.querySelector('.nav-menu');
    navMenu.innerHTML = "&times;";
    modalNav.classList.add('active');
}

/*===== Fermeture de la modal =====*/
const closeModal = () => {
    const modalNav = document.querySelector('.modal-nav');
    const navMenu = document.querySelector('.nav-menu');
    navMenu.innerHTML = "&#9776;";
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
    link.addEventListener('click', closeModal);
});

/*===== Application du responsive (nav modal) sur tablette et modile =====*/
window.addEventListener('resize', isDesktop);
isDesktop();
