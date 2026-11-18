/* =====================================================
   交互逻辑 —— 门禁 / 场景 / 打字机 / 彩纸 / 吹蜡烛 / 翻信 / 转球
   ===================================================== */

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);

/* ---------- 1. 门禁倒计时 ---------- */
const unlockTime = new Date(CONFIG.unlockISO).getTime();
const isPreview = params.has("preview");
const unlockedBefore = localStorage.getItem("yiro-unlocked") === "1";

function fillSite() {
  // 开场 & 主角
  $("#intro-sub").textContent = SCENES.introSub;
  $("#start-btn").textContent = SCENES.enterBtn;
  $("#hero-tag").textContent = SCENES.heroTag;
  $("#hero-line").textContent = SCENES.heroLine;

  // 时光轴
  $("#tl-list").innerHTML = TIMELINE.map(
    (t) => `<div class="tl-item" style="--dot:${t.color}">
      <span class="tl-year">${t.year}</span>
      <h3 class="tl-title">${t.title}</h3>
      <p class="tl-text">${t.text}</p>
    </div>`
  ).join("");

  // 信
  $("#letter-cover").textContent = LETTER.cover;
  $("#letter-cover-sub").textContent = LETTER.coverSub;
  $("#letter-paper").innerHTML =
    LETTER.paragraphs.map((p) => `<p>${p}</p>`).join("") +
    `<p class="sign">${LETTER.sign}</p>`;

  // 球
  const wheel = $("#orb-wheel");
  const n = ORBS.length;
  const step = 360 / n;
  const mobile = window.innerWidth < 560;
  const radius = mobile ? 205 : 330;
  wheel.innerHTML = ORBS.map((o, i) => {
    const face = o.photo
      ? `<img src="${o.photo}" alt="回忆${i + 1}">`
      : `<span style="filter:saturate(1.2)">🎲</span>`;
    const colorStyle = o.photo ? "" : `style="background:${o.color || "linear-gradient(135deg,#B39DDB,#4FC3F7)"}"`;
    return `<div class="orb ${o.photo ? "" : "is-color"}" data-i="${i}"
      ${colorStyle}
      style="transform: rotateY(${i * step}deg) translateZ(${radius}px)">
      ${face}<span class="orb-tag">${o.tag}</span>
    </div>`;
  }).join("");

  // 尾声
  $("#finale-lines").textContent = FINALE.lines.join("\n");
  $("#finale-footer").textContent = FINALE.footer;
  $("#firework-btn").textContent = FINALE.firework;
}

function showSite() {
  localStorage.setItem("yiro-unlocked", "1");
  $("#gate").hidden = true;
  const site = $("#site");
  site.hidden = false;
  fillSite();
  initReveal();
  initLetter();
  initOrbs();
  setTimeout(() => burstAt(window.innerWidth / 2, window.innerHeight / 3, 160), 500);
}

function initGate() {
  const tick = () => {
    const diff = unlockTime - Date.now();
    if (diff <= 0) { clearInterval(timer); showSite(); return; }
    const s = Math.floor(diff / 1000);
    $("#gc-d").textContent = Math.floor(s / 86400);
    $("#gc-h").textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
    $("#gc-m").textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    $("#gc-s").textContent = String(s % 60).padStart(2, "0");
  };
  const timer = setInterval(tick, 1000);
  tick();
}

if (isPreview || unlockedBefore || Date.now() >= unlockTime) {
  showSite();
  if (isPreview && Date.now() < unlockTime && !unlockedBefore) {
    localStorage.removeItem("yiro-unlocked");
  }
} else {
  initGate();
}

/* ---------- 2. 彩纸 ---------- */
const cvs = $("#confetti-canvas");
const ctx = cvs.getContext("2d");
let pieces = [];
function resizeCvs() { cvs.width = innerWidth; cvs.height = innerHeight; }
resizeCvs();
addEventListener("resize", resizeCvs);
const COLORS = ["#FF6B9D", "#FFD93D", "#FF9F43", "#4FC3F7", "#6CE5A3", "#B39DDB"];

function burstAt(x, y, count = 120) {
  for (let i = 0; i < count; i++) {
    pieces.push({
      x, y,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 8 + 4,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
    });
  }
}
(function loopCvs() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  pieces = pieces.filter((p) => p.life > 0 && p.y < cvs.height + 40);
  for (const p of pieces) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.vx *= 0.99;
    p.rot += p.vr; p.life -= 0.006;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }
  requestAnimationFrame(loopCvs);
})();

/* ---------- 3. 滚动 reveal + 打字机 + 自动烟花 ---------- */
function initReveal() {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
    { threshold: 0.25 }
  );
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  // 时光轴逐条
  const io2 = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
    { threshold: 0.2 }
  );
  document.querySelectorAll(".tl-item").forEach((el) => io2.observe(el));

  // hero 打字机（触发一次）
  const typedEl = $("#typed");
  let typedStarted = false;
  const ioType = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting && !typedStarted) {
        typedStarted = true;
        typeText(typedEl, SCENES.typed, 200);
        ioType.disconnect();
      }
    });
  }, { threshold: 0.4 });
  ioType.observe($("#hero"));

  // finale 进入自动放一次烟花
  let fired = false;
  const ioF = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting && !fired) {
        fired = true;
        burstAt(window.innerWidth / 2, window.innerHeight / 3, 140);
        ioF.disconnect();
      }
    });
  }, { threshold: 0.5 });
  ioF.observe($("#finale"));
}

function typeText(el, text, speed) {
  el.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(t);
  }, speed);
}

/* ---------- 4. 吹蜡烛 ---------- */
let blown = false;
function buildCandles() {
  $("#candles").innerHTML = `<div class="candle"><div class="flame"></div></div>`.repeat(3);
}
function blowOut() {
  if (blown) return;
  blown = true;
  document.querySelectorAll(".candle").forEach((c) => c.classList.add("out"));
  $("#candle-hint").textContent = CANDLE.done;
  const r = $("#cake").getBoundingClientRect();
  burstAt(r.left + r.width / 2, r.top + 40, 180);
  setTimeout(() => burstAt(r.left + r.width / 2, r.top + 60, 120), 300);
}

function initCandle() {
  buildCandles();
  $("#candle-title").textContent = CANDLE.title;
  $("#candle-hint").textContent = CANDLE.micHint;
  $("#candle-click-hint").parentElement.innerHTML =
    `麦克风害羞的话，直接点 <b onclick="blowOut()">点蜡烛</b>`;
  document.querySelectorAll(".candle").forEach((c) =>
    c.addEventListener("click", blowOut)
  );

  $("#mic-btn").addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = actx.createAnalyser();
      analyser.fftSize = 512;
      actx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      let loud = 0;
      $("#mic-btn").textContent = "🎤 听到了，吹吧！";
      (function loop() {
        if (blown) { stream.getTracks().forEach((t) => t.stop()); return; }
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) { const d = (v - 128) / 128; sum += d * d; }
        const rms = Math.sqrt(sum / buf.length);
        $("#mic-fill").style.width = Math.min(100, rms * 320) + "%";
        loud = rms > 0.22 ? loud + 1 : Math.max(0, loud - 2);
        if (loud > 10) blowOut(); else requestAnimationFrame(loop);
      })();
    } catch (e) {
      $("#mic-btn").textContent = "🎤 拿不到麦克风，点蜡烛吧";
    }
  });
}
initCandle();

/* ---------- 5. 3D 翻信 ---------- */
function initLetter() {
  $("#letter").addEventListener("click", () => {
    $("#letter").classList.toggle("open");
    if ($("#letter").classList.contains("open")) {
      burstAt(window.innerWidth / 2, window.innerHeight / 2.2, 80);
    }
  });
}

/* ---------- 6. 回忆转球 ---------- */
function initOrbs() {
  const wheel = $("#orb-wheel");
  wheel.classList.add("auto");
  let dragging = false, lastX = 0, vel = 0, manual = 0, autoT = null;

  const pauseAuto = () => {
    wheel.classList.remove("auto");
    wheel.style.animation = "none";
    clearTimeout(autoT);
    autoT = setTimeout(() => {
      if (!dragging) {
        const deg = ((manual % 360) + 360) % 360;
        wheel.style.transform = "";
        wheel.style.animation = `wheel-spin 26s linear ${-(deg / 360) * 26}s infinite`;
      }
    }, 3500);
  };

  // 拖拽旋转（不用 setPointerCapture，否则 click 目标会变成 wrap，球永远点不中）
  const wrap = $(".orb-wheel-wrap");
  wrap.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX; vel = 0;
    pauseAuto();
  });
  addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    vel = dx;
    manual += dx * 0.4;
    wheel.style.transform = `rotateY(${manual}deg)`;
  });
  addEventListener("pointerup", () => { dragging = false; });
  addEventListener("pointercancel", () => { dragging = false; });

  // 惯性
  (function inertia() {
    if (!dragging && Math.abs(vel) > 0.4) {
      manual += vel; vel *= 0.94;
      wheel.style.transform = `rotateY(${manual}deg)`;
    }
    requestAnimationFrame(inertia);
  })();

  // 点击球 → 弹窗
  const modal = $("#orb-modal");
  wrap.addEventListener("click", (e) => {
    if (Math.abs(vel) > 2) return;
    const orb = e.target.closest(".orb");
    if (!orb) return;
    const o = ORBS[+orb.dataset.i];
    $("#om-photo").innerHTML = o.photo ? `<img src="${o.photo}">` : "🎲";
    if (!o.photo) $("#om-photo").style.background = o.color || "";
    else $("#om-photo").style.background = "";
    $("#om-tag").textContent = o.tag;
    $("#om-text").textContent = o.text;
    modal.hidden = false;
    burstAt(window.innerWidth / 2, window.innerHeight / 2, 60);
  });
  $("#orb-modal-close").addEventListener("click", () => (modal.hidden = true));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });
}

/* ---------- 7. 开始按钮 & 尾声烟花 ---------- */
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "start-btn") {
    $("#hero").scrollIntoView({ behavior: "smooth" });
    burstAt(window.innerWidth / 2, window.innerHeight / 2, 100);
  }
  if (e.target && e.target.id === "firework-btn") {
    for (let i = 0; i < 5; i++) {
      setTimeout(() =>
        burstAt(
          window.innerWidth * (0.15 + Math.random() * 0.7),
          window.innerHeight * (0.15 + Math.random() * 0.4),
          140
        ), i * 260);
    }
  }
});
