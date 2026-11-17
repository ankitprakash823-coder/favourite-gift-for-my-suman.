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
      { type: "love-scrapbook-page-navigation", url: pageUrl },
      window.location.protocol === "file:" ? "*" : window.location.origin,
    );
  });
} else {
  let pageFrame = null;
  let pageFrameNavigationTimer = 0;

  function showPageInPersistentFrame(pageUrl) {
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
    pageFrame.classList.add("is-transitioning");
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
    showPageInPersistentFrame(pageUrl);
  });

  window.addEventListener("message", (event) => {
    if (!pageFrame || event.source !== pageFrame.contentWindow) return;
    if (window.location.protocol !== "file:" && event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== "love-scrapbook-page-navigation" || typeof event.data.url !== "string") return;
    const destination = document.createElement("a");
    destination.href = event.data.url;
    const pageUrl = getLocalPageLink(destination);
    if (pageUrl) showPageInPersistentFrame(pageUrl);
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
};
const customization = {};
const validShapes = {
  mediaShape: ["square", "rounded", "circle"],
  stickerShape: ["original", "rounded", "circle"],
  noteShape: ["square", "rounded"],
};

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
  } catch (error) {
    console.error("Could not save customization settings.", error);
    customizeStatus.textContent = "Could not save settings. Check browser storage.";
  }
}

function applyCustomization() {
  const hasCustomization = Object.keys(customization).some((key) => key !== "previousTheme");
  document.body.classList.toggle("love-customizing", hasCustomization);
  document.body.classList.toggle("love-media-sized", customization.mediaScale !== undefined);
  document.body.classList.toggle("love-sticker-sized", customization.stickerScale !== undefined);
  document.body.classList.toggle("love-sticker-shaped", customization.stickerShape !== undefined && customization.stickerShape !== "original");
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
      customizePanel.querySelector(`[data-scale-output="${key}"]`).textContent = `${control.value}%`;
    }
  });
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
  Object.keys(customization).forEach((key) => delete customization[key]);
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
  });
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeLoveFeatures, { once: true });
} else {
  initializeLoveFeatures();
}

