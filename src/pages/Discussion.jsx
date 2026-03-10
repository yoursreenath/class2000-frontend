import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Plus, X, Send, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { discussionApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'

function PostCard({ post, onLike, isAdmin, onDelete }) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments]         = useState([])
  const [newComment, setNewComment]     = useState({ author:'', content:'' })
  const [liked, setLiked]               = useState(false)

  const loadComments = async () => { try { const r = await discussionApi.getComments(post.id); setComments(r.data) } catch {} }
  useEffect(() => { if (showComments) loadComments() }, [showComments])

  const handleComment = async e => {
    e.preventDefault()
    e.stopPropagation()
    if (!newComment.author.trim() || !newComment.content.trim()) return
    try {
      await discussionApi.addComment(post.id, newComment)
      setNewComment({ author:'', content:'' }); loadComments()
    } catch (err) { console.error('Comment error:', err) }
  }
  const handleLike = async () => { if (liked) return; await onLike(post.id); setLiked(true) }

  return (
    <div className="disc-card">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
        <div className="disc-avatar">{post.author?.[0]||'?'}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600,fontSize:13.5,color:'var(--ink)'}}>{post.author}</div>
          <div style={{fontSize:11,color:'var(--ink-muted)',fontStyle:'italic'}}>
            {post.createdAt ? formatDistanceToNow(new Date(post.createdAt),{addSuffix:true}) : ''}
          </div>
        </div>
        <span className="badge badge-amber">{(post.likes||0)+(liked?1:0)} ❤</span>
      </div>

      <h3 className="disc-title">{post.title}</h3>
      <p className="disc-body">{post.content}</p>

      <div className="disc-actions">
        <button className={`disc-btn${liked?' liked':''}`} onClick={handleLike}>
          <Heart size={13} fill={liked?'#b91c1c':'none'} color={liked?'#b91c1c':'currentColor'}/> Like
        </button>
        <button className="disc-btn" onClick={()=>setShowComments(v=>!v)}>
          <MessageCircle size={13}/> {comments.length||''} Comments
          {showComments ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
        </button>
        {isAdmin && (
          <button className="disc-btn" style={{color:'#b91c1c',marginLeft:'auto'}} onClick={()=>onDelete(post.id)}>
            <Trash2 size={13}/> Delete
          </button>
        )}
      </div>

      {showComments && (
        <div className="disc-comments">
          {comments.map(c => (
            <div key={c.id} className="disc-comment">
              <div className="disc-comment-avatar">{c.author?.[0]}</div>
              <div>
                <span style={{fontWeight:600,fontSize:12,color:'var(--ink)'}}>{c.author}</span>
                <p style={{fontSize:13,margin:'3px 0 0',color:'var(--ink)',lineHeight:1.6}}>{c.content}</p>
              </div>
            </div>
          ))}
          {/* Everyone can comment — it's a community board */}
          <div className="disc-reply-form">
            <input className="input-field" placeholder="Your name" style={{flex:'0 0 130px'}}
              value={newComment.author} onChange={e=>setNewComment({...newComment,author:e.target.value})}
              onKeyDown={e=>{ if(e.key==='Enter' && newComment.author && newComment.content){ e.preventDefault(); handleComment(e) } }}/>
            <input className="input-field" placeholder="Write a reply…" style={{flex:1}}
              value={newComment.content} onChange={e=>setNewComment({...newComment,content:e.target.value})}
              onKeyDown={e=>{ if(e.key==='Enter' && newComment.author && newComment.content){ e.preventDefault(); handleComment(e) } }}/>
            <button type="button" className="btn-primary" style={{padding:'9px 14px',flexShrink:0}}
              onClick={handleComment}><Send size={13}/></button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Discussion() {
  const { isAdmin } = useAuth()
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ author:'', title:'', content:'' })

  const load = async () => {
    setLoading(true)
    try { const r = await discussionApi.getAll(); setPosts(r.data) } catch { setPosts([]) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async e => {
    e.preventDefault(); await discussionApi.create(form)
    setShowForm(false); setForm({ author:'', title:'', content:'' }); load()
  }
  const handleLike   = async id => { await discussionApi.like(id); load() }
  const handleDelete = async id => {
    if (!window.confirm('Delete this post?')) return
    try { await discussionApi.delete(id); load() } catch {}
  }

  return (
    <div className="fade-in">
      <style>{`
        .disc-card { background:#fffcf4;border:1px solid #e2cfa0;border-radius:4px;padding:22px;box-shadow:0 2px 10px rgba(100,60,10,0.08);position:relative;overflow:hidden;transition:box-shadow 0.2s; }
        .disc-card:hover { box-shadow:0 6px 22px rgba(100,60,10,0.14); }
        .disc-card::before { content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--amber),transparent); }
        .disc-avatar { width:40px;height:40px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--amber-dark),var(--amber));display:flex;align-items:center;justify-content:center;font-family:'Libre Baskerville',serif;font-weight:700;font-size:15px;color:white;box-shadow:0 2px 8px rgba(124,61,10,0.30); }
        .disc-title { font-family:'Libre Baskerville',serif;font-size:16px;font-weight:700;color:var(--ink);margin:0 0 10px; }
        .disc-body  { font-size:13.5px;line-height:1.80;color:var(--ink);padding-left:12px;border-left:2px solid var(--parch);font-style:italic;margin-bottom:14px; }
        .disc-actions { display:flex;gap:8px;padding-top:12px;border-top:1px solid var(--parch);align-items:center; }
        .disc-btn { display:flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--ink-muted);background:none;border:none;cursor:pointer;padding:5px 10px;border-radius:3px;transition:background 0.18s,color 0.18s; }
        .disc-btn:hover { background:var(--parch);color:var(--ink); }
        .disc-btn.liked { color:var(--red-mark); }
        .disc-comments { margin-top:14px;padding-top:14px;border-top:1px dashed #e2cfa0;display:flex;flex-direction:column;gap:10px; }
        .disc-comment { display:flex;gap:10px;background:#fdf8f0;border-radius:3px;padding:10px 12px; }
        .disc-comment-avatar { width:28px;height:28px;border-radius:50%;flex-shrink:0;background:var(--amber);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white; }
        .disc-reply-form { display:flex;gap:8px;margin-top:10px;align-items:center; }
        .disc-form { background:#fffcf4;border:1px solid #e2cfa0;border-radius:4px;padding:22px;margin-bottom:22px;box-shadow:0 2px 14px rgba(100,60,10,0.08);animation:slideDown 0.3s ease both; }
        .form-label { font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--sepia);display:block;margin-bottom:5px; }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">💬 Batch Chat Board</h1>
          <p className="page-subtitle">Share memories, ask questions, reconnect after 25 years</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={()=>setShowForm(v=>!v)}>
            {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> New Thread</>}
          </button>
        )}
      </div>

      {/* New thread form — admin only */}
      {isAdmin && showForm && (
        <div className="disc-form">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:14}}>✦ Start a New Thread</div>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
            {[
              { label:'Your Name *',  key:'author',  placeholder:"What did classmates call you?" },
              { label:'Subject *',    key:'title',   placeholder:"What's on your mind?" },
              { label:'Your Message', key:'content', area:true, placeholder:"Share a memory, ask a question, or just say hello after 25 years…" },
            ].map(({label,key,placeholder,area})=>(
              <div key={key}>
                <label className="form-label">{label}</label>
                {area
                  ? <textarea required className="input-field" style={{height:90}} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                  : <input    required className="input-field" placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                }
              </div>
            ))}
            <div style={{display:'flex',gap:10}}>
              <button type="submit" className="btn-primary">📌 Post Thread</button>
              <button type="button" className="btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading…</p></div>
        : posts.length===0
          ? <div className="empty-state"><div className="empty-icon">💬</div><p>No threads yet.</p><small>Start the conversation — someone is waiting to hear from you!</small></div>
          : <div style={{display:'flex',flexDirection:'column',gap:16}} className="stagger">
              {posts.map(p=><PostCard key={p.id} post={p} onLike={handleLike} isAdmin={isAdmin} onDelete={handleDelete}/>)}
            </div>
      }
    </div>
  )
}
