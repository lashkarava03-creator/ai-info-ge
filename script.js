const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const particles = [];
const particleCount = 80;

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 1 + 0.3,
    radius: Math.random() * 2 + 1
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.y -= p.speed;
    if (p.y < 0) p.y = canvas.height;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
