'use client';

import { useState } from 'react';
import { Copy, Check, Upload, Download, QrCode, X, FileText, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { convertAddress, validateAddress } from './utils/address-converter';

type AddressResult = {
  original: string;
  originalType: string;
  legacy: string;
  cashAddrWithPrefix: string;
  cashAddrNoPrefix: string;
  addressType: string;
  success?: boolean;
  error?: string;
  index?: number;
};

type BatchResult = {
  index: number;
  input: string;
  legacy?: string;
  cashAddrWithPrefix?: string;
  cashAddrNoPrefix?: string;
  addressType?: string;
  success: boolean;
  error?: string;
};

export default function Home() {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AddressResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [batchStats, setBatchStats] = useState({ total: 0, successful: 0, failed: 0 });
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSingleConvert = async () => {
    if (!input.trim()) {
      setError('Please enter a BCH address');
      return;
    }

    setError(null);
    setProcessing(true);
    setResult(null);
    setShowQR(false);

    try {
      const converted = convertAddress(input.trim());
      setResult({
        ...converted,
        success: true
      });
    } catch (err: any) {
      setError(err.message || 'Invalid BCH address format');
      setResult(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setError(null);
    setBatchResults([]);
    setBatchStats({ total: 0, successful: 0, failed: 0 });

    try {
      const text = await file.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      // Handle CSV format (first line might be header)
      const addresses = lines.map(line => {
        // If CSV, take first column
        const firstColumn = line.split(',')[0].trim().replace(/"/g, '');
        return firstColumn;
      }).filter(addr => addr.length > 0);

      if (addresses.length === 0) {
        setError('No valid addresses found in file');
        setProcessing(false);
        return;
      }

      const results: BatchResult[] = [];
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];
        try {
          if (validateAddress(addr)) {
            const converted = convertAddress(addr);
            results.push({
              index: i + 1,
              input: addr,
              legacy: converted.legacy,
              cashAddrWithPrefix: converted.cashAddrWithPrefix,
              cashAddrNoPrefix: converted.cashAddrNoPrefix,
              addressType: converted.addressType,
              success: true
            });
            successCount++;
          } else {
            results.push({
              index: i + 1,
              input: addr,
              success: false,
              error: 'Invalid address format'
            });
            failCount++;
          }
        } catch (err: any) {
          results.push({
            index: i + 1,
            input: addr,
            success: false,
            error: err.message || 'Conversion failed'
          });
          failCount++;
        }
      }

      setBatchResults(results);
      setBatchStats({
        total: addresses.length,
        successful: successCount,
        failed: failCount
      });
    } catch (err: any) {
      setError('Failed to process file: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleBatchDownload = () => {
    if (batchResults.length === 0) return;

    const csvRows = [
      ['Index', 'Input', 'Legacy', 'CashAddr (With Prefix)', 'CashAddr (No Prefix)', 'Type', 'Status', 'Error']
    ];

    batchResults.forEach(result => {
      csvRows.push([
        result.index?.toString() || '',
        result.input,
        result.legacy || '',
        result.cashAddrWithPrefix || '',
        result.cashAddrNoPrefix || '',
        result.addressType || '',
        result.success ? 'Success' : 'Failed',
        result.error || ''
      ]);
    });

    const csvContent = csvRows.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bch-address-conversion-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            Bitcoin Cash Hackathon 2025
          </div>
          <h1 className="text-6xl sm:text-7xl font-extrabold mb-4 tracking-tight">
            <span className="bg-linear-to-r from-emerald-400 via-green-400 to-emerald-300 bg-clip-text text-transparent">
              BCH Address
            </span>
            <br />
            <span className="text-white">Harmony</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-3 font-medium">
            Universal Address Converter
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Seamlessly convert between Legacy and CashAddr formats. Batch processing, QR codes, and developer-friendly API.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl bg-slate-900/50 backdrop-blur-sm p-1.5 border border-slate-800 shadow-2xl">
            <button
              onClick={() => {
                setMode('single');
                setInput('');
                setResult(null);
                setBatchResults([]);
                setError(null);
                setShowQR(false);
              }}
              className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                mode === 'single'
                  ? 'bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className={`inline w-4 h-4 mr-2 ${mode === 'single' ? '' : 'opacity-60'}`} />
              Single
            </button>
            <button
              onClick={() => {
                setMode('batch');
                setInput('');
                setResult(null);
                setBatchResults([]);
                setError(null);
                setShowQR(false);
              }}
              className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                mode === 'batch'
                  ? 'bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className={`inline w-4 h-4 mr-2 ${mode === 'batch' ? '' : 'opacity-60'}`} />
              Batch
            </button>
          </div>
        </div>

        {/* Single Mode */}
        {mode === 'single' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paste any BCH address (Legacy or CashAddr)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSingleConvert()}
                    placeholder="e.g., 1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu or bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleSingleConvert}
                    disabled={processing}
                    className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {processing ? 'Converting...' : 'Convert'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {result && result.success && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">
                        Original Format: {result.originalType}
                      </span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 text-xs font-medium rounded">
                        {result.addressType}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 break-all font-mono">
                      {result.original}
                    </p>
                  </div>

                  {[
                    { label: 'Legacy Format', value: result.legacy, id: 'legacy' },
                    { label: 'CashAddr (with prefix)', value: result.cashAddrWithPrefix, id: 'cashaddr-prefix' },
                    { label: 'CashAddr (no prefix)', value: result.cashAddrNoPrefix, id: 'cashaddr-noprefix' }
                  ].map(({ label, value, id }) => (
                    <div key={id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                        <button
                          onClick={() => handleCopy(value, id)}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                        >
                          {copied === id ? (
                            <>
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 dark:text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-gray-100 break-all font-mono">{value}</p>
                    </div>
                  ))}

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      {showQR ? 'Hide QR Code' : 'Show QR Code'}
                    </button>
                  </div>

                  {showQR && result.cashAddrWithPrefix && (
                    <div className="flex justify-center p-6 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-center">
                        <QRCodeSVG value={result.cashAddrWithPrefix} size={256} level="M" />
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                          Scan with your mobile wallet
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Batch Mode */}
        {mode === 'batch' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload CSV or TXT file with addresses (one per line or CSV format)
                </label>
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors text-center">
                      <Upload className="inline w-5 h-5 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {processing ? 'Processing...' : 'Choose file or drag and drop'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      disabled={processing}
                      className="hidden"
                    />
                  </label>
                  {batchResults.length > 0 && (
                    <button
                      onClick={handleBatchDownload}
                      className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download CSV
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {batchStats.total > 0 && (
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{batchStats.total}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Total</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{batchStats.successful}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Successful</div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{batchStats.failed}</div>
                    <div className="text-sm text-red-700 dark:text-red-300">Failed</div>
                  </div>
                </div>
              )}

              {batchResults.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">#</th>
                        <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">Input</th>
                        <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">Legacy</th>
                        <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">CashAddr</th>
                        <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchResults.slice(0, 100).map((result) => (
                        <tr key={result.index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="p-2 text-gray-600 dark:text-gray-400">{result.index}</td>
                          <td className="p-2 font-mono text-xs break-all text-gray-900 dark:text-gray-100">{result.input}</td>
                          <td className="p-2 font-mono text-xs break-all text-gray-700 dark:text-gray-300">
                            {result.legacy || '-'}
                          </td>
                          <td className="p-2 font-mono text-xs break-all text-gray-700 dark:text-gray-300">
                            {result.cashAddrNoPrefix || '-'}
                          </td>
                          <td className="p-2">
                            {result.success ? (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 text-xs font-medium rounded">
                                Success
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300 text-xs font-medium rounded" title={result.error}>
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {batchResults.length > 100 && (
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Showing first 100 results. Download CSV to see all {batchResults.length} results.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* API Documentation Teaser */}
        <div className="max-w-3xl mx-auto mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">API Access</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Developers can use our REST API for programmatic access to address conversion.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="text-green-600 dark:text-green-400">POST /api/convert</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">{'{'}</div>
              <div className="text-gray-600 dark:text-gray-400 ml-4">"address": "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu"</div>
              <div className="text-gray-600 dark:text-gray-400">{'}'}</div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              Full API documentation available at{' '}
              <a href="/api-docs" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                /api-docs
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>Built for Bitcoin Cash Hackathon 2025 • United Address Format Bounty</p>
        </div>
      </div>
    </div>
  );
}
