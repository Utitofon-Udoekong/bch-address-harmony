'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle, Terminal, Code, Zap, Shield, Globe, ArrowLeft } from 'lucide-react';

export default function APIDocumentation() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const CodeBlock = ({ code, language = 'bash', label }: { code: string; language?: string; label: string }) => (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => copyToClipboard(code, label)}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copied === label ? (
            <CheckCircle size={18} className="text-green-400" />
          ) : (
            <Copy size={18} className="text-gray-300" />
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
        <code>{code}</code>
      </pre>
    </div>
  );

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
              API
            </span>
            <br />
            <span className="text-white">Documentation</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-3 font-medium">
            Developer-Friendly REST API
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Integrate BCH address conversion into your application with our fast, reliable, and free RESTful API
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <Zap className="mx-auto mb-2 text-yellow-500" size={32} />
            <div className="text-3xl font-bold text-gray-800 dark:text-white">&lt;100ms</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <Shield className="mx-auto mb-2 text-green-500" size={32} />
            <div className="text-3xl font-bold text-gray-800 dark:text-white">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <Globe className="mx-auto mb-2 text-blue-500" size={32} />
            <div className="text-3xl font-bold text-gray-800 dark:text-white">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Format Types</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <Code className="mx-auto mb-2 text-purple-500" size={32} />
            <div className="text-3xl font-bold text-gray-800 dark:text-white">Free</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Open Source</div>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Base URL</h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <code className="text-lg text-green-600 dark:text-green-400 font-mono">
              {typeof window !== 'undefined' ? window.location.origin : 'https://bch-address-harmony.vercel.app'}
            </code>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Replace with your deployed domain. All endpoints are relative to this base URL.
          </p>
        </div>

        {/* Authentication */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-3">🔓 Authentication</h2>
          <p className="text-blue-700 dark:text-blue-300">
            <strong>No authentication required!</strong> Our API is completely open and free to use. 
            Rate limiting may apply for excessive usage.
          </p>
        </div>

        {/* Endpoint 1: Convert Single Address */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded font-bold text-sm">POST</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">/api/convert</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Convert a single BCH address between Legacy and CashAddr formats.
          </p>

          {/* Request */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Request</h3>
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Body Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Parameter</th>
                    <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Type</th>
                    <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Required</th>
                    <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">address</code></td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">string</td>
                    <td className="px-4 py-3"><span className="text-red-600 dark:text-red-400 font-semibold">Yes</span></td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">BCH address in any format (Legacy or CashAddr)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Example Request - cURL */}
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Example Request (cURL)</h4>
          <CodeBlock
            label="curl-convert"
            code={`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://bch-address-harmony.vercel.app'}/api/convert \\
  -H "Content-Type: application/json" \\
  -d '{"address": "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu"}'`}
          />

          {/* Example Request - JavaScript */}
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-6">Example Request (JavaScript)</h4>
          <CodeBlock
            label="js-convert"
            language="javascript"
            code={`const response = await fetch('/api/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    address: '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu'
  })
});
const data = await response.json();
console.log(data);`}
          />

          {/* Response */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-8">Response</h3>
          <CodeBlock
            label="response-convert"
            language="json"
            code={`{
  "original": "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu",
  "originalType": "Legacy Format",
  "legacy": "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu",
  "cashAddrWithPrefix": "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
  "cashAddrNoPrefix": "qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
  "addressType": "P2PKH",
  "success": true
}`}
          />

          {/* Error Response */}
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-6">Error Response</h4>
          <CodeBlock
            label="error-convert"
            language="json"
            code={`{
  "success": false,
  "error": "Invalid BCH address format"
}`}
          />
        </div>

        {/* Endpoint 2: Batch Convert */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded font-bold text-sm">POST</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">/api/batch</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Convert multiple BCH addresses in a single request (up to 10,000 addresses).
          </p>

          {/* Request */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Request</h3>
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Body Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Parameter</th>
                    <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Type</th>
                    <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Required</th>
                    <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">addresses</code></td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">string[]</td>
                    <td className="px-4 py-3"><span className="text-red-600 dark:text-red-400 font-semibold">Yes</span></td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Array of BCH addresses (max 10,000)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Example Request */}
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Example Request (cURL)</h4>
          <CodeBlock
            label="curl-batch"
            code={`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://bch-address-harmony.vercel.app'}/api/batch \\
  -H "Content-Type: application/json" \\
  -d '{
    "addresses": [
      "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu",
      "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
      "3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy"
    ]
  }'`}
          />

          {/* Example Request - JavaScript */}
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-6">Example Request (JavaScript)</h4>
          <CodeBlock
            label="js-batch"
            language="javascript"
            code={`const addresses = [
  '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
  'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
  '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy'
];

const response = await fetch('/api/batch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ addresses })
});

const data = await response.json();
console.log(\`Converted \${data.successful}/\${data.total} addresses\`);`}
          />

          {/* Response */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-8">Response</h3>
          <CodeBlock
            label="response-batch"
            language="json"
            code={`{
  "total": 3,
  "successful": 3,
  "failed": 0,
  "results": [
    {
      "index": 1,
      "input": "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu",
      "legacy": "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu",
      "cashAddrWithPrefix": "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
      "cashAddrNoPrefix": "qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
      "addressType": "P2PKH",
      "success": true
    }
  ]
}`}
          />
        </div>

        {/* Response Fields Reference */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Response Fields Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Field</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Type</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-900 dark:text-gray-100">legacy</code></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Legacy format address (1xxx or 3xxx)</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-900 dark:text-gray-100">cashAddrWithPrefix</code></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">CashAddr with bitcoincash: prefix (recommended)</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-900 dark:text-gray-100">cashAddrNoPrefix</code></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">CashAddr without prefix</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-900 dark:text-gray-100">addressType</code></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Either "P2PKH" or "P2SH"</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-900 dark:text-gray-100">original</code></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Original input address</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-900 dark:text-gray-100">originalType</code></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">string</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">"Legacy Format" or "CashAddr Format"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Codes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">HTTP Status Codes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Code</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded font-bold">200</span></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Success - Address converted successfully</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded font-bold">400</span></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Bad Request - Invalid address format or missing parameters</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded font-bold">429</span></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Too Many Requests - Rate limit exceeded</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded font-bold">413</span></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Payload Too Large - Request body exceeds size limit</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3"><span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded font-bold">500</span></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Internal Server Error - Something went wrong on our end</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 mb-3">⚡ Rate Limits & Security</h2>
          <ul className="text-yellow-700 dark:text-yellow-300 space-y-2">
            <li>• <strong>Single Convert:</strong> 100 requests per minute per IP address</li>
            <li>• <strong>Batch Convert:</strong> 20 requests per minute per IP address</li>
            <li>• <strong>Request Size:</strong> Max 1MB for single, 10MB for batch</li>
            <li>• <strong>Batch Size:</strong> Max 10,000 addresses per request</li>
            <li>• <strong>Rate Limit Headers:</strong> Check X-RateLimit-* headers in responses</li>
            <li>• <strong>429 Status:</strong> Rate limit exceeded - includes Retry-After header</li>
          </ul>
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Rate limits are enforced per IP address. For higher limits, consider using the web interface or implementing client-side caching.
            </p>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Language-Specific Examples</h2>
          
          {/* Python */}
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-6">Python</h3>
          <CodeBlock
            label="python-example"
            language="python"
            code={`import requests

url = "${typeof window !== 'undefined' ? window.location.origin : 'https://bch-address-harmony.vercel.app'}/api/convert"
payload = {"address": "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu"}
response = requests.post(url, json=payload)
data = response.json()

if data.get("success"):
    print(f"Legacy: {data['legacy']}")
    print(f"CashAddr: {data['cashAddrWithPrefix']}")
else:
    print(f"Error: {data.get('error')}")`}
          />

          {/* Node.js */}
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-6">Node.js</h3>
          <CodeBlock
            label="nodejs-example"
            language="javascript"
            code={`const axios = require('axios');

const convertAddress = async (address) => {
  try {
    const response = await axios.post(
      '${typeof window !== 'undefined' ? window.location.origin : 'https://bch-address-harmony.vercel.app'}/api/convert',
      { address }
    );
    
    return response.data;
  } catch (error) {
    console.error('Conversion failed:', error.response?.data?.error);
    throw error;
  }
};

// Usage
convertAddress('1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu')
  .then(result => console.log(result))
  .catch(err => console.error(err));`}
          />

          {/* PHP */}
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-6">PHP</h3>
          <CodeBlock
            label="php-example"
            language="php"
            code={`<?php
$url = '${typeof window !== 'undefined' ? window.location.origin : 'https://bch-address-harmony.vercel.app'}/api/convert';
$data = array('address' => '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu');
$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\\r\\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

if ($response['success']) {
    echo "Legacy: " . $response['legacy'] . "\\n";
    echo "CashAddr: " . $response['cashAddrWithPrefix'] . "\\n";
}
?>`}
          />
        </div>

        {/* Use Cases */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">💡 Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">🏦 Wallet Applications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Convert addresses for compatibility with different wallet formats</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">📊 Block Explorers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Display addresses in multiple formats for user convenience</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">💱 Exchange Platforms</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Validate and normalize deposit addresses from users</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">🛠️ Developer Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Integrate address conversion into BCH development workflows</p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🤝 Support & Feedback</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>🐛 <strong>Report Issues:</strong> Open an issue on GitHub</p>
            <p>💬 <strong>Community:</strong> Join BCH Telegram channel</p>
            <p>📧 <strong>Contact:</strong> Built for BCH Blaze 2025 Hackathon</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Converter
          </a>
        </div>
      </div>
    </div>
  );
}
