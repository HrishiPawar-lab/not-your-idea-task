// src/components/Layouts/RootLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';

const RootLayout = () => (
    <div className="w-screen min-h-screen overflow-hidden bg-background-color">
        <div className="flex w-full h-full">
            <aside className="basis-1">
                <Sidebar />
            </aside>
            <main className=" flex-1 bg-background-color">
                <div className=''>
                    <Header />
                </div>
                <Outlet />
            </main>
        </div>
    </div>
);

export default RootLayout;
