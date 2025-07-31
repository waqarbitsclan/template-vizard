import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TextElement } from '@/types/video-template';
import { Type, Plus, Trash2 } from 'lucide-react';

interface TextEditorProps {
  textElements: TextElement[];
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onAddTextElement: (element: TextElement) => void;
  onRemoveTextElement: (id: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  textElements,
  onUpdateTextElement,
  onAddTextElement,
  onRemoveTextElement,
}) => {
  const createNewTextElement = (): TextElement => ({
    id: `text-${Date.now()}`,
    text: 'New text element',
    position: { x: 50, y: 50 },
    style: {
      fontSize: 24,
      fontWeight: 'normal',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    },
    animation: {
      type: 'fade-in',
      delay: 0,
      duration: 1,
    },
    timing: {
      startTime: 0,
      endTime: 10,
    },
  });

  const handleAddText = () => {
    onAddTextElement(createNewTextElement());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Type className="h-5 w-5" />
          Text Elements
        </h3>
        <Button onClick={handleAddText} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Text
        </Button>
      </div>

      {textElements.map((element) => (
        <Card key={element.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Text Element</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveTextElement(element.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`text-${element.id}`}>Text Content</Label>
              <Textarea
                id={`text-${element.id}`}
                value={element.text}
                onChange={(e) =>
                  onUpdateTextElement(element.id, { text: e.target.value })
                }
                placeholder="Enter your text..."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Font Size</Label>
                <Slider
                  value={[element.style.fontSize]}
                  onValueChange={([value]) =>
                    onUpdateTextElement(element.id, {
                      style: { ...element.style, fontSize: value },
                    })
                  }
                  min={12}
                  max={72}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {element.style.fontSize}px
                </span>
              </div>

              <div>
                <Label htmlFor={`color-${element.id}`}>Text Color</Label>
                <Input
                  id={`color-${element.id}`}
                  type="color"
                  value={element.style.color}
                  onChange={(e) =>
                    onUpdateTextElement(element.id, {
                      style: { ...element.style, color: e.target.value },
                    })
                  }
                  className="mt-1 h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Font Weight</Label>
                <Select
                  value={element.style.fontWeight}
                  onValueChange={(value) =>
                    onUpdateTextElement(element.id, {
                      style: { ...element.style, fontWeight: value },
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="lighter">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Text Align</Label>
                <Select
                  value={element.style.textAlign}
                  onValueChange={(value: 'left' | 'center' | 'right') =>
                    onUpdateTextElement(element.id, {
                      style: { ...element.style, textAlign: value },
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>X Position (%)</Label>
                <Slider
                  value={[element.position.x]}
                  onValueChange={([value]) =>
                    onUpdateTextElement(element.id, {
                      position: { ...element.position, x: value },
                    })
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {element.position.x}%
                </span>
              </div>

              <div>
                <Label>Y Position (%)</Label>
                <Slider
                  value={[element.position.y]}
                  onValueChange={([value]) =>
                    onUpdateTextElement(element.id, {
                      position: { ...element.position, y: value },
                    })
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {element.position.y}%
                </span>
              </div>
            </div>

            <div>
              <Label>Animation</Label>
              <Select
                value={element.animation?.type || 'none'}
                onValueChange={(value: 'fade-in' | 'slide-in' | 'scale-in' | 'none') =>
                  onUpdateTextElement(element.id, {
                    animation: value === 'none' ? undefined : {
                      ...element.animation,
                      type: value,
                    },
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade-in">Fade In</SelectItem>
                  <SelectItem value="slide-in">Slide In</SelectItem>
                  <SelectItem value="scale-in">Scale In</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time (s)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={element.timing.startTime}
                  onChange={(e) =>
                    onUpdateTextElement(element.id, {
                      timing: {
                        ...element.timing,
                        startTime: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label>End Time (s)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={element.timing.endTime}
                  onChange={(e) =>
                    onUpdateTextElement(element.id, {
                      timing: {
                        ...element.timing,
                        endTime: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};