import MobileNavbar from '../components/MobileNavbar'
import './Layout.css'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='flex-1'>
        <Outlet />
      </div>
      <MobileNavbar />
    </div>
  )
}