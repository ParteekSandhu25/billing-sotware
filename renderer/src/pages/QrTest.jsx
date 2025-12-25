import { useState } from "react";

export default function QrTest() {
  const [qr, setQr] = useState("");
  const [product, setProduct] = useState(null);

  const handleScan = async (e) => {
    if (e.key === "Enter") {
      const res = await window.api.getProductByQR(qr);
      setProduct(res);
      setQr("");
    }
  };

  return (
    <>
      <input
        autoFocus
        placeholder="Scan QR here"
        value={qr}
        onChange={(e) => setQr(e.target.value)}
        onKeyDown={handleScan}
      />

      {product && (
        <div>
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
        </div>
      )}
    </>
  );
}
