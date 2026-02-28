import { BlogPost } from "./types";
import { postsBatch1 } from "./blog-data-1";
import { postsBatch2 } from "./blog-data-2";
import { postsBatch3 } from "./blog-data-3";
import { postsBatch4 } from "./blog-data-4";
import { postsBatch5 } from "./blog-data-5";
import { postsBatch6 } from "./blog-data-6";

// Combine all 30 high-quality rewritten and newly generated posts
export const BLOG_POSTS: BlogPost[] = [
  ...postsBatch1,
  ...postsBatch2,
  ...postsBatch3,
  ...postsBatch4,
  ...postsBatch5,
  ...postsBatch6,
];
