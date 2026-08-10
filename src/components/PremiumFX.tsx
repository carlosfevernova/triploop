'use client';
import { useEffect } from 'react';

/**
 * S97+S99 — Premium micro-interactions global.
 * - Scroll progress bar (top thin gradient line)
 * - Magnetic hover on primary CTAs
 * - Card 3D tilt on [data-tilt]
 * - Section entrance animations (sec-reveal → fade+slide when in view)
 * - Side-dot navigator (desktop ≥1200px, tracks 5 anchors)
 *
 * All respect prefers-reduced-motion and touch devices.
 */
export function PremiumFX(){
  useEffect(() => {
    if(typeof window === 'undefined') return;

    // ─── Scroll progress bar
    let bar = document.getElementById('scrollProgress') as HTMLDivElement | null;
    if(!bar){
      bar = document.createElement('div');
      bar.id = 'scrollProgress';
      bar.setAttribute('aria-hidden', 'true');
      bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#ff5a5f,#0891b2);width:0%;z-index:9999;pointer-events:none;transition:width .08s linear;box-shadow:0 0 12px rgba(255,90,95,.5)';
      document.body.appendChild(bar);
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      if(bar) bar.style.width = pct + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ─── Side-dot navigator (desktop only)
    let dotsNav: HTMLElement | null = document.getElementById('sideDotsNav');
    if(!dotsNav && window.innerWidth >= 1200){
      const anchors = [
        { id: 'hero', label: 'Top' },
        { id: 'features', label: 'Features' },
        { id: 'regions', label: 'Regions' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'faq', label: 'FAQ' }
      ];
      // Try to find each section (or use approx by class)
      dotsNav = document.createElement('nav');
      dotsNav.id = 'sideDotsNav';
      dotsNav.setAttribute('aria-label', 'Section navigator');
      dotsNav.style.cssText = 'position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:40;display:flex;flex-direction:column;gap:18px;pointer-events:auto';
      anchors.forEach(a => {
        const link = document.createElement('a');
        link.href = '#' + a.id;
        link.dataset.dot = a.id;
        link.setAttribute('aria-label', a.label);
        link.style.cssText = 'position:relative;display:flex;align-items:center;justify-content:center;width:22px;height:22px;text-decoration:none';
        const dot = document.createElement('span');
        dot.style.cssText = 'display:block;width:6px;height:6px;border-radius:50%;background:rgba(70,70,80,.35);transition:all .3s cubic-bezier(.22,1,.36,1)';
        const label = document.createElement('em');
        label.textContent = a.label;
        label.style.cssText = "position:absolute;right:calc(100% + 12px);top:50%;transform:translateY(-50%) translateX(6px);font-family:'Inter',ui-sans-serif,system-ui,sans-serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#111;white-space:nowrap;font-style:normal;opacity:0;transition:all .25s cubic-bezier(.22,1,.36,1);background:white;padding:6px 12px;border-radius:100px;border:1px solid rgba(0,0,0,.08);box-shadow:0 2px 8px rgba(0,0,0,.06);pointer-events:none";
        link.appendChild(dot);
        link.appendChild(label);
        link.addEventListener('mouseenter', () => {
          dot.style.background = '#ff5a5f';
          dot.style.transform = 'scale(1.5)';
          label.style.opacity = '1';
          label.style.transform = 'translateY(-50%) translateX(0)';
        });
        link.addEventListener('mouseleave', () => {
          if(!link.classList.contains('active')){
            dot.style.background = 'rgba(70,70,80,.35)';
            dot.style.transform = 'scale(1)';
          }
          label.style.opacity = '0';
          label.style.transform = 'translateY(-50%) translateX(6px)';
        });
        dotsNav!.appendChild(link);
      });
      document.body.appendChild(dotsNav);

      // Active state via IntersectionObserver
      const dotLinks = dotsNav.querySelectorAll<HTMLAnchorElement>('a');
      const setActive = (activeId: string) => {
        dotLinks.forEach(l => {
          const isActive = l.dataset.dot === activeId;
          l.classList.toggle('active', isActive);
          const dotSpan = l.querySelector('span') as HTMLElement;
          if(isActive){
            dotSpan.style.background = '#ff5a5f';
            dotSpan.style.transform = 'scale(1.8)';
            dotSpan.style.boxShadow = '0 0 12px rgba(255,90,95,.6)';
          } else {
            dotSpan.style.background = 'rgba(70,70,80,.35)';
            dotSpan.style.transform = 'scale(1)';
            dotSpan.style.boxShadow = 'none';
          }
        });
      };
      const secObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if(e.isIntersecting && e.target.id){
            setActive(e.target.id);
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px' });
      anchors.forEach(a => {
        const el = document.getElementById(a.id);
        if(el) secObserver.observe(el);
      });
    }

    // ─── Magnetic CTAs
    const magneticEls: HTMLElement[] = [];
    const applyMagnetic = () => {
      if(prefersReduced || !canHover) return;
      const selectors = [
        '[data-magnetic]',
        'a.bg-coral-500',
        'a.bg-ink-900'
      ];
      const els = document.querySelectorAll<HTMLElement>(selectors.join(','));
      els.forEach(el => {
        if(magneticEls.includes(el)) return;
        magneticEls.push(el);
        el.style.willChange = 'transform';
        el.style.transition = 'transform .25s cubic-bezier(.22,1,.36,1)';
        const mm = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width/2) * .15;
          const y = (e.clientY - r.top - r.height/2) * .3;
          el.style.transform = `translate(${x}px, ${y}px)`;
        };
        const ml = () => { el.style.transform = ''; };
        el.addEventListener('mousemove', mm);
        el.addEventListener('mouseleave', ml);
      });
    };
    applyMagnetic();

    // ─── 3D tilt cards
    const tiltEls: HTMLElement[] = [];
    const applyTilt = () => {
      if(prefersReduced || !canHover) return;
      const els = document.querySelectorAll<HTMLElement>('[data-tilt]');
      els.forEach(el => {
        if(tiltEls.includes(el)) return;
        tiltEls.push(el);
        el.style.transformStyle = 'preserve-3d';
        el.style.willChange = 'transform';
        el.style.transition = 'transform .35s cubic-bezier(.22,1,.36,1)';
        const mm = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - .5;
          const cy = (e.clientY - r.top) / r.height - .5;
          el.style.transform = `perspective(1200px) rotateY(${cx*3}deg) rotateX(${-cy*3}deg) translateY(-3px)`;
        };
        const ml = () => { el.style.transform = ''; };
        el.addEventListener('mousemove', mm);
        el.addEventListener('mouseleave', ml);
      });
    };
    applyTilt();

    // ─── Section entrance animations
    if(!prefersReduced){
      // Inject animation CSS once
      if(!document.getElementById('secRevealStyles')){
        const style = document.createElement('style');
        style.id = 'secRevealStyles';
        style.textContent = `
          .sec-reveal{opacity:0;transform:translateY(30px);transition:opacity .9s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1)}
          .sec-reveal.in-view{opacity:1;transform:none}
        `;
        document.head.appendChild(style);
      }
      // Auto-tag major sections (except hero — hero is always visible)
      const majorSections = document.querySelectorAll<HTMLElement>('main > section:not(#hero), main > div > section:not(#hero)');
      majorSections.forEach(s => s.classList.add('sec-reveal'));
      const revealIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if(e.isIntersecting){
            e.target.classList.add('in-view');
            revealIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
      majorSections.forEach(s => revealIO.observe(s));
    }

    // Re-scan periodically for late-mounted nodes
    const rescanTimer = setInterval(() => { applyMagnetic(); applyTilt(); }, 2000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(rescanTimer);
    };
  }, []);

  return null;
}
