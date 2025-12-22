const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ცენტრი
const center = { x: canvas.width / 2, y: canvas.height / 2 };

// ნაწილაკები
const particles = [];
const particleCount = 120;

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    const dx = center.x - p.x;
    const dy = center.y - p.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 150) {
      p.vx += dx * 0.00002;
      p.vy += dy * 0.00002;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,1)";
    ctx.shadowColor = "rgba(0,255,255,0.8)";
    ctx.shadowBlur = 10;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const d = Math.hypot(p.x - p2.x, p.y - p2.y);

      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0,255,255,${1 - d / 120})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animate);
}

animate();
