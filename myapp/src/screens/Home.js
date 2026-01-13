import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Codification from '../components/Codification'


export default function Home() {
  return (
    <div>
        <div><Navbar/></div>
        <div><Codification/></div>
        
        <div><Footer/></div>
    </div>
  )
}
