import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import img from './assets/logo.png'
import img2 from './assets/Group.png'
import CustomInput from './components/customInput/CustomInput'

function App() {
  const [count, setCount] = useState(0)
  const [base64, setbase64] = useState();

  
  const upload = async () =>{

    const date=new Date();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Amz-Content-Sha256", "beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3");
    myHeaders.append("X-Amz-Date", "20230522T124213Z");
    myHeaders.append("Authorization", "AWS4-HMAC-SHA256 Credential=AKIA4LBKETVWEYHNZK5C/20230522/us-east-1/sagemaker/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=6ebe13ee9abcef2d6091087bb4674276dea31a3fb8f3f3b32799c6ee6a879f0e");
    const raw = JSON.stringify({
      "image": base64
    });
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    try {
      const response = await fetch("https://runtime.sagemaker.us-east-1.amazonaws.com/endpoints/pytorch-inference-2023-05-14-06-46-19-753/invocations", requestOptions);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.log('error', error);
    }
    

  }





  return (
    <>
      <div className='container'>
      <div className='navbar'>
        <img src={img} width={200}  />
      </div>
      <div className='flex justify-center'>
        <div className='flex justify-between' style={{width:"70%",marginTop:30}}>
         <div> 
        <CustomInput base64={base64} setbase64={setbase64}/>
        <button className='upload'  onClick={()=>upload()}><img className="img2" src={img2} />Upload</button>
        </div>
        <div>
          <div className='preview'>

          </div>
          <h4  style={{margin:"5px 0px",textAlign:"center"}}>Preview</h4>
        </div>
        </div>
      </div>
      <div className='table flex flex-col items-center text-center'>
        <div className='listof'><h2 style={{fontFamily:"Montserrat"}}>List of stock</h2></div>
        <table>
  <tr>
    <th style={{borderTopLeftRadius:12}}>Bottles</th>
    <th style={{borderTopRightRadius:12}}>Quantity</th>
 
  </tr>
  <tbody>
  <tr>
    <td>Pespi</td>
    <td>2</td>
 
  </tr>
  <tr>
    <td>Coke</td>
    <td>10</td>
   
  </tr>
  <tr>
    <td style={{borderBottomLeftRadius:12}}>Fanta</td>
    <td style={{borderBottomRightRadius:12}}>5</td>
    
  </tr>
  </tbody>

  
</table>
      </div>
      </div>
    </>
  )
}

export default App
