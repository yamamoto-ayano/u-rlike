export const fetchMetadata = async (url: string): Promise<{ title: string; image: string }> => {
    try {
      const res = await fetch(url);
      const html = await res.text();
  
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : "タイトルが取得できませんでした";
  
      const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["'](.*?)["']/i);
      const image = ogImageMatch ? ogImageMatch[1].trim() : "";
  
      return { title, image };
    } catch (error) {
      console.error(`Error fetching metadata for ${url}:`, error);
      return { title: "取得エラー", image: "" };
    }
  };
  