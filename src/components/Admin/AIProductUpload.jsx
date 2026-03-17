import { useState } from 'react';
import apiClient from '../../lib/apiClient';
import ProductUploadForm from './ProductUploadForm';

const safeParseRaw = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.replace(/```json?/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
};

const AIProductUpload = () => {
  const [productText, setProductText] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prefill, setPrefill] = useState({});

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('productText', productText);
      files.forEach((f) => formData.append('images', f));
      const { data } = await apiClient.post('/ai/extract-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      let extracted = data.extractedData || {};
      if (extracted.raw) {
        const parsed = safeParseRaw(extracted.raw);
        if (parsed) extracted = parsed;
      }
      setPrefill(extracted);
    } catch (err) {
      setError(err.response?.data?.message || 'AI extraction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">AI Assist (Groq)</h3>
          <p className="text-sm text-slate-600">Paste product text + optional images. Fields below auto-fill.</p>
        </div>
        <button
          type="button"
          onClick={handleExtract}
          disabled={loading || !productText}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Extracting…' : '?? Extract with AI'}
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          rows={5}
          placeholder="e.g., Red silk saree with gold border, 6 meters, hand-embroidered, ?2500, festival wear, hand wash..."
          value={productText}
          onChange={(e) => setProductText(e.target.value)}
        />
        <div className="space-y-2 text-sm">
          <label className="block rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="text-slate-700">Images (optional)</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="mt-2 w-full text-xs"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </label>
          {files.length ? <div className="text-xs text-slate-500">{files.length} image(s) attached</div> : null}
        </div>
      </div>
      {error ? <div className="text-sm text-rose-600">{error}</div> : null}

      <div className="pt-2">
        <ProductUploadForm initialData={prefill} />
      </div>
    </div>
  );
};

export default AIProductUpload;
