import React from 'react';

// This is a simple renderer and does not cover all markdown cases.
// For a full-featured solution, a library like react-markdown is recommended.
export function MarkdownRenderer({ content }: { content: string }) {
  const renderSegment = (segment: string, index: number) => {
    // Handle bold and italic
    const html = segment
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Split by newlines to handle paragraphs and lists
  const lines = content.split('\n');

  // Group list items
  const elements = [];
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      listItems.push(line.trim().substring(2));
    } else {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${i}`} className="list-disc pl-5 space-y-1 my-2">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{renderSegment(item, itemIndex)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
      if (line.trim() !== '') {
        // Split by code blocks
        const segments = line.split(/(`.*?`)/g);
        elements.push(
          <p key={i} className="my-2">
            {segments.map((segment, index) => {
              if (segment.startsWith('`') && segment.endsWith('`')) {
                return (
                  <code key={index} className="bg-muted text-muted-foreground px-1 py-0.5 rounded-sm font-code text-sm">
                    {segment.slice(1, -1)}
                  </code>
                );
              }
              return renderSegment(segment, index);
            })}
          </p>
        );
      }
    }
  }

  // Add any remaining list items
  if (listItems.length > 0) {
    elements.push(
      <ul key="list-end" className="list-disc pl-5 space-y-1 my-2">
        {listItems.map((item, itemIndex) => (
          <li key={itemIndex}>{renderSegment(item, itemIndex)}</li>
        ))}
      </ul>
    );
  }

  return <div className="text-sm">{elements}</div>;
}
