import { useState, useEffect } from "react";

const PHASES = [
  {
    name: "Menstrual", days: [1,2,3,4,5], emoji: "🌑", color: "#c0392b", bg: "rgba(192,57,43,0.12)", tagline: "Rest & Release",
    mood: ["Introspective","Low energy","Sensitive","Craving comfort"],
    physical: ["Cramps","Bloating","Fatigue","Headaches possible"],
    energy: 2, libido: 1,
    doThis: ["Be extra gentle and patient today 🤍","Offer her a hot water bottle or heating pad","Don't push plans — let her lead the pace","Comfort food runs = hero move","Cuddles > going out"],
    avoidThis: ["Don't start deep arguments or serious talks","Avoid being dismissive of her pain","Don't expect high energy or enthusiasm"],
    partnerNote: "She may be quieter or more withdrawn. This is her body asking for rest. Your calm presence is everything right now.",
  },
  {
    name: "Follicular", days: [6,7,8,9,10,11], emoji: "🌒", color: "#e67e22", bg: "rgba(230,126,34,0.10)", tagline: "Rising & Renewal",
    mood: ["Optimistic","Social","Creative","Open-minded"],
    physical: ["Energy returning","Clearer skin","Lighter feeling"],
    energy: 4, libido: 3,
    doThis: ["Plan dates and fun activities — she's up for it!","Have meaningful conversations now","Encourage her creative ideas","Try something new together","She's more receptive to compliments 😊"],
    avoidThis: ["Don't waste this social window staying in every night","Avoid being a wet blanket on new ideas"],
    partnerNote: "She's rising! This is a great phase for connection, planning trips, having big conversations, and making memories.",
  },
  {
    name: "Ovulation", days: [12,13,14,15,16], emoji: "🌕", color: "#f1c40f", bg: "rgba(241,196,15,0.10)", tagline: "Peak Power",
    mood: ["Confident","Magnetic","Flirty","Expressive"],
    physical: ["Peak energy","Glowing skin","Heightened senses"],
    energy: 5, libido: 5,
    doThis: ["This is her most magnetic phase — match her energy!","Plan something special — a nice dinner, an experience","Be present and attentive","Compliment her genuinely","She communicates best now — great time for 'the talk'"],
    avoidThis: ["Don't be distracted or on your phone during quality time","Avoid being dismissive or cold — she notices it more now"],
    partnerNote: "She's at her peak — socially, physically, emotionally. Invest time and attention here. This is when she feels most like herself.",
  },
  {
    name: "Luteal", days: [17,18,19,20,21,22,23,24,25,26,27,28], emoji: "🌘", color: "#8e44ad", bg: "rgba(142,68,173,0.10)", tagline: "Inward & Intense",
    mood: ["Emotional","Sensitive","Detail-oriented","Easily overwhelmed"],
    physical: ["Bloating may return","Breast tenderness","Fatigue","Cravings"],
    energy: 2, libido: 2,
    doThis: ["Check in on her more than usual","Validate her feelings — don't try to 'fix' them","Keep your word on commitments (she notices more now)","Small acts of care go a long way","Dark chocolate 🍫 is never a wrong answer"],
    avoidThis: ["Don't say 'are you PMSing?' — ever","Avoid canceling plans last minute","Don't dismiss emotional reactions as 'overreacting'","Avoid heavy criticism in this phase"],
    partnerNote: "Her nervous system is heightened. Small things feel bigger. Your steadiness, patience, and reassurance are her anchor right now.",
  },
];

function getPhase(day) { return PHASES.find(p => p.days.includes(day)) || PHASES[3]; }

function getDayFromStartDate(startDateStr) {
  if (!startDateStr) return 1;
  const start = new Date(startDateStr);
  const today = new Date();
  start.setHours(0,0,0,0); today.setHours(0,0,0,0);
  const diff = Math.floor((today - start) / (1000*60*60*24)) + 1;
  if (diff < 1) return 1;
  if (diff > 28) return ((diff - 1) % 28) + 1;
  return diff;
}

function formatDate(str) {
  if (!str) return "Not set";
  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function EnergyDots({ level, color }) {
  return (
    <div style={{ display:"flex", gap:5 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width:10, height:10, borderRadius:"50%", background: i<=level ? color : "rgba(255,255,255,0.15)", transition:"background 0.4s" }} />
      ))}
    </div>
  );
}

function CycleWheel({ currentDay, onDayClick }) {
  const cx=120, cy=120, r=90, innerR=55;
  const slices = Array.from({length:28},(_,i)=>{
    const day=i+1, phase=getPhase(day);
    const sa=(i/28)*2*Math.PI-Math.PI/2, ea=((i+1)/28)*2*Math.PI-Math.PI/2;
    return {
      day, phase,
      x1:cx+r*Math.cos(sa), y1:cy+r*Math.sin(sa),
      x2:cx+r*Math.cos(ea), y2:cy+r*Math.sin(ea),
      ix1:cx+innerR*Math.cos(sa), iy1:cy+innerR*Math.sin(sa),
      ix2:cx+innerR*Math.cos(ea), iy2:cy+innerR*Math.sin(ea),
      isActive:day===currentDay, isPast:day<currentDay,
    };
  });
  const cp = getPhase(currentDay);
  return (
    <svg viewBox="0 0 240 240" style={{width:"100%",maxWidth:260}}>
      {slices.map(({day,phase,x1,y1,x2,y2,ix1,iy1,ix2,iy2,isActive,isPast})=>(
        <path key={day}
          d={`M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1} Z`}
          fill={isActive ? phase.color : isPast ? phase.color+"88" : phase.color+"33"}
          stroke="rgba(20,10,30,0.8)" strokeWidth="1"
          style={{cursor:"pointer",transition:"fill 0.3s"}}
          onClick={()=>onDayClick(day)}
        />
      ))}
      <circle cx={cx} cy={cy} r={innerR-2} fill="#1a0a2e"/>
      <text x={cx} y={cy-10} textAnchor="middle" fill="white" fontSize="22" fontFamily="Georgia,serif">{cp.emoji}</text>
      <text x={cx} y={cy+8} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="Georgia,serif" fontWeight="bold">Day {currentDay}</text>
      <text x={cx} y={cy+22} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8" fontFamily="Georgia,serif">{cp.name}</text>
    </svg>
  );
}

export default function App() {
  const STORAGE_KEY = "luna_cycle_start";

  const loadStartDate = () => {
    try { return localStorage.getItem(STORAGE_KEY) || null; } catch { return null; }
  };

  const [startDate, setStartDate] = useState(loadStartDate);
  const [day, setDay] = useState(() => {
    const saved = loadStartDate();
    return saved ? getDayFromStartDate(saved) : 1;
  });
  const [tab, setTab] = useState("today");
  const [showReset, setShowReset] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  const phase = getPhase(day);

  const handleDayChange = (newDay) => {
    setFadeIn(false);
    setTimeout(()=>{ setDay(newDay); setFadeIn(true); }, 200);
  };

  const handleResetToday = () => {
    const today = new Date().toISOString().split("T")[0];
    try { localStorage.setItem(STORAGE_KEY, today); } catch {}
    setStartDate(today);
    setDay(1);
    setShowReset(false);
    setConfirmed(true);
    setTimeout(()=>setConfirmed(false), 3500);
  };

  const todayStr = new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0d0618 0%,#1a0a2e 50%,#0d1a2e 100%)", fontFamily:"'Georgia',serif", color:"white", paddingBottom:60 }}>

      {/* Header */}
      <div style={{ padding:"28px 24px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize:11, letterSpacing:4, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:4 }}>Her Cycle · Partner View</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:26, fontWeight:"normal", letterSpacing:1 }}>Luna <span style={{color:phase.color}}>✦</span></div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{todayStr}</div>
        </div>
      </div>

      {/* Confirmation toast */}
      {confirmed && (
        <div style={{ margin:"16px 24px 0", background:"rgba(46,204,113,0.15)", border:"1px solid rgba(46,204,113,0.4)", borderRadius:12, padding:"12px 16px", fontSize:13, color:"#2ecc71", textAlign:"center" }}>
          ✓ Cycle reset — tracking from Day 1 today
        </div>
      )}

      {/* 🔄 Reset Section */}
      <div style={{ margin:"16px 24px 0" }}>
        {!showReset ? (
          <button onClick={()=>setShowReset(true)} style={{
            width:"100%", padding:12, background:"rgba(255,255,255,0.04)",
            border:"1px dashed rgba(255,255,255,0.15)", borderRadius:12,
            color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:13,
            fontFamily:"Georgia,serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            <span style={{fontSize:16}}>🔄</span> Her period just started? Reset cycle to today
          </button>
        ) : (
          <div style={{ background:"rgba(192,57,43,0.12)", border:"1px solid rgba(192,57,43,0.4)", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:14, marginBottom:4 }}>Reset cycle to <strong>today</strong>?</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:14 }}>
              Sets Day 1 to {todayStr} and auto-tracks forward.
              {startDate && <span> Last reset: {formatDate(startDate)}.</span>}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={handleResetToday} style={{ flex:1, padding:10, background:"#c0392b", border:"none", borderRadius:9, color:"white", cursor:"pointer", fontSize:13, fontFamily:"Georgia,serif" }}>
                Yes, reset to Day 1
              </button>
              <button onClick={()=>setShowReset(false)} style={{ flex:1, padding:10, background:"rgba(255,255,255,0.07)", border:"none", borderRadius:9, color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:13, fontFamily:"Georgia,serif" }}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {startDate && !showReset && (
          <div style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:8 }}>
            Cycle started {formatDate(startDate)} · Auto-tracking Day {day}
          </div>
        )}
      </div>

      {/* Wheel + Stepper */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 24px 0" }}>
        <CycleWheel currentDay={day} onDayClick={handleDayChange} />
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:8, letterSpacing:2, textTransform:"uppercase" }}>Tap a slice to explore any day</div>
        <div style={{ display:"flex", alignItems:"center", gap:20, marginTop:16 }}>
          <button onClick={()=>handleDayChange(Math.max(1,day-1))} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"white", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:18 }}>‹</button>
          <span style={{ fontSize:15, color:"rgba(255,255,255,0.7)" }}>Day {day} of 28</span>
          <button onClick={()=>handleDayChange(Math.min(28,day+1))} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"white", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:18 }}>›</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", margin:"24px 24px 0", background:"rgba(255,255,255,0.05)", borderRadius:12, padding:4 }}>
        {[["today","Today"],["do","✓ Do"],["avoid","✗ Avoid"],["phases","All Phases"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{
            flex:1, padding:"8px 4px", border:"none", borderRadius:9, cursor:"pointer", fontSize:12,
            background: tab===key ? phase.color : "transparent",
            color: tab===key ? "white" : "rgba(255,255,255,0.45)",
            transition:"all 0.3s", fontFamily:"Georgia,serif",
          }}>{label}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ margin:"20px 24px 0", opacity:fadeIn?1:0, transform:fadeIn?"translateY(0)":"translateY(8px)", transition:"opacity 0.3s,transform 0.3s" }}>

        {tab==="today" && (
          <div>
            <div style={{ background:phase.bg, border:`1px solid ${phase.color}44`, borderRadius:16, padding:20, marginBottom:16 }}>
              <div style={{ fontSize:11, letterSpacing:3, color:phase.color, textTransform:"uppercase", marginBottom:4 }}>Phase</div>
              <div style={{ fontSize:22 }}>{phase.emoji} {phase.name}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:2 }}>{phase.tagline} · Days {phase.days[0]}–{phase.days[phase.days.length-1]}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", borderLeft:`3px solid ${phase.color}`, borderRadius:12, padding:16, marginBottom:16, fontSize:14, lineHeight:1.7, color:"rgba(255,255,255,0.8)", fontStyle:"italic" }}>
              "{phase.partnerNote}"
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {[["Energy",phase.energy],["Libido",phase.libido]].map(([label,val])=>(
                <div key={label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:12, padding:14 }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, letterSpacing:2, textTransform:"uppercase" }}>{label}</div>
                  <EnergyDots level={val} color={phase.color} />
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:12, padding:14, marginBottom:12 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:10, letterSpacing:2, textTransform:"uppercase" }}>Her Mood</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {phase.mood.map(m=>(
                  <span key={m} style={{ background:phase.color+"22", border:`1px solid ${phase.color}44`, borderRadius:20, padding:"4px 12px", fontSize:12, color:phase.color }}>{m}</span>
                ))}
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:12, padding:14 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:10, letterSpacing:2, textTransform:"uppercase" }}>Physical Signs</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {phase.physical.map(p=>(
                  <span key={p} style={{ background:"rgba(255,255,255,0.06)", borderRadius:20, padding:"4px 12px", fontSize:12, color:"rgba(255,255,255,0.6)" }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="do" && (
          <div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:16 }}>During her <span style={{color:phase.color}}>{phase.name}</span> phase:</div>
            {phase.doThis.map((item,i)=>(
              <div key={i} style={{ display:"flex", gap:12, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"14px 16px", marginBottom:10, alignItems:"flex-start" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:phase.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>✓</div>
                <div style={{ fontSize:14, lineHeight:1.6, color:"rgba(255,255,255,0.85)" }}>{item}</div>
              </div>
            ))}
          </div>
        )}

        {tab==="avoid" && (
          <div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:16 }}>During her <span style={{color:phase.color}}>{phase.name}</span> phase, steer clear of:</div>
            {phase.avoidThis.map((item,i)=>(
              <div key={i} style={{ display:"flex", gap:12, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"14px 16px", marginBottom:10, alignItems:"flex-start" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:"#c0392b44", border:"1px solid #c0392b88", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>✗</div>
                <div style={{ fontSize:14, lineHeight:1.6, color:"rgba(255,255,255,0.85)" }}>{item}</div>
              </div>
            ))}
          </div>
        )}

        {tab==="phases" && (
          <div>
            {PHASES.map(p=>(
              <div key={p.name} onClick={()=>{ handleDayChange(p.days[0]); setTab("today"); }} style={{
                background: day>=p.days[0]&&day<=p.days[p.days.length-1] ? p.bg : "rgba(255,255,255,0.03)",
                border:`1px solid ${day>=p.days[0]&&day<=p.days[p.days.length-1] ? p.color+"66" : "rgba(255,255,255,0.07)"}`,
                borderRadius:14, padding:16, marginBottom:12, cursor:"pointer",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:18 }}>{p.emoji} <span style={{fontSize:16}}>{p.name}</span></div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Days {p.days[0]}–{p.days[p.days.length-1]} · {p.tagline}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                    <EnergyDots level={p.energy} color={p.color} />
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>energy</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:8 }}>Tap any phase to explore it</div>
          </div>
        )}
      </div>

      <div style={{ textAlign:"center", padding:"32px 24px 0", fontSize:10, color:"rgba(255,255,255,0.2)", lineHeight:1.6 }}>
        Based on a 28-day average cycle. Every person is different — observe, adapt, and always listen to her.
      </div>
    </div>
  );
}
