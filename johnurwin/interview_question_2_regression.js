        let isMultivariate = false;
        let sharedData = [];

        function toggleRegressionMode() {
            isMultivariate = !isMultivariate;

            document.getElementById('univariate-controls').style.display = isMultivariate ? 'none' : 'block';
            document.getElementById('multivariate-controls').style.display = isMultivariate ? 'block' : 'none';
            document.getElementById('threejs-container').style.display = isMultivariate ? 'block' : 'none';

            const button = document.getElementById('toggle-button');
            button.textContent = isMultivariate ? 'Switch to Univariate Regression' : 'Switch to Multivariate Regression';

            generateSharedData();
            updateRegressionModel();
        }

        function generateSharedData() {
            if (isMultivariate) {
                sharedData = Array.from({ length: 25 }, () => ({
                    x1: Math.random() * 5,
                    x2: Math.random() * 5,
                    y: Math.random() * 10
                }));
            }
        }

        function create3DGraph(data, coefX1, coefX2, intercept) {
            const container = document.getElementById('threejs-container');

            // Clear previous graph
            container.innerHTML = '';

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();

            renderer.setSize(container.offsetWidth, container.offsetHeight);
            container.appendChild(renderer.domElement);

            // Axes
            const axesHelper = new THREE.AxesHelper(5);
            scene.add(axesHelper);

            // Data points
            const pointsMaterial = new THREE.PointsMaterial({ color: 0x0000ff, size: 0.1 });
            const pointsGeometry = new THREE.BufferGeometry();

            const points = data.flatMap(({ x1, x2, y }) => [x1, x2, y]);
            pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

            const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
            scene.add(pointsMesh);

            // Plane
            const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
            const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, wireframe: true });
            const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

            planeGeometry.attributes.position.array.forEach((_, idx) => {
                const x1 = planeGeometry.attributes.position.getX(idx);
                const x2 = planeGeometry.attributes.position.getY(idx);
                const y = coefX1 * x1 + coefX2 * x2 + intercept;
                planeGeometry.attributes.position.setZ(idx, y);
            });
            planeGeometry.attributes.position.needsUpdate = true;

            scene.add(planeMesh);

            camera.position.set(2, 2, 5);
            camera.lookAt(0, 0, 0);

            const animate = function () {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            animate();
        }

        function updateRegressionModel() {
            const canvas = document.getElementById('regression-plot');
            const ctx = canvas.getContext('2d');

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let mse;
            if (isMultivariate) {
                const coefX1 = parseFloat(document.getElementById('coef-x1').value);
                const coefX2 = parseFloat(document.getElementById('coef-x2').value);
                const intercept = parseFloat(document.getElementById('intercept-multi').value);

                document.getElementById('coef-x1-value').textContent = coefX1;
                document.getElementById('coef-x2-value').textContent = coefX2;
                document.getElementById('intercept-multi-value').textContent = intercept;

                mse = sharedData.reduce((sum, point) => {
                    const predictedY = coefX1 * point.x1 + coefX2 * point.x2 + intercept;
                    return sum + Math.pow(point.y - predictedY, 2);
                }, 0) / sharedData.length;

                // Draw scatter points for 2D projection
                sharedData.forEach(point => {
                    ctx.beginPath();
                    ctx.arc(point.x1 * 100, canvas.height - point.y * 40, 5, 0, Math.PI * 2);
                    ctx.fillStyle = 'blue';
                    ctx.fill();
                    ctx.closePath();
                });

                create3DGraph(sharedData, coefX1, coefX2, intercept);

            } else {
                const slope = parseFloat(document.getElementById('slope').value);
                const intercept = parseFloat(document.getElementById('intercept').value);

                document.getElementById('slope-value').textContent = slope;
                document.getElementById('intercept-value').textContent = intercept;

                const data = [
                    { x: 1, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 5 },
                    { x: 4, y: 7 },
                    { x: 5, y: 11 }
                ];

                mse = data.reduce((sum, point) => {
                    const predictedY = slope * point.x + intercept;
                    return sum + Math.pow(point.y - predictedY, 2);
                }, 0) / data.length;

                // Draw regression line for univariate
                ctx.beginPath();
                ctx.moveTo(0, canvas.height - intercept * 40);
                ctx.lineTo(canvas.width, canvas.height - ((slope * 5 + intercept) * 40));
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw scatter points for univariate
                data.forEach(point => {
                    ctx.beginPath();
                    ctx.arc(point.x * 100, canvas.height - point.y * 40, 5, 0, Math.PI * 2);
                    ctx.fillStyle = 'blue';
                    ctx.fill();
                    ctx.closePath();
                });
            }

            document.getElementById('mse-output').textContent = `MSE: ${mse.toFixed(2)}`;
        }

        // Initialize default regression model
        updateRegressionModel();