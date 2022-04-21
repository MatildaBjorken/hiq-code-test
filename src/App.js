import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';
import DropFileInput from './components/dropFile';
import DisplayText from './components/displayText';
import Loader from './components/loader';

const App = () => {
  const [text, setText] = useState();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loaderClassName, setLoaderClassName] = useState('hidden');
  const [commonWord, setCommonWord] = useState([]);
  const [color, setColor] = useState('yellow');
  const [showMessage, setShowMessage] = useState('Drag & Drop your file here');
  const [dragging, setDragging] = useState(false);
  const drop = useRef(null);
  const drag = useRef(null);
  let fileReader;

  useEffect(() => {
    drop.current.addEventListener('dragover', handleDragOver);
    drop.current.addEventListener('drop', onFileDrop);
    drop.current.addEventListener('dragenter', handleDragEnter);
    drop.current.addEventListener('dragleave', handleDragLeave);

    return () => {
      drop.current.removeEventListener('dragover', handleDragOver);
      drop.current.removeEventListener('drop', onFileDrop);
      drop.current.removeEventListener('dragenter', handleDragEnter);
      drop.current.removeEventListener('dragleave', handleDragLeave);
    };
  }, []);

  useEffect(() => {
    manipulateCommonWord();
  }, [commonWord]);

  // Updates the 'Drop box' with new message
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMessage('Drop it here baby!');
    setLoadingComplete(false);
    setLoaderClassName('hidden');
    setColor('blue');
  };

  // Updates the 'Drop box' with new message
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMessage('Drop it here baby!');
    setColor('blue');
    setLoadingComplete(false);
    setLoaderClassName('hidden');

    if (e.target !== drag.current) {
      setDragging(true);
    }
  };
  // Resets the 'Drop box' to it's original state
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMessage('Drag & Drop your files here');
    setColor('yellow');

    if (e.target === drag.current) {
      setDragging(false);
    }
  };
  //  Controlls that the file is correct and updates the DOM 'Drop area'
  const onFileDrop = (e) => {
    let fileTypes = ['txt', 'file', 'rtf', 'md', 'wpd', 'odt', 'tex'];
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);

    let file = [...e.dataTransfer.files][0];

    let filesLength = [...e.dataTransfer.files].length;

    if (file && filesLength < 2) {
      var extension = file.name.split('.').pop().toLowerCase(),
        isSuccess = fileTypes.indexOf(extension) > -1;
      if (isSuccess) {
        setShowMessage('Wheyyy here you have your file good sir!');
        setColor('green');
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
      } else {
        setShowMessage('Sorriii, this file type is not supported');
        setColor('red');
      }
    } else {
      setShowMessage('Eyy dude relax I can only handle one file at the time');
    }
  };

  //  Handles the file and populate the state with the files text
  const handleFileRead = (e) => {
    let content = fileReader.result;

    setLoaderClassName('visible');
    setText(content);
    searchCommonWord(content.toLowerCase());
  };

  // Search through every words and count how many time they appear in the text
  const searchCommonWord = (content) => {
    let words = content.match(/\b[a-z][a-zA-Z]*/g);

    let occurances = {};

    if (words) {
      words.forEach((word) => {
        if (occurances[word]) {
          occurances[word]++;
        } else {
          occurances[word] = 1;
        }
      });
    } else {
      setColor('red');
      return setShowMessage('Nopeeee, no content in this file..');
    }

    let max = 0;

    // Checking the highest frequency for a word
    for (let word of words) {
      if (occurances[word] > max) {
        max = occurances[word];
      }
    }

    // Checking if any other word have the same occurances
    for (const [key, value] of Object.entries(occurances)) {
      if (parseInt(`${value}`) === max) {
        setCommonWord((prevArray) => [...prevArray, `${key}`]);
      }
    }
  };

  // Inserting foo and bar around the most common word
  const manipulateCommonWord = () => {
    let updatedText = text;

    if (commonWord.length !== undefined && commonWord.length != 0) {
      // Loop to check if there are multiple words that occur the same amount of time
      commonWord.forEach((common) => {
        let re = new RegExp(`\\b${common}\\b`, 'ig');
        updatedText = updatedText.replaceAll(re, 'foo' + common + 'bar');
      });
      setText(updatedText);
      setLoadingComplete(true);
    }
  };

  return (
    <div className="drop-file-wrapper">
      <div className="navbar">
        <div className="close-btn"></div>
        <div className="title">
          <div className="bars"></div>
          <h2 className="header">Drop that file</h2>
          <div className="bars"></div>
        </div>
      </div>
      <DropFileInput reference={drop} showMessage={showMessage} color={color} />
      {loadingComplete ? (
        <DisplayText text={text} loadingComplete={loadingComplete} />
      ) : (
        <Loader startLoader={loaderClassName} />
      )}
    </div>
  );
};

export default App;
