import React from 'react';

const Loader = ({ startLoader }) => {
  return (
    <div className={`loader ${startLoader}`}>
      <p>The file is loading. Please wait</p>
      <div className="loaderBar"></div>
    </div>
  );
};

export default Loader;
