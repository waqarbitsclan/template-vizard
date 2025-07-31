import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Image, Music } from 'lucide-react';
import { VideoTemplate } from '@/types/video-template';
import { toast } from 'sonner';

interface MediaUploadProps {
  template: VideoTemplate;
  onUpdateTemplate: (updates: Partial<VideoTemplate>) => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  template,
  onUpdateTemplate,
}) => {
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please upload an image or video file');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    const type = file.type.startsWith('image/') ? 'image' : 'video';
    
    onUpdateTemplate({
      backgroundMedia: {
        type,
        file,
      },
    });
    
    toast.success(`${type === 'image' ? 'Image' : 'Video'} uploaded successfully`);
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Audio file size must be less than 20MB');
      return;
    }

    onUpdateTemplate({
      audioTrack: {
        ...template.audioTrack,
        file,
      },
    });
    
    toast.success('Audio uploaded successfully');
  };

  const removeBackground = () => {
    onUpdateTemplate({
      backgroundMedia: {
        type: 'image',
        file: null,
      },
    });
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = '';
    }
  };

  const removeAudio = () => {
    onUpdateTemplate({
      audioTrack: {
        ...template.audioTrack,
        file: null,
      },
    });
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Background Media
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="background-upload">Upload Image or Video</Label>
            <input
              ref={backgroundInputRef}
              id="background-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
            <Button
              onClick={() => backgroundInputRef.current?.click()}
              variant="outline"
              className="w-full mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Background
            </Button>
          </div>
          
          {template.backgroundMedia?.file && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="text-sm truncate">
                  {template.backgroundMedia.file.name}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={removeBackground}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Background Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="audio-upload">Upload Audio Track</Label>
            <input
              ref={audioInputRef}
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
            <Button
              onClick={() => audioInputRef.current?.click()}
              variant="outline"
              className="w-full mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Audio
            </Button>
          </div>
          
          {template.audioTrack?.file && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span className="text-sm truncate">
                  {template.audioTrack.file.name}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={removeAudio}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};