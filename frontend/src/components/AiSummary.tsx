'use client';

import { useState } from 'react';
import { Sparkles, LoaderCircle } from 'lucide-react';

export default function AiSummary({ content }: { content: string }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');
    const plainTextContent = stripHtml(content);
    const prompt = `Please provide a concise, bulleted list of the key takeaways from the following knowledge base article. Focus on the main points and actionable information. Here is the article content:\n\n---\n\n${plainTextContent}`;

    try {
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      
      // --- THIS IS THE FIX ---
      // Read the API key from the environment variables
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
      }
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to get a response from the AI. Check your API key and permissions.');
      const result = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        const text = result.candidates[0].content.parts[0].text
          .replace(/•/g, '<br>• ')
          .replace(/\*/g, '<br>• ');
        setSummary(text);
      } else {
        // This will catch errors returned by the API, like billing issues.
        const apiError = result.error?.message || 'The AI returned an unexpected response format.';
        throw new Error(apiError);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-border rounded-2xl bg-card p-6 my-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">Key Takeaways</h2>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="inline-flex items-center gap-2 py-2 px-4 border-transparent rounded-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <><LoaderCircle className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate with AI</>
          )}
        </button>
      </div>
      {summary && (
        <div 
          className="prose prose-sm dark:prose-invert max-w-none mt-4 pt-4 border-t border-border"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      )}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}