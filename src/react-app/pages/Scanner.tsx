import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, AlertCircle, Zap, Eye } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { useAuth } from '@/react-app/contexts/useAuth';

export default function ScannerPage() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Camera error:', error);
        setError('Unable to access camera. Please check permissions.');
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              stopCamera();
              navigate('/dashboard');
            }}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Scan QR Code</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Camera View */}
      <main className="flex flex-col items-center justify-center px-6 py-8 max-w-2xl mx-auto min-h-[calc(100vh-80px)]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-purple-600/20"></div>
              <Loader2 className="w-16 h-16 animate-spin text-purple-400 absolute inset-0" />
            </div>
            <p className="text-white/80 font-medium">Initializing camera...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 space-y-4 text-center max-w-sm animate-bounce-in">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div>
              <p className="text-red-300 font-bold text-lg mb-2">Camera Access Denied</p>
              <p className="text-red-300/60 text-sm">
                Please go to settings and allow camera access to scan QR codes.
              </p>
            </div>
            <Button 
              onClick={() => {
                stopCamera();
                navigate('/dashboard');
              }}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300"
            >
              Go Back
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-6 animate-fade-in">
            <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-square object-cover"
              />
              {/* QR Scanner Frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-72 h-72">
                  {/* Animated border */}
                  <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl opacity-30 animate-spin-slow"></div>
                  
                  {/* Corner markers - Top Left */}
                  <div className="absolute top-0 left-0 w-16 h-16">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl"></div>
                    <div className="absolute top-3 left-3 w-4 h-4 bg-cyan-400/20 rounded-full animate-pulse"></div>
                  </div>

                  {/* Corner markers - Top Right */}
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-400 rounded-tr-xl"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 bg-purple-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>

                  {/* Corner markers - Bottom Left */}
                  <div className="absolute bottom-0 left-0 w-16 h-16">
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-pink-400 rounded-bl-xl"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 bg-pink-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>

                  {/* Corner markers - Bottom Right */}
                  <div className="absolute bottom-0 right-0 w-16 h-16">
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 bg-cyan-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  </div>

                  {/* Scanning line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-cyan-400" />
                Position QR Code in Frame
              </h2>
              <p className="text-white/60 text-lg">
                Align the QR code within the frame to scan and add a friend
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  stopCamera();
                  navigate('/dashboard');
                }}
                className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white"
              >
                Cancel Scan
              </Button>
            </div>

            {/* Features Info */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6 space-y-4 hover:border-cyan-500/50 transition-all">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="text-2xl">💡</span> How it works
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold mt-1">1</span>
                  <span>Point camera at someone's Tap & Trust QR code</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold mt-1">2</span>
                  <span>Scan instantly to add them as a friend</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold mt-1">3</span>
                  <span>Valid for 24 hours - extend to keep the connection</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scan {
          0%, 100% {
            top: 0;
          }
          50% {
            top: 100%;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-scan {
          animation: scan 2s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
