// AI Prediction & Emission Utilities
const Utils = {
    // Simulated prediction of congestion based on time
    // In a real app, this would call an ML model API passing current load + vessel schedules
    predictCongestion(time) {
        const hour = parseInt(time.split(':')[0], 10);

        let score = 0; // 0-100
        let level = 'Low';
        let recommendation = '';

        // Based on mock vessel arriving at 09:00 (High) and 13:00 (Medium)
        if (hour >= 8 && hour <= 10) {
            score = 85;
            level = 'High';
            recommendation = 'Peak hours due to vessel "Evergreen Star". High wait times expected.';
        } else if (hour >= 11 && hour <= 12) {
            score = 30;
            level = 'Low';
            recommendation = 'Optimal time to arrive. Minimal wait expected.';
        } else if (hour >= 13 && hour <= 15) {
            score = 65;
            level = 'Medium';
            recommendation = 'Moderate congestion due to vessel "Maersk Alpha".';
        } else {
            score = 20;
            level = 'Low';
            recommendation = 'Off-peak hours. Fast clearance expected.';
        }

        return { score, level, recommendation };
    },

    // Calculate CO2 savings based on expected idle time reduction
    // Formula: Saved Idle Time (mins) * Avg Fuel Burn Rate (L/min) * CO2 per L fuel
    calculateExpectedCO2Savings(time) {
        const prediction = this.predictCongestion(time);

        let savedIdleMinutes = 0;

        if (prediction.level === 'Low') {
            savedIdleMinutes = 45; // Simulated 45 mins saved vs worst-case
        } else if (prediction.level === 'Medium') {
            savedIdleMinutes = 20;
        } else {
            savedIdleMinutes = 5;
        }

        const fuelBurnRate = 0.05; // liters per minute idle
        const co2PerLiter = 2.68; // kg CO2 per liter of diesel

        return parseFloat((savedIdleMinutes * fuelBurnRate * co2PerLiter).toFixed(1));
    },

    // Format date string
    formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
};

window.Utils = Utils;
