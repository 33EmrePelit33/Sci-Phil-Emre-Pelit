import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  formula,
  displayMode = true,
  className = ''
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
    } catch {
      return `<code>${formula}</code>`;
    }
  }, [formula, displayMode]);

  return (
    <div
      className={`overflow-x-auto py-2 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
