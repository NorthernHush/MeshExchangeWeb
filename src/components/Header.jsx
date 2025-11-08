import React from 'react'
import { motion } from 'framer-motion'

export default function Header(){
  return (
    <header className="site-header">
      <div className="container">
        <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="brand">
          <div className="logo">MX</div>
          <div className="title">MeshExchange</div>
        </motion.div>
        <nav className="nav">
          <a href="#features">Функции</a>
          <a href="#upload">Загрузить</a>
          <a href="#docs">Документы</a>
        </nav>
      </div>
    </header>
  )
}
