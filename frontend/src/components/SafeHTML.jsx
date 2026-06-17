import React from 'react';
import DOMPurify from 'dompurify';

export function SafeHTML({ html, className = '' }) {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });

  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }} 
    />
  );
}
