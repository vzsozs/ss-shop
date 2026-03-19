"use client";

import React from 'react';

interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  [key: string]: unknown;
}

const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_UNDERLINE = 8;
const IS_STRIKETHROUGH = 4;
const IS_CODE = 16;

export const RichText: React.FC<{ content: unknown; className?: string }> = ({ content, className }) => {
  if (!content) return null;

  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    if (!node) return null;

    // Handle Text Nodes
    if (typeof node.text === 'string') {
      let element: React.ReactNode = node.text;
      
      const format = node.format || 0;
      if (format & IS_BOLD) element = <strong key="bold">{element}</strong>;
      if (format & IS_ITALIC) element = <em key="italic">{element}</em>;
      if (format & IS_UNDERLINE) element = <u key="underline">{element}</u>;
      if (format & IS_STRIKETHROUGH) element = <span key="strike" className="line-through">{element}</span>;
      if (format & IS_CODE) element = <code key="code">{element}</code>;
      
      return <React.Fragment key={index}>{element}</React.Fragment>;
    }

    // Handle Children
    const children = node.children?.map((child, i) => renderNode(child, i)) || null;

    // Handle Block Nodes
    switch (node.type) {
      case 'root':
        return <div key={index} className={className}>{children}</div>;
      case 'paragraph':
        return <p key={index} className="mb-2 last:mb-0">{children}</p>;
      case 'link':
        const fields = node.fields as Record<string, any> | undefined;
        return (
          <a 
            key={index} 
            href={fields?.url} 
            target={fields?.newTab ? '_blank' : undefined} 
            rel={fields?.newTab ? 'noopener noreferrer' : undefined} 
            className="text-brand-brown underline decoration-brand-brown/30 hover:decoration-brand-brown transition-all"
          >
            {children}
          </a>
        );
      case 'list':
        const Tag = node.tag === 'ol' ? 'ol' : 'ul';
        return <Tag key={index} className="list-inside list-disc my-2">{children}</Tag>;
      case 'listitem':
        return <li key={index}>{children}</li>;
      default:
        return <span key={index}>{children}</span>;
    }
  };

  const data = content as any;
  const root = data?.root || data;
  
  if (!root) return null;
  
  return <div className={className}>{renderNode(root, 0)}</div>;
};
