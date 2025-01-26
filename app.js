document.addEventListener('DOMContentLoaded', () => {
    const basicWeight = 64974;
    const maxZFW = 71584;
    const landingWeight = 91320;
    const fuelConsumptionRates = [6000, 5000, 4000];

    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculate);

    function calculate() {
        const flightTime = document.getElementById('flightTime').value.split(':');
        const reserveFuel = parseFloat(document.getElementById('reserveFuel').value);
        const crewMembers = parseInt(document.getElementById('crewMembers').value);
        const crewWeight = parseFloat(document.getElementById('crewWeight').value);
        const payload = parseFloat(document.getElementById('payload').value);

        const totalFlightTime = parseInt(flightTime[0]) * 60 + parseInt(flightTime[1]);

        const weightCrewMembers = crewMembers * crewWeight;
        const ZFW = basicWeight + weightCrewMembers + payload;

        if (ZFW >= maxZFW) {
            alert('O ZFW excede o limite permitido.');
            return;
        }

        const availableCargo = maxZFW - ZFW;

        const totalFuel = parseFloat((totalFlightTime / 60 * 6000 + reserveFuel).toFixed(3));
        const totalFuelLiters = parseFloat((totalFuel * 0.453).toFixed(3));

        const grossWeight = ZFW + totalFuel;

        let autonomy = 0;
        let remainingFuel = totalFuel;

        for (let i = 0; i < fuelConsumptionRates.length; i++) {
            if (remainingFuel <= 0) break;
            const rate = fuelConsumptionRates[i];
            const time = i === 0 ? 60 : remainingFuel / rate * 60;
            autonomy += Math.min(time, 60);
            remainingFuel -= rate;
        }

        const timeToLandingWeight = (grossWeight - landingWeight) / 6000 * 60;

        displayResults({
            totalFuel,
            totalFuelLiters,
            weightCrewMembers,
            ZFW,
            availableCargo,
            grossWeight,
            autonomy,
            timeToLandingWeight
        });
    }

    function displayResults(results) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <p>Total Fuel: ${results.totalFuel} lb (${results.totalFuelLiters} l)</p>
            <p>Weight Crew Members: ${results.weightCrewMembers} lb</p>
            <p>ZFW: ${results.ZFW} lb</p>
            <p>Available Cargo: ${results.availableCargo} lb</p>
            <p>Gross Weight: ${results.grossWeight} lb</p>
            <p>Autonomy: ${Math.floor(results.autonomy / 60)}h:${results.autonomy % 60}min</p>
            <p>Time to Landing Weight: ${Math.floor(results.timeToLandingWeight / 60)}h:${results.timeToLandingWeight % 60}min</p>
        `;
    }
});
