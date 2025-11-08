const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
const BASE_PORT = parseInt(process.env.PORT || '4000', 10)
let PORT = BASE_PORT
const MAX_TRIES = 10

app.use(cors())
app.use(express.json())

const UPLOAD_DIR = path.join(__dirname, 'uploads')
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, {recursive:true})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e6)
    cb(null, unique + '-' + file.originalname)
  }
})
const upload = multer({ storage })

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if(!req.file) return res.status(400).json({error:'no_file'})
  const file = req.file
  res.json({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    url: `/uploads/${file.filename}`
  })
})

// List files
app.get('/api/files', (req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR).map(f => {
    const s = fs.statSync(path.join(UPLOAD_DIR, f))
    return { name: f, size: s.size, mtime: s.mtime }
  })
  res.json(files)
})

// Serve uploads
app.use('/uploads', express.static(UPLOAD_DIR, { index: false }))

// Delete file
app.delete('/api/files/:name', (req, res) => {
  const name = req.params.name
  const filePath = path.join(UPLOAD_DIR, name)
  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath)
    return res.json({ ok: true })
  }
  res.status(404).json({ error: 'not_found' })
})

const server = app.listen(PORT, ()=> console.log(`server listening on ${PORT}`))

server.on('error', (err)=>{
  if(err && err.code === 'EADDRINUSE'){
    console.warn(`port ${PORT} in use, trying next port...`)
    let tried = 0
    function tryNext(){
      tried += 1
      if(tried > MAX_TRIES){
        console.error('no available ports found, exiting')
        process.exit(1)
      }
      PORT += 1
      const s = app.listen(PORT, ()=> console.log(`server listening on ${PORT}`))
      s.on('error', (e)=>{
        if(e && e.code === 'EADDRINUSE'){
          console.warn(`port ${PORT} also in use, trying next...`)
          tryNext()
        }else{
          console.error('server error', e)
          process.exit(1)
        }
      })
    }
    tryNext()
  }else{
    console.error('server error', err)
    process.exit(1)
  }
})
