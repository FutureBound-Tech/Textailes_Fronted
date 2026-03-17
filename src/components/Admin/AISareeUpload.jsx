import React, { useState } from 'react';
import apiClient from '../../lib/apiClient';

export default function AISareeUpload() {
  const [productText, setProductText] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [message, setMessage] = useState('');

  // Form states mapping to what the backend controller expects
  const [formData, setFormData] = useState({
    name: '',
    series: '',
    price: '',
    discount: '',
    quantity: '1',
    material: '',
    colors: '',
    sizes: '',
    description: '',
    careInstructions: ''
  });

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleExtract = async () => {
    if (!productText) {
      setMessage('Please paste some text first.');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('Extracting with Groq AI...');
      const fd = new FormData();
      fd.append('productText', productText);
      images.forEach(file => fd.append('images', file));

      const res = await apiClient.post('/ai/extract-product', fd);
      if (res.data.success) {
        const data = res.data.extractedData;
        
        let extractedColors = data.colors || [];
        if (!Array.isArray(extractedColors) && typeof extractedColors === 'string') {
          extractedColors = [extractedColors];
        }

        let extractedSizes = data.sizes || [];
        if (!Array.isArray(extractedSizes) && typeof extractedSizes === 'string') {
          extractedSizes = [extractedSizes];
        }

        setExtracted(data);
        setFormData({
            name: data.itemName || '',
            series: data.seriesCollection || '',
            price: data.pricing?.suggestedPrice || 0,
            discount: 0,
            quantity: 1,
            material: data.clothType || data.fabric || '',
            colors: extractedColors.join(', '),
            sizes: extractedSizes.join(', '),
            description: data.description || '',
            careInstructions: data.careInstructions || ''
        });
        setMessage('Extraction successful! Please review and adjust.');
      }
    } catch (err) {
       console.error(err);
       setMessage('AI extraction failed. Please check backend connection and Groq API Key.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSave = async () => {
     try {
       setLoading(true);
       setMessage('Saving product...');
       const fd = new FormData();
       
       for (const key in formData) {
         if (key === 'colors' || key === 'sizes') {
           const items = formData[key].split(',').map(s => s.trim()).filter(Boolean);
           items.forEach(item => fd.append(key, item));
         } else {
           fd.append(key, formData[key]);
         }
       }
       
       // Append the original images for the actual product upload
       images.forEach(file => fd.append('images', file));
       
       // Uses the backend admin endpoint
       await apiClient.post('/admin/products', fd);
       
       setMessage('✅ Product LIVE on your store! 🎉');
       setExtracted(null);
       setFormData({
         name: '', series: '', price: '', discount: '', quantity: '1', material: '', colors: '', sizes: '', description: '', careInstructions: ''
       });
       setProductText('');
       setImages([]);
       
       // Force reload product table if using redux by dispatching an event or reload page
     } catch(err) {
       console.error(err);
       setMessage('Error saving product.');
     } finally {
       setLoading(false);
     }
  };

  return (
     <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🤖 AI Saree Extractor</h2>
        <p className="text-sm text-slate-500 mb-6">Paste your WhatsApp message, upload photos, and let AI do the rest!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Message / Details</label>
              <textarea 
                className="w-full border border-slate-300 rounded-md p-3 text-sm min-h-[150px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Paste saree description here..."
                value={productText}
                onChange={(e) => setProductText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Product Photos (Optional)</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            
            <button 
              onClick={handleExtract}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Extracting with Groq AI...' : '✨ Extract with Groq AI'}
            </button>
            
            {message && (
              <div className={`p-3 rounded-md text-sm font-medium ${message.includes('failed') || message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4">Product Details (Auto-filled)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Series/Collection</label>
                  <input type="text" name="series" value={formData.series} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Material</label>
                  <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2" />
                  {extracted && extracted.pricing && (
                     <p className="text-[10px] text-green-600 mt-1">Suggested: ₹{extracted.pricing.suggestedPrice}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Discount</label>
                  <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Colors (Comma separated)</label>
                <input type="text" name="colors" value={formData.colors} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Care Instructions</label>
                <input type="text" name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description (Copy)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border-slate-300 rounded-md text-sm p-2 min-h-[80px]" />
              </div>
              
              <button 
                onClick={handleSave}
                disabled={loading || !formData.name}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                ✅ Save Product
              </button>
            </div>
          </div>
        </div>
     </div>
  );
}
