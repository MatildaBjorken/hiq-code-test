import React from 'react';

const DisplayText = ({ text, loadingComplete }) => {
  return (
    <div className="drop-file-preview">
      {text && <div className="file-content">{text}</div>}
    </div>
  );
};

export default DisplayText;
