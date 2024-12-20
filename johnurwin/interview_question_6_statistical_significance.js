document.getElementById('abTestForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const groupAConversions = parseInt(document.getElementById('groupA').value, 10);
    const visitorsA = parseInt(document.getElementById('visitorsA').value, 10);
    const groupBConversions = parseInt(document.getElementById('groupB').value, 10);
    const visitorsB = parseInt(document.getElementById('visitorsB').value, 10);

    if (!validateInput(groupAConversions, visitorsA, groupBConversions, visitorsB)) {
        alert('Please check your inputs. All fields must be positive numbers.');
        return;
    }

    const rateA = groupAConversions / visitorsA;
    const rateB = groupBConversions / visitorsB;

    const zScore = calculateZScore(rateA, rateB, visitorsA, visitorsB);
    const pValue = calculatePValue(zScore);
    const significant = pValue < 0.05;

    displayResults(rateA, rateB, pValue, significant, zScore);
});

function validateInput(groupA, visitorsA, groupB, visitorsB) {
    return groupA >= 0 && visitorsA > 0 && groupB >= 0 && visitorsB > 0;
}

function calculateZScore(rateA, rateB, visitorsA, visitorsB) {
    const varianceA = (rateA * (1 - rateA)) / visitorsA;
    const varianceB = (rateB * (1 - rateB)) / visitorsB;
    const standardError = Math.sqrt(varianceA + varianceB);
    return (rateB - rateA) / standardError;
}

function calculatePValue(zScore) {
    const p = 0.5 * (1 + erf(zScore / Math.sqrt(2)));
    return 2 * Math.min(p, 1 - p); // Two-tailed test; ensure p-value is in [0, 1]
}

function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

function displayResults(rateA, rateB, pValue, significant, zScore) {
    const baseGroup = 'Group A';
    const testGroup = 'Group B';
    const betterPerformingGroup = rateB > rateA ? 'Group B' : 'Group A';
    const direction = rateB > rateA ? 'Group B has a higher conversion rate than Group A.' : 'Group A has a higher conversion rate than Group B.';

    const summary = `Conversion Rates:\n - Group A: ${(rateA * 100).toFixed(2)}% \n - Group B: ${(rateB * 100).toFixed(2)}%\n\n` +
        `Base Group: ${baseGroup}\nTest Group: ${testGroup}\n\n${direction}`;

    const pValueText = `P-Value: ${pValue.toFixed(4)}\n\n` +
        `The p-value indicates the likelihood that the observed differences occurred by chance.\n\n` +
        `Z-Score: ${zScore.toFixed(4)}\nCalculation: (Rate B - Rate A) / Standard Error`;

    let significanceText;
    if (significant) {
        significanceText = `The difference is statistically significant at the 5% level (p < 0.05). ${betterPerformingGroup} is performing better.\n\nRecommendation: ` +
            (betterPerformingGroup === 'Group B' ? `Switch to the strategy used for Group B.` : `Stick with the strategy used for Group A.`);
    } else {
        significanceText = `The difference is not statistically significant at the 5% level (p >= 0.05). No clear winner between the groups.`;
    }

    document.getElementById('summary').innerText = summary;
    document.getElementById('pValue').innerText = pValueText;
    document.getElementById('significance').innerText = significanceText;
    document.getElementById('results').classList.remove('hidden');
}
