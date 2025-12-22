const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

// ზომის მორგება
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
  textPoints = generateTextPoints("AI");
}
window.addEventListener("resize", resize);

// ცენტრი
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
resize();

// ნაწილაკები
const particles = [];
const particleCount = 140;
let mode = "FLOW"; // FLOW | TEXT | DISPERSE
let textPoints = [];
let timer = 0;

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: 2
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    if (mode === "TEXT" && textPoints[i]) {
      // ტექსტში რბილი მისვლა (დამშვიდებული)
      p.vx = (textPoints[i].x - p.x) * 0.05;
      p.vy = (textPoints[i].y - p.y) * 0.05;
    } 
    else if (mode === "DISPERSE") {
      p.vx += (Math.random() - 0.5) * 0.2;
      p.vy += (Math.random() - 0.5) * 0.2;
    } 
    else {
      // FLOW
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 180) {
        p.vx += dx * 0.00003;
        p.vy += dy * 0.00003;
      }
    }

    p.x += p.vx;
    p.y += p.vy;

    // კედლები
    if (p.x < 0 || p.x > canvas.width) p.vx *= -0.6;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -0.6;

    // წერტილი
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,1)";
    ctx.shadowColor = "rgba(0,255,255,0.8)";
    ctx.shadowBlur = 10;
    ctx.fill();
  });

  // ხაზები მხოლოდ FLOW რეჟიმში
  if (mode === "FLOW") {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0,255,255,${1 - d / 120})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  }

  // რეჟიმების ცვლა
  timer++;
  if (timer === 240) mode = "TEXT";
  if (timer === 420) mode = "DISPERSE";
  if (timer === 620) {
    mode = "FLOW";
    timer = 0;
  }

  requestAnimationFrame(animate);
}

// ტექსტის წერტილები
function generateTextPoints(text) {
  const temp = document.createElement("canvas");
  const tctx = temp.getContext("2d");

  temp.width = canvas.width;
  temp.height = canvas.height;

  tctx.fillStyle = "white";
  tctx.textAlign = "center";
  tctx.textBaseline = "middle";
  tctx.font = "bold 140px Arial";
  tctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const img = tctx.getImageData(0, 0, canvas.width, canvas.height);
  const points = [];

  for (let y = 0; y < canvas.height; y += 7) {
    for (let x = 0; x < canvas.width; x += 7) {
      const i = (y * canvas.width + x) * 4;
      if (img.data[i + 3] > 150) points.push({ x, y });
    }
  }
  return points;
}

animate();



