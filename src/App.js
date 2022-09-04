import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyAQGA8JTs96JulYAhxhn48vMFSYOTDiP34",
  authDomain: "basededatosjstest.firebaseapp.com",
  projectId: "basededatosjstest",
  storageBucket: "basededatosjstest.appspot.com",
  messagingSenderId: "22374240902",
  appId: "1:22374240902:web:4d7945bd4e9c07190ff707",
  measurementId: "G-09T9RSBTRK"
};



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

      let requestBody = {
        base64image: imagePath,
        FileType:'PNG'
      }
      let headers = {
        apikey:'K89272055488957'
        
      }
      
      // connect with ocr-space ===================
        console.log('requestBody: ',requestBody);
        axios.post('https://api.ocr.space/parse/image', requestBody,{'headers':headers}    // parameters are url,body,headers
        
        ).then(function(response) {
           let res = response.data;
           console.log(res)
           alert(res.IsErroredOnProcessing)
           //console.log(res.ParsedResults[0].ParsedText);
        }).catch(function (error) {
           console.log(error);
        });
      // ==========================================
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
          console.log('result',result)
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
