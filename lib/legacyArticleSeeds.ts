import {articles} from './data';
import {bodies} from './articleBody';
import type {ManagedArticle} from './articleStore';
export const legacyArticleSeeds:ManagedArticle[]=articles.map(a=>({slug:a.slug,title:a.title,category:a.type==='COMPARISON'?'comparison':a.type==='EXPLAINER'?'education':'buying-guide',summary:a.summary,body:[bodies[a.slug].intro,...bodies[a.slug].sections.map(s=>'## '+s.title+'\n\n'+s.body)].join('\n\n'),imageUrl:'',seoTitle:a.title,seoDescription:a.summary.slice(0,160),status:'draft'}));
