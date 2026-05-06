export default function Landing() {
  return (
    <>
      <style>{`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#08090a;
  --surface:#0f1011;
  --border:rgba(255,255,255,0.06);
  --border-light:rgba(255,255,255,0.1);
  --cyan:#0cc0df;
  --cyan-dim:rgba(12,192,223,0.15);
  --cyan-glow:rgba(12,192,223,0.08);
  --text:#e8e8e8;
  --text-dim:#6b7280;
  --text-dimmer:#3d4148;
}
html{scroll-behavior:smooth}
body{
  background:var(--bg);
  color:var(--text);
  font-family:'Inter',sans-serif;
  font-weight:400;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}

/* ── NOISE OVERLAY ── */
body::before{
  content:'';
  position:fixed;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events:none;z-index:1000;opacity:.4;
}

/* ── NAV ── */
nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  height:56px;
  display:flex;align-items:center;gap:32px;
  padding:0 32px;
  background:rgba(8,9,10,0.7);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0}
.nav-logo svg{height:24px;width:auto}
.nav-links{display:flex;align-items:center;gap:4px;flex:1}
.nav-links a{
  color:var(--text-dim);font-size:13px;font-weight:400;
  text-decoration:none;padding:6px 12px;border-radius:6px;
  transition:color .15s,background .15s;
}
.nav-links a:hover{color:var(--text);background:rgba(255,255,255,0.04)}
.nav-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
.btn-ghost{
  color:var(--text-dim);font-size:13px;font-weight:400;
  text-decoration:none;padding:6px 14px;border-radius:6px;
  border:1px solid var(--border);transition:all .15s;
}
.btn-ghost:hover{color:var(--text);border-color:var(--border-light);background:rgba(255,255,255,0.03)}
.btn-primary{
  background:var(--cyan);color:#000;font-size:13px;font-weight:500;
  text-decoration:none;padding:6px 16px;border-radius:6px;
  transition:opacity .15s,transform .1s;
  white-space:nowrap;
}
.btn-primary:hover{opacity:.88;transform:translateY(-1px)}

/* ── HERO ── */
.hero{
  min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;
  padding:120px 24px 80px;
  position:relative;
  overflow:hidden;
}

/* Gradient orb */
.hero::before{
  content:'';
  position:absolute;
  width:800px;height:800px;
  top:50%;left:50%;
  transform:translate(-50%,-60%);
  background:radial-gradient(circle, rgba(12,192,223,0.07) 0%, transparent 65%);
  pointer-events:none;
}

/* Grid lines */
.hero-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
  background-size:64px 64px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 40%,black,transparent);
}

.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--surface);
  border:1px solid var(--border-light);
  border-radius:100px;
  padding:5px 14px 5px 8px;
  font-size:12px;color:var(--text-dim);
  margin-bottom:36px;
  animation:fadeUp .6s ease both;
}
.badge-dot{
  width:18px;height:18px;border-radius:50%;
  background:var(--cyan-dim);
  display:flex;align-items:center;justify-content:center;
}
.badge-dot::after{
  content:'';width:6px;height:6px;border-radius:50%;
  background:var(--cyan);
  box-shadow:0 0 8px var(--cyan);
  animation:pulse 2s infinite;
}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

.hero h1{
  font-family:'Inter',sans-serif;
  font-size:clamp(48px,7vw,80px);
  font-weight:600;
  line-height:1.08;
  letter-spacing:-2.5px;
  color:#fff;
  max-width:800px;
  margin-bottom:24px;
  animation:fadeUp .6s ease .1s both;
}
.hero h1 em{
  font-style:normal;
  background:linear-gradient(135deg,var(--cyan) 0%,#7dd8e8 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.hero p{
  font-size:17px;color:var(--text-dim);
  max-width:520px;line-height:1.7;
  margin-bottom:40px;
  animation:fadeUp .6s ease .2s both;
}
.hero-cta{
  display:flex;gap:12px;align-items:center;
  animation:fadeUp .6s ease .3s both;
  flex-wrap:wrap;justify-content:center;
}
.cta-main{
  background:var(--cyan);color:#000;
  font-size:14px;font-weight:500;
  padding:10px 24px;border-radius:8px;
  text-decoration:none;
  transition:opacity .15s,transform .1s,box-shadow .2s;
  box-shadow:0 0 0 rgba(12,192,223,0);
}
.cta-main:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 32px rgba(12,192,223,.25)}
.cta-sec{
  color:var(--text-dim);font-size:14px;
  text-decoration:none;
  display:flex;align-items:center;gap:6px;
  transition:color .15s;
  padding:10px 4px;
}
.cta-sec:hover{color:var(--text)}
.cta-sec svg{transition:transform .15s}
.cta-sec:hover svg{transform:translateX(3px)}

/* ── APP PREVIEW ── */
.preview-wrap{
  width:100%;max-width:960px;
  margin:72px auto 0;
  position:relative;
  animation:fadeUp .8s ease .4s both;
}
.preview-glow{
  position:absolute;
  top:-40px;left:50%;transform:translateX(-50%);
  width:600px;height:200px;
  background:radial-gradient(ellipse,rgba(12,192,223,.12) 0%,transparent 70%);
  pointer-events:none;
}
.preview-frame{
  background:var(--surface);
  border:1px solid var(--border-light);
  border-radius:12px;
  overflow:hidden;
  box-shadow:0 32px 80px rgba(0,0,0,.5), 0 0 0 1px var(--border);
}
.preview-bar{
  background:rgba(255,255,255,.02);
  border-bottom:1px solid var(--border);
  padding:10px 16px;
  display:flex;align-items:center;gap:8px;
}
.preview-dot{width:10px;height:10px;border-radius:50%}
.preview-url{
  flex:1;text-align:center;
  background:rgba(255,255,255,.04);
  border-radius:5px;padding:3px 12px;
  font-size:11px;color:var(--text-dimmer);
  max-width:240px;margin:0 auto;
}
.preview-body{padding:20px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}
.preview-metric{
  background:rgba(255,255,255,.03);
  border:1px solid var(--border);
  border-radius:8px;padding:14px;
}
.preview-metric-label{font-size:11px;color:var(--text-dimmer);margin-bottom:6px}
.preview-metric-val{font-size:22px;font-weight:600;color:var(--cyan)}
.preview-table{
  grid-column:1/-1;
  background:rgba(255,255,255,.02);
  border:1px solid var(--border);
  border-radius:8px;overflow:hidden;
}
.preview-row{
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr 80px;
  padding:10px 14px;
  border-bottom:1px solid var(--border);
  font-size:12px;
  align-items:center;
}
.preview-row:last-child{border-bottom:none}
.preview-row.header{color:var(--text-dimmer);font-size:10px;text-transform:uppercase;letter-spacing:.06em}
.preview-row.header{background:rgba(255,255,255,.02)}
.tag-ver{
  display:inline-flex;align-items:center;gap:4px;
  background:rgba(12,192,223,.1);color:var(--cyan);
  border-radius:4px;padding:2px 7px;font-size:10px;
}
.score{
  width:28px;height:28px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:600;
  background:rgba(12,192,223,.15);color:var(--cyan);
}
.btn-reveal{
  background:rgba(12,192,223,.08);
  border:1px solid rgba(12,192,223,.2);
  color:var(--cyan);font-size:10px;
  padding:3px 8px;border-radius:4px;
  cursor:pointer;
}

/* ── LOGOS / SOCIAL PROOF ── */
.logos{
  padding:56px 24px;
  border-top:1px solid var(--border);
  border-bottom:1px solid var(--border);
  text-align:center;
}
.logos p{font-size:12px;color:var(--text-dimmer);letter-spacing:.06em;text-transform:uppercase;margin-bottom:28px}
.logos-row{
  display:flex;align-items:center;justify-content:center;
  gap:48px;flex-wrap:wrap;
  opacity:.35;filter:grayscale(1);
}
.logos-row span{font-size:16px;font-weight:600;color:#fff;letter-spacing:-0.5px}

/* ── FEATURES ── */
.features{
  max-width:1080px;margin:0 auto;
  padding:100px 24px;
}
.section-label{
  font-size:12px;color:var(--cyan);
  letter-spacing:.08em;text-transform:uppercase;
  margin-bottom:16px;
}
.section-title{
  font-size:clamp(28px,4vw,44px);
  font-weight:600;letter-spacing:-1.5px;
  color:#fff;line-height:1.1;
  margin-bottom:16px;
}
.section-sub{
  font-size:16px;color:var(--text-dim);
  max-width:480px;line-height:1.7;
  margin-bottom:64px;
}
.feat-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1px;
  background:var(--border);
  border:1px solid var(--border);
  border-radius:12px;overflow:hidden;
}
.feat-card{
  background:var(--bg);
  padding:32px 28px;
  transition:background .2s;
  position:relative;
  overflow:hidden;
}
.feat-card:hover{background:rgba(255,255,255,.018)}
.feat-card::before{
  content:'';
  position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--cyan),transparent);
  opacity:0;transition:opacity .3s;
}
.feat-card:hover::before{opacity:1}
.feat-icon{
  width:36px;height:36px;border-radius:8px;
  background:var(--cyan-dim);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:20px;
}
.feat-icon svg{color:var(--cyan)}
.feat-title{font-size:14px;font-weight:500;color:#fff;margin-bottom:8px}
.feat-desc{font-size:13px;color:var(--text-dim);line-height:1.65}

/* ── HOW IT WORKS ── */
.how{
  border-top:1px solid var(--border);
  padding:100px 24px;
}
.how-inner{max-width:1080px;margin:0 auto}
.steps-grid{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:0;margin-top:64px;
  position:relative;
}
.steps-grid::before{
  content:'';
  position:absolute;
  top:20px;left:12.5%;right:12.5%;
  height:1px;
  background:linear-gradient(90deg,transparent,var(--border-light) 20%,var(--border-light) 80%,transparent);
}
.step{padding:0 24px;position:relative}
.step-num{
  width:40px;height:40px;border-radius:50%;
  background:var(--surface);
  border:1px solid var(--border-light);
  display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:500;color:var(--cyan);
  margin:0 auto 24px;
  position:relative;z-index:1;
  transition:background .2s,border-color .2s;
}
.step:hover .step-num{background:var(--cyan-dim);border-color:rgba(12,192,223,.4)}
.step-title{font-size:14px;font-weight:500;color:#fff;margin-bottom:8px;text-align:center}
.step-desc{font-size:13px;color:var(--text-dim);line-height:1.65;text-align:center}

/* ── DUAL CTA ── */
.dual-cta{
  max-width:1080px;margin:0 auto;
  padding:0 24px 100px;
  display:grid;grid-template-columns:1fr 1fr;
  gap:16px;
}
.cta-card{
  background:var(--surface);
  border:1px solid var(--border-light);
  border-radius:12px;
  padding:40px;
  position:relative;overflow:hidden;
  transition:border-color .2s;
  text-decoration:none;
  display:block;
}
.cta-card:hover{border-color:rgba(12,192,223,.3)}
.cta-card.featured{
  background:var(--cyan);
  border-color:transparent;
}
.cta-card.featured:hover{border-color:transparent;opacity:.95}
.cta-card-label{font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:16px;font-weight:500}
.cta-card:not(.featured) .cta-card-label{color:var(--text-dimmer)}
.cta-card.featured .cta-card-label{color:rgba(0,0,0,.5)}
.cta-card-title{font-size:24px;font-weight:600;letter-spacing:-0.8px;margin-bottom:12px;line-height:1.2}
.cta-card:not(.featured) .cta-card-title{color:#fff}
.cta-card.featured .cta-card-title{color:#000}
.cta-card-desc{font-size:14px;line-height:1.7;margin-bottom:28px}
.cta-card:not(.featured) .cta-card-desc{color:var(--text-dim)}
.cta-card.featured .cta-card-desc{color:rgba(0,0,0,.6)}
.cta-card-btn{
  display:inline-flex;align-items:center;gap:8px;
  font-size:13px;font-weight:500;
  padding:8px 18px;border-radius:6px;
  transition:gap .15s;
}
.cta-card:not(.featured) .cta-card-btn{
  background:rgba(255,255,255,.06);color:#fff;
  border:1px solid var(--border-light);
}
.cta-card.featured .cta-card-btn{
  background:rgba(0,0,0,.12);color:#000;
}
.cta-card:hover .cta-card-btn{gap:12px}

/* ── PRICING ── */
.pricing{
  border-top:1px solid var(--border);
  padding:100px 24px;
}
.pricing-inner{max-width:1080px;margin:0 auto}
.period-toggle{
  display:flex;gap:2px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;padding:3px;
  width:fit-content;margin:0 auto 56px;
}
.period-btn{
  padding:6px 18px;border-radius:5px;
  font-size:13px;cursor:pointer;border:none;
  background:transparent;color:var(--text-dim);
  transition:all .15s;
}
.period-btn.active{background:rgba(255,255,255,.08);color:#fff}
.plans-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:780px;margin:0 auto}
.plan{
  background:var(--surface);
  border:1px solid var(--border-light);
  border-radius:12px;padding:32px;
  position:relative;
  transition:border-color .2s;
}
.plan:hover{border-color:rgba(12,192,223,.2)}
.plan.popular{border-color:rgba(12,192,223,.3);background:rgba(12,192,223,.03)}
.plan-badge{
  position:absolute;top:-1px;left:50%;transform:translateX(-50%);
  background:var(--cyan);color:#000;
  font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  padding:3px 12px;border-radius:0 0 6px 6px;
}
.plan-name{font-size:12px;color:var(--text-dim);letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px}
.plan-price{display:flex;align-items:flex-end;gap:4px;margin-bottom:4px}
.plan-amt{font-size:42px;font-weight:600;letter-spacing:-2px;color:#fff;line-height:1}
.plan-cur{font-size:16px;color:var(--text-dim);margin-bottom:6px}
.plan-period{font-size:12px;color:var(--text-dimmer);margin-bottom:28px}
.plan-divider{height:1px;background:var(--border);margin-bottom:24px}
.plan-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
.plan-features li{
  font-size:13px;color:var(--text-dim);
  display:flex;align-items:flex-start;gap:8px;line-height:1.5;
}
.plan-features li::before{
  content:'';width:4px;height:4px;border-radius:50%;
  background:var(--cyan);flex-shrink:0;margin-top:7px;
}
.plan-btn{
  display:block;text-align:center;
  padding:10px;border-radius:6px;
  font-size:13px;font-weight:500;
  text-decoration:none;transition:all .15s;
}
.plan-btn.outline{
  border:1px solid var(--border-light);color:#fff;
}
.plan-btn.outline:hover{border-color:rgba(12,192,223,.4);background:rgba(12,192,223,.05)}
.plan-btn.filled{
  background:var(--cyan);color:#000;
  box-shadow:0 0 24px rgba(12,192,223,.2);
}
.plan-btn.filled:hover{opacity:.9}

/* ── FOOTER ── */
footer{
  border-top:1px solid var(--border);
  padding:56px 32px 40px;
}
.footer-inner{
  max-width:1080px;margin:0 auto;
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;
}
.footer-brand p{font-size:13px;color:var(--text-dim);margin-top:16px;max-width:240px;line-height:1.7}
.footer-col h5{font-size:11px;color:var(--text-dimmer);letter-spacing:.07em;text-transform:uppercase;margin-bottom:16px}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px}
.footer-col a{font-size:13px;color:var(--text-dim);text-decoration:none;transition:color .15s}
.footer-col a:hover{color:#fff}
.footer-bottom{
  max-width:1080px;margin:40px auto 0;
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid var(--border);padding-top:20px;
}
.footer-bottom p{font-size:12px;color:var(--text-dimmer)}

/* ── ANIMATIONS ── */
@keyframes fadeUp{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}
.reveal{
  opacity:0;transform:translateY(24px);
  transition:opacity .6s ease,transform .6s ease;
}
.reveal.visible{opacity:1;transform:translateY(0)}

/* ── MOBILE ── */
@media(max-width:768px){
  nav .nav-links{display:none}
  .feat-grid{grid-template-columns:1fr}
  .steps-grid{grid-template-columns:1fr 1fr;gap:32px}
  .steps-grid::before{display:none}
  .dual-cta{grid-template-columns:1fr}
  .plans-grid{grid-template-columns:1fr}
  .footer-inner{grid-template-columns:1fr 1fr;gap:32px}
  .preview-body{grid-template-columns:1fr 1fr}
}
`}</style>
      <div dangerouslySetInnerHTML={{__html: `

<!-- NAV -->
<nav>
  <a href="#" class="nav-logo">
    <svg viewBox="19 143 340 89" xmlns="http://www.w3.org/2000/svg" height="24">
      <path fill="#0cc0df" d="M 180.414062 69.9375 L 163.515625 40.679688 L 156.066406 53.597656 L 169.222656 76.390625 C 170.410156 78.449219 172.582031 79.621094 174.816406 79.621094 C 175.910156 79.621094 177.019531 79.335938 178.035156 78.75 C 181.140625 76.960938 182.1875 73.027344 180.414062 69.9375 Z" transform="translate(19,143)"/>
      <path fill="#0cc0df" d="M 168.558594 24.605469 L 161.390625 37.015625 L 153.925781 49.933594 L 142.386719 69.921875 C 138.933594 75.914062 132.480469 79.640625 125.570312 79.640625 C 118.546875 79.640625 112.253906 76.007812 108.734375 69.921875 C 105.21875 63.851562 105.21875 56.574219 108.734375 50.488281 L 128.929688 15.539062 C 131.023438 11.910156 134.777344 9.738281 138.964844 9.738281 C 143.148438 9.738281 146.90625 11.910156 149.011719 15.539062 L 149.742188 16.808594 L 151.835938 20.421875 L 144.367188 33.339844 L 138.964844 23.988281 L 119.941406 56.941406 C 118.246094 59.875 119.371094 62.472656 119.941406 63.457031 C 120.511719 64.4375 122.195312 66.71875 125.585938 66.71875 C 127.898438 66.71875 130.070312 65.46875 131.210938 63.457031 L 146.476562 37.015625 L 153.941406 24.097656 L 157.367188 18.152344 C 159.15625 15.0625 163.105469 14 166.195312 15.792969 C 169.285156 17.566406 170.347656 21.515625 168.558594 24.605469 Z" transform="translate(19,143)"/>
      <path fill="#0cc0df" d="M 165.417969 9.261719 C 168.875 17.042969 180.398438 12.273438 177.355469 4.316406 C 173.882812 -3.449219 162.359375 1.320312 165.417969 9.261719 Z" transform="translate(19,143)"/>
      <g fill="#ffffff" transform="translate(19,143)">
        <path d="M 32.53125 -0.203125 C 28.519531 -0.203125 24.753906 -0.957031 21.234375 -2.46875 C 17.722656 -3.976562 14.625 -6.070312 11.9375 -8.75 C 9.25 -11.4375 7.148438 -14.550781 5.640625 -18.09375 C 4.128906 -21.632812 3.375 -25.410156 3.375 -29.421875 C 3.375 -33.429688 4.128906 -37.195312 5.640625 -40.71875 C 7.148438 -44.238281 9.25 -47.335938 11.9375 -50.015625 C 14.625 -52.703125 17.722656 -54.800781 21.234375 -56.3125 C 24.753906 -57.820312 28.519531 -58.578125 32.53125 -58.578125 C 38.757812 -58.578125 44.375 -56.796875 49.375 -53.234375 C 50.414062 -52.515625 51.035156 -51.554688 51.234375 -50.359375 C 51.441406 -49.160156 51.179688 -48.046875 50.453125 -47.015625 C 49.734375 -46.015625 48.773438 -45.410156 47.578125 -45.203125 C 46.390625 -45.003906 45.273438 -45.242188 44.234375 -45.921875 C 40.722656 -48.398438 36.820312 -49.640625 32.53125 -49.640625 C 29.738281 -49.640625 27.125 -49.117188 24.6875 -48.078125 C 22.25 -47.046875 20.09375 -45.59375 18.21875 -43.71875 C 16.351562 -41.851562 14.898438 -39.703125 13.859375 -37.265625 C 12.828125 -34.835938 12.3125 -32.222656 12.3125 -29.421875 C 12.3125 -26.628906 12.828125 -24.003906 13.859375 -21.546875 C 14.898438 -19.085938 16.351562 -16.929688 18.21875 -15.078125 C 20.09375 -13.234375 22.25 -11.78125 24.6875 -10.71875 C 27.125 -9.65625 29.738281 -9.125 32.53125 -9.125 C 34.96875 -9.125 37.320312 -9.539062 39.59375 -10.375 C 41.875 -11.21875 43.914062 -12.425781 45.71875 -14 C 46.664062 -14.769531 47.75 -15.109375 48.96875 -15.015625 C 50.1875 -14.921875 51.203125 -14.425781 52.015625 -13.53125 C 52.785156 -12.582031 53.125 -11.5 53.03125 -10.28125 C 52.9375 -9.0625 52.441406 -8.046875 51.546875 -7.234375 C 48.929688 -4.984375 45.976562 -3.25 42.6875 -2.03125 C 39.394531 -0.8125 36.007812 -0.203125 32.53125 -0.203125 Z" transform="translate(0.96, 74.31)"/>
        <path d="M 7.84375 -0.34375 C 6.582031 -0.34375 5.519531 -0.769531 4.65625 -1.625 C 3.800781 -2.476562 3.375 -3.535156 3.375 -4.796875 L 3.375 -54.1875 C 3.375 -55.445312 3.800781 -56.503906 4.65625 -57.359375 C 5.519531 -58.210938 6.582031 -58.640625 7.84375 -58.640625 C 9.0625 -58.640625 10.109375 -58.210938 10.984375 -57.359375 C 11.867188 -56.503906 12.3125 -55.445312 12.3125 -54.1875 L 12.3125 -9.203125 L 39.96875 -9.203125 C 41.1875 -9.203125 42.234375 -8.769531 43.109375 -7.90625 C 43.992188 -7.050781 44.4375 -6.015625 44.4375 -4.796875 C 44.4375 -3.535156 43.992188 -2.476562 43.109375 -1.625 C 42.234375 -0.769531 41.1875 -0.34375 39.96875 -0.34375 Z" transform="translate(57.38, 74.31)"/>
        <path d="M 3.375 -0.265625 L 3.375 -58.109375 L 39.234375 -58.109375 C 40.453125 -58.109375 41.5 -57.675781 42.375 -56.8125 C 43.257812 -55.957031 43.703125 -54.898438 43.703125 -53.640625 C 43.703125 -52.421875 43.257812 -51.367188 42.375 -50.484375 C 41.5 -49.609375 40.453125 -49.171875 39.234375 -49.171875 L 12.3125 -49.171875 L 12.3125 -38.078125 L 32.53125 -38.078125 C 33.789062 -38.078125 34.847656 -37.648438 35.703125 -36.796875 C 36.566406 -35.941406 37 -34.882812 37 -33.625 C 37 -32.40625 36.566406 -31.351562 35.703125 -30.46875 C 34.847656 -29.59375 33.789062 -29.15625 32.53125 -29.15625 L 12.3125 -29.15625 L 12.3125 -9.125 L 39.234375 -9.125 C 40.453125 -9.125 41.5 -8.695312 42.375 -7.84375 C 43.257812 -6.988281 43.703125 -5.953125 43.703125 -4.734375 C 43.703125 -3.472656 43.257812 -2.410156 42.375 -1.546875 C 41.5 -0.691406 40.453125 -0.265625 39.234375 -0.265625 Z" transform="translate(182.2, 74.31)"/>
        <path d="M 3.375 -0.203125 L 3.375 -54.109375 C 3.375 -55.054688 3.65625 -55.925781 4.21875 -56.71875 C 4.789062 -57.507812 5.523438 -58.0625 6.421875 -58.375 C 7.328125 -58.644531 8.238281 -58.632812 9.15625 -58.34375 C 10.082031 -58.050781 10.84375 -57.519531 11.4375 -56.75 L 39.703125 -18.265625 L 39.703125 -58.578125 L 48.640625 -58.578125 L 48.640625 -4.671875 C 48.640625 -3.722656 48.34375 -2.851562 47.75 -2.0625 C 47.164062 -1.269531 46.421875 -0.738281 45.515625 -0.46875 C 45.160156 -0.289062 44.710938 -0.203125 44.171875 -0.203125 C 42.722656 -0.203125 41.523438 -0.8125 40.578125 -2.03125 L 12.3125 -40.515625 L 12.3125 -0.203125 Z" transform="translate(229.28, 74.31)"/>
        <path d="M 23.140625 -0.140625 L 23.140625 -49.109375 L 7.84375 -49.109375 C 6.582031 -49.109375 5.519531 -49.535156 4.65625 -50.390625 C 3.800781 -51.242188 3.375 -52.304688 3.375 -53.578125 C 3.375 -54.785156 3.800781 -55.816406 4.65625 -56.671875 C 5.519531 -57.535156 6.582031 -57.96875 7.84375 -57.96875 L 46.875 -57.96875 C 48.132812 -57.96875 49.191406 -57.535156 50.046875 -56.671875 C 50.910156 -55.816406 51.34375 -54.785156 51.34375 -53.578125 C 51.34375 -52.304688 50.910156 -51.242188 50.046875 -50.390625 C 49.191406 -49.535156 48.132812 -49.109375 46.875 -49.109375 L 32.0625 -49.109375 L 32.0625 -0.140625 Z" transform="translate(281.3, 74.31)"/>
      </g>
    </svg>
  </a>
  <div class="nav-links">
    <a href="#producto">Producto</a>
    <a href="#como-funciona">Cómo funciona</a>
    <a href="#precios">Precios</a>
  </div>
  <div class="nav-actions">
    <a href="/login" class="btn-ghost">Iniciar sesión</a>
    <a href="/planes" class="btn-primary">Comenzar →</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-grid"></div>

  <div class="hero-badge">
    <div class="badge-dot"></div>
    <span>B2B Customer Acquisition · México & LATAM</span>
  </div>

  <h1>La forma más inteligente<br>de encontrar <em>clientes B2B</em></h1>

  <p>Busca empresas y contactos clave en México y LATAM. Datos verificados de múltiples fuentes, scoring con IA y exportación instantánea.</p>

  <div class="hero-cta">
    <a href="/planes" class="cta-main">Comenzar ahora</a>
    <a href="#producto" class="cta-sec">
      Ver el producto
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>
  </div>

  <!-- APP PREVIEW -->
  <div class="preview-wrap">
    <div class="preview-glow"></div>
    <div class="preview-frame">
      <div class="preview-bar">
        <div class="preview-dot" style="background:#ff5f57"></div>
        <div class="preview-dot" style="background:#febc2e"></div>
        <div class="preview-dot" style="background:#28c840"></div>
        <div class="preview-url">www.findmyclaient.com</div>
      </div>
      <div class="preview-body">
        <div class="preview-metric">
          <div class="preview-metric-label">Total Empresas</div>
          <div class="preview-metric-val">2,847</div>
        </div>
        <div class="preview-metric">
          <div class="preview-metric-label">Contactos</div>
          <div class="preview-metric-val">1,203</div>
        </div>
        <div class="preview-metric">
          <div class="preview-metric-label">Emails Verificados</div>
          <div class="preview-metric-val">894</div>
        </div>
        <div class="preview-metric">
          <div class="preview-metric-label">Créditos</div>
          <div class="preview-metric-val" style="color:#e8e8e8">980</div>
        </div>
        <div class="preview-table">
          <div class="preview-row header">
            <span>Empresa</span><span>Ciudad</span><span>Cargo</span><span>Email</span><span>Score</span>
          </div>
          <div class="preview-row">
            <span style="font-size:12px;color:#e8e8e8;font-weight:500">Transportes García SA</span>
            <span style="color:#6b7280">Monterrey</span>
            <span style="color:#6b7280">Gte. RH</span>
            <span><div class="tag-ver">✓ Verificado</div></span>
            <span><div class="score">94</div></span>
          </div>
          <div class="preview-row">
            <span style="font-size:12px;color:#e8e8e8;font-weight:500">Grupo Constructor Arco</span>
            <span style="color:#6b7280">CDMX</span>
            <span style="color:#6b7280">Dir. Compras</span>
            <span><button class="btn-reveal">Revelar · 1 crédito</button></span>
            <span><div class="score">91</div></span>
          </div>
          <div class="preview-row">
            <span style="font-size:12px;color:#e8e8e8;font-weight:500">Manufactura Precision MX</span>
            <span style="color:#6b7280">Guadalajara</span>
            <span style="color:#6b7280">Gte. Logística</span>
            <span><button class="btn-reveal">Revelar · 1 crédito</button></span>
            <span><div class="score">86</div></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- LOGOS -->
<div class="logos reveal">
  <p>Fuentes de datos integradas</p>
  <div class="logos-row">
    <span>Apollo.io</span>
    <span>Google Maps</span>
    <span>LinkedIn</span>
    <span>Hunter.io</span>
    <span>IMSS</span>
    <span>SAT</span>
  </div>
</div>

<!-- FEATURES -->
<section class="features reveal" id="producto">
  <div class="section-label">Producto</div>
  <h2 class="section-title">Todo lo que necesitas<br>para prospectar en México</h2>
  <p class="section-sub">Una sola plataforma que agrega datos de múltiples fuentes, los enriquece con IA y te entrega prospectos listos para contactar.</p>

  <div class="feat-grid">
    <div class="feat-card">
      <div class="feat-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </div>
      <div class="feat-title">Búsqueda inteligente</div>
      <div class="feat-desc">Busca por industria, cargo, ubicación, tamaño de empresa y más de 15 filtros. Resultados en tiempo real de múltiples fuentes.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <div class="feat-title">Búsqueda por ubicación</div>
      <div class="feat-desc">Detecta tu ubicación GPS o escribe una dirección exacta. Encuentra corporativos y empresas en un radio de 200m a 50km.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="feat-title">Contactos verificados</div>
      <div class="feat-desc">Nombre, cargo, empresa actual, email y teléfono verificados. Solo pagas créditos cuando necesitas el dato de contacto.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      </div>
      <div class="feat-title">Scoring con IA</div>
      <div class="feat-desc">Cada lead recibe un score 0-100 basado en completitud de datos, industria target y calidad del contacto. Prioriza los mejores.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </div>
      <div class="feat-title">Exportación instantánea</div>
      <div class="feat-desc">Exporta a CSV con un clic. Solo incluye los datos que ya revelaste. Compatible con Salesforce, HubSpot y cualquier CRM.</div>
    </div>
    <div class="feat-card">
      <div class="feat-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      </div>
      <div class="feat-title">Panel de administrador</div>
      <div class="feat-desc">Para equipos Business: supervisa qué buscan tus vendedores, distribuye créditos por usuario y revisa reportes semanales de uso.</div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="how reveal" id="como-funciona">
  <div class="how-inner">
    <div class="section-label">Cómo funciona</div>
    <h2 class="section-title">De cero a tu primer prospecto<br>en menos de 5 minutos</h2>
    <div class="steps-grid">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-title">Describe tu cliente ideal</div>
        <div class="step-desc">Selecciona industria, tamaño de empresa, cargo del contacto y ubicación geográfica.</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-title">CLAIENT busca y califica</div>
        <div class="step-desc">Consultamos Apollo, Google Maps, LinkedIn e IMSS simultáneamente y entregamos resultados con score automático.</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-title">Revela los datos que necesitas</div>
        <div class="step-desc">Solo pagas créditos por los emails y teléfonos que realmente vas a usar. 1 crédito por dato.</div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-title">Exporta y contacta</div>
        <div class="step-desc">Descarga el CSV con tus prospectos e impórtalo directamente a tu CRM o herramienta de outreach.</div>
      </div>
    </div>
  </div>
</section>

<!-- DUAL CTA -->
<div class="dual-cta reveal">
  <a href="/planes" class="cta-card featured">
    <div class="cta-card-label">Para empresas que venden</div>
    <div class="cta-card-title">Empieza a encontrar<br>clientes hoy</div>
    <div class="cta-card-desc">Accede a millones de empresas y contactos verificados en México. Sin contratos anuales. Factura CFDI incluida.</div>
    <div class="cta-card-btn">Ver planes y precios →</div>
  </a>
  <a href="/registro" class="cta-card">
    <div class="cta-card-label">Para empresas que quieren ser encontradas</div>
    <div class="cta-card-title">Registra tu empresa<br>en nuestra base de datos</div>
    <div class="cta-card-desc">Aparece primero en las búsquedas de compradores B2B activos. Registro gratuito, sin compromisos.</div>
    <div class="cta-card-btn" style="color:var(--text);border-color:var(--border-light)">Registrar mi empresa →</div>
  </a>
</div>

<!-- PRICING -->
<section class="pricing reveal" id="precios">
  <div class="pricing-inner">
    <div style="text-align:center">
      <div class="section-label" style="display:inline-block">Precios</div>
      <h2 class="section-title" style="margin-top:16px">Simple. Sin letra pequeña.</h2>
      <p class="section-sub" style="margin:16px auto 40px">Todos los planes incluyen factura CFDI en pesos mexicanos.</p>
    </div>

    <div class="period-toggle">
      <button class="period-btn active" onclick="setPeriod('mensual',this)">Mensual</button>
      <button class="period-btn" onclick="setPeriod('semestral',this)">6 meses</button>
      <button class="period-btn" onclick="setPeriod('anual',this)">Anual</button>
    </div>

    <div class="plans-grid">
      <div class="plan">
        <div class="plan-name">Pro</div>
        <div class="plan-price">
          <span class="plan-amt" id="pro-price">\$999</span>
          <span class="plan-cur">MXN</span>
        </div>
        <div class="plan-period" id="pro-period">+ IVA · por mes · 1 usuario</div>
        <div class="plan-divider"></div>
        <ul class="plan-features">
          <li>100 búsquedas al mes</li>
          <li>Exportaciones ilimitadas</li>
          <li>Todos los filtros disponibles</li>
          <li>1,000 créditos incluidos</li>
          <li>Email y teléfono por crédito</li>
          <li>Búsqueda por geolocalización</li>
          <li>Búsquedas guardadas</li>
        </ul>
        <a href="/planes" class="plan-btn outline">Contratar Pro</a>
      </div>

      <div class="plan popular">
        <div class="plan-badge">Más popular</div>
        <div class="plan-name">Business</div>
        <div class="plan-price">
          <span class="plan-amt" id="biz-price">\$4,999</span>
          <span class="plan-cur">MXN</span>
        </div>
        <div class="plan-period" id="biz-period">+ IVA · por mes · 5 usuarios</div>
        <div class="plan-divider"></div>
        <ul class="plan-features">
          <li>600 búsquedas al mes</li>
          <li>Exportaciones ilimitadas</li>
          <li>Todos los filtros disponibles</li>
          <li>6,000 créditos incluidos</li>
          <li>5 usuarios (1 administrador)</li>
          <li>Panel de administrador completo</li>
          <li>Reportes semanales de uso</li>
          <li>Distribución de créditos por usuario</li>
          <li>Usuario extra: +\$500 MXN</li>
        </ul>
        <a href="/planes" class="plan-btn filled">Contratar Business</a>
      </div>
    </div>

    <p style="text-align:center;font-size:13px;color:var(--text-dimmer);margin-top:24px">
      ¿Necesitas probar primero? El plan Free incluye 5 búsquedas y 10 créditos.
      <a href="/planes" style="color:var(--cyan);text-decoration:none"> Comenzar gratis →</a>
    </p>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="https://findmyclaient.com/1.svg" alt="CLAIENT" style="height:20px;filter:brightness(1)" onerror="this.style.display='none'">
      <p>La plataforma de adquisición B2B construida para México y LATAM.</p>
    </div>
    <div class="footer-col">
      <h5>Producto</h5>
      <ul>
        <li><a href="#producto">Buscador B2B</a></li>
        <li><a href="#como-funciona">Cómo funciona</a></li>
        <li><a href="#precios">Precios</a></li>
        <li><a href="/login">Iniciar sesión</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="#">Nosotros</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h5>Legal</h5>
      <ul>
        <li><a href="#">Privacidad</a></li>
        <li><a href="#">Términos</a></li>
        <li><a href="#">LFPDPPP</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 CLAIENT · findmyclaient.com</p>
    <p>Hecho en México 🇲🇽</p>
  </div>
</footer>

<script>
// Precios por periodo
const precios = {
  mensual:   { pro: '\$999',   proPeriod: '+ IVA · mensual · 1 usuario',    biz: '\$4,999',  bizPeriod: '+ IVA · mensual · 5 usuarios' },
  semestral: { pro: '\$4,999', proPeriod: '+ IVA · 6 meses · ahorra \$995',  biz: '\$25,000', bizPeriod: '+ IVA · 6 meses · ahorra \$4,994' },
  anual:     { pro: '\$9,000', proPeriod: '+ IVA · anual · ahorra \$2,988',  biz: '\$45,000', bizPeriod: '+ IVA · anual · ahorra \$14,988' },
}
function setPeriod(p, btn) {
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  document.getElementById('pro-price').textContent = precios[p].pro
  document.getElementById('pro-period').textContent = precios[p].proPeriod
  document.getElementById('biz-price').textContent = precios[p].biz
  document.getElementById('biz-period').textContent = precios[p].bizPeriod
}

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
}, { threshold: 0.08 })
document.querySelectorAll('.reveal').forEach(el => obs.observe(el))

// Nav scroll
const nav = document.querySelector('nav')
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 40
    ? 'rgba(8,9,10,0.92)'
    : 'rgba(8,9,10,0.7)'
}, { passive: true })
</script>
`}} />
    </>
  )
}