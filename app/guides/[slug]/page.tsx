import published from '@/lib/publishedArticles.json';
import ArticleBody from '@/components/ArticleBody';
import ArticleToc from '@/components/ArticleToc';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
const articles=published as {slug:string;title:string;category:string;summary:string;body:string;imageUrl:string;seoTitle:string;seoDescription:string}[];
export function generateStaticParams(){return articles.map(a=>({slug:a.slug}));}
export function generateMetadata({params}:{params:{slug:string}}):Metadata{
 const a=articles.find(x=>x.slug===params.slug);if(!a)return {title:'Article not found'};
 const title=a.seoTitle||a.title;const description=a.seoDescription||a.summary;
 return {title:{absolute:title},description,alternates:{canonical:`/guides/${a.slug}/`},openGraph:{type:'article',title,description,url:`/guides/${a.slug}/`,images:a.imageUrl?[{url:a.imageUrl}]:undefined}};
}
export default function Page({params}:{params:{slug:string}}){
 const a=articles.find(x=>x.slug===params.slug);if(!a)notFound();
 const structured={'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.seoDescription||a.summary,mainEntityOfPage:`https://specctrl.pages.dev/guides/${a.slug}/`,image:a.imageUrl?[a.imageUrl]:undefined,publisher:{'@type':'Organization',name:'SPECCTRL'}};
 return <main className="articlePage mx-auto px-5 pt-12"><Link href="/guides/" className="blue text-sm font-bold">← All guides</Link><p className="tag mt-9">{a.category}</p><h1 className="text-4xl sm:text-5xl font-black mt-4 leading-tight">{a.title}</h1><p className="muted text-lg mt-6">{a.summary}</p>{a.imageUrl&&<img className="rounded-2xl mt-8 w-full object-contain" style={{maxHeight:460}} src={a.imageUrl} alt={a.title}/>}<ArticleToc body={a.body}/><article className="mt-10"><ArticleBody body={a.body}/></article><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\u003c')}}/></main>;
}
