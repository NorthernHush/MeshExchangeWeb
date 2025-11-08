import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container">
        <div>© {new Date().getFullYear()} MeshExchange</div>
        <div className="links">
          <a href="#privacy">Политика</a>
          <a href="#terms">Условия</a>
        </div>
      </div>
    </footer>
  )
}
