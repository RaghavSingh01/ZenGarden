import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Nav/Navbar.jsx';

export default function AuthLayout({ brand = { name: 'ZenGarden', to: '/' } }) {
  return (
    <>
      <Navbar
        role="guest"
        user={null}
        links={[]}
        brand={brand}
      />
      <main className="container center" style={{ padding: 16 }}>
        <div style={{ width: 'min(540px, 100%)' }}>
          <Outlet />
        </div>
      </main>
    </>
  );
}