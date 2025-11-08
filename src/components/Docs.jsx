import React from 'react'

export default function Docs(){
  return (
    <section id="docs" className="docs container">
      <h2>Документация</h2>
      <div className="doc-grid">
        <article className="doc-card">
          <h3>API загрузки</h3>
          <pre className="code">POST /api/upload
Form field: file (multipart/form-data)
Response: {`{ filename, originalname, size, url }`}</pre>
        </article>
        <article className="doc-card">
          <h3>Список файлов</h3>
          <pre className="code">GET /api/files
Response: [{`{ name, size, mtime }`}]
</pre>
        </article>
        <article className="doc-card">
          <h3>Удаление</h3>
          <pre className="code">DELETE /api/files/:name</pre>
        </article>
      </div>
    </section>
  )
}
