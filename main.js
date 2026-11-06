// ---------- Placeholder images until real ones are added to /images ----------
function placeholder(title) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1B1F52"/><stop offset="1" stop-color="#0F1230"/></linearGradient></defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <rect x="150" y="150" width="900" height="600" rx="28" fill="#9AA3FF" opacity=".08" stroke="#9AA3FF" stroke-opacity=".3"/>
  <rect x="200" y="200" width="300" height="24" rx="12" fill="#9AA3FF" opacity=".6"/>
  <rect x="200" y="260" width="520" height="16" rx="8" fill="#9AA3FF" opacity=".25"/>
  <rect x="200" y="300" width="460" height="16" rx="8" fill="#9AA3FF" opacity=".25"/>
  <rect x="200" y="380" width="400" height="280" rx="18" fill="#9AA3FF" opacity=".2"/>
  <rect x="640" y="380" width="360" height="280" rx="18" fill="#E8D5B5" opacity=".18"/>
  <text x="600" y="720" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#ECEBF5" opacity=".6">${title}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
document.querySelectorAll(".thumb img").forEach((img) => {
  const swap = () => { img.onerror = null; img.src = placeholder(img.dataset.title || "Project"); };
  img.onerror = swap;
  if (img.complete && img.naturalWidth === 0) swap();
});

// ---------- Mobile menu, header, active link ----------
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const header = document.querySelector(".site-header");
const setMenu = (o) => {
  nav.classList.toggle("open", o);
  toggle.setAttribute("aria-expanded", String(o));
  toggle.setAttribute("aria-label", o ? "Close menu" : "Open menu");
};
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.getElementById("year").textContent = new Date().getFullYear();

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

if (window.particlesJS) {
  window.particlesJS("particles", {
    particles: {
      number: { value: reduce ? 35 : 75, density: { enable: true, value_area: 900 } },
      color: { value: ["#9AA3FF", "#E8D5B5", "#6D75E0"] },
      shape: { type: "circle" },
      opacity: { value: 0.65, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: !reduce,
        distance: 150,
        color: "#9AA3FF",
        opacity: 0.35,
        width: 1,
      },
      move: {
        enable: !reduce,
        speed: 1.2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: fine && !reduce, mode: "grab" },
        onclick: { enable: fine && !reduce, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 190, line_linked: { opacity: 0.9 } },
        push: { particles_nb: 3 },
      },
    },
    retina_detect: true,
  });
  document.documentElement.classList.add("particles-ready");
} else {
  console.error("particles.js bundle did not load.");
}

if (window.gsap && window.ScrollTrigger && !reduce) {
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Smooth scrolling (Lenis) wired to GSAP ----------
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.1 });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]:not([href="#top"])').forEach((a) =>
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); }
      })
    );
  }

  // ---------- Hero intro: one orchestrated sequence ----------
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.from(".status", { y: 20, opacity: 0, duration: 0.8 })
    .from(".hero h1 .line>span", { yPercent: 115, rotate: 3, duration: 1.2, stagger: 0.12 }, "-=0.5")
    .from(".hero-sub,.hero .hero-actions", { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.7")
    .from(".site-header", { y: -30, opacity: 0, duration: 0.9 }, "-=1.2")
    .from(".orbit", { scale: 0.7, opacity: 0, duration: 1.4, stagger: 0.15 }, "-=1.1")
    .fromTo(".arch img", { clipPath: "inset(100% 0% 0% 0% round 150px 150px 24px 24px)" },
      { clipPath: "inset(0% 0% 0% 0% round 150px 150px 24px 24px)", duration: 1.4, clearProps: "clipPath" }, "-=1.2")
    .from(".badge,.chip", { y: 30, opacity: 0, scale: 0.9, duration: 1, stagger: 0.12 }, "-=0.8");

  // ---------- Hero parallax: stage layers follow the pointer ----------
  const layers = gsap.utils.toArray(".stage [data-depth]").map((el) => ({
    x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
    y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
    d: parseFloat(el.dataset.depth),
  }));
  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (e) => {
    const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
    layers.forEach((l) => { l.x(-nx * l.d * 1.6); l.y(-ny * l.d * 1.6); });
  });
  gsap.to(".hero-inner", { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // ---------- Scroll reveals ----------
  gsap.utils.toArray(".reveal").forEach((el) =>
    gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } })
  );
  gsap.utils.toArray(".thumb").forEach((t) => {
    gsap.from(t, { clipPath: "inset(14% 8% 14% 8% round 20px)", opacity: 0.3, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 90%", once: true } });
    gsap.fromTo(t.querySelector("img"), { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: t, start: "top bottom", end: "bottom top", scrub: true } });
  });
  const mobile = matchMedia("(max-width:980px)").matches;
  gsap.to(".line-fill", { [mobile ? "scaleY" : "scaleX"]: 1, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 70%", scrub: true } });
  gsap.from(".steps li", { y: 30, opacity: 0, stagger: 0.12, duration: 0.9, scrollTrigger: { trigger: ".steps", start: "top 80%", once: true } });

  // ---------- Count-up numbers ----------
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = +el.dataset.count, suf = el.dataset.suffix || "", o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v) + suf), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });

  // ---------- Magnetic buttons ----------
  if (fine) document.querySelectorAll(".magnetic").forEach((b) => {
    const x = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" }), y = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" });
    b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.3); y((e.clientY - r.top - r.height / 2) * 0.4); });
    b.addEventListener("pointerleave", () => { x(0); y(0); });
  });
}

// ---------- Custom cursor ----------
if (window.gsap && fine) {
  const dot = document.querySelector(".cursor-dot"), ring = document.querySelector(".cursor-ring"), label = ring.querySelector("span");
  const dx = gsap.quickTo(dot, "x", { duration: 0.1 }), dy = gsap.quickTo(dot, "y", { duration: 0.1 });
  const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
  addEventListener("pointermove", (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => { label.textContent = el.dataset.cursor; ring.classList.add("hover"); });
    el.addEventListener("pointerleave", () => ring.classList.remove("hover"));
  });
  document.querySelectorAll(".btn,.nav a,.timeline a,.brand,.wa-float").forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("link"));
    el.addEventListener("pointerleave", () => ring.classList.remove("link"));
  });
}

// ---------- Header state + active section ----------
const onScroll = () => header.classList.toggle("scrolled", scrollY > 20);
onScroll(); addEventListener("scroll", onScroll, { passive: true });
const links = [...nav.querySelectorAll("a:not(.btn)")];
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
links.forEach((l) => { const s = document.querySelector(l.getAttribute("href")); if (s) io.observe(s); });

// ---------- Back to top ----------
document.querySelectorAll('a[href="#top"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  })
);