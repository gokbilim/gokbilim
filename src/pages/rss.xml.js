import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // 1. Tüm içerikleri çek
  const butunIcerikler = await getCollection('icerikler');

  // 2. İçerikleri en yeniden eskiye doğru sırala
  const siraliIcerikler = butunIcerikler.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  // 3. RSS Feed'i oluştur ve döndür
  return rss({
    // Sitenizin başlığı
    title: "gokbilim.net - Türkiye'nin Gökbilim Portalı",
    
    // Sitenizin genel açıklaması
    description: "Astronomi haberleri, uzay araştırmaları, gökbilim tarihi, gözlemevleri incelemeleri ve ayın fotoğrafı ile evrenin sırlarını keşfedin.",
    
    // Projenizin site URL'si (astro.config.mjs dosyanızdaki 'site' ayarından gelir)
    site: context.site,

    // rss etiketi içine W3C'nin istediği atom isimlendirmesi
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    
    // 4. Makaleleri RSS öğelerine dönüştür
    items: siraliIcerikler.map((icerik) => ({
      // Makale başlığı
      title: icerik.data.title,
      
      // Makale yayın tarihi
      pubDate: icerik.data.pubDate,
      
      // Makale açıklaması: 'importance' alanı varsa onu, yoksa metnin ilk 150 karakterini kullan
      description: icerik.data.importance || `${icerik.body.substring(0, 150).replace(/\n/g, ' ')}...`,
      
      // Makale linki (id'den .md uzantısını SEO için temizlediğimiz yapı)
      link: `/icerikler/${icerik.id.replace('.md', '')}/`,
      
      // KRİTİK EKLENTİ: Nuelink (Instagram) için görselin RSS'e dahil edilmesi. 
      // Markdown içindeki 'image' alanını mutlak (absolute) URL'ye çeviriyoruz.
      customData: icerik.data.image 
        ? `<enclosure url="${new URL(icerik.data.image, context.site).href}" type="image/jpeg" length="0" />` 
        : '',
    })),
    
    // RSS dilini Türkçe olarak ayarla ve atom:link (self referans) etiketini ekle
    customData: `
      <language>tr-tr</language>
      <atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />
    `,
  });
}