import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

function WebsiteLayout() {
  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#422f2c]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default WebsiteLayout
