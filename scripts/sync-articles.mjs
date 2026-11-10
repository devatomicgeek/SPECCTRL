// Export published Firestore articles into static HTML at build time.
// Firestore rules must allow the public status == published query.
import {writeFile, mkdir} from 'node:fs/promises';
const project=process.env.SPECCTRL_FIREBASE_PROJECT_ID || 'specctrl-7c69f';
const key=process.env.SPECCTRL_FIREBASE_API_KEY || 'AIzaSyCfl1mlcJP-rSOtotmcT_gsE8EPVgdo-GM';
const endpoint=`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:runQuery?key=${encodeURIComponent(key)}`;
function value(v){if(!v)return null;if('stringValue'in v)return v.stringValue;if('booleanValue'in v)return v.booleanValue;if('integerValue'in v)return Number(v.integerValue);if('doubleValue'in v)return v.doubleValue;if('arrayValue'in v)return (v.arrayValue.values||[]).map(value);if('mapValue'in v)return Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,x])=>[k,value(x)]));return null;}
const articles=[];
let offset=0;
try{
 while(true){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({structuredQuery:{from:[{collectionId:'articles'}],where:{fieldFilter:{field:{fieldPath:'status'},op:'EQUAL',value:{stringValue:'published'}}},limit:100,offset}})});
  if(!response.ok)throw new Error(`Firestore query failed: HTTP ${response.status}: ${(await response.text()).slice(0,400)}`);
  const result=await response.json();
  const docs=result.filter(x=>x.document).map(x=>x.document);
  for(const doc of docs){const data=Object.fromEntries(Object.entries(doc.fields||{}).map(([k,v])=>[k,value(v)]));const slug=doc.name.split('/').pop();if(data.status==='published'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))articles.push({slug,title:String(data.title||''),category:String(data.category||''),summary:String(data.summary||''),body:String(data.body||''),imageUrl:String(data.imageUrl||''),seoTitle:String(data.seoTitle||''),seoDescription:String(data.seoDescription||'')});}
  if(docs.length<100)break;
  offset+=docs.length;
 }
 await mkdir('lib',{recursive:true});
 await writeFile('lib/publishedArticles.json',JSON.stringify(articles,null,2)+'\n');
 console.log(`SPECCTRL: exported ${articles.length} published articles to static pages.`);
}catch(e){console.error('SPECCTRL: article export failed. Build stopped to avoid publishing an incomplete sitemap:',e.message);process.exit(1)}
