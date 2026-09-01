
  // SHORT TITLES FOR THE 11 SECTIONS IN ECG MONITOR
  const sectionTitles = [
    "01. Portada",
    "02. El Problema",
    "03. 3 Desafíos",
    "04. La Propuesta",
    "05. Mercado",
    "06. Propuesta de Valor",
    "07. Roadmap",
    "08. Ciberseguridad",
    "09. Factibilidad",
    "10. Valor & Impacto",
    "11. Equipo & Cierre"
  ];

  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  let idx = 0;

  const ecgHeader = document.getElementById('ecgHeader');
  const ecgTrack = document.getElementById('ecgTrack');
  const ecgProgress = document.getElementById('ecgProgress');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideCountBadge = document.getElementById('slideCountBadge');

  // BUILD ECG TRACK NODES FOR THE 11 SECTIONS
  function buildEcgTrack() {
    sectionTitles.forEach((title, i) => {
      const node = document.createElement('button');
      node.className = 'ecg-node' + (i === 0 ? ' active' : '');
      node.setAttribute('aria-label', `Ir a sección ${title}`);
      
      // ECG Heartbeat Peak SVG
      node.innerHTML = `
        <svg class="ecg-node-svg" viewBox="0 0 44 22">
          <path d="M 0,14 L 14,14 L 18,2 L 22,20 L 26,8 L 30,14 L 44,14" />
        </svg>
        <div class="ecg-dot-wrapper">
          <div class="ecg-halo"></div>
          <div class="ecg-dot"></div>
        </div>
        <span class="ecg-label">${title}</span>
      `;
      
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
      });
      ecgTrack.appendChild(node);
    });
  }

  let prevIdx = 0; // track previous index for directional transitions

  function goToSlide(targetIdx) {
    if (targetIdx < 0 || targetIdx >= total || targetIdx === idx) return;
    prevIdx = idx;
    idx = targetIdx;
    render(targetIdx > prevIdx ? 'fwd' : 'back');
  }

  function render(direction) {
    /* SHARED-AXIS TRANSITION:
       direction='fwd'  → old slide exits LEFT,  new slide enters from RIGHT
       direction='back' → old slide exits RIGHT, new slide enters from LEFT
       No direction (initial load) → just show active with no exit animation */
    slides.forEach((s, i) => {
      s.classList.remove('active', 'exit-left', 'exit-right');
      if (i === idx) {
        s.classList.add('active');
      } else if (i < idx) {
        s.classList.add('exit-left');
      } else {
        s.classList.add('exit-right');
      }
    });

    // Update ECG Nodes state
    const nodes = ecgTrack.querySelectorAll('.ecg-node');
    nodes.forEach((node, i) => {
      node.classList.remove('active', 'visited');
      if (i === idx) {
        node.classList.add('active');
      } else if (i < idx) {
        node.classList.add('visited');
      }
    });

    // Update ECG Traversed Line
    const progressPercent = (idx / (total - 1)) * 100;
    ecgProgress.style.width = `calc(${progressPercent}% * 0.94)`;

    // Update Counter and Nav Buttons
    slideCountBadge.textContent = `${idx + 1} / ${total}`;
    prevBtn.disabled = (idx === 0);
    nextBtn.disabled = (idx === total - 1);

    if (idx === 1) animateCounts(slides[1]);
  }

  function animateCounts(slide) {
    slide.querySelectorAll('[data-count]').forEach(el => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      let n = 0;
      const step = Math.max(1, Math.round(target / 30));
      const iv = setInterval(() => {
        n += step;
        if (n >= target) { n = target; clearInterval(iv); }
        el.textContent = prefix + n + suffix;
      }, 25);
    });
  }

  // FRAMEWORK SUB-TABS (SECTION 8)
  function switchFwTab(tabId) {
    document.querySelectorAll('.fw-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.fw-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    const targetContent = document.getElementById(`fw-${tabId}`);
    if (targetContent) targetContent.classList.add('active');
  }

  // EVENT LISTENERS FOR BUTTONS AND KEYBOARD ARROWS
  prevBtn.addEventListener('click', () => { if (idx > 0) goToSlide(idx - 1); });
  nextBtn.addEventListener('click', () => { if (idx < total - 1) goToSlide(idx + 1); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { if (idx < total - 1) goToSlide(idx + 1); }
    if (e.key === 'ArrowLeft') { if (idx > 0) goToSlide(idx - 1); }
  });

  // INITIALIZE
  buildEcgTrack();
  render();


