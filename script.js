const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

// ეკრანის ზომის მორგება
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
}

window.addEventListener("resize", resize);

// ცენტრი (ტვინის ადგილი)
const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

resize();

// ნაწილაკები
const particles = [];
const particleCount = 120;

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 2.5 + 1.5
  });
}

// ანიმაცია
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    // მიზიდვა ცენტრისკენ
    const dx = center.x - p.x;
    const dy = center.y - p.y;

    p.vx += dx * 0.00002;
    p.vy += dy * 0.00002;

    p.x += p.vx;
    p.y += p.vy;

    // კედლებზე შეჯახება
    if (p.x < 0 || p.x > canvas.width) p.vx *= -0.5;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -0.5;

    // წერტილი
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 255, 255, 1)";
    ctx.shadowColor = "rgba(0, 255, 255, 0.9)";
    ctx.shadowBlur = 12;
    ctx.fill();

    // ნეირონული ხაზები
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 120})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animate);
}

// გაშვება
animate();

