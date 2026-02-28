const fs = require('fs');
const https = require('https');

const files = [
  'client/src/lib/blog-data-1.ts',
  'client/src/lib/blog-data-2.ts',
  'client/src/lib/blog-data-3.ts',
  'client/src/lib/blog-data-4.ts',
  'client/src/lib/blog-data-5.ts',
  'client/src/lib/blog-data-6.ts',
];

async function fetchUrls(query, count) {
  return new Promise((resolve, reject) => {
    https.get(`https://unsplash.com/napi/search/photos?query=${query}&per_page=${count}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const urls = json.results.map(r => r.urls.raw + '&auto=format&fit=crop&q=80&w=1000');
          resolve(urls);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const koreanUrls = await fetchUrls('korean+food', 20);
    const restUrls = await fetchUrls('restaurant+food', 10);
    const allUrls = [...koreanUrls, ...restUrls];
    
    if (allUrls.length < 30) {
      console.error('Not enough URLs fetched');
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
