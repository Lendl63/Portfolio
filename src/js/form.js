/*===== Validation du formulaire =====*/

//Recuperation des elements

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Champs
    const name = document.getElementById('nom');
    const email = document.getElementById('e-mail');
    const message = document.getElementById('message');

    let isValid = true;

    // Valeurs
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const messageValue = message.value.trim();

    // Réinitialiser les erreurs précédentes
    clearErrors([name, email, message]);

    //------ Validation du nom ---------
    if (nameValue.length < 2) {
        isValid = false;
        showError(name);
    }

    //------ Validation du email ---------
    if (!isValidEmail(emailValue)) {
        isValid = false;
        showError(email);
    }

    //------ Validation du message ---------
    if (messageValue.length < 20) {
        isValid = false;
        showError(message);
    }

    // Si tout est valide, soumettre le formulaire
    if (isValid) {
        submitForm();
    }
});

/*===== FONCTION =====*/

/**
 * Affiche le message d'erreur pour un champ
 * @param {HTMLElement} field 
 */
const showError = (field) => {
    const errorAttr = field.getAttribute('data-error');
    const spanError = document.getElementById(errorAttr);

    field.classList.add('error');
    if (spanError) {
        spanError.classList.add('error');
    }
};

/**
 * Nettoie les erreurs des champs
 * @param {Array<HTMLElement>} fields 
 */
const clearErrors = (fields) => {
    fields.forEach(field => {
        const errorAttr = field.getAttribute('data-error');
        const spanError = document.getElementById(errorAttr);

        field.classList.remove('error');
        if (spanError) {
            spanError.classList.remove('error');
        }
    });
};

/**
 * Valide le format d'un email
 * @param {String} email 
 * @returns {Boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Soumet le formulaire
 */
const submitForm = () => {
    const formData = {
        name: document.getElementById('nom').value.trim(),
        email: document.getElementById('e-mail').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    console.log('Formulaire valide, données:', formData);
    
    // Réinitialiser le formulaire
    form.reset();
    
    // Afficher le pop-up de succès
    showSuccessModal();
};

/**
 * Affiche le modal de succès
 */
const showSuccessModal = () => {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('active');
    }
};

/**
 * Ferme le modal de succès
 */
const closeSuccessModal = () => {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};