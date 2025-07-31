import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VideoTemplate } from '@/types/video-template';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface VideoPreviewProps {
  template: VideoTemplate;
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  template,
  isPlaying,
  onPlayStateChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameRef = useRef<number>();
  const [currentTime, setCurrentTime] = useState(0);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');

  useEffect(() => {
    if (template.backgroundMedia?.file) {
      const url = URL.createObjectURL(template.backgroundMedia.file);
      setBackgroundImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [template.backgroundMedia?.file]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (backgroundImageUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawTextElements(ctx);
      };
      img.src = backgroundImageUrl;
    } else {
      // Default gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawTextElements(ctx);
    }
  }, [backgroundImageUrl, currentTime, template.textElements]);

  const drawTextElements = (ctx: CanvasRenderingContext2D) => {
    template.textElements.forEach(element => {
      if (currentTime >= element.timing.startTime && currentTime <= element.timing.endTime) {
        // Calculate animation progress
        const animationProgress = Math.min(
          (currentTime - element.timing.startTime) / (element.animation?.duration || 1),
          1
        );

        // Apply animation
        let opacity = 1;
        let scale = 1;
        let translateY = 0;

        if (element.animation) {
          switch (element.animation.type) {
            case 'fade-in':
              opacity = animationProgress;
              break;
            case 'scale-in':
              scale = 0.5 + (animationProgress * 0.5);
              opacity = animationProgress;
              break;
            case 'slide-in':
              translateY = (1 - animationProgress) * 50;
              opacity = animationProgress;
              break;
          }
        }

        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Position calculation
        const x = (element.position.x / 100) * ctx.canvas.width;
        const y = (element.position.y / 100) * ctx.canvas.height + translateY;

        // Text styling
        ctx.font = `${element.style.fontWeight} ${element.style.fontSize * scale}px ${element.style.fontFamily}`;
        ctx.fillStyle = element.style.color;
        ctx.textAlign = element.style.textAlign as CanvasTextAlign;
        ctx.textBaseline = 'middle';

        // Text shadow
        if (element.style.textShadow) {
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        // Handle multi-line text
        const lines = element.text.split('\n');
        const lineHeight = element.style.fontSize * scale * 1.2;
        
        lines.forEach((line, index) => {
          const lineY = y + (index - (lines.length - 1) / 2) * lineHeight;
          ctx.fillText(line, x, lineY);
        });

        ctx.restore();
      }
    });
  };

  useEffect(() => {
    drawFrame();
  }, [drawFrame]);

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - (currentTime * 1000);
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        
        if (elapsed >= template.duration) {
          setCurrentTime(template.duration);
          onPlayStateChange(false);
          return;
        }
        
        setCurrentTime(elapsed);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, template.duration, onPlayStateChange]);

  const handlePlayPause = () => {
    onPlayStateChange(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    onPlayStateChange(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          width={template.settings.width}
          height={template.settings.height}
          className="w-full h-full object-contain"
        />
      </div>
      
      {template.audioTrack?.file && (
        <audio
          ref={audioRef}
          src={template.audioTrack.file ? URL.createObjectURL(template.audioTrack.file) : undefined}
          onLoadedData={() => {
            if (audioRef.current) {
              audioRef.current.volume = template.audioTrack?.volume || 0.7;
            }
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(template.duration)}
        </div>
      </div>
      
      <div className="mt-2 bg-secondary h-1 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-100"
          style={{ width: `${(currentTime / template.duration) * 100}%` }}
        />
      </div>
    </div>
  );
};