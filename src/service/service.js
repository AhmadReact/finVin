
import axios from "axios";
import { SHA256 } from "crypto-js";
import CryptoJS from "crypto-js";
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';

function calculateAWSSignature(httpMethod, path, queryParams, headers, payload, secretAccessKey, accessKeyId, region, service) {
  // Step 1: Create a canonical request
  console.log(httpMethod);
  console.log(path);
  console.log(queryParams);
  console.log(headers);
  console.log(payload);
  console.log(secretAccessKey);
  console.log(accessKeyId);
  console.log(region);
  console.log(service);
  const canonicalRequest = createCanonicalRequest(httpMethod, path, queryParams, headers, payload);

  // Step 2: Create a string to sign
  const stringToSign = createStringToSign(canonicalRequest, region, service);

  // Step 3: Generate the signature
  const signature = calculateSignature(stringToSign, secretAccessKey, region, service, accessKeyId);

  return signature;
}

function createCanonicalRequest(httpMethod, path, queryParams, headers, payload) {
  // Implement the logic to create the canonical request based on the AWS guidelines
  // You can refer to the AWS documentation for more details on the canonical request format
  // The canonical request should include the HTTP method, path, query parameters, headers, and payload
  // Example: return `${httpMethod}\n${path}\n${queryParams}\n${headers}\n\n${payload}`;
  return '';
}

function createStringToSign(canonicalRequest, region, service) {
  // Implement the logic to create the string to sign based on the AWS guidelines
  // The string to sign should include the algorithm, current timestamp, credential scope, and the hash of the canonical request
  // Example: return `AWS4-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${hash(canonicalRequest)}`;
  return '';
}

function calculateSignature(stringToSign, secretAccessKey, region, service, accessKeyId) {
  // Step 1: Derive signing key
  const timestamp = getTimestamp();
  const date = timestamp.substr(0, 8);
  const kDate = CryptoJS.HmacSHA256(date, 'AWS4' + secretAccessKey);
  const kRegion = CryptoJS.HmacSHA256(region, kDate);
  const kService = CryptoJS.HmacSHA256(service, kRegion);
  const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);

  // Step 2: Calculate the signature
  const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString(CryptoJS.enc.Hex);

  return signature;
}

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
}



function calculateCanonicalRequestHash(httpMethod, canonicalUri, canonicalQueryString, canonicalHeaders, signedHeaders, payload) {
    // Normalize the HTTP method, URI, query string, and headers



    const normalizedHttpMethod = httpMethod.toUpperCase();
    const normalizedCanonicalUri = canonicalUri.replace(/\/{2,}/g, '/');
    const normalizedCanonicalQueryString = canonicalQueryString ? canonicalQueryString : '';
    const normalizedCanonicalHeaders = canonicalHeaders.trim().replace(/\s+/g, ' ');
  
    // Construct the canonical request string
    const canonicalRequest = `${normalizedHttpMethod}\n${normalizedCanonicalUri}\n${normalizedCanonicalQueryString}\n${normalizedCanonicalHeaders}\n${signedHeaders}\n${CryptoJS.SHA256(payload).toString()}`;
  
    // Calculate the hash of the canonical request
    const canonicalRequestHash = CryptoJS.SHA256(canonicalRequest).toString();
    
    return canonicalRequestHash;
  }
  

export async function  classifierApi (event) {

    let body = event;


    var newDate = new Date()
    var iso = new Date();
   var today = iso.toISOString()

 
var spl=today.split('T')[0];

  
 function calculateHmacSha256(key, data) {
    const hmac = CryptoJS.HmacSHA256(data, key);
    const hashedData = hmac.toString(CryptoJS.enc.Hex);
    return hashedData;
  }
    const secretKey = 'your_secret_key';
    const dataToHash = 'data_to_hash';
  
    const URL = '/endpoints/pytorch-inference-2023-05-14-06-46-19-753/invocations';
    const canonical_querystring = '';
    const algorithm = 'AWS4-HMAC-SHA256';
    const host = 'runtime.sagemaker.us-east-1.amazonaws.com';
    const kSecret = "tejrNEWXx4NMlSC81rkXohy/d00xjTRjyCfmQ5hr";

    const hasPayload = SHA256(body).toString();
    const signed_headers = 'content-type;host;x-amz-content-sha256;x-amz-date';
    const canonical_headers = 'content-type:' + 'application/json' + '\n' + 'host:' + host + '\n' + 'x-amz-content-sha256:' + hasPayload + '\n' + 'x-amz-date:' + today + '\n';
   
    const credentialScope = today.split('T')[0].replaceAll("-","") + '/' + 'us-east-1' + '/' + 'sagemaker' + '/' + 'aws4_request';
    const hashCanonicalRequest = 'POST' + '\n' + URL + '\n' + canonical_querystring + '\n' + canonical_headers + '\n' + signed_headers + '\n' + hasPayload;
    const calculatedhash = calculateCanonicalRequestHash('POST',URL ,canonical_querystring,canonical_headers,signed_headers ,body)
    const calculatedhash2=calculateAWSSignature('POST' , URL ,canonical_querystring ,canonical_headers, body ,'tejrNEWXx4NMlSC81rkXohy/d00xjTRjyCfmQ5hr', 'AKIA4LBKETVWEYHNZK5C','us-east-1','sagemaker')
    
    const hashedData = calculateHmacSha256("tejrNEWXx4NMlSC81rkXohy/d00xjTRjyCfmQ5hr", hashCanonicalRequest);


    const string_to_sign = algorithm + '\n' + today.slice(0,19).replaceAll("-","").replaceAll(":","")+"Z" + '\n' + credentialScope + '\n' + calculatedhash2;
    console.log(string_to_sign);
    const kDate = CryptoJS.HmacSHA256(today, 'AWS4' + kSecret);
    const kRegion = CryptoJS.HmacSHA256('us-east-1', kDate);
    const kService = CryptoJS.HmacSHA256('sagemaker', kRegion);
    const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    const signature = CryptoJS.HmacSHA256(string_to_sign, kSigning);
    const authorization_header = algorithm + ' ' + 'Credential=' + "AKIA4LBKETVWEYHNZK5C" + '/' + credentialScope + ', ' + 'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature;

    let config = {
      method: 'post',
      // maxBodyLength: Infinity,
      url: 'https://runtime.sagemaker.us-east-1.amazonaws.com/endpoints/pytorch-inference-2023-05-14-06-46-19-753/invocations',
      headers: { 
        "Content-Type": "application/json",
        "X-Amz-Content-Sha256": hasPayload,
        "X-Amz-Date": today,
        "Authorization": authorization_header,
      },
      data : body
    };
    
    console.log("CONFIG -->" , config)

    let sageMakerResponce = await axios.request(config);
    console.log("SAGE MAKER RESPONCE -->" , sageMakerResponce)

    return sageMakerResponce
    
    // return true;
};





//      var iso = new Date();
//   var today = iso.toISOString()



// const apiUrl = new URL('https://runtime.sagemaker.us-east-1.amazonaws.com/endpoints/pytorch-inference-2023-05-14-06-46-19-753/invocations');
// console.log(apiUrl);
// const sigv4 = new SignatureV4({
//   service: 'sagemaker',
//   region: 'us-east-1',
//   credentials: {
//     accessKeyId: "AKIA4LBKETVWEYHNZK5C",
//     secretAccessKey: "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",
//     sessionToken:""
//   },
//   sha256: Sha256,
// });

// export const handler = async () => {

//     console.log("called");
//   const signed = await sigv4.sign({
//     method: 'POST',
//     hostname: apiUrl.host,
//     path: apiUrl.pathname,
//     protocol: apiUrl.protocol,
//     headers: {
//       'Content-Type': 'application/json',
//       host: apiUrl.hostname, // compulsory
//     },
//   });

//   try {
//     const { data } = await axios({
//       ...signed,
//       url: 'https://runtime.sagemaker.us-east-1.amazonaws.com/endpoints/pytorch-inference-2023-05-14-06-46-19-753/invocations', // compulsory
//     });

//     console.log('Successfully received data: ', data);
//     return data;
//   } catch (error) {
//     console.log('An error occurred', error);

//     throw error;
//   }
// };

