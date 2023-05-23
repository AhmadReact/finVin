class URLRequestSigner {
    constructor() {
      this.hmacShaTypeString = "AWS4-HMAC-SHA256";
      this.awsRegion = "us-west-2";
      this.serviceType = "sagemaker";
      this.aws4Request = "aws4_request";
      this.iso8601Formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }
  
    iso8601() {
      const now = new Date();
      const [
        { value: year },
        ,
        { value: month },
        ,
        { value: day },
        ,
        { value: hour },
        ,
        { value: minute },
        ,
        { value: second },
      ] = this.iso8601Formatter.formatToParts(now);
      const full = `${year}${month}${day}T${hour}${minute}${second}Z`;
      const short = full.substr(0, 8);
      return { full, short };
    }
  
    sign(request, secretSigningKey, accessKeyId) {
      const signedRequest = { ...request };
      const date = this.iso8601();
  
      const bodyData = signedRequest.body;
      if (!bodyData || !signedRequest.url || !signedRequest.url.host) {
        return null;
      }
  
      const body = new TextDecoder().decode(bodyData);
      const { url } = signedRequest;
      const host = url.host;
      signedRequest.headers = signedRequest.headers || {};
      signedRequest.headers["Host"] = host;
      signedRequest.headers["X-Amz-Date"] = date.full;
      signedRequest.headers["X-Amz-Content-Sha256"] =
        "beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3";
  
      const headers = signedRequest.headers;
      const method = signedRequest.method;
  
      const signedHeaders = Object.keys(headers)
        .map((key) => key.toLowerCase())
        .sort()
        .join(";");
  
      const canonicalRequestHash = [
        method,
        url.pathname,
        url.search || "",
        Object.entries(headers)
          .map(([key, value]) => key.toLowerCase() + ":" + value)
          .sort()
          .join("\n"),
        "",
        signedHeaders,
        body.sha256(),
      ].join("\n").sha256();
  
      const credential = [date.short, this.awsRegion, this.serviceType, this.aws4Request].join(
        "/"
      );
  
      const stringToSign = [
        this.hmacShaTypeString,
        date.full,
        credential,
        canonicalRequestHash,
      ].join("\n");
  
      const signature = this.hmacStringToSign(
        stringToSign,
        secretSigningKey,
        date.short
      );
      if (!signature) {
        return null;
      }
  
      const authorization =
        this.hmacShaTypeString +
        " Credential=" +
        accessKeyId +
        "/" +
        credential +
        ", SignedHeaders=" +
        signedHeaders +
        ", Signature=" +
        signature;
      signedRequest.headers["Authorization"] = authorization;
  
      return signedRequest;
    }
  
    hmacStringToSign(stringToSign, secretSigningKey, shortDateString) {
      const k1 = "AWS4" + secretSigningKey;
      const sk1 = new Uint8Array(HMAC_SHA256.key(k1));
      const sk2 = new Uint8Array(HMAC_SHA256.key(sk1));
      const sk3 = new Uint8Array(HMAC_SHA256.key(sk2));
      const sk4 = new Uint8Array(HMAC_SHA256.key(sk3));
      const signature = new Uint8Array(HMAC_SHA256.key(sk4));
  
      return signature ? Array.from(signature).map((byte) => byte.toString(16)).join('') : null;
    }
  }
  
  // Helper function for computing SHA-256 hash
  String.prototype.sha256 = function () {
    const encoder = new TextEncoder();
    const data = encoder.encode(this);
    return new Uint8Array(Crypto.subtle.digest("SHA-256", data));
  };
  
  // Helper function for computing HMAC-SHA256
  const HMAC_SHA256 = {
    async key(key) {
      const encoder = new TextEncoder();
      const encodedKey = encoder.encode(key);
      return await crypto.subtle.importKey(
        "raw",
        encodedKey,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
      );
    },
  
    async authenticate(key, data) {
      return await crypto.subtle.sign("HMAC", key, data);
    },
  };
  

