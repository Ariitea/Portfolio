import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, Layers, X } from 'lucide-react';
import './styles.css';

const projects = [
  {
    title: 'Momaz',
    period: 'March 2026',
    type: 'e-shop',
    image: '/assets/bg.png',
    detail: '/assets/bg.png',
    url: 'https://momaz-app.vercel.app',
    gallery: [
      '/assets/bg.png',
      '/assets/project-detail.png',
      '/assets/project-momaz.png',
      '/assets/project-mobile.png',
      '/assets/project-oupa.png',
      '/assets/bg.png',
    ],
    palette: '#dadada',
  },
  {
    title: 'Kittyhub',
    period: 'January 2026',
    type: 'platform',
    image: '/assets/bg.png',
    detail: '/assets/bg.png',
    gallery: ['/assets/bg.png', '/assets/bg.png', '/assets/bg.png', '/assets/bg.png'],
    palette: '#d7d1c6',
  },
  {
    title: 'Oupa',
    period: 'April 2026',
    type: 'automation',
    image: '/assets/bg.png',
    detail: '/assets/bg.png',
    gallery: ['/assets/bg.png', '/assets/bg.png', '/assets/bg.png', '/assets/bg.png'],
    palette: '#d2d8da',
  },
  {
    title: 'Atelier',
    period: 'May 2026',
    type: 'identity',
    image: '/assets/bg.png',
    detail: '/assets/bg.png',
    gallery: ['/assets/bg.png', '/assets/bg.png', '/assets/bg.png', '/assets/bg.png'],
    palette: '#d8d8d8',
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function useLoaderProgress(duration = 1800) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start = 0;

    const tick = (time) => {
      if (!start) start = time;
      const elapsed = time - start;
      const next = clamp(elapsed / duration, 0, 1);
      const eased = 1 - Math.pow(1 - next, 3);
      setProgress(Math.round(eased * 100));

      if (next < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [duration]);

  return progress;
}

function useSectionScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = ref.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const next = clamp(-rect.top / scrollableDistance, 0, 1);
      setProgress(next);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return progress;
}

function Header({ onProjectsClick, onContactClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('is-menu-open', menuOpen);
    return () => document.body.classList.remove('is-menu-open');
  }, [menuOpen]);

  const goToProjects = () => {
    setMenuOpen(false);
    onProjectsClick();
  };

  const goToContact = () => {
    setMenuOpen(false);
    onContactClick();
  };

  return (
    <header className="site-header">
      <button className="mark" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src="/assets/black-logo.png" alt="Adrien Desrames" />
      </button>
      <nav className="desktop-nav">
        <button type="button" onClick={goToProjects}>Projects</button>
        <button type="button" onClick={goToContact}>Contacts</button>
      </nav>
      <button
        className="mobile-menu"
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} strokeWidth={1.8} /> : <Layers size={20} fill="currentColor" strokeWidth={1.8} />}
      </button>
      <div className={`mobile-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <img src="/assets/black-logo.png" alt="Adrien Desrames" />
        <nav>
          <button type="button" onClick={goToProjects}>projets</button>
          <button type="button" onClick={goToContact}>contact</button>
        </nav>
      </div>
    </header>
  );
}

function Loader({ progress, finished }) {
  return (
    <div
      className={`loader ${finished ? 'loader--done' : ''}`}
      aria-hidden={finished}
      style={{ '--loader-progress': progress / 100 }}
    >
      <div className="loader__number">{String(progress).padStart(2, '0')}%</div>
      <div className="loader__track">
        <span />
      </div>
    </div>
  );
}

function ProjectRail({ onProjectOpen }) {
  const railRef = useRef(null);
  const sectionProgress = useSectionScrollProgress(railRef);
  const activeFloat = sectionProgress * (projects.length - 1);
  const activeIndex = Math.round(activeFloat);

  return (
    <section ref={railRef} className="projects-section" id="projects">
      <div className="project-viewport">
        <div className="project-rail" style={{ '--active': activeIndex }}>
          {projects.map((project, index) => {
            const distance = index - activeFloat;
            const offset = distance * 48;
            const focus = 1 - clamp(Math.abs(distance), 0, 1);
            const scale = 0.58 + focus * 0.42;
            const opacity = clamp(1 - Math.abs(distance) * 0.2, 0.22, 1);

            return (
              <button
                className={`project-card ${index === activeIndex ? 'is-active' : ''}`}
                key={project.title}
                type="button"
                onClick={() => onProjectOpen(index)}
                style={{
                  '--x': `${offset}vw`,
                  '--scale': scale,
                  '--opacity': opacity,
                  '--tone': project.palette,
                }}
              >
                <img src={project.image} alt={project.title} />
                <span className="project-card__name">{project.title}</span>
              </button>
            );
          })}
        </div>
        <div className="mobile-counter">
          <span>- {activeIndex + 1}</span>
          <span>{4 - activeIndex} -</span>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section">
      <div className="about-intro">
        <img src="/assets/ad-profile.png" alt="Portrait Adrien Desrames" />
        <h1>
          A curated body of work exploring digital systems, <strong>design</strong> and
          modern entrepreneurship — built with <strong>intention</strong>, not excess <span>→</span>
        </h1>
      </div>

      <div className="bio-copy">
        <p>MY NAME IS ADRIEN, AN ENTREPRENEUR BASED IN PARIS. OVER THE YEARS, I’VE BEEN BUILDING DIGITAL PROJECTS FOCUSED ON AUTOMATION, WEB DEVELOPMENT AND ONLINE BUSINESS INFRASTRUCTURE.</p>
        <p>I’VE ALWAYS HAD A HIGHLY EXECUTION-ORIENTED MINDSET: QUICKLY UNDERSTANDING SYSTEMS, IDENTIFYING WHAT TRULY WORKS, AND BUILDING EFFICIENT SOLUTIONS WITHOUT UNNECESSARY COMPLEXITY.</p>
        <p>THROUGHOUT MY JOURNEY, I’VE WORKED ON PROJECTS INVOLVING BRAND DEVELOPMENT, DIGITAL ACQUISITION, WORKFLOW AUTOMATION, PLATFORM CREATION AND OPERATIONAL OPTIMIZATION. WHAT I ENJOY MOST IS TRANSFORMING AN IDEA INTO SOMETHING CONCRETE, STRUCTURED AND BUILT TO EVOLVE OVER TIME.</p>
        <p>I ALSO PAY CLOSE ATTENTION TO IMAGE, USER EXPERIENCE AND OVERALL COHERENCE. TO ME, DETAILS ARE OFTEN WHAT SEPARATE SOMETHING SIMPLY FUNCTIONAL FROM SOMETHING TRULY REFINED AND CREDIBLE.</p>
        <p>TODAY, I CONTINUE DEVELOPING NEW PROJECTS WITH AN APPROACH THAT COMBINES STRATEGY, CREATIVITY AND PERFORMANCE.</p>
      </div>
    </section>
  );
}

function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') || '';
    const subject = formData.get('subject') || 'Portfolio contact';
    const message = formData.get('message') || '';
    const body = [`From: ${email}`, '', message].join('\n');
    const href = `mailto:adriendesrames.ios@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <section className="contact-section" id="contact">
      <h2>contact</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Your email</span>
          <input name="email" type="email" aria-label="Your email" placeholder="Your email" required />
        </label>
        <label>
          <span>Subject</span>
          <input name="subject" type="text" aria-label="Subject" placeholder="Subject" required />
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" aria-label="Message" placeholder="Message" required />
        </label>
        <button className="contact-submit" type="submit">Send</button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <ul>
        <li>projects</li>
        <li>contact</li>
      </ul>
      <strong>Adrien Desrames <span>•</span> 2026</strong>
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>
    </footer>
  );
}

function ProjectOverlay({ projectIndex, onProjectChange, onClose }) {
  if (projectIndex === null) return null;
  const project = projects[projectIndex];
  const previousIndex = (projectIndex - 1 + projects.length) % projects.length;
  const nextIndex = (projectIndex + 1) % projects.length;
  const previousProject = projects[previousIndex];
  const nextProject = projects[nextIndex];
  const gallery = project.gallery ?? projects.map((item) => item.image);

  return (
    <aside className="project-overlay">
      <img className="project-overlay__logo" src="/assets/white-logo.png" alt="Adrien Desrames" />
      <img className="project-overlay__bg" src={project.detail} alt="" />
      <button className="project-overlay__back" type="button" onClick={onClose}>
        <ArrowLeft size={17} /> BACK
      </button>
      <div className="project-overlay__date">{project.period.replace(' ', '  ·  ')}</div>
      <h2>{project.title}</h2>
      {project.url ? (
        <a className="project-overlay__type" href={project.url} target="_blank" rel="noreferrer">
          {project.type}
        </a>
      ) : (
        <span className="project-overlay__type">{project.type}</span>
      )}
      <div className="project-overlay__side" aria-hidden="true">
        <div className="project-overlay__gallery">
          {[...gallery, ...gallery].map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt="" />
          ))}
        </div>
      </div>
      <div className="project-overlay__pager">
        <button type="button" onClick={() => onProjectChange(previousIndex)}>← {previousProject.title}</button>
        <button type="button" onClick={() => onProjectChange(nextIndex)}>{nextProject.title} →</button>
      </div>
      <button className="project-overlay__close" type="button" onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>
    </aside>
  );
}

function App() {
  const loaderProgress = useLoaderProgress();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const loaded = loaderProgress >= 100;

  useEffect(() => {
    document.body.classList.toggle('is-project-open', selectedProjectIndex !== null);
  }, [selectedProjectIndex]);

  return (
    <>
      <Header
        onProjectsClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
        onContactClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <main>
        <ProjectRail onProjectOpen={setSelectedProjectIndex} />
        <About />
        <Contact />
      </main>
      <Footer />
      <Loader progress={loaderProgress} finished={loaded} />
      <ProjectOverlay
        projectIndex={selectedProjectIndex}
        onProjectChange={setSelectedProjectIndex}
        onClose={() => setSelectedProjectIndex(null)}
      />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
