import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VideoTemplate, VideoExportSettings } from '@/types/video-template';
import { Download, Video } from 'lucide-react';
import { toast } from 'sonner';

interface VideoExporterProps {
  template: VideoTemplate;
}

export const VideoExporter: React.FC<VideoExporterProps> = ({ template }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const exportSettings: VideoExportSettings = {
    format: 'mp4',
    quality: 'high',
    fps: template.settings.fps,
  };

  const drawFrameAtTime = (ctx: CanvasRenderingContext2D, time: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw background
    if (template.backgroundMedia?.file) {
      // For demo purposes, we'll draw a gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
      // Default gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Draw text elements
    template.textElements.forEach(element => {
      if (time >= element.timing.startTime && time <= element.timing.endTime) {
        // Calculate animation progress
        const animationProgress = Math.min(
          (time - element.timing.startTime) / (element.animation?.duration || 1),
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

  const exportVideo = async () => {
    if (!canvasRef.current) {
      toast.error('Canvas not ready');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    chunksRef.current = [];

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      // Set canvas size
      canvas.width = template.settings.width;
      canvas.height = template.settings.height;

      // Get canvas stream
      const stream = canvas.captureStream(template.settings.fps);
      
      // Add audio track if available
      if (template.audioTrack?.file) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(template.audioTrack.file);
        audio.volume = template.audioTrack.volume;
        
        // Note: In a real implementation, you would need to properly sync audio
        // This is a simplified version for demonstration
      }

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: exportSettings.quality === 'high' ? 5000000 : 
                           exportSettings.quality === 'medium' ? 2500000 : 1000000,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name.replace(/\s+/g, '_')}_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        toast.success('Video exported successfully!');
        setIsExporting(false);
        setExportProgress(0);
      };

      // Start recording
      mediaRecorder.start(100); // Capture every 100ms

      // Animate through the video timeline
      const fps = template.settings.fps;
      const totalFrames = template.duration * fps;
      let currentFrame = 0;

      const animateFrame = () => {
        const currentTime = currentFrame / fps;
        
        if (currentTime >= template.duration) {
          mediaRecorder.stop();
          return;
        }

        drawFrameAtTime(ctx, currentTime);
        
        currentFrame++;
        setExportProgress((currentFrame / totalFrames) * 100);
        
        // Use setTimeout to control frame rate
        setTimeout(animateFrame, 1000 / fps);
      };

      animateFrame();

    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export video');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Export Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Export your video template as a downloadable file.
        </div>

        {isExporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exporting...</span>
              <span>{Math.round(exportProgress)}%</span>
            </div>
            <Progress value={exportProgress} className="w-full" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div>Format: WebM</div>
          <div>Quality: {exportSettings.quality}</div>
          <div>Duration: {template.duration}s</div>
        </div>

        <Button
          onClick={exportVideo}
          disabled={isExporting}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Video'}
        </Button>

        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
          width={template.settings.width}
          height={template.settings.height}
        />
      </CardContent>
    </Card>
  );
};