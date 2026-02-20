// Main Application Logic
const App = {
    // DOM Elements
    container: document.getElementById('main-content'),
    header: document.getElementById('site-header'),
    roleDisplay: document.getElementById('current-user-role'),
    logoutBtn: document.getElementById('logout-btn'),

    // View templates
    templates: {
        login: document.getElementById('view-login'),
        admin: document.getElementById('view-admin'),
        operator: document.getElementById('view-operator'),
        driver: document.getElementById('view-driver')
    },

    charts: {},

    init() {
        lucide.createIcons();
        Store.subscribe(this.render.bind(this));

        // Setup global listeners
        this.logoutBtn.addEventListener('click', () => {
            Store.logout();
        });

        // Initial render
        this.render(Store.state);
    },

    render(state) {
        // Clear current view
        this.container.innerHTML = '';

        if (!state.currentUser) {
            // Render Login
            this.header.classList.add('hidden');
            const clone = this.templates.login.content.cloneNode(true);
            this.container.appendChild(clone);
            this.setupLoginListeners();
        } else {
            // Render Dashboard for role
            this.header.classList.remove('hidden');
            this.roleDisplay.textContent = `${state.currentUser.role} Portal`;

            const role = state.currentUser.role;
            if (role === 'Admin') this.renderAdmin(state);
            else if (role === 'Operator') this.renderOperator(state);
            else if (role === 'Driver') this.renderDriver(state);
        }

        // Re-init icons for new DOM elements
        lucide.createIcons();
    },

    setupLoginListeners() {
        const buttons = document.querySelectorAll('.role-card');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = e.currentTarget.dataset.role;
                Store.login(role);
            });
        });
    },

    renderAdmin(state) {
        const clone = this.templates.admin.content.cloneNode(true);
        this.container.appendChild(clone);

        // Populate Metrics
        document.getElementById('admin-total-scheduled').textContent = state.metrics.totalScheduledToday;
        document.getElementById('admin-avg-time').textContent = state.metrics.avgTurnaround + ' min';
        document.getElementById('admin-co2-saved').textContent = state.metrics.co2SavedToday.toFixed(1) + ' kg';

        // Initialize Chart
        const ctx = document.getElementById('gateLoadChart').getContext('2d');

        if (this.charts.gateLoad) {
            this.charts.gateLoad.destroy();
        }

        this.charts.gateLoad = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                datasets: [{
                    label: 'Predicted Gate Load (Trucks/hr)',
                    data: state.metrics.gateCongestionSimData,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            }
        });
    },

    renderOperator(state) {
        const clone = this.templates.operator.content.cloneNode(true);
        this.container.appendChild(clone);

        // Populate bookings
        const tbody = document.getElementById('operator-bookings');
        tbody.innerHTML = '';
        state.bookings.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${b.truckId}</strong></td>
                <td>${Utils.formatDate(b.date)} | ${b.time}</td>
                <td><span class="badge ${b.status === 'Approved' ? 'badge-success' : 'badge-info'}">${b.status}</span></td>
                <td><button class="btn btn-icon btn-ghost"><i data-lucide="more-vertical"></i></button></td>
            `;
            tbody.appendChild(tr);
        });

        // Populate alerts
        const alertsContainer = document.getElementById('operator-alerts');
        alertsContainer.innerHTML = '';
        state.alerts.forEach(a => {
            const el = document.createElement('div');
            el.className = `alert alert-${a.type === 'warning' ? 'warning' : 'info'}`;
            el.innerHTML = `
                <i data-lucide="${a.type === 'warning' ? 'alert-triangle' : 'info'}"></i>
                <p>${a.message}</p>
            `;
            alertsContainer.appendChild(el);
        });

        // Setup Modal Listeners
        const modal = document.getElementById('modal-booking');
        const btnNew = document.getElementById('btn-new-booking');
        const closes = document.querySelectorAll('.close-modal');
        const form = document.getElementById('booking-form');

        const aiBox = document.getElementById('ai-suggestion-box');
        const timeInput = document.getElementById('input-time');

        btnNew.addEventListener('click', () => modal.classList.remove('hidden'));
        closes.forEach(c => c.addEventListener('click', () => modal.classList.add('hidden')));

        // Smart Suggestion on Time change
        timeInput.addEventListener('change', (e) => {
            const val = e.target.value;
            if (!val) {
                aiBox.classList.add('hidden');
                return;
            }
            const prediction = Utils.predictCongestion(val);
            const co2Saved = Utils.calculateExpectedCO2Savings(val);

            aiBox.classList.remove('hidden');
            aiBox.innerHTML = `
                <div class="ai-box-header">
                    <i data-lucide="sparkles"></i> AI Congestion Insight
                </div>
                <p class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.5rem;">${prediction.recommendation}</p>
                <div style="display: flex; gap: 1rem; font-size: 0.875rem;">
                    <span>Load: <strong class="${prediction.level === 'High' ? 'text-danger' : (prediction.level === 'Medium' ? 'text-warning' : 'text-green')}">${prediction.level}</strong></span>
                    <span>CO₂ Saved: <strong class="text-green">${co2Saved} kg</strong></span>
                </div>
            `;
            lucide.createIcons();
        });

        // Form Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const truckId = document.getElementById('input-truck-id').value;
            const date = document.getElementById('input-date').value;
            const time = timeInput.value;

            Store.addBooking({ truckId, date, time });
            modal.classList.add('hidden');
            form.reset();
            aiBox.classList.add('hidden');
        });
    },

    renderDriver(state) {
        const clone = this.templates.driver.content.cloneNode(true);
        this.container.appendChild(clone);

        // Get the latest booking for simplicity
        const bookings = state.bookings;
        const latest = bookings[bookings.length - 1];

        if (latest) {
            document.getElementById('driver-truck').textContent = latest.truckId;
            document.getElementById('driver-time').textContent = `Today, ${latest.time}`;

            // Generate QR Code
            const qrContainer = document.getElementById('driver-qr');
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: JSON.stringify({ id: latest.id, truck: latest.truckId, time: latest.time }),
                width: 150,
                height: 150,
                colorDark: "#101820",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }
};

// Start App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
