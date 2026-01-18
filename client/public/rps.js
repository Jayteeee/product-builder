const URL_MODEL = "https://teachablemachine.withgoogle.com/models/_YVCVfRuR/";

let model, webcam, maxPredictions;
let isModelLoaded = false;
let isPlaying = false;
let currentMode = 'webcam'; // 'webcam' or 'image'
let animationId = null;

// Game State
let scores = { win: 0, lose: 0, draw: 0 };

// DOM Elements
const btnStart = document.getElementById("btnStartGame");
const messageEl = document.getElementById("message");
const userMoveEl = document.getElementById("user-move");
const computerMoveEl = document.getElementById("computer-move");
const computerEmojiEl = document.getElementById("computer-emoji");
const scoreWin = document.getElementById("score-win");
const scoreDraw = document.getElementById("score-draw");
const scoreLose = document.getElementById("score-lose");

// Mode & Upload Elements
const btnModeWebcam = document.getElementById("btnModeWebcam");
const btnModeImage = document.getElementById("btnModeImage");
const webcamContainer = document.getElementById("webcam-container");
const uploadContainer = document.getElementById("upload-container");
const imageUploadInput = document.getElementById("image-upload");
const uploadedImage = document.getElementById("uploaded-image");
const uploadPlaceholder = document.getElementById("upload-placeholder");
const imagePreviewWrapper = document.querySelector(".image-preview-wrapper");


// Mapping Teachable Machine classes to Game Logic
const CLASS_ROCK = ["Rock", "rock", "bawi", "stone", "주먹", "바위"];
const CLASS_PAPER = ["Paper", "paper", "bo", "hand", "보", "보자기"];
const CLASS_SCISSORS = ["Scissors", "scissors", "gawi", "scissor", "가위"];

const EMOJI_MAP = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
  unknown: "❓"
};

function normalizeClass(className) {
  const lower = className.toLowerCase();
  if (CLASS_ROCK.some(k => lower.includes(k.toLowerCase()))) return "rock";
  if (CLASS_PAPER.some(k => lower.includes(k.toLowerCase()))) return "paper";
  if (CLASS_SCISSORS.some(k => lower.includes(k.toLowerCase()))) return "scissors";
  return "unknown"; 
}

async function init() {
  const modelURL = URL_MODEL + "model.json";
  const metadataURL = URL_MODEL + "metadata.json";

  try {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup Webcam initially (even if hidden later)
    const flip = true; 
    webcam = new tmImage.Webcam(200, 200, flip); 
    await webcam.setup(); 
    
    // Append to DOM
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);

    isModelLoaded = true;
    
    // Start in Webcam mode by default
    toggleMode('webcam');
    
    btnStart.disabled = false;
    btnStart.textContent = "Start Game";
    messageEl.textContent = "Ready! Press Start to play.";

  } catch (error) {
    console.error("Error loading model:", error);
    messageEl.textContent = "Error loading model or camera. Check console.";
  }
}

function toggleMode(mode) {
    currentMode = mode;

    if (mode === 'webcam') {
        // UI
        btnModeWebcam.classList.add('active');
        btnModeImage.classList.remove('active');
        webcamContainer.classList.remove('hidden');
        uploadContainer.classList.add('hidden');
        
        // Functionality
        webcam.play();
        loop(); // Start loop
        userMoveEl.textContent = "-";

    } else {
        // UI
        btnModeWebcam.classList.remove('active');
        btnModeImage.classList.add('active');
        webcamContainer.classList.add('hidden');
        uploadContainer.classList.remove('hidden');
        
        // Functionality
        webcam.stop(); // Stop webcam to save resource
        if (animationId) cancelAnimationFrame(animationId); // Stop loop
        
        // Reset prediction text if no image
        if (!uploadedImage.src || uploadedImage.classList.contains('hidden')) {
             userMoveEl.textContent = "Upload an image";
        } else {
            // Repredict current image just in case
            predict(uploadedImage, false);
        }
    }
}

async function loop() {
  if (currentMode === 'webcam') {
      webcam.update();
      if (isModelLoaded && !isPlaying) {
        await predict(webcam.canvas, false);
      }
      animationId = window.requestAnimationFrame(loop);
  }
}

async function predict(imageSource, isFinal = false) {
  if (!imageSource) return "unknown";

  const prediction = await model.predict(imageSource);
  
  let maxProb = 0;
  let bestClass = "";

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability > maxProb) {
      maxProb = prediction[i].probability;
      bestClass = prediction[i].className;
    }
  }

  const normalized = normalizeClass(bestClass);

  if (!isFinal) {
    // Live feedback
    userMoveEl.textContent = `${bestClass} (${(maxProb * 100).toFixed(0)}%)`;
  }
  
  return normalized;
}

// Event Listeners for Mode
btnModeWebcam.onclick = () => toggleMode('webcam');
btnModeImage.onclick = () => toggleMode('image');

// Image Upload Logic
imagePreviewWrapper.onclick = () => imageUploadInput.click();

imageUploadInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.src = e.target.result;
            uploadedImage.classList.remove('hidden');
            uploadPlaceholder.classList.add('hidden');
            
            // Predict immediately when image loads
            uploadedImage.onload = () => {
                predict(uploadedImage, false);
            };
        };
        reader.readAsDataURL(file);
    }
};


// Game Logic
btnStart.onclick = async () => {
  if (isPlaying) return;

  // Validation for Image Mode
  if (currentMode === 'image' && (!uploadedImage.src || uploadedImage.classList.contains('hidden'))) {
      messageEl.textContent = "Please upload an image first!";
      return;
  }

  isPlaying = true;
  btnStart.disabled = true;
  
  // Reset UI
  computerEmojiEl.textContent = "🤖";
  computerMoveEl.textContent = "-";
  messageEl.className = "game-message countdown";

  // Countdown (Unified for both modes for suspense)
  let count = 3;
  messageEl.textContent = count;
  
  const timer = setInterval(async () => {
    count--;
    if (count > 0) {
      messageEl.textContent = count;
    } else {
      clearInterval(timer);
      messageEl.textContent = "SHOOT!";
      
      // Capture Move based on Mode
      let userMove;
      if (currentMode === 'webcam') {
          userMove = await predict(webcam.canvas, true);
      } else {
          userMove = await predict(uploadedImage, true);
      }

      playRound(userMove);
      
      isPlaying = false;
      btnStart.disabled = false;
      messageEl.className = "game-message"; 
    }
  }, 1000); // 1 second interval
};

function playRound(userMove) {
  // 1. Computer Move
  const moves = ['rock', 'paper', 'scissors'];
  const computerMove = moves[Math.floor(Math.random() * moves.length)];

  // 2. Display Moves
  computerEmojiEl.textContent = EMOJI_MAP[computerMove];
  computerMoveEl.textContent = computerMove.toUpperCase();
  userMoveEl.textContent = `${userMove.toUpperCase()} ${EMOJI_MAP[userMove] || ''}`;

  // 3. Determine Winner
  if (userMove === 'unknown') {
    messageEl.textContent = "Could not recognize your hand. Try again!";
    return;
  }

  let result = 'draw';
  if (userMove === computerMove) {
    result = 'draw';
  } else if (
    (userMove === 'rock' && computerMove === 'scissors') ||
    (userMove === 'paper' && computerMove === 'rock') ||
    (userMove === 'scissors' && computerMove === 'paper')
  ) {
    result = 'win';
  } else {
    result = 'lose';
  }

  // 4. Update Score & Message
  if (result === 'win') {
    scores.win++;
    messageEl.textContent = "You Win! 🎉";
    scoreWin.textContent = scores.win;
  } else if (result === 'lose') {
    scores.lose++;
    messageEl.textContent = "You Lose 😢";
    scoreLose.textContent = scores.lose;
  } else {
    scores.draw++;
    messageEl.textContent = "It's a Draw! 🤝";
    scoreDraw.textContent = scores.draw;
  }
}

// Start initialization
init();