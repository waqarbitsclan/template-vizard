export interface VideoTemplate {
  id: string;
  name: string;
  duration: number; // in seconds
  backgroundMedia?: {
    type: 'image' | 'video';
    file: File | null;
    url?: string;
  };
  textElements: TextElement[];
  audioTrack?: {
    file: File | null;
    url?: string;
    volume: number;
  };
  settings: {
    width: number;
    height: number;
    fps: number;
  };
}

export interface TextElement {
  id: string;
  text: string;
  position: {
    x: number;
    y: number;
  };
  style: {
    fontSize: number;
    fontWeight: string;
    color: string;
    fontFamily: string;
    textAlign: 'left' | 'center' | 'right';
    textShadow?: string;
  };
  animation?: {
    type: 'fade-in' | 'slide-in' | 'scale-in' | 'none';
    delay: number;
    duration: number;
  };
  timing: {
    startTime: number; // in seconds
    endTime: number; // in seconds
  };
}

export interface VideoExportSettings {
  format: 'mp4' | 'webm';
  quality: 'low' | 'medium' | 'high';
  fps: number;
}