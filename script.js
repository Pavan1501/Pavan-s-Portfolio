// Mobile Nav Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// Scroll Reveal Observer
const revealEls = document.querySelectorAll('.case, .skill-cat, .cert, .edu-row, .exp-card, .hl-box, .stat-list .item, .pipe-step');
revealEls.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){ 
      entry.target.classList.add('in'); 
      io.unobserve(entry.target); 
    }
  });
}, {threshold:0.06});
revealEls.forEach(el => io.observe(el));

// Interactive Particle Canvas (Signature Galaxy element)
const canvas = document.getElementById('galaxy');
const ctx = canvas.getContext('2d');
const heroEl = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let W, H, DPR;
function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = heroEl.clientWidth; H = heroEl.clientHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
resize();
window.addEventListener('resize', resize);

const COUNT = window.innerWidth < 700 ? 50 : 95;
let particles = [];

function initParticles(){
  particles = [];
  for(let i=0;i<COUNT;i++){
    const hx = Math.random()*W;
    const hy = Math.random()*H;
    particles.push({
      x:hx, y:hy, homeX:hx, homeY:hy,
      vx:(Math.random()-0.5)*0.16, vy:(Math.random()-0.5)*0.16,
      r: Math.random()*1.7 + 0.8,
      drift: Math.random()*Math.PI*2
    });
  }
}
initParticles();
window.addEventListener('resize', () => { initParticles(); });

function tick(){
  ctx.clearRect(0,0,W,H);

  particles.forEach(p => {
    p.drift += 0.0035;
    const tx = p.homeX + Math.sin(p.drift)*9;
    const ty = p.homeY + Math.cos(p.drift*0.8)*9;
    p.vx += (tx - p.x) * 0.002;
    p.vy += (ty - p.y) * 0.002;
    p.vx *= 0.94; p.vy *= 0.94;
    p.x += p.vx; p.y += p.vy;
  });

  particles.forEach(p => {
    const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3.5);
    grad.addColorStop(0,'rgba(210,225,255,0.9)');
    grad.addColorStop(1,'rgba(139,92,246,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r*3.5,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(238,241,251,0.95)';
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  });

  if(!reduceMotion) requestAnimationFrame(tick);
}

if(reduceMotion){
  tick();
} else {
  requestAnimationFrame(tick);
}
