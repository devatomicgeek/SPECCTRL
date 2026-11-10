import {articles} from '@/lib/data';
import {bodies} from '@/lib/articleBody';
import published from '@/lib/publishedArticles.json';
import ArticleBody from '@/components/ArticleBody';
import ArticleToc from '@/components/ArticleToc';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
const dynamicArticles=published as {slug:string;title:string;category:string;summary:string;body:string;imageUrl:string;seoTitle:string;seoDescription:string}[];
export function generateStaticParams() {
  const slugs = [
    ...articles.map(a => a.slug),
    ...dynamicArticles.map(a => a.slug)
  ];

  return Array.from(new Set(slugs)).map(slug => ({ slug }));
}
export function generateMetadata({params}:{params:{slug:string}}):Metadata{
 const a=dynamicArticles.find(x=>x.slug===params.slug);
 if(!a)return {title:articles.find(x=>x.slug===params.slug)?.title};
 const title=a.seoTitle||a.title;
 const description=a.seoDescription||a.summary;
 return {title:{absolute:title},description,alternates:{canonical:`/guides/${a.slug}/`},openGraph:{type:'article',title,description,url:`/guides/${a.slug}/`,images:a.imageUrl?[{url:a.imageUrl}]:undefined}};
}
export default function Page({params}:{params:{slug:string}}){
 const a=dynamicArticles.find(x=>x.slug===params.slug);
 if(a){const structured={'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.seoDescription||a.summary,mainEntityOfPage:`https://specctrl.pages.dev/guides/${a.slug}/`,image:a.imageUrl?[a.imageUrl]:undefined,publisher:{'@type':'Organization',name:'SPECCTRL'}};
 return <main className="articlePage mx-auto px-5 pt-12"><Link href="/guides/" className="blue text-sm font-bold">← All guides</Link><p className="tag mt-9">{a.category}</p><h1 className="text-4xl sm:text-5xl font-black mt-4 leading-tight">{a.title}</h1><p className="muted text-lg mt-6">{a.summary}</p>{a.imageUrl&&<img className="rounded-2xl mt-8 w-full object-contain" style={{maxHeight:460}} src={a.imageUrl} alt={a.title}/>}<ArticleToc body={a.body}/><article className="mt-10"><ArticleBody body={a.body}/></article><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/></main>}
 const legacy=articles.find(x=>x.slug===params.slug);if(!legacy)notFound();const body=bodies[legacy.slug];return <main className="articlePage mx-auto px-5 pt-12"><Link href="/guides/" className="blue text-sm font-bold">← All guides</Link><p className="tag mt-9">{legacy.type} · {legacy.time}</p><h1 className="text-4xl sm:text-5xl font-black mt-4 leading-tight">{legacy.title}</h1><p className="muted text-lg mt-6 leading-relaxed">{body.intro}</p><div className="panel p-5 mt-7 text-sm muted"><strong>Editorial note:</strong> This is an original introductory research guide, not a report of hands-on camera testing. Confirm manufacturer details and add source links before public launch.</div><article className="space-y-10 mt-10">{body.sections.map(s=><section key={s.title}><h2 className="text-2xl font-extrabold">{s.title}</h2><p className="muted leading-8 mt-4">{s.body}</p></section>)}</article><div className="panel p-7 mt-12"><h2 className="section-title">Continue researching</h2><p className="muted mt-3">See the cameras and their verified specification fields in our comparison tool.</p><Link className="btn mt-5" href="/compare/">Compare cameras →</Link></div></main>
}
