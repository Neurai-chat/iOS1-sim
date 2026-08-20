function updateTime() {
  const now = new Date();
  const timeEl = document.getElementById('time');
  const lockTimeEl = document.getElementById('lock-time');
  const lockDateEl = document.getElementById('lock-date');

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const displayHours = ((hours + 11) % 12 + 1); // 12h

  timeEl.textContent = `${displayHours}:${minutes}`;
  lockTimeEl.textContent = `${displayHours}:${minutes}`;

  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  lockDateEl.textContent = now.toLocaleDateString(undefined, options);
}

setInterval(updateTime, 1000);
updateTime();

const lockscreen = document.getElementById('lockscreen');
const homescreen = document.getElementById('homescreen');
const appscreen = document.getElementById('appscreen');
const slideKnob = document.getElementById('slide-knob');
const homeButton = document.getElementById('home-button');
const appTitle = document.getElementById('app-title');
const appBody = document.getElementById('app-body');
const appBack = document.getElementById('app-back');

let sliding = false;
let startX = 0;
let knobX = 0;

slideKnob.addEventListener('mousedown', startSlide);
slideKnob.addEventListener('touchstart', startSlide);

function startSlide(e) {
  e.preventDefault();
  sliding = true;
  startX = getX(e);
  knobX = 2;
  document.addEventListener('mousemove', moveSlide);
  document.addEventListener('touchmove', moveSlide);
  document.addEventListener('mouseup', endSlide);
  document.addEventListener('touchend', endSlide);
}

function getX(e) {
  if (e.touches && e.touches[0]) return e.touches[0].clientX;
  return e.clientX;
}

function moveSlide(e) {
  if (!sliding) return;
  const dx = getX(e) - startX;
  const max = document.querySelector('.slide-container').offsetWidth - 40;
  let newX = knobX + dx;
  if (newX < 2) newX = 2;
  if (newX > max) newX = max;
  slideKnob.style.left = newX + 'px';
}

function endSlide() {
  sliding = false;
  document.removeEventListener('mousemove', moveSlide);
  document.removeEventListener('touchmove', moveSlide);
  document.removeEventListener('mouseup', endSlide);
  document.removeEventListener('touchend', endSlide);

  const container = document.querySelector('.slide-container');
  const max = container.offsetWidth - 40;
  const current = parseInt(slideKnob.style.left || '2', 10);

  if (current > max - 10) {
    // unlock
    lockscreen.classList.add('hidden');
    homescreen.classList.remove('hidden');
    slideKnob.style.left = '2px';
  } else {
    slideKnob.style.left = '2px';
  }
}

// Home button behavior
homeButton.addEventListener('click', () => {
  appscreen.classList.add('hidden');
  homescreen.classList.remove('hidden');
});

// Open apps
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const app = icon.dataset.app;
    openApp(app);
  });
});

function openApp(app) {
  homescreen.classList.add('hidden');
  appscreen.classList.remove('hidden');

  if (app === 'phone') {
    appTitle.textContent = 'Phone';
    appBody.innerHTML = `
      <p>Favorites</p>
      <p>Recents</p>
      <p>Contacts</p>
      <p>Keypad</p>
      <p>Voicemail</p>
    `;
  } else if (app === 'mail') {
    appTitle.textContent = 'Mail';
    appBody.innerHTML = `
      <p>Inbox (1)</p>
      <p>BalAir Ticket Confirmation</p>
    `;
  } else if (app === 'safari') {
    appTitle.textContent = 'Safari';
    appBody.innerHTML = `
      <p>Bookmarks</p>
      <p>Neurai-chat.github.io</p>
      <p>Apple.com</p>
    `;
  } else if (app === 'ipod') {
    appTitle.textContent = 'iPod';
    appBody.innerHTML = `
      <p>Playlists</p>
      <p>Artists</p>
      <p>Songs</p>
      <p>Now Playing</p>
    `;
  } else {
    appTitle.textContent = 'App';
    appBody.textContent = 'Coming soon.';
  }
}

appBack.addEventListener('click', () => {
  appscreen.classList.add('hidden');
  homescreen.classList.remove('hidden');
});

