"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  ImagePlus,
  X,
  Loader2,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Volume2,
} from "lucide-react";
import { useTextToSpeech } from "@/hooks/usetextspeech";

type Severity = "healthy" | "moderate" | "severe";

interface DiagnosisResult {
  diseaseName: string;
  crop: string;
  confidence: number;
  severity: Severity;
  remedy: string[];
  prevention: string[];
  description?: string;
}

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string; label: string }> = {
  healthy: { bg: "bg-green-100", text: "text-green-700", label: "Healthy" },
  moderate: { bg: "bg-amber-100", text: "text-amber-700", label: "Moderate" },
  severe: { bg: "bg-red-100", text: "text-red-700", label: "Severe" },
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMimeType(file: File): string {
  const type = file.type.toLowerCase();
  if (type === "image/png") return "image/png";
  if (type === "image/gif") return "image/gif";
  if (type === "image/webp") return "image/webp";
  return "image/jpeg";
}

export default function DiseaseUpload() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { speak, stop, isSpeaking } = useTextToSpeech();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setImageFile(file);
      setResult(null);
      setError(null);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [previewUrl]
  );

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    stop();
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }, [previewUrl, stop]);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const imageBase64 = await fileToBase64(imageFile);
      const mimeType = getMimeType(imageFile);

      const response = await fetch("/api/analyze-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Analysis failed");
      }

      const diagnosis: DiagnosisResult = await response.json();
      setResult(diagnosis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile]);

  const severityStyle = result ? SEVERITY_STYLES[result.severity] : null;

  return (
    // Outer wrapper: centers the card in the viewport and reserves enough
    // top space so the fixed/floating navbar never overlaps the content.
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-emerald-50/40 via-white to-white px-4 pb-12 pt-24 sm:px-6 sm:pt-28">
      <div className="w-full max-w-xl md:max-w-2xl">
        {!previewUrl && (
          <div className="relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/80 px-6 py-14 text-center shadow-[0_20px_60px_rgba(4,120,87,0.10)] backdrop-blur-sm sm:py-16">
            {/* Decorative ambient glow — purely visual, no functional role */}
            <div
              className="pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl"
              aria-hidden="true"
            />

            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
              <ImagePlus className="h-7 w-7 text-white" aria-hidden="true" />
            </span>
            <h3 className="relative mt-5 text-lg font-bold text-emerald-900">
              Upload a crop image
            </h3>
            <p className="relative mt-1.5 text-sm text-gray-500">
              Take a photo or upload from your gallery
            </p>

            <div className="relative mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-300 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                Open Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                Upload from Gallery
              </button>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              aria-label="Take a photo of crop"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Upload crop image from gallery"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {previewUrl && (
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_15px_45px_rgba(4,120,87,0.08)]">
            <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-64">
              <Image
                src={previewUrl}
                alt="Preview of the uploaded crop image"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <button
                onClick={handleRemoveImage}
                aria-label="Remove uploaded image"
                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {!result && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                aria-busy={isAnalyzing}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:opacity-60 disabled:hover:scale-100"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Leaf className="h-4 w-4" aria-hidden="true" />
                    Analyze Crop
                  </>
                )}
              </button>
            )}

            <p role="status" aria-live="polite" className="sr-only">
              {isAnalyzing ? "Analyzing crop image, please wait." : result ? "Analysis complete." : ""}
            </p>
          </div>
        )}

        {result && severityStyle && (
          <div className="mt-4 space-y-4">
            <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_15px_45px_rgba(4,120,87,0.08)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400">{result.crop}</p>
                  <h3 className="mt-0.5 text-lg font-bold text-green-900">
                    {result.diseaseName}
                  </h3>
                  {result.description && (
                    <p className="mt-1 text-sm text-gray-500">{result.description}</p>
                  )}
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${severityStyle.bg} ${severityStyle.text}`}
                >
                  {result.severity === "healthy" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {severityStyle.label}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span id="confidence-label">Confidence</span>
                  <span>{result.confidence}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-labelledby="confidence-label"
                  aria-valuenow={result.confidence}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-50 to-green-50 p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-green-900">Natural Remedy</h4>
                <button
                  onClick={() => (isSpeaking ? stop() : speak(result.remedy.join(". ")))}
                  aria-label={isSpeaking ? "Stop reading remedy aloud" : "Read remedy aloud"}
                  className="flex items-center gap-1 text-xs font-medium text-green-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
                >
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {isSpeaking ? "Stop" : "Listen"}
                </button>
              </div>
              <ol className="mt-3 space-y-2">
                {result.remedy.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="font-semibold text-green-700">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_15px_45px_rgba(4,120,87,0.08)]">
              <h4 className="text-sm font-semibold text-green-900">Prevention Tips</h4>
              <ul className="mt-3 space-y-2">
                {result.prevention.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-600" aria-hidden="true" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleRemoveImage}
              className="w-full rounded-full border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              Scan Another Crop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}