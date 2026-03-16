(() => {
  const topBar = document.querySelector('.top-bar');
  const header = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');

  const setHeaderOffsets = () => {
    const topBarH = topBar ? Math.ceil(topBar.getBoundingClientRect().height) : 0;
    const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--topbar-h', `${topBarH}px`);
    document.documentElement.style.setProperty('--header-h', `${headerH}px`);
  };

  const isDesktopNav = () => window.matchMedia('(min-width: 901px)').matches;

  const setMenuOpen = (open) => {
    if (!hamburger || !navMenu) return;

    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    navMenu.classList.toggle('open', open);
    navBackdrop?.classList.toggle('open', open);
    if (navBackdrop) navBackdrop.hidden = !open;

    if (!open) {
      hamburger.focus({ preventScroll: true });
    }
  };

  const toggleMenu = () => {
    const expanded = hamburger?.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!expanded);
  };

  // Hamburger interactions
  hamburger?.addEventListener('click', toggleMenu);
  navBackdrop?.addEventListener('click', () => setMenuOpen(false));

  // Close menu on link click (mobile)
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!isDesktopNav()) setMenuOpen(false);
    });
  });

  // Escape closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (hamburger?.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
    }
  });

  // Shrink Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });

  // Scroll Reveal Elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Keep CSS offsets correct as bar/header wrap on small screens.
  window.addEventListener('resize', () => {
    setHeaderOffsets();

    // Ensure drawer state doesn't stick across breakpoints
    if (isDesktopNav()) {
      navBackdrop?.classList.remove('open');
      navMenu?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });

  // Initial pass after layout
  window.requestAnimationFrame(() => {
    setHeaderOffsets();
  });
})();

// Handle enrollment form submission and open a professional email draft
function handleEnrollSubmit(event) {
  event.preventDefault();

  const parentName = document.getElementById('parent-name').value.trim();
  const childName = document.getElementById('child-name').value.trim();
  const parentPhone = document.getElementById('parent-phone').value.trim();
  const parentEmail = document.getElementById('parent-email').value.trim();
  const playGroup = document.getElementById('play-group').value;

  const toEmail = 'Starbellkids@gmail.com';
  const subject = encodeURIComponent(`Application for Admission - ${childName || 'Child'} (${playGroup})`);

  const bodyText = `
Dear Starbell Kids Admissions Team,

I would like to submit an application for my child to join ${playGroup} at Starbell Kids Playschool.

Child's Name: ${childName}
Parent's Name: ${parentName}
Parent's Contact Number: ${parentPhone}
Parent's Email ID: ${parentEmail}

Kindly let us know the next steps in the admission process. I look forward to hearing from you.

Warm regards,
${parentName}
${parentPhone}
${parentEmail}
`;

  const body = encodeURIComponent(bodyText.trim());
  const mailtoLink = `mailto:${toEmail}?subject=${subject}&body=${body}`;

  window.location.href = mailtoLink;
}

