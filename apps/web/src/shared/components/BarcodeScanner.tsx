import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export function BarcodeScanner({
  onScan,
  continuous = false,
}: {
  onScan: (barcode: string) => void;
  continuous?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader>();

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    reader.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
      if (result) {
        onScan(result.getText());
        if (!continuous) reader.reset();
      }
    });
    return () => {
      reader.reset();
    };
  }, [onScan, continuous]);

  // USB scanner listener
  useEffect(() => {
    let buffer = "";
    let timeout: NodeJS.Timeout;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (buffer) onScan(buffer);
        buffer = "";
        return;
      }
      buffer += e.key;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        buffer = "";
      }, 100);
    };
    window.addEventListener("keypress", handler);
    return () => window.removeEventListener("keypress", handler);
  }, [onScan]);

  return <video ref={videoRef} width="100%" />;
}
