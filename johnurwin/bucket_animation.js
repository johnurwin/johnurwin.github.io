const fiveGallonBucket = {
    capacity: 5,
    current: 0,
    element: document.getElementById('five-gallon-water')
};

const threeGallonBucket = {
    capacity: 3,
    current: 0,
    element: document.getElementById('three-gallon-water')
};

function updateWater(bucket) {
    const height = (bucket.current / bucket.capacity) * 100;
    bucket.element.style.height = `${height}%`;

    checkSolution();
}

function fillBucket(bucketName) {
    const bucket = bucketName === 'five' ? fiveGallonBucket : threeGallonBucket;
    bucket.current = bucket.capacity;
    updateWater(bucket);
    updateStatus(`${bucketName.toUpperCase()} bucket filled!`);
    playWaterSplash();
}

function emptyBucket(bucketName) {
    const bucket = bucketName === 'five' ? fiveGallonBucket : threeGallonBucket;
    bucket.current = 0;
    updateWater(bucket);
    updateStatus(`${bucketName.toUpperCase()} bucket emptied!`);
}

function transferWater() {
    let source, target;

    if (fiveGallonBucket.current > 0 && threeGallonBucket.current < threeGallonBucket.capacity) {
        source = fiveGallonBucket;
        target = threeGallonBucket;
    } else if (threeGallonBucket.current > 0 && fiveGallonBucket.current < fiveGallonBucket.capacity) {
        source = threeGallonBucket;
        target = fiveGallonBucket;
    }

    const transferAmount = Math.min(source.current, target.capacity - target.current);

    source.current -= transferAmount;
    target.current += transferAmount;

    updateWater(source);
    updateWater(target);

    updateStatus(`Transferred ${transferAmount} gallon(s)!`);
    playWaterSplash();
}

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

function checkSolution() {
    if (fiveGallonBucket.current === 4) {
        showCorrectPopup();
    }
}

function showCorrectPopup() {
    const popup = document.getElementById('correct-popup');
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

function playWaterSplash() {
    const splashAudio = document.getElementById('water-splash');
    splashAudio.currentTime = 0; // Restart audio if already playing
    splashAudio.play();
}

let currentProblem = 'bucket'; // Switch between 'bucket' or 'bird'
let birdPosition = { top: 50, left: 50 }; // Initial bird position
let correctTree = Math.floor(Math.random() * 20) + 1; // Correct tree to find
let visitedTrees = []; // To track visited trees

function toggleProblem() {
    if (currentProblem === 'bucket') {
        // Switch to bird navigation problem
        document.getElementById('problem-title').innerText = 'Bird Navigation Puzzle';
        document.getElementById('problem-description').innerText = 'Help the bird navigate to the correct tree!';
        document.getElementById('toggle-problem-btn').innerText = 'Switch to Bucket Problem';
        document.getElementById('bucket-problem').style.display = 'none';
        document.getElementById('bird-problem').style.display = 'block';
        currentProblem = 'bird';
        initializeBirdPuzzle();
    } else {
        // Switch back to bucket problem
        document.getElementById('problem-title').innerText = '5-Gallon and 3-Gallon Bucket Problem';
        document.getElementById('problem-description').innerText = 'Use the buckets to measure exactly 4 gallons of water!';
        document.getElementById('toggle-problem-btn').innerText = 'Switch to Bird Puzzle';
        document.getElementById('bucket-problem').style.display = 'block';
        document.getElementById('bird-problem').style.display = 'none';
        currentProblem = 'bucket';
    }
}

function initializeBirdPuzzle() {
    // Remove any previous trees before re-initializing
    document.querySelectorAll('.tree').forEach(tree => tree.remove());

    let xPosition = 10;
    let yPosition = 10;

    // Create 20 trees, spaced properly
    for (let i = 1; i <= 20; i++) {
        let tree = document.createElement('div');
        tree.classList.add('tree');
        tree.id = `tree-${i}`;

        // Position trees in a grid, 4 trees per row with 10% horizontal spacing
        let top = yPosition + Math.floor(Math.random() * 20); // Slight randomization vertically
        let left = xPosition + Math.floor(Math.random() * 10); // Slight randomization horizontally

        // Add the leaves to the tree
        let leaves = document.createElement('div');
        leaves.classList.add('leaves');
        tree.appendChild(leaves);

        tree.style.top = `${top}%`;
        tree.style.left = `${left}%`;
        document.querySelector('.bird-container').appendChild(tree);

        // Adjust horizontal position for next tree, creating a grid
        xPosition += 20; 
        if (xPosition > 70) { // Reset after 4 trees
            xPosition = 10;
            yPosition += 20; // Move down a row
        }
    }

    // Place the bird in front of the trees
    let birdElement = document.getElementById('bird');
    birdElement.style.top = `${birdPosition.top}%`;
    birdElement.style.left = `${birdPosition.left}%`;
    document.getElementById('bird-status').innerText = `The bird needs to find Tree ${correctTree}`;
}

function moveBird(direction) {
    let birdElement = document.getElementById('bird');

    // Calculate new position based on the direction
    if (direction === 'up' && birdPosition.top > 0) {
        birdPosition.top -= 10;
    } else if (direction === 'down' && birdPosition.top < 90) {
        birdPosition.top += 10;
    } else if (direction === 'left' && birdPosition.left > 0) {
        birdPosition.left -= 10;
    } else if (direction === 'right' && birdPosition.left < 90) {
        birdPosition.left += 10;
    }

    // Update the bird's position
    birdElement.style.top = `${birdPosition.top}%`;
    birdElement.style.left = `${birdPosition.left}%`;

    checkCollision();
}

function checkCollision() {
    let birdElement = document.getElementById('bird');
    let birdRect = birdElement.getBoundingClientRect();

    // Check if the bird is over a tree
    for (let i = 1; i <= 20; i++) {
        let tree = document.getElementById(`tree-${i}`);
        let treeRect = tree.getBoundingClientRect();

        if (isCollision(birdRect, treeRect)) {
            visitedTrees.push(i);
            if (i === correctTree) {
                document.getElementById('bird-status').innerText = 'You found the correct tree!';
            } else {
                document.getElementById('bird-status').innerText = `Tree ${i} was not the correct one!`;
            }
            return;
        }
    }
}

function isCollision(birdRect, treeRect) {
    return !(
        birdRect.top > treeRect.bottom ||
        birdRect.bottom < treeRect.top ||
        birdRect.left > treeRect.right ||
        birdRect.right < treeRect.left
    );
}

function getHint() {
    // Provide a hint: the correct tree
    document.getElementById('bird-status').innerText = `Hint: The correct tree is Tree ${correctTree}`;
}

function initializeBirdPuzzle() {
    // Remove any previous trees before re-initializing
    document.querySelectorAll('.tree').forEach(tree => tree.remove());

    let xPosition = 10;
    let yPosition = 10;

    // Create 20 trees, spaced properly
    for (let i = 1; i <= 20; i++) {
        let tree = document.createElement('div');
        tree.classList.add('tree');
        tree.id = `tree-${i}`;

        // Position trees in a grid, 4 trees per row with 10% horizontal spacing
        let top = yPosition + Math.floor(Math.random() * 20); // Slight randomization vertically
        let left = xPosition + Math.floor(Math.random() * 10); // Slight randomization horizontally

        // Add the leaves to the tree
        let leaves = document.createElement('div');
        leaves.classList.add('leaves');
        tree.appendChild(leaves);

        tree.style.top = `${top}%`;
        tree.style.left = `${left}%`;
        document.querySelector('.bird-container').appendChild(tree);

        // Adjust horizontal position for next tree, creating a grid
        xPosition += 20; 
        if (xPosition > 70) { // Reset after 4 trees
            xPosition = 10;
            yPosition += 20; // Move down a row
        }
    }

    // Place the bird in front of the trees
    let birdElement = document.getElementById('bird');
    birdElement.style.top = `${birdPosition.top}%`;
    birdElement.style.left = `${birdPosition.left}%`;
    document.getElementById('bird-status').innerText = `The bird needs to find Tree ${correctTree}`;

    // Add wings to the bird element
    let leftWing = document.createElement('div');
    leftWing.classList.add('wing-left');
    birdElement.appendChild(leftWing);

    let rightWing = document.createElement('div');
    rightWing.classList.add('wing-right');
    birdElement.appendChild(rightWing);
}

function toggleFlap() {
    const birdLeftWing = document.querySelector('.bird .wing-left');
    const birdRightWing = document.querySelector('.bird .wing-right');
    console.log("Toggling wings animation");
    
    if (birdLeftWing.style.animationPlayState === 'paused') {
        birdLeftWing.style.animationPlayState = 'running';
        birdRightWing.style.animationPlayState = 'running';
    } else {
        birdLeftWing.style.animationPlayState = 'paused';
        birdRightWing.style.animationPlayState = 'paused';
    }
}


let birdElement = document.querySelector('.bird');
let isBird = true;

function transformBird() {
    if (isBird) {
        // Transform bird into eagle
        birdElement.classList.remove('bird'); // Remove bird class
        birdElement.classList.add('eagle');   // Add eagle class
        birdElement.innerHTML = ''; // Clear out the bird element content

        // Add eagle-specific elements (head, wings, etc.)
        addEagleParts();

        isBird = false; // Toggle the state to indicate it's now an eagle
    } else {
        // Revert back to bird
        birdElement.classList.remove('eagle');
        birdElement.classList.add('bird');
        birdElement.innerHTML = ''; // Clear the eagle content

        // Add back the bird-specific elements
        addBirdParts();

        isBird = true; // Toggle back to bird state
    }
}

function addEagleParts() {
    // Create and add eagle's parts
    const head = document.createElement('div');
    head.classList.add('head');
    birdElement.appendChild(head);

    const beak = document.createElement('div');
    beak.classList.add('beak');
    birdElement.appendChild(beak);

    const eyeLeft = document.createElement('div');
    eyeLeft.classList.add('eye-left');
    birdElement.appendChild(eyeLeft);

    const eyeRight = document.createElement('div');
    eyeRight.classList.add('eye-right');
    birdElement.appendChild(eyeRight);

    const wingLeft = document.createElement('div');
    wingLeft.classList.add('wing-left');
    birdElement.appendChild(wingLeft);

    const wingRight = document.createElement('div');
    wingRight.classList.add('wing-right');
    birdElement.appendChild(wingRight);

    const tail = document.createElement('div');
    tail.classList.add('tail');
    birdElement.appendChild(tail);
}

function addBirdParts() {
    // Simply reset to the basic bird style, no need for extra parts
    const birdBody = document.createElement('div');
    birdBody.classList.add('bird');
    birdElement.appendChild(birdBody);
}



