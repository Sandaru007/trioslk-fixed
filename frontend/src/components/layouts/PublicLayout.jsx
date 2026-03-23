import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const PublicLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      
      {/* 1. The Navigation Bar at the top */}
      <Navbar />
      
      {/* 2. The Main Content area that expands */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* 3. The Footer at the bottom */}
      <Footer />
      
    </div>
  );
};

export default PublicLayout;