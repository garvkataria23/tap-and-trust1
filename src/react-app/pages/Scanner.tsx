import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import jsQR from 'jsqr';
import { useAuth } from '@/react-app/contexts/useAuth';


export default function ScannerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanned, setScanned] = useState(false);
  const [status, setStatus] = useState("Scanning...");

  // 🎥 Start Camera
  useEffect(() => {
    let localStream: MediaStream;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        localStream = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setStream(mediaStream);
      } catch (err) {
        console.error(err);
        setStatus("Camera access denied ❌");
      }
    };

    startCamera();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 🔍 Handle QR Result
  const handleQRResult = (dataString: string) => {
    if (scanned) return;

    setScanned(true);
    setStatus("QR Detected ✅");


let scannedUserId;

// ✅ Case 1: URL format
if (dataString.startsWith("tap-trust://")) {
  scannedUserId = dataString.split("/").pop();
}

// ✅ Case 2: JSON format
else {
  try {
    const data = JSON.parse(dataString);
    scannedUserId = data.userId;
  } catch {
    alert("Invalid QR Code ❌");
    setScanned(false);
    return;
  }
}

if (!scannedUserId) {
  alert("Invalid QR ❌");
  setScanned(false);
  return;
}

    // Stop camera
    stream?.getTracks().forEach(track => track.stop());

    // 🔥 API CALL
    fetch('http://localhost:5000/api/friends', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: user?.id,
    friendId: scannedUserId,
    category: "friends"
  }),
})
  .then(async (res) => {
    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    alert("Friend Added 🎉");
    navigate('/friends');
  })
  .catch((err) => {
    console.error("FULL ERROR:", err);
    alert("Error adding friend ❌");
    setScanned(false);
  });
  };

  // 🎥 CAMERA SCAN LOOP
  useEffect(() => {
    if (!videoRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let animationId: number;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth * 2;
        canvas.height = video.videoHeight * 2;

        ctx!.imageSmoothingEnabled = false;
        ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, canvas.width, canvas.height, {
          inversionAttempts: "attemptBoth",
        });

        if (code) {
          console.log("QR FOUND:", code.data);
          handleQRResult(code.data);
          return;
        }
      }

      animationId = requestAnimationFrame(scan);
    };

    scan();

    return () => cancelAnimationFrame(animationId);
  }, [stream]);

  // 📁 IMAGE UPLOAD SCAN
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx!.drawImage(img, 0, 0);

      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        console.log("QR FROM IMAGE:", code.data);
        handleQRResult(code.data);
      } else {
        alert("No QR found in image ❌");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white space-y-4">

      {/* CAMERA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-80 h-80 rounded-lg border"
      />

      {/* STATUS */}
      <p className="text-gray-300">{status}</p>

      {/* UPLOAD BUTTON */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 px-4 py-2 rounded-lg"
      >
        Upload QR Image 📁
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-gray-700 px-4 py-2 rounded-lg"
      >
        Back
      </button>

    </div>
  );
}