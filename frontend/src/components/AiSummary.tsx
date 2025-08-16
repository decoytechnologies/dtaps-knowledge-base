'use client';

import { useState } from 'react';
import { Sparkles, LoaderCircle, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

// Define the shape of the structured data we expect from the AI
interface Takeaway {
  text: string;
  category: 'feature' | 'pro' | 'con' | 'warning';
}

// A component to map a category to a specific icon
const TakeawayIcon = ({ category }: { category: Takeaway['category'] }) => {
  switch (category) {
    case 'pro':
      return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
    case 'con':
      return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
    case 'feature':
    default:
      return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
  }
};

export default function AiSummary({ content }: { content: string }) {
  const [summary, setSummary] = useState<Takeaway[]>([]); // State now holds an array of Takeaway objects
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary([]);
    const plainTextContent = stripHtml(content);
    
    // --- NEW: A prompt that asks for a structured JSON response ---
    const prompt = `Analyze the following article and generate a JSON array of key takeaways. Each object in the array should have two keys: "text" (a string for the takeaway) and "category" (a string that is one of the following: "feature", "pro", "con", or "warning"). Output only the raw JSON array. Article:\n\n---\n\n${plainTextContent}`;

    try {
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      
      // --- NEW: Define the expected JSON schema for the AI response ---
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                "text": { "type": "STRING" },
                "category": { "type": "STRING" }
              },
              required: ["text", "category"]
            }
          }
        }
      };
      
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
        // Parse the JSON string from the AI into an array of objects
        const parsedSummary = JSON.parse(result.candidates[0].content.parts[0].text);
        setSummary(parsedSummary);
      } else {
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
      
      {summary.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          {summary.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <TakeawayIcon category={item.category} />
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
