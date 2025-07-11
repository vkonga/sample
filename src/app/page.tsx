import Image from "next/image";
import { KeyRound, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EarlyAccessForm from "@/components/early-access-form";
import { getEarlyAccessCount } from "./actions";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StorybookViewer from "@/components/storybook-viewer";


async function EarlyAccessCounter() {
  const count = await getEarlyAccessCount();
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Users className="h-5 w-5" />
      <span className="font-semibold">{count}</span>
      <span>people have joined the waitlist!</span>
    </div>
  );
}

const storyPages = [
  {
    type: "cover",
    image: "https://res.cloudinary.com/dsukslmgr/image/upload/v1752134304/Gemini_Generated_Image_xhnahjxhnahjxhna_wvuv6m.png",
    alt: "A dreamy night sky with a little girl looking out of her window.",
    text: "Luna and the Magic Star",
  },
  {
    type: "page",
    image: null,
    text: "Luna loved to watch the stars from her bedroom window every night. She dreamed of magical adventures far above the clouds.",
  },
  {
    type: "page",
    image: "https://res.cloudinary.com/dsukslmgr/image/upload/v1752134305/Gemini_Generated_Image_8xyfge8xyfge8xyf_uzii99.png",
    alt: "A bright shooting star streaks across the night sky as Luna watches from her window.",
    text: "One evening, she saw something special—a shiny star falling from the sky!",
  },
  {
    type: "page",
    image: null,
    text: "Without thinking twice, Luna put on her boots, grabbed her teddy, and tiptoed outside to find the fallen star.",
  },
  {
    type: "page",
    image: null,
    text: "In the meadow, she found the tiniest star, sparkling softly. “Hello,” said Luna kindly. “Are you lost?”",
  },
  {
    type: "page",
    image: null,
    text: "The little star blinked. “I fell… and I can’t find my way back home,” it whispered sadly.",
  },
  {
    type: "page",
    image: "https://res.cloudinary.com/dsukslmgr/image/upload/v1752134304/Gemini_Generated_Image_86f1g86f1g86f1g8_koclw2.png",
    alt: "Luna floating gently above the meadow, holding a glowing star.",
    text: "“Don’t worry!” Luna smiled. “I’ll help you!” She gently picked up the star, and suddenly—WHOOSH!—they began to float!",
  },
  {
    type: "page",
    image: null,
    text: "Up, up they soared—past clouds shaped like animals, past shimmering planets, until the stars twinkled all around them.",
  },
  {
    type: "page",
    image: null,
    text: "The little star beamed happily. “I see my home!” it sang. Luna giggled as they danced among the constellations.",
  },
  {
    type: "page",
    image: null,
    text: "With a gentle hug, Luna placed the star back where it belonged. “Thank you,” the star whispered. “You are my hero.”",
  },
  {
    type: "page",
    image: "https://res.cloudinary.com/dsukslmgr/image/upload/v1752134302/Gemini_Generated_Image_24o5j24o5j24o5j2_rd7ukv.png",
    alt: "Luna peacefully asleep in her cozy bed, moonlight shining through the window.",
    text: "Luna floated gently back to her bed, the sky above sparkling brighter than ever. Her heart felt warm and full.",
  },
  {
    type: "end",
    image: null,
    text: "And every night after, Luna knew: With kindness and courage, even the smallest hearts can shine the brightest.",
    endText: "The End",
  },
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow">
        <section id="hero" className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <Image
                src="https://res.cloudinary.com/dsukslmgr/image/upload/v1752064727/ChatGPT_Image_Jul_9_2025_12_14_27_PM_l3fkk1.png"
                alt="SalistleAI Logo"
                width={120}
                height={120}
                className="mx-auto mb-6 rounded-2xl shadow-lg"
              />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-headline tracking-tight">
              SalistleAI
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              SalistleAI uses AI to turn your ideas into beautifully illustrated storybooks. Join the waitlist to get early access.
            </p>
             <div className="mt-6 flex justify-center">
               <Suspense fallback={<div className="h-6 w-64 bg-muted rounded-md animate-pulse" />}>
                 <EarlyAccessCounter />
               </Suspense>
             </div>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Link href="#early-access">Get Early Access</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="sample-story" className="py-16 md:py-24 bg-card">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Sample Story: Luna and the Magic Star</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Here is a sample storybook generated by SalistleAI. Click the corners or use the buttons to turn the pages.
              </p>
            </div>
            <StorybookViewer pages={storyPages} />
           </div>
        </section>

        <section id="early-access" className="py-16 md:py-24">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto">
                <Card className="shadow-2xl bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                      <KeyRound className="h-6 w-6 text-primary" />
                      Request Early Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <EarlyAccessForm />
                  </CardContent>
                </Card>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SalistleAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
