import React, { useState } from 'react';
import { Upload, Sparkles, Sprout, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api';


export default function CropDoctor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Reset previous result
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      // 1. Send image to backend
      const response = await api.post('/ai/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
      alert("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-earth-800 flex justify-center items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary-600" />
          AI Crop Doctor
        </h1>
        <p className="text-gray-500 mt-2">
          Upload a photo of your affected plant. Our AI will diagnose the issue and suggest a cure.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <div 
  className={`relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-colors ${
    previewUrl ? 'border-primary-200 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
  }`}
>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg" />
            ) : (
              <div className="text-center p-6">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Click to upload photo</p>
                <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          <button 
            onClick={handleAnalyze} 
            disabled={!selectedImage || loading}
            className="w-full btn-primary mt-6 py-3 text-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Diagnose Now"}
          </button>
        </div>

        {/* Right: Diagnosis Result */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative min-h-[300px]">
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
              <Sprout className="w-16 h-16 mb-4 opacity-20" />
              <p>Analysis results will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full text-primary-600">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-medium animate-pulse">Analyzing plant health...</p>
              <p className="text-xs text-gray-400 mt-2">Identifying pests & diseases</p>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${result.diagnosis === 'Healthy' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {result.diagnosis === 'Healthy' ? <CheckCircle className="w-6 h-6 text-green-600" /> : <AlertCircle className="w-6 h-6 text-red-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-earth-800">{result.diagnosis}</h3>
                  <p className="text-sm text-gray-500">Detected in {result.cropName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Symptoms Identified</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    {result.symptoms.map((sym, i) => <li key={i}>{sym}</li>)}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase">Recommended Treatment</h4>
                  <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1">
                    {result.treatment.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-2 text-sm uppercase">Organic/Home Remedy</h4>
                  <p className="text-green-700 text-sm">{result.organicCure}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}