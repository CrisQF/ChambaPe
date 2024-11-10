// modal.js
const Modal = {
    // Estado del modal
    state: {
        activeModals: [],
        isLoading: false
    },

    // Inicialización
    init() {
        this.setupEventListeners();
        this.setupKeyboardControls();
        this.setupAnimations();
    },

    // Configurar event listeners
    setupEventListeners() {
        // Cerrar modal al hacer clic fuera
        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                this.close();
            }
        };

        // Prevenir scroll del body cuando el modal está abierto
        document.addEventListener('modalOpen', () => {
            document.body.style.overflow = 'hidden';
        });

        document.addEventListener('modalClose', () => {
            if (this.state.activeModals.length === 0) {
                document.body.style.overflow = 'auto';
            }
        });
    },

    // Configurar controles de teclado
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    },

    // Configurar animaciones
    setupAnimations() {
        const styles = `
            .modal {
                transition: opacity 0.3s ease;
                opacity: 0;
            }
            .modal.show {
                opacity: 1;
            }
            .modal-content {
                transition: transform 0.3s ease, opacity 0.3s ease;
                transform: translateY(-20px);
                opacity: 0;
            }
            .modal.show .modal-content {
                transform: translateY(0);
                opacity: 1;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    },

    // Abrir modal
    open() {
        this.state.isLoading = true;
        const modal = document.getElementById('jobMatchModal');

        // Mostrar estado de carga
        this.showLoading();

        // Simular carga de datos
        setTimeout(() => {
            this.state.isLoading = false;
            this.hideLoading();
            this.updateJobMatches();

            modal.style.display = 'block';
            // Trigger animation
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            this.state.activeModals.push(modal);
            document.dispatchEvent(new Event('modalOpen'));
        }, 1000);
    },

    // Cerrar modal
    close() {
        const modal = document.getElementById('jobMatchModal');
        modal.classList.remove('show');

        // Esperar a que termine la animación
        setTimeout(() => {
            modal.style.display = 'none';
            this.state.activeModals.pop();
            document.dispatchEvent(new Event('modalClose'));
        }, 300);
    },

    // Cerrar todos los modales
    closeAll() {
        this.state.activeModals.forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        this.state.activeModals = [];
        document.dispatchEvent(new Event('modalClose'));
    },

    // Mostrar estado de carga
    showLoading() {
        const matchedJobs = document.getElementById('matchedJobs');
        matchedJobs.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Buscando las mejores coincidencias...</p>
            </div>
        `;
    },

    // Ocultar estado de carga
    hideLoading() {
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.remove();
        }
    },

    // Actualizar coincidencias de trabajo
    updateJobMatches() {
        const formData = FormHandler.getFormData();
        const matchedJobs = document.getElementById('matchedJobs');

        // Datos de ejemplo de trabajos coincidentes
        const jobs = [
            {
                title: 'Diseñador UX/UI Senior',
                company: 'Tech Innovation',
                location: 'Remoto',
                salary: '$1500-2500',
                match: 95,
                requirements: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping']
            },
            {
                title: 'Diseñador Gráfico Mid-Level',
                company: 'Creative Agency',
                location: formData.workMode === 'remote' ? 'Remoto' : 'Presencial',
                salary: '$800-1500',
                match: 88,
                requirements: ['Photoshop', 'Illustrator', 'Branding']
            },
            {
                title: 'Community Manager',
                company: 'Digital Marketing Pro',
                location: 'Híbrido',
                salary: '$700-1200',
                match: 82,
                requirements: ['Social Media', 'Content Creation', 'Analytics']
            }
        ];

        // Renderizar trabajos
        matchedJobs.innerHTML = `
            <div class="jobs-container">
                ${jobs.map(job => this.createJobCard(job)).join('')}
            </div>
        `;

        // Agregar event listeners a los botones
        document.querySelectorAll('.apply-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleJobApplication(e.target.dataset.jobId);
            });
        });
    },

    // Crear tarjeta de trabajo
    createJobCard(job) {
        return `
            <div class="job-card">
                <div class="job-card-header">
                    <h3>${job.title}</h3>
                    <span class="match-percentage">${job.match}% Match</span>
                </div>
                <div class="job-card-body">
                    <p class="company"><i class="lucide-building"></i> ${job.company}</p>
                    <p class="location"><i class="lucide-map-pin"></i> ${job.location}</p>
                    <p class="salary"><i class="lucide-dollar-sign"></i> ${job.salary}</p>
                    <div class="requirements">
                        ${job.requirements.map(req => `<span class="requirement-tag">${req}</span>`).join('')}
                    </div>
                </div>
                <div class="job-card-footer">
                    <button class="apply-button btn btn-primary" data-job-id="${job.company}">
                        <i class="lucide-send"></i> Aplicar ahora
                    </button>
                </div>
            </div>
        `;
    },

    // Manejar aplicación a trabajo
    handleJobApplication(jobId) {
        // Mostrar confirmación
        const confirmationModal = document.createElement('div');
        confirmationModal.className = 'confirmation-modal';
        confirmationModal.innerHTML = `
            <div class="confirmation-content">
                <h3>¡Aplicación exitosa!</h3>
                <p>Tu aplicación ha sido enviada correctamente.</p>
                <button class="btn btn-primary" onclick="Modal.showJobDetails()">
                    Ver detalles completos
                </button>
            </div>
        `;
        document.body.appendChild(confirmationModal);

        // Remover después de 3 segundos
        setTimeout(() => {
            confirmationModal.remove();
            this.close();
            Profile.showDetails();
        }, 2000);
    },

    // Mostrar detalles del trabajo
    showJobDetails() {
        this.close();
        Profile.showDetails();
    }
};

// Inicializar el modal cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    Modal.init();
});