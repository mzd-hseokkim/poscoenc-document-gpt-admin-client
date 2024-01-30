import React from 'react'
import { AppAside, AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light dark:bg-transparent">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
      <AppAside />
    </>
  )
}

export default DefaultLayout
