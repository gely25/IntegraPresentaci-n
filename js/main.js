
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

  // ===== SECTION 5: MARKET MAP =====
  const initMarketSection = () => {
    // 1. Classify countries by name or class
    const litNames = ["India", "Saudi Arabia", "Republic of Korea", "Turkey", "United States"];
    const latamNames = ["Argentina", "Brazil", "Bolivia", "Chile", "Colombia", "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela", "Mexico", "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Cuba", "Dominican Republic", "Haiti", "Jamaica", "Belize", "French Guiana"];

    const paths = document.querySelectorAll('#worldMapSvg path');
    paths.forEach(p => {
      const name = p.getAttribute('name') || p.getAttribute('class');
      if (!name) return;
      
      const isLit = litNames.some(n => name.includes(n));
      const isLatam = latamNames.some(n => name.includes(n));

      if (isLit) p.classList.add('land-lit');
      else if (isLatam) p.classList.add('land-dim');
    });

    // 2. Tooltips
    const markers = document.querySelectorAll('.marker-group');
    if (!markers.length) return;

    let tooltip = document.querySelector('.map-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'map-tooltip';
      tooltip.innerHTML = '<h4 class="tt-title"></h4><div class="tt-platform"></div><div class="tt-limit"></div>';
      document.body.appendChild(tooltip);
    }
    const ttTitle = tooltip.querySelector('.tt-title');
    const ttPlatform = tooltip.querySelector('.tt-platform');
    const ttLimit = tooltip.querySelector('.tt-limit');

    const showTooltip = (e, target) => {
      const isLatam = target.dataset.country === 'latam';
      
      if (isLatam) {
        ttTitle.textContent = "Viabilidad Regulatoria (América Latina)";
        ttPlatform.style.display = 'none';
        ttLimit.innerHTML = `
          <div style="font-size: 11.5px; color: var(--text); margin-bottom: 0.8rem; line-height: 1.4;">Ningún país de la región tiene aún un proyecto blockchain documentado. Viabilidad regulatoria estimada para una futura expansión:</div>
          <ul class="latam-matrix-list">
            <li><span>Argentina</span> <span class="badge verde">ALTA</span></li>
            <li><span>Brasil</span> <span class="badge verde">ALTA</span></li>
            <li><span>México</span> <span class="badge amarillo">MEDIA</span></li>
            <li><span>Colombia</span> <span class="badge amarillo">MEDIA</span></li>
            <li><span>Chile</span> <span class="badge naranja">BAJA-MEDIA</span></li>
          </ul>
        `;
        tooltip.classList.add('tooltip-latam');
      } else if (target.dataset.dual === 'true') {
        // India: two projects
        ttTitle.textContent = target.dataset.title;
        ttPlatform.style.display = 'none';
        ttLimit.innerHTML = `
          <div class="tt-dual-project">
            <div class="tt-dual-name">Indriya (2023)</div>
            <div class="tt-dual-platform">Hyperledger Fabric / AWS · 389 TPS validados</div>
            <div class="tt-dual-limit">Prototipo académico completo. Sin integración IoT real ni plan de despliegue institucional.</div>
          </div>
          <div class="tt-dual-divider"></div>
          <div class="tt-dual-project">
            <div class="tt-dual-name">Organ Harbour (2024)</div>
            <div class="tt-dual-platform">Ethereum</div>
            <div class="tt-dual-limit">dApp de registro e integración hospitalaria. Sin ciberseguridad embebida, sin threat modeling.</div>
          </div>
        `;
        tooltip.classList.remove('tooltip-latam');
        tooltip.classList.add('tooltip-dual');
      } else {
        ttTitle.textContent = target.dataset.title;
        ttPlatform.textContent = target.dataset.platform;
        ttLimit.textContent = target.dataset.limit;
        ttPlatform.style.display = 'block';
        tooltip.classList.remove('tooltip-latam');
        tooltip.classList.remove('tooltip-dual');
      }
      
      tooltip.classList.add('visible');
      
      const rect = target.getBoundingClientRect();
      const ttRect = tooltip.getBoundingClientRect();
      let left = rect.left + rect.width / 2;
      let top = rect.top - ttRect.height - 15;
      
      if (left + ttRect.width / 2 > window.innerWidth - 20) {
        left = window.innerWidth - ttRect.width - 20;
      } else if (left - ttRect.width / 2 < 20) {
        left = 20;
      } else {
        left = left - ttRect.width / 2;
      }
      
      if (top < 20) top = rect.bottom + 15;
      
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const hideTooltip = () => tooltip.classList.remove('visible');

    markers.forEach(m => {
      m.addEventListener('mouseenter', (e) => showTooltip(e, m));
      m.addEventListener('mouseleave', hideTooltip);
      m.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showTooltip(e, m);
      }, {passive: false});
    });
    
    document.addEventListener('touchstart', (e) => {
      if (!e.target.closest('.marker-group')) {
        hideTooltip();
      }
    });
  };
  initMarketSection();


