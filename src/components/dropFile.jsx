import React from 'react';
import PropTypes from 'prop-types';

const DropFileInput = ({ reference, showMessage, color }) => {
  return (
    <div>
      <div ref={reference} className={`drop-file-input ${color}`}>
        <p>{showMessage}</p>
      </div>
    </div>
  );
};

export default DropFileInput;
