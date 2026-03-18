(() => {
  // Update this in ONE place (E.164 without "+", e.g. "919578315590")
  const CONTACT_PHONE_E164 = '919578315590';
  const WHATSAPP_PREFILL = 'Hi';

  const topBar = document.querySelector('.top-bar');
  const header = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');

  const initContactLinks = () => {
    const telHref = `tel:+${CONTACT_PHONE_E164}`;
    document.querySelectorAll('a[data-contact="call"]').forEach((a) => {
      a.setAttribute('href', telHref);
    });

    const waHref = `https://wa.me/${CONTACT_PHONE_E164}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;
    document.querySelectorAll('a[data-contact="whatsapp"]').forEach((a) => {
      a.setAttribute('href', waHref);
    });
  };

  const initFloatingContactAvoidFooter = () => {
    const floatEl = document.querySelector('.contact-float');
    const footerEl = document.querySelector('footer');
    if (!floatEl || !footerEl) return;

    const baseBottom = 16;
    let ticking = false;

    const update = () => {
      ticking = false;
      const footerRect = footerEl.getBoundingClientRect();
      const overlap = Math.max(0, window.innerHeight - footerRect.top);
      const extra = overlap > 0 ? overlap + 12 : 0;
      floatEl.style.bottom = `${baseBottom + extra}px`;
    };

    const schedule = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.requestAnimationFrame(update);
  };

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

  initContactLinks();
  initFloatingContactAvoidFooter();

  // Performance: default images to lazy-load unless explicitly set
  document.querySelectorAll('img:not([loading])').forEach((img) => {
    img.loading = 'lazy';
  });
})();

// Handle enrollment form submission and open a professional email draft
function handleEnrollSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('enroll-form');
  const feedback = document.getElementById('enroll-feedback');
  const submitBtn = form?.querySelector('button[type="submit"]');
  const hideAfterMs = 5500;

  if (!form || !feedback || !submitBtn) return;

  const setLoading = (loading) => {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Sending...' : 'Submit';
  };

  let hideTimer = window.__enrollFeedbackTimer;
  if (hideTimer) window.clearTimeout(hideTimer);

  const showFeedback = (type, message) => {
    feedback.classList.remove('success', 'error', 'show');
    feedback.textContent = message;
    feedback.classList.add(type);
    // trigger transition
    window.requestAnimationFrame(() => feedback.classList.add('show'));

    window.__enrollFeedbackTimer = window.setTimeout(() => {
      feedback.classList.remove('show');
      window.setTimeout(() => {
        feedback.classList.remove('success', 'error');
        feedback.textContent = '';
      }, 240);
    }, hideAfterMs);
  };

  setLoading(true);

  const parentName = document.getElementById('parent-name').value.trim();
  const childName = document.getElementById('child-name').value.trim();
  const parentPhone = document.getElementById('parent-phone').value.trim();
  const parentEmail = document.getElementById('parent-email').value.trim();
  const playGroup = document.getElementById('play-group').value;

  const toEmail = 'deveshwars1905@gmail.com';
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

  try {
    const opened = window.open(mailtoLink, '_blank');
    if (opened === null) {
      throw new Error('Popup blocked');
    }

    form.reset();
    setLoading(false);
    showFeedback('success', 'Thank you! Your enquiry has been submitted successfully. We will contact you soon.');
  } catch (e) {
    setLoading(false);
    showFeedback('error', 'Something went wrong. Please try again or contact us directly.');
  }
}

