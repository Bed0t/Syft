import { useState } from 'react';
import { Download } from 'lucide-react';
import { ROIMetrics, CalculatorInputs } from '../../types/roi';
import { generatePDFContent } from './PDFReport';
import jsPDF from 'jspdf';

interface LeadCaptureDialogProps {
  metrics: ROIMetrics;
  inputs: CalculatorInputs;
  onCaptureLead: (email: string) => void;
}

export function LeadCaptureDialog({ metrics, inputs, onCaptureLead }: LeadCaptureDialogProps) {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const pdf = new jsPDF('p', 'px', 'a4');
      const content = generatePDFContent({ metrics, inputs });
      
      // Add content to PDF
      pdf.html(content, {
        callback: function (pdf) {
          pdf.save('syft-roi-analysis.pdf');
          onCaptureLead(email);
          setIsOpen(false);
        },
        x: 0,
        y: 0,
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        Download Full Report
      </button>

      {/* Download Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Download Your ROI Report
            </h3>
            <p className="text-gray-600 mb-6">
              See how much you could save with Syft. We'll send a detailed ROI analysis to your email.
            </p>

            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-indigo-900">Potential Annual Savings</div>
              <div className="text-2xl font-bold text-indigo-700">
                ${metrics.savings.toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    'Download Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 