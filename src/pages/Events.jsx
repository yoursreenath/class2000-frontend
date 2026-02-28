import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, User, Users, Plus, X } from 'lucide-react'
import { eventApi } from '../api'
import { format } from 'date-fns'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', eventDate: '', location: '', description: '', organizer: '' })
  const [rsvped, setRsvped] = useState(new Set())

  const load = async () => {
    setLoading(true)
    const res = await eventApi.getAll()
    setEvents(res.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await eventApi.create({ ...form, eventDate: new Date(form.eventDate).toISOString() })
    setShowForm(false)
    setForm({ title: '', eventDate: '', location: '', description: '', organizer: '' })
    load()
  }

  const handleRsvp = async (id) => {
    if (rsvped.has(id)) return
    await eventApi.rsvp(id)
    setRsvped(prev => new Set([...prev, id]))
    load()
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>Events & Reunions</h1>
          <p style={{ color: 'var(--ink-muted)' }} className="mt-1">Don't miss out on the fun</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="card p-6 mb-6 relative">
          <button className="absolute top-4 right-4" onClick={() => setShowForm(false)} style={{ color: 'var(--ink-muted)' }}><X size={18} /></button>
          <h3 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Create an Event</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required className="input-field md:col-span-2" placeholder="Event Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input required type="datetime-local" className="input-field" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} />
            <input className="input-field" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <input className="input-field md:col-span-2" placeholder="Organizer Name" value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} />
            <textarea className="input-field md:col-span-2 h-24 resize-none" placeholder="Event description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">Create Event</button>
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: 'var(--ink-muted)' }}>Loading events...</div>
      ) : (
        <div className="space-y-5">
          {events.map(event => (
            <div key={event.id} className="card p-6 flex flex-col md:flex-row gap-5">
              {/* Date badge */}
              <div className="flex-shrink-0 text-center w-16 h-16 rounded-xl flex flex-col items-center justify-center"
                style={{ background: '#fef3c7', color: 'var(--amber-dark)' }}>
                <p className="text-xs font-semibold uppercase">
                  {event.eventDate ? format(new Date(event.eventDate), 'MMM') : ''}
                </p>
                <p className="font-display text-2xl font-bold leading-none">
                  {event.eventDate ? format(new Date(event.eventDate), 'dd') : ''}
                </p>
              </div>

              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{event.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
                  {event.location && <span className="flex items-center gap-1"><MapPin size={13} /> {event.location}</span>}
                  {event.organizer && <span className="flex items-center gap-1"><User size={13} /> {event.organizer}</span>}
                  <span className="flex items-center gap-1"><Users size={13} /> {event.rsvpCount} RSVPs</span>
                </div>
                {event.description && <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{event.description}</p>}
              </div>

              <div className="flex-shrink-0">
                <button
                  className={rsvped.has(event.id) ? 'btn-outline' : 'btn-primary'}
                  onClick={() => handleRsvp(event.id)}
                  disabled={rsvped.has(event.id)}
                >
                  {rsvped.has(event.id) ? '✓ RSVP\'d' : 'RSVP'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--ink-muted)' }}>
          <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
          <p>No events yet. Be the first to plan a reunion!</p>
        </div>
      )}
    </div>
  )
}
