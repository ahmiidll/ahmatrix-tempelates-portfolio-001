'use strict';

console.log('%cAhmatrix Tech', 'color:#f2d675;font-size:14px;font-weight:bold;');
console.log('Design & build: https://ahmatrix.netlify.app/');

function openLink(url){ window.open(url, '_blank', 'noopener'); }

// ── LOADER ──
const loaderTexts = ['Initializing','Loading assets','Building UI','Almost ready','Launching'];
let loaderPct = 0;
let loaderTxtIdx = 0;
const loaderBar = document.getElementById('loader-bar');
const loaderTxt = document.getElementById('loader-text');
const loaderEl = document.getElementById('loader');
function loaderStep(){
  loaderPct = Math.min(loaderPct + Math.random()*18 + 4, 100);
  loaderBar.style.width = loaderPct + '%';
  if(loaderPct > loaderTxtIdx*22 && loaderTxtIdx < loaderTexts.length-1){
    loaderTxtIdx++;
    loaderTxt.textContent = loaderTexts[loaderTxtIdx];
  }
  if(loaderPct < 100){ setTimeout(loaderStep, 120 + Math.random()*80); }
  else {
    setTimeout(()=>{
      loaderEl.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      loaderEl.style.opacity = '0';
      loaderEl.style.transform = 'scale(1.02)';
      setTimeout(()=>{ loaderEl.style.display='none'; loaderEl.setAttribute('aria-hidden','true'); }, 700);
    }, 300);
  }
}
setTimeout(loaderStep, 200);

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
const hasHover = window.matchMedia('(hover:hover)').matches;
let cx=0,cy=0,rx=0,ry=0;
if(hasHover){
  document.addEventListener('mousemove', e=>{
    cx=e.clientX; cy=e.clientY;
    cursor.style.left=cx+'px';
    cursor.style.top=cy+'px';
  });
  function animCursor(){
    rx += (cx-rx)*0.12;
    ry += (cy-ry)*0.12;
    cursorRing.style.left=rx+'px';
    cursorRing.style.top=ry+'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
}

// ── FLOATING DOCK ──
const floatDock = document.getElementById('float-dock');
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 100){ floatDock.classList.add('visible'); }
  else{ floatDock.classList.remove('visible'); }
}, {passive:true});
setTimeout(()=>floatDock.classList.add('visible'), 2500);

// ── SIDEBAR ──
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
sidebarBtn.addEventListener('click', ()=>{
  const isActive = sidebar.classList.toggle('active');
  sidebarBtn.setAttribute('aria-expanded', isActive);
});

// ── TESTIMONIALS MODAL ──
const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');
const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

const toggleModal = ()=>{
  modalContainer.classList.toggle('active');
  overlay.classList.toggle('active');
};

testimonialsItem.forEach(item=>{
  item.addEventListener('click', function(){
    modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
    modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
    modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
    modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;
    toggleModal();
  });
});
modalCloseBtn.addEventListener('click', toggleModal);
overlay.addEventListener('click', toggleModal);
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape' && modalContainer.classList.contains('active')) toggleModal();
});

// ── FILTER SELECT ──
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', ()=> select.classList.toggle('active'));

selectItems.forEach(item=>{
  item.addEventListener('click', function(){
    selectValue.textContent = this.textContent;
    select.classList.remove('active');
    filterFunc(this.textContent.toLowerCase());
  });
});

const filterItems = document.querySelectorAll('[data-filter-item]');

function filterFunc(val){
  filterItems.forEach((item)=>{
    const match = val==='all' || val===item.dataset.category;
    item.classList.toggle('active', match);
  });
}

let lastBtn = filterBtn[0];
filterBtn.forEach(btn=>{
  btn.addEventListener('click', function(){
    selectValue.textContent = this.textContent;
    filterFunc(this.textContent.toLowerCase());
    lastBtn.classList.remove('active');
    this.classList.add('active');
    lastBtn = this;
  });
});

// ── FORM VALIDATION (front-end only — wire to a real endpoint to actually send) ──
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');
const formStatus = document.querySelector('[data-form-status]');
formInputs.forEach(input=>{
  input.addEventListener('input', ()=>{
    formBtn.disabled = !form.checkValidity();
  });
});
form.addEventListener('submit', e=>{
  e.preventDefault();
  formStatus.textContent = 'This form needs a backend (e.g. Formspree, EmailJS, or your own API route) to actually deliver messages.';
  formStatus.classList.add('success');
});

// ── NAVIGATION ──
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navigationLinks.forEach((link, i)=>{
  link.addEventListener('click', function(){
    pages.forEach((page, j)=>{
      const match = this.textContent.trim().toLowerCase() === page.dataset.page;
      page.classList.toggle('active', match);
      navigationLinks[j].classList.toggle('active', match);
    });
    window.scrollTo({top:0, behavior:'smooth'});
    initReveal();
    if(this.textContent.trim().toLowerCase() === 'resume'){
      setTimeout(animateSkills, 600);
    }
  });
});

// ── REVEAL ON SCROLL ──
function initReveal(){
  const revealEls = document.querySelectorAll('[data-reveal]:not(.revealed)');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.1});
  revealEls.forEach(el=> observer.observe(el));
}

// ── SKILLS ANIMATION ──
function animateSkills(){
  const fills = document.querySelectorAll('.skill-progress-fill');
  fills.forEach(fill=>{
    fill.classList.add('animated');
  });
}

// ── 3D TILT CARDS ──
function initTilt(){
  if(!hasHover) return;
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });
}

// ── MAGNETIC BUTTONS ──
function initMagnetic(){
  if(!hasHover) return;
  const btns = document.querySelectorAll('.form-btn, .dock-btn');
  btns.forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width/2) * 0.25;
      const y = (e.clientY - rect.top - rect.height/2) * 0.25;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{
      btn.style.transform = '';
    });
  });
}

// ── AMBIENT MOUSE PARALLAX ──
function initAmbient(){
  if(!hasHover) return;
  const orbs = document.querySelectorAll('.amb-orb');
  document.addEventListener('mousemove', e=>{
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    orbs.forEach((orb, i)=>{
      const factor = (i+1)*18;
      orb.style.transform = `translate(${cx*factor}px,${cy*factor}px)`;
    });
  }, {passive:true});
}

initReveal();
initTilt();
initMagnetic();
initAmbient();