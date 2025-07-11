"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import HTMLFlipBook from 'react-pageflip';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, CornerDownLeft, CornerDownRight } from 'lucide-react';

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
      {page.image ? (
         <div className="relative w-full h-full">
            <Image
              src={page.image}
              alt={page.alt || 'Storybook image'}
              fill
              className="object-cover"
              priority={pageNumber <= 2}
            />
             {page.type === 'cover' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
                    <h3 className="text-3xl md:text-4xl font-bold font-headline text-white drop-shadow-lg text-center">{page.text}</h3>
                </div>
            )}
         </div>
      ) : (
        <div className="p-6 md:p-12 space-y-4 text-center flex flex-col justify-center items-center w-full h-full">
           <p className="font-headline leading-relaxed text-lg sm:text-xl md:text-2xl">{page.text}</p>
          {page.type === "end" && (
            <p className="text-2xl md:text-3xl font-bold font-headline mt-6">{page.endText}</p>
          )}
        </div>
      )}
      <div className="absolute bottom-2 right-4 text-muted-foreground text-xs">{pageNumber}</div>
    </div>
  );
});
PageComponent.displayName = "PageComponent";


export default function StorybookViewer({ pages }: StorybookViewerProps) {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;

  const handleFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const handlePrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  useEffect(() => {
    if (currentPage === totalPages - 1) {
      const timer = setTimeout(() => {
        bookRef.current?.pageFlip()?.flip(0, 'top');
      }, 3000); // Wait 3 seconds before flipping back to cover

      return () => clearTimeout(timer);
    }
  }, [currentPage, totalPages]);


  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-full max-w-4xl mx-auto aspect-[16/9] md:aspect-[4/3] relative">
         <HTMLFlipBook
          width={500}
          height={650}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
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
      <div className="flex items-center justify-center space-x-2 md:space-x-4">
        <Button onClick={handlePrev} disabled={currentPage === 0} variant="outline" size="sm">
          <ChevronLeft />
          Previous
        </Button>
        <div className="text-muted-foreground text-sm">
          Page {currentPage + 1} of {totalPages}
        </div>
        <Button onClick={handleNext} disabled={currentPage >= totalPages - 1} variant="outline" size="sm">
          Next
          <ChevronRight />
        </Button>
      </div>
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <CornerDownLeft className="w-4 h-4" />
        <span>Click the corners to flip pages</span>
        <CornerDownRight className="w-4 h-4" />
      </div>
    </div>
  );
}
