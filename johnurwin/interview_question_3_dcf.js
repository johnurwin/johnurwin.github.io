function calculateDCF() {
    const revenueGrowthRate = parseFloat(document.getElementById('revenue').value) / 100;
    const discountRate = parseFloat(document.getElementById('discount-rate').value) / 100;
    const operatingMargin = parseFloat(document.getElementById('operating-margin').value) / 100;
    const wacc = parseFloat(document.getElementById('wacc').value) / 100;
    const initialRevenue = parseFloat(document.getElementById('initial-revenue').value);
    const terminalGrowthRate = parseFloat(document.getElementById('terminal-growth').value) / 100;
    const yearsBeforeTerminal = parseInt(document.getElementById('years-before-terminal').value, 10);

    let cashFlows = [];
    let revenue = initialRevenue;
    let presentValue = 0;

    for (let year = 1; year <= yearsBeforeTerminal; year++) {
        revenue *= (1 + revenueGrowthRate);
        const cashFlow = revenue * operatingMargin;
        const discountedCF = cashFlow / Math.pow(1 + discountRate, year);
        cashFlows.push(discountedCF);
        presentValue += discountedCF;
    }

    // Terminal value calculation
    const terminalValue = (revenue * operatingMargin * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate, yearsBeforeTerminal);
    presentValue += discountedTerminalValue;

    document.getElementById('pv-cashflows').innerText = `$${presentValue.toFixed(2)}M`;
    updateDCFFormula(initialRevenue, revenueGrowthRate, discountRate, operatingMargin, terminalGrowthRate, wacc, yearsBeforeTerminal);
}


        function calculateWACC() {
            const equity = parseFloat(document.getElementById('equity').value);
            const debt = parseFloat(document.getElementById('debt').value);
            const costOfEquity = parseFloat(document.getElementById('cost-equity').value) / 100;
            const costOfDebt = parseFloat(document.getElementById('cost-debt').value) / 100;
            const taxRate = parseFloat(document.getElementById('tax-rate').value) / 100;

            const totalValue = equity + debt;
            const weightedEquity = (equity / totalValue) * costOfEquity;
            const weightedDebt = (debt / totalValue) * costOfDebt * (1 - taxRate);
            const wacc = (weightedEquity + weightedDebt) * 100;

            document.getElementById('wacc').value = wacc.toFixed(2);
            updateWACCFormula(equity, debt, costOfEquity, costOfDebt, taxRate, wacc);
        }

        function toggleFormulaDisplay(id) {
            const formulaElement = document.getElementById(id);
            formulaElement.style.display = formulaElement.style.display === 'block' ? 'none' : 'block';
        }

        function updateWACCFormula(equity, debt, costOfEquity, costOfDebt, taxRate, wacc) {
            const formula = `WACC = (${equity.toFixed(2)} / (${equity.toFixed(2)} + ${debt.toFixed(2)})) * ${costOfEquity * 100}% + (${debt.toFixed(2)} / (${equity.toFixed(2)} + ${debt.toFixed(2)})) * ${costOfDebt * 100}% * (1 - ${taxRate * 100}%) = ${wacc.toFixed(2)}%`;
            document.getElementById('wacc-formula').innerText = formula;
        }

function updateDCFFormula(initialRevenue, revenueGrowthRate, discountRate, operatingMargin, terminalGrowthRate, wacc) {
    let cashFlows = [];
    let revenue = initialRevenue;
    let totalPresentValue = 0; // Initialize to sum up all discounted cash flows

    // Calculate yearly cash flows
    for (let year = 1; year <= 5; year++) {
        revenue *= (1 + revenueGrowthRate);
        const cashFlow = revenue * operatingMargin;
        const discountedCF = cashFlow / Math.pow(1 + discountRate, year);
        cashFlows.push({
            year: year,
            cashFlow: cashFlow.toFixed(2),
            discountedCF: discountedCF.toFixed(2),
        });
        totalPresentValue += discountedCF; // Add discounted cash flow to total present value
    }

    // Terminal value calculation
    const terminalValue = (revenue * operatingMargin * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate, 5);
    totalPresentValue += discountedTerminalValue; // Add discounted terminal value to total present value

    // Generate formula text
    let formula = `DCF = Σ (CashFlow / (1 + DiscountRate)^t) + TerminalValue / (1 + DiscountRate)^5\n\n`;
    formula += `Yearly Cash Flows:\n`;

    cashFlows.forEach(flow => {
        formula += `Year ${flow.year}: CashFlow = ${flow.cashFlow}, Discounted = ${flow.discountedCF}\n`;
    });

    formula += `\nTerminal Value = (Revenue * (1 + ${terminalGrowthRate * 100}%)) / (${wacc * 100}% - ${terminalGrowthRate * 100}%)\n`;
    formula += `Discounted Terminal Value = ${discountedTerminalValue.toFixed(2)}\n`;
    formula += `\nFinal Present Value = $${totalPresentValue.toFixed(2)}M`;

    // Update the formula display
    document.getElementById('dcf-formula').innerText = formula;
}


        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('calculate').addEventListener('click', calculateDCF);
            document.getElementById('calculate-wacc').addEventListener('click', calculateWACC);
            document.getElementById('show-wacc-formula').addEventListener('click', () => toggleFormulaDisplay('wacc-formula-display'));
            document.getElementById('show-dcf-formula').addEventListener('click', () => toggleFormulaDisplay('dcf-formula-display'));
        });

        function toggleAnswer(id) {
            const answerElement = document.getElementById(id);
            answerElement.style.display = answerElement.style.display === 'block' ? 'none' : 'block';
        }