import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const parseInline = (text: string) => {
    const parts = text.split(/(\**.*?\**)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const key = `line-${index}`;

    // Handle Lists
    if (line.trim().startsWith('- ')) {
      listItems.push(
        <li key={key} className="ml-4 list-disc text-muted-foreground">
          {parseInline(line.trim().substring(2))}
        </li>
      );
      return;
    }

    // Flush list if we encounter non-list item
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${index}`} className="mb-4 pl-5 space-y-1">{listItems}</ul>);
      listItems = [];
    }

    if (line.trim() === '') {
      return; // Skip empty lines, but maybe add spacing? 
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key} className="text-3xl font-bold mt-8 mb-4">{parseInline(line.substring(2))}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key} className="text-2xl font-semibold mt-6 mb-3 text-primary">{parseInline(line.substring(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key} className="text-xl font-medium mt-4 mb-2">{parseInline(line.substring(4))}</h3>);
    } else {
      // Paragraph
      elements.push(<p key={key} className="mb-4 leading-relaxed text-muted-foreground">{parseInline(line)}</p>);
    }
  });

  // Flush remaining list
  if (listItems.length > 0) {
    elements.push(<ul key={`ul-end`} className="mb-4 pl-5 space-y-1">{listItems}</ul>);
  }

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      {elements}
    </div>
  );
}
