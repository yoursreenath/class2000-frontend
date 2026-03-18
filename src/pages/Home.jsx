import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import groupPhoto from '../assets/group-photo.jpg'

const memories = [
  'Hiding report cards from our parents…',
  'Sharing answers in whispers before the teacher noticed…',
  'Swapping tiffin boxes at the lunch bell…',
  'Racing to grab the last bench every morning…',
  'Counting down the days to summer holidays…',
  'Writing nonsense in each other\'s slam books…',
  'The Annual Day rehearsals that went on forever…',
]

const highlights = [
  { icon: '👥', number: '4', label: 'Get-Togethers', sub: 'since passing out' },
  { icon: '🎓', number: '16', label: 'Teachers', sub: 'honoured by us' },
  { icon: '🏫', number: '25', label: 'Years', sub: 'of friendship' },
  { icon: '❤️', number: '1', label: 'School', sub: 'ZP High School, KV Palli' },
]

const moments = [
  { emoji: '📚', text: 'Last Bench Gang' },
  { emoji: '🍱', text: 'Tiffin Swaps' },
  { emoji: '🎭', text: 'Annual Day' },
  { emoji: '🏃', text: 'Sports Day' },
  { emoji: '✏️', text: 'Slam Books' },
  { emoji: '🔬', text: 'Science Fair' },
  { emoji: '🤝', text: 'Forever Friends' },
  { emoji: '📝', text: 'Board Exams' },
  { emoji: '🔔', text: 'School Bell' },
  { emoji: '🎒', text: 'School Bag' },
  { emoji: '💌', text: 'Farewell Notes' },
]

export default function Home() {
  const [tick, setTick] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTick(p => (p + 1) % memories.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&display=swap');

        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes tickIn   { from{opacity:0.3;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes underline{ from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* ── PAGE WRAPPER ── */
        .hm {
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 110px);
          margin: 0;
          padding: 0;
        }

        /* ── HERO SECTION ── */
        .hm-hero {
          display: grid;
          grid-template-columns: 42% 58%;
          gap: 0;
          align-items: stretch;
          height: 420px;
        }

        /* LEFT — content */
        .hm-left {
          padding: 20px 40px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: center;
          background: #ffffff;
          animation: fadeUp .6s ease both;
          overflow: hidden;
        }

        .hm-live {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 999px; padding: 3px 12px 3px 8px;
          width: fit-content;
        }
        .hm-live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,.22);
          animation: pulse 2s ease infinite;
        }
        .hm-live span {
          font-size: 10px; font-weight: 600; letter-spacing: .12em;
          text-transform: uppercase; color: #15803d;
        }

        .hm-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.7rem, 2.6vw, 2.6rem);
          font-weight: 700;
          color: #111827;
          line-height: 1.12;
          margin: 0;
        }
        .hm-h1 em {
          font-style: italic;
          color: #15803d;
          display: block;
          position: relative;
          width: fit-content;
        }
        .hm-h1 em::after {
          content: '';
          position: absolute; left: 0; bottom: -4px;
          height: 2.5px; width: 100%;
          background: linear-gradient(90deg, #16a34a, #4ade80, transparent);
          border-radius: 2px; transform-origin: left;
          animation: underline .7s ease .5s both;
        }

        .hm-ticker {
          overflow: hidden;
          border-left: 3px solid #16a34a;
          padding: 5px 12px;
          background: #f0fdf4;
          border-radius: 0 4px 4px 0;
        }
        .hm-ticker-line {
          font-family: 'Caveat', cursive;
          font-size: 14px;
          color: #15803d;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          animation: tickIn .4s ease both;
          opacity: 1;
        }

        .hm-story {
          font-size: 12.5px;
          line-height: 1.65;
          color: #4b5563;
          max-width: 480px;
        }
        .hm-story strong { color: #14532d; }

        .hm-cta {
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .btn-hero-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: 8px;
          background: linear-gradient(135deg, #14532d, #16a34a);
          color: white; font-size: 13px; font-weight: 600;
          letter-spacing: .03em; text-decoration: none; border: none; cursor: pointer;
          box-shadow: 0 4px 16px rgba(22,163,74,.35);
          transition: all .2s;
        }
        .btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(22,163,74,.45); }
        .btn-hero-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 8px;
          background: #f9fafb; color: #374151;
          font-size: 13px; font-weight: 600;
          text-decoration: none; border: 1.5px solid #e5e7eb; cursor: pointer;
          transition: all .2s;
        }
        .btn-hero-ghost:hover { background: #f0fdf4; border-color: #16a34a; color: #14532d; }

        /* PHOTO — natural aspect ratio, side by side */
        .hm-right {
          position: relative;
          background: #1a1a1a;
          overflow: hidden;
          animation: fadeIn .7s ease .2s both;
          border-left: 3px solid #14532d;
        }
        .hm-right img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
          display: block;
          filter: contrast(1.04) brightness(.98);
          transition: transform .6s ease;
          background: #1a1a1a;
        }
        .hm-right:hover img { transform: scale(1.02); }
        .hm-right-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,.80) 0%, transparent 60%);
          padding: 40px 28px 18px;
          display: flex; align-items: flex-end; justify-content: space-between;
        }
        .hm-right-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 700; color: white;
        }
        .hm-right-sub {
          font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
          color: rgba(255,255,255,.55); margin-top: 3px;
        }
        .hm-yr-badge {
          background: #14532d; color: #86efac;
          font-family: 'Libre Baskerville', serif;
          font-size: 12px; font-weight: 700; letter-spacing: .08em;
          padding: 5px 14px; border-radius: 4px; flex-shrink: 0;
        }

        /* ── STATS BAND ── */
        .hm-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          animation: fadeUp .6s ease .2s both;
        }
        .stat-item {
          padding: 28px 20px;
          text-align: center;
          border-right: 1px solid #e5e7eb;
          transition: background .2s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: #f0fdf4; }
        .stat-icon { font-size: 26px; margin-bottom: 8px; }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem; font-weight: 700;
          color: #16a34a; line-height: 1;
        }
        .stat-label {
          font-size: 12px; font-weight: 600; color: #111827;
          margin-top: 4px; text-transform: uppercase; letter-spacing: .08em;
        }
        .stat-sub {
          font-size: 11px; color: #9ca3af; margin-top: 3px;
        }

        /* ── ABOUT SECTION ── */
        .hm-about {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .hm-about-left {
          padding: 56px 48px;
          border-right: 1px solid #e5e7eb;
          animation: fadeUp .6s ease .15s both;
        }
        .hm-about-right {
          padding: 56px 48px;
          background: #f9fafb;
          animation: fadeUp .6s ease .25s both;
        }
        .section-tag {
          font-size: 10.5px; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: #16a34a;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px;
        }
        .section-tag::before {
          content: ''; width: 24px; height: 2px;
          background: #16a34a; border-radius: 2px;
        }
        .section-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 700;
          color: #111827; line-height: 1.2;
          margin: 0 0 20px;
        }
        .section-body {
          font-size: 14.5px; line-height: 1.90; color: #6b7280;
        }
        .section-body p { margin: 0 0 14px; }
        .section-body p:last-child { margin: 0; }
        .section-body strong { color: #111827; font-weight: 600; }

        /* About list */
        .about-list { list-style: none; padding: 0; margin: 20px 0 0; display: flex; flex-direction: column; gap: 12px; }
        .about-list li {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 13.5px; color: #4b5563; line-height: 1.6;
        }
        .about-list li span.icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }

        /* ── MEMORIES STRIP ── */
        .hm-strip {
          background: #14532d;
          padding: 18px 48px;
          display: flex;
          align-items: center;
          gap: 20px;
          overflow-x: auto;
        }
        .strip-label {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 13px;
          color: rgba(255,255,255,.40); white-space: nowrap;
          border-right: 1px solid rgba(255,255,255,.12);
          padding-right: 20px; flex-shrink: 0;
        }
        .strip-chips { display: flex; gap: 8px; flex-wrap: nowrap; }
        .s-chip {
          font-size: 12px; color: rgba(255,255,255,.60);
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px; padding: 5px 14px;
          white-space: nowrap; cursor: default;
          transition: all .2s;
        }
        .s-chip:hover { color: #86efac; background: rgba(134,239,172,.12); border-color: rgba(134,239,172,.25); }

        /* ── RESPONSIVE ── */
        @media (max-width: 800px) {
          .hm-hero {
            grid-template-columns: 1fr;
            height: auto;
          }
          .hm-left {
            padding: 24px 20px 20px;
            gap: 12px;
          }
          .hm-right {
            height: auto;
            border-left: none;
            border-top: 3px solid #14532d;
          }
          .hm-right img {
            position: static;
            width: 100%;
            height: auto;
            object-fit: contain;
          }
          .hm-right-overlay {
            position: relative;
            background: #14532d;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .hm-right-title { font-size: 13px; }
          .hm-right-sub   { display: none; }
          .hm-yr-badge    { font-size: 11px; padding: 4px 10px; }
          .hm-stats { grid-template-columns: repeat(2,1fr); }
          .hm-about { grid-template-columns: 1fr; }
          .hm-about-left { padding: 28px 20px; border-right: none; border-bottom: 1px solid #e5e7eb; }
          .hm-about-right { padding: 28px 20px; }
          .hm-strip { padding: 12px 20px; }
          .hm-h1 { font-size: clamp(1.6rem, 6vw, 2.2rem); }
          .hm-story { font-size: 12px; line-height: 1.65; }
          .btn-hero-primary, .btn-hero-ghost { padding: 9px 16px; font-size: 12px; }
        }
      `}</style>

      <div className="hm">

        {/* ── HERO ── */}
        <div className="hm-hero">

          {/* LEFT */}
          <div className="hm-left">
            <div className="hm-live">
              <div className="hm-live-dot"/>
              <span>ZP High School · Class of 2000 · Live</span>
            </div>

            <h1 className="hm-h1">
              Twenty-five years later,<br/>
              <em>we're all back home.</em>
            </h1>

            <div className="hm-ticker">
              <div key={tick} className="hm-ticker-line">{memories[tick]}</div>
            </div>

            <p className="hm-story">
              Those four walls of <strong>ZP High School, KV Palli</strong> held our biggest
              secrets, our loudest laughs and our first real friendships. We shared benches,
              borrowed pens, swapped tiffins and made memories that no textbook could ever contain.
              <br/><br/>
              Twenty-five years on — life has taken us across cities, careers and families.
              But here, in this little corner of the internet,{' '}
              <strong>we are all still seventeen.</strong>
            </p>

            <div className="hm-cta">
              <Link to="/members" className="btn-hero-primary">👥 Meet the Classmates</Link>
              <Link to="/gallery"  className="btn-hero-ghost">📸 View Gallery</Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hm-right">
            {!imgLoaded && (
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(90deg,#f0fdf4 25%,#dcfce7 50%,#f0fdf4 75%)',
                backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite',
              }}/>
            )}
            <img src={groupPhoto} alt="ZP High School KV Palli Class of 2000"
              onLoad={() => setImgLoaded(true)}
              style={{ opacity: imgLoaded ? 1 : 0, transition:'opacity .4s' }}/>
            <div className="hm-right-overlay">
              <div>
                <div className="hm-right-title">ZP High School, KV Palli — Batch 1999–2000</div>
                <div className="hm-right-sub">Our class · Together again after 25 years</div>
              </div>
              <div className="hm-yr-badge">✦ Class of 2000 ✦</div>
            </div>
          </div>
        </div>

        {/* ── STATS BAND ── */}
        <div className="hm-stats">
          {highlights.map(h => (
            <div key={h.label} className="stat-item">
              <div className="stat-icon">{h.icon}</div>
              <div className="stat-num">{h.number}</div>
              <div className="stat-label">{h.label}</div>
              <div className="stat-sub">{h.sub}</div>
            </div>
          ))}
        </div>

        {/* ── ABOUT SECTION ── */}
        <div className="hm-about">
          <div className="hm-about-left">
            <div className="section-tag">Our Story</div>
            <h2 className="section-h2">A school that gave us<br/>more than education</h2>
            <div className="section-body">
              <p>
                ZP High School, KV Palli was not just a place we studied — it was the place
                where we grew up. From our first day in uniform to the last day we walked
                those corridors, every moment became a memory we carry for life.
              </p>
              <p>
                Our teachers gave us knowledge, discipline and love in equal measure.
                Our classmates gave us friendship, mischief and a sense of belonging
                that no distance can erase.
              </p>
              <p>
                This portal is our way of keeping that bond alive — a place where the
                <strong> Class of 2000 stays connected, celebrates together and never forgets.</strong>
              </p>
            </div>
            <ul className="about-list">
              <li><span className="icon">🏫</span><span>Passed out in the year <strong>2000</strong> from ZP High School, KV Palli</span></li>
              <li><span className="icon">🤝</span><span><strong>4 get-togethers</strong> organised since passing out — growing stronger each time</span></li>
              <li><span className="icon">🎓</span><span>Felicitated <strong>16 beloved teachers</strong> at our 3rd get-together with love and gratitude</span></li>
              <li><span className="icon">❤️</span><span>Raised <strong>₹1,50,000</strong> for school infrastructure and our fallen classmates' children</span></li>
            </ul>
          </div>

          <div className="hm-about-right">
            <div className="section-tag">Our Get-Togethers</div>
            <h2 className="section-h2">Four reunions,<br/>a lifetime of memories</h2>
            <div className="section-body">
              {[
                { num:'01', year:'Oct 2021', title:'First Get-Together', desc:'12 classmates reunited at our school after 21 long years. We shared memories, enjoyed Biryani and promised to meet again — and we did.' },
                { num:'02', year:'May 2022', title:'Second Get-Together', desc:'25 classmates gathered for a day of games — Musical Chairs, Balloon Balance, Tug of War — followed by great food and Antakshari.' },
                { num:'03', year:'2023',     title:'Teachers\' Get-Together', desc:'Our most emotional day — 40 classmates and 16 teachers together. We felicitated every teacher and shared a wonderful lunch together.' },
                { num:'04', year:'May 2025', title:'Fourth Get-Together', desc:'24 classmates, unexpected rain, Tug of War and Antakshari. The rain made it even more magical. More get-togethers to come!' },
              ].map(ev => (
                <div key={ev.num} style={{
                  display:'flex', gap:16, padding:'16px 0',
                  borderBottom:'1px solid #f3f4f6',
                }}>
                  <div style={{
                    width:36, height:36, borderRadius:8, flexShrink:0,
                    background:'#f0fdf4', border:'1px solid #bbf7d0',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:13, fontWeight:700, color:'#15803d',
                  }}>{ev.num}</div>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                      <span style={{fontWeight:600,fontSize:13.5,color:'#111827'}}>{ev.title}</span>
                      <span style={{fontSize:10.5,background:'#f0fdf4',color:'#15803d',border:'1px solid #bbf7d0',borderRadius:3,padding:'1px 7px',fontWeight:600}}>{ev.year}</span>
                    </div>
                    <p style={{fontSize:13,color:'#6b7280',margin:0,lineHeight:1.65}}>{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MEMORIES STRIP ── */}
        <div className="hm-strip">
          <span className="strip-label">Our memories</span>
          <div className="strip-chips">
            {moments.map(m => (
              <span key={m.text} className="s-chip">{m.emoji} {m.text}</span>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
