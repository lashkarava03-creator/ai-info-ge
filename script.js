const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ===== SETTINGS =====
const PARTICLE_COUNT = 220;
const TEXT = "AI";
const FORM_SPEED = 0.08;
const FLOAT_SPEED = 0.4;

// ===== STATE =====
let mode = "FLOAT"; // FLOAT | FORM | DISPERSE
let timer = 0;
let textPoints = [];

// ===== PARTICLES =====
const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * FLOAT_SPEED,
    vy: (Math.random() - 0.5) * FLOAT_SPEED,
    r: 2
  });
}

// ===== TEXT POINTS =====
function generateTextPoints(text) {
  const temp = document.createElement("canvas");
  const tctx = temp.getContext("2d");

  temp.width = canvas.width;
  temp.height = canvas.height;

  tctx.fillStyle = "white";
  tctx.textAlign = "center";
  tctx.textBaseline = "middle";
  tctx.font = "bold 160px Arial";
  tctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const data = tctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const points = [];

  for (let y = 0; y < canvas.height; y += 6) {
    for (let x = 0; x < canvas.width; x += 6) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 150) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

textPoints = generateTextPoints(TEXT);

// ===== ANIMATION LOOP =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    if (mode === "FORM" && textPoints[i]) {
      p.x += (textPoints[i].x - p.x) * FORM_SPEED;
      p.y += (textPoints[i].y - p.y) * FORM_SPEED;
    } else {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,1)";
    ctx.shadowColor = "rgba(0,255,255,0.9)";
    ctx.shadowBlur = 10;
    ctx.fill();
  });

  timer++;

  if (timer === 180) mode = "FORM";      // AI იკრიბება
  if (timer === 420) mode = "DISPERSE";  // იფანტება
  if (timer === 520) mode = "FLOAT";     // თავისუფალი მოძრაობა
  if (timer > 700) timer = 0;

  requestAnimationFrame(animate);
}

animate();
const aiText = document.getElementById("ai-dynamic-text");

const aiDescriptions = {
  "AI ანალიტიკა": "მონაცემების ანალიზი, პროგნოზები და გადაწყვეტილებები რეალურ დროში",
  "AI მარკეტინგი": "კლიენტის ქცევის ანალიზი და შედეგზე ორიენტირებული კამპანიები",
  "AI ავტომატიზაცია": "პროცესების ავტომატიზაცია ნაკლები ხარჯით და მეტი სიჩქარით",
  "AI კრეატივი": "იდეების გენერაცია, დიზაინი და კონტენტი ხელოვნური ინტელექტით",
  "AI ბიზნესი": "ბიზნეს გადაწყვეტილებები AI სტრატეგიებზე დაფუძნებით",
  "AI სწავლა": "ცოდნის მიღება და განვითარება AI დახმარებით"
};

document.querySelectorAll(".ai-block").forEach(block => {
  block.addEventListener("click", e => {
    e.preventDefault();

    const label = block.querySelector(".ai-label").innerText;

    aiText.style.opacity = 0;

    setTimeout(() => {
      aiText.innerText = aiDescriptions[label];
      aiText.style.opacity = 1;
    }, 200);
  });
});
.ai-section-title {
  position: relative;
  margin-top: 22px;      /* დაშორება AI წერტილებიდან */
  margin-bottom: 26px;   /* დაშორება კუბიკებამდე */
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: #eaffff;
  z-index: 4;

  /* ფონზე გამოკვეთა */
  display: inline-block;
  padding: 8px 16px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  text-shadow: 0 0 8px rgba(0,255,255,0.35);
}
