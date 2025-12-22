const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

// ეკრანის ზომის მორგება
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
  textPoints = generateTextPoints("MuYuDo");

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
let mode = "FLOW"; // FLOW | FORM_TEXT | DISPERSE
let textPoints = [];
let timer = 0;

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

    // --- მოძრაობის ლოგიკა ---
    if (mode === "FORM_TEXT" && textPoints[i]) {
      const tx = textPoints[i].x;
      const ty = textPoints[i].y;

      p.vx += (tx - p.x) * 0.01;
      p.vy += (ty - p.y) * 0.01;
    }
    else if (mode === "DISPERSE") {
      p.vx += (Math.random() - 0.5) * 0.5;
      p.vy += (Math.random() - 0.5) * 0.5;
    }
    else {
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 140) {
        p.vx += dx * 0.00002;
        p.vy += dy * 0.00002;
      }
    }

    // --- გადაადგილება (ერთხელ!) ---
    p.x += p.vx;
    p.y += p.vy;

    // --- კედლებზე შეჯახება ---
    if (p.x < 0 || p.x > canvas.width) p.vx *= -0.5;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -0.5;

    // --- წერტილი ---
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 255, 255, 1)";
    ctx.shadowColor = "rgba(0, 255, 255, 0.9)";
    ctx.shadowBlur = 12;
    ctx.fill();

    // --- ნეირონული ხაზები ---
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

  // --- ტაიმერი და რეჟიმები ---
  timer++;

  if (timer === 300) mode = "FORM_TEXT";
  if (timer === 600) mode = "DISPERSE";
  if (timer === 900) {
    mode = "FLOW";
    timer = 0;
  }

  requestAnimationFrame(animate);
}


function generateTextPoints(text) {
  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tctx.fillStyle = "white";
  tctx.textAlign = "center";
  tctx.textBaseline = "middle";
  tctx.font = "bold 120px Arial";

  tctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = tctx.getImageData(0, 0, canvas.width, canvas.height);
  const points = [];

  for (let y = 0; y < canvas.height; y += 6) {
    for (let x = 0; x < canvas.width; x += 6) {
      const index = (y * canvas.width + x) * 4;
      if (imageData.data[index + 3] > 128) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

// გაშვება
animate();
