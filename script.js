const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY > 100) {
    navbar.classList.add("scrolled");
    backToTop.classList.add("show");
  } else {
    navbar.classList.remove("scrolled");
    backToTop.classList.remove("show");
  }

  updateActiveNavLink();
});

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Tutup menu mobile saat klik di area mana pun di luar menu
document.addEventListener("click", (e) => {
  if (
    navLinks.classList.contains("active") &&
    !e.target.closest(".nav-links") &&
    !e.target.closest(".menu-toggle")
  ) {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  }
});

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    let target = null;

    if (targetId && targetId.length > 1) {
      target = document.querySelector(targetId);
    }

    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");

    if (target) {
      e.preventDefault();
      // 80px = tinggi navbar. Judul section selalu berhenti tepat di bawah navbar,
      // jadi tidak pernah tertutup oleh navbar.
      const navbarHeight = 10;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    }
  });
});

// ===== Typing Animation Effect =====
const roles = ["Engineer", "Operations Center", "Architect", "Administrator"];
const typingText = document.getElementById("typingText");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentRole = roles[roleIndex];
  const currentText = currentRole.substring(0, charIndex);
  typingText.textContent = currentText;

  let delay = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
  } else if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    delay = 1500;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

// ===== Skill Filter =====
const filterBtns = document.querySelectorAll(".filter-btn");
const skillCards = document.querySelectorAll(".skill-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    skillCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;

      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";

      if (shouldShow) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 10);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });
});

// ===== Skill Bar Animation (trigger when visible) =====
function animateSkillBars() {
  const skillsSection = document.querySelector(".skills");
  const skillBars = document.querySelectorAll(".skill-progress");
  const sectionPosition = skillsSection.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;

  if (sectionPosition < viewportHeight - 100) {
    skillBars.forEach((bar) => {
      const progress = bar.dataset.progress;
      bar.style.width = progress + "%";
    });
    window.removeEventListener("scroll", animateSkillBars);
  }
}

window.addEventListener("scroll", animateSkillBars);
animateSkillBars();

// ===== Counter Animation (About Stats) =====
const statNumbers = document.querySelectorAll(".stat-number");

function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const duration = 1500;
  const startPosition = element.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;

  if (
    startPosition < viewportHeight - 100 &&
    !element.classList.contains("counted")
  ) {
    element.classList.add("counted");
    let startTime = null;

    function count(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(easeOut * target);

      if (progress < 1) {
        requestAnimationFrame(count);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(count);
  }
}

window.addEventListener("scroll", () => {
  statNumbers.forEach(animateCounter);
});

statNumbers.forEach(animateCounter);

// ===== Scroll Reveal Animation =====
function revealOnScroll() {
  const elements = document.querySelectorAll(
    ".skill-card, .project-card, .timeline-card, .section-header, .about-content, .contact-content, .footer-content",
  );

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;

    if (elementPosition < viewportHeight - 80) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }

    // Stagger animation for cards
    if (
      element.classList.contains("project-card") ||
      element.classList.contains("skill-card")
    ) {
      const allCards = [...element.parentElement.children];
      const cardIndex = allCards.indexOf(element);
      element.style.transition = `all 0.6s ease ${cardIndex * 0.1}s`;
    }
  });
}

document
  .querySelectorAll(
    ".skill-card, .project-card, .timeline-card, .section-header, .about-content, .contact-content, .footer-content",
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.6s ease";
  });

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ===== Active Nav Link (Scrollspy) =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      const currentId = section.getAttribute("id");
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentId) {
          link.classList.add("active");
        }
      });
    }
  });
}

// ===== Back to Top Button =====
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ===== Contact Form Submit (kirim ke Google Sheets via Apps Script) =====
// Ganti URL di bawah dengan hasil "Deploy > New deployment > Web app"
// Petunjuk lengkap ada di file GOOGLE_SHEET_SETUP.txt
const GAS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzw1g_Q3C2N35d1Xzs5HYktc6rc6DgDN-67AwXRQuE3L0fLGyyiLsn0Vh7NNDgQ3vHn-Q/exec";

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector(".btn-submit");
  const originalText = submitBtn.innerHTML;

  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  submitBtn.innerHTML = "<span>Mengirim...</span>";
  submitBtn.style.opacity = "0.7";
  submitBtn.disabled = true;

  try {
    // mode "no-cors" + Content-Type text/plain = request WEB sederhana tanpa
    // praflight CORS, jadi browser tidak diblokir saat kirim ke Apps Script.
    await fetch(GAS_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });

    submitBtn.innerHTML = "<span>Pesan Terkirim!</span>";
    submitBtn.style.opacity = "1";
    submitBtn.disabled = false;

    contactForm.reset();
  } catch (err) {
    console.error("Gagal mengirim:", err);
    submitBtn.innerHTML = "<span>Gagal Mengirim!</span>";
    submitBtn.style.opacity = "1";
    submitBtn.disabled = false;
  }

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
  }, 2500);
});

// ===== Alternative: Back to Top short-hand (for keyboard users) =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  }
});

// ===== 3D Tilt Effect on Project Cards =====
const tiltCards = document.querySelectorAll(".project-card");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const posX = (e.clientX - rect.left) / rect.width - 0.5;
    const posY = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transition = "transform 0.15s ease";
    card.style.transform =
      "translateY(-8px) " +
      `perspective(900px) rotateX(${(-posY * 10).toFixed(2)}deg) ` +
      `rotateY(${(posX * 10).toFixed(2)}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.5s ease, box-shadow 0.3s ease";
    card.style.transform = "translateY(0)";

    setTimeout(() => {
      card.style.transition = "";
    }, 500);
  });
});

// ===== Enter untuk kirim pesan, Shift+Enter untuk baris baru =====
const messageField = document.getElementById("message");

messageField.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    contactForm.requestSubmit();
  }
});

// ===== Particle Network (dots berkilau + garis koneksi) untuk hero & section =====
(function () {
  const canvases = document.querySelectorAll(".particle-canvas");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!canvases.length || prefersReducedMotion) return;

  canvases.forEach((canvas) => {
    const container = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let rafId = null;

    function initParticles() {
      const { clientWidth, clientHeight } = container;
      canvas.width = clientWidth;
      canvas.height = clientHeight;

      const count = Math.min(
        70,
        Math.floor((clientWidth * clientHeight) / 22000),
      );

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * clientWidth,
        y: Math.random() * clientHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.8 + 1,
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Garis koneksi antar titik yang dekat
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);

          if (dist < 130) {
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.22 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // Dot berkilau
        ctx.beginPath();
        ctx.fillStyle = "rgba(165, 180, 252, 0.9)";
        ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
        ctx.shadowBlur = 12;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(drawParticles);
    }

    function stopAnimation() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    initParticles();
    drawParticles();
    window.addEventListener("resize", initParticles);

    // Hentikan animasi saat section tidak terlihat (hemat baterai)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!rafId) drawParticles();
          } else {
            stopAnimation();
          }
        });
      }).observe(container);
    }
  });
})();

// ============================================================
// ENHANCED ANIMATIONS
// ============================================================
const finePointer = window.matchMedia("(pointer: fine)").matches;
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ===== Preloader =====
const preloader = document.getElementById("preloader");

function hidePreloader() {
  if (!preloader || preloader.classList.contains("hidden")) return;
  preloader.classList.add("hidden");
  document.body.classList.add("loaded");
}

window.addEventListener("load", () => setTimeout(hidePreloader, 900));
setTimeout(hidePreloader, 4500);

// ===== Scroll Progress Bar =====
const scrollProgress = document.getElementById("scrollProgress");
let progressTicking = false;

function updateScrollProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + "%";
  progressTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!progressTicking) {
      progressTicking = true;
      requestAnimationFrame(updateScrollProgress);
    }
  },
  { passive: true },
);

// ===== Custom Cursor (glow dot + trailing ring) =====
(function () {
  if (!finePointer || reducedMotion) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  document.body.classList.add("has-cursor");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;
  let started = false;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!started) {
      started = true;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
      ring.style.left = mx + "px";
      ring.style.top = my + "px";
    }
  });

  (function cursorLoop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(cursorLoop);
  })();

  document
    .querySelectorAll("a, .btn, .skill-card, .project-card, input, textarea")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("grow"));
      el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
    });
})();

// ===== Magnetic hover pada tombol & social link =====
(function () {
  if (!finePointer || reducedMotion) return;

  document
    .querySelectorAll(".btn, .social-link, .footer-social a")
    .forEach((el) => {
      const strength = 16;

      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / strength;
        const y = (e.clientY - r.top - r.height / 2) / strength;
        el.style.transition = "transform 0.18s ease";
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transform = "";
        setTimeout(() => {
          el.style.transition = "";
        }, 450);
      });
    });
})();

// ===== Ripple effect pada tombol =====
document.querySelectorAll(".btn").forEach((btn) => {
  if (reducedMotion) return;

  btn.addEventListener("click", (e) => {
    const rect = btn.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height) * 1.2;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = d + "px";
    ripple.style.height = d + "px";
    ripple.style.left = e.clientX - rect.left - d / 2 + "px";
    ripple.style.top = e.clientY - rect.top - d / 2 + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// ===== Glare / spotlight mengikuti kursor pada kartu =====
(function () {
  if (!finePointer || reducedMotion) return;

  document
    .querySelectorAll(".skill-card, .project-card, .timeline-card")
    .forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        card.style.setProperty("--mx", mx.toFixed(1) + "px");
        card.style.setProperty("--my", my.toFixed(1) + "px");
        const size = Math.max(r.width, r.height) * 1.6;
        card.style.setProperty("--glare-size", size.toFixed(1) + "px");
      });
    });
})();

// ===== Mouse parallax pada orb & foto hero =====
(function () {
  if (!finePointer || reducedMotion || window.innerWidth < 992) return;

  const orbs = document.querySelectorAll(".hero-bg .orb");
  const heroWrap = document.getElementById("heroImage");
  const heroShape = document.querySelector(".hero-image-wrapper .hero-shape");

  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX / window.innerWidth - 0.5;
    ty = e.clientY / window.innerHeight - 0.5;
  });

  (function parallaxLoop() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;

    orbs.forEach((o, i) => {
      const depth = [34, -48, 60][i % 3] || 40;
      o.style.translate = `${(cx * depth).toFixed(1)}px ${(cy * depth).toFixed(
        1,
      )}px`;
    });

    if (heroWrap) {
      heroWrap.style.translate = `${(-cx * 26).toFixed(1)}px ${(-cy * 20).toFixed(
        1,
      )}px`;
    }
    if (heroShape) {
      heroShape.style.translate = `${(cx * 16).toFixed(1)}px ${(cy * 12).toFixed(
        1,
      )}px`;
    }

    requestAnimationFrame(parallaxLoop);
  })();
})();

// ===== Scramble text pada judul section saat terlihat =====
(function () {
  if (reducedMotion) return;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=0123456789";
  const titles = document.querySelectorAll(".section-title span");

  function scramble(el, finalText, frame, frames, done) {
    if (frame >= frames) {
      el.textContent = finalText;
      done();
      return;
    }
    const visible = Math.floor((frame / frames) * finalText.length);
    el.textContent = finalText
      .split("")
      .map((ch, i) =>
        i < visible
          ? ch
          : ch === " "
            ? " "
            : chars[Math.floor(Math.random() * chars.length)],
      )
      .join("");
    setTimeout(() => scramble(el, finalText, frame + 1, frames, done), 35);
  }

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            obs.unobserve(el);
            el.classList.add("scramble-wrap");
            scramble(el, el.textContent, 0, 26, () => {});
          }
        });
      },
      { threshold: 0.4 },
    );
    titles.forEach((t) => obs.observe(t));
  }
})();
