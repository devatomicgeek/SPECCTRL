import type {MetadataRoute} from 'next';
import published from '@/lib/publishedArticles.json';
export default function sitemap():MetadataRoute.Sitemap{const base='https://specctrl.pages.dev';const paths=['/','/cameras/','/compare/','/guides/','/reviews/'];return [...paths.map(path=>({url:base+path})),...published.map(a=>({url:`${base}/guides/${a.slug}/`}))];}
