import React from 'react';

const Layout = (props) => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {props.children}
  </div>
);

export default Layout;
