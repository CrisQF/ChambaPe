// form-handler.js
const FormHandler = {
    // Almacenamiento de datos del formulario
    formData: {},

    // Estado de validación
    validationState: {
        isValid: false,
        errors: {}
    },

    // Inicialización
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    },

    // Configurar event listeners
    setupEventListeners() {
        const form = document.getElementById('matchingForm');
        if (form) {
            form.addEventListener('input', (e) => this.handleInputChange(e));
        }

        // Listener para campos específicos
        const ageInput = document.getElementById('age');
        if (ageInput) {
            ageInput.addEventListener('input', (e) => this.validateAge(e.target.value));
        }

        const skillsInput = document.getElementById('skills');
        if (skillsInput) {
            skillsInput.addEventListener('input', (e) => this.handleSkillsInput(e));
        }
    },

    // Manejar cambios en inputs
    handleInputChange(event) {
        const { id, value } = event.target;
        this.formData[id] = value;
        this.validateField(id, value);
    },

    // Seleccionar área de diseño
    selectArea(element) {
        // Remover selección previa
        document.querySelectorAll('.design-area').forEach(area => {
            area.classList.remove('selected');
        });

        // Aplicar nueva selección
        element.classList.add('selected');
        this.formData.designArea = element.textContent;
    },

    // Validación de campos
    validateField(fieldId, value) {
        const validators = {
            fullName: (val) => {
                const isValid = val.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val);
                return {
                    isValid,
                    message: isValid ? '' : 'Por favor ingresa un nombre válido'
                };
            },
            age: (val) => {
                const age = parseInt(val);
                const isValid = age >= 18 && age <= 65;
                return {
                    isValid,
                    message: isValid ? '' : 'La edad debe estar entre 18 y 65 años'
                };
            },
            location: (val) => {
                const isValid = val.trim().length >= 3;
                return {
                    isValid,
                    message: isValid ? '' : 'Por favor ingresa una ubicación válida'
                };
            },
            skills: (val) => {
                const skills = val.split(',').filter(skill => skill.trim().length > 0);
                const isValid = skills.length > 0;
                return {
                    isValid,
                    message: isValid ? '' : 'Por favor ingresa al menos una habilidad'
                };
            }
        };

        if (validators[fieldId]) {
            const result = validators[fieldId](value);
            this.showFieldError(fieldId, result.message);
            this.validationState.errors[fieldId] = !result.isValid;
            this.updateFormValidState();
        }
    },

    // Mostrar errores de campo
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (!errorElement) {
            const field = document.getElementById(fieldId);
            const errorDiv = document.createElement('div');
            errorDiv.id = `${fieldId}-error`;
            errorDiv.className = 'error-message';
            field.parentNode.appendChild(errorDiv);
        }
        if (message) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            errorElement.style.display = 'none';
        }
    },

    // Actualizar estado de validación del formulario
    updateFormValidState() {
        this.validationState.isValid = !Object.values(this.validationState.errors).some(hasError => hasError);
    },

    // Manejar envío del formulario
    handleSubmit(event) {
        event.preventDefault();

        // Verificar área seleccionada
        const selectedArea = document.querySelector('.design-area.selected');
        if (!selectedArea) {
            alert('Por favor selecciona un área de diseño');
            return;
        }

        // Recopilar datos del formulario
        this.formData = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            location: document.getElementById('location').value,
            career: document.getElementById('career').value,
            skills: document.getElementById('skills').value,
            additionalInfo: document.getElementById('additionalInfo').value,
            workMode: document.querySelector('input[name="workMode"]:checked').value,
            designArea: selectedArea.textContent
        };

        // Validar todos los campos
        for (const [fieldId, value] of Object.entries(this.formData)) {
            this.validateField(fieldId, value);
        }

        // Si el formulario es válido, proceder
        if (this.validationState.isValid) {
            this.showLoadingState();
            this.processForm();
        } else {
            this.showFormErrors();
        }
    },

    // Mostrar estado de carga
    showLoadingState() {
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="lucide-loader"></i> Procesando...';

        document.getElementById('resultMessage').style.display = 'block';
        document.getElementById('resultMessage').scrollIntoView({ behavior: 'smooth' });
    },

    // Procesar formulario
    processForm() {
        // Simular procesamiento
        setTimeout(() => {
            this.resetLoadingState();
            this.showSuccess();
        }, 2000);
    },

    // Resetear estado de carga
    resetLoadingState() {
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="lucide-search"></i> Encontrar match';
    },

    // Mostrar éxito
    showSuccess() {
        document.getElementById('resultMessage').innerHTML = `
            <div class="success-message">
                <i class="lucide-check-circle"></i>
                <p>¡Perfil completado con éxito!</p>
            </div>
            <button class="btn btn-primary" onclick="Modal.open()">
                <i class="lucide-eye"></i>
                Ver puestos disponibles
            </button>
        `;
    },

    // Mostrar errores del formulario
    showFormErrors() {
        const errorMessages = [];
        for (const [fieldId, hasError] of Object.entries(this.validationState.errors)) {
            if (hasError) {
                const field = document.getElementById(fieldId);
                const label = field.previousElementSibling.textContent;
                errorMessages.push(`${label} es requerido`);
            }
        }

        alert('Por favor corrige los siguientes errores:\n' + errorMessages.join('\n'));
    },

    // Manejar entrada de habilidades
    handleSkillsInput(event) {
        const input = event.target;
        const skills = input.value.split(',');

        // Formatear habilidades
        const formattedSkills = skills.map(skill => {
            skill = skill.trim();
            return skill.charAt(0).toUpperCase() + skill.slice(1);
        }).join(', ');

        input.value = formattedSkills;
    },

    // Validar edad
    validateAge(value) {
        const age = parseInt(value);
        const isValid = !isNaN(age) && age >= 18 && age <= 65;

        const ageInput = document.getElementById('age');
        if (!isValid) {
            ageInput.classList.add('invalid');
        } else {
            ageInput.classList.remove('invalid');
        }
    },

    // Obtener datos del formulario
    getFormData() {
        return this.formData;
    },

    // Resetear formulario
    resetForm() {
        document.getElementById('matchingForm').reset();
        this.formData = {};
        this.validationState.errors = {};
        document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');
        document.querySelectorAll('.design-area').forEach(area => area.classList.remove('selected'));
    }
};

// Inicializar el manejador de formularios cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    FormHandler.init();
});