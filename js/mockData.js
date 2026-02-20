// Mock Database / State Management
const Store = {
    state: {
        currentUser: null, // { role: 'Admin' | 'Operator' | 'Driver', id: string }
        bookings: [
            { id: 'B-1001', truckId: 'TRK-9012', date: new Date().toISOString().split('T')[0], time: '08:00', status: 'Completed', co2Saved: 12.5 },
            { id: 'B-1002', truckId: 'TRK-4921', date: new Date().toISOString().split('T')[0], time: '10:00', status: 'Approved', co2Saved: 8.2 },
            { id: 'B-1003', truckId: 'TRK-8834', date: new Date().toISOString().split('T')[0], time: '14:00', status: 'Approved', co2Saved: 15.0 },
        ],
        // Simulated vessel schedules affecting port congestion
        vesselSchedules: [
            { name: 'Evergreen Star', eta: '09:00', load: 'High' },
            { name: 'Maersk Alpha', eta: '13:00', load: 'Medium' }
        ],
        alerts: [
            { type: 'warning', message: 'High congestion predicted at 09:00 AM due to vessel arrival. Consider booking after 10:00 AM.' },
            { type: 'info', message: 'New sustainability goals: Idle time reduced by 15% this week!' }
        ],
        metrics: {
            totalScheduledToday: 45,
            avgTurnaround: 24, // minutes
            co2SavedToday: 325, // kg
            gateCongestionSimData: [20, 45, 80, 50, 30, 60, 20] // Hourly load for chart
        }
    },

    listeners: [],

    subscribe(listener) {
        this.listeners.push(listener);
    },

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    },

    // Actions
    login(role) {
        this.state.currentUser = { role, id: 'USR-' + Math.floor(Math.random() * 1000) };
        this.notify();
    },

    logout() {
        this.state.currentUser = null;
        this.notify();
    },

    addBooking(bookingConfig) {
        const newBooking = {
            id: 'B-' + (1000 + this.state.bookings.length + 1),
            ...bookingConfig,
            status: 'Approved',
            co2Saved: Utils.calculateExpectedCO2Savings(bookingConfig.time)
        };
        this.state.bookings.push(newBooking);
        
        // Update metrics
        this.state.metrics.totalScheduledToday++;
        this.state.metrics.co2SavedToday += newBooking.co2Saved;

        this.notify();
        return newBooking;
    },
    
    // Getters
    getUserBookings() {
        // In reality, filter by user ID. Here we return all active ones for simulation.
        return this.state.bookings;
    }
};

window.Store = Store;
