// Replace this with a direct URL to your audio file when you are ready.
function initializeLoveFeatures() {
const LOVE_SONG_URL = "";
const isEmbeddedPage = window.self !== window.top;

function startCinematicIntro() {
  const messages = [
    "Hello Suman ❤️",
    "I love you so much, meri Suman ❤️",
    "Let's start your project, Suman!",
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const intro = document.createElement("div");
  intro.className = "love-cinematic-intro";
  intro.setAttribute("role", "status");
  intro.setAttribute("aria-live", "polite");
  intro.innerHTML = `
    <div class="love-intro-stars" aria-hidden="true"></div>
    <p class="love-intro-message">${message}</p>
    <span class="love-intro-trail" aria-hidden="true">${message}</span>
    <div class="love-intro-road" aria-hidden="true"></div>
    <svg class="love-intro-car" viewBox="0 0 220 100" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="love-car-paint" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#f8e6bd"/><stop offset=".52" stop-color="#c99d59"/><stop offset="1" stop-color="#80603b"/>
        </linearGradient>
        <linearGradient id="love-car-window" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#edf0e8"/><stop offset="1" stop-color="#a9b5a2"/>
        </linearGradient>
      </defs>
      <ellipse cx="113" cy="82" rx="91" ry="10" fill="#17191c" opacity=".35"/>
      <path d="M22 65 34 52 49 48 69 25 Q76 17 89 17h42q14 0 22 10l22 24 19 6q8 3 8 12v8H22z" fill="url(#love-car-paint)" stroke="#f8e6bd" stroke-width="2"/>
      <path d="m75 29-16 20h42V25H87q-8 0-12 4m34-4v24h43l-18-20q-4-4-12-4z" fill="url(#love-car-window)" stroke="#71583d" stroke-width="2"/>
      <path d="M20 59h18m148 1h16" stroke="#fff1d2" stroke-width="6" stroke-linecap="round"/>
      <path d="M25 67h164" stroke="#8b6543" stroke-width="3"/>
      <circle cx="65" cy="75" r="15" fill="#292827"/><circle cx="65" cy="75" r="7" fill="#d8c49c"/>
      <circle cx="160" cy="75" r="15" fill="#292827"/><circle cx="160" cy="75" r="7" fill="#d8c49c"/>
      <path d="m183 54 18 5v8h-18" fill="#fff1c8" opacity=".9"/>
      <path d="M31 55 15 60v8h11" fill="#c56a65"/>
      <path d="M93 57c-7-8-18 2 0 14 18-12 7-22 0-14z" fill="#fff1d2"/>
    </svg>
    <span class="love-intro-caption">a little story, made with love</span>
    <button class="love-intro-skip" type="button">Skip intro</button>
  `;
  document.body.classList.add("love-intro-pending");
  document.body.append(intro);

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    document.body.classList.add("love-intro-revealing");
    document.body.classList.remove("love-intro-pending");
    intro.classList.add("love-intro-finished");
    window.setTimeout(() => {
      intro.remove();
      document.body.classList.remove("love-intro-revealing");
    }, 750);
  };
  intro.querySelector(".love-intro-skip").addEventListener("click", finish);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(finish, reducedMotion ? 1400 : 4700);
}

if (!isEmbeddedPage) startCinematicIntro();

const movablePositionsKey = "scrapbook-mobile-control-positions-v1";
const mobileControls = window.matchMedia("(max-width: 680px)");
function enableMobileMove(element, handle, key) {
  if (!element || !handle) return;
  let savedPositions = {};
  try {
    savedPositions = JSON.parse(localStorage.getItem(movablePositionsKey) || "{}");
    if (!savedPositions || typeof savedPositions !== "object" || Array.isArray(savedPositions)) savedPositions = {};
  } catch (error) {
    console.error("Could not read saved mobile control positions.", error);
  }
  const saved = savedPositions[`${window.location.pathname}:${key}`];
  if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top) && mobileControls.matches) {
    const left = Math.min(Math.max(0, window.innerWidth - element.offsetWidth), Math.max(0, saved.left));
    const top = Math.min(Math.max(0, window.innerHeight - element.offsetHeight), Math.max(0, saved.top));
    element.style.position = "fixed";
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.transform = "none";
    element.style.zIndex = "300";
  }

  let movement = null;
  let suppressClick = false;
  handle.addEventListener("pointerdown", (event) => {
    if (!mobileControls.matches || (event.button !== undefined && event.button !== 0)) return;
    if (event.target instanceof Element && event.target.closest("input, textarea, select")) return;
    const bounds = element.getBoundingClientRect();
    movement = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: bounds.left, top: bounds.top, moved: false };
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener("pointermove", (event) => {
    if (!movement || movement.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - movement.startX;
    const deltaY = event.clientY - movement.startY;
    if (!movement.moved && Math.hypot(deltaX, deltaY) < 5) return;
    movement.moved = true;
    event.preventDefault();
    const left = Math.min(Math.max(0, window.innerWidth - element.offsetWidth), Math.max(0, movement.left + deltaX));
    const top = Math.min(Math.max(0, window.innerHeight - element.offsetHeight), Math.max(0, movement.top + deltaY));
    element.style.position = "fixed";
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.transform = "none";
    element.style.zIndex = "300";
  });
  const stopMoving = (event) => {
    if (!movement || movement.pointerId !== event.pointerId) return;
    if (movement.moved) {
      const bounds = element.getBoundingClientRect();
      try {
        const currentPositions = JSON.parse(localStorage.getItem(movablePositionsKey) || "{}");
        if (!currentPositions || typeof currentPositions !== "object" || Array.isArray(currentPositions)) {
          throw new Error("Saved mobile control positions must be an object.");
        }
        currentPositions[`${window.location.pathname}:${key}`] = { left: bounds.left, top: bounds.top };
        localStorage.setItem(movablePositionsKey, JSON.stringify(currentPositions));
      } catch (error) {
        console.error("Could not save mobile control position.", error);
      }
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 250);
    }
    movement = null;
  };
  handle.addEventListener("pointerup", stopMoving);
  handle.addEventListener("pointercancel", stopMoving);
  handle.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }, true);
}

const startDate = new Date(2025, 8, 13);
const now = new Date();
const calendarDays = (date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
const daysTogether = Math.max(0, Math.floor((calendarDays(now) - calendarDays(startDate)) / 86400000));

const dayCounter = document.createElement("aside");
dayCounter.className = "love-day-counter";
dayCounter.hidden = isEmbeddedPage;
dayCounter.setAttribute("aria-label", `${daysTogether} days together since September 13, 2025`);
dayCounter.innerHTML = `<strong>${daysTogether}</strong><span>days together</span>`;
document.body.append(dayCounter);

const musicPlayer = document.createElement("section");
musicPlayer.className = "love-music-player";
musicPlayer.setAttribute("aria-label", "Music player");
musicPlayer.hidden = isEmbeddedPage || mobileControls.matches;
musicPlayer.innerHTML = `
  <button type="button" class="love-music-close" aria-label="Close music controls" title="Close">×</button>
  <button type="button" class="love-music-previous" aria-label="Previous track" title="Previous track">⏮</button>
  <button type="button" class="love-music-play" aria-label="Play music" title="Play music">▶</button>
  <button type="button" class="love-music-pause" aria-label="Pause music" title="Pause music" disabled>Ⅱ</button>
  <button type="button" class="love-music-next" aria-label="Next track" title="Next track">⏭</button>
  <button type="button" class="love-music-add" aria-label="Add music tracks" title="Add music tracks">＋</button>
  <span class="love-music-drag-handle" role="button" tabindex="0" aria-label="Move music player" title="Drag to move music player">♫</span>
  <input id="love-volume" type="range" min="0" max="1" step="0.05" value="0.7" aria-label="Music volume">
  <span class="love-music-status" role="status" aria-live="polite" hidden></span>
`;
document.body.append(musicPlayer);

const musicToggle = document.createElement("button");
musicToggle.className = "love-music-toggle";
musicToggle.type = "button";
musicToggle.textContent = "♫";
musicToggle.setAttribute("aria-label", "Open music controls");
musicToggle.setAttribute("aria-expanded", "false");
musicToggle.hidden = isEmbeddedPage || !mobileControls.matches;
document.body.append(musicToggle);

const musicDragHandle = musicPlayer.querySelector(".love-music-drag-handle");
enableMobileMove(musicPlayer, musicDragHandle, "music-player");
musicDragHandle.addEventListener("keydown", (event) => {
  const offsets = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
  const offset = offsets[event.key];
  if (!offset) return;
  event.preventDefault();
  const bounds = musicPlayer.getBoundingClientRect();
  const maxLeft = Math.max(0, window.innerWidth - bounds.width);
  const maxTop = Math.max(0, window.innerHeight - bounds.height);
  const left = Math.min(maxLeft, Math.max(0, bounds.left + offset[0]));
  const top = Math.min(maxTop, Math.max(0, bounds.top + offset[1]));
  musicPlayer.style.left = `${left}px`;
  musicPlayer.style.top = `${top}px`;
  musicPlayer.style.right = "auto";
  musicPlayer.style.bottom = "auto";
});
musicToggle.addEventListener("click", () => {
  musicPlayer.hidden = !musicPlayer.hidden;
  musicToggle.setAttribute("aria-expanded", String(!musicPlayer.hidden));
});
musicPlayer.querySelector(".love-music-close").addEventListener("click", () => {
  musicPlayer.hidden = true;
  musicToggle.setAttribute("aria-expanded", "false");
});
mobileControls.addEventListener("change", (event) => {
  if (isEmbeddedPage) return;
  musicToggle.hidden = !event.matches;
  if (event.matches) musicPlayer.hidden = true;
  else musicPlayer.hidden = false;
  musicToggle.setAttribute("aria-expanded", "false");
});

const musicFilePicker = document.createElement("input");
musicFilePicker.className = "love-music-file-picker";
musicFilePicker.type = "file";
musicFilePicker.accept = "audio/*";
musicFilePicker.multiple = true;
musicFilePicker.setAttribute("aria-label", "Choose music files");
document.body.append(musicFilePicker);

const music = new Audio();
music.preload = "none";
music.volume = 0.7;
const tracks = LOVE_SONG_URL.trim()
  ? [{ name: "Configured music", url: LOVE_SONG_URL.trim(), owned: false }]
  : [];
let currentTrackIndex = -1;
let playbackRequestId = 0;
const unavailableTracks = new Set();
const playButton = musicPlayer.querySelector(".love-music-play");
const pauseButton = musicPlayer.querySelector(".love-music-pause");
const previousButton = musicPlayer.querySelector(".love-music-previous");
const nextButton = musicPlayer.querySelector(".love-music-next");
const addButton = musicPlayer.querySelector(".love-music-add");
const musicStatus = musicPlayer.querySelector(".love-music-status");
const showMusicStatus = (message) => {
  musicStatus.textContent = message;
  musicStatus.hidden = false;
  window.clearTimeout(showMusicStatus.timeoutId);
  showMusicStatus.timeoutId = window.setTimeout(() => { musicStatus.hidden = true; }, 4000);
};

function requestMusicFiles() {
  showMusicStatus("Choose one or more audio files to start your music.");
  musicFilePicker.click();
}

function updateMusicControls() {
  playButton.disabled = !music.paused;
  pauseButton.disabled = music.paused;
}

async function playTrack(index) {
  if (!tracks.length) {
    requestMusicFiles();
    return;
  }
  if (unavailableTracks.size === tracks.length) {
    showMusicStatus("No playable tracks remain. Choose new audio files.");
    return;
  }

  const requestId = ++playbackRequestId;
  let trackIndex = ((index % tracks.length) + tracks.length) % tracks.length;

  for (let attempt = 0; attempt < tracks.length; attempt += 1) {
    if (requestId !== playbackRequestId) return;
    if (unavailableTracks.has(tracks[trackIndex].url)) {
      trackIndex = (trackIndex + 1) % tracks.length;
      continue;
    }

    const track = tracks[trackIndex];
    currentTrackIndex = trackIndex;
    music.pause();
    music.src = track.url;
    music.load();
    try {
      await music.play();
      if (requestId !== playbackRequestId) return;
      musicPlayer.title = `Now playing: ${track.name}`;
      showMusicStatus(`Now playing: ${track.name}`);
      return;
    } catch (error) {
      if (requestId !== playbackRequestId) return;
      if (unavailableTracks.has(track.url)) return;
      console.error(`Could not play music track "${track.name}".`, error);
      unavailableTracks.add(track.url);
      if (unavailableTracks.size === tracks.length) {
        updateMusicControls();
        showMusicStatus(`Could not play "${track.name}". Choose a playable audio file.`);
        return;
      }
      showMusicStatus(`Could not play "${track.name}". Trying the next track.`);
      trackIndex = (trackIndex + 1) % tracks.length;
    }
  }
}

async function resumeMusic() {
  if (currentTrackIndex < 0 || unavailableTracks.size === tracks.length) {
    requestMusicFiles();
    return;
  }
  if (music.ended) {
    await playTrack(currentTrackIndex);
    return;
  }
  try {
    await music.play();
  } catch (error) {
    console.error("Could not resume the current music track.", error);
    showMusicStatus("Music could not be resumed. Choose another audio file.");
  }
}

playButton.addEventListener("click", resumeMusic);
pauseButton.addEventListener("click", () => music.pause());
nextButton.addEventListener("click", () => {
  if (!tracks.length) {
    requestMusicFiles();
    return;
  }
  void playTrack(currentTrackIndex < 0 ? 0 : currentTrackIndex + 1);
});
previousButton.addEventListener("click", () => {
  if (!tracks.length) {
    requestMusicFiles();
    return;
  }
  if (currentTrackIndex >= 0 && music.currentTime > 3) {
    music.currentTime = 0;
    void resumeMusic();
    return;
  }
  void playTrack(currentTrackIndex < 0 ? tracks.length - 1 : currentTrackIndex - 1);
});
addButton.addEventListener("click", requestMusicFiles);

musicFilePicker.addEventListener("change", () => {
  const selectedFiles = Array.from(musicFilePicker.files || []);
  musicFilePicker.value = "";
  if (!selectedFiles.length) return;

  const firstAddedTrackIndex = tracks.length;
  const shouldStartAddedTrack = music.paused;
  selectedFiles.forEach((file) => {
    tracks.push({ name: file.name, url: URL.createObjectURL(file), owned: true });
  });
  if (shouldStartAddedTrack || currentTrackIndex < 0) {
    void playTrack(firstAddedTrackIndex);
  } else {
    showMusicStatus(`${selectedFiles.length} track${selectedFiles.length === 1 ? "" : "s"} added to the playlist.`);
  }
});

music.addEventListener("play", updateMusicControls);
music.addEventListener("pause", updateMusicControls);
music.addEventListener("ended", () => {
  if (currentTrackIndex >= 0) void playTrack((currentTrackIndex + 1) % tracks.length);
});
music.addEventListener("error", () => {
  const failedTrack = tracks[currentTrackIndex];
  if (!failedTrack || unavailableTracks.has(failedTrack.url)) return;
  console.error(`Could not load music track "${failedTrack.name}".`, music.error);
  unavailableTracks.add(failedTrack.url);
  if (unavailableTracks.size === tracks.length) {
    updateMusicControls();
    showMusicStatus(`Could not load "${failedTrack.name}". Choose a playable audio file.`);
    return;
  }
  showMusicStatus(`Could not load "${failedTrack.name}". Trying the next track.`);
  void playTrack((currentTrackIndex + 1) % tracks.length);
});
musicPlayer.querySelector("#love-volume").addEventListener("input", (event) => {
  music.volume = Number(event.currentTarget.value);
});
window.addEventListener("beforeunload", () => {
  tracks.forEach((track) => {
    if (track.owned) URL.revokeObjectURL(track.url);
  });
});

const letterBackdrop = document.createElement("div");
letterBackdrop.className = "love-letter-backdrop";
letterBackdrop.hidden = true;
letterBackdrop.innerHTML = `
  <section class="love-letter" role="dialog" aria-modal="true" aria-labelledby="love-letter-title">
    <button class="love-letter-close" type="button" aria-label="Close secret letter">×</button>
    <div class="love-letter-icon" aria-hidden="true">♡</div>
    <h2 id="love-letter-title">A little secret for you</h2>
    <p>My dearest Suman,</p>
    <p>Every ordinary day feels a little brighter because I get to share this story with you. Thank you for the laughter, the little moments, and all the love you bring into my life.</p>
    <p>No matter how many pages we turn, my favorite part will always be the ones we create together.</p>
    <p class="love-letter-sign">Always yours, with all my heart ♡</p>
  </section>
`;
document.body.append(letterBackdrop);

const closeLetterButton = letterBackdrop.querySelector(".love-letter-close");
const closeLetter = () => { letterBackdrop.hidden = true; };
closeLetterButton.addEventListener("click", closeLetter);
letterBackdrop.addEventListener("click", (event) => {
  if (event.target === letterBackdrop) closeLetter();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !letterBackdrop.hidden) closeLetter();
});

const confettiCanvas = document.createElement("canvas");
confettiCanvas.className = "love-confetti";
confettiCanvas.setAttribute("aria-hidden", "true");
confettiCanvas.hidden = true;
document.body.append(confettiCanvas);

function celebrate() {
  const context = confettiCanvas.getContext("2d");
  if (!context) {
    console.error("Confetti animation is unavailable because canvas could not be initialized.");
    letterBackdrop.hidden = false;
    closeLetterButton.focus();
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  confettiCanvas.width = width * pixelRatio;
  confettiCanvas.height = height * pixelRatio;
  confettiCanvas.style.width = `${width}px`;
  confettiCanvas.style.height = `${height}px`;
  context.scale(pixelRatio, pixelRatio);

  const colors = ["#d7ad58", "#f0d998", "#d98585", "#91a784", "#c5a1c8", "#fff4d5"];
  const pieces = Array.from({ length: 125 }, () => ({
    x: Math.random() * width,
    y: -Math.random() * height * 0.7,
    speed: 2 + Math.random() * 4,
    drift: (Math.random() - 0.5) * 2.2,
    size: 4 + Math.random() * 6,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.15,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startedAt = performance.now();
  confettiCanvas.hidden = false;

  function draw(time) {
    context.clearRect(0, 0, width, height);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += piece.spin;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.65);
      context.restore();
    });

    if (!reducedMotion && time - startedAt < 2600) {
      window.requestAnimationFrame(draw);
    } else {
      context.clearRect(0, 0, width, height);
      confettiCanvas.hidden = true;
    }
  }

  window.requestAnimationFrame(draw);
  letterBackdrop.hidden = false;
  closeLetterButton.focus();
}

let previousBackgroundClick = null;
let doubleClickCount = 0;
let eggOpened = false;

document.addEventListener("click", (event) => {
  const isBackground = event.target instanceof Element && event.target.classList.contains("desk");
  if (!isBackground || eggOpened || !letterBackdrop.hidden) {
    previousBackgroundClick = null;
    doubleClickCount = 0;
    return;
  }

  const currentClick = { time: Date.now(), x: event.clientX, y: event.clientY };
  if (
    previousBackgroundClick
    && currentClick.time - previousBackgroundClick.time <= 500
    && Math.hypot(currentClick.x - previousBackgroundClick.x, currentClick.y - previousBackgroundClick.y) <= 32
  ) {
    doubleClickCount += 1;
    previousBackgroundClick = null;
    if (doubleClickCount === 3) {
      eggOpened = true;
      celebrate();
    }
    return;
  }

  previousBackgroundClick = currentClick;
  window.setTimeout(() => {
    if (previousBackgroundClick === currentClick) previousBackgroundClick = null;
  }, 520);
});

const siteDirectory = new URL(".", window.location.href).pathname;
function getLocalPageLink(anchor) {
  if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return null;
  const destination = new URL(anchor.href, window.location.href);
  if (
    destination.protocol !== window.location.protocol
    || destination.origin !== window.location.origin
    || !destination.pathname.startsWith(siteDirectory)
    || !/\.html$/i.test(destination.pathname)
  ) return null;
  return destination.href;
}

function isUnmodifiedNavigationClick(event) {
  return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

if (isEmbeddedPage) {
  document.addEventListener("click", (event) => {
    if (!isUnmodifiedNavigationClick(event) || !(event.target instanceof Element)) return;
    const anchor = event.target.closest("a[href]");
    if (!anchor) return;
    const pageUrl = getLocalPageLink(anchor);
    if (!pageUrl) return;
    event.preventDefault();
    window.parent.postMessage(
      { type: "love-scrapbook-page-navigation", url: pageUrl, direction: anchor.classList.contains("previous") ? "previous" : "next" },
      window.location.protocol === "file:" ? "*" : window.location.origin,
    );
  });
} else {
  let pageFrame = null;
  let pageFrameNavigationTimer = 0;

  function showPageInPersistentFrame(pageUrl, direction = "next") {
    if (!pageFrame) {
      pageFrame = document.createElement("iframe");
      pageFrame.className = "love-page-frame";
      pageFrame.title = "Scrapbook page";
      pageFrame.addEventListener("load", () => {
        window.setTimeout(() => pageFrame.classList.remove("is-transitioning"), 40);
      });
      document.body.append(pageFrame);
    }
    customizeToggle.hidden = true;
    exportToggle.hidden = true;
    closeCustomization();
    closeExportPanel();
    pageFrame.classList.remove("turn-next", "turn-previous");
    pageFrame.classList.add(direction === "previous" ? "turn-previous" : "turn-next", "is-transitioning");
    window.clearTimeout(pageFrameNavigationTimer);
    pageFrameNavigationTimer = window.setTimeout(() => { pageFrame.src = pageUrl; }, 120);
  }

  document.addEventListener("click", (event) => {
    if (pageFrame || !isUnmodifiedNavigationClick(event) || !(event.target instanceof Element)) return;
    const anchor = event.target.closest("a[href]");
    if (!anchor) return;
    const pageUrl = getLocalPageLink(anchor);
    if (!pageUrl) return;
    event.preventDefault();
    showPageInPersistentFrame(pageUrl, anchor.classList.contains("previous") ? "previous" : "next");
  });

  window.addEventListener("message", (event) => {
    if (!pageFrame || event.source !== pageFrame.contentWindow) return;
    if (window.location.protocol !== "file:" && event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== "love-scrapbook-page-navigation" || typeof event.data.url !== "string") return;
    const destination = document.createElement("a");
    destination.href = event.data.url;
    const pageUrl = getLocalPageLink(destination);
    if (pageUrl) showPageInPersistentFrame(pageUrl, event.data.direction === "previous" ? "previous" : "next");
  });
}

let swipeStart = null;
document.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 1 || !(event.target instanceof Element)) {
    swipeStart = null;
    return;
  }
  if (event.target.closest("a, button, input, textarea, select, video, audio, [contenteditable='true'], .item, .love-music-player, .love-customize-panel")) {
    swipeStart = null;
    return;
  }
  const touch = event.touches[0];
  swipeStart = { x: touch.clientX, y: touch.clientY };
}, { passive: true });

document.addEventListener("touchend", (event) => {
  if (!swipeStart || event.changedTouches.length !== 1) {
    swipeStart = null;
    return;
  }
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - swipeStart.x;
  const deltaY = touch.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(deltaX) < 65 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;
  const direction = deltaX < 0 ? "next" : "previous";
  const pageLink = document.querySelector(`.page-nav.${direction}[href]`);
  if (pageLink) pageLink.click();
}, { passive: true });

const CUSTOMIZATION_KEY = "scrapbook-customization-v1";
const CUSTOM_BACKGROUND_ASSET_KEY = "scrapbook-custom-background-v1";
const scrapbookBackgroundDesigns = [
  { id: "strawberry", label: "Strawberry 🍓", color: "#f8e4e6", marks: ["🍓", "♡", "🍓"] },
  { id: "teddy-bears", label: "Teddy Bears 🧸", color: "#f1e4d7", marks: ["🧸", "♡", "🧸"] },
  { id: "hearts", label: "Hearts ❤️", color: "#f8e2e8", marks: ["❤️", "♡", "❤️"] },
  { id: "flowers", label: "Flowers 🌸", color: "#f5e6f0", marks: ["🌸", "✿", "🌸"] },
  { id: "butterflies", label: "Butterflies 🦋", color: "#e5e8f5", marks: ["🦋", "✧", "🦋"] },
  { id: "stars-clouds", label: "Stars & Clouds ⭐", color: "#e4edf7", marks: ["⭐", "☁️", "✨"] },
  { id: "cherries", label: "Cherries 🍒", color: "#f5e3e3", marks: ["🍒", "♡", "🍒"] },
  { id: "cute-bows", label: "Cute Bows 🎀", color: "#f8e4ed", marks: ["🎀", "♡", "🎀"] },
  { id: "pastel-checks", label: "Pastel Checks", color: "#f1ebf5", checks: "#d9c9e5" },
  { id: "cute-doodles", label: "Cute Doodles", color: "#f4eddf", marks: ["♡", "☁️", "✧"] },
  { id: "pink-gingham", label: "Pink Gingham", color: "#fff0f3", checks: "#e9c3cf" },
  { id: "daisies", label: "Daisies 🌼", color: "#f4f0dc", marks: ["🌼", "✿", "🌼"] },
  { id: "rainbows", label: "Rainbows 🌈", color: "#f5e9e9", marks: ["🌈", "☁️", "🌈"] },
  { id: "cute-cats", label: "Cute Cats 🐱", color: "#eee7f2", marks: ["🐱", "♡", "🐾"] },
  { id: "puppies", label: "Puppies 🐶", color: "#f2e8dc", marks: ["🐶", "♡", "🐾"] },
  { id: "cupcakes", label: "Cupcakes 🧁", color: "#f6e8e7", marks: ["🧁", "♡", "🧁"] },
  { id: "lemons", label: "Lemons 🍋", color: "#f3f0d7", marks: ["🍋", "✿", "🍋"] },
  { id: "mushrooms", label: "Mushrooms 🍄", color: "#e9ecdf", marks: ["🍄", "✿", "🍄"] },
  { id: "pearls", label: "Pearl Aesthetic", color: "#eeeaf0", marks: ["🤍", "🫧", "🤍"] },
  { id: "postage-stamps", label: "Vintage Postage Stamps", color: "#e8dfce", marks: ["✉️", "♡", "✉️"] },
];
const additionalScrapbookBackgroundDesigns = [
  { id: "pearl-aesthetic-new", label: "Pearl Aesthetic", color: "#f3eef0", marks: ["◦", "🤍", "✧"], patternType: "pearls" },
  { id: "vintage-postage-stamps-new", label: "Vintage Postage Stamps", color: "#eee5d5", marks: ["✉", "♡", "✉"], patternType: "stamps" },
  { id: "cute-minimal-doodles", label: "Cute Minimal Doodles", color: "#f7f1e9", marks: ["♡", "✧", "☁"] },
  { id: "pink-gingham-new", label: "Pink Gingham", color: "#fff1f2", checks: "#e7bdc8" },
  { id: "beige-gingham", label: "Beige Gingham", color: "#f4eddf", checks: "#dfd1b9" },
  { id: "vintage-newspaper", label: "Vintage Newspaper", color: "#eee7d8", patternType: "newspaper" },
  { id: "pressed-flowers", label: "Pressed Flowers", color: "#f3eddf", marks: ["🌼", "🌿", "🌸"] },
  { id: "soft-watercolor-floral", label: "Soft Watercolor Floral", color: "#f8eef0", marks: ["🌷", "🌸", "🌿"] },
  { id: "vintage-love-letters", label: "Vintage Love Letters", color: "#f2e8d8", marks: ["✉", "♡", "❀"] },
  { id: "french-toile-pattern", label: "French Toile Pattern", color: "#f5f0e5", patternType: "toile" },
  { id: "cream-lace-aesthetic", label: "Cream Lace Aesthetic", color: "#f5f0e3", patternType: "lace" },
  { id: "vintage-paper-texture", label: "Vintage Paper Texture", color: "#e9dfcc", patternType: "paper-texture" },
  { id: "polaroid-collage", label: "Polaroid Collage", color: "#ece4dc", patternType: "polaroid" },
  { id: "dusty-rose-aesthetic", label: "Dusty Rose Aesthetic", color: "#ead7d7", marks: ["✿", "♡", "✧"] },
  { id: "sage-green-botanical", label: "Sage Green Botanical", color: "#e4e9dc", marks: ["🌿", "🍃", "✿"] },
  { id: "vintage-book-pages", label: "Vintage Book Pages", color: "#eee5d1", patternType: "book-pages" },
  { id: "soft-pastel-gradient", label: "Soft Pastel Gradient", color: "#eee7f5", patternType: "gradient", backgroundSize: "cover" },
  { id: "blue-porcelain-pattern", label: "Blue Porcelain Pattern", color: "#f0f3f5", patternType: "porcelain" },
  { id: "celestial-moon-stars", label: "Celestial Moon & Stars", color: "#e7e4f0", marks: ["☾", "✧", "✦"] },
  { id: "romantic-vintage-scrapbook", label: "Romantic Vintage Scrapbook", color: "#eadbd2", patternType: "romantic-scrapbook" },
];
const customizationDefaults = {
  accent: "#58715b",
  deskColor: "#e8dfce",
  paperColor: "#f7f1e4",
  canvasColor: "#f7f1e4",
  noteColor: "#f9e89e",
  mediaColor: "#fffdf6",
  mediaScale: 100,
  stickerScale: 100,
  mediaShape: "square",
  stickerShape: "original",
  noteShape: "square",
  paperDesign: "original",
  backgroundDesign: "original",
  backgroundZoom: 120,
  backgroundX: 50,
  backgroundY: 50,
  backgroundImageKey: "",
};
const customization = {};
const validShapes = {
  mediaShape: ["square", "rounded", "circle"],
  stickerShape: ["original", "rounded", "circle"],
  noteShape: ["square", "rounded"],
};
const validPaperDesigns = ["original", "linen", "rose-garden", "lavender-letter", "sage-press", "blue-hour", "vintage-postcard", "cherry-blossom", "midnight-romance", "golden-hour", "botanical"];
const allScrapbookBackgroundDesigns = [...scrapbookBackgroundDesigns, ...additionalScrapbookBackgroundDesigns];
const validBackgroundDesigns = ["original", ...allScrapbookBackgroundDesigns.map((design) => design.id), "custom"];

function isValidColor(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

try {
  const savedCustomization = JSON.parse(localStorage.getItem(CUSTOMIZATION_KEY) || "{}");
  if (savedCustomization && typeof savedCustomization === "object" && !Array.isArray(savedCustomization)) {
    Object.keys(customizationDefaults).forEach((key) => {
      const value = savedCustomization[key];
      if (key.endsWith("Color") || key === "accent") {
        if (isValidColor(value)) customization[key] = value;
      } else if (key.endsWith("Scale")) {
        if (Number.isInteger(value) && value >= 60 && value <= 160) customization[key] = value;
      } else if (key === "paperDesign" && validPaperDesigns.includes(value)) {
        customization[key] = value;
      } else if (key === "backgroundDesign" && validBackgroundDesigns.includes(value)) {
        customization[key] = value;
      } else if (key === "backgroundZoom" && Number.isInteger(value) && value >= 100 && value <= 200) {
        customization[key] = value;
      } else if ((key === "backgroundX" || key === "backgroundY") && Number.isInteger(value) && value >= 0 && value <= 100) {
        customization[key] = value;
      } else if (key === "backgroundImageKey" && value === CUSTOM_BACKGROUND_ASSET_KEY) {
        customization[key] = value;
      } else if (validShapes[key]?.includes(value)) {
        customization[key] = value;
      }
    });
    if (isValidColor(savedCustomization.previousTheme)) customization.previousTheme = savedCustomization.previousTheme;
  }
} catch (error) {
  console.error("Could not read saved customization settings.", error);
}

const customizeToggle = document.createElement("button");
customizeToggle.className = "love-customize-toggle";
customizeToggle.type = "button";
customizeToggle.setAttribute("aria-expanded", "false");
customizeToggle.setAttribute("aria-controls", "love-customize-panel");
customizeToggle.setAttribute("aria-label", "Open website customization");
customizeToggle.textContent = "Customize";

const customizePanel = document.createElement("section");
customizePanel.className = "love-customize-panel";
customizePanel.id = "love-customize-panel";
customizePanel.setAttribute("aria-label", "Website customization");
customizePanel.hidden = true;
function renderBackgroundChoices(designs, isNewDesigns) {
  return designs.map((design) => `
    <button class="love-background-choice" type="button" data-background-choice="${design.id}" aria-pressed="false" aria-label="${design.label}${isNewDesigns ? ", new design" : ""}">
      <span class="love-background-thumbnail" data-background-thumbnail="${design.id}" aria-hidden="true"></span>
      <span class="love-background-choice-label">${design.label}</span>
    </button>
  `).join("");
}
customizePanel.innerHTML = `
  <div class="love-customize-heading">
    <h2>Make it yours</h2>
    <button class="love-customize-close" type="button" aria-label="Close customization">×</button>
  </div>
  <p class="love-customize-help">Your choices are saved on this device and used on every scrapbook page.</p>
  <div class="love-customize-group">
    <h3>Page colors</h3>
    <label class="love-customize-field"><span>Accent</span><input type="color" data-custom-setting="accent" aria-label="Accent color"></label>
    <label class="love-customize-field"><span>Page background</span><input type="color" data-custom-setting="deskColor" aria-label="Page background color"></label>
    <label class="love-customize-field"><span>Paper</span><input type="color" data-custom-setting="paperColor" aria-label="Paper color"></label>
    <label class="love-customize-field"><span>Photo/video area</span><input type="color" data-custom-setting="canvasColor" aria-label="Photo and video page area color"></label>
    <label class="love-customize-field"><span>Notes and cards</span><input type="color" data-custom-setting="noteColor" aria-label="Notes and cards color"></label>
    <label class="love-customize-field"><span>Photo/video frames</span><input type="color" data-custom-setting="mediaColor" aria-label="Photo and video frame color"></label>
  </div>
  <div class="love-customize-group">
    <h3>Paper designs</h3>
    <label class="love-customize-field"><span>Choose a look</span><select data-custom-setting="paperDesign" aria-label="Paper design">
      <option value="original">Original scrapbook</option>
      <option value="linen">Soft linen</option>
      <option value="rose-garden">Rose garden</option>
      <option value="lavender-letter">Lavender letter</option>
      <option value="sage-press">Sage press</option>
      <option value="blue-hour">Blue hour</option>
      <option value="vintage-postcard">Vintage postcard</option>
      <option value="cherry-blossom">Cherry blossom</option>
      <option value="midnight-romance">Midnight romance</option>
      <option value="golden-hour">Golden hour</option>
      <option value="botanical">Botanical</option>
    </select></label>
  </div>
  <div class="love-customize-group">
    <h3>Backgrounds behind your paper</h3>
    <select data-custom-setting="backgroundDesign" aria-label="Scrapbook background design" hidden>
      <option value="original">Original background</option>
      ${allScrapbookBackgroundDesigns.map((design) => `<option value="${design.id}">${design.label}</option>`).join("")}
      <option value="custom">Custom image from my device</option>
    </select>
    <div class="love-background-design-section">
      <h4>Original background</h4>
      <div class="love-background-grid">
        <button class="love-background-choice" type="button" data-background-choice="original" aria-pressed="false" aria-label="Original background">
          <span class="love-background-thumbnail love-background-thumbnail-original" aria-hidden="true"></span>
          <span class="love-background-choice-label">Original background</span>
        </button>
      </div>
    </div>
    <div class="love-background-design-section">
      <h4>Existing 20 designs</h4>
      <div class="love-background-grid">${renderBackgroundChoices(scrapbookBackgroundDesigns, false)}</div>
    </div>
    <div class="love-background-design-section">
      <h4>New 20 designs</h4>
      <div class="love-background-grid">${renderBackgroundChoices(additionalScrapbookBackgroundDesigns, true)}</div>
    </div>
    <div class="love-background-design-section">
      <h4>Custom background</h4>
      <div class="love-background-grid">
        <button class="love-background-choice" type="button" data-background-choice="custom" aria-pressed="false" aria-label="Custom Background. Choose an image from your device">
          <span class="love-background-thumbnail love-background-thumbnail-custom" data-custom-background-thumbnail aria-hidden="true">＋</span>
          <span class="love-background-choice-label">Custom Background</span>
        </button>
      </div>
    </div>
    <div class="love-custom-background-settings" hidden>
      <div class="love-background-upload">
        <span>Upload a JPG, PNG, or WebP image</span>
        <button type="button" data-background-upload-trigger>Choose image…</button>
        <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" data-background-upload aria-label="Upload a custom scrapbook background">
      </div>
      <div class="love-custom-background-preview" data-background-preview hidden><img alt="Preview of your custom scrapbook background"></div>
      <div class="love-customize-range">
        <label for="love-background-zoom">Zoom</label>
        <output for="love-background-zoom" data-scale-output="backgroundZoom">120%</output>
        <input id="love-background-zoom" type="range" min="100" max="200" step="5" data-custom-setting="backgroundZoom" aria-label="Custom background zoom">
      </div>
      <div class="love-customize-range">
        <label for="love-background-x">Horizontal position</label>
        <output for="love-background-x" data-scale-output="backgroundX">50%</output>
        <input id="love-background-x" type="range" min="0" max="100" step="1" data-custom-setting="backgroundX" aria-label="Custom background horizontal position">
      </div>
      <div class="love-customize-range">
        <label for="love-background-y">Vertical position</label>
        <output for="love-background-y" data-scale-output="backgroundY">50%</output>
        <input id="love-background-y" type="range" min="0" max="100" step="1" data-custom-setting="backgroundY" aria-label="Custom background vertical position">
      </div>
    </div>
  </div>
  <div class="love-customize-group">
    <h3>Size and shape</h3>
    <div class="love-customize-range">
      <label for="love-media-scale">Photos and videos</label>
      <output for="love-media-scale" data-scale-output="mediaScale">100%</output>
      <input id="love-media-scale" type="range" min="60" max="160" step="5" data-custom-setting="mediaScale" aria-label="Photo and video size">
    </div>
    <div class="love-customize-range">
      <label for="love-sticker-scale">Stickers</label>
      <output for="love-sticker-scale" data-scale-output="stickerScale">100%</output>
      <input id="love-sticker-scale" type="range" min="60" max="160" step="5" data-custom-setting="stickerScale" aria-label="Sticker size">
    </div>
    <label class="love-customize-field"><span>Photo/video shape</span><select data-custom-setting="mediaShape" aria-label="Photo and video shape"><option value="square">Square corners</option><option value="rounded">Rounded</option><option value="circle">Circle</option></select></label>
    <label class="love-customize-field"><span>Sticker shape</span><select data-custom-setting="stickerShape" aria-label="Sticker shape"><option value="original">Original</option><option value="rounded">Rounded</option><option value="circle">Circle</option></select></label>
    <label class="love-customize-field"><span>Note shape</span><select data-custom-setting="noteShape" aria-label="Note shape"><option value="square">Square corners</option><option value="rounded">Rounded</option></select></label>
  </div>
  <div class="love-customize-actions"><button type="button" data-custom-reset>Reset to original</button></div>
  <p class="love-customize-status" role="status" aria-live="polite"></p>
`;
document.body.append(customizeToggle, customizePanel);

const customizeStatus = customizePanel.querySelector(".love-customize-status");
const backgroundSettings = customizePanel.querySelector(".love-custom-background-settings");
const backgroundPreview = customizePanel.querySelector("[data-background-preview]");
const backgroundPreviewImage = backgroundPreview.querySelector("img");
let customBackgroundUrl = null;
const themePicker = document.querySelector('.theme-control input[type="color"]');
const customizationCssKeys = {
  deskColor: "--custom-desk-color",
  paperColor: "--custom-paper-color",
  canvasColor: "--custom-canvas-color",
  noteColor: "--custom-note-color",
  mediaColor: "--custom-media-color",
  mediaScale: "--custom-media-scale",
  stickerScale: "--custom-sticker-scale",
  mediaShape: "--custom-media-radius",
  stickerShape: "--custom-sticker-radius",
  noteShape: "--custom-note-radius",
};
const shapeValues = {
  square: "0",
  rounded: "16px",
  circle: "50%",
  original: "0",
};

function updateThemePicker(color) {
  if (themePicker) {
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    valueSetter.call(themePicker, color);
    if (!document.querySelector("#root")) {
      themePicker.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
  window.dispatchEvent(new CustomEvent("love-scrapbook-accent-change", { detail: { color } }));
}

function persistCustomization() {
  try {
    localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(customization));
    customizeStatus.textContent = "Saved on this device";
    return true;
  } catch (error) {
    console.error("Could not save customization settings.", error);
    customizeStatus.textContent = "Could not save settings. Check browser storage.";
    return false;
  }
}

function makeBackgroundPattern(design) {
  if (design.checks) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><rect width="72" height="72" fill="${design.color}"/><path fill="${design.checks}" opacity=".45" d="M0 0h36v36H0zm36 36h36v36H36z"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  if (design.patternType === "gradient") {
    return "linear-gradient(135deg, #f8e4eb 0%, #eee7f5 52%, #e1eef1 100%)";
  }
  const decorativePatterns = {
    pearls: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="112" viewBox="0 0 128 112"><rect width="128" height="112" fill="#f3eef0"/><g fill="#fffdfd" stroke="#d8cbd3" stroke-width="2"><circle cx="22" cy="24" r="8"/><circle cx="62" cy="18" r="6"/><circle cx="102" cy="39" r="9"/><circle cx="37" cy="76" r="9"/><circle cx="83" cy="87" r="7"/></g><g fill="#fff" opacity=".8"><circle cx="19" cy="21" r="2"/><circle cx="99" cy="36" r="2"/></g></svg>`,
    stamps: `<svg xmlns="http://www.w3.org/2000/svg" width="156" height="126" viewBox="0 0 156 126"><rect width="156" height="126" fill="#eee5d5"/><g fill="#f7f0e2" stroke="#a78d70" stroke-width="1.5" stroke-dasharray="2 2"><rect x="13" y="15" width="48" height="38" rx="2"/><rect x="83" y="67" width="57" height="41" rx="2"/></g><g fill="none" stroke="#bc9f7d" stroke-width="1"><path d="M19 23h36M19 28h23M89 75h44M89 80h33M89 85h38"/></g><g fill="#b46f68" font-size="15" font-family="serif"><text x="29" y="47">♡</text><text x="106" y="102">✉</text></g></svg>`,
    newspaper: `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="128" viewBox="0 0 150 128"><rect width="150" height="128" fill="#eee7d8"/><text x="9" y="17" fill="#766b5b" font-size="8" font-family="serif" letter-spacing="1">THE DAILY LOVE</text><path stroke="#bdb09b" d="M8 22h134M8 25h134M8 48h134M8 51h134M8 74h134M8 77h134M8 101h134M8 104h134"/><path stroke="#a99b85" stroke-width="2" d="M9 31h38M55 31h29M92 31h48M9 57h22M38 57h47M91 57h48M9 83h47M62 83h30M98 83h42M9 110h34M49 110h48M104 110h36"/><text x="109" y="70" fill="#a88078" font-size="11" font-family="serif">♡</text></svg>`,
    toile: `<svg xmlns="http://www.w3.org/2000/svg" width="142" height="128" viewBox="0 0 142 128"><rect width="142" height="128" fill="#f5f0e5"/><g fill="none" stroke="#8797a0" stroke-width="1.4" opacity=".82"><path d="M14 128c20-17 11-35 30-49 14-10 24-7 32-27 6-16 20-20 39-23M60 75c-6-12-17-16-29-14m47-9c-1-12 5-23 14-32m-28 62c14 2 23 10 29 24m-15-51c13 3 22 1 32-8"/><path d="M34 59c3-9 12-10 14-2-2 8-11 10-14 2zm43-40c3-9 12-10 14-2-2 8-11 10-14 2zm29 67c3-9 12-10 14-2-2 8-11 10-14 2z"/></g><g fill="#a88486" opacity=".8"><circle cx="40" cy="58" r="2"/><circle cx="84" cy="19" r="2"/><circle cx="109" cy="84" r="2"/></g></svg>`,
    lace: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="#f5f0e3"/><g fill="none" stroke="#d8cbb8" stroke-width="1.4"><circle cx="24" cy="24" r="15"/><circle cx="72" cy="24" r="15"/><circle cx="24" cy="72" r="15"/><circle cx="72" cy="72" r="15"/><circle cx="48" cy="48" r="15"/><path d="M0 48h96M48 0v96M14 14l68 68M82 14 14 82"/></g><g fill="#fffaf1" stroke="#d8cbb8"><circle cx="48" cy="24" r="3"/><circle cx="24" cy="48" r="3"/><circle cx="72" cy="48" r="3"/><circle cx="48" cy="72" r="3"/></g></svg>`,
    "paper-texture": `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="112" viewBox="0 0 128 112"><rect width="128" height="112" fill="#e9dfcc"/><path d="M0 15h128M0 49h128M0 84h128" stroke="#bdae94" stroke-opacity=".35"/><g fill="#9e8b6d" opacity=".2"><circle cx="14" cy="31" r="1"/><circle cx="51" cy="20" r="1"/><circle cx="92" cy="38" r="1"/><circle cx="32" cy="69" r="1"/><circle cx="108" cy="92" r="1"/><circle cx="75" cy="101" r="1"/><circle cx="118" cy="12" r="1"/></g><path d="M7 7h114v98H7z" fill="none" stroke="#fff9ed" stroke-opacity=".6"/></svg>`,
    polaroid: `<svg xmlns="http://www.w3.org/2000/svg" width="156" height="128" viewBox="0 0 156 128"><rect width="156" height="128" fill="#ece4dc"/><g transform="rotate(-8 44 44)"><rect x="15" y="10" width="48" height="57" rx="2" fill="#fffdf8" stroke="#d6cdc1"/><rect x="21" y="16" width="36" height="34" fill="#e7d9d3"/><circle cx="37" cy="31" r="8" fill="#f0c7ca"/><path d="M22 48l10-10 9 8 7-6 9 10" fill="#b9c9b4"/></g><g transform="rotate(7 109 83)"><rect x="84" y="56" width="52" height="61" rx="2" fill="#fffdf8" stroke="#d6cdc1"/><rect x="90" y="62" width="40" height="37" fill="#d9e3df"/><path d="M91 93l13-16 9 11 7-8 10 13" fill="#aec1b3"/></g></svg>`,
    "book-pages": `<svg xmlns="http://www.w3.org/2000/svg" width="142" height="128" viewBox="0 0 142 128"><rect width="142" height="128" fill="#eee5d1"/><path d="M10 10h122v108H10z" fill="none" stroke="#c7b89d"/><path d="M18 22h106M18 28h106M18 34h94M18 52h106M18 58h100M18 64h106M18 82h95M18 88h106M18 94h100M18 112h106" stroke="#b4a58c" stroke-width=".8" opacity=".8"/><text x="55" y="47" fill="#8f806b" font-size="8" font-family="serif" font-style="italic">Our story</text></svg>`,
    porcelain: `<svg xmlns="http://www.w3.org/2000/svg" width="132" height="120" viewBox="0 0 132 120"><rect width="132" height="120" fill="#f0f3f5"/><g fill="none" stroke="#6b8fa8" stroke-width="1.7"><path d="M17 120c18-15 9-30 27-44 14-11 17-22 13-38m-13 38c-12-8-19-7-28-3m39-35c8-12 19-17 32-18m-43 56c15 1 24 7 32 19m19-57c9 5 20 5 34 0"/><path d="M37 74c-9-3-9-15 0-17 9 2 9 14 0 17zm16-39c-9-3-9-15 0-17 9 2 9 14 0 17zm42-15c-9-3-9-15 0-17 9 2 9 14 0 17z"/></g><g fill="#8eabc0"><circle cx="37" cy="66" r="2"/><circle cx="53" cy="28" r="2"/><circle cx="95" cy="8" r="2"/></g></svg>`,
    "romantic-scrapbook": `<svg xmlns="http://www.w3.org/2000/svg" width="156" height="128" viewBox="0 0 156 128"><rect width="156" height="128" fill="#eadbd2"/><rect x="12" y="25" width="56" height="45" rx="2" fill="#f7f0e5" stroke="#bba797" transform="rotate(-7 40 48)"/><rect x="88" y="54" width="54" height="48" rx="2" fill="#f5e8e4" stroke="#bba797" transform="rotate(6 115 78)"/><path d="M18 19l17 3-2 9-17-3zm86 24l19-2 1 9-19 2z" fill="#caa8a0" opacity=".7"/><text x="34" y="57" fill="#bb7677" font-size="20">♡</text><text x="105" y="88" fill="#8f9b83" font-size="19">✿</text></svg>`,
  };
  if (decorativePatterns[design.patternType]) {
    return `url("data:image/svg+xml,${encodeURIComponent(decorativePatterns[design.patternType])}")`;
  }
  const marks = design.marks.map((mark, index) => {
    const positions = [[20, 42], [86, 93], [116, 35]];
    const [x, y] = positions[index];
    return `<text x="${x}" y="${y}" font-size="27">${mark}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="128" viewBox="0 0 160 128"><g opacity=".43" font-family="Segoe UI Emoji,Apple Color Emoji,sans-serif">${marks}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

allScrapbookBackgroundDesigns.forEach((design) => {
  const thumbnail = customizePanel.querySelector(`[data-background-thumbnail="${design.id}"]`);
  thumbnail.style.backgroundColor = design.color;
  thumbnail.style.backgroundImage = makeBackgroundPattern(design);
  thumbnail.style.backgroundSize = design.backgroundSize || (design.checks ? "72px 72px" : "160px 128px");
});

function openCustomizationAssetStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("our-little-scrapbook", 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("assets")) request.result.createObjectStore("assets");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveCustomizationBackground(file) {
  const db = await openCustomizationAssetStore();
  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction("assets", "readwrite");
      transaction.objectStore("assets").put(file, CUSTOM_BACKGROUND_ASSET_KEY);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}

async function loadCustomizationBackground() {
  const db = await openCustomizationAssetStore();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction("assets").objectStore("assets").get(CUSTOM_BACKGROUND_ASSET_KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

async function deleteCustomizationBackground() {
  const db = await openCustomizationAssetStore();
  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction("assets", "readwrite");
      transaction.objectStore("assets").delete(CUSTOM_BACKGROUND_ASSET_KEY);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}

function showCustomBackground(fileOrBlob) {
  if (customBackgroundUrl) URL.revokeObjectURL(customBackgroundUrl);
  customBackgroundUrl = URL.createObjectURL(fileOrBlob);
  backgroundPreviewImage.src = customBackgroundUrl;
  backgroundPreview.hidden = false;
  document.documentElement.style.setProperty("--scrapbook-custom-background-image", `url("${customBackgroundUrl}")`);
  const customThumbnail = customizePanel.querySelector("[data-custom-background-thumbnail]");
  customThumbnail.style.backgroundImage = `url("${customBackgroundUrl}")`;
  customThumbnail.style.backgroundSize = "cover";
  customThumbnail.style.backgroundPosition = "center";
  customThumbnail.style.backgroundRepeat = "no-repeat";
  customThumbnail.textContent = "";
}

async function restoreCustomBackground() {
  if (customization.backgroundDesign !== "custom" || customization.backgroundImageKey !== CUSTOM_BACKGROUND_ASSET_KEY) return;
  try {
    const savedImage = await loadCustomizationBackground();
    if (!savedImage) throw new Error("The saved custom background image is missing.");
    showCustomBackground(savedImage);
  } catch (error) {
    console.error("Could not restore the custom scrapbook background.", error);
    customizeStatus.textContent = "Could not restore the saved background image.";
  }
}

function applyCustomization() {
  const hasCustomization = Object.keys(customization).some((key) => key !== "previousTheme");
  document.body.classList.toggle("love-customizing", hasCustomization);
  document.body.classList.toggle("love-media-sized", customization.mediaScale !== undefined);
  document.body.classList.toggle("love-sticker-sized", customization.stickerScale !== undefined);
  document.body.classList.toggle("love-sticker-shaped", customization.stickerShape !== undefined && customization.stickerShape !== "original");
  if (customization.paperDesign && customization.paperDesign !== "original") {
    document.body.dataset.paperDesign = customization.paperDesign;
  } else {
    delete document.body.dataset.paperDesign;
  }
  const backgroundDesign = customization.backgroundDesign || "original";
  if (backgroundDesign === "original") {
    delete document.body.dataset.backgroundDesign;
  } else {
    document.body.dataset.backgroundDesign = backgroundDesign;
  }
  const selectedBackground = allScrapbookBackgroundDesigns.find((design) => design.id === backgroundDesign);
  if (selectedBackground) {
    document.documentElement.style.setProperty("--scrapbook-background-color", selectedBackground.color);
    document.documentElement.style.setProperty("--scrapbook-background-image", makeBackgroundPattern(selectedBackground));
    document.documentElement.style.setProperty(
      "--scrapbook-background-size",
      selectedBackground.backgroundSize || (selectedBackground.checks ? "72px 72px" : "160px 128px"),
    );
  }
  document.documentElement.style.setProperty("--scrapbook-custom-background-size", `${customization.backgroundZoom ?? customizationDefaults.backgroundZoom}%`);
  document.documentElement.style.setProperty("--scrapbook-custom-background-position", `${customization.backgroundX ?? 50}% ${customization.backgroundY ?? 50}%`);
  if (backgroundDesign !== "custom") {
    document.documentElement.style.removeProperty("--scrapbook-custom-background-image");
  } else if (customBackgroundUrl) {
    document.documentElement.style.setProperty("--scrapbook-custom-background-image", `url("${customBackgroundUrl}")`);
  }
  Object.values(customizationCssKeys).forEach((cssKey) => {
    document.documentElement.style.removeProperty(cssKey);
  });
  Object.keys(customizationCssKeys).forEach((key) => {
    if (customization[key] === undefined) return;
    const value = key.endsWith("Scale")
      ? String(customization[key] / 100)
      : key.endsWith("Shape")
        ? shapeValues[customization[key]]
        : customization[key];
    document.documentElement.style.setProperty(customizationCssKeys[key], value);
  });
  if (customization.accent) {
    document.documentElement.style.setProperty("--theme-color", customization.accent);
    updateThemePicker(customization.accent);
    try {
      localStorage.setItem("scrapbook-theme", customization.accent);
    } catch (error) {
      console.error("Could not apply the saved accent color.", error);
      customizeStatus.textContent = "Could not apply the accent color.";
    }
  }
}

function syncCustomizationControls() {
  customizePanel.querySelectorAll("[data-custom-setting]").forEach((control) => {
    const key = control.dataset.customSetting;
    control.value = customization[key] ?? customizationDefaults[key];
    if (control.type === "range") {
      const output = customizePanel.querySelector(`[data-scale-output="${key}"]`);
      output.textContent = `${control.value}%`;
    }
  });
  const selectedBackground = customization.backgroundDesign ?? customizationDefaults.backgroundDesign;
  customizePanel.querySelectorAll("[data-background-choice]").forEach((choice) => {
    choice.setAttribute("aria-pressed", String(choice.dataset.backgroundChoice === selectedBackground));
  });
  backgroundSettings.hidden = selectedBackground !== "custom";
  backgroundPreview.hidden = !customBackgroundUrl;
  const customThumbnail = customizePanel.querySelector("[data-custom-background-thumbnail]");
  if (!customBackgroundUrl) {
    customThumbnail.style.removeProperty("background-image");
    customThumbnail.textContent = "＋";
  }
}

function closeCustomization() {
  customizePanel.hidden = true;
  customizeToggle.setAttribute("aria-expanded", "false");
}

customizeToggle.addEventListener("click", () => {
  customizePanel.hidden = !customizePanel.hidden;
  customizeToggle.setAttribute("aria-expanded", String(!customizePanel.hidden));
  if (!customizePanel.hidden) customizePanel.querySelector("input").focus();
});
customizePanel.querySelector(".love-customize-close").addEventListener("click", closeCustomization);
enableMobileMove(customizeToggle, customizeToggle, "customize-toggle");
enableMobileMove(musicToggle, musicToggle, "music-toggle");

const exportToggle = document.createElement("button");
exportToggle.className = "love-export-toggle";
exportToggle.type = "button";
exportToggle.setAttribute("aria-label", "Export this scrapbook page");
exportToggle.setAttribute("aria-expanded", "false");
exportToggle.setAttribute("aria-controls", "love-export-panel");
exportToggle.textContent = "Download";

const exportPanel = document.createElement("section");
exportPanel.className = "love-export-panel";
exportPanel.id = "love-export-panel";
exportPanel.hidden = true;
exportPanel.setAttribute("aria-label", "Download this scrapbook page");
exportPanel.innerHTML = `
  <div class="love-export-heading">
    <h2>Save this page</h2>
    <button class="love-export-close" type="button" aria-label="Close download options">×</button>
  </div>
  <p class="love-export-help">Choose a format. Repeat on each page to download your scrapbook separately.</p>
  <div class="love-export-actions">
    <button type="button" data-export-format="pdf">Print / Save as PDF</button>
    <button type="button" data-export-format="png">Download PNG</button>
    <button type="button" data-export-format="jpg">Download JPG</button>
  </div>
  <p class="love-export-status" role="status" aria-live="polite"></p>
`;
document.body.append(exportToggle, exportPanel);

const exportStatus = exportPanel.querySelector(".love-export-status");
function closeExportPanel() {
  exportPanel.hidden = true;
  exportToggle.setAttribute("aria-expanded", "false");
}

exportToggle.addEventListener("click", () => {
  exportPanel.hidden = !exportPanel.hidden;
  exportToggle.setAttribute("aria-expanded", String(!exportPanel.hidden));
});
exportPanel.querySelector(".love-export-close").addEventListener("click", closeExportPanel);
enableMobileMove(exportToggle, exportToggle, "export-toggle");

function getExportStyles() {
  const styles = [];
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      Array.from(sheet.cssRules).forEach((rule) => {
        if (/url\(\s*["']?https?:\/\//i.test(rule.cssText)) return;
        styles.push(rule.cssText);
      });
    } catch (error) {
      if (sheet.href && new URL(sheet.href, window.location.href).origin !== window.location.origin) return;
      console.error("Could not read a page stylesheet for image export.", error);
      throw new Error("A page stylesheet could not be prepared for image export.");
    }
  });
  return styles.join("\n");
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Could not read an image for export."));
    reader.readAsDataURL(file);
  });
}

async function inlineExportImages(sourceBody, clonedBody) {
  const sourceImages = Array.from(sourceBody.querySelectorAll("img"));
  const clonedImages = Array.from(clonedBody.querySelectorAll("img"));
  for (let index = 0; index < sourceImages.length; index += 1) {
    const source = sourceImages[index].currentSrc || sourceImages[index].src;
    if (!source || source.startsWith("data:")) continue;
    let response;
    try {
      response = await fetch(source);
    } catch (error) {
      console.error("Could not fetch an image for export.", error);
      throw new Error(`Could not prepare image "${sourceImages[index].alt || "scrapbook photo"}" for export.`);
    }
    if (!response.ok) throw new Error(`Could not prepare image "${sourceImages[index].alt || "scrapbook photo"}" for export.`);
    clonedImages[index].src = await fileToDataUrl(await response.blob());
  }

  const sourceVideos = Array.from(sourceBody.querySelectorAll("video"));
  const clonedVideos = Array.from(clonedBody.querySelectorAll("video"));
  sourceVideos.forEach((video, index) => {
    const frame = document.createElement("canvas");
    frame.width = Math.max(1, video.videoWidth || 320);
    frame.height = Math.max(1, video.videoHeight || 180);
    const context = frame.getContext("2d");
    if (!context) throw new Error("Could not prepare a video frame for export.");
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth && video.videoHeight) {
      try {
        context.drawImage(video, 0, 0, frame.width, frame.height);
      } catch (error) {
        console.error("Could not capture a video frame for export.", error);
        throw new Error("A video frame could not be prepared for export.");
      }
    } else {
      context.fillStyle = "#292820";
      context.fillRect(0, 0, frame.width, frame.height);
    }
    const image = document.createElement("img");
    image.src = frame.toDataURL("image/png");
    image.alt = video.getAttribute("aria-label") || "Scrapbook video";
    clonedVideos[index].replaceWith(image);
  });
}

function getExportFilename(extension) {
  const pageName = (document.title || "scrapbook-page")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "scrapbook-page";
  return `${pageName}.${extension}`;
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function downloadPageImage(format) {
  exportStatus.textContent = `Preparing ${format.toUpperCase()}…`;
  const width = Math.max(320, document.documentElement.clientWidth, window.innerWidth);
  const height = Math.max(window.innerHeight, document.documentElement.scrollHeight, document.body.scrollHeight);
  const clonedBody = document.body.cloneNode(true);
  clonedBody.classList.remove("love-intro-pending", "love-intro-revealing");
  clonedBody.querySelectorAll([
    ".love-cinematic-intro", ".love-day-counter", ".love-music-player", ".love-music-toggle",
    ".love-customize-toggle", ".love-customize-panel", ".love-export-toggle", ".love-export-panel",
    ".love-page-frame", ".save-button", ".save-status", ".page-nav", ".theme-control",
    ".selection-tools", ".tool-button", ".page-tools .add-note", ".game-actions",
    ".love-letter-backdrop", ".love-confetti", ".modal-backdrop",
    ".note-dialog-backdrop", ".note-editor-backdrop", ".file-input",
  ].join(",")).forEach((element) => element.remove());
  clonedBody.querySelectorAll("script, input, .media-actions, .item-actions").forEach((element) => element.remove());
  await inlineExportImages(document.body, clonedBody);

  const styleText = getExportStyles().replace(/<\/style/gi, "<\\/style");
  const rootStyle = document.documentElement.style.cssText.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const bodyClass = clonedBody.className.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const bodyStyle = clonedBody.style.cssText.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const contentMarkup = Array.from(clonedBody.childNodes)
    .map((node) => new XMLSerializer().serializeToString(node))
    .join("");
  const markup = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject width="100%" height="100%">
        <html xmlns="http://www.w3.org/1999/xhtml" style="${rootStyle}">
          <head><meta charset="UTF-8"/><style>${styleText}</style></head>
          <body class="${bodyClass}" style="${bodyStyle}">${contentMarkup}</body>
        </html>
      </foreignObject>
    </svg>`;
  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error("Could not render this page as an image. Try the PDF option instead."));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  });
  const scale = Math.min(2.5, 2600 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image export is not available in this browser.");
  if (format === "jpg") {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, format === "png" ? "image/png" : "image/jpeg", .92));
  if (!blob) throw new Error("The browser could not create the image file. Try the PDF option instead.");
  saveBlob(blob, getExportFilename(format));
  exportStatus.textContent = `${format.toUpperCase()} download started.`;
}

exportPanel.querySelectorAll("[data-export-format]").forEach((button) => {
  button.addEventListener("click", async () => {
    const format = button.dataset.exportFormat;
    if (format === "pdf") {
      closeExportPanel();
      exportStatus.textContent = "Choose “Save as PDF” in the print dialog.";
      window.setTimeout(() => window.print(), 100);
      return;
    }
    try {
      await downloadPageImage(format);
    } catch (error) {
      console.error(`Could not export the page as ${format.toUpperCase()}.`, error);
      exportStatus.textContent = error instanceof Error ? error.message : "The image could not be exported.";
    }
  });
});

const movableControlSelector = ".save-button, .theme-control, .tool-button, .page-nav, .selection-tools, .page-tools .add-note";
const movableControlElements = new WeakSet();
function setupMovableControls(container) {
  const controls = [];
  if (container instanceof Element && container.matches(movableControlSelector)) controls.push(container);
  if (container.querySelectorAll) controls.push(...container.querySelectorAll(movableControlSelector));
  controls.forEach((control) => {
    if (movableControlElements.has(control)) return;
    movableControlElements.add(control);
    if (control.classList.contains("save-button")) control.setAttribute("aria-label", "Save this page");
    if (control.id === "add-note" && !control.hasAttribute("aria-label")) control.setAttribute("aria-label", "Add a note");
    const identity = control.classList.contains("selection-tools")
      ? "selection-tools"
      : control.getAttribute("aria-label") || control.id || control.className;
    const handle = control.classList.contains("selection-tools")
      ? control.querySelector("span") || control
      : control;
    enableMobileMove(control, handle, `page-control-${identity}`);
  });
}
setupMovableControls(document);
const movableControlObserver = new MutationObserver((records) => {
  records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node instanceof Element) setupMovableControls(node);
  }));
});
movableControlObserver.observe(document.body, { childList: true, subtree: true });
customizePanel.querySelector("[data-custom-reset]").addEventListener("click", () => {
  const previousTheme = customization.previousTheme || localStorage.getItem("scrapbook-theme") || "#58715b";
  const removeSavedBackground = customization.backgroundImageKey === CUSTOM_BACKGROUND_ASSET_KEY;
  Object.keys(customization).forEach((key) => delete customization[key]);
  if (customBackgroundUrl) URL.revokeObjectURL(customBackgroundUrl);
  customBackgroundUrl = null;
  backgroundPreviewImage.removeAttribute("src");
  backgroundPreview.hidden = true;
  document.documentElement.style.removeProperty("--scrapbook-custom-background-image");
  applyCustomization();
  document.documentElement.style.setProperty("--theme-color", previousTheme);
  updateThemePicker(previousTheme);
  try {
    localStorage.setItem("scrapbook-theme", previousTheme);
    localStorage.removeItem(CUSTOMIZATION_KEY);
  } catch (error) {
    console.error("Could not reset customization settings.", error);
    customizeStatus.textContent = "Could not reset settings. Check browser storage.";
    return;
  }
  syncCustomizationControls();
  customizeStatus.textContent = "Original appearance restored";
  if (removeSavedBackground) {
    deleteCustomizationBackground().catch((error) => {
      console.error("Could not remove the saved custom background.", error);
      customizeStatus.textContent = "Appearance reset, but the saved background image could not be removed.";
    });
  }
});
customizePanel.querySelectorAll("[data-custom-setting]").forEach((control) => {
  control.addEventListener("input", () => {
    const key = control.dataset.customSetting;
    if (key === "accent" && !customization.previousTheme) {
      customization.previousTheme = localStorage.getItem("scrapbook-theme") || "#58715b";
    }
    customization[key] = control.type === "range" ? Number(control.value) : control.value;
    if (control.type === "range") {
      customizePanel.querySelector(`[data-scale-output="${key}"]`).textContent = `${control.value}%`;
    }
    applyCustomization();
    persistCustomization();
    if (key === "backgroundDesign") syncCustomizationControls();
  });
});
const backgroundDesignControl = customizePanel.querySelector('[data-custom-setting="backgroundDesign"]');
const backgroundUploadInput = customizePanel.querySelector("[data-background-upload]");
customizePanel.querySelectorAll("[data-background-choice]").forEach((choice) => {
  choice.addEventListener("click", () => {
    backgroundDesignControl.value = choice.dataset.backgroundChoice;
    backgroundDesignControl.dispatchEvent(new Event("input", { bubbles: true }));
    if (choice.dataset.backgroundChoice === "custom") backgroundUploadInput.click();
  });
});
customizePanel.querySelector("[data-background-upload-trigger]").addEventListener("click", () => {
  backgroundUploadInput.click();
});
backgroundUploadInput.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  event.currentTarget.value = "";
  if (!file) return;
  const fileType = file.type.toLowerCase();
  const supportedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const supportedExtension = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!supportedTypes.includes(fileType) && !(fileType === "" && supportedExtension)) {
    customizeStatus.textContent = "Choose a JPG, PNG, or WebP background image.";
    return;
  }
  customization.backgroundImageKey = CUSTOM_BACKGROUND_ASSET_KEY;
  customization.backgroundDesign = "custom";
  showCustomBackground(file);
  applyCustomization();
  syncCustomizationControls();
  try {
    await saveCustomizationBackground(file);
    if (persistCustomization()) customizeStatus.textContent = "Custom background saved on this device";
  } catch (error) {
    console.error("Could not save the custom scrapbook background.", error);
    customizeStatus.textContent = "Could not save the background image. Check browser storage.";
  }
});
if (themePicker) {
  themePicker.addEventListener("input", () => {
    if (!customization.accent) return;
    customization.accent = themePicker.value;
    persistCustomization();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !customizePanel.hidden) closeCustomization();
  if (event.key === "Escape" && !exportPanel.hidden) closeExportPanel();
});
syncCustomizationControls();
applyCustomization();
void restoreCustomBackground();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeLoveFeatures, { once: true });
} else {
  initializeLoveFeatures();
}
