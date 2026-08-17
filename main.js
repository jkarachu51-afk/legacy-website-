import './style.css'

// ===== API Configuration =====
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('legacy_token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

// ===== Auth State =====
let currentUser = null

function loadUser() {
  const stored = localStorage.getItem('legacy_user')
  if (stored) {
    try {
      currentUser = JSON.parse(stored)
    } catch {
      localStorage.removeItem('legacy_user')
      localStorage.removeItem('legacy_token')
    }
  }
}

function setAuth(token, user) {
  localStorage.setItem('legacy_token', token)
  localStorage.setItem('legacy_user', JSON.stringify(user))
  currentUser = user
  updateAuthUI()
}

function clearAuth() {
  localStorage.removeItem('legacy_token')
  localStorage.removeItem('legacy_user')
  currentUser = null
  updateAuthUI()
}

// ===== Icons =====
const icons = {
  graduation: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  laptop: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/><rect x="2" y="16" width="20" height="4" rx="1"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  loader: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  facebook: '<svg viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.91l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>',
}

// ===== Static Data =====
const heroImage = 'https://images.pexels.com/photos/7972942/pexels-photo-7972942.jpeg?auto=compress&cs=tinysrgb&h=900&w=720'
const aboutImage = 'https://images.pexels.com/photos/5965699/pexels-photo-5965699.jpeg?auto=compress&cs=tinysrgb&h=700&w=900'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Software Engineering Graduate',
    avatar: 'https://images.pexels.com/photos/7752788/pexels-photo-7752788.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    text: 'Legacy Education transformed my career path. The practical curriculum and dedicated instructors gave me the confidence to land a role at a leading tech company within months of graduating.',
  },
  {
    name: 'James Carter',
    role: 'Business Administration Student',
    avatar: 'https://images.pexels.com/photos/6942776/pexels-photo-6942776.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    text: 'The business program goes beyond theory. I launched my own startup while still enrolled, and the mentorship I received made all the difference. Truly a life-changing experience.',
  },
  {
    name: 'Priya Sharma',
    role: 'Data Science Alumni',
    avatar: 'https://images.pexels.com/photos/38707525/pexels-photo-38707525.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    text: 'I came in with no coding background and left as a confident data analyst. The supportive community and hands-on projects made complex concepts feel approachable and exciting.',
  },
]

const features = [
  {
    icon: 'users',
    title: 'Experienced Educators',
    desc: 'Learn from industry professionals and academic experts who bring real-world insight into every lesson.',
  },
  {
    icon: 'target',
    title: 'Practical Learning',
    desc: 'Hands-on projects and real-world case studies ensure you graduate ready to apply what you know.',
  },
  {
    icon: 'award',
    title: 'Modern Skills',
    desc: 'Stay ahead with a curriculum designed around the skills today\'s employers and tomorrow\'s leaders demand.',
  },
  {
    icon: 'heart',
    title: 'Student Support',
    desc: 'From mentorship to career guidance, our dedicated team walks with you every step of the way.',
  },
]

const categoryIcons = {
  Technology: 'laptop',
  Business: 'briefcase',
  Education: 'book',
}

const categoryDescriptions = {
  Technology: 'Master the tools and skills shaping tomorrow\'s digital world.',
  Business: 'Build the foundation to lead, innovate, and grow in any industry.',
  Education: 'Shape the next generation with modern teaching methodologies.',
}

// ===== Render =====
const app = document.querySelector('#app')

app.innerHTML = `
  <!-- Navbar -->
  <nav class="navbar" id="navbar">
    <div class="container">
      <div class="nav-logo" data-scroll="home">
        <span class="logo-text">Legacy</span>
        <span class="logo-sub">Education</span>
      </div>
      <ul class="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#programs">Programs</a></li>
        <li><a href="#why">Why Legacy</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div class="nav-actions">
        <span id="authArea"></span>
        <button class="btn btn-primary" id="getStartedBtn">Get Started</button>
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile menu -->
  <div class="mobile-menu" id="mobileMenu">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#programs">Programs</a>
    <a href="#why">Why Legacy</a>
    <a href="#contact">Contact</a>
    <button class="btn btn-primary" id="mobileGetStartedBtn">Get Started</button>
  </div>
  <div class="overlay" id="overlay"></div>

  <!-- Auth Modal -->
  <div class="auth-modal-overlay" id="authModalOverlay">
    <div class="auth-modal">
      <button class="auth-close" id="authClose">${icons.close}</button>
      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login">Log In</button>
        <button class="auth-tab" data-tab="register">Sign Up</button>
      </div>
      <div class="auth-body">
        <form id="loginForm" class="auth-form active">
          <div class="form-group">
            <label for="loginEmail">Email</label>
            <input type="email" id="loginEmail" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" placeholder="Your password" required />
          </div>
          <div class="auth-error" id="loginError"></div>
          <button type="submit" class="btn btn-primary auth-submit">Log In</button>
        </form>
        <form id="registerForm" class="auth-form">
          <div class="form-group">
            <label for="registerName">Full Name</label>
            <input type="text" id="registerName" placeholder="Your full name" required />
          </div>
          <div class="form-group">
            <label for="registerEmail">Email</label>
            <input type="email" id="registerEmail" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label for="registerPassword">Password</label>
            <input type="password" id="registerPassword" placeholder="At least 6 characters" required />
          </div>
          <div class="auth-error" id="registerError"></div>
          <button type="submit" class="btn btn-primary auth-submit">Create Account</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Hero -->
  <section class="hero" id="home">
    <div class="container">
      <div class="hero-content reveal">
        <span class="section-eyebrow" style="color: var(--color-forest-300);">Your Journey Starts Here</span>
        <h1>Learn Today. <span class="accent">Lead Tomorrow.</span></h1>
        <p class="hero-text">Empowering learners with the knowledge, skills, and confidence to build a brighter future.</p>
        <div class="hero-buttons">
          <button class="btn btn-light" data-scroll="programs">
            Explore Programs
            ${icons.arrowRight}
          </button>
          <button class="btn btn-outline-light" data-scroll="about">Learn More</button>
        </div>
      </div>
      <div class="hero-visual reveal reveal-delay-2">
        <div class="hero-image-wrap">
          <img src="${heroImage}" alt="Students learning together on campus" />
        </div>
        <div class="hero-badge">
          <div class="badge-icon">${icons.graduation}</div>
          <div class="badge-text">
            <strong>95%</strong>
            <span>Success Rate</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="hero-stats reveal reveal-delay-3">
        <div class="stat-item">
          <div class="stat-number">10K+</div>
          <div class="stat-label">Students</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">50+</div>
          <div class="stat-label">Programs</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">95%</div>
          <div class="stat-label">Success Rate</div>
        </div>
      </div>
    </div>
  </section>

  <!-- About -->
  <section class="about" id="about">
    <div class="container">
      <div class="about-image-wrap reveal">
        <img src="${aboutImage}" alt="Students studying together at university" />
      </div>
      <div class="about-content reveal reveal-delay-1">
        <span class="section-eyebrow">About Legacy</span>
        <h2 class="section-title">Education That Prepares You for What Comes Next</h2>
        <p class="section-intro">Legacy Education provides quality learning experiences designed to prepare students for education, careers, and the future. We combine academic rigor with practical, hands-on learning so every student graduates ready to make an impact.</p>
        <div class="about-features">
          <div class="about-feature">
            <div class="feature-icon">${icons.target}</div>
            <div>
              <h4>Mission-Driven Learning</h4>
              <p>Every program is built around outcomes that matter in the real world.</p>
            </div>
          </div>
          <div class="about-feature">
            <div class="feature-icon">${icons.users}</div>
            <div>
              <h4>Community First</h4>
              <p>A supportive network of peers, mentors, and alumni that lasts a lifetime.</p>
            </div>
          </div>
          <div class="about-feature">
            <div class="feature-icon">${icons.award}</div>
            <div>
              <h4>Recognized Excellence</h4>
              <p>Trusted by thousands of students and respected by employers nationwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Programs -->
  <section class="programs" id="programs">
    <div class="container">
      <div class="section-header center reveal">
        <span class="section-eyebrow">Our Programs</span>
        <h2 class="section-title">Find the Path That Fits Your Ambition</h2>
        <p class="section-intro" style="margin-left:auto; margin-right:auto;">Explore our three core areas of study, each designed to give you the skills, experience, and confidence to thrive.</p>
      </div>
      <div class="programs-grid" id="programsGrid">
        <div class="programs-loading">
          ${icons.loader}
          <span>Loading programs...</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Legacy -->
  <section class="why" id="why">
    <div class="container">
      <div class="section-header center reveal">
        <span class="section-eyebrow">Why Legacy</span>
        <h2 class="section-title">What Sets Us Apart</h2>
        <p class="section-intro" style="margin-left:auto; margin-right:auto;">We are committed to creating an environment where every student can grow, lead, and succeed.</p>
      </div>
      <div class="why-grid">
        ${features.map((f, i) => `
          <div class="feature-card reveal reveal-delay-${(i % 3) + 1}">
            <div class="feature-icon-lg">${icons[f.icon]}</div>
            <h4>${f.title}</h4>
            <p>${f.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="testimonials" id="success">
    <div class="container">
      <div class="section-header center reveal">
        <span class="section-eyebrow">Student Success</span>
        <h2 class="section-title">Stories From Our Community</h2>
        <p class="section-intro" style="margin-left:auto; margin-right:auto;">Hear from students who turned their ambition into achievement with Legacy Education.</p>
      </div>
      <div class="testimonials-grid">
        ${testimonials.map((t, i) => `
          <div class="testimonial-card reveal reveal-delay-${i + 1}">
            <div class="testimonial-quote">"</div>
            <p class="testimonial-text">${t.text}</p>
            <div class="testimonial-author">
              <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar" />
              <div class="author-info">
                <strong>${t.name}</strong>
                <span>${t.role}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <p class="testimonial-note">These are sample testimonials with fictional names, provided for illustrative purposes.</p>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta">
    <div class="container">
      <div class="cta-box reveal">
        <h2>Ready to Build Your Legacy?</h2>
        <p>Start your journey today and discover where your education can take you.</p>
        <button class="btn btn-gold" id="ctaGetStarted">Get Started ${icons.arrowRight}</button>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="contact" id="contact">
    <div class="container">
      <div class="contact-info reveal">
        <span class="section-eyebrow">Get in Touch</span>
        <h2 class="section-title">We'd Love to Hear From You</h2>
        <p class="section-intro">Have questions about programs, admissions, or anything else? Reach out and our team will get back to you within 24 hours.</p>
        <div class="contact-detail">
          <div class="detail-icon">${icons.mail}</div>
          <div>
            <h4>Email</h4>
            <a href="mailto:hello@legacyeducation.com">hello@legacyeducation.com</a>
          </div>
        </div>
        <div class="contact-detail">
          <div class="detail-icon">${icons.phone}</div>
          <div>
            <h4>Phone</h4>
            <a href="tel:+18005551234">(800) 555-1234</a>
          </div>
        </div>
        <div class="contact-detail">
          <div class="detail-icon">${icons.pin}</div>
          <div>
            <h4>Location</h4>
            <p>123 Heritage Way, Boston, MA 02115</p>
          </div>
        </div>
      </div>
      <div class="contact-form reveal reveal-delay-1">
        <div class="form-success" id="formSuccess">
          ${icons.check}
          <span id="formSuccessText">Thank you! Your message has been sent. We'll be in touch soon.</span>
        </div>
        <form id="contactForm" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="name">Name <span class="required">*</span></label>
              <input type="text" id="name" name="name" placeholder="Your full name" />
              <span class="form-error">Please enter your name.</span>
            </div>
            <div class="form-group">
              <label for="email">Email <span class="required">*</span></label>
              <input type="email" id="email" name="email" placeholder="you@example.com" />
              <span class="form-error">Please enter a valid email address.</span>
            </div>
          </div>
          <div class="form-group">
            <label for="subject">Subject <span class="required">*</span></label>
            <input type="text" id="subject" name="subject" placeholder="What is this about?" />
            <span class="form-error">Please enter a subject.</span>
          </div>
          <div class="form-group">
            <label for="message">Message <span class="required">*</span></label>
            <textarea id="message" name="message" placeholder="Tell us how we can help..."></textarea>
            <span class="form-error">Please enter your message.</span>
          </div>
          <button type="submit" class="btn btn-primary" id="contactSubmitBtn">Send Message ${icons.arrowRight}</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="nav-logo">
            <span class="logo-text">Legacy</span>
            <span class="logo-sub">Education</span>
          </div>
          <p>Empowering learners with the knowledge, skills, and confidence to build a brighter future, one student at a time.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook">${icons.facebook}</a>
            <a href="#" aria-label="Twitter">${icons.twitter}</a>
            <a href="#" aria-label="LinkedIn">${icons.linkedin}</a>
            <a href="#" aria-label="Instagram">${icons.instagram}</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#why">Why Legacy</a></li>
            <li><a href="#success">Success Stories</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Programs</h5>
          <ul>
            <li><a href="#programs">Technology</a></li>
            <li><a href="#programs">Business</a></li>
            <li><a href="#programs">Education</a></li>
            <li><a href="#programs">Software Engineering</a></li>
            <li><a href="#programs">Data Science</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Contact</h5>
          <ul>
            <li><a href="mailto:hello@legacyeducation.com">hello@legacyeducation.com</a></li>
            <li><a href="tel:+18005551234">(800) 555-1234</a></li>
            <li><a href="#">123 Heritage Way</a></li>
            <li><a href="#">Boston, MA 02115</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Legacy Education. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Back to top -->
  <button class="back-to-top" id="backToTop" aria-label="Back to top">
    ${icons.arrowUp}
  </button>
`

// ===== Auth UI =====
function updateAuthUI() {
  const authArea = document.getElementById('authArea')
  if (currentUser) {
    authArea.innerHTML = `
      <span class="auth-greeting">Hi, ${currentUser.name.split(' ')[0]}</span>
      <button class="btn btn-secondary btn-sm" id="logoutBtn">Log Out</button>
    `
    document.getElementById('logoutBtn').addEventListener('click', clearAuth)
  } else {
    authArea.innerHTML = `<button class="btn btn-secondary btn-sm" id="loginBtn">Log In</button>`
    document.getElementById('loginBtn').addEventListener('click', openAuthModal)
  }
}

function openAuthModal() {
  document.getElementById('authModalOverlay').classList.add('show')
  document.body.style.overflow = 'hidden'
}

function closeAuthModal() {
  document.getElementById('authModalOverlay').classList.remove('show')
  document.body.style.overflow = ''
  document.getElementById('loginError').textContent = ''
  document.getElementById('registerError').textContent = ''
}

document.getElementById('authClose').addEventListener('click', closeAuthModal)
document.getElementById('authModalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeAuthModal()
})

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'))
    tab.classList.add('active')
    document.getElementById(`${tab.dataset.tab}Form`).classList.add('active')
  })
})

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const errorEl = document.getElementById('loginError')
  errorEl.textContent = ''
  const submitBtn = e.target.querySelector('.auth-submit')
  submitBtn.disabled = true
  submitBtn.textContent = 'Logging in...'
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
      }),
    })
    setAuth(data.token, data.user)
    closeAuthModal()
    e.target.reset()
  } catch (err) {
    errorEl.textContent = err.message
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = 'Log In'
  }
})

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const errorEl = document.getElementById('registerError')
  errorEl.textContent = ''
  const submitBtn = e.target.querySelector('.auth-submit')
  submitBtn.disabled = true
  submitBtn.textContent = 'Creating account...'
  try {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
      }),
    })
    setAuth(data.token, data.user)
    closeAuthModal()
    e.target.reset()
  } catch (err) {
    errorEl.textContent = err.message
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = 'Create Account'
  }
})

// Get Started buttons open auth modal
['getStartedBtn', 'mobileGetStartedBtn', 'ctaGetStarted'].forEach(id => {
  const el = document.getElementById(id)
  if (el) {
    el.addEventListener('click', () => {
      if (currentUser) {
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' })
      } else {
        openAuthModal()
      }
    })
  }
})

// ===== Fetch Programs from API =====
async function loadPrograms() {
  const grid = document.getElementById('programsGrid')
  try {
    const data = await apiRequest('/programs')
    const programs = data.data || []

    if (programs.length === 0) {
      grid.innerHTML = '<p class="programs-empty">No programs available yet. Please check back soon.</p>'
      return
    }

    const categories = [...new Set(programs.map(p => p.category))]

    grid.innerHTML = categories.map((cat, i) => {
      const catPrograms = programs.filter(p => p.category === cat)
      const icon = categoryIcons[cat] || 'book'
      const desc = categoryDescriptions[cat] || ''
      return `
        <div class="program-card reveal reveal-delay-${i + 1}">
          <div class="program-icon">${icons[icon]}</div>
          <h3>${cat}</h3>
          <p class="program-desc">${desc}</p>
          <ul class="program-list">
            ${catPrograms.map(p => `<li>${p.name}</li>`).join('')}
          </ul>
          <button class="btn btn-secondary" data-scroll="contact">Explore Program ${icons.arrowRight}</button>
        </div>
      `
    }).join('')

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

    document.querySelectorAll('[data-scroll]').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = el.getAttribute('data-scroll')
        if (target && target.startsWith('#')) {
          e.preventDefault()
          const section = document.querySelector(target)
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
            closeMobileMenu()
          }
        }
      })
    })
  } catch (err) {
    grid.innerHTML = `
      <div class="programs-error">
        <p>Unable to load programs right now.</p>
        <p class="programs-error-detail">${err.message}</p>
        <button class="btn btn-secondary" onclick="location.reload()">Try Again</button>
      </div>
    `
  }
}

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar')
const backToTop = document.getElementById('backToTop')

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
  if (window.scrollY > 400) {
    backToTop.classList.add('visible')
  } else {
    backToTop.classList.remove('visible')
  }
})

// ===== Smooth scroll for nav links =====
document.querySelectorAll('.nav-links a, .mobile-menu a, .footer-col a[href^="#"]').forEach(el => {
  el.addEventListener('click', (e) => {
    const target = el.getAttribute('href')
    if (target && target.startsWith('#')) {
      e.preventDefault()
      const section = document.querySelector(target)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
        closeMobileMenu()
      }
    }
  })
})

document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', (e) => {
    const target = el.getAttribute('data-scroll')
    if (target && target.startsWith('#')) {
      e.preventDefault()
      const section = document.querySelector(target)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
        closeMobileMenu()
      }
    }
  })
})

// ===== Back to top =====
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ===== Mobile menu =====
const menuToggle = document.getElementById('menuToggle')
const mobileMenu = document.getElementById('mobileMenu')
const overlay = document.getElementById('overlay')

function openMobileMenu() {
  menuToggle.classList.add('active')
  mobileMenu.classList.add('open')
  overlay.classList.add('show')
  document.body.style.overflow = 'hidden'
}

function closeMobileMenu() {
  menuToggle.classList.remove('active')
  mobileMenu.classList.remove('open')
  overlay.classList.remove('show')
  document.body.style.overflow = ''
}

menuToggle.addEventListener('click', () => {
  if (mobileMenu.classList.contains('open')) {
    closeMobileMenu()
  } else {
    openMobileMenu()
  }
})

overlay.addEventListener('click', closeMobileMenu)

// ===== Contact form =====
const form = document.getElementById('contactForm')
const formSuccess = document.getElementById('formSuccess')
const formSuccessText = document.getElementById('formSuccessText')
const contactSubmitBtn = document.getElementById('contactSubmitBtn')

function showError(field) {
  field.classList.add('error')
  field.closest('.form-group').classList.add('has-error')
}

function clearError(field) {
  field.classList.remove('error')
  field.closest('.form-group').classList.remove('has-error')
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  let valid = true

  const fields = ['name', 'email', 'subject', 'message']
  fields.forEach(id => {
    const field = document.getElementById(id)
    clearError(field)
    if (!field.value.trim()) {
      showError(field)
      valid = false
    }
  })

  const email = document.getElementById('email')
  if (email.value.trim() && !validateEmail(email.value.trim())) {
    showError(email)
    valid = false
  }

  if (!valid) return

  contactSubmitBtn.disabled = true
  contactSubmitBtn.innerHTML = `${icons.loader} Sending...`

  try {
    await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
      }),
    })
    form.reset()
    formSuccessText.textContent = "Thank you! Your message has been sent. We'll be in touch soon."
    formSuccess.classList.add('show')
    setTimeout(() => formSuccess.classList.remove('show'), 5000)
  } catch (err) {
    formSuccessText.textContent = `Unable to send message: ${err.message}`
    formSuccess.classList.add('show', 'error')
    setTimeout(() => formSuccess.classList.remove('show', 'error'), 5000)
  } finally {
    contactSubmitBtn.disabled = false
    contactSubmitBtn.innerHTML = `Send Message ${icons.arrowRight}`
  }
})

document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
  field.addEventListener('input', () => clearError(field))
})

// ===== Scroll reveal animations =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

// ===== Initialize =====
loadUser()
updateAuthUI()
loadPrograms()
