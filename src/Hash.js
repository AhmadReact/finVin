import CryptoJS from "crypto-js";

class URLRequestSigner {
  constructor() {
    this.hmacShaTypeString = 'AWS4-HMAC-SHA256';
    this.awsRegion = 'us-west-2';
    this.serviceType = 'sagemaker';
    this.aws4Request = 'aws4_request';

    this.iso8601Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      formatMatcher: 'basic',
    });
  }

  iso8601() {
    const now = new Date();
    const full = this.iso8601Formatter.format(now);
    const short = full.substring(0, 8);
    return { full, short };
  }

  sign(request, secretSigningKey, accessKeyId) {
    const signedRequest = { ...request };
    const { full, short } = this.iso8601();

    if (
      !signedRequest.body ||
      !signedRequest.url ||
      !signedRequest.url.host ||
      !signedRequest.httpMethod
    ) {
      return null;
    }

    const { body } = signedRequest;
    const { url } = signedRequest;
    const { host } = url;

    signedRequest.headers = signedRequest.headers || {};
    signedRequest.headers.Host = host;
    signedRequest.headers['X-Amz-Date'] = full;
    signedRequest.headers['X-Amz-Content-Sha256'] =
      'beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3';

    const headers = signedRequest.headers;
    const method = signedRequest.httpMethod;

    const signedHeaders = Object.keys(headers)
      .map((key) => key.toLowerCase())
      .sort()
      .join(';');

    const canonicalRequestHash = [
      method,
      url.pathname,
      url.search || '',
      Object.keys(headers)
        .map((key) => key.toLowerCase() + ':' + headers[key])
        .sort()
        .join('\n'),
      '',
      signedHeaders,
      this.sha256(body),
    ].join('\n');

    const credential = [short, this.awsRegion, this.serviceType, this.aws4Request].join('/');

    const stringToSign = [
      this.hmacShaTypeString,
      full,
      credential,
      canonicalRequestHash,
    ].join('\n');

    const signature = this.hmacStringToSign(stringToSign, secretSigningKey, short);
    if (!signature) {
      return null;
    }

    const authorization =
      this.hmacShaTypeString +
      ' Credential=' +
      accessKeyId +
      '/' +
      credential +
      ', SignedHeaders=' +
      signedHeaders +
      ', Signature=' +
      signature;
    signedRequest.headers.Authorization = authorization;

    return signedRequest;
  }

  hmacStringToSign(stringToSign, secretSigningKey, shortDateString) {
    const k1 = 'AWS4' + secretSigningKey;
    const sk1 = Crypto.createHmac('sha256', k1).update(shortDateString).digest();
    const sk2 = Crypto.createHmac('sha256', sk1).update(this.awsRegion).digest();
    const sk3 = Crypto.createHmac('sha256', sk2).update(this.serviceType).digest();
    const sk4 = Crypto.createHmac('sha256', sk3).update(this.aws4Request).digest();
    const signature = Crypto.createHmac('sha256', sk4).update(stringToSign).digest();
    return signature.toString('hex');
  }

  sha256(data) {
    const hash = Crypto.createHash('sha256');
    hash.update(data || '');
    return hash.digest('hex');
  }
}

// Example usage
const signer = new URLRequestSigner();
const request = {
  httpMethod: 'GET',
  url: new URL('https://example.com/api/resource'),
  headers: {},
  body: JSON.stringify({ name: 'John Doe' }),
};

const secretSigningKey = 'tejrNEWXx4NMlSC81rkXohy/d00xjTRjyCfmQ5hr';
const accessKeyId = 'AKIA4LBKETVWEYHNZK5C';

const signedRequest = signer.sign(request, secretSigningKey, accessKeyId);
console.log(signedRequest);
