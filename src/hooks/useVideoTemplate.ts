import { useState, useCallback } from 'react';
import { VideoTemplate, TextElement } from '@/types/video-template';

export const useVideoTemplate = () => {
  const [template, setTemplate] = useState<VideoTemplate>({
    id: 'template-1',
    name: 'Quote Video Template',
    duration: 10,
    backgroundMedia: {
      type: 'image',
      file: null,
    },
    textElements: [
      {
        id: 'quote-text',
        text: 'Your inspirational quote here',
        position: { x: 50, y: 50 },
        style: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        },
        animation: {
          type: 'fade-in',
          delay: 1,
          duration: 1,
        },
        timing: {
          startTime: 1,
          endTime: 9,
        },
      },
    ],
    audioTrack: {
      file: null,
      volume: 0.7,
    },
    settings: {
      width: 1080,
      height: 1920,
      fps: 30,
    },
  });

  const updateTemplate = useCallback((updates: Partial<VideoTemplate>) => {
    setTemplate(prev => ({ ...prev, ...updates }));
  }, []);

  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setTemplate(prev => ({
      ...prev,
      textElements: prev.textElements.map(element =>
        element.id === id ? { ...element, ...updates } : element
      ),
    }));
  }, []);

  const addTextElement = useCallback((element: TextElement) => {
    setTemplate(prev => ({
      ...prev,
      textElements: [...prev.textElements, element],
    }));
  }, []);

  const removeTextElement = useCallback((id: string) => {
    setTemplate(prev => ({
      ...prev,
      textElements: prev.textElements.filter(element => element.id !== id),
    }));
  }, []);

  return {
    template,
    updateTemplate,
    updateTextElement,
    addTextElement,
    removeTextElement,
  };
};