// SPECCTRL Media API v0.2.2. Cloudflare Worker, module syntax.
// Required binding: MEDIA_BUCKET (R2). Variables: FIREBASE_PROJECT_ID, ADMIN_UID.
const ORIGINS = new Set(['https://specctrl.pages.dev']);
const MAX_BYTES = 2 * 1024 * 1024;
const TYPES = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
const encoder = new TextEncoder();
function json(data,status=200,headers={}) {return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}})}
function cors(origin){return origin && ORIGINS.has(origin)?{'access-control-allow-origin':origin,'vary':'Origin','access-control-allow-methods':'GET,POST,DELETE,OPTIONS','access-control-allow-headers':'Authorization,Content-Type','access-control-max-age':'600'}:{}}
function b64url(s){const t=s.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(t.padEnd(Math.ceil(t.length/4)*4,'=')),c=>c.charCodeAt(0))}
async function verifyToken(request,env){
 const h=request.headers.get('authorization')||'';if(!h.startsWith('Bearer '))throw Error('Missing authentication token');
 const parts=h.slice(7).split('.');if(parts.length!==3)throw Error('Malformed token');
 let head,payload;try{head=JSON.parse(new TextDecoder().decode(b64url(parts[0])));payload=JSON.parse(new TextDecoder().decode(b64url(parts[1])))}catch{throw Error('Invalid token encoding')}
 const project=env.FIREBASE_PROJECT_ID;
 if(!project||!env.ADMIN_UID||head.alg!=='RS256'||!head.kid||payload.aud!==project||payload.iss!==`https://securetoken.google.com/${project}`||payload.sub!==env.ADMIN_UID||typeof payload.sub!=='string'||!payload.sub||typeof payload.exp!=='number'||payload.exp<=Date.now()/1000||typeof payload.iat!=='number'||payload.iat>Date.now()/1000+60||typeof payload.auth_time!=='number'||payload.auth_time>Date.now()/1000+60)throw Error('Unauthorized account or expired token');
 const response=await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');if(!response.ok)throw Error('Unable to verify token');
 const keys=await response.json();const jwk=keys.keys?.find(k=>k.kid===head.kid&&k.kty==='RSA'&&k.use==='sig');if(!jwk)throw Error('Unknown signing key');
 const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,b64url(parts[2]),encoder.encode(`${parts[0]}.${parts[1]}`)))throw Error('Invalid signature');
 return payload;
}
function safeKey(key){return /^cameras\/[a-z0-9][a-z0-9-]{0,79}\/[a-z0-9-]{8,80}\.(jpg|png|webp)$/.test(key)}
export default {async fetch(request,env){
 const url=new URL(request.url),origin=request.headers.get('origin');const headers=cors(origin);
 if(request.method==='OPTIONS')return new Response(null,{status:origin&&!ORIGINS.has(origin)?403:204,headers});
 try{
 if(url.pathname==='/health'&&request.method==='GET')return json({ok:true,service:'specctrl-media-api',version:'0.2.8'},200,headers);
 if(url.pathname.startsWith('/images/')&&request.method==='GET'){
  const key=decodeURIComponent(url.pathname.slice('/images/'.length));if(!safeKey(key))return json({error:'Invalid image path'},400,headers);
  const object=await env.MEDIA_BUCKET.get(key);if(!object)return json({error:'Image not found'},404,headers);
  return new Response(object.body,{headers:{...headers,'content-type':object.httpMetadata?.contentType||'application/octet-stream','cache-control':'public, max-age=3600','x-content-type-options':'nosniff'}});
 }
 if(url.pathname!=='/deploy'&&!['/media','/media/'].includes(url.pathname)&&!url.pathname.startsWith('/media/'))return json({error:'Not found'},404,headers);
 if(origin&&!ORIGINS.has(origin))return json({error:'Origin not allowed'},403,headers);
 try{await verifyToken(request,env)}catch(e){return json({error:'Unauthorized',detail:e.message},401,headers)}
 if(url.pathname==='/deploy'&&request.method==='POST'){
  if(!env.PAGES_DEPLOY_HOOK)return json({error:'Pages deploy hook is not configured on this Worker'},503,headers);
  const response=await fetch(env.PAGES_DEPLOY_HOOK,{method:'POST'});
  if(!response.ok){console.error('Pages deployment trigger failed',response.status);return json({error:'Cloudflare Pages rejected the deployment request'},502,headers)}
  return json({ok:true,message:'Cloudflare Pages rebuild requested. The article will appear when deployment finishes.'},202,headers);
 }
 if(url.pathname==='/media'&&request.method==='GET'){
  const objects=await env.MEDIA_BUCKET.list({prefix:'cameras/',limit:500});
  return json({items:objects.objects.map(o=>({key:o.key,size:o.size,uploaded:o.uploaded?.toISOString(),url:`${url.origin}/images/${o.key}`})),truncated:objects.truncated},200,headers);
 }
 if(url.pathname==='/media'&&request.method==='POST'){
  const contentType=(request.headers.get('content-type')||'').split(';')[0].toLowerCase();if(!TYPES[contentType])return json({error:'Only JPEG, PNG and WebP are supported'},415,headers);
  const length=Number(request.headers.get('content-length')||0);if(length>MAX_BYTES)return json({error:'Image exceeds 2 MB'},413,headers);
  const slug=url.searchParams.get('camera')||'general';if(!/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug))return json({error:'Invalid camera slug'},400,headers);
  const bytes=await request.arrayBuffer();if(!bytes.byteLength||bytes.byteLength>MAX_BYTES)return json({error:'Image must be between 1 byte and 2 MB'},413,headers);
  const u=new Uint8Array(bytes);const jpg=u.length>3&&u[0]===255&&u[1]===216&&u[2]===255;
  const png=u.length>8&&[137,80,78,71,13,10,26,10].every((v,i)=>u[i]===v);
  const webp=u.length>12&&String.fromCharCode(...u.slice(0,4))==='RIFF'&&String.fromCharCode(...u.slice(8,12))==='WEBP';
  if(!(contentType==='image/jpeg'&&jpg||contentType==='image/png'&&png||contentType==='image/webp'&&webp))return json({error:'Image signature does not match MIME type'},415,headers);
  const id=crypto.randomUUID();const key=`cameras/${slug}/${id}.${TYPES[contentType]}`;
  await env.MEDIA_BUCKET.put(key,bytes,{httpMetadata:{contentType},customMetadata:{uploadedBy:'specctrl-admin'}});
  return json({key,url:`${url.origin}/images/${key}`,size:bytes.byteLength},201,headers);
 }
 if(url.pathname.startsWith('/media/')&&request.method==='DELETE'){
  const key=decodeURIComponent(url.pathname.slice('/media/'.length));if(!safeKey(key))return json({error:'Invalid image path'},400,headers);
  await env.MEDIA_BUCKET.delete(key);return json({ok:true},200,headers);
 }
 return json({error:'Method not allowed'},405,{...headers,allow:'GET,POST,DELETE'});
 }catch(e){console.error('Media API error',e);return json({error:'Server error'},500,headers)}
}};
