import React from 'react';
import '../Load.css';

const Loading = () => {
  return (
    <div className="rfc-wrapper">
      <div className="rfc-reel-container">
        <div className="rfc-reel-disk">
          <div className="rfc-cutout"></div>
          <div className="rfc-cutout"></div>
          <div className="rfc-cutout"></div>
          <div className="rfc-inner-ring"></div>
          <div className="rfc-reel-core"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
