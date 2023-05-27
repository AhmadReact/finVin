import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import img from './assets/logo.png'
import img2 from './assets/Group.png'
import CustomInput from './components/customInput/CustomInput'
import { classifierApi } from './service/service'
import { getheader } from './service/getHeader'

function App() {
  const [count, setCount] = useState(0)
  const [base64, setbase64] = useState();

  
  const upload = async () =>{

    
    const date=new Date();
    var myHeaders = new Headers();
    const jsonToSend = {};
    const transcript = "Hi, thank you for .";
    jsonToSend['image'] = transcript;
    const json = JSON.stringify(jsonToSend)
    const header = getheader(json);
    console.log(header);
    myHeaders.append("Content-Type", header['content-type']);
   
    myHeaders.append("X-Amz-Date", header['x-amz-date']);
    myHeaders.append("Authorization", header.Authorization);
    myHeaders.append("X-Amz-Content-Sha256",header['x-amz-content-sha256'])
 
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: json,
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

  
  const checkapi = () =>{

    

    classifierApi(JSON.stringify({
      "image":base64
      })).then()
      
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
