import React from 'react';

// Small, safe Markdown subset. React escapes user-supplied text by default.
function inline(text:string):React.ReactNode[]{
 const parts:React.ReactNode[]=[];
 const pattern=/(!?\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
 let cursor=0;let match:RegExpExecArray|null;
 while((match=pattern.exec(text))!==null){
  if(match.index>cursor)parts.push(text.slice(cursor,match.index));
  if(match[2]!==undefined){
   const url=match[3].trim();const allowed=/^https:\/\//i.test(url)||url.startsWith('/')&&!url.startsWith('//');
   if(match[1].startsWith('!'))parts.push(allowed?<img key={match.index} src={url} alt={match[2]} loading="lazy" className="articleInlineImage"/>:match[0]);
   else parts.push(allowed?<a key={match.index} href={url} rel={url.startsWith('https:')?'noopener noreferrer':undefined} target={url.startsWith('https:')?'_blank':undefined} className="blue underline">{match[2]}</a>:match[0]);
  }else if(match[4]!==undefined)parts.push(<strong key={match.index}>{match[4]}</strong>);
  else parts.push(<em key={match.index}>{match[5]}</em>);
  cursor=pattern.lastIndex;
 }
 if(cursor<text.length)parts.push(text.slice(cursor));
 return parts;
}
export default function ArticleBody({body}:{body:string}){
 const blocks=body.replace(/\r\n/g,'\n').split(/\n\s*\n/).filter(x=>x.trim());
 return <div className="articleBody">{blocks.map((block,i)=>{
  const trimmed=block.trim();
  if(/^### /.test(trimmed))return <h3 key={i}>{inline(trimmed.slice(4))}</h3>;
  if(/^## /.test(trimmed))return <h2 key={i}>{inline(trimmed.slice(3))}</h2>;
  if(/^# /.test(trimmed))return <h2 key={i}>{inline(trimmed.slice(2))}</h2>;
  const lines=trimmed.split('\n');
  if(lines.every(l=>/^[-*] /.test(l.trim())))return <ul key={i}>{lines.map((l,j)=><li key={j}>{inline(l.trim().slice(2))}</li>)}</ul>;
  if(lines.every(l=>/^\d+\. /.test(l.trim())))return <ol key={i}>{lines.map((l,j)=><li key={j}>{inline(l.trim().replace(/^\d+\. /,''))}</li>)}</ol>;
  if(/^!\[[^\]]+\]\((https:\/\/[^)]+|\/[^/)][^)]*)\)$/.test(trimmed))return <figure key={i}>{inline(trimmed)}</figure>;
  return <p key={i}>{lines.map((line,j)=><React.Fragment key={j}>{j>0&&<br/>}{inline(line)}</React.Fragment>)}</p>;
 })}</div>;
}
