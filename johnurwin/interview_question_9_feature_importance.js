document.addEventListener("DOMContentLoaded", function () {
    const fsq_generateButton = document.getElementById("fsq-generateChartButton");
    const fsq_submitButton = document.getElementById("fsq-submitAnswerButton");
    const fsq_feedbackMessage = document.getElementById("fsq-feedbackMessage");
    const fsq_selectionContainer = document.getElementById("fsq-selectionContainer");
    const fsq_canvas = document.getElementById("fsq-featureImportanceChart").getContext("2d");

    let fsq_featureChart;
    const fsq_models = ["Random Forest", "XGBoost", "Linear Regression"];
    const fsq_features = ["Feature A", "Feature B", "Feature C", "Feature D", "Feature E"];
    const fsq_featureImportance = {};
    const fsq_topFeatures = {};

    // Generate Random Feature Importance
    function fsq_generateFeatureImportance() {
        fsq_models.forEach((model) => {
            fsq_featureImportance[model] = fsq_features.map(() => Math.random() * 100);
            fsq_topFeatures[model] = [...fsq_featureImportance[model]]
                .map((value, index) => ({ feature: fsq_features[index], value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 3)
                .map((item) => item.feature);
        });
    }

    // Create the Chart
    function fsq_createChart() {
        fsq_selectionContainer.innerHTML = "";
        fsq_feedbackMessage.textContent = "";
        fsq_generateFeatureImportance();

        if (fsq_featureChart) fsq_featureChart.destroy();

        fsq_featureChart = new Chart(fsq_canvas, {
            type: "bar",
            data: {
                labels: fsq_features,
                datasets: fsq_models.map((model, i) => ({
                    label: model,
                    data: fsq_featureImportance[model],
                    backgroundColor: `rgba(${100 + i * 50}, ${150 - i * 20}, ${200 + i * 30}, 0.7)`,
                })),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: "Feature Importance Across Models",
                    },
                },
            },
        });

        // Display feature selection checkboxes
        fsq_models.forEach((model) => {
            const container = document.createElement("div");
            container.innerHTML = `<h3>${model}</h3>`;
            fsq_features.forEach((feature) => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `${model}-${feature}`;
                checkbox.name = model;
                checkbox.value = feature;
                container.appendChild(checkbox);
                container.innerHTML += ` ${feature} `;
            });
            fsq_selectionContainer.appendChild(container);
        });
        fsq_submitButton.style.display = "inline-block";
    }

    // Verify User's Selections
    function fsq_verifySelections() {
        fsq_feedbackMessage.textContent = "";
        fsq_models.forEach((model) => {
            const selected = Array.from(
                document.querySelectorAll(`input[name="${model}"]:checked`)
            ).map((input) => input.value);

            const correct = fsq_topFeatures[model];
            let result = `Model: ${model}\n`;

            correct.forEach((feature) => {
                if (selected.includes(feature)) {
                    result += `✅ ${feature} is correct.\n`;
                } else {
                    result += `❗ ${feature} is missing.\n`;
                }
            });

            selected.forEach((feature) => {
                if (!correct.includes(feature)) {
                    result += `❌ ${feature} is incorrect.\n`;
                }
            });

            fsq_feedbackMessage.textContent += result + "\n";
        });
    }

    fsq_generateButton.addEventListener("click", fsq_createChart);
    fsq_submitButton.addEventListener("click", fsq_verifySelections);
});
