import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import CreateStoryForm from '@/components/create-story-form';

export default function CreatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary-foreground bg-primary p-1.5 rounded-lg" />
            <h1 className="text-2xl font-bold font-headline text-foreground">
              Storybook AI
            </h1>
          </Link>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-foreground">Let's Create a Story</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              What kind of adventure should we go on? Describe your idea, and our AI storyteller will bring it to life.
            </p>
          </div>
          <CreateStoryForm />
        </div>
      </main>
      <footer className="py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Storybook AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
