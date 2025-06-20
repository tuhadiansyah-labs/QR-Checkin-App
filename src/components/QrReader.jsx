import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import "./QrStyles.css";
import QrFrame from "../assets/QrFrame.svg";

const QrReader = ({ onScan }) => {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [scannedResult, setScannedResult] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(
        videoEl.current,
        (result) => {
          setScannedResult(result?.data);
          if (onScan) onScan(result?.data);
        },
        {
          onDecodeError: (err) => {
            // Optionally handle scan errors
            // console.log(err);
          },
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl.current || undefined,
        }
      );
      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          setQrOn(false);
        });
    }
    // Listen for when the video is ready
    const video = videoEl.current;
    if (video) {
      const onPlay = () => setCameraReady(true);
      video.addEventListener('playing', onPlay);
      return () => {
        video.removeEventListener('playing', onPlay);
        scanner.current?.stop();
      };
    }
    return () => {
      scanner.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader">
      <div className="debug-label">QR SCANNER DEBUG</div>
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        {cameraReady && (
          <img
            src={QrFrame}
            alt="Qr Frame"
            width={256}
            height={256}
            className="qr-frame"
          />
        )}
      </div>
      {scannedResult && (
        <p
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}
        >
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
  );
};

export default QrReader;