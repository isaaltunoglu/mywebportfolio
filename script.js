const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const canvas = document.getElementById("signalCanvas");
const ctx = canvas?.getContext("2d");
let points = [];
let width = 0;
let height = 0;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = window.devicePixelRatio || 1;
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(36, Math.floor(width / 26));
  points = Array.from({ length: count }, (_, index) => ({
    x: (index / count) * width,
    y: Math.random() * height,
    base: Math.random() * height,
    speed: 0.35 + Math.random() * 0.9,
    amp: 18 + Math.random() * 54,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawSignals(time = 0) {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width, height);

  points.forEach((point, index) => {
    point.y = point.base + Math.sin(time * 0.001 * point.speed + point.phase) * point.amp;

    for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
      const next = points[nextIndex];
      const dx = point.x - next.x;
      const dy = point.y - next.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 145) {
        const alpha = (1 - distance / 145) * 0.18;
        ctx.strokeStyle = `rgba(47, 201, 121, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
    }
  });

  points.forEach((point, index) => {
    const hue = index % 3 === 0 ? "47, 201, 121" : index % 3 === 1 ? "37, 95, 159" : "209, 145, 47";
    ctx.fillStyle = `rgba(${hue}, 0.7)`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawSignals);
}

resizeCanvas();
requestAnimationFrame(drawSignals);
window.addEventListener("resize", resizeCanvas);
