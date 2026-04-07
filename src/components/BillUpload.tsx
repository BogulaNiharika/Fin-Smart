import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Loader2, Check, AlertCircle, Calendar, Store, CreditCard, Tag, IndianRupee } from 'lucide-react';
import { extractBillData } from '../services/gemini';
import { Transaction } from '../types';
import { cn } from '../types';

interface BillUploadProps {
  onSave: (transaction: Transaction) => void;
  existingTransactions: Transaction[];
}

export default function BillUpload({ onSave, existingTransactions }: BillUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<Transaction> | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [tag, setTag] = useState<'Personal' | 'Business'>('Personal');

  const handleFileChange = useCallback(async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
      alert('Please upload an image or PDF file.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);

    // Start AI Processing
    setIsProcessing(true);
    setExtractedData(null);
    setIsDuplicate(false);

    try {
      const base64 = await fileToBase64(selectedFile);
      const data = await extractBillData(base64, selectedFile.type);
      
      setExtractedData(data);
      
      // Check for duplicates (simple heuristic: same merchant and amount on same day)
      const duplicate = existingTransactions.some(tx => 
        tx.merchant.toLowerCase() === data.merchant?.toLowerCase() && 
        tx.amount === data.amount &&
        tx.date === data.date
      );
      setIsDuplicate(duplicate);
    } catch (error) {
      console.error("Extraction failed:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [existingTransactions]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSave = () => {
    if (extractedData && extractedData.amount && extractedData.merchant && extractedData.date && extractedData.category && extractedData.payment_type) {
      onSave(extractedData as Transaction);
      reset();
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setExtractedData(null);
    setIsProcessing(false);
    setIsDuplicate(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">Upload Bill</h3>
        <p className="text-slate-500 text-sm">AI-powered expense extraction from receipts.</p>
      </div>

      {!file ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileChange(e.dataTransfer.files[0]);
            }
          }}
          className="glass-card border-dashed border-2 border-slate-200 flex flex-col items-center justify-center py-20 group cursor-pointer hover:border-accent/50 transition-all"
          onClick={() => document.getElementById('bill-upload')?.click()}
        >
          <input 
            id="bill-upload" 
            type="file" 
            className="hidden" 
            accept="image/*,application/pdf" 
            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} 
          />
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all">
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-accent" />
          </div>
          <p className="text-slate-900 font-bold text-lg mb-2">Click or drag & drop</p>
          <p className="text-slate-500 text-sm">Supports JPG, PNG, PDF (Max 5MB)</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card relative overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-slate-900 font-bold">Bill Preview</h4>
              <button onClick={reset} className="text-slate-400 hover:text-warning transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden relative min-h-[400px] flex items-center justify-center">
              {preview && (
                <img 
                  src={preview} 
                  alt="Bill Preview" 
                  className={cn("max-w-full max-h-full object-contain transition-all duration-700", isProcessing ? "blur-sm opacity-50" : "blur-0 opacity-100")} 
                />
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-accent animate-spin" />
                  <p className="text-accent font-bold animate-pulse">AI is extracting data...</p>
                </div>
              )}

              {/* Animated Overlays for detected fields */}
              <AnimatePresence>
                {!isProcessing && extractedData && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-1/4 left-1/4 p-2 glass bg-accent/20 border-accent/50 rounded-lg text-accent text-xs font-bold"
                    >
                      Merchant: {extractedData.merchant}
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute bottom-1/4 right-1/4 p-2 glass bg-success/20 border-success/50 rounded-lg text-success text-xs font-bold"
                    >
                      Amount: ₹{extractedData.amount}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card space-y-6"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-slate-900 font-bold">Verify Details</h4>
              {isDuplicate && (
                <div className="flex items-center gap-2 text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Similar transaction detected</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
                    <IndianRupee className="w-3 h-3" /> Amount
                  </label>
                  <div className={cn("relative", isProcessing && "animate-pulse")}>
                    <input 
                      type="number" 
                      value={extractedData?.amount || ''} 
                      onChange={(e) => setExtractedData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-accent/50"
                      placeholder={isProcessing ? "Extracting..." : "0.00"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Date
                  </label>
                  <input 
                    type="date" 
                    value={extractedData?.date || ''} 
                    onChange={(e) => setExtractedData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-accent/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
                  <Store className="w-3 h-3" /> Merchant
                </label>
                <input 
                  type="text" 
                  value={extractedData?.merchant || ''} 
                  onChange={(e) => setExtractedData(prev => ({ ...prev, merchant: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-accent/50"
                  placeholder="Merchant Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Category
                  </label>
                  <select 
                    value={extractedData?.category || 'Others'} 
                    onChange={(e) => setExtractedData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-accent/50"
                  >
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> Payment
                  </label>
                  <select 
                    value={extractedData?.payment_type || 'UPI'} 
                    onChange={(e) => setExtractedData(prev => ({ ...prev, payment_type: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-accent/50"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tagging</label>
                <div className="flex gap-2">
                  {(['Personal', 'Business'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTag(t)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-bold border transition-all",
                        tag === t 
                          ? "bg-accent/10 border-accent/30 text-accent" 
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={reset}
                className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isProcessing || !extractedData?.amount || !extractedData?.merchant}
                className="flex-1 py-3 rounded-xl font-bold bg-accent text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Save Expense
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
