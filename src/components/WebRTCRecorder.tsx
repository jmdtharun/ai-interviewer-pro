'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Send, RefreshCw, Volume2 } from 'lucide-react';

interface WebRTCRecorderProps {
  onAudioSubmit: (audioBlob: Blob | null, transcriptText: string, durationSeconds: number, frameBlob: Blob | null) => void;
  isProcessing: boolean;
}

export default function WebRTCRecorder({ onAudioSubmit, isProcessing }: WebRTCRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebRTC Media Stream
  useEffect(() => {
    async function setupMediaStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('WebRTC Media access error:', err);
      }
    }
    setupMediaStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Toggle Video Track
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraActive;
        setCameraActive(!cameraActive);
      }
    }
  };

  // Toggle Audio Track
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micActive;
        setMicActive(!micActive);
      }
    }
  };

  // Start Recording
  const startRecording = () => {
    if (!streamRef.current) return;

    audioChunksRef.current = [];
    setTranscript('');
    setTimerSeconds(0);
    setIsRecording(true);

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(250);

      // Start Recording Timer
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Failed to start MediaRecorder:', err);
    }
  };

  // Stop Recording & Send Data
  const stopRecordingAndSubmit = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      // Capture canvas snapshot for vision model
      let frameBlob: Blob | null = null;
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          canvas.toBlob((b) => { frameBlob = b; }, 'image/jpeg', 0.85);
        }
      }

      onAudioSubmit(audioBlob, transcript, timerSeconds, frameBlob);
    };
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex flex-col gap-4 relative overflow-hidden">
      
      {/* Video Feed Workspace */}
      <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-dark-border flex items-center justify-center group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${!cameraActive ? 'hidden' : ''}`}
        />
        
        {!cameraActive && (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <VideoOff className="w-12 h-12" />
            <span className="text-sm font-medium">Webcam Stream Disabled</span>
          </div>
        )}

        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Audio Visualizer Bar */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-bg/80 border border-rose-500/30 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-semibold text-rose-400">
              REC {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Stream Toggle Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-dark-bg/80 backdrop-blur-md px-4 py-2 rounded-full border border-dark-border shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={toggleCamera}
            className={`p-2.5 rounded-full transition-colors ${cameraActive ? 'bg-dark-hover text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}
          >
            {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-full transition-colors ${micActive ? 'bg-dark-hover text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}
          >
            {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editable Live Speech Transcript Box */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-brand-500" /> Speech Transcript Input / Live Voice Text
        </label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Speak into your mic or fine-tune spoken answer here before submitting..."
          className="w-full h-24 p-3 rounded-xl bg-dark-bg border border-dark-border text-gray-200 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none font-sans"
        />
      </div>

      {/* Main Action Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        
        {/* Animated Mic Recording Button */}
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25 active:scale-98 transition-all disabled:opacity-50"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span>Start Voice Answer</span>
          </button>
        ) : (
          <button
            onClick={stopRecordingAndSubmit}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/25 active:scale-98 transition-all animate-pulse"
          >
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{isProcessing ? 'Analyzing AI Metrics...' : 'Finish & Submit Turn'}</span>
          </button>
        )}
      </div>

    </div>
  );
}
