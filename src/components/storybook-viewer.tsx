"use client";

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import HTMLFlipBook from 'react-pageflip';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Page = {
  type: string;
  image: string | null;
  alt?: string;
  text: string;
  endText?: string;
};

type StorybookViewerProps = {
  pages: Page[];
};

const PageComponent = React.forwardRef<HTMLDivElement, { page: Page, pageNumber: number }>(({ page, pageNumber }, ref) => {
  return (
    <div ref={ref} className="bg-background border border-border/50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-full h-full">
        {page.image && (
          <div className="relative w-full md:w-1/2 h-64 md:h-full min-h-[500px]">
            <Image
              src={page.image}
              alt={page.alt || ''}
              fill
              className="object-cover"
              priority={pageNumber <= 2}
            />
          </div>
        )}
        <div className={`p-8 md:p-12 space-y-4 text-center flex flex-col justify-center items-center ${page.image ? 'md:w-1/2' : 'w-full'}`}>
          {page.type === "cover" ? (
            <h3 className="text-4xl font-bold font-headline">{page.text}</h3>
          ) : (
            <p className="font-headline leading-relaxed" style={{ fontSize: '25px' }}>{page.text}</p>
          )}
          {page.type === "end" && (
            <p className="text-3xl font-bold font-headline mt-6">{page.endText}</p>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 text-muted-foreground text-sm">{pageNumber}</div>
    </div>
  );
});
PageComponent.displayName = "PageComponent";


export default function StorybookViewer({ pages }: StorybookViewerProps) {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const handlePrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);


  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-full max-w-6xl mx-auto aspect-[4/3] relative">
         <HTMLFlipBook
          width={600}
          height={800}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={420}
          maxHeight={1350}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={handleFlip}
          className="mx-auto"
          ref={bookRef}
        >
          {pages.map((page, index) => (
             <PageComponent key={index} page={page} pageNumber={index + 1}/>
          ))}
        </HTMLFlipBook>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Button onClick={handlePrev} disabled={currentPage === 0}>
          <ChevronLeft />
          Previous
        </Button>
        <div className="text-muted-foreground">
          Page {currentPage + 1} of {pages.length}
        </div>
        <Button onClick={handleNext} disabled={currentPage >= pages.length - 1}>
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}