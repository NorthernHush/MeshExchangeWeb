import React, {useState, useRef, useCallback} from 'react'
import { motion } from 'framer-motion'

export default function UploadForm(){
  const [queue, setQueue] = useState([]) // {file, id}
  const [progressMap, setProgressMap] = useState({})
  const [statusMap, setStatusMap] = useState({})
  const [dragging, setDragging] = useState(false)
  const xhrRef = useRef(null)
  const uploadingRef = useRef(false)

  const handleFiles = useCallback((fileList) => {
    const arr = Array.from(fileList || [])
    if(arr.length === 0) return
    const items = arr.map(f => ({ file: f, id: Date.now() + '-' + Math.round(Math.random()*1e6) }))
    setQueue(prev => [...prev, ...items])
    const newStatuses = {}
    items.forEach(it => newStatuses[it.id] = 'ready')
    setStatusMap(prev => ({...prev, ...newStatuses}))
  }, [])

  function onInputChange(e){
    handleFiles(e.target.files)
    e.target.value = null
  }

  function onDragOver(e){ e.preventDefault(); setDragging(true) }
  function onDragLeave(e){ e.preventDefault(); setDragging(false) }
  function onDrop(e){ e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }

  function removeFromQueue(id){
    setQueue(q => q.filter(x => x.id !== id))
    setProgressMap(p => { const n = {...p}; delete n[id]; return n })
    setStatusMap(s => { const n = {...s}; delete n[id]; return n })
  }

  function clearQueue(){
    if(xhrRef.current){ xhrRef.current.abort() }
    uploadingRef.current = false
    setQueue([]); setProgressMap({}); setStatusMap({})
  }

  function uploadOne(item){
    return new Promise((resolve, reject)=>{
      const { file, id } = item
      setStatusMap(s => ({...s, [id]: 'uploading'}))
      const form = new FormData()
      form.append('file', file)
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr
      xhr.open('POST', '/api/upload')
      xhr.upload.onprogress = (e)=>{
        if(e.lengthComputable){
          const pct = Math.round((e.loaded / e.total) * 100)
          setProgressMap(p => ({...p, [id]: pct}))
        }
      }
      xhr.onload = ()=>{
        if(xhr.status >= 200 && xhr.status < 300){
          setStatusMap(s => ({...s, [id]: 'done'}))
          // notify others to refresh file list
          window.dispatchEvent(new CustomEvent('meshexchange:files-updated'))
          resolve(JSON.parse(xhr.responseText || '{}'))
        }else{
          setStatusMap(s => ({...s, [id]: 'error'}))
          reject(new Error(xhr.responseText || 'upload_error'))
        }
      }
      xhr.onerror = ()=>{ setStatusMap(s => ({...s, [id]: 'error'})); reject(new Error('network')) }
      xhr.onabort = ()=>{ setStatusMap(s => ({...s, [id]: 'aborted'})); reject(new Error('aborted')) }
      xhr.send(form)
    })
  }

  async function startAll(){
    if(uploadingRef.current) return
    uploadingRef.current = true
    for(const item of queue){
      try{
        await uploadOne(item)
      }catch(e){
        console.error('upload failed', e)
      }
    }
    uploadingRef.current = false
  }

  return (
    <section id="upload" className="upload container">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.6}} className="upload-card">
        <h2>Загрузить файлы</h2>
        <p className="muted">Перетащите файлы сюда или выберите вручную. Поддерживается множественная загрузка.</p>
        <div className="upload-controls">
          <label className={`dropzone ${dragging ? 'dragging' : ''}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
            <input type="file" onChange={onInputChange} multiple />
            <div className="drop-content">Перетащите файлы или нажмите, чтобы выбрать</div>
          </label>

          <div className="queue">
            {queue.length === 0 && <div className="muted">Очередь пуста. Выберите файлы для загрузки.</div>}
            {queue.map(item => (
              <div className="queue-item" key={item.id}>
                <div className="qi-left">
                  <div className="qi-name">{item.file.name}</div>
                  <div className="qi-meta muted">{Math.round(item.file.size/1024)} KB</div>
                </div>
                <div className="qi-right">
                  <div className="progress-bar small">
                    <div className={`progress-fill ${statusMap[item.id] || ''}`} style={{width: `${progressMap[item.id] || 0}%`}} />
                  </div>
                  <div className="queue-actions">
                    {statusMap[item.id] !== 'uploading' && <button className="btn outline" onClick={()=>removeFromQueue(item.id)}>Удалить</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="meta actions-row">
            <div>
              <button className="btn primary" onClick={startAll} disabled={queue.length===0}>Начать все</button>
              <button className="btn ghost" onClick={clearQueue}>Отменить все</button>
            </div>
            <div className="muted small">{queue.length} файл(ов) в очереди</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
