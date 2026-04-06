import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import jsQR from 'jsqr';

export default function ScannerPage() {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanned, setScanned] = useState(false);
  const [status, setStatus] = useState("Scanning...");

  // 🎥 Start Camera (SAFE VERSION)
  useEffect(() => {
    let localStream: MediaStream;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        localStream = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setStream(mediaStream);
      } catch (err) {
        console.error("Camera error:", err);
        setStatus("Camera access denied ❌");
      }
    };

    startCamera();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 🔍 QR SCANNING LOGIC
  useEffect(() => {
    if (!videoRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let animationId: number;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

        if (imageData) {
          const code = jsQR(imageData.data, canvas.width, canvas.height, {
            inversionAttempts: "attemptBoth",
          });

          if (code && !scanned) {
            setScanned(true);
            setStatus("QR Detected ✅");

            console.log("QR FOUND:", code.data);

            let scannedUserId;

            try {
              const data = JSON.parse(code.data);
              scannedUserId = data.userId;
            } catch (err) {
              alert("Invalid QR Code ❌");
              setScanned(false);
              return;
            }

            if (!scannedUserId) {
              alert("Invalid QR ❌");
              setScanned(false);
              return;
            }

            // 🛑 Stop camera immediately
            stream.getTracks().forEach(track => track.stop());
            cancelAnimationFrame(animationId);

            // 🔥 BACKEND CALL
            fetch('/api/friends/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: scannedUserId }),
            })
              .then(res => res.json())
              .then(() => {
                alert("Friend Added 🎉");
                navigate('/friends');
              })
              .catch(() => {
                alert("Error adding friend ❌");
                setScanned(false);
              });

            return;
          }
        }
      }

      animationId = requestAnimationFrame(scan);
    };

    scan();

    return () => cancelAnimationFrame(animationId);
  }, [stream, scanned]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-80 h-80 rounded-lg border"
      />

      <p className="mt-4 text-gray-300 text-lg">
        {status}
      </p>

    </div>
  );
}