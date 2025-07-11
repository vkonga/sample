import { BookOpen, KeyRound, Palette, Quote, Rocket, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import EarlyAccessForm from "@/components/early-access-form";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary-foreground bg-primary p-1.5 rounded-lg" />
            <h1 className="text-2xl font-bold font-headline text-foreground">
              Storybook AI
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section id="hero" className="py-16 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-headline tracking-tight text-foreground">
                Join the Waitlist for Magical Story Time.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Unleash your creativity with our AI-powered storybook generator. Create unique, engaging tales for children, and be the first to experience the magic.
              </p>
              <div className="flex gap-4">
                {/* <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  <Link href="/create">Start Creating Now</Link>
                </Button> */}
              </div>
            </div>
            <div>
              <Card className="shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                    <KeyRound className="h-6 w-6 text-accent-foreground" />
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

        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-3xl md:text-4xl font-bold font-headline">Why You'll Love It</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the features that make Storybook AI the ultimate tool for creating personalized narratives.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4 font-headline">AI-Powered Magic</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our advanced AI generates captivating stories, characters, and illustrations based on your preferences.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4 font-headline">Fully Customizable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tailor every aspect of your story, from the protagonist's name to the art style, for a truly unique book.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4 font-headline">Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Go from idea to a complete, beautifully illustrated storybook in minutes, not weeks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-3xl md:text-4xl font-bold font-headline">Loved by Early Testers</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our first users are saying.
              </p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col justify-between h-full shadow-lg">
                        <CardContent className="pt-6">
                          <Quote className="h-8 w-8 text-primary/50 mb-4" />
                          <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                        </CardContent>
                        <CardHeader className="flex-row items-center gap-4">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Storybook AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const testimonials = [
  {
    name: "Sarah L.",
    title: "Parent & Blogger",
    quote: "This is a game-changer for bedtime stories! My kids are obsessed with the characters we created together. I can't wait for the full release.",
    avatar: "https://placehold.co/100x100.png",
    hint: "woman blogger",
  },
  {
    name: "Mark T.",
    title: "Educator",
    quote: "I used the beta to create stories for my classroom, and the engagement was off the charts. It's a fantastic tool for encouraging creativity in children.",
    avatar: "https://placehold.co/100x100.png",
    hint: "male educator",
  },
  {
    name: "Jessica P.",
    title: "Illustrator",
    quote: "As an artist, I'm incredibly impressed by the quality and style of the AI-generated illustrations. It's like having a tireless creative partner.",
    avatar: "https://placehold.co/100x100.png",
    hint: "woman artist",
  },
    {
    name: "David C.",
    title: "App Developer",
    quote: "The interface is so intuitive and the process is seamless. From concept to complete storybook in minutes. The team has built something special here.",
    avatar: "https://placehold.co/100x100.png",
    hint: "male developer",
  },
];
