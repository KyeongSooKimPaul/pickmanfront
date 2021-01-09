import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = (props) => {
  return props.visible ? (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999999,
        backgroundColor: 'rgb(255, 255, 255)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <></>
  );
};

export default Loader;
