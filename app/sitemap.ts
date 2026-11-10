import type {MetadataRoute} from 'next';
import published from '@/lib/publishedArticles.json';
import {articles} from '@/lib/data';
export default function sitemap():MetadataRoute.Sitemap{const base='https://specctrl.pages.dev';const paths=['/','/cameras/','/compare/','/guides/','/reviews/'];const slugs=[...Array.from(new Set([...articles.map(a=>a.slug),...published.map(a=>a.slug)]))];return [...paths.map(path=>({url:base+path})),...slugs.map(slug=>({url:`${base}/guides/${slug}/`}))];}
