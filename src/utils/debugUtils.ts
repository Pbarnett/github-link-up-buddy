import * as React from 'react';
// Debug utilities for tracking React render cycles and performance issues

interface RenderCount {
  [componentName: string]: number;
}

const renderCounts: RenderCount = {};

export const trackComponentRender = (componentName: string) => {
  if (import.meta.env.DEV) {
    renderCounts[componentName] = (renderCounts[componentName] || 0) + 1;
    const count = renderCounts[componentName];

    // Log excessive renders but stop spamming after 15 renders
    if (count > 10 && count <= 15) {
      console.warn(
        `🔄 ${componentName} has rendered ${count} times - potential infinite loop!`
      );
    } else if (count === 16) {
      console.warn(
        `🚫 ${componentName} render tracking stopped at 16 renders to prevent console spam`
      );
    }

    // Log every 5th render for monitoring (but stop after 15)
    if (count % 5 === 0 && count <= 15) {
      console.log(`📊 ${componentName}: ${count} renders`);
    }
  }
};

export const getRenderCounts = () => ({ ...renderCounts });

export const resetRenderCounts = () => {
  Object.keys(renderCounts).forEach(key => {
    delete renderCounts[key];
  });
};

// Performance monitoring
export const measureAsyncOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 1000) {
      console.warn(
        `⚠️ Slow operation: ${operationName} took ${duration.toFixed(2)}ms`
      );
    } else if (import.meta.env.DEV) {
      console.log(`⚡ ${operationName}: ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.error(
      `❌ Failed operation: ${operationName} failed after ${duration.toFixed(2)}ms`,
      error
    );
    throw error;
  }
};

// Hook dependency analysis
export const analyzeHookDependencies = (
  hookName: string,
  dependencies: any[]
) => {
  if (import.meta.env.DEV) {
    const depString = dependencies
      .map(dep => {
        if (typeof dep === 'function') return '[Function]';
        if (typeof dep === 'object' && dep !== null) return '[Object]';
        return String(dep);
      })
      .join(', ');

    console.log(`🔍 ${hookName} dependencies: [${depString}]`);
  }
};
