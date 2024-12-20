        const balls = document.querySelectorAll('.ball');
        const leftScale = document.getElementById('left-scale');
        const rightScale = document.getElementById('right-scale');
        const feedback = document.getElementById('feedback');
        const history = document.getElementById('history');
        const addLeftButton = document.getElementById('add-left');
        const addRightButton = document.getElementById('add-right');
        const submitButton = document.getElementById('submit');
        const resetScaleButton = document.getElementById('reset-scale');
        const resetHistoryButton = document.getElementById('reset-history');
        const submitAnswerButton = document.getElementById('submit-answer');
        const oddBallSelect = document.getElementById('odd-ball');
        const weightSelect = document.getElementById('weight');

        let selectedBalls = [];
        let leftScaleBalls = [];
        let rightScaleBalls = [];
        let weighHistory = [];
        let attempts = 0;
        const maxAttempts = 3;
        const oddBall = Math.floor(Math.random() * 8) + 1;
        const oddBallWeight = Math.random() > 0.5 ? 'heavy' : 'light';

        balls.forEach(ball => {
            ball.addEventListener('click', () => {
                const ballNumber = ball.getAttribute('data-ball');
                if (selectedBalls.includes(ballNumber)) {
                    selectedBalls = selectedBalls.filter(num => num !== ballNumber);
                    ball.classList.remove('selected');
                } else {
                    selectedBalls.push(ballNumber);
                    ball.classList.add('selected');
                }
            });
        });

        function moveBallToScale(ballNumber, scale, scaleArray) {
            if (!scaleArray.includes(ballNumber)) {
                const ballElement = document.querySelector(`[data-ball="${ballNumber}"]`);
                ballElement.classList.remove('selected');
                scale.appendChild(ballElement);
                scaleArray.push(ballNumber);
                selectedBalls = selectedBalls.filter(num => num !== ballNumber);
            }
        }

        addLeftButton.addEventListener('click', () => {
            selectedBalls.forEach(ballNumber => moveBallToScale(ballNumber, leftScale, leftScaleBalls));
        });

        addRightButton.addEventListener('click', () => {
            selectedBalls.forEach(ballNumber => moveBallToScale(ballNumber, rightScale, rightScaleBalls));
        });

        function weighBalls() {
            if (attempts >= maxAttempts) {
                feedback.innerText = "No more attempts! You've used all your weighings.";
                return;
            }

            attempts++;
            const leftWeight = leftScaleBalls.reduce((sum, num) => sum + (parseInt(num) === oddBall ? (oddBallWeight === 'heavy' ? 2 : 0.5) : 1), 0);
            const rightWeight = rightScaleBalls.reduce((sum, num) => sum + (parseInt(num) === oddBall ? (oddBallWeight === 'heavy' ? 2 : 0.5) : 1), 0);

            const result = leftWeight > rightWeight ? "Left is heavier!" : rightWeight > leftWeight ? "Right is heavier!" : "Balanced!";
            weighHistory.push(`Weighing ${attempts}: Left [${leftScaleBalls.join(', ')}] vs Right [${rightScaleBalls.join(', ')}] -> ${result}`);
            updateHistory();
            feedback.innerText = result;
        }

        function updateHistory() {
            history.innerHTML = `<strong>Weighing History:</strong><br>${weighHistory.join('<br>')}`;
        }

        function resetScales() {
            leftScaleBalls.forEach(ballNumber => {
                const ballElement = document.querySelector(`[data-ball="${ballNumber}"]`);
                document.getElementById('balls').appendChild(ballElement);
            });
            rightScaleBalls.forEach(ballNumber => {
                const ballElement = document.querySelector(`[data-ball="${ballNumber}"]`);
                document.getElementById('balls').appendChild(ballElement);
            });
            leftScaleBalls = [];
            rightScaleBalls = [];
        }

        function resetHistory() {
            weighHistory = [];
            updateHistory();
            feedback.innerText = "";
        }

        function submitAnswer() {
            const guessedBall = parseInt(oddBallSelect.value);
            const guessedWeight = weightSelect.value;
            if (guessedBall === oddBall && guessedWeight === oddBallWeight) {
                feedback.innerText = "Correct! You found the odd ball!";
            } else {
                feedback.innerText = `Incorrect! The odd ball was Ball ${oddBall} and it was ${oddBallWeight}.`;
            }
        }

        submitButton.addEventListener('click', weighBalls);
        resetScaleButton.addEventListener('click', resetScales);
        resetHistoryButton.addEventListener('click', resetHistory);
        submitAnswerButton.addEventListener('click', submitAnswer);

const hintButton = document.getElementById('hint-button');
const hint = document.getElementById('hint');

hintButton.addEventListener('click', () => {
    hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
});