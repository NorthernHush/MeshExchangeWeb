import React from 'react'
import { motion } from 'framer-motion'

export default function Hero(){
  return (
    <section className="hero container">
      <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} transition={{duration:0.8}}>
        <h1>MeshExchange — быстрый, приватный и масштабируемый файлообменник</h1>
        <p className="lead">Обменивайтесь файлами любого размера, делайте приватные ссылки и управляйте доступом в пару кликов.</p>
        <div className="cta-row">
          <a className="btn primary" href="#upload">Загрузить файл</a>
          <a className="btn ghost" href="#docs">Как это работает</a>
        </div>
      </motion.div>
      <motion.div className="hero-visual" initial={{opacity:0, x:40}} animate={{opacity:1, x:0}} transition={{duration:1}}>
        <div className="device">
          <div className="file-card">
            <div className="file-icon">📁</div>
            <div className="file-meta">
              <div className="name">report-2025.pdf</div>
              <div className="size">12.3 MB • zip</div>
            </div>
            <div className="progress" style={{width:'64%'}}></div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
