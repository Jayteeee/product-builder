import fs from 'fs';

const files = [
  'client/src/lib/blog-data-1.ts',
  'client/src/lib/blog-data-2.ts',
  'client/src/lib/blog-data-3.ts',
  'client/src/lib/blog-data-4.ts',
  'client/src/lib/blog-data-5.ts',
  'client/src/lib/blog-data-6.ts',
];

async function fetchUrls(query, count) {
  const res = await fetch(`https://unsplash.com/napi/search/photos?query=${query}&per_page=${count}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch ${query}, status: ${res.status}`);
  const json = await res.json();
  return json.results.map(r => r.urls.raw + '&auto=format&fit=crop&q=80&w=1000');
}

async function run() {
  try {
    const koreanUrls = await fetchUrls('korean+food', 20);
    const restUrls = await fetchUrls('restaurant+food', 10);
    const allUrls = [...koreanUrls, ...restUrls];
    
    if (allUrls.length < 30) {
      console.error('Not enough URLs fetched', allUrls.length);
      return;
    }

    let urlIndex = 0;
    for (const file of files) {
      if (!fs.existsSync(file)) {
          console.error(`Missing file ${file}`);
          continue;
      }
      let content = fs.readFileSync(file, 'utf8');
      
      content = content.replace(/imageUrl:\s*\"[^\"]+\"/g, () => {
        const url = allUrls[urlIndex++];
        return `imageUrl: "${url}"`;
      });
      
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}. Used ${urlIndex} images so far.`);
    }
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}

run();
