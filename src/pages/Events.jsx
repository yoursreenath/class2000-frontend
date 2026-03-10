import { useEffect, useState } from 'react'
import { MapPin, User, Users, Plus, X, Pencil, Trash2 } from 'lucide-react'
import { eventApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { format, isPast } from 'date-fns'

const EMPTY = { title:'', eventDate:'', location:'', description:'', organizer:'' }

export default function Events() {
  const { isAdmin } = useAuth()
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [rsvped, setRsvped]     = useState(new Set())
  const [form, setForm]         = useState(EMPTY)

  const load = async () => {
    setLoading(true)
    try { const r = await eventApi.getAll(); setEvents(r.data) } catch { setEvents([]) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const toLocalDT = iso => iso ? iso.slice(0,16) : ''

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = ev => {
    setEditing(ev)
    setForm({ title:ev.title||'', eventDate:toLocalDT(ev.eventDate), location:ev.location||'', description:ev.description||'', organizer:ev.organizer||'' })
    setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const handleSubmit = async e => {
    e.preventDefault()
    const payload = { ...form, eventDate: new Date(form.eventDate).toISOString() }
    if (editing) await eventApi.update(editing.id, payload)
    else         await eventApi.create(payload)
    closeForm(); load()
  }
  const handleDelete = async id => {
    if (!window.confirm('Delete this event?')) return
    try { await eventApi.delete(id); load() } catch {}
  }
  const handleRsvp = async id => {
    if (rsvped.has(id)) return
    await eventApi.rsvp(id); setRsvped(p => new Set([...p,id])); load()
  }

  const upcoming = events.filter(e => e.eventDate && !isPast(new Date(e.eventDate)))
  const past     = events.filter(e => !e.eventDate  ||  isPast(new Date(e.eventDate)))

  const formFields = [
    { label:'Event Title *',  key:'title',       full:true, required:true, placeholder:'e.g. 25-Year Batch Reunion Dinner' },
    { label:'Date & Time *',  key:'eventDate',   type:'datetime-local', required:true },
    { label:'Location',       key:'location',    placeholder:'Venue or City' },
    { label:'Organiser Name', key:'organizer',   full:true, placeholder:'Your name' },
    { label:'Description',    key:'description', full:true, area:true, placeholder:'Tell classmates what to expect…' },
  ]

  return (
    <div className="fade-in">
      <style>{`
        .ev-card { background:#fffcf4;border:1px solid #e2cfa0;border-radius:4px;padding:20px;display:flex;gap:16px;align-items:flex-start; box-shadow:0 2px 10px rgba(100,60,10,0.08);transition:transform 0.22s,box-shadow 0.22s;position:relative;overflow:hidden; }
        .ev-card::before { content:'';position:absolute;top:0;left:0;bottom:0;width:4px;background:linear-gradient(to bottom,var(--amber),var(--amber-light)); }
        .ev-card:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(100,60,10,0.15); }
        .ev-date-box { flex-shrink:0;width:56px;text-align:center;background:var(--ink);border-radius:4px;padding:8px 4px;box-shadow:0 3px 10px rgba(30,15,0,0.25); }
        .ev-date-mon { font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--amber-light); }
        .ev-date-day { font-family:'Libre Baskerville',serif;font-size:24px;font-weight:700;color:white;line-height:1; }
        .ev-date-yr  { font-size:9px;color:rgba(255,255,255,0.40);margin-top:2px; }
        .ev-title { font-family:'Libre Baskerville',serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:7px; }
        .ev-meta  { display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px; }
        .ev-meta-item { display:flex;align-items:center;gap:4px;font-size:12px;color:var(--ink-muted); }
        .ev-desc  { font-size:13px;line-height:1.75;color:var(--ink);font-style:italic;border-left:2px solid var(--parch);padding-left:10px; }
        .ev-right { flex-shrink:0;display:flex;flex-direction:column;gap:7px;align-items:flex-end; }
        .past-badge { font-size:10px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;background:#f3f4f6;color:#6b7280;border:1px solid #e5e7eb;border-radius:2px;padding:2px 8px; }
        .section-title { font-family:'Libre Baskerville',serif;font-style:italic;font-size:13.5px;color:var(--sepia);margin:24px 0 12px;display:flex;align-items:center;gap:10px; }
        .section-title::after { content:'';flex:1;height:1px;background:var(--parch); }
        .card-actions { display:flex;gap:6px; }
        .btn-edit { display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:3px;border:1.5px solid #d4b87a;background:#fef9f0;color:var(--amber-dark);font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-edit:hover { background:var(--parch); }
        .btn-del  { display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:3px;border:1.5px solid #fca5a5;background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-del:hover { background:#fee2e2; }
        .ev-form { background:#fffcf4;border:1px solid #e2cfa0;border-radius:4px;padding:22px;margin-bottom:22px;box-shadow:0 2px 14px rgba(100,60,10,0.08);animation:slideDown 0.3s ease both; }
        .form-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px; }
        @media(max-width:600px){ .form-grid-2{grid-template-columns:1fr;} }
        .form-label { font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--sepia);display:block;margin-bottom:5px; }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">📅 Events & Meetups</h1>
          <p className="page-subtitle">Plan a gathering · Relive old times · RSVP and show up</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={showForm ? closeForm : openAdd}>
            {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Add Event</>}
          </button>
        )}
      </div>

      {/* Add / Edit form */}
      {isAdmin && showForm && (
        <div className="ev-form">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:4}}>
            ✦ {editing ? `Edit — ${editing.title}` : 'Create a New Event'}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              {formFields.map(({label,key,placeholder,required,type,full,area})=>(
                <div key={key} style={full?{gridColumn:'1/-1'}:{}}>
                  <label className="form-label">{label}</label>
                  {area
                    ? <textarea className="input-field" style={{height:76}} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                    : <input type={type||'text'} required={required} className="input-field" placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                  }
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:14}}>
              <button type="submit" className="btn-primary">{editing ? '✓ Save Changes' : '✓ Create Event'}</button>
              <button type="button" className="btn-outline" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading events…</p></div>
        : <>
            {upcoming.length > 0 && <>
              <div className="section-title">🟢 Upcoming</div>
              <div style={{display:'flex',flexDirection:'column',gap:12}} className="stagger">
                {upcoming.map(ev=><EventCard key={ev.id} ev={ev} isAdmin={isAdmin} rsvped={rsvped} onRsvp={handleRsvp} onEdit={openEdit} onDelete={handleDelete}/>)}
              </div>
            </>}
            {past.length > 0 && <>
              <div className="section-title">🕰️ Past Events</div>
              <div style={{display:'flex',flexDirection:'column',gap:12,opacity:0.72}} className="stagger">
                {past.map(ev=><EventCard key={ev.id} ev={ev} isAdmin={isAdmin} rsvped={rsvped} onRsvp={handleRsvp} onEdit={openEdit} onDelete={handleDelete} isPast/>)}
              </div>
            </>}
            {events.length === 0 && <div className="empty-state"><div className="empty-icon">📅</div><p>No events yet.</p><small>Be the first to plan a batch gathering!</small></div>}
          </>
      }
    </div>
  )
}

function EventCard({ ev, isAdmin, rsvped, onRsvp, onEdit, onDelete, isPast }) {
  const d = ev.eventDate ? new Date(ev.eventDate) : null
  return (
    <div className="ev-card">
      {d && (
        <div className="ev-date-box">
          <div className="ev-date-mon">{format(d,'MMM')}</div>
          <div className="ev-date-day">{format(d,'dd')}</div>
          <div className="ev-date-yr">{format(d,'yyyy')}</div>
        </div>
      )}
      <div style={{flex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
          <h3 className="ev-title" style={{margin:0}}>{ev.title}</h3>
          {isPast && <span className="past-badge">Past</span>}
        </div>
        <div className="ev-meta">
          {ev.location  && <span className="ev-meta-item"><MapPin size={11}/>{ev.location}</span>}
          {ev.organizer && <span className="ev-meta-item"><User size={11}/>{ev.organizer}</span>}
          <span className="ev-meta-item"><Users size={11}/>{ev.rsvpCount||0} going</span>
          {d && <span className="ev-meta-item">🕐 {format(d,'h:mm a')}</span>}
        </div>
        {ev.description && <p className="ev-desc">{ev.description}</p>}
      </div>
      <div className="ev-right">
        {!isPast && (
          <button
            className={rsvped.has(ev.id) ? 'btn-outline' : 'btn-primary'}
            style={{fontSize:12,padding:'7px 14px'}}
            onClick={()=>onRsvp(ev.id)} disabled={rsvped.has(ev.id)}>
            {rsvped.has(ev.id) ? '✓ Going!' : "I'll be there"}
          </button>
        )}
        {isAdmin && (
          <div className="card-actions">
            <button className="btn-edit" onClick={()=>onEdit(ev)}><Pencil size={11}/> Edit</button>
            <button className="btn-del"  onClick={()=>onDelete(ev.id)}><Trash2 size={11}/> Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}
