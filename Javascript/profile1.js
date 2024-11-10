// profile.js
const Profile = {
    // Estado del perfil
    state: {
        userData: null,
        matches: [],
        stats: {},
        isEditing: false
    },

    // Inicialización
    init() {
        this.setupEventListeners();
        this.initializeStats();
    },

    // Configurar event listeners
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupProfileActions();
            this.setupTabNavigation();
        });
    },

    // Configurar acciones del perfil
    setupProfileActions() {
        const editButtons = document.querySelectorAll('.edit-profile-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleEditMode());
        });
    },

    // Configurar navegación por tabs
    setupTabNavigation() {
        const tabs = document.querySelectorAll('.nav-item');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(tab.getAttribute('data-tab'));
            });
        });
    },

    // Inicializar estadísticas
    initializeStats() {
        this.state.stats = {
            viewedBy: 0,
            matchRate: 0,
            applications: 0,
            responses: 0
        };
    },

    // Mostrar detalles del perfil
    showDetails() {
        const formData = FormHandler.getFormData();
        this.state.userData = formData;

        // Actualizar UI
        this.updateProfileCard();
        this.updateProfileStats();
        this.updateJobMatches();

        // Mostrar página de detalles
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('jobMatchModal').style.display = 'none';
        document.getElementById('jobDetailsPage').style.display = 'block';

        // Animar entrada
        this.animateProfileEntrance();
    },

    // Actualizar tarjeta de perfil
    updateProfileCard() {
        const data = this.state.userData;
        if (!data) return;

        // Actualizar información básica
        document.getElementById('profile-name').textContent = data.fullName;
        document.getElementById('profile-location').textContent = `${data.designArea} - ${data.location}`;
        document.getElementById('profile-career').textContent = data.career;

        // Actualizar habilidades
        const skillsContainer = document.getElementById('profile-skills');
        const skillsArray = data.skills.split(',').map(skill => skill.trim());
        skillsContainer.innerHTML = skillsArray
            .filter(skill => skill.length > 0)
            .map(skill => `
                <span class="skill-tag">
                    <i class="lucide-check-circle"></i>
                    ${skill}
                </span>
            `).join('');

        // Actualizar modalidad de trabajo
        document.getElementById('profile-workmode').textContent = this.formatWorkMode(data.workMode);

        // Actualizar información adicional
        const additionalInfo = document.getElementById('profile-additional');
        if (additionalInfo) {
            additionalInfo.textContent = data.additionalInfo || 'No se proporcionó información adicional';
        }
    },

    // Actualizar estadísticas del perfil
    updateProfileStats() {
        const statsContainer = document.getElementById('profile-stats');
        if (!statsContainer) return;

        // Calcular estadísticas
        const stats = {
            viewedBy: Math.floor(Math.random() * 50) + 20,
            matchRate: Math.floor(Math.random() * 30) + 70,
            applications: Math.floor(Math.random() * 10) + 5,
            responses: Math.floor(Math.random() * 5) + 1
        };

        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="lucide-eye"></i>
                    <h4>Visto por</h4>
                    <p class="stat-number">${stats.viewedBy}</p>
                    <p class="stat-label">empresas</p>
                </div>
                <div class="stat-card">
                    <i class="lucide-target"></i>
                    <h4>Match Rate</h4>
                    <p class="stat-number">${stats.matchRate}%</p>
                    <p class="stat-label">de coincidencia</p>
                </div>
                <div class="stat-card">
                    <i class="lucide-send"></i>
                    <h4>Aplicaciones</h4>
                    <p class="stat-number">${stats.applications}</p>
                    <p class="stat-label">enviadas</p>
                </div>
                <div class="stat-card">
                    <i class="lucide-message-circle"></i>
                    <h4>Respuestas</h4>
                    <p class="stat-number">${stats.responses}</p>
                    <p class="stat-label">recibidas</p>
                </div>
            </div>
        `;
    },

    // Actualizar coincidencias de trabajo
    updateJobMatches() {
        const matchesContainer = document.getElementById('available-matches');
        if (!matchesContainer) return;

        // Datos de ejemplo de trabajos coincidentes
        const matches = this.generateJobMatches();

        matchesContainer.innerHTML = matches.map(job => `
            <div class="match-card">
                <div class="match-header">
                    <img src="/api/placeholder/50/50" alt="${job.company}" class="company-logo">
                    <div class="match-info">
                        <h4>${job.title}</h4>
                        <p>${job.company}</p>
                    </div>
                    <span class="match-percentage">${job.matchRate}%</span>
                </div>
                <div class="match-body">
                    <p><i class="lucide-map-pin"></i> ${job.location}</p>
                    <p><i class="lucide-dollar-sign"></i> ${job.salary}</p>
                    <div class="match-skills">
                        ${job.skills.map(skill => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="match-actions">
                    <button class="btn btn-outline" onclick="Profile.saveJob(${job.id})">
                        <i class="lucide-bookmark"></i>
                        Guardar
                    </button>
                    <button class="btn btn-primary" onclick="Profile.applyToJob(${job.id})">
                        <i class="lucide-send"></i>
                        Aplicar
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Generar trabajos coincidentes
    generateJobMatches() {
        return [
            {
                id: 1,
                title: 'UX/UI Designer',
                company: 'Tech Innovators',
                location: 'Remoto',
                salary: '$1500-2000',
                matchRate: 95,
                skills: ['Figma', 'Adobe XD', 'UI Design']
            },
            {
                id: 2,
                title: 'Product Designer',
                company: 'Creative Solutions',
                location: 'Híbrido',
                salary: '$1800-2500',
                matchRate: 88,
                skills: ['Product Design', 'Prototyping', 'User Research']
            },
            {
                id: 3,
                title: 'Graphic Designer',
                company: 'Design Studio',
                location: 'Presencial',
                salary: '$1200-1800',
                matchRate: 82,
                skills: ['Photoshop', 'Illustrator', 'Branding']
            }
        ];
    },

    // Formatear modo de trabajo
    formatWorkMode(mode) {
        const modes = {
            remote: 'Trabajo Remoto',
            presential: 'Trabajo Presencial',
            hybrid: 'Trabajo Híbrido'
        };
        return modes[mode] || mode;
    },

    // Alternar modo de edición
    toggleEditMode() {
        this.state.isEditing = !this.state.isEditing;
        this.updateEditableFields();
    },

    // Actualizar campos editables
    updateEditableFields() {
        const editableFields = document.querySelectorAll('.editable-field');
        editableFields.forEach(field => {
            field.contentEditable = this.state.isEditing;
            field.classList.toggle('editing', this.state.isEditing);
        });
    },

    // Guardar trabajo
    saveJob(jobId) {
        // Mostrar mensaje de confirmación
        this.showToast('Trabajo guardado en favoritos');
    },

    // Aplicar a trabajo
    applyToJob(jobId) {
        // Mostrar modal de confirmación
        this.showApplicationModal(jobId);
    },

    // Mostrar modal de aplicación
    showApplicationModal(jobId) {
        const modal = document.createElement('div');
        modal.className = 'application-modal modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Confirmar Aplicación</h3>
                <p>¿Estás seguro de que deseas aplicar a este puesto?</p>
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" onclick="Profile.confirmApplication(${jobId})">
                        Confirmar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Confirmar aplicación
    confirmApplication(jobId) {
        // Simular envío de aplicación
        this.showToast('Aplicación enviada con éxito');
        document.querySelector('.application-modal').remove();
    },

    // Mostrar toast
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="lucide-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Animar entrada del perfil
    animateProfileEntrance() {
        const elements = document.querySelectorAll('.profile-card, .matches-card, .stats-grid');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';

            setTimeout(() => {
                el.style.transition = 'all 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    },

    // Cambiar tab
    switchTab(tabId) {
        const tabs = document.querySelectorAll('.nav-item');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.style.display = 'none');

        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-content`).style.display = 'block';
    }
};

// Inicializar el perfil cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    Profile.init();
});