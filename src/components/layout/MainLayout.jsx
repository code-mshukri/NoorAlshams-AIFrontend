import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
      <Footer />
    </>
  )
}

export default MainLayout
