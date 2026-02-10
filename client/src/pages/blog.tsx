import { Link } from "wouter";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>Blog - Food Guide & Recommendations</title>
        <meta name="description" content="Read our latest articles about Korean food culture, restaurant reviews, and dining guides." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="ml-auto font-bold text-lg">
            Lunch AI Blog
          </div>
        </div>
      </header>

      <main className="container py-10 max-w-5xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Discover Korean Cuisine
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our curated guides to Seoul's best eats, cultural insights, and hidden gems.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {BLOG_POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer border-border/50 overflow-hidden group">
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <CardHeader className="space-y-2">
                    <div className="flex gap-2 mb-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">
                      {post.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t bg-muted/20 p-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-primary" />
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
