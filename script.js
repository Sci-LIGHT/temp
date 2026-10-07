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
   STRESS RELIEF ACTIVITIES
========================================== */

const activityData = {
  "pascilubong": {
    title: "Pascilubong",

    image: "assets/bgs/pascilubong.jpg",

    description:
      "A school tradition held annually to warmly welcome new Grade 7 and Grade 11 students.",

    time: "Annually",

    effort: "Welcome",

    details: `
      <h3>About this event</h3>

      <p>
        A school tradition held annually to warmly welcome new Grade 7 and Grade 11 students. It helps new students become familiar with the school community, build friendships, and feel a sense of belonging.
      </p>

      <h3>Who it is for</h3><p>New Grade 7 and Grade 11 students.</p>
    `,
  },

  "intramurals": {
    title: "Intramurals",

    image: "assets/bgs/intramurals.jpg",

    description:
      "An annual sports event that promotes sportsmanship, teamwork, discipline, and camaraderie.",

    time: "Annually",

    effort: "Sports",

    details: `
      <h3>About this event</h3>

      <p>
        An annual sports event that promotes sportsmanship, teamwork, discipline, and camaraderie among students. Students participate and compete under the four school houses.
      </p>

      <h3>The four school houses</h3><ul><li>Scire</li><li>Teche</li><li>Handasa</li><li>Manthanein</li></ul>
    `,
  },

  "olympiad": {
    title: "Olympiad Trails",

    image: "assets/bgs/olympiad.jpg",

    description:
      "A series of stationary academic and skill-based challenges that encourage teamwork and critical thinking.",

    time: "Annually",

    effort: "Academics",

    details: `
      <h3>About this event</h3>

      <p>
        A series of stationary academic and skill-based challenges designed to encourage students to apply their knowledge, creativity, critical thinking, and teamwork.
      </p>

      <h3>Facilitated by</h3><p>Grade 12 students.</p>
    `,
  },

  "teachers-month": {
    title: "Teachers’ Month",

    image: "assets/bgs/teachers-month.jpg",

    description:
      "Celebrated every October to recognize and appreciate teachers.",

    time: "Every October",

    effort: "Appreciation",

    details: `
      <h3>About this event</h3>

      <p>
        Celebrated every October as an opportunity for students and the school community to recognize and appreciate teachers for their dedication, guidance, and contribution to students’ learning and development.
      </p>
    `,
  },

  "valentines": {
    title: "Valentine’s Day",

    image: "assets/bgs/valentines.jpg",

    description:
      "A celebration of friendship, appreciation, kindness, and positive relationships.",

    time: "Annually",

    effort: "Friendship",

    details: `
      <h3>About this event</h3>

      <p>
        A school celebration that promotes friendship, appreciation, kindness, and positive relationships among students, teachers, and members of the school community through various activities.
      </p>
    `,
  },

  "buwan-ng-wika": {
    title: "Buwan ng Wika",

    image: "assets/bgs/buwan-ng-wika.jpg",

    description:
      "A month-long celebration of the Filipino language, culture, and national identity.",

    time: "Annually",

    effort: "Filipino culture",

    details: `
      <h3>About this event</h3>

      <p>
        A month-long celebration that highlights the Filipino language, culture, literature, traditions, and national identity. Students participate in activities that encourage appreciation and pride in Filipino heritage.
      </p>
    `,
  },

  "arts-month": {
    title: "Arts Month",

    image: "assets/bgs/arts-month.jpg",

    description:
      "A celebration of students’ creativity and artistic talents.",

    time: "Annually",

    effort: "Creativity",

    details: `
      <h3>About this event</h3>

      <p>
        A celebration that recognizes and promotes students’ creativity, artistic talents, and appreciation for the arts through activities involving visual arts, music, dance, theater, and other forms of artistic expression.
      </p>
    `,
  },

  "nutrition-month": {
    title: "Nutrition Month",

    image: "assets/bgs/nutrition-month.jpg",

    description:
      "A health-focused celebration about proper nutrition and healthy living.",

    time: "Annually",

    effort: "Health",

    details: `
      <h3>About this event</h3>

      <p>
        A health-focused celebration that raises awareness about the importance of proper nutrition, healthy eating habits, and an active lifestyle. It encourages students to make informed choices that support their health and well-being.
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
   LOCATION — COPY COORDINATES
========================================== */

const coordCopyButton = document.getElementById("coord-copy");

coordCopyButton?.addEventListener("click", async () => {
  const text = coordCopyButton.dataset.copy;

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    /* Fallback for browsers or pages without clipboard access */

    const helper = document.createElement("textarea");

    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";

    document.body.appendChild(helper);
    helper.select();

    try {
      document.execCommand("copy");
    } catch (fallbackError) {
      /* Nothing else to try. */
    }

    helper.remove();
  }

  const originalLabel = coordCopyButton.textContent;

  coordCopyButton.textContent = "Copied!";

  setTimeout(() => {
    coordCopyButton.textContent = originalLabel;
  }, 1600);
});
