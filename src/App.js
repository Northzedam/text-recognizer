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
    alert(JSON.stringify(event.target.files[0]))
    //setImagePath((URL.createObjectURL)(event.target.files[0]));
    setFile(event.target.files[0])
    console.log(event.target)
  }
 
  const processData = () => {

      var formData = new FormData();
     // formData.append("base64image", imagePath);
      formData.append("base64image", imagePath);
      formData.append("language","eng");
      formData.append("apikey","K89272055488957");
      formData.append("isOverlayRequired", true);
      console.log(formData);
     
        axios({
          method: "post",
          url: "https://api.ocr.space/parse/image",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" ,"apikey":"K89272055488957"},
        })
          .then(function (response) {
            //handle success
            console.log(response);
            //alert(file)
            //alert(response.data.ParsedResults[0].ParsedText)
            setTextState( arrayText => [ ...arrayText ,response.data.ParsedResults[0].ParsedText])
          })
          .catch(function (response) {
            //handle error
            console.log(response);
            //alert(response)
          });
        
       
      // ==========================================
  }

  const listaElementos = textState.map(data => {
    return(  <textarea style={{width:300}} key={textState.indexOf(data)}>{data}</textarea>)
  })

  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          //alert('result de fileReader es: ',result)
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
        <input type='file' src="enviroment" accept="image/*" ref={inputRef} onChange={handleChange} />
        <button onClick={processData} style={{height:50}}> convert to text</button>
      </main>
    </div>
  );
}
 
export default App
