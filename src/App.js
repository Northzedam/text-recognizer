
import { useState, useRef, useEffect} from 'react';
//const { ocrSpace } = require('ocr-space-api-wrapper');
//import ocrSpace from 'ocr-space-api-wrapper'
import Tesseract from 'tesseract.js';
import './App.css';


function App() {
  const [file, setFile] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [textState, setTextState] = useState([]);


  const inputRef = useRef(null);

  const resetFileInput = () => {
    // 👇️ reset input value
    inputRef.current.value = null;
  };
 
  const handleChange = (event) => {
    console.log('event',event)
    setImagePath((URL.createObjectURL)(event.target.files[0]));
    setFile(event.target.files[0])
  }
 
  const processData = () => {
  
    Tesseract.recognize(
      imagePath,'esp',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.error(err);
      alert(err)
    })
    .then(result => {
      alert(result.data.text)
      // Get Confidence score
      let confidence = result.confidence
     
      let text = result.data.text
      let totalTicket = text//text.slice(text.indexOf('TOTAL') );
      setTextState(current => [...current, totalTicket]) // agrego al state array
      console.log(result.data.text);
      console.log('text',textState)
      setImagePath('')
      resetFileInput()
    })
  }

  const listaElementos = textState.map(data => {
    return(  <li>{data}</li>)
  })

  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setImagePath(result)
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);

 
  return (
    <div className="App">
      <main className="App-main">
        <h3>Lista de supermercado</h3>
        <img style={{height:200,width:200}}  
           src={imagePath} className="App-image" alt="logo"/>
        
          <h3>Total en carrito</h3>
        <div className="text-box">
          <ul> {listaElementos} </ul>
        </div>
        <input type='file' src="enviroment" capture="camera" accept="image/*" ref={inputRef} onChange={handleChange} />
        <button onClick={processData} style={{height:50}}> convert to text</button>
      </main>
    </div>
  );
}
 
export default App
