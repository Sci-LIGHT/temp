/* ==========================================
   LOADING SCREEN
========================================== */

window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");

  const loadingBar = document.getElementById("loading-bar");

  const loadingText = document.getElementById("loading-text");

  const website = document.getElementById("website");

  let progress = 0;

  const loading = setInterval(() => {
    progress += 2;

    loadingBar.style.width = `${progress}%`;

    loadingText.textContent = `Loading... ${progress}%`;

    if (progress >= 100) {
      clearInterval(loading);

      setTimeout(() => {
        loadingScreen.classList.add("hidden");

        website.classList.add("loaded");
      }, 250);
    }
  }, 20);
});

/* ==========================================
   PAGE NAVIGATION
========================================== */

const pages = document.querySelectorAll(".website-page");

const navigationButtons = document.querySelectorAll("[data-navigate]");

function navigateTo(pageName) {
  const targetPage = document.getElementById(`page-${pageName}`);

  if (!targetPage) {
    return;
  }

  /* Hide every page */

  pages.forEach((page) => {
    page.classList.remove("active");
  });

  /* Show selected page */

  targetPage.classList.add("active");

  /* Update navigation */

  document.querySelectorAll("#navigation button").forEach((button) => {
    button.classList.toggle("active", button.dataset.navigate === pageName);
  });

  /* Start at the top */

  window.scrollTo(0, 0);

  /* Close mobile menu */

  document.getElementById("navigation").classList.remove("open");

  /*
        This gives each view its own URL.

        Examples:

        index.html
        index.html#mental-health
        index.html#freedom-wall
        index.html#stress-relief
        index.html#study-stress
        index.html#calm-zone
        index.html#help-support
    */

  history.pushState(null, "", `#${pageName}`);
}

/* ==========================================
   NAVIGATION CLICK EVENTS
========================================== */

navigationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navigateTo(button.dataset.navigate);
  });
});

/* ==========================================
   HANDLE BROWSER BACK/FORWARD
========================================== */

function loadPageFromURL() {
  const pageName = window.location.hash.replace("#", "");

  if (pageName) {
    const targetPage = document.getElementById(`page-${pageName}`);

    if (targetPage) {
      pages.forEach((page) => {
        page.classList.remove("active");
      });

      targetPage.classList.add("active");

      document.querySelectorAll("#navigation button").forEach((button) => {
        button.classList.toggle("active", button.dataset.navigate === pageName);
      });

      return;
    }
  }

  navigateToWithoutHistory("home");
}

function navigateToWithoutHistory(pageName) {
  const targetPage = document.getElementById(`page-${pageName}`);

  if (!targetPage) {
    return;
  }

  pages.forEach((page) => {
    page.classList.remove("active");
  });

  targetPage.classList.add("active");

  document.querySelectorAll("#navigation button").forEach((button) => {
    button.classList.toggle("active", button.dataset.navigate === pageName);
  });
}

window.addEventListener("popstate", loadPageFromURL);

window.addEventListener("DOMContentLoaded", loadPageFromURL);

/* ==========================================
   MOBILE MENU
========================================== */

const menuButton = document.getElementById("menu-button");

const navigation = document.getElementById("navigation");

menuButton.addEventListener("click", () => {
  navigation.classList.toggle("open");
});



/* ==========================================
   BASIC HTML ESCAPING
========================================== */

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* ==========================================
   POMODORO TIMER
========================================== */

const pomodoroModesBar = document.getElementById("pomodoro-modes");

const pomodoroTimeDisplay = document.getElementById("pomodoro-time");

const pomodoroSessionLabel = document.getElementById("pomodoro-session-label");

const pomodoroStartButton = document.getElementById("pomodoro-start");

const pomodoroResetButton = document.getElementById("pomodoro-reset");

const pomodoroRoundCount = document.getElementById("pomodoro-round-count");

const pomodoroRingProgress = document.getElementById("pomodoro-ring-progress");

const settingFocus = document.getElementById("setting-focus");

const settingShort = document.getElementById("setting-short");

const settingLong = document.getElementById("setting-long");

/* Circumference of the ring (r = 90) */

const POMODORO_RING_CIRCUMFERENCE = 2 * Math.PI * 90;

if (pomodoroRingProgress) {
  pomodoroRingProgress.style.strokeDasharray = `${POMODORO_RING_CIRCUMFERENCE}`;
}

const pomodoroModeLabels = {
  focus: "Focus session",

  "short-break": "Short break",

  "long-break": "Long break",
};

let pomodoroMode = "focus";

let pomodoroRounds = 0;

let pomodoroSecondsLeft = getPomodoroModeSeconds("focus");

let pomodoroTotalSeconds = pomodoroSecondsLeft;

let pomodoroInterval = null;

let pomodoroRunning = false;

/* ==========================================
   READ SETTINGS (IN SECONDS)
========================================== */

function getPomodoroModeSeconds(mode) {
  const minutesInput = {
    focus: settingFocus,
    "short-break": settingShort,
    "long-break": settingLong,
  }[mode];

  const minutes = Math.max(1, parseInt(minutesInput?.value, 10) || 1);

  return minutes * 60;
}

/* ==========================================
   FORMAT TIME
========================================== */

function formatPomodoroTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/* ==========================================
   RENDER
========================================== */

function renderPomodoro() {
  pomodoroTimeDisplay.textContent = formatPomodoroTime(pomodoroSecondsLeft);

  pomodoroSessionLabel.textContent = pomodoroModeLabels[pomodoroMode];

  pomodoroRoundCount.textContent = pomodoroRounds;

  const progress = pomodoroTotalSeconds
    ? pomodoroSecondsLeft / pomodoroTotalSeconds
    : 0;

  const offset = POMODORO_RING_CIRCUMFERENCE * (1 - progress);

  if (pomodoroRingProgress) {
    pomodoroRingProgress.style.strokeDashoffset = `${offset}`;
  }

  pomodoroStartButton.textContent = pomodoroRunning ? "Pause" : "Start";

  document.title = pomodoroRunning
    ? `${formatPomodoroTime(pomodoroSecondsLeft)} · ${pomodoroModeLabels[pomodoroMode]}`
    : "Toledo City Science High School";
}

/* ==========================================
   SWITCH MODE
========================================== */

function setPomodoroMode(mode, { autoStart = false } = {}) {
  pomodoroMode = mode;

  pomodoroTotalSeconds = getPomodoroModeSeconds(mode);

  pomodoroSecondsLeft = pomodoroTotalSeconds;

  document.querySelectorAll(".pomodoro-mode").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });

  renderPomodoro();

  if (autoStart) {
    startPomodoro();
  }
}

/* ==========================================
   START / PAUSE
========================================== */

function startPomodoro() {
  if (pomodoroRunning) return;

  pomodoroRunning = true;

  renderPomodoro();

  pomodoroInterval = setInterval(() => {
    pomodoroSecondsLeft -= 1;

    if (pomodoroSecondsLeft <= 0) {
      handlePomodoroComplete();

      return;
    }

    renderPomodoro();
  }, 1000);
}

function pausePomodoro() {
  pomodoroRunning = false;

  clearInterval(pomodoroInterval);

  renderPomodoro();
}

/* ==========================================
   HANDLE A COMPLETED SESSION
========================================== */

function handlePomodoroComplete() {
  clearInterval(pomodoroInterval);

  pomodoroRunning = false;

  if (pomodoroMode === "focus") {
    pomodoroRounds += 1;

    const nextMode = pomodoroRounds % 4 === 0 ? "long-break" : "short-break";

    setPomodoroMode(nextMode, { autoStart: true });
  } else {
    setPomodoroMode("focus", { autoStart: true });
  }
}

/* ==========================================
   RESET
========================================== */

function resetPomodoro() {
  pausePomodoro();

  pomodoroTotalSeconds = getPomodoroModeSeconds(pomodoroMode);

  pomodoroSecondsLeft = pomodoroTotalSeconds;

  renderPomodoro();
}

/* ==========================================
   EVENTS
========================================== */

pomodoroModesBar?.addEventListener("click", (event) => {
  const button = event.target.closest(".pomodoro-mode");

  if (!button) return;

  pausePomodoro();

  setPomodoroMode(button.dataset.mode);
});

pomodoroStartButton?.addEventListener("click", () => {
  if (pomodoroRunning) {
    pausePomodoro();
  } else {
    startPomodoro();
  }
});

pomodoroResetButton?.addEventListener("click", resetPomodoro);

[settingFocus, settingShort, settingLong].forEach((input) => {
  input?.addEventListener("change", () => {
    if (!pomodoroRunning) {
      pomodoroTotalSeconds = getPomodoroModeSeconds(pomodoroMode);

      pomodoroSecondsLeft = pomodoroTotalSeconds;

      renderPomodoro();
    }
  });
});

renderPomodoro();

/* ==========================================
   STUDY MEDIA PLAYER (YOUTUBE / SPOTIFY)
========================================== */

const mediaForm = document.getElementById("media-form");

const mediaLinkInput = document.getElementById("media-link-input");

const mediaError = document.getElementById("media-error");

const mediaEmpty = document.getElementById("media-empty");

const mediaEmbedWrap = document.getElementById("media-embed-wrap");

const mediaEmbed = document.getElementById("media-embed");

const mediaClearButton = document.getElementById("media-clear");

/* ==========================================
   PARSE A YOUTUBE OR SPOTIFY LINK
========================================== */

function parseMediaLink(rawLink) {
  const link = rawLink.trim();

  /* =========================
     YOUTUBE
  ========================= */

  try {
    const url = new URL(link);
    const hostname = url.hostname.toLowerCase();

    /* -------------------------
       youtube.com
    ------------------------- */

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      /* Normal video:
         youtube.com/watch?v=VIDEO_ID
      */
      const videoId = url.searchParams.get("v");

      if (videoId) {
        return {
          type: "youtube",
          src: `https://www.youtube.com/embed/${videoId}`,
        };
      }

      /* Playlist */
      const playlistId = url.searchParams.get("list");

      if (playlistId && url.pathname === "/playlist") {
        return {
          type: "youtube",
          src: `https://www.youtube.com/embed/videoseries?list=${playlistId}`,
        };
      }

      /* Shorts:
         youtube.com/shorts/VIDEO_ID
      */
      const shortsMatch = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);

      if (shortsMatch) {
        return {
          type: "youtube",
          src: `https://www.youtube.com/embed/${shortsMatch[1]}`,
        };
      }

      /* Embed:
         youtube.com/embed/VIDEO_ID
      */
      const embedMatch = url.pathname.match(/^\/embed\/([a-zA-Z0-9_-]+)/);

      if (embedMatch) {
        return {
          type: "youtube",
          src: `https://www.youtube.com/embed/${embedMatch[1]}`,
        };
      }
    }

    /* -------------------------
       youtu.be
    ------------------------- */

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];

      if (videoId) {
        return {
          type: "youtube",
          src: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }
  } catch (error) {
    console.warn("Invalid media URL:", error);
  }

  /* =========================
     SPOTIFY
  ========================= */

  let match = link.match(
    /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/i,
  );

  if (match) {
    return {
      type: "spotify",
      kind: match[1],
      src: `https://open.spotify.com/embed/${match[1]}/${match[2]}`,
    };
  }

  /* Spotify URI */

  match = link.match(
    /spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)/i,
  );

  if (match) {
    return {
      type: "spotify",
      kind: match[1],
      src: `https://open.spotify.com/embed/${match[1]}/${match[2]}`,
    };
  }

  return null;
}
/* ==========================================
   RENDER THE EMBED
========================================== */

function renderMediaEmbed(media) {
  if (media.type === "youtube") {
    mediaEmbed.innerHTML = `
    <iframe
      src="${media.src}"
      title="YouTube player"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      playsinline
    ></iframe>
  `;

    mediaEmbed.classList.remove("media-embed-spotify");
    mediaEmbed.classList.add("media-embed-youtube");
  } else {
    const compact = media.kind === "track" || media.kind === "episode";

    mediaEmbed.innerHTML = `
      <iframe
        src="${media.src}"
        title="Spotify player"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    `;

    mediaEmbed.classList.remove("media-embed-youtube");

    mediaEmbed.classList.add("media-embed-spotify");

    mediaEmbed.classList.toggle("media-embed-compact", compact);
  }

  mediaEmpty.classList.add("hidden");

  mediaError.classList.add("hidden");

  mediaEmbedWrap.classList.remove("hidden");

  try {
    localStorage.setItem("wellness-hub-media-src", JSON.stringify(media));
  } catch (error) {
    /* Storage may be unavailable; the player still works this session. */
  }
}

/* ==========================================
   LOAD LINK
========================================== */

mediaForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const media = parseMediaLink(mediaLinkInput.value);

  if (!media) {
    mediaError.classList.remove("hidden");

    return;
  }

  renderMediaEmbed(media);
});

/* ==========================================
   CLEAR PLAYER
========================================== */

mediaClearButton?.addEventListener("click", () => {
  mediaEmbed.innerHTML = "";

  mediaEmbedWrap.classList.add("hidden");

  mediaEmpty.classList.remove("hidden");

  mediaLinkInput.value = "";

  try {
    localStorage.removeItem("wellness-hub-media-src");
  } catch (error) {
    /* Ignore if storage is unavailable. */
  }
});

/* ==========================================
   RESTORE LAST PLAYER ON LOAD
========================================== */

try {
  const savedMedia = localStorage.getItem("wellness-hub-media-src");

  if (savedMedia) {
    renderMediaEmbed(JSON.parse(savedMedia));
  }
} catch (error) {
  /* Ignore if storage is unavailable or the saved value is invalid. */
}

/* ==========================================
   STRESS RELIEF ACTIVITIES
========================================== */

const activityData = {
  breathing: {
    title: "Breathing Exercise",

    image: "assets/bgs/brea.jpg",

    description:
      "Take a few moments to slow your breathing and give yourself a chance to settle.",

    time: "2–5 minutes",

    effort: "Low",

    details: `
      <h3>How to do it</h3>

      <ol>
        <li>Get into a comfortable position.</li>
        <li>Take a slow, comfortable breath in.</li>
        <li>Let the breath out gently.</li>
        <li>Continue at a comfortable pace for a few minutes.</li>
      </ol>

      <h3>Helpful reminder</h3>

      <p>
        You do not need to force your breathing or make it perfectly
        slow. Keep it comfortable and focus on giving yourself a
        brief pause.
      </p>
    `,
  },

  grounding: {
    title: "Grounding Exercise",

    image: "assets/bgs/grou.jpg",

    description:
      "Use your senses to reconnect with your surroundings and bring your attention to the present moment.",

    time: "3–5 minutes",

    effort: "Low",

    details: `
      <h3>How to do it</h3>

      <ol>
        <li>Look around and notice a few things you can see.</li>
        <li>Notice sounds around you.</li>
        <li>Pay attention to things you can physically feel.</li>
        <li>Take a moment to observe your surroundings without judging them.</li>
      </ol>

      <h3>Helpful reminder</h3>

      <p>
        The goal is simply to notice what is happening around you
        right now.
      </p>
    `,
  },

  journaling: {
    title: "Journaling Prompt",

    image: "assets/bgs/jou.jpg",

    description: "Give your thoughts some space by putting them into words.",

    time: "5–10 minutes",

    effort: "Low",

    details: `
      <h3>Try this prompt</h3>

      <p>
        What has been taking up most of your thoughts lately?
      </p>

      <p>
        Then ask yourself:
        <strong>What is one small thing I can do about it?</strong>
      </p>

      <h3>Remember</h3>

      <p>
        Your journal does not have to sound organized or polished.
        Write honestly and use whatever words come naturally.
      </p>
    `,
  },

  relaxation: {
    title: "Relaxation",

    image: "assets/bgs/rel.jpg",

    description:
      "Give yourself permission to stop for a moment and let your body relax.",

    time: "3–10 minutes",

    effort: "Low",

    details: `
      <h3>Try this</h3>

      <ol>
        <li>Sit somewhere comfortable.</li>
        <li>Let your shoulders relax.</li>
        <li>Unclench your jaw if you notice tension there.</li>
        <li>Take a few comfortable breaths.</li>
        <li>Allow yourself to simply rest for a few moments.</li>
      </ol>

      <h3>Helpful reminder</h3>

      <p>
        You don't need to accomplish anything during this activity.
        The break itself is enough.
      </p>
    `,
  },

  "short-break": {
    title: "Short Break",

    image: "assets/bgs/sho.jpg",

    description:
      "Step away from what you are doing and give yourself a short opportunity to reset.",

    time: "5–10 minutes",

    effort: "Low",

    details: `
      <h3>During your break</h3>

      <ul>
        <li>Stand up and stretch gently.</li>
        <li>Drink some water.</li>
        <li>Look away from your screen.</li>
        <li>Walk around for a moment.</li>
        <li>Rest without thinking about your task.</li>
      </ul>

      <h3>Coming back</h3>

      <p>
        When your break is finished, return to one small part of
        your task rather than trying to solve everything at once.
      </p>
    `,
  },

  reframing: {
    title: "Reframing Thought Patterns",

    image: "assets/bgs/pos.jpg",

    description:
      "Pause when a stressful thought appears and consider whether there is another way to look at the situation.",

    time: "5 minutes",

    effort: "Low",

    details: `
      <h3>Try these questions</h3>

      <ul>
        <li>What exactly am I thinking right now?</li>
        <li>Is there another possible explanation?</li>
        <li>What would I say to a friend in the same situation?</li>
        <li>What part of this situation can I actually control?</li>
      </ul>

      <h3>Remember</h3>

      <p>
        Reframing does not mean pretending that a problem is not
        difficult. It means looking at it from a more balanced
        perspective.
      </p>
    `,
  },

  creative: {
    title: "Creative Expression",

    image: "assets/bgs/crea.jpg",

    description:
      "Use a creative activity as a simple way to express yourself and take your attention away from stress for a while.",

    time: "5–20 minutes",

    effort: "Low",

    details: `
      <h3>Choose something</h3>

      <ul>
        <li>Draw something.</li>
        <li>Write a short poem.</li>
        <li>Play an instrument.</li>
        <li>Make a small sketch.</li>
        <li>Write whatever is on your mind.</li>
      </ul>

      <h3>There are no rules</h3>

      <p>
        This is not about creating something perfect. The activity
        is simply a chance to express yourself and take a break.
      </p>
    `,
  },

  pomodoro: {
    title: "Pomodoro Technique",

    image: "assets/bgs/pomo.jpg",

    description:
      "Break study sessions into manageable periods of focused work followed by short breaks.",

    time: "25–30 minutes",

    effort: "Moderate",

    details: `
      <h3>Basic approach</h3>

      <ol>
        <li>Choose one task to work on.</li>
        <li>Focus on it for about 25 minutes.</li>
        <li>Take a short break.</li>
        <li>Repeat when you are ready.</li>
      </ol>

      <h3>Make it realistic</h3>

      <p>
        The exact timing does not have to be perfect. Adjust the
        work and break periods to something that fits your situation.
      </p>
    `,
  },
};

/* ==========================================
   ELEMENTS
========================================== */

const activityModal = document.getElementById("activity-modal");

const activityModalCard = document.querySelector(".activity-modal-card");

const activityModalClose = document.getElementById("activity-modal-close");

const activityModalImage = document.getElementById("activity-modal-image");

const activityModalTitle = document.getElementById("activity-modal-title");

const activityModalDescription = document.getElementById(
  "activity-modal-description",
);

const activityModalTime = document.getElementById("activity-modal-time");

const activityModalEffort = document.getElementById("activity-modal-effort");

const activityModalDetails = document.getElementById("activity-modal-details");

/* ==========================================
   OPEN ACTIVITY
========================================== */

function openActivity(activityName) {
  const activity = activityData[activityName];

  if (!activity) return;

  activityModalImage.src = activity.image;
  activityModalImage.alt = activity.title;

  activityModalTitle.textContent = activity.title;

  activityModalDescription.textContent = activity.description;

  activityModalTime.textContent = activity.time;

  activityModalEffort.textContent = activity.effort;

  activityModalDetails.innerHTML = activity.details;

  activityModal.classList.remove("hidden");

  activityModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("activity-modal-open");
}

/* ==========================================
   CLOSE ACTIVITY
========================================== */

function closeActivity() {
  activityModal.classList.add("hidden");

  activityModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("activity-modal-open");
}

/* ==========================================
   CARD CLICK EVENTS
========================================== */

document.querySelectorAll(".activity-card").forEach((card) => {
  card.addEventListener("click", () => {
    const activityName = card.dataset.activity;

    openActivity(activityName);
  });
});

/* ==========================================
   CLOSE BUTTON
========================================== */

activityModalClose?.addEventListener("click", closeActivity);

/* ==========================================
   CLICK OUTSIDE MODAL
========================================== */

activityModal?.addEventListener("click", (event) => {
  if (event.target === activityModal) {
    closeActivity();
  }
});

/* ==========================================
   ESCAPE KEY
========================================== */

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    activityModal &&
    !activityModal.classList.contains("hidden")
  ) {
    closeActivity();
  }
});

/* ==========================================
   STUDY & STRESS TOPICS
========================================== */

const studyStressData = {
  organize: {
    title: "Organize Tasks",

    image: "assets/bgs/orga.jpg",

    description:
      "Break larger assignments into smaller and more manageable steps.",

    time: "5–10 minutes",

    focus: "Organization",

    details: `

      <h3>Why it helps</h3>

      <p>
        Large assignments can feel overwhelming when they are treated
        as one large task. Breaking them into smaller steps can make
        the work easier to approach.
      </p>


      <h3>How to do it</h3>

      <ol>
        <li>Write down everything you need to finish.</li>

        <li>
          Break large assignments into smaller tasks.
        </li>

        <li>
          Decide which step you can start with.
        </li>

        <li>
          Work through the smaller tasks one at a time.
        </li>
      </ol>


      <h3>Try this</h3>

      <p>
        Instead of writing "finish research project," try breaking it
        into smaller actions such as choosing a topic, finding sources,
        taking notes, and writing the first section.
      </p>

    `,
  },

  prioritize: {
    title: "Prioritize",

    image: "assets/bgs/prio.jpg",

    description: "Decide which responsibilities need attention first.",

    time: "5 minutes",

    focus: "Planning",

    details: `

      <h3>Why it matters</h3>

      <p>
        When several responsibilities compete for your attention,
        deciding what needs to come first can help make your workload
        feel more manageable.
      </p>


      <h3>Start with these questions</h3>

      <ul>
        <li>Which task is due first?</li>

        <li>Which task will take the most time?</li>

        <li>Which task needs to be started now?</li>

        <li>Which tasks can wait?</li>
      </ul>


      <h3>Helpful reminder</h3>

      <p>
        You don't have to work on everything at the same time.
        Finishing one important task can be more useful than
        constantly switching between several unfinished tasks.
      </p>

    `,
  },

  breaks: {
    title: "Take Breaks",

    image: "assets/bgs/break.jpg",

    description: "Give yourself opportunities to step away from schoolwork.",

    time: "5–10 minutes",

    focus: "Reset",

    details: `

      <h3>Why breaks matter</h3>

      <p>
        Taking a short break gives you an opportunity to step away
        from your work before returning to it.
      </p>


      <h3>During your break</h3>

      <ul>
        <li>Stand up and move around.</li>

        <li>Drink some water.</li>

        <li>Rest your eyes.</li>

        <li>Look away from your screen.</li>

        <li>Give yourself a few quiet moments.</li>
      </ul>


      <h3>Coming back</h3>

      <p>
        When your break is over, return to one small part of your
        task rather than trying to tackle everything at once.
      </p>

    `,
  },

  planning: {
    title: "Plan Ahead",

    image: "assets/bgs/pla.jpg",

    description: "Keep track of upcoming tasks and deadlines.",

    time: "5–15 minutes",

    focus: "Preparation",

    details: `

      <h3>Why planning helps</h3>

      <p>
        Keeping track of upcoming responsibilities can make it easier
        to see what needs to be done and reduce the chance of forgetting
        important deadlines.
      </p>


      <h3>What to keep track of</h3>

      <ul>
        <li>Assignments</li>

        <li>Projects</li>

        <li>Tests and quizzes</li>

        <li>Presentations</li>

        <li>Upcoming deadlines</li>
      </ul>


      <h3>Try this</h3>

      <p>
        Use a planner, calendar, or simple task list. Check it
        regularly and update it when something changes.
      </p>


      <h3>Helpful reminder</h3>

      <p>
        Planning doesn't mean every minute of your day has to be
        scheduled. Leave yourself some flexibility.
      </p>

    `,
  },

  pressure: {
    title: "Academic Pressure",

    image: "assets/bgs/aca.jpg",

    description:
      "Recognize when school pressure is becoming difficult to manage.",

    time: "As needed",

    focus: "Self-awareness",

    details: `

      <h3>What academic pressure can feel like</h3>

      <p>
        School responsibilities can sometimes feel difficult to
        manage, especially when several deadlines, expectations,
        and responsibilities happen at the same time.
      </p>


      <h3>What can help</h3>

      <ul>
        <li>Break large responsibilities into smaller tasks.</li>

        <li>Prioritize what needs attention first.</li>

        <li>Take reasonable breaks.</li>

        <li>Give yourself realistic expectations.</li>

        <li>Talk to someone you trust when you need support.</li>
      </ul>


      <h3>Remember</h3>

      <p>
        You don't have to handle every school problem perfectly.
        Focus on what you can manage right now and take things
        one step at a time.
      </p>


      <h3>Ask for support</h3>

      <p>
        If school pressure starts becoming difficult to handle,
        consider talking with a trusted person, teacher, counselor,
        parent, or another supportive adult.
      </p>

    `,
  },

  recall: {
    title: "Active Recalling",

    image: "assets/bgs/act.jpg",

    description:
      "Reading notes over and over makes text feel familiar, but familiarity is not the same as true memory.",

    time: "5–15 minutes",

    focus: "Understanding",

    details: `

      <h3>What active recall is.</h3>

      <p>
        Active recall is a learning technique that strengthens 
        memory by requiring you to retrieve information instead 
        of passively rereading notes. This article provides practical 
        tips for using active recall to improve revision and achieve better grades.
      </p>


      <h3>How active recall works.</h3>

      <ul>
        <li>Active recall makes your brain retrieve information instead of passively reading it.</li>

        <li>Repeated retrieval strengthens the neural connections linked to memories.</li>

        <li>Like learning a new route, practice makes recalling information easier over time.</li>

        <li>Although self-testing may feel more difficult than reading, the challenge strengthens your memory.</li>

        <li>Regular practice improves long-term learning and recall.</li>
      </ul>


      <h3>Remember</h3>

      <p>
        Combining active recall techniques with spaced repetition is key. 
        Instead of cramming, review material at increasing intervals to reinforce memory and understanding.
      </p>


      <h3>Tip</h3>

      <p>
        If you want to do active recall without an app, try Blurting, the Feynman Technique and past exam papers. 
        Another option is to use flashcards, which can be physical or digital.
      </p>

    `,
  },

  environment: {
    title: "Environment Control",

    image: "assets/bgs/envi.jpg",

    description:
      "Clean, organized, and distraction-free spaces can help you focus and feel more in control.",

    time: "As needed",

    focus: "Environmental awareness.",

    details: `

      <h3>What it is.</h3>

      <p>
       Environmental control means organizing your study surroundings to improve focus, clarity, and memory. 
       By managing noise, lighting, temperature, and workspace order, you can reduce distractions and create 
       an environment that supports effective learning.
      </p>


      <h3>What can help</h3>

      <ul>
        <li>Use a desk: Never study on your bed so your brain stays alert.</li>

        <li>Face a blank wall: Put your desk facing a wall to block moving sights.</li>

        <li>Clear the clutter: Keep only the books and tools you need right now on the desk.</li>

        <li>Keep water close: Place a water bottle on your table so you do not need to walk away.</li>

        <li>Block out sounds: Use soft earplugs or play steady white noise if it is loud.</li>

        <li>Bright light: Use a clear desk lamp to light your books well and reduce eye strain.</li>

        <li>Comfortable air: Keep the room cool and airy so you do not feel sleepy.</li>

        <li>Hide your phone: Put your phone in another room or turn on airplane mode.</li>
      </ul>


      <h3>Remember</h3>

      <p>
       The best study environment is a quiet, well-lit, and clutter-free space dedicated solely to learning.
       Distractions like phones, social media, and noise can significantly reduce focus and retention.
      </p>
    `,
  },
};

/* ==========================================
   STUDY & STRESS MODAL
========================================== */

const studyStressModal = document.getElementById("study-stress-modal");

const studyStressModalClose = document.getElementById(
  "study-stress-modal-close",
);

const studyStressModalImage = document.getElementById(
  "study-stress-modal-image",
);

const studyStressModalTitle = document.getElementById(
  "study-stress-modal-title",
);

const studyStressModalDescription = document.getElementById(
  "study-stress-modal-description",
);

const studyStressModalTime = document.getElementById("study-stress-modal-time");

const studyStressModalFocus = document.getElementById(
  "study-stress-modal-focus",
);

const studyStressModalDetails = document.getElementById(
  "study-stress-modal-details",
);

function openStudyStressTopic(topicName) {
  const topic = studyStressData[topicName];

  if (!topic) return;

  studyStressModalImage.src = topic.image;

  studyStressModalImage.alt = topic.title;

  studyStressModalTitle.textContent = topic.title;

  studyStressModalDescription.textContent = topic.description;

  studyStressModalTime.textContent = topic.time;

  studyStressModalFocus.textContent = topic.focus;

  studyStressModalDetails.innerHTML = topic.details;

  studyStressModal.classList.remove("hidden");

  studyStressModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("activity-modal-open");
}

function closeStudyStressTopic() {
  studyStressModal.classList.add("hidden");

  studyStressModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("activity-modal-open");
}

/* ==========================================
   STUDY & STRESS CARD CLICKS
========================================== */

document.querySelectorAll(".study-stress-card").forEach((card) => {
  card.addEventListener("click", () => {
    const topicName = card.dataset.studyTopic;

    openStudyStressTopic(topicName);
  });
});

/* ==========================================
   CLOSE STUDY & STRESS MODAL
========================================== */

studyStressModalClose?.addEventListener("click", closeStudyStressTopic);

studyStressModal?.addEventListener("click", (event) => {
  if (event.target === studyStressModal) {
    closeStudyStressTopic();
  }
});
