// components/Layout.js
import React from 'react';
import NavBar from './navBar/navBar.js';

function Layout({ children }) {
  return (
    /*este se va, el navbar y tamb el import navbar */
    <div>
      
       <NavBar />  
      <main>{children}</main>
    </div>
  );
}

export default Layout;
