document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generateChartButton");
    const submitButton = document.getElementById("submitAnswerButton");
    const feedbackMessage = document.getElementById("feedbackMessage");
    const canvas = document.getElementById("timeSeriesCanvas").getContext("2d");

    let timeSeriesChart;
    const dataPoints = [];
    const labels = [];
    const outliers = [];
    const userSelectedPoints = new Set();

    // Generate Synthetic Data
    function generateData() {
        dataPoints.length = 0;
        labels.length = 0;
        outliers.length = 0;

        let value = 100;
        for (let i = 1; i <= 30; i++) {
            value += Math.random() * 5 - 2.5;

            if ([7, 15, 22, 28].includes(i)) {
                value += Math.random() * 20 + 10; // Outlier
                outliers.push(i - 1);
            }

            dataPoints.push(Math.round(value));
            labels.push(`Day ${i}`);
        }
    }

    // Toggle Point Selection
    function togglePointSelection(index) {
        if (userSelectedPoints.has(index)) {
            userSelectedPoints.delete(index);
            timeSeriesChart.data.datasets[0].pointBackgroundColor[index] = "#0077cc"; // Normal
        } else {
            userSelectedPoints.add(index);
            timeSeriesChart.data.datasets[0].pointBackgroundColor[index] = "#e63946"; // Outlier
        }
        timeSeriesChart.update();
    }

    // Create Chart
    function createChart() {
        generateData();
        feedbackMessage.textContent = "";
        submitButton.style.display = "inline-block";
        userSelectedPoints.clear();

        if (timeSeriesChart) timeSeriesChart.destroy();

        timeSeriesChart = new Chart(canvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Time Series Data",
                        data: dataPoints,
                        borderColor: "#0077cc",
                        backgroundColor: "rgba(0, 119, 204, 0.1)",
                        borderWidth: 2,
                        pointRadius: 6,
                        pointBackgroundColor: new Array(dataPoints.length).fill("#0077cc"),
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (e) => {
                    const points = timeSeriesChart.getElementsAtEventForMode(
                        e,
                        "nearest",
                        { intersect: true },
                        true
                    );

                    if (points.length) {
                        const index = points[0].index;
                        togglePointSelection(index);
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: "Click on Points You Think Are Outliers",
                    },
                },
            },
        });
    }

function verifyAnswer() {
    const userSelections = Array.from(userSelectedPoints).sort((a, b) => a - b);
    const correctSelections = outliers.sort((a, b) => a - b);

    // Prepare Explanation Message
    let explanation = "";
    const totalPoints = dataPoints.length;

    // Helper to determine deviation reasoning
    function getOutlierReason(index) {
        const value = dataPoints[index];
        const prev = index > 0 ? dataPoints[index - 1] : null;
        const next = index < totalPoints - 1 ? dataPoints[index + 1] : null;

        let reason = `Value: ${value}. `;
        if (prev !== null && next !== null) {
            const avgNeighbor = (prev + next) / 2;
            const deviation = Math.abs(value - avgNeighbor);

            reason += `It significantly deviates (+${deviation.toFixed(
                1
            )}) from the average of its neighbors (${avgNeighbor.toFixed(1)}).`;
        } else if (prev !== null) {
            const deviation = Math.abs(value - prev);
            reason += `It deviates sharply (+${deviation.toFixed(
                1
            )}) from the previous point (${prev}).`;
        } else if (next !== null) {
            const deviation = Math.abs(value - next);
            reason += `It deviates sharply (+${deviation.toFixed(
                1
            )}) from the next point (${next}).`;
        }

        return reason;
    }

    // Check each data point
    for (let i = 0; i < totalPoints; i++) {
        if (correctSelections.includes(i) && userSelections.includes(i)) {
            explanation += `✅ Day ${i + 1} (${getOutlierReason(i)}) is an outlier, and you correctly identified it.\n`;
        } else if (correctSelections.includes(i) && !userSelections.includes(i)) {
            explanation += `❗ Day ${i + 1} (${getOutlierReason(i)}) is an outlier, but you missed it.\n`;
        } else if (!correctSelections.includes(i) && userSelections.includes(i)) {
            explanation += `❌ Day ${i + 1} (Value: ${dataPoints[i]}) is NOT an outlier. Its value is close to neighboring points.\n`;
        } else {
            explanation += `✔ Day ${i + 1} (Value: ${dataPoints[i]}) is NOT an outlier, and you correctly ignored it.\n`;
        }
    }

    // Final Overall Feedback
    if (
        userSelections.length === correctSelections.length &&
        userSelections.every((val, idx) => val === correctSelections[idx])
    ) {
        feedbackMessage.textContent =
            "🎉 Correct! You identified all the outliers.\n\n" + explanation;
        feedbackMessage.style.color = "green";
    } else {
        feedbackMessage.textContent =
            "❌ Incorrect. Review the detailed explanation below:\n\n" + explanation;
        feedbackMessage.style.color = "red";
    }

    // Format for readability
    feedbackMessage.style.whiteSpace = "pre-wrap"; // Keeps line breaks for explanation
}



    // Event Listeners
    generateButton.addEventListener("click", createChart);
    submitButton.addEventListener("click", verifyAnswer);
});
