// components/Layout.js
import React from 'react';
import NavBar from './navBar/navBar.js';

function Layout({ children }) {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
