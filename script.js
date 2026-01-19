// ===================================
// GLOBAL STATE & CONFIGURATION
// ===================================

// Shared channel for real-time sync between tabs
const channel = new BroadcastChannel("micro-volunteer-hub");

// Application state
let tasks = [
  {
    id: 1,
    title: "Verify Restaurant Location",
    description: "Check if 'Milano Pizza' is still at 123 Main St on Google Maps",
    duration: "5 min",
    impact: "+12",
    type: "map",
    icon: "📍"
  },
  {
    id: 2,
    title: "Proofread Article",
    description: "Fix grammar in a 200-word sustainability article for local blog",
    duration: "8 min",
    impact: "+15",
    type: "writing",
    icon: "✏️"
  },
  {
    id: 3,
    title: "Identify Plant Species",
    description: "Help a botany student identify flowering plant from uploaded photo",
    duration: "7 min",
    impact: "+10",
    type: "nature",
    icon: "🌿"
  },
  {
    id: 4,
    title: "Verify Park Trail Info",
    description: "Confirm hiking trail information on OpenStreetMap is up to date",
    duration: "10 min",
    impact: "+18",
    type: "map",
    icon: "🥾"
  },
  {
    id: 5,
    title: "Review Event Description",
    description: "Proofread community event announcement (150 words)",
    duration: "6 min",
    impact: "+8",
    type: "writing",
    icon: "📝"
  },
  {
    id: 6,
    title: "Identify Bird Species",
    description: "Help wildlife conservation project identify bird from photo",
    duration: "9 min",
    impact: "+14",
    type: "nature",
    icon: "🦜"
  },
  {
    id: 7,
    title: "Check Business Hours",
    description: "Verify library hours listed on Google Maps are accurate",
    duration: "5 min",
    impact: "+10",
    type: "map",
    icon: "⏰"
  },
  {
    id: 8,
    title: "Identify Tree Species",
    description: "Help community garden identify tree type for landscaping plan",
    duration: "8 min",
    impact: "+12",
    type: "nature",
    icon: "🌳"
  }
];

let currentTaskIndex = 0;
let userCompletedTasks = 0;
let globalCompletedTasks = 8932;
let totalTimeSpent = 0;
let totalImpactPoints = 0;
let favorites = 0;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupRealTimeSync();
  animateStats();
});

function initializeApp() {
  updateAvailableTasks();
  simulateActiveUsers();
  simulateGlobalActivity();
}

// ===================================
// STATS ANIMATIONS
// ===================================

function animateStats() {
  // Animate Active Volunteers
  animateNumber('activeVolunteers', 1247, 2000);
  
  // Animate Global Tasks Completed
  animateNumber('globalTasksCompleted', globalCompletedTasks, 2000);
  
  // Animate Tasks This Hour
  setTimeout(() => {
    animateNumber('tasksHour', 142, 1500);
  }, 500);
}

function animateNumber(elementId, target, duration) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

function simulateActiveUsers() {
  setInterval(() => {
    const activeUsersEl = document.getElementById('activeUsers');
    if (!activeUsersEl) return;
    
    const current = parseInt(activeUsersEl.textContent);
    const change = Math.random() > 0.5 ? 1 : -1;
    const newValue = Math.max(1, Math.min(15, current + change));
    
    activeUsersEl.textContent = newValue;
  }, 8000);
}

function simulateGlobalActivity() {
  setInterval(() => {
    globalCompletedTasks++;
    const globalEl = document.getElementById('globalTasksCompleted');
    if (globalEl) {
      globalEl.textContent = globalCompletedTasks.toLocaleString();
    }
  }, 15000);
}

function updateAvailableTasks() {
  const availableEl = document.getElementById('tasksAvailable');
  if (availableEl) {
    availableEl.textContent = tasks.length - currentTaskIndex;
  }
}

// ===================================
// NAVIGATION & MODE SWITCHING
// ===================================

function showSwipeMode() {
  // Hide hero section
  const heroSection = document.getElementById('heroSection');
  if (heroSection) heroSection.style.display = 'none';
  
  // Show swipe mode
  const swipeMode = document.getElementById('swipeMode');
  if (swipeMode) {
    swipeMode.style.display = 'block';
    currentTaskIndex = 0;
    renderCardStack();
    updateProgress();
  }
}

function exitSwipeMode() {
  // Show hero section
  const heroSection = document.getElementById('heroSection');
  if (heroSection) heroSection.style.display = 'block';
  
  // Hide swipe mode
  const swipeMode = document.getElementById('swipeMode');
  if (swipeMode) swipeMode.style.display = 'none';
}

// ===================================
// CARD RENDERING
// ===================================

function renderCardStack() {
  const cardStack = document.getElementById('cardStack');
  if (!cardStack) return;
  
  cardStack.innerHTML = '';
  
  // Render up to 3 cards (current + 2 behind)
  for (let i = 0; i < 3 && currentTaskIndex + i < tasks.length; i++) {
    const task = tasks[currentTaskIndex + i];
    const card = createSwipeCard(task, i);
    cardStack.appendChild(card);
  }
  
  // Add touch/mouse events to top card
  const topCard = cardStack.querySelector('.top-card');
  if (topCard) {
    setupSwipeEvents(topCard);
  }
}

function createSwipeCard(task, position) {
  const card = document.createElement('div');
  card.className = `swipe-card ${position === 0 ? 'top-card' : position === 1 ? 'behind-1' : 'behind-2'}`;
  card.dataset.taskId = task.id;
  
  card.innerHTML = `
    <div class="card-icon ${task.type}">
      ${task.icon}
    </div>
    <h2 class="card-title">${task.title}</h2>
    <p class="card-description">${task.description}</p>
    
    <div class="card-meta">
      <div class="meta-item duration">
        <div class="meta-label">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 3v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Duration
        </div>
        <div class="meta-value">${task.duration}</div>
      </div>
      
      <div class="meta-item impact">
        <div class="meta-label">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1l-1.5 3-3 .5 2 2-1 3 3.5-2 3.5 2-1-3 2-2-3-.5L7 1z" fill="currentColor"/>
          </svg>
          Impact
        </div>
        <div class="meta-value">${task.impact}</div>
      </div>
    </div>
    
    <div class="card-actions">
      <button class="action-btn skip-btn" onclick="skipTask()">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Skip
      </button>
      <button class="action-btn help-btn" onclick="completeTask()">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M6 10l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        I'll Help!
      </button>
    </div>
  `;
  
  return card;
}

// ===================================
// SWIPE FUNCTIONALITY
// ===================================

let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let isDragging = false;

function setupSwipeEvents(card) {
  // Mouse events
  card.addEventListener('mousedown', handleDragStart);
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);
  
  // Touch events
  card.addEventListener('touchstart', handleDragStart);
  document.addEventListener('touchmove', handleDragMove, { passive: false });
  document.addEventListener('touchend', handleDragEnd);
}

function handleDragStart(e) {
  isDragging = true;
  const touch = e.type === 'mousedown' ? e : e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}

function handleDragMove(e) {
  if (!isDragging) return;
  
  const touch = e.type === 'mousemove' ? e : e.touches[0];
  currentX = touch.clientX;
  currentY = touch.clientY;
  
  const diffX = currentX - startX;
  const diffY = currentY - startY;
  
  const topCard = document.querySelector('.top-card');
  if (topCard) {
    const rotation = diffX / 20;
    topCard.style.transform = `translateX(${diffX}px) translateY(${diffY}px) rotate(${rotation}deg)`;
    topCard.style.transition = 'none';
    
    // Add color hints based on direction
    if (diffX > 50) {
      topCard.style.borderColor = '#06D6A0';
    } else if (diffX < -50) {
      topCard.style.borderColor = '#EF4444';
    } else {
      topCard.style.borderColor = 'transparent';
    }
  }
  
  // Prevent scrolling on touch devices
  if (e.type === 'touchmove') {
    e.preventDefault();
  }
}

function handleDragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  
  const diffX = currentX - startX;
  const topCard = document.querySelector('.top-card');
  
  if (Math.abs(diffX) > 100) {
    // Swipe threshold reached
    if (diffX > 0) {
      animateSwipeRight(topCard);
    } else {
      animateSwipeLeft(topCard);
    }
  } else {
    // Return to center
    if (topCard) {
      topCard.style.transform = '';
      topCard.style.transition = 'transform 0.3s ease';
      topCard.style.borderColor = 'transparent';
    }
  }
  
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
}

function animateSwipeRight(card) {
  if (!card) return;
  card.classList.add('swiping-right');
  setTimeout(() => {
    handleTaskCompletion();
  }, 500);
}

function animateSwipeLeft(card) {
  if (!card) return;
  card.classList.add('swiping-left');
  setTimeout(() => {
    nextTask();
  }, 500);
}

// ===================================
// TASK ACTIONS
// ===================================

function completeTask() {
  const topCard = document.querySelector('.top-card');
  if (topCard) {
    animateSwipeRight(topCard);
  }
}

function skipTask() {
  const topCard = document.querySelector('.top-card');
  if (topCard) {
    animateSwipeLeft(topCard);
  }
}

function handleTaskCompletion() {
  const task = tasks[currentTaskIndex];
  
  // Update stats
  userCompletedTasks++;
  globalCompletedTasks++;
  
  const duration = parseInt(task.duration);
  const impact = parseInt(task.impact.replace('+', ''));
  totalTimeSpent += duration;
  totalImpactPoints += impact;
  
  // Update header stats
  const userCompletedEl = document.getElementById('userTasksCompleted');
  if (userCompletedEl) {
    userCompletedEl.textContent = userCompletedTasks;
  }
  
  const globalEl = document.getElementById('globalTasksCompleted');
  if (globalEl) {
    globalEl.textContent = globalCompletedTasks.toLocaleString();
  }
  
  // Show toast
  showSuccessToast();
  
  // Create confetti
  createConfetti();
  
  // Broadcast to other tabs
  channel.postMessage({
    type: 'taskCompleted',
    taskId: task.id,
    completedCount: userCompletedTasks
  });
  
  // Move to next
  nextTask();
}

function nextTask() {
  currentTaskIndex++;
  
  updateAvailableTasks();
  
  if (currentTaskIndex >= tasks.length) {
    showCompletionModal();
  } else {
    updateProgress();
    renderCardStack();
  }
}

// ===================================
// UI UPDATES
// ===================================

function updateProgress() {
  const current = currentTaskIndex + 1;
  const total = tasks.length;
  const percentage = (currentTaskIndex / total) * 100;
  
  const currentEl = document.getElementById('currentTask');
  const totalEl = document.getElementById('totalTasks');
  const progressBar = document.getElementById('progressBar');
  
  if (currentEl) currentEl.textContent = current;
  if (totalEl) totalEl.textContent = total;
  if (progressBar) progressBar.style.width = `${percentage}%`;
}

function showSuccessToast() {
  const toast = document.getElementById('successToast');
  if (!toast) return;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showCompletionModal() {
  const modal = document.getElementById('completionModal');
  if (!modal) return;
  
  document.getElementById('completedCount').textContent = userCompletedTasks;
  document.getElementById('impactPoints').textContent = `+${totalImpactPoints}`;
  document.getElementById('timeSpent').textContent = `${totalTimeSpent} min`;
  
  modal.classList.add('show');
}

function closeCompletionModal() {
  const modal = document.getElementById('completionModal');
  if (modal) {
    modal.classList.remove('show');
  }
  
  exitSwipeMode();
}

function resetAndContinue() {
  currentTaskIndex = 0;
  userCompletedTasks = 0;
  totalTimeSpent = 0;
  totalImpactPoints = 0;
  
  closeCompletionModal();
  
  setTimeout(() => {
    showSwipeMode();
  }, 300);
}

// ===================================
// CONFETTI EFFECT
// ===================================

function createConfetti() {
  const colors = ['#FF6B35', '#004E89', '#F7B801', '#06D6A0'];
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = '50%';
    particle.style.top = '40%';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 4 + Math.random() * 4;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 2;
    
    animateParticle(particle, vx, vy);
  }
}

function animateParticle(particle, vx, vy) {
  let x = 0;
  let y = 0;
  let opacity = 1;
  const gravity = 0.3;
  
  function update() {
    x += vx;
    y += vy;
    vy += gravity;
    opacity -= 0.015;
    
    particle.style.transform = `translate(${x}px, ${y}px)`;
    particle.style.opacity = opacity;
    
    if (opacity > 0) {
      requestAnimationFrame(update);
    } else {
      particle.remove();
    }
  }
  
  update();
}

// ===================================
// FAVORITES SYSTEM
// ===================================

function toggleFavorites() {
  favorites++;
  const favCountEl = document.getElementById('favCount');
  if (favCountEl) {
    favCountEl.textContent = favorites;
  }
  
  // Add animation
  const btn = document.querySelector('.favorites');
  if (btn) {
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 200);
  }
}

// ===================================
// REAL-TIME SYNC
// ===================================

function setupRealTimeSync() {
  channel.onmessage = (event) => {
    const { type, taskId } = event.data;
    
    if (type === 'taskCompleted') {
      // Update global counter
      globalCompletedTasks++;
      const globalEl = document.getElementById('globalTasksCompleted');
      if (globalEl) {
        globalEl.textContent = globalCompletedTasks.toLocaleString();
      }
      
      console.log(`✓ Task ${taskId} completed by another volunteer!`);
    }
  };
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', (e) => {
  const swipeMode = document.getElementById('swipeMode');
  if (!swipeMode || swipeMode.style.display !== 'block') return;
  
  // Left arrow - skip
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    skipTask();
  }
  
  // Right arrow or Enter - complete
  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    e.preventDefault();
    completeTask();
  }
  
  // Escape - exit swipe mode
  if (e.key === 'Escape') {
    e.preventDefault();
    exitSwipeMode();
  }
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const style = document.createElement('style');
  style.textContent = `
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
}

// ===================================
// CONSOLE EASTER EGG
// ===================================

console.log('%c🤝 MicroVolunteer Hub', 'font-size: 28px; font-weight: bold; color: #FF6B35; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
console.log('%cTinder for Helping People - Making a difference, 5-15 minutes at a time!', 'font-size: 14px; color: #004E89; font-weight: 600;');
console.log('%c\n💡 Keyboard shortcuts:', 'font-size: 13px; font-weight: bold; color: #F7B801;');
console.log('%c  ← Skip task', 'font-size: 12px; color: #666;');
console.log('%c  → or Enter - Complete task', 'font-size: 12px; color: #666;');
console.log('%c  Esc - Exit swipe mode', 'font-size: 12px; color: #666;');
console.log('%c\n🔥 Open in multiple tabs to see real-time sync!', 'font-size: 12px; color: #06D6A0; font-weight: 600;');

// ===================================
// EXPORT FOR TESTING
// ===================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    completeTask,
    skipTask,
    renderCardStack,
    updateProgress
  };
}

// ===================================
// REPORT ISSUE FUNCTIONALITY
// ===================================

let reportModalStartTime = null;
let reportTimerInterval = null;

function openReportIssueModal() {
  const modal = document.getElementById('reportIssueModal');
  if (!modal) return;
  
  // Reset form
  document.getElementById('reportForm').reset();
  updateCharCount('issueTitle', 'titleCharCount');
  updateCharCount('issueDescription', 'descCharCount');
  
  // Start timer
  reportModalStartTime = Date.now();
  startReportTimer();
  
  // Show modal
  modal.classList.add('show');
  
  // Focus first input
  setTimeout(() => {
    document.getElementById('issueTitle')?.focus();
  }, 300);
}

function closeReportIssueModal() {
  const modal = document.getElementById('reportIssueModal');
  if (!modal) return;
  
  // Stop timer
  stopReportTimer();
  
  // Hide modal
  modal.classList.remove('show');
}

function startReportTimer() {
  const timerEl = document.getElementById('sessionTimer');
  if (!timerEl) return;
  
  reportTimerInterval = setInterval(() => {
    const elapsed = Date.now() - reportModalStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    timerEl.textContent = formattedTime;
  }, 100);
}

function stopReportTimer() {
  if (reportTimerInterval) {
    clearInterval(reportTimerInterval);
    reportTimerInterval = null;
  }
}

function submitReport(event) {
  event.preventDefault();
  
  const title = document.getElementById('issueTitle').value;
  const description = document.getElementById('issueDescription').value;
  const sessionTime = document.getElementById('sessionTimer').textContent;
  
  // Log report (in production, this would send to server)
  console.log('%c📝 Report Submitted', 'font-size: 16px; font-weight: bold; color: #F7B801;');
  console.log('Title:', title);
  console.log('Description:', description);
  console.log('Session Time:', sessionTime);
  console.log('Timestamp:', new Date().toISOString());
  
  // Close modal
  closeReportIssueModal();
  
  // Show success toast
  showReportSuccessToast();
  
  // Create confetti
  createConfetti();
}

function showReportSuccessToast() {
  const toast = document.getElementById('reportSuccessToast');
  if (!toast) return;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Character count functionality
function updateCharCount(inputId, counterId) {
  const input = document.getElementById(inputId);
  const counter = document.getElementById(counterId);
  
  if (!input || !counter) return;
  
  counter.textContent = input.value.length;
}

// Setup character counters
document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('issueTitle');
  const descInput = document.getElementById('issueDescription');
  
  if (titleInput) {
    titleInput.addEventListener('input', () => {
      updateCharCount('issueTitle', 'titleCharCount');
    });
  }
  
  if (descInput) {
    descInput.addEventListener('input', () => {
      updateCharCount('issueDescription', 'descCharCount');
    });
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const reportModal = document.getElementById('reportIssueModal');
    if (reportModal && reportModal.classList.contains('show')) {
      closeReportIssueModal();
    }
  }
});

// Close modal on backdrop click
document.getElementById('reportIssueModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'reportIssueModal') {
    closeReportIssueModal();
  }
});
