"use client";

import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileImage, FileText, Download, RefreshCw } from 'lucide-react';

// Add pdfjsLib to window type
declare global {
  interface Window {
    pdfjsLib: any;
  }
}
// Load pdf.js from CDN for browser compatibility
function loadPdfJsLib(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js';
    script.onload = () => {
      resolve(window.pdfjsLib);
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function FileConverterPage() {
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfImages, setPdfImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'image' && file.type.startsWith('image/')) {
        setImageFile(file);
      } else if (type === 'pdf' && file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        toast({ title: "Invalid file type", variant: "destructive" });
      }
    }
  };

  const handleConvert = async (type: 'img2pdf' | 'pdf2img') => {
    if ((type === 'img2pdf' && !imageFile) || (type === 'pdf2img' && !pdfFile)) {
      toast({ title: "No file selected", description: "Please select a file to convert.", variant: "destructive" });
      return;
    }
    setIsConverting(true);
    try {
      if (type === 'img2pdf' && imageFile) {
        // Dynamically import jsPDF
        const { jsPDF } = await import('jspdf');
        const imgData = await fileToDataURL(imageFile);
        // Create PDF
        const pdf = new jsPDF();
        // Calculate image size to fit page
        const img = new window.Image();
        img.src = imgData;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = (e) => reject(new Error("Failed to load image for PDF conversion."));
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let imgWidth = img.width;
        let imgHeight = img.height;
        // Scale to fit page
        if (imgWidth > pageWidth || imgHeight > pageHeight) {
          const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
          imgWidth *= ratio;
          imgHeight *= ratio;
        }
        pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
        pdf.save(imageFile.name.replace(/\.[^.]+$/, '') + '.pdf');
        toast({ title: "Conversion Successful!", description: "Your PDF is ready for download." });
      } else if (type === 'pdf2img' && pdfFile) {
        // Use CDN pdf.js for browser compatibility
        const pdfjsLib = await loadPdfJsLib();
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';
        const fileReader = new FileReader();
        const fileBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
          fileReader.onerror = (e) => reject(new Error("Failed to read PDF file. Please try another file."));
          fileReader.onabort = () => reject(new Error("File reading was aborted."));
          fileReader.readAsArrayBuffer(pdfFile);
        });
        let pdf;
        try {
          pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        } catch (e) {
          throw new Error("Failed to parse PDF. The file may be corrupted or not a valid PDF.");
        }
        const images: string[] = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          let page;
          try {
            page = await pdf.getPage(pageNum);
          } catch (e) {
            throw new Error(`Failed to render page ${pageNum} of PDF.`);
          }
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          try {
            await page.render({ canvasContext: context, viewport }).promise;
          } catch (e) {
            throw new Error(`Failed to render image for page ${pageNum}.`);
          }
          const imgData = canvas.toDataURL('image/png');
          images.push(imgData);
        }
        setPdfImages(images);
        toast({ title: "Conversion Successful!", description: "Preview and download your images below." });
      }
    } catch (err) {
      let msg = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Unknown error occurred.');
      toast({ title: "Conversion Failed", description: msg, variant: "destructive" });
    }
    setIsConverting(false);
  };

  // Helper to convert file to DataURL
  function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read image file. Please try another file."));
      reader.onabort = () => reject(new Error("File reading was aborted."));
      reader.readAsDataURL(file);
    });
  }

  const FileInput = ({ type, file, inputRef }: { type: 'image' | 'pdf', file: File | null, inputRef: React.RefObject<HTMLInputElement> }) => (
    <div className="space-y-4">
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <input 
            type="file" 
            accept={type === 'image' ? 'image/*' : 'application/pdf'} 
            ref={inputRef} 
            onChange={(e) => handleFileChange(e, type)} 
            className="hidden" 
          />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <p>Drag & drop a file here, or click to select</p>
          </div>
        </div>
        {file && (
          <div className="text-center text-sm text-muted-foreground p-2 bg-muted rounded-md">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}
    </div>
  );

  return (
    <>
      <Head>
        <link rel="canonical" href="https://purniapulse.in/tools/file-converter" />
      </Head>
      <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2"><FileText /> File Converter</CardTitle>
        <CardDescription>Quickly convert your files between popular formats.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="img-to-pdf">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="img-to-pdf">Image to PDF</TabsTrigger>
            <TabsTrigger value="pdf-to-img">PDF to Image</TabsTrigger>
          </TabsList>
          <TabsContent value="img-to-pdf" className="mt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><FileImage /> Convert Image to PDF</h3>
            <p className="text-sm text-muted-foreground mb-4">Select an image (JPG, PNG, etc.) to convert it into a PDF document.</p>
            <FileInput type="image" file={imageFile} inputRef={imageInputRef} />
            <Button onClick={() => handleConvert('img2pdf')} disabled={!imageFile || isConverting} className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isConverting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {isConverting ? 'Converting...' : 'Convert & Download PDF'}
            </Button>
          </TabsContent>
          <TabsContent value="pdf-to-img" className="mt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><FileText /> Convert PDF to Image</h3>
            <p className="text-sm text-muted-foreground mb-4">Select a PDF file to convert its pages into images (PNG).</p>
            <FileInput type="pdf" file={pdfFile} inputRef={pdfInputRef} />
            <Button onClick={() => handleConvert('pdf2img')} disabled={!pdfFile || isConverting} className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isConverting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {isConverting ? 'Converting...' : 'Convert & Preview Images'}
            </Button>
            {/* Preview and download images */}
            {pdfImages.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-2">Preview Pages</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pdfImages.map((img, idx) => (
                    <div key={idx} className="border rounded p-2 flex flex-col items-center">
                      <img src={img} alt={`Page ${idx + 1}`} width={512} height={512} className="w-full h-auto max-h-64 object-contain mb-2" />
                      <Button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = img;
                          link.download = `${pdfFile?.name.replace(/\.[^.]+$/, '')}-page${idx + 1}.png`;
                          link.click();
                        }}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        Download Page {idx + 1}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  className="mt-6 w-full"
                  onClick={async () => {
                    const zip = new JSZip();
                    pdfImages.forEach((img, idx) => {
                      zip.file(`${pdfFile?.name.replace(/\.[^.]+$/, '')}-page${idx + 1}.png`, img.split(',')[1], { base64: true });
                    });
                    const blob = await zip.generateAsync({ type: 'blob' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `${pdfFile?.name.replace(/\.[^.]+$/, '')}-images.zip`;
                    link.click();
                  }}
                >
                  Download All as ZIP
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      </Card>
    </>
  );
}

export default FileConverterPage;
