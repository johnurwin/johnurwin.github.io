// Grade the quiz
function gradeQuiz() {
  const answers = {
    q1: "b",
    q2: "b",
  };

  let score = 0;

  for (let [question, correctAnswer] of Object.entries(answers)) {
    const selected = document.querySelector(`input[name="${question}"]:checked`);
    if (selected && selected.value === correctAnswer) {
      score++;
    }
  }

  document.getElementById("results").innerHTML = `You scored ${score} out of ${Object.keys(answers).length}`;
}

// Run code challenge
function runCode() {
  const userCode = document.getElementById("codeArea").value;
  const testInput = [0.9, 0.85, 0.88, 0.92, 0.87]; // Example fold accuracies

  try {
    const userFunction = new Function("foldAccuracies", userCode);
    const result = userFunction(testInput);
    document.getElementById("output").innerHTML = `Output: ${result}`;
  } catch (error) {
    document.getElementById("output").innerHTML = `Error: ${error.message}`;
  }
}

    function animateFolds() {
      const foldCount = parseInt(document.getElementById("fold-count").value);
      const animationArea = document.getElementById("animation-area");
      const progressBar = document.getElementById("progress-bar");
      animationArea.innerHTML = ""; // Clear previous animation
      progressBar.style.width = "0%";

      // Generate data blocks (e.g., 50 total blocks)
      const totalData = 50;
      const data = Array.from({ length: totalData }, (_, i) => i + 1);

      // Split into folds
      const foldSize = Math.ceil(totalData / foldCount);
      const folds = [];
      for (let i = 0; i < foldCount; i++) {
        folds.push(data.slice(i * foldSize, (i + 1) * foldSize));
      }

      // Animate each fold
      folds.forEach((testFold, index) => {
        const foldDiv = document.createElement("div");
        foldDiv.classList.add("fold");
        foldDiv.style.animationDelay = `${index * 1}s`; // Stagger animations
        foldDiv.innerHTML = `<strong>Fold ${index + 1}</strong>`;

        // Mark training and testing data
        data.forEach((item) => {
          const block = document.createElement("div");
          block.classList.add("data-block");
          if (testFold.includes(item)) {
            block.classList.add("testing");
          } else {
            block.classList.add("training");
          }
          foldDiv.appendChild(block);
        });

        // Add fold div to the animation area
        setTimeout(() => {
          animationArea.appendChild(foldDiv);
          updateProgress(index + 1, foldCount);
          if (index === foldCount - 1) {
            setTimeout(showConfetti, 1000);
          }
        }, index * 1000); // Delay for each fold
      });
    }

    function updateProgress(currentFold, totalFolds) {
      const progressBar = document.getElementById("progress-bar");
      const percentage = (currentFold / totalFolds) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    function showConfetti() {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.innerHTML = "🎉 Congratulations! 🎉";
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
