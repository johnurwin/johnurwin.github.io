document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("clustering-generateButton");
    const kmeansButton = document.getElementById("clustering-kmeansButton");
    const dbscanButton = document.getElementById("clustering-dbscanButton");
    const submitButton = document.getElementById("clustering-submitButton");
    const feedback = document.getElementById("clustering-feedback");
    const explanation = document.getElementById("clustering-explanation");
    const algorithmButtons = document.getElementById("clustering-algorithmButtons");
    const canvas = document.getElementById("clustering-scatterPlot").getContext("2d");

    let scatterChart;
    const points = [];
    const trueOutliers = new Set();
    const userSelectedPoints = new Set();
    let pointColors = [];

    // Generate Random Data: 3 Clear Clusters + Some Outliers
    function generateData() {
        points.length = 0;
        userSelectedPoints.clear();
        trueOutliers.clear();
        pointColors = [];

        // Generate 3 clusters
        generateCluster(50, 50, 50); // Cluster 1 (centered at 50, 50)
        generateCluster(150, 50, 50); // Cluster 2 (centered at 150, 50)
        generateCluster(100, 150, 50); // Cluster 3 (centered at 100, 150)

        // Add outliers
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 200 + 10; // Random location outside clusters
            const y = Math.random() * 200 + 10;
            points.push({ x, y });
            pointColors.push("rgba(0, 119, 204, 0.6)");
            trueOutliers.add(points.length - 1);
        }

        createScatterPlot();
        algorithmButtons.style.display = "block";
        explanation.textContent = "";
        feedback.textContent = "";
    }

    // Helper to Generate Points for a Cluster
    function generateCluster(centerX, centerY, size) {
        for (let i = 0; i < 70; i++) {
            const x = centerX + (Math.random() - 0.5) * size;
            const y = centerY + (Math.random() - 0.5) * size;
            points.push({ x, y });
            pointColors.push("rgba(0, 119, 204, 0.6)");
        }
    }

    // Create Scatter Plot
    function createScatterPlot() {
        if (scatterChart) scatterChart.destroy();

        scatterChart = new Chart(canvas, {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: "Points",
                        data: points,
                        backgroundColor: pointColors,
                        pointRadius: 6,
                    },
                ],
            },
            options: {
                onClick: (e) => {
                    const elements = scatterChart.getElementsAtEventForMode(
                        e,
                        "nearest",
                        { intersect: true },
                        true
                    );

                    if (elements.length) {
                        const index = elements[0].index;
                        if (userSelectedPoints.has(index)) {
                            userSelectedPoints.delete(index);
                            pointColors[index] = "rgba(0, 119, 204, 0.6)";
                        } else {
                            userSelectedPoints.add(index);
                            pointColors[index] = "#e63946";
                        }
                        scatterChart.update();
                    }
                },
            },
        });

        submitButton.style.display = "inline-block";
    }

    // Run K-Means Clustering
    function runKMeans() {
        explanation.textContent =
            "K-Means clustering groups points into 3 clusters by minimizing the distance to cluster centroids. It works well for spherical, evenly sized clusters.";

        const clusters = [[], [], []];
        const centroids = [
            { x: 50, y: 50 },
            { x: 150, y: 50 },
            { x: 100, y: 150 },
        ];

        points.forEach((point, index) => {
            const distances = centroids.map(
                (centroid) => Math.hypot(point.x - centroid.x, point.y - centroid.y)
            );
            const clusterIndex = distances.indexOf(Math.min(...distances));
            clusters[clusterIndex].push(index);
        });

        // Update point colors
        clusters[0].forEach((i) => (pointColors[i] = "rgba(255, 99, 132, 0.8)"));
        clusters[1].forEach((i) => (pointColors[i] = "rgba(54, 162, 235, 0.8)"));
        clusters[2].forEach((i) => (pointColors[i] = "rgba(75, 192, 192, 0.8)"));

        scatterChart.update();
    }

    // Run DBSCAN Clustering
    function runDBSCAN() {
        explanation.textContent =
            "DBSCAN groups points based on density, identifying dense clusters and marking sparse points as noise. Unlike K-Means, it can identify arbitrarily shaped clusters.";

        const clusterIndices = new Set();

        points.forEach((point, i) => {
            const neighbors = points.filter(
                (p) => Math.hypot(point.x - p.x, point.y - p.y) < 20
            );

            if (neighbors.length > 5) {
                pointColors[i] = "rgba(0, 200, 0, 0.8)"; // Dense cluster color
                clusterIndices.add(i);
            } else {
                pointColors[i] = "rgba(128, 128, 128, 0.8)"; // Noise point
            }
        });

        scatterChart.update();
    }

    // Verify Outliers
    function verifyOutliers() {
        let correct = 0;
        userSelectedPoints.forEach((index) => {
            if (trueOutliers.has(index)) correct++;
        });

        const missed = trueOutliers.size - correct;
        const incorrectlySelected = userSelectedPoints.size - correct;

        feedback.textContent = `
✅ Correctly Identified Outliers: ${correct}
❗ Missed Outliers: ${missed}
❌ Incorrect Selections: ${incorrectlySelected}
Total Outliers: ${trueOutliers.size}
        `;
    }

    generateButton.addEventListener("click", generateData);
    kmeansButton.addEventListener("click", runKMeans);
    dbscanButton.addEventListener("click", runDBSCAN);
    submitButton.addEventListener("click", verifyOutliers);
});


