import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoPreview } from '@/components/VideoEditor/VideoPreview';
import { MediaUpload } from '@/components/VideoEditor/MediaUpload';
import { TextEditor } from '@/components/VideoEditor/TextEditor';
import { VideoExporter } from '@/components/VideoEditor/VideoExporter';
import { useVideoTemplate } from '@/hooks/useVideoTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Settings } from 'lucide-react';

const Index = () => {
  const {
    template,
    updateTemplate,
    updateTextElement,
    addTextElement,
    removeTextElement,
  } = useVideoTemplate();
  
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Video className="h-8 w-8" />
            Video Template System
          </h1>
          <p className="text-xl text-muted-foreground">
            Create stunning quote videos with custom templates
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview Panel */}
          <div className="space-y-6">
            <VideoPreview
              template={template}
              isPlaying={isPlaying}
              onPlayStateChange={setIsPlaying}
            />
            
            <VideoExporter template={template} />
          </div>

          {/* Editor Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="media" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="media" className="space-y-4">
                <MediaUpload
                  template={template}
                  onUpdateTemplate={updateTemplate}
                />
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <TextEditor
                  textElements={template.textElements}
                  onUpdateTextElement={updateTextElement}
                  onAddTextElement={addTextElement}
                  onRemoveTextElement={removeTextElement}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Video Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        value={template.name}
                        onChange={(e) => updateTemplate({ name: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration (seconds)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="60"
                        value={template.duration}
                        onChange={(e) =>
                          updateTemplate({ duration: parseInt(e.target.value) || 10 })
                        }
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          value={template.settings.width}
                          onChange={(e) =>
                            updateTemplate({
                              settings: {
                                ...template.settings,
                                width: parseInt(e.target.value) || 1080,
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          value={template.settings.height}
                          onChange={(e) =>
                            updateTemplate({
                              settings: {
                                ...template.settings,
                                height: parseInt(e.target.value) || 1920,
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fps">Frame Rate (FPS)</Label>
                      <Input
                        id="fps"
                        type="number"
                        min="15"
                        max="60"
                        value={template.settings.fps}
                        onChange={(e) =>
                          updateTemplate({
                            settings: {
                              ...template.settings,
                              fps: parseInt(e.target.value) || 30,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>

                    {template.audioTrack?.file && (
                      <div>
                        <Label htmlFor="volume">Audio Volume</Label>
                        <Input
                          id="volume"
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={template.audioTrack.volume}
                          onChange={(e) =>
                            updateTemplate({
                              audioTrack: {
                                ...template.audioTrack,
                                volume: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="mt-1"
                        />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(template.audioTrack.volume * 100)}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;