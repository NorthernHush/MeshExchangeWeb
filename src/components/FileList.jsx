import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'

function fmtBytes(n){
  if(n < 1024) return n+' B'
  if(n < 1024*1024) return (n/1024).toFixed(1) + ' KB'
  return (n/(1024*1024)).toFixed(1) + ' MB'
}

export default function FileList(){
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/files')
      const data = await res.json()
      setFiles(data)
    }catch(e){
      console.error(e)
    }finally{setLoading(false)}
  }

  useEffect(()=>{ load() }, [])

  useEffect(()=>{
    const h = ()=> load()
    window.addEventListener('meshexchange:files-updated', h)
    return ()=> window.removeEventListener('meshexchange:files-updated', h)
  }, [])

  async function remove(name){
    if(!confirm('Удалить файл?')) return
    await fetch(`/api/files/${encodeURIComponent(name)}`, { method: 'DELETE' })
    load()
  }

  return (
    <section className="files container">
      <h2>Загруженные файлы <span className="count">{files.length}</span></h2>
      <div className="files-grid">
        {loading && <div className="muted">Загрузка...</div>}
        {files.length === 0 && !loading && <div className="muted">Файлы отсутствуют</div>}
        {files.map(f=> (
          <motion.article layout key={f.name} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="file-item">
            <div className="fi-left">
              <div className="fi-icon">📄</div>
              <div>
                <div className="fi-name">{f.name}</div>
                <div className="fi-meta">{fmtBytes(f.size)} • {new Date(f.mtime).toLocaleString()}</div>
              </div>
            </div>
            <div className="fi-actions">
              <a className="btn outline" href={`/uploads/${encodeURIComponent(f.name)}`} target="_blank" rel="noreferrer">Скачать</a>
              <button className="btn ghost" onClick={()=>remove(f.name)}>Удалить</button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
