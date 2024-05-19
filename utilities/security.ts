import crypto from "crypto";

function sign(data: any, privateKey: string) {
  const signer = crypto.createSign("sha256");
  signer.update(data);
  signer.end();
  return signer.sign(privateKey, "hex");
}

function verify(data: any, signature: string, publicKey: string) {
  const verifier = crypto.createVerify("sha256");
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, signature, "hex");
}

export { sign, verify };
