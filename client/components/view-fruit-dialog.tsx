import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AspectRatio } from './ui/aspect-ratio';
import Image from 'next/image';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Progress } from './ui/progress';

export default function ViewFruitDialog({ src, alt, title, ripePercentage, recommendation }: { src: any; alt: string; title?: string; ripePercentage: string | undefined; recommendation: string }) {
  return (
    <>
      <DialogTrigger asChild>
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Button className="m-0 p-0">
            <Image src={src} alt={alt} fill className="rounded-md object-cover" />
          </Button>
        </AspectRatio>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="my-6"> {title || ''}</DialogTitle>
          <DialogDescription className="mx-10 flex">
            <Carousel className="w-full max-w-lg">
              <CarouselContent className="">
                <CarouselItem>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image src={src} alt={alt} fill className="rounded-md object-cover" />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="mx-10 grid w-full gap-4 py-4">
              <div className="flex flex-col justify-between">
                <Card>
                  <h1 className="border-none p-4 text-center text-2xl font-semibold outline-none">Ripe Meter</h1>
                </Card>
                {/* <Progress value={ripePercentage} className="mt-3 h-6 w-full" /> */}
                <p className="text-center text-5xl font-extrabold">{ripePercentage === 'N/A' || ripePercentage == 'null' ? 'N/A' : ripePercentage}</p>
                <Card className="mt-5 p-2">
                  <CardContent className="text-center">
                    <p>{recommendation}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </>
  );
}
