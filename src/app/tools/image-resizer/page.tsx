"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function ImageResizerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  const [targetSize, setTargetSize] = useState<number>(100);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPreview(reader.result as string);
        setResizedPreview(null);
      };
      reader.readAsDataURL(file);
    } else {
      toast({ title: "Invalid file type", description: "Please select an image file.", variant: "destructive" });
    }
  };

  const handleResize = async () => {
    if (!originalFile || !targetSize) {
      toast({ title: "Missing inputs", description: "Please select an image and set a target size.", variant: "destructive" });
      return;
    }
    setIsResizing(true);
    const img = new window.Image();
    img.src = originalPreview!;
    await new Promise(resolve => { img.onload = resolve; });
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);

    let quality = 0.92;
    let minQ = 0.1, maxQ = 0.92;
    let result = '';
    let bestDiff = Infinity;
    let bestData = '';
    for (let i = 0; i < 10; i++) {
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      // Calculate size in KB
      const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
      const diff = Math.abs(sizeKB - targetSize);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestData = dataUrl;
      }
      if (sizeKB > targetSize) {
        maxQ = quality;
        quality = (quality + minQ) / 2;
      } else if (sizeKB < targetSize) {
        minQ = quality;
        quality = (quality + maxQ) / 2;
      } else {
        result = dataUrl;
        break;
      }
    }
    setResizedPreview(result || bestData);
    setIsResizing(false);
    toast({ title: "Image Resized!", description: `Your image is ready for download.` });
  };
  
  const handleDownload = () => {
     if (!resizedPreview) return;
     const link = document.createElement('a');
     link.href = resizedPreview;
     link.download = `resized-${originalFile?.name || 'image.jpg'}`;
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setOriginalFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalPreview(reader.result as string);
                setResizedPreview(null);
            };
            reader.readAsDataURL(file);
        } else {
            toast({ title: "Invalid file type", description: "Please drop an image file.", variant: "destructive" });
        }
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2"><ImageIcon /> Image Resizer</CardTitle>
        <CardDescription>Resize images to a specific file size in kilobytes (KB) without specifying pixel dimensions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <p>Drag & drop an image here, or click to select a file</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-2">
                <h3 className="font-semibold">Original Image</h3>
                {originalPreview ? (
                    <Image src={originalPreview} alt="Original" width={300} height={300} className="rounded-md object-contain h-64 w-full bg-muted" />
                ) : (
                    <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">No image selected</div>
                )}
                {originalFile && <p className="text-sm text-muted-foreground">Size: {(originalFile.size / 1024).toFixed(2)} KB</p>}
            </div>
            <div className="flex flex-col items-center gap-2">
                <h3 className="font-semibold">Resized Image</h3>
                {resizedPreview ? (
                    <Image src={resizedPreview} alt="Resized" width={300} height={300} className="rounded-md object-contain h-64 w-full bg-muted" />
                ) : (
                    <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">Resize to see preview</div>
                )}
                {/* This would show the actual resized size */}
                {resizedPreview && <p className="text-sm text-muted-foreground">Approx. Size: {((resizedPreview.length * 3) / 4 / 1024).toFixed(2)} KB</p>}
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-size">Target Size (KB)</Label>
          <Input 
            id="target-size" 
            type="number" 
            value={targetSize} 
            onChange={(e) => setTargetSize(Number(e.target.value))} 
            placeholder="e.g., 100" 
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Button onClick={handleResize} disabled={!originalFile || isResizing} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isResizing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
            {isResizing ? 'Resizing...' : 'Resize Image'}
          </Button>
          <Button onClick={handleDownload} disabled={!resizedPreview || isResizing} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
