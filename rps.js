const URL_MODEL = "https://teachablemachine.withgoogle.com/models/_YVCVfRuR/";

let model, webcam, maxPredictions;
let isModelLoaded = false;
let isPlaying = false;

// Game State
let scores = { win: 0, lose: 0, draw: 0 };
let currentPrediction = ""; // Most confident class

// DOM Elements
const btnStart = document.getElementById("btnStartGame");
const messageEl = document.getElementById("message");
const userMoveEl = document.getElementById("user-move");
const computerMoveEl = document.getElementById("computer-move");
const computerEmojiEl = document.getElementById("computer-emoji");
const scoreWin = document.getElementById("score-win");
const scoreDraw = document.getElementById("score-draw");
const scoreLose = document.getElementById("score-lose");

// Mapping Teachable Machine classes to Game Logic
// Update these strings if your model classes are named differently!
const CLASS_ROCK = ["Rock", "rock", "bawi", "stone", "주먹", "바위"];
const CLASS_PAPER = ["Paper", "paper", "bo", "hand", "보", "보자기"];
const CLASS_SCISSORS = ["Scissors", "scissors", "gawi", "scissor", "가위"];

function normalizeClass(className) {
  const lower = className.toLowerCase();
  if (CLASS_ROCK.some(k => lower.includes(k.toLowerCase()))) return "rock";
  if (CLASS_PAPER.some(k => lower.includes(k.toLowerCase()))) return "paper";
  if (CLASS_SCISSORS.some(k => lower.includes(k.toLowerCase()))) return "scissors";
  return "unknown"; // Or handle as raw string
}

const EMOJI_MAP = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
  unknown: "❓"
};

async function init() {
  const modelURL = URL_MODEL + "model.json";
  const metadataURL = URL_MODEL + "metadata.json";

  try {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup Webcam
    const flip = true; 
    webcam = new tmImage.Webcam(200, 200, flip); 
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append to DOM
    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    isModelLoaded = true;
    btnStart.disabled = false;
    btnStart.textContent = "Start Game";
    messageEl.textContent = "Ready! Press Start to play.";

  } catch (error) {
    console.error("Error loading model:", error);
    messageEl.textContent = "Error loading model. Check console.";
  }
}

async function loop() {
  webcam.update();
  if (isModelLoaded && !isPlaying) {
    // Continuous prediction to show user what the camera sees
    await predict(false);
  }
  window.requestAnimationFrame(loop);
}

async function predict(isFinal = false) {
  const prediction = await model.predict(webcam.canvas);
  
  let maxProb = 0;
  let bestClass = "";

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability > maxProb) {
      maxProb = prediction[i].probability;
      bestClass = prediction[i].className;
    }
  }

  // Only update UI if we are confident enough or strictly strictly debugging
  const normalized = normalizeClass(bestClass);
  currentPrediction = normalized;

  if (!isFinal) {
    // Live feedback
    userMoveEl.textContent = `${bestClass} (${(maxProb * 100).toFixed(0)}%)`;
  }
  
  return normalized;
}

// Game Logic
btnStart.onclick = async () => {
  if (isPlaying) return;
  isPlaying = true;
  btnStart.disabled = true;
  
  // Reset UI
  computerEmojiEl.textContent = "🤖";
  computerMoveEl.textContent = "-";
  messageEl.className = "game-message countdown";

  // Countdown
  let count = 3;
  messageEl.textContent = count;
  
  const timer = setInterval(async () => {
    count--;
    if (count > 0) {
      messageEl.textContent = count;
    } else {
      clearInterval(timer);
      messageEl.textContent = "SHOOT!";
      
      // Capture Move
      const userMove = await predict(true);
      playRound(userMove);
      
      isPlaying = false;
      btnStart.disabled = false;
      messageEl.className = "game-message"; // remove countdown style
    }
  }, 1000);
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

// Start immediately
init();
