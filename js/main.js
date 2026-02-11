/* ============================================
   UPSCALL - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initIntroSplash();
  initLoader();
  initParticles();
  initScrollAnimations();
  initHeader();
  initCounters();
  initContactForm();
  initSmoothScroll();
  initCursorGlow();
  initTextReveal();
  initDisableRightClick();
  initTiltCards();
  initParallax();
  init3DPhoneTilt();
  initChatAgent();
});

/* --- Intro Splash Screen --- */
function initIntroSplash() {
  const splash = document.getElementById('intro-splash');
  if (!splash) return;

  // Only show on first visit this session
  if (sessionStorage.getItem('upscall-intro-seen')) {
    splash.remove();
    return;
  }

  sessionStorage.setItem('upscall-intro-seen', '1');

  // Show text, then split after delay
  setTimeout(() => {
    splash.classList.add('split');
  }, 2000);

  // Remove from DOM after animation
  setTimeout(() => {
    splash.classList.add('gone');
    splash.remove();
  }, 3000);
}

/* --- Disable Right Click --- */
function initDisableRightClick() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
}

/* --- Page Loader --- */
function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.add('page-loaded');
      triggerEntryAnimations();
    }, 1800);
  });

  // Fallback
  setTimeout(() => {
    loader.classList.add('loaded');
    document.body.classList.add('page-loaded');
    triggerEntryAnimations();
  }, 3500);
}

function triggerEntryAnimations() {
  const heroElements = document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-right, .hero .reveal-scale');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, i * 120);
  });
}

/* --- Particle System --- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -1000;
  let mouseY = -1000;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.targetOpacity = this.opacity;
      this.pulseSpeed = Math.random() * 0.01 + 0.005;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.x += this.speedX;
      this.y += this.speedY;

      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x -= (dx / dist) * force * 0.8;
        this.y -= (dy / dist) * force * 0.8;
        this.targetOpacity = 0.6;
      } else {
        this.targetOpacity = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15 + 0.25;
      }

      this.opacity += (this.targetOpacity - this.opacity) * 0.05;

      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 166, 120, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  let time = 0;

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const opacity = (1 - dist / 140) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201, 166, 120, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time++;

    particles.forEach(p => {
      p.update(time);
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();

  // Performance monitor
  let lastTime = performance.now();
  let frameCount = 0;
  function checkPerformance() {
    const now = performance.now();
    frameCount++;
    if (now - lastTime >= 2000) {
      const fps = (frameCount * 1000) / (now - lastTime);
      if (fps < 30 && particles.length > 30) {
        particles = particles.slice(0, Math.floor(particles.length * 0.7));
      }
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(checkPerformance);
  }
  checkPerformance();
}

/* --- Scroll Reveal Animations --- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
}

/* --- Header Scroll Effect --- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --- Counter Animation --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    let isValid = true;

    const name = form.querySelector('#name');
    if (name && name.value.trim().length < 2) {
      showError(name, 'Please enter your name');
      isValid = false;
    }

    const email = form.querySelector('#email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }

    const phone = form.querySelector('#phone');
    if (phone && phone.value.trim() && phone.value.trim().length < 7) {
      showError(phone, 'Please enter a valid phone number');
      isValid = false;
    }

    const service = form.querySelector('#service');
    if (service && !service.value) {
      showError(service, 'Please select a service');
      isValid = false;
    }

    const message = form.querySelector('#message');
    if (message && message.value.trim().length < 10) {
      showError(message, 'Please enter a message (at least 10 characters)');
      isValid = false;
    }

    if (isValid) {
      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Sending...';

      // Send form data via FormSubmit.co
      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          form.style.display = 'none';
          const success = document.querySelector('.form-success');
          if (success) {
            success.classList.add('show');
            triggerCelebration();
          }
        } else {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <span class="btn-arrow">&rarr;</span>';
          alert('Something went wrong. Please try again or email us directly at hello@upscall.com');
        }
      })
      .catch(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <span class="btn-arrow">&rarr;</span>';
        alert('Could not send message. Please try again or email us directly at hello@upscall.com');
      });
    }
  });

  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });
}

function showError(input, message) {
  const group = input.closest('.form-group');
  group.classList.add('error');
  const errorEl = group.querySelector('.form-error');
  if (errorEl) errorEl.textContent = message;
}

function triggerCelebration() {
  const colors = ['#C9A678', '#D4A574', '#B8955F', '#f0ede8', '#ffffff'];

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.classList.add('celebration-particle');
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = Math.random() * window.innerHeight * 0.5 + 'px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const size = (Math.random() * 10 + 4) + 'px';
      particle.style.width = size;
      particle.style.height = size;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1500);
    }, i * 30);
  }
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* --- Cursor Glow Effect --- */
function initCursorGlow() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201, 166, 120, 0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* --- Text Reveal Animation --- */
function initTextReveal() {
  const textElements = document.querySelectorAll('.text-reveal');
  if (!textElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll('.word');
        words.forEach((word, i) => {
          setTimeout(() => {
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  textElements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    text.split(' ').forEach(w => {
      const span = document.createElement('span');
      span.classList.add('word');
      span.textContent = w + ' ';
      span.style.cssText = 'display: inline-block; opacity: 0; transform: translateY(15px); transition: all 0.4s ease;';
      el.appendChild(span);
    });
    observer.observe(el);
  });
}

/* --- 3D Tilt Cards --- */
function initTiltCards() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const cards = document.querySelectorAll('.service-card, .package-card, .value-card, .team-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s ease';

      // Shine effect
      const shine = card.querySelector('.card-shine') || createShine(card);
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(201, 166, 120, 0.08) 0%, transparent 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      const shine = card.querySelector('.card-shine');
      if (shine) shine.style.background = 'transparent';
    });
  });
}

function createShine(card) {
  const shine = document.createElement('div');
  shine.classList.add('card-shine');
  shine.style.cssText = `
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
    transition: background 0.2s ease;
  `;
  card.style.position = 'relative';
  card.appendChild(shine);
  return shine;
}

/* --- Parallax Effect --- */
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  const shapes = document.querySelectorAll('.shape-3d');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    orbs.forEach((orb, i) => {
      const speed = 0.02 + (i * 0.01);
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });

    shapes.forEach((shape, i) => {
      const speed = 0.03 + (i * 0.015);
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // Mouse parallax for 3D shapes
  if (!window.matchMedia('(max-width: 768px)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      shapes.forEach((shape, i) => {
        const depth = 10 + i * 8;
        shape.style.transform += ` translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }
}

/* --- 3D Phone Interactive Tilt (disabled — phone is static) --- */
function init3DPhoneTilt() {
  // Phone is now static with 3D depth via CSS — no interactive tilt
}

/* --- Page Transition --- */
document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
  if (link.hostname === window.location.hostname || !link.hostname) {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      e.preventDefault();

      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';

      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  }
});

/* --- Fade in on page load --- */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.4s ease';
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

/* --- Button ripple --- */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty('--ripple-x', x + 'px');
    this.style.setProperty('--ripple-y', y + 'px');
  });
});

/* ============================================
   AI SUPPORT CHAT AGENT
   ============================================ */
function initChatAgent() {
  const widget = document.getElementById('chat-widget');
  const toggle = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('chat-close');
  const messages = document.getElementById('chat-messages');
  const emailGate = document.getElementById('chat-email-gate');
  const emailForm = document.getElementById('chat-email-form');
  const emailInput = document.getElementById('chat-email-input');
  const inputArea = document.getElementById('chat-input-area');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  if (!widget || !toggle) return;

  let isOpen = false;
  let userEmail = '';
  let userName = '';
  let conversationStarted = false;
  let msgCount = 0;
  let topicsDiscussed = [];
  let lastTopic = '';
  let askedAboutBusiness = false;
  let userBusiness = '';

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // Toggle open/close
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    widget.classList.toggle('open', isOpen);
    if (isOpen && !conversationStarted) {
      addBotMessage("Hey! I'm the Upscall AI — think of me as your marketing advisor. Drop your email below and let's chat.");
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    widget.classList.remove('open');
  });

  // Email submission
  emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    userEmail = email;
    userName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    emailGate.style.display = 'none';
    inputArea.style.display = 'block';
    conversationStarted = true;

    addBotMessage("Nice to meet you, " + userName + "! Before we dive in — what kind of business do you run? That way I can give you more relevant advice.");
    chatInput.focus();
  });

  // Chat message submission
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value = '';
    msgCount++;
    showTyping();

    // Variable typing delay for realism
    const delay = 600 + Math.random() * 1000 + Math.min(text.length * 10, 500);
    setTimeout(() => {
      removeTyping();
      const response = generateResponse(text);
      addBotMessage(response);

      // Follow-up questions after certain messages
      if (msgCount === 3 && !askedAboutBusiness && !userBusiness) {
        setTimeout(() => {
          showTyping();
          setTimeout(() => {
            removeTyping();
            addBotMessage("By the way — what's your biggest marketing challenge right now? I'd love to point you in the right direction.");
          }, 800);
        }, 1500);
      }
    }, delay);
  });

  function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', 'bot');
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', 'user');
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.classList.add('chat-typing');
    typing.id = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('chat-typing');
    if (typing) typing.remove();
  }

  function trackTopic(topic) {
    if (!topicsDiscussed.includes(topic)) topicsDiscussed.push(topic);
    lastTopic = topic;
  }

  function suggestNext() {
    const suggestions = [];
    if (!topicsDiscussed.includes('packages')) suggestions.push('our packages');
    if (!topicsDiscussed.includes('services')) suggestions.push('what services we offer');
    if (!topicsDiscussed.includes('process')) suggestions.push('how our process works');
    if (!topicsDiscussed.includes('results')) suggestions.push('the kind of results we deliver');
    if (!topicsDiscussed.includes('pricing')) suggestions.push('pricing & flexibility');
    if (suggestions.length === 0) return '';
    return ' Want to hear about ' + pick(suggestions) + '?';
  }

  // AI Response logic — conversational with follow-ups
  function generateResponse(input) {
    const lower = input.toLowerCase();

    // Detect if user is telling us about their business
    if (!userBusiness && msgCount <= 3 && !askedAboutBusiness && lower.length > 10 && !/package|price|service|how|what|who|when|where/.test(lower)) {
      userBusiness = input;
      askedAboutBusiness = true;
      return pick([
        "Oh interesting — " + input.split(' ').slice(0, 4).join(' ') + "... that's cool! We've worked with businesses like yours before. What are you looking to improve — more leads, better brand presence, or scaling your marketing?",
        "Love that! We've helped similar businesses grow significantly. Are you currently running any marketing, or starting from scratch? That'll help me recommend the right package for you.",
        "That's awesome, " + userName + ". Based on that, I think we could do a lot together. What's your biggest goal right now — getting more customers, building your brand, or something else?"
      ]);
    }

    // Greetings
    if (/^(hi|hello|hey|sup|yo|what'?s up|good morning|good evening|good afternoon|hola)/.test(lower)) {
      return pick([
        "Hey " + userName + "! Good to have you here. What's on your mind — curious about our services, or looking for something specific?",
        "Hey! What can I help you figure out today? I can break down our packages, talk strategy, or answer any questions you have.",
        "Hello! I'm here to help. Are you exploring marketing options, or do you already have something specific in mind?"
      ]);
    }

    // Packages / pricing
    if (/package|plan|pricing|price|cost|how much|tier|silver|gold|diamond|afford|budget/.test(lower)) {
      trackTopic('packages');
      trackTopic('pricing');

      if (/silver|starter|basic|cheap|small/.test(lower)) {
        return "The Silver package is our starter tier — social media management, basic SEO, Google Business Profile, content calendar, analytics, and email support. It's perfect if you're just getting started with professional marketing." + (userBusiness ? " For a " + userBusiness.split(' ').slice(0, 3).join(' ') + " business, this could be a great foundation." : "") + " Want to compare it with Gold?";
      }
      if (/gold|accelerator|mid|popular|recommend/.test(lower)) {
        return "Gold is our most popular — and honestly what I'd recommend for most growing businesses. You get everything in Silver PLUS paid ad management across Meta & Google, professional content creation, email marketing automation, landing pages, bi-weekly strategy calls, and a dedicated account manager. It's the sweet spot." + suggestNext();
      }
      if (/diamond|elite|premium|top|best|full|everything/.test(lower)) {
        return "Diamond is the full partnership experience. Everything in Gold plus full-funnel strategy, advanced analytics dashboards, video production, influencer partnerships, CRM integration, weekly strategy sessions, and 24/7 priority support. This is for businesses ready to go all in." + suggestNext();
      }
      if (/compare|difference|which|between/.test(lower)) {
        return "Here's the quick breakdown: Silver = foundations & organic growth. Gold = Silver + paid ads, content creation, and a dedicated manager. Diamond = Gold + video, influencers, advanced analytics, and weekly strategy sessions. Which sounds closest to what you need?";
      }
      return "We've got three tiers: Silver (Starter) for small businesses, Gold (Accelerator) for growing brands — that's our most popular — and Diamond (Elite) for the full premium experience. Each one scales with you, no lock-in contracts. Which one sounds interesting?";
    }

    // Services
    if (/service|what do you (do|offer)|help with|marketing|seo|social media|content|ads|advertising|lead|brand/.test(lower)) {
      trackTopic('services');
      if (/seo|search engine|rank|google rank/.test(lower)) {
        return "SEO is huge for long-term growth. We handle technical SEO, on-page optimization, content strategy, and local SEO. Most clients see noticeable ranking improvements within 60-90 days. Are you getting any organic traffic right now?";
      }
      if (/social media|instagram|tiktok|facebook|linkedin/.test(lower)) {
        return "We manage the full social media lifecycle — strategy, content creation, scheduling, community management, and paid social ads. We're active on Instagram, TikTok, Facebook, LinkedIn, and more. Which platforms are most important for your business?";
      }
      if (/ads|advertising|paid|ppc|google ads|meta ads/.test(lower)) {
        return "Paid ads are one of our specialties. We run campaigns across Google Ads and Meta (Facebook/Instagram), with full targeting, A/B testing, and ongoing optimization. What's your current monthly ad budget, roughly? That'll help me suggest the right approach.";
      }
      if (/lead|generation|leads|customers/.test(lower)) {
        return "Lead gen is at the core of what we do. We build funnels that combine paid ads, landing pages, email sequences, and retargeting to turn strangers into customers. What does your current lead flow look like?";
      }
      return pick([
        "We cover six core areas: Growth Strategy, Digital Marketing, Brand Development, Lead Generation, Web & Creative, and Content & Social Media. Everything's data-driven — we don't guess, we measure. Which of those interests you most?",
        "Think of us as your outsourced marketing department. Strategy, ads, content, design, SEO, lead gen — we handle it all so you can focus on running your business. What area is most important to you right now?"
      ]);
    }

    // Process / how it works
    if (/process|how (do you|does it) work|steps|approach|method|onboard/.test(lower)) {
      trackTopic('process');
      return "It's a 4-step process: 1) Discover — we learn everything about your business, audience, and goals. 2) Strategize — we build a custom game plan. 3) Execute — our team launches campaigns and creates content. 4) Optimize — we analyze, test, and continuously improve. The whole onboarding takes about a week. Does that sound like what you're looking for?";
    }

    // Results / ROI
    if (/result|roi|how fast|how long|timeline|expect|proof|case stud/.test(lower)) {
      trackTopic('results');
      return pick([
        "Most clients see measurable improvements within 30-60 days, and significant growth compounds over 3-6 months. We track everything with transparent dashboards so you always know your ROI. What metrics matter most to you — leads, revenue, brand awareness?",
        "We're all about measurable results. Our average client sees a 3x ROI increase. We'll never hide behind vanity metrics — you'll get clear reports showing exactly what's working and what we're optimizing. Want to hear about a specific type of result?"
      ]);
    }

    // Contact / get started
    if (/contact|get started|start|sign up|reach out|talk|call|meeting|consultation|book|schedule|demo/.test(lower)) {
      return "Let's make it happen! You can reach us at hello@upscall.com, or head to our Contact page to send a message directly. We also offer free consultations — no pressure, just a conversation about your goals. Want me to walk you through what to expect on that call?";
    }

    // About / team / company
    if (/about|team|who are you|company|founded|mission|behind/.test(lower)) {
      trackTopic('about');
      return "Upscall was built on one idea: great marketing shouldn't require a massive budget. Our team is a mix of strategists, creatives, and data nerds who genuinely love what they do. We've served 150+ clients with a 98% retention rate — people stick with us because we deliver." + suggestNext();
    }

    // Contract / commitment
    if (/contract|lock.?in|cancel|commitment|flexible|month.?to.?month/.test(lower)) {
      trackTopic('pricing');
      return "Zero lock-in contracts. We operate month-to-month because we believe in earning your trust, not trapping you. You can upgrade, downgrade, pause, or cancel anytime. No hidden fees, no gotchas. That's a big deal to most of our clients — does that ease any concerns?";
    }

    // Custom / bespoke
    if (/custom|bespoke|tailor|specific|unique|different|doesn.?t fit/.test(lower)) {
      return "Totally! Not every business fits neatly into a package, and that's fine. Tell me a bit about what you need, and we'll design something custom. Or you can describe your situation on the Contact page and our team will put together a tailored proposal. What would your ideal marketing setup look like?";
    }

    // Budget / money concerns
    if (/expensive|afford|cheap|budget|worth it|invest|money|spend/.test(lower)) {
      return "I get it — budget matters. The good news is our Silver package is designed to be accessible for small businesses, and every tier is built to pay for itself through the results we deliver. Think of it as an investment with measurable returns, not an expense. What's your rough budget range? I can help you figure out the best fit.";
    }

    // Competition / why Upscall
    if (/why upscall|why you|competitor|better|different from|vs|compared to|agency/.test(lower)) {
      return "Great question. Three things set us apart: 1) No lock-in contracts — we earn your business monthly. 2) Every strategy is custom — we don't do cookie-cutter. 3) Transparent reporting — you see exactly what your money does. Plus our 98% retention rate speaks for itself. What's been your experience with agencies before?";
    }

    // Negative sentiment / skepticism
    if (/scam|fake|don.?t believe|not sure|skeptic|too good|really/.test(lower)) {
      return "Healthy skepticism is good — honestly, the marketing industry has a lot of overpromisers. That's exactly why we do month-to-month contracts and transparent reporting. You'll see real numbers, and if we're not delivering, you can walk away. We'd love the chance to prove it with a free consultation. Fair enough?";
    }

    // Thanks
    if (/thank|thanks|appreciate|helpful|amazing|great|awesome|perfect/.test(lower)) {
      return pick([
        "Glad I could help, " + userName + "! Is there anything else you're curious about? I'm here as long as you need.",
        "Anytime! If anything else comes up, don't hesitate to ask. And when you're ready to take the next step, we're just one message away.",
        "Happy to help! " + (topicsDiscussed.length < 3 ? suggestNext() : "If you're ready to chat with our team directly, hit up the Contact page or email hello@upscall.com!")
      ]);
    }

    // Bye
    if (/bye|goodbye|see you|later|that's all|gotta go|peace|done/.test(lower)) {
      return "It was great chatting with you, " + userName + "! When you're ready, our team is at hello@upscall.com. Talk soon!";
    }

    // Industry
    if (/industry|industries|niche|ecommerce|e-commerce|saas|local|restaurant|real estate|startup|agency|coach|clinic|fitness/.test(lower)) {
      trackTopic('industry');
      return "We work across a ton of industries — e-commerce, SaaS, local services, professional firms, hospitality, health & wellness, real estate, coaches, and more. Every strategy we build is tailored to your specific market and audience. What industry are you in? I'd love to share what's worked for similar businesses.";
    }

    // Yes / affirmative
    if (/^(yes|yeah|yep|sure|ok|okay|definitely|absolutely|please|go ahead|tell me)/.test(lower)) {
      if (lastTopic === 'packages') {
        return "Awesome! Which tier are you leaning toward — Silver, Gold, or Diamond? Or if you're not sure, tell me about your goals and I'll recommend one.";
      }
      if (lastTopic === 'services') {
        return "Great! Which service is most relevant — SEO, social media, paid ads, lead generation, or brand development? I can dive deep into any of those.";
      }
      return "Awesome! What would you like to know more about? I can talk packages, services, our process, results, or anything else that's on your mind.";
    }

    // No / negative
    if (/^(no|nah|nope|not really|i'm good|all good)/.test(lower)) {
      return pick([
        "No worries! If you think of anything later, I'm always here. You can also reach our team at hello@upscall.com anytime.",
        "All good! Just know we're here whenever you need us. Feel free to come back and chat anytime, " + userName + "."
      ]);
    }

    // Default / fallback — but smarter
    const fallbacks = [
      "Hmm, I want to make sure I give you the best answer. Could you rephrase that or give me a bit more context? I know a lot about our services, packages, and marketing in general.",
      "That's an interesting one! I might not have the perfect answer off the top of my head, but our team definitely does. Want me to point you to the right place, or is there something else I can help with?",
      "I appreciate the question! While I think that's better answered by our strategy team, I can help you with info about our packages, services, process, or getting started. What sounds good?",
      "Good question — let me be honest, that's a bit outside my wheelhouse. But I'm great at breaking down our packages, explaining our services, and helping you figure out the right fit. Want to explore any of those?"
    ];

    return pick(fallbacks);
  }
}
