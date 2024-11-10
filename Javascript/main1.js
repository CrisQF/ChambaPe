// main.js
const JobMatch = {
    // Estado global de la aplicación
    state: {
        currentStep: 'landing', // landing, form, results, details
        isLoading: false,
        userData: null,
        availableJobs: [],
        selectedJob: null
    },

    // Inicialización de la aplicación
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupNavigation();
    },

    // Configurar event listeners globales
    setupEventListeners() {
        // Listeners para navegación
        document.addEventListener('DOMContentLoaded', () => {
            this.handleResponsiveNavigation();
            this.setupScrollEffects();
        });

        // Listener para cambios de tamaño de ventana
        window.addEventListener('resize', () => {
            this.handleResponsiveNavigation();
        });

        // Listener para tecla Escape (cerrar modales)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Modal.closeAll();
            }
        });
    },

    // Manejar navegación responsiva
    handleResponsiveNavigation() {
        const navbar = document.querySelector('.navbar');
        if (window.innerWidth <= 768) {
            this.setupMobileMenu();
        } else {
            this.cleanupMobileMenu();
        }
    },

    // Configurar menú móvil
    setupMobileMenu() {
        const navbar = document.querySelector('.navbar');
        if (!document.querySelector('.mobile-menu-button')) {
            const menuButton = document.createElement('button');
            menuButton.className = 'mobile-menu-button';
            menuButton.innerHTML = `
                <i class="lucide-menu"></i>
            `;
            menuButton.addEventListener('click', this.toggleMobileMenu);
            navbar.prepend(menuButton);
        }
    },

    // Limpiar menú móvil
    cleanupMobileMenu() {
        const menuButton = document.querySelector('.mobile-menu-button');
        if (menuButton) {
            menuButton.remove();
        }
        document.querySelector('.nav-links')?.classList.remove('show');
    },

    // Alternar menú móvil
    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('show');
    },

    // Configurar efectos de scroll
    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }

            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            lastScroll = currentScroll;
        });
    },

    // Cargar datos iniciales
    loadInitialData() {
        // Simulación de carga de datos
        this.state.availableJobs = [
            {
                id: 1,
                title: 'Diseñador UX/UI',
                company: 'Tech Corp',
                location: 'Remoto',
                salary: '$800-1500',
                description: 'Buscamos diseñador UX/UI con experiencia en...',
                requirements: ['Figma', 'Adobe XD', 'Sketch'],
                type: 'Tiempo completo'
            },
            {
                id: 2,
                title: 'Community Manager',
                company: 'Digital Agency',
                location: 'Híbrido',
                salary: '$600-1000',
                description: 'Se necesita Community Manager para gestionar...',
                requirements: ['Redes Sociales', 'Copywriting', 'Analytics'],
                type: 'Tiempo completo'
            },
            // Más trabajos...
        ];
    },

    // Configurar navegación
    setupNavigation() {
        // Manejar navegación entre páginas
        const navigateBack = () => {
            switch (this.state.currentStep) {
                case 'results':
                    this.showForm();
                    break;
                case 'details':
                    this.showResults();
                    break;
                default:
                    this.showLanding();
            }
        };

        // Agregar listener para botón atrás
        window.addEventListener('popstate', (event) => {
            if (event.state) {
                this.state.currentStep = event.state.step;
                navigateBack();
            }
        });
    },

    // Mostrar página de inicio
    showLanding() {
        this.state.currentStep = 'landing';
        document.getElementById('landingPage').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('jobDetailsPage').style.display = 'none';

        // Actualizar URL
        history.pushState({ step: 'landing' }, '', '/');
    },

    // Mostrar formulario
    showForm() {
        this.state.currentStep = 'form';
        document.getElementById('formContainer').style.display = 'block';
        document.getElementById('landingPage').style.display = 'block';
        document.getElementById('jobDetailsPage').style.display = 'none';

        // Actualizar URL
        history.pushState({ step: 'form' }, '', '/form');
    },

    // Mostrar resultados
    showResults() {
        this.state.currentStep = 'results';
        Modal.open();

        // Actualizar URL
        history.pushState({ step: 'results' }, '', '/results');
    },

    // Mostrar detalles
    showDetails() {
        this.state.currentStep = 'details';
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('jobDetailsPage').style.display = 'block';

        // Actualizar URL
        history.pushState({ step: 'details' }, '', '/details');
    },

    // Funciones auxiliares
    utils: {
        // Formatear fecha
        formatDate(date) {
            return new Date(date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        // Formatear moneda
        formatCurrency(amount) {
            return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        },

        // Validar email
        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        // Generar ID único
        generateId() {
            return '_' + Math.random().toString(36).substr(2, 9);
        },

        // Debounce para funciones
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
    },

    // Manejador de errores
    errorHandler(error) {
        console.error('Error:', error);
        // Mostrar mensaje de error al usuario
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-toast';
        errorMessage.textContent = 'Ha ocurrido un error. Por favor, intenta de nuevo.';
        document.body.appendChild(errorMessage);

        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
};

// Inicializar la aplicación cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    JobMatch.init();
});

// Función global para iniciar el formulario
function startForm() {
    JobMatch.showForm();
}

// Función global para toggle del About Us
function toggleAboutUs() {
    const aboutUsSection = document.getElementById('aboutUsSection');
    if (aboutUsSection.style.display === 'none') {
        aboutUsSection.style.display = 'block';
    } else {
        aboutUsSection.style.display = 'none';
    }
}