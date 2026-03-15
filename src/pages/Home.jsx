import { useEffect, useState } from "react";
import groupPhoto from "../assets/group-photo.jpg";

const memories = [
  "Remember rushing to grab the last bench…",
  "Sharing answers in whispers before the teacher noticed…",
  "Swapping tiffin boxes at the lunch bell…",
  "Hiding report cards from our parents…",
  "Counting down the days to summer holidays…",
  "Writing nonsense in each other's slam books…",
  "The Annual Day rehearsals that went on forever…",
];

const floaters = [
  { text: "📚 Last Bench", top: "11%", left: "3%", delay: "0s", dur: "7s" },
  {
    text: "🍱 Tiffin Box",
    top: "18%",
    right: "4%",
    delay: "1.4s",
    dur: "8.5s",
  },
  { text: "✏️ Slam Book", top: "62%", left: "2%", delay: "0.8s", dur: "9s" },
  { text: "🏆 Champions", top: "70%", right: "3%", delay: "2.2s", dur: "7.5s" },
  { text: "🎭 Annual Day", top: "4%", left: "52%", delay: "1.9s", dur: "8s" },
  { text: "🔔 School Bell", top: "82%", left: "42%", delay: "0.5s", dur: "7s" },
  { text: "📝 Board Exams", top: "38%", right: "2%", delay: "3s", dur: "9.5s" },
  { text: "🎒 School Bag", top: "48%", left: "1%", delay: "1.1s", dur: "8s" },
];

export default function Home() {
  const [tick, setTick] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setInterval(
      () => setTick((p) => (p + 1) % memories.length),
      3500,
    );
    setTimeout(() => setVisible(true), 80);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Caveat:wght@600;700&display=swap');

        /* ── KEYFRAMES ── */
        @keyframes shimmer     { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes floatDrift  { 0%,100%{transform:translateY(0) rotate(-1deg);opacity:.50} 50%{transform:translateY(-16px) rotate(1.5deg);opacity:.80} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes typeSlide   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes underlineIn { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes countPop    { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes shimmerBtn  { 0%{left:-100%} 100%{left:160%} }
        @keyframes glowRing    { 0%,100%{box-shadow:0 0 0 0 rgba(240,192,96,.0)} 50%{box-shadow:0 0 0 6px rgba(240,192,96,.18)} }
        @keyframes framePulse  { 0%,100%{box-shadow:0 8px 48px rgba(44,26,8,.28),0 0 0 6px #fffdf5,0 0 0 8px #e8c97a,0 0 0 10px rgba(217,119,6,.15)} 50%{box-shadow:0 12px 60px rgba(44,26,8,.36),0 0 0 6px #fffdf5,0 0 0 8px #f0c060,0 0 0 12px rgba(240,192,96,.22)} }
        @keyframes noteWiggle  { 0%,100%{transform:rotate(5deg)} 50%{transform:rotate(7deg)} }
        @keyframes stubWiggle  { 0%,100%{transform:rotate(-7deg)} 50%{transform:rotate(-5deg)} }

        /* ── ROOT ── */
        .hm {
          min-height: calc(100vh - 110px);
          background: #fdf6e9;
          background-image:
            radial-gradient(ellipse 90% 55% at 50% -5%, rgba(240,192,96,.12) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 95% 95%, rgba(139,90,43,.07) 0%, transparent 60%),
            url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8a96e' fill-opacity='0.04'%3E%3Cpath d='M26 1l1 24H1V25h26V1zm0 26v24H25V27H1v-1h25zm1 0h24v1H27zm0-1V1h1v25h24v1H27z'/%3E%3C/g%3E%3C/svg%3E");
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* floaters */
        .floater {
          position: absolute;
          font-family: 'Caveat', cursive;
          font-size: 12.5px;
          color: #7a5428;
          background: rgba(255,248,225,.75);
          border: 1px dashed rgba(200,165,100,.55);
          border-radius: 999px;
          padding: 5px 15px;
          pointer-events: none;
          backdrop-filter: blur(3px);
          white-space: nowrap;
          animation: floatDrift var(--d) ease-in-out var(--dl) infinite;
        }

        /* ── HERO GRID ── */
        .hm-hero {
          display: grid;
          grid-template-columns: 1fr 430px;
          gap: 44px;
          padding: 40px 32px 28px;
          flex: 1;
          align-items: start;
          opacity: 0;
          transition: opacity .5s ease;
        }
        .hm-hero.visible { opacity: 1; }

        /* ── LEFT ── */
        .hm-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeUp .65s ease .1s both;
        }

        /* Live badge */
        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1e0f00;
          border-radius: 999px;
          padding: 6px 16px 6px 10px;
          width: fit-content;
        }
        .live-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,.25);
          animation: glowRing 2s ease infinite;
        }
        .live-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: rgba(255,255,255,.70);
        }
        .live-text b { color: #f0c060; font-weight: 700; }

        /* Headline */
        .hm-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.3rem, 3.8vw, 3.4rem);
          font-weight: 700;
          color: #1e0f00;
          line-height: 1.13;
          letter-spacing: -.01em;
        }
        .hm-h1 .italic-gold {
          font-style: italic;
          color: #b45309;
          display: block;
          position: relative;
          width: fit-content;
        }
        .hm-h1 .italic-gold::after {
          content: '';
          position: absolute;
          left: 0; bottom: -3px;
          height: 2.5px; width: 100%;
          background: linear-gradient(90deg, #d97706, #f0c060 60%, transparent);
          border-radius: 2px;
          transform-origin: left;
          animation: underlineIn .7s ease .6s both;
        }

        /* Rotating memory ticker */
        .ticker-wrap {
          height: 30px;
          overflow: hidden;
          border-left: 3px solid #f0c060;
          padding-left: 14px;
        }
        .ticker-line {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          color: #7a4f1e;
          animation: typeSlide .45s ease both;
          line-height: 30px;
        }

        /* Story */
        .hm-story {
          font-size: 13.5px;
          line-height: 1.95;
          color: #5c3d1a;
          max-width: 500px;
          position: relative;
          padding: 18px 20px;
          background: rgba(255,253,245,.80);
          border-radius: 8px;
          border: 1px solid rgba(200,169,110,.35);
          box-shadow: 0 2px 16px rgba(100,60,10,.06);
        }
        .hm-story::before {
          content: '"';
          font-family: 'Cormorant Garamond', serif;
          font-size: 72px;
          color: rgba(217,119,6,.15);
          position: absolute;
          top: -10px; left: 10px;
          line-height: 1;
          pointer-events: none;
        }

        /* Buttons */
        .hm-btns { display: flex; gap: 12px; flex-wrap: wrap; }

        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .04em;
          text-decoration: none;
          background: linear-gradient(135deg, #92400e 0%, #b45309 40%, #d97706 80%, #f59e0b 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(180,83,9,.42), inset 0 1px 0 rgba(255,255,255,.18);
          transition: transform .2s, box-shadow .2s;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.12);
        }
        .btn-gold::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
          animation: shimmerBtn 2.8s ease 1s infinite;
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(180,83,9,.52); }

        .btn-parch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 22px;
          border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          color: #92400e;
          background: rgba(254,243,199,.70);
          border: 1.5px solid rgba(200,169,110,.55);
          transition: background .2s, transform .2s;
        }
        .btn-parch:hover { background: #fef3c7; transform: translateY(-2px); }

        /* Stats */
        .hm-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          animation: fadeUp .65s ease .25s both;
        }
        .stat-c {
          background: white;
          border: 1px solid rgba(200,169,110,.28);
          border-radius: 10px;
          padding: 14px 10px 12px;
          text-align: center;
          box-shadow: 0 2px 14px rgba(100,60,10,.07);
          position: relative;
          overflow: hidden;
          transition: transform .2s, box-shadow .2s;
        }
        .stat-c:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(100,60,10,.13); }
        .stat-c::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #b45309, #f0c060);
        }
        .stat-c .sn {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #d97706;
          line-height: 1;
          animation: countPop .5s ease both;
        }
        .stat-c .si { font-size: 18px; margin-bottom: 3px; }
        .stat-c .sl {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: .13em;
          text-transform: uppercase;
          color: #a07840;
          margin-top: 4px;
        }

        /* ── RIGHT — Photo ── */
        .hm-photo {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          animation: fadeUp .65s ease .2s both;
        }

        /* Gold ornament frame */
        .photo-frame {
          width: 100%;
          position: relative;
          padding: 10px;
          background: linear-gradient(160deg, #fff9ee, #fffcf6, #fff5dd);
          border-radius: 6px;
          animation: framePulse 4s ease infinite;
        }
        .photo-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 6px;
          background: linear-gradient(135deg,
            rgba(240,192,96,.35) 0%,
            transparent 25%,
            transparent 75%,
            rgba(240,192,96,.25) 100%);
          pointer-events: none;
        }

        /* Corner L-brackets */
        .fc { position: absolute; width: 18px; height: 18px; border-color: #d97706; border-style: solid; opacity: .75; }
        .fc-tl { top: 4px;    left: 4px;   border-width: 2px 0 0 2px; }
        .fc-tr { top: 4px;    right: 4px;  border-width: 2px 2px 0 0; }
        .fc-bl { bottom: 4px; left: 4px;   border-width: 0 0 2px 2px; }
        .fc-br { bottom: 4px; right: 4px;  border-width: 0 2px 2px 0; }

        .photo-window {
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: 3px;
          position: relative;
          background: #e8d9b5;
        }
        .photo-window img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          filter: sepia(12%) contrast(1.06) brightness(.97) saturate(.92);
          transition: transform .7s ease, filter .7s ease;
        }
        .photo-frame:hover .photo-window img {
          transform: scale(1.04);
          filter: sepia(4%) contrast(1.08) brightness(1.01) saturate(1.0);
        }
        /* vignette inside photo */
        .photo-window::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 55%, rgba(30,15,0,.30) 100%);
          pointer-events: none;
        }

        /* Caption bar */
        .photo-caption {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #1e0f00;
          padding: 12px 16px;
          border-radius: 0 0 5px 5px;
          margin-top: -2px;
        }
        .pc-left {}
        .pc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 700;
          color: white;
          letter-spacing: .02em;
        }
        .pc-sub {
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: .15em;
          text-transform: uppercase;
          color: rgba(255,255,255,.38);
          margin-top: 2px;
        }
        .pc-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(240,192,96,.14);
          border: 1px solid rgba(240,192,96,.30);
          border-radius: 999px;
          padding: 5px 14px;
        }
        .pc-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f0c060;
          animation: glowRing 2.2s ease infinite;
        }
        .pc-txt {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .10em;
          color: #f0c060;
        }

        /* Sticky note */
        .sticky-note {
          position: absolute;
          top: -22px; right: -18px;
          width: 88px;
          background: #fffde7;
          border: 1px solid #f0de6a;
          border-radius: 2px;
          padding: 10px 10px 12px;
          box-shadow: 2px 4px 12px rgba(0,0,0,.16), inset 0 -2px 0 rgba(0,0,0,.06);
          font-family: 'Caveat', cursive;
          font-size: 12.5px;
          color: #4a3300;
          line-height: 1.4;
          text-align: center;
          z-index: 20;
          animation: noteWiggle 3.5s ease infinite;
        }
        .sticky-note::before {
          content: '';
          position: absolute;
          top: -7px; left: 50%; transform: translateX(-50%);
          width: 13px; height: 13px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #ff7070, #aa0000);
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
        }
        /* fold corner */
        .sticky-note::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 16px; height: 16px;
          background: linear-gradient(225deg, #e8ce50 50%, transparent 50%);
          border-radius: 0 0 2px 0;
        }

        /* Ticket stub */
        .ticket-stub {
          position: absolute;
          bottom: 70px; left: -22px;
          background: linear-gradient(135deg, #7c3000, #a85000);
          color: white;
          border-radius: 5px;
          padding: 10px 12px;
          font-family: 'Caveat', cursive;
          font-size: 12.5px;
          line-height: 1.5;
          text-align: center;
          z-index: 20;
          border-left: 5px dashed rgba(255,255,255,.25);
          box-shadow: 2px 4px 14px rgba(0,0,0,.25);
          animation: stubWiggle 4s ease infinite;
        }

        /* ── BOTTOM MEMORY STRIP ── */
        .hm-strip {
          background: linear-gradient(90deg, #1e0f00, #2c1a08, #1e0f00);
          padding: 11px 32px;
          display: flex;
          align-items: center;
          gap: 0;
          animation: fadeUp .65s ease .35s both;
          border-top: 1px solid rgba(240,192,96,.15);
          overflow-x: auto;
        }
        .strip-label {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 12px;
          color: rgba(255,255,255,.30);
          white-space: nowrap;
          padding-right: 20px;
          border-right: 1px solid rgba(255,255,255,.08);
          margin-right: 20px;
          flex-shrink: 0;
        }
        .strip-chips {
          display: flex;
          gap: 7px;
          align-items: center;
          flex-wrap: nowrap;
        }
        .s-chip {
          font-family: 'Caveat', cursive;
          font-size: 12.5px;
          color: rgba(255,255,255,.55);
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 999px;
          padding: 4px 14px;
          white-space: nowrap;
          transition: color .2s, background .2s;
          cursor: default;
        }
        .s-chip:hover {
          color: #f0c060;
          background: rgba(240,192,96,.12);
          border-color: rgba(240,192,96,.28);
        }

        @media (max-width: 720px) {
          .hm-hero { grid-template-columns: 1fr; gap: 24px; padding: 24px 16px 20px; }
          .hm-stats { grid-template-columns: repeat(2, 1fr); }
          .hm-photo { margin-top: 0; }
          .floater { display: none; }
          .sticky-note, .ticket-stub { display: none; }
          .hm-strip { padding: 10px 16px; }
        }
      `}</style>

      <div className="hm">
        {/* Floating ambient tags */}
        {floaters.map((f) => (
          <div
            key={f.text}
            className="floater"
            style={{
              top: f.top,
              left: f.left,
              right: f.right,
              "--d": f.dur,
              "--dl": f.delay,
            }}
          >
            {f.text}
          </div>
        ))}

        {/* ── HERO ── */}
        <div className={`hm-hero ${visible ? "visible" : ""}`}>
          {/* LEFT */}
          <div className="hm-left">
            {/* Live badge */}
            <div className="live-badge">
              <div className="live-dot" />
              <span className="live-text">
                <b>Class of 2000</b> · 10th Grade · Batch Portal · Live
              </span>
            </div>

            {/* Headline */}
            <h1 className="hm-h1">
              Twenty-five years later,
              <br />
              <span className="italic-gold">we're all back home.</span>
            </h1>

            {/* Rotating ticker */}
            <div className="ticker-wrap">
              <div key={tick} className="ticker-line">
                {memories[tick]}
              </div>
            </div>

            {/* Story */}
            <div className="hm-story">
              Those four walls held our biggest secrets, our loudest laughs, and
              our first real friendships. We shared benches, borrowed pens,
              swapped tiffins, and made memories that no textbook could ever
              contain.
              <br />
              <br />
              Twenty-five years on — life has taken us across cities, careers
              and continents. But here, in this little corner of the internet,
              <strong style={{ color: "#7a3800" }}>
                {" "}
                we are all still seventeen.
              </strong>
            </div>
          </div>

          {/* RIGHT — Photo */}
          <div className="hm-photo">
            {/* Sticky note */}
            <div className="sticky-note">
              Our Class 📸
              <br />
              <span style={{ fontSize: "10.5px", opacity: 0.7 }}>
                Batch '99–'00
              </span>
            </div>

            {/* Ticket */}
            <div className="ticket-stub">
              🎓 Passing
              <br />
              Year 2000
            </div>

            <div className="photo-frame">
              <div className="fc fc-tl" />
              <div className="fc fc-tr" />
              <div className="fc fc-bl" />
              <div className="fc fc-br" />

              <div className="photo-window">
                {!imgLoaded && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg,#f5e6c8 25%,#fef3c7 50%,#f5e6c8 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.4s infinite",
                    }}
                  />
                )}
                <img
                  src={groupPhoto}
                  alt="Class of 2000 Group Photo"
                  onLoad={() => setImgLoaded(true)}
                  style={{ display: imgLoaded ? "block" : "none" }}
                />
              </div>

              <div className="photo-caption">
                <div className="pc-left">
                  <div className="pc-title">Class of 2000 — Group Photo</div>
                  <div className="pc-sub">Batch 1999–2000 · Together again</div>
                </div>
                <div className="pc-badge">
                  <div className="pc-dot" />
                  <span className="pc-txt">25 YRS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM STRIP ── */}
        <div className="hm-strip">
          <span className="strip-label">Our memories</span>
          <div className="strip-chips">
            {[
              "📚 Last Bench Gang",
              "🍱 Tiffin Swaps",
              "🎭 Annual Day",
              "🏃 Sports Day",
              "✏️ Slam Books",
              "🔬 Science Fair",
              "🤝 Forever Friends",
              "📝 Board Exams",
              "🎒 School Bag",
              "🔔 School Bell",
              "💌 Farewell Notes",
            ].map((tag) => (
              <span key={tag} className="s-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
