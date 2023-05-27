import CryptoJS from "crypto-js";
import { SHA256 } from "crypto-js";

export function getheader(json) {
    const method = 'POST';
    const uri = '/endpoints/pytorch-inference-2023-05-14-06-46-19-753/invocations';
    const secretKey = 'tejrNEWXx4NMlSC81rkXohy/d00xjTRjyCfmQ5hr';
    const accessKey = 'AKIA4LBKETVWEYHNZK5C';
    const region = 'us-east-1';
    const service = 'sagemaker';
    const host = 'runtime.sagemaker.us-east-1.amazonaws.com';
    const alg = 'sha256'
    
    const date = new Date().toISOString().replace(/[:-]/g, '');
    const amzdate2 = new Date().toISOString().split('T')[0];
    const amzdate = date;
    console.clear();
    console.log(amzdate2);
    const algorithm = 'AWS4-HMAC-SHA256';

    const hashedPayloads1 = SHA256(json).toString();;
    
    const canonical_uri = uri;
    const canonical_querystring = '';
    
    const canonical_headers = `content-type:application/json\nhost:${host}\nx-amz-content-sha256:${hashedPayloads1}\nx-amz-date:${amzdate}\n`;
    const signed_headers = 'content-type;host;x-amz-content-sha256;x-amz-date';
    const x="3323cb5dd03ac40958aa24155b1ca7b93a8bb3687db49e8bd949d26eba506a5a"
    const canonical_request = `${method}\n${canonical_uri}\n${canonical_querystring}\n${canonical_headers}\n${signed_headers}\n${x}`;
    


    const credential_scope = `${amzdate2.replaceAll("-","")}/${region}/${service}/aws4_request`;
    console.log(canonical_request);
    const abc = SHA256(canonical_request).toString()
    console.log("Result",abc);
    const string_to_sign = `${algorithm}\n${amzdate.split('.')[0]+"Z"}\n${credential_scope}\n${abc}`;
    
    const kDate = CryptoJS.HmacSHA256(amzdate2, 'AWS4' + secretKey);
    const kRegion = CryptoJS.HmacSHA256('us-east-1', kDate);
    const kService = CryptoJS.HmacSHA256('sagemaker', kRegion);
    const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    const signature = CryptoJS.HmacSHA256(string_to_sign, kSigning);
    const authorization_header = algorithm + ' ' + 'Credential=' + accessKey + '/' + credential_scope + ', ' + 'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature;
    
    console.log(string_to_sign);
    const headers1 = {
      'content-type': 'application/json',
      'x-amz-date': amzdate,
      'x-amz-content-sha256': hashedPayloads1,
      'Authorization': authorization_header
    };
    
    return headers1;

}

