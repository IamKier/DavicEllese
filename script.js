// =========================================
// Real-Time Video BG Color Matcher & Text Contrast
// =========================================
const video = document.getElementById('jasmin-video');
const slide = document.getElementById('jasmin-slide');

if (video && slide) {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  function syncBackground() {
    if (video.readyState >= 2) {
      try {
        // Sample 1 pixel from the top-left edge outside the character silhouette
        ctx.drawImage(video, 12, 12, 1, 1, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

        slide.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        // Standard perceived luminance calculation
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luminance < 120) {
          slide.classList.add('dark-contrast');
        } else {
          slide.classList.remove('dark-contrast');
        }
      } catch (err) {
        // Catches CORS issues if loaded straight from file://
      }
    }

    if ('requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(syncBackground);
    } else {
      requestAnimationFrame(syncBackground);
    }
  }

  video.addEventListener('play', () => {
    if ('requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(syncBackground);
    } else {
      requestAnimationFrame(syncBackground);
    }
  });
}

// =========================================
// Category Filter & Modal Fallbacks
// =========================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.portfolio-grid .card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    cards.forEach((card) => {
      const category = card.getAttribute('data-category');
      card.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
    });
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxSubtitle = document.getElementById('lightbox-subtitle');

function openLightbox(title, subtitle, imgSrc) {
  if (!lightbox) return;
  lightboxTitle.textContent = title;
  lightboxSubtitle.textContent = subtitle;
  lightboxImg.src = imgSrc;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach((el) => revealObserver.observe(el));
}

const pageWrap = document.body;
pageWrap.classList.add('page-ready');
document.addEventListener("DOMContentLoaded", () => {
  const videoWrappers = document.querySelectorAll(".video-player-wrap");

  videoWrappers.forEach((wrapper) => {
    const video = wrapper.querySelector("video");
    const playBtn = wrapper.querySelector(".btn-play");
    const audioBtn = wrapper.querySelector(".btn-audio");

    if (!video) return;

    // Toggle Play / Pause
    if (playBtn) {
      playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.paused) {
          video.play();
          playBtn.textContent = "Pause";
          playBtn.setAttribute("aria-label", "Pause video");
        } else {
          video.pause();
          playBtn.textContent = "Play";
          playBtn.setAttribute("aria-label", "Play video");
        }
      });
    }

    // Toggle Mute / Unmute
    if (audioBtn) {
      audioBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.muted) {
          video.muted = false;
          audioBtn.textContent = "Mute";
          audioBtn.classList.add("active-unmuted");
          audioBtn.setAttribute("aria-label", "Mute audio");
        } else {
          video.muted = true;
          audioBtn.textContent = "Unmute";
          audioBtn.classList.remove("active-unmuted");
          audioBtn.setAttribute("aria-label", "Unmute audio");
        }
      });
    }

    // Direct click on video plays/pauses
    video.addEventListener("click", () => {
      if (playBtn) playBtn.click();
    });
  });

  // Reveal animations on scroll
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }
});