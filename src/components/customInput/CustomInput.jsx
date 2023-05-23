import React, { useState } from 'react'

const CustomInput = ({base64,setbase64}) => {
  const [file,setfile] = useState();
  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setbase64(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
 
  const read = (e) =>{
    console.log(e);
    setfile(e.target.files[0].name);
    getBase64(e.target.files[0]);

  }

  return (
    <div className='custombtn'>

      <input type="text" className='simple' value={file}  />
     
      <input type='file' className='custom-file-input' onChange={(e)=>read(e)} />
      
    
    </div>
  )
}

export default CustomInput