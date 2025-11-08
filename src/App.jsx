import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import UploadForm from './components/UploadForm'
import FileList from './components/FileList'
import Docs from './components/Docs'
import Footer from './components/Footer'

export default function App(){
  return (
    <div className="app-root">
      <Header />
      <main>
        <Hero />
        <Features />
        <UploadForm />
        <FileList />
        <Docs />
      </main>
      <Footer />
    </div>
  )
}
