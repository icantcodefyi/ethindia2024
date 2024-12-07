"use client";

import dynamic from 'next/dynamic';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Dynamic import of SyntaxHighlighter
const DynamicSyntaxHighlighter = dynamic(
  async () => {
    const { Light: SyntaxHighlighter } = await import('react-syntax-highlighter');
    const { vscDarkPlus } = await import('react-syntax-highlighter/dist/esm/styles/prism');
    
    // Import language support
    const { default: ink } = await import('react-syntax-highlighter/dist/esm/languages/prism/rust');
    const { default: move } = await import('react-syntax-highlighter/dist/esm/languages/prism/rust');
    
    // Register languages
    SyntaxHighlighter.registerLanguage('ink', ink);
    SyntaxHighlighter.registerLanguage('move', move);
    
    return function CodeHighlighter({ children, language }: { children: string, language: string }) {
      return (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            background: 'transparent',
          }}
          PreTag="div"
        >
          {children}
        </SyntaxHighlighter>
      );
    };
  },
  {
    ssr: false,
    loading: () => <pre>Loading syntax highlighter...</pre>
  }
);

export default function Home() {
  const [language, setLanguage] = useState<"ink" | "move">("ink");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");

  const generateCode = async () => {
    setResult("");
    setError("");
    setIsStreaming(true);

    try {
      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, prompt, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.slice(6);
            if (content === "[DONE]") {
              setIsStreaming(false);
              break;
            }
            try {
              const data = JSON.parse(content);
              setResult((prev) => prev + data.text);
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while generating code. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blockchain Code Generator</h1>
      <div className="mb-4">
        <Select
          value={language}
          onValueChange={(value: "ink" | "move") => setLanguage(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ink">Ink</SelectItem>
            <SelectItem value="move">Move</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        className="mb-4"
        placeholder="Enter your code generation prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex space-x-2 mb-4">
        <Button onClick={generateCode} disabled={isStreaming}>
          {isStreaming ? "Generating..." : "Generate Code"}
        </Button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Card className="relative">
        <CardContent className="p-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const content = String(children).trim();
                if (content.startsWith('```')) {
                  const match = /language-(\w+)/.exec(className || '');
                  const lang = match ? match[1] : language;
                  const codeContent = content
                    .replace(/^```(\w+)?/, '')
                    .replace(/```$/, '')
                    .trim();
                  
                  return (
                    <div className="relative">
                      <DynamicSyntaxHighlighter language={lang}>
                        {codeContent}
                      </DynamicSyntaxHighlighter>
                    </div>
                  );
                }
                return <span {...props}>{children}</span>;
              },
            }}
          >
            {result || "Generated code will appear here"}
          </ReactMarkdown>
        </CardContent>
        {result && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </Card>
    </div>
  );
}
