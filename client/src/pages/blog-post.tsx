import { useRoute, Link } from "wouter";
import { BLOG_POSTS } from "@/lib/blog-data";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import NotFound from "@/pages/not-found";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  
  if (!match || !params) return <NotFound />;

  const post = BLOG_POSTS.find(p => p.slug === params.slug);

  if (!post) return <NotFound />;

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>{post.title} - Lunch AI Blog</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.imageUrl} />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center max-w-4xl mx-auto px-4">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          <div className="ml-auto">
             <Button variant="outline" size="sm" onClick={sharePost} className="gap-2">
               <Share2 className="h-4 w-4" />
               Share
             </Button>
          </div>
        </div>
      </header>

      <article className="container max-w-3xl mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center gap-2 mb-4">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden mb-10 shadow-md">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        <MarkdownRenderer content={post.content} />

        <Separator className="my-10" />

        <div className="bg-muted/30 p-8 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">Did you enjoy this article?</h3>
          <p className="text-muted-foreground mb-4">
            Explore more recommendations for your next meal with our AI-powered tool.
          </p>
          <Link href="/">
             <Button size="lg" className="font-bold">
               Find My Next Meal
             </Button>
          </Link>
        </div>

      </article>
    </div>
  );
}
