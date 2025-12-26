const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const dots = [];

for (let i = 0; i < 120; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(d => {
    d.x += d.vx;
    d.y += d.vy;

    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

    ctx.beginPath();
    ctx.arc(d.x, d.y, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,0.9)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

