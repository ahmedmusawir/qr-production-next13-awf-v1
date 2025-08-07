// File: app/(public)/qr-png-test/page.tsx

"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QrFullTestPage() {
  const [qrData, setQrData] = useState<string>(
    "https://stark-industries.com/test-data"
  );
  const [imageUrl, setImageUrl] = useState<string>("");
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");

  const [displayStatus, setDisplayStatus] =
    useState<string>("Ready to display.");
  const [uploadStatus, setUploadStatus] = useState<string>("Ready to upload.");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // This function tests the local display generation
  const handleDisplayImage = async () => {
    setImageUrl("");
    if (!qrData) {
      setDisplayStatus("Please enter data to encode.");
      return;
    }
    const dataUrl = await QRCode.toDataURL(qrData, {
      type: "image/png",
      width: 250,
      margin: 2,
      errorCorrectionLevel: "H",
    });
    setImageUrl(dataUrl);
    setDisplayStatus("Local display generated successfully.");
  };

  // This function triggers our backend test API route
  const handleUploadTest = async () => {
    setIsUploading(true);
    setUploadStatus("Sending request to backend API...");
    setSupabaseUrl("");

    try {
      const response = await fetch("/api/test-upload", { method: "POST" });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "An unknown error occurred.");
      }

      setSupabaseUrl(result.url);
      setUploadStatus("Backend test successful! URL received.");
    } catch (error) {
      console.error("Upload test failed:", error);
      setUploadStatus(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Full QR Code Flow Test
          </h1>
          <p className="text-gray-500 mt-1">
            Verify local generation and backend upload to Supabase.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Local Display Test */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-700">
              Phase 1: Local Display
            </h2>
            <p className="text-sm text-center text-gray-500">
              Generate a QR code to prove the library works in the browser.
            </p>
            <div>
              <label
                htmlFor="qr-data"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Data to Encode
              </label>
              <input
                id="qr-data"
                type="text"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleDisplayImage}
              className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
            >
              Generate Local Image
            </button>
            <div className="bg-gray-100 p-2 rounded-md text-center text-sm text-gray-600 min-h-[40px]">
              {displayStatus}
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2 h-40 w-40 mx-auto flex items-center justify-center shadow-inner">
              {imageUrl ? (
                <img src={imageUrl} alt="Displayed QR Code" />
              ) : (
                <div className="text-gray-400 text-xs">Image appears here</div>
              )}
            </div>
          </section>

          {/* Right Side: Backend Upload Test */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-700">
              Phase 2: Backend Upload
            </h2>
            <p className="text-sm text-center text-gray-500">
              Trigger a backend API that generates a QR and uploads it to
              Supabase.
            </p>
            <button
              onClick={handleUploadTest}
              disabled={isUploading}
              className="w-full py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              {isUploading ? "Testing..." : "Run Backend Upload Test"}
            </button>
            <div className="bg-gray-100 p-2 rounded-md text-center text-sm text-gray-600 min-h-[40px]">
              {uploadStatus}
            </div>
            <h3 className="text-md font-semibold text-gray-700 text-center">
              Returned Supabase URL:
            </h3>
            <div className="bg-gray-50 border rounded-md p-2 h-40 w-full flex items-center justify-center break-all text-blue-600 shadow-inner">
              {supabaseUrl ? (
                <a
                  href={supabaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {supabaseUrl}
                </a>
              ) : (
                <span className="text-gray-400 text-xs">
                  URL will appear here
                </span>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
