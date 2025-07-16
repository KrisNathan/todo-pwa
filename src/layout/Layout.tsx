import './Layout.css'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

// export interface LayoutProps {
//   children: React.ReactNode;
// }

export default function Layout() {
  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-row h-full overflow-hidden'>
        <div className='flex flex-col w-0 py-6 px-0 md:w-[280px] md:px-6 overflow-y-auto overflow-x-clip text-nowrap bg-bg-secondary transition-all'>
          <Sidebar />
        </div>
        <div className='flex-1 p-8 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
      <div className='md:h-0 md:py-0  h-16 p-4 flex bg-bg-secondary fixed bottom-0 left-0 right-0 items-center justify-around transition-all overflow-clip'>
      </div>
    </div>
  )
}