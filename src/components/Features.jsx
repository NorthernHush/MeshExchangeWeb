import React from 'react'
import { motion } from 'framer-motion'

const items = [
  {title:'Быстро и надёжно', desc:'Оптимизированная сеть передачи — высокая скорость и повторяемость.'},
  {title:'Приватность и контроль', desc:'Зашифрованные ссылки, пароль и срок действия.'},
  {title:'Масштабируемость', desc:'Горизонтальное масштабирование и CDN-подобные кэши.'},
]

export default function Features(){
  return (
    <section id="features" className="features container">
      <h2>Преимущества MeshExchange</h2>
      <div className="grid">
        {items.map((it, i)=> (
          <motion.article key={it.title} initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay:0.12*i}} className="feature-card">
            <h3>{it.title}</h3>
            <p>{it.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
