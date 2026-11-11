import {collection,doc,onSnapshot,query,where,setDoc,deleteDoc,serverTimestamp} from 'firebase/firestore';
import {db} from './firebase';
export type ArticleCategory='review'|'comparison'|'buying-guide'|'education';
export type ManagedArticle={slug:string;title:string;category:ArticleCategory;summary:string;body:string;imageUrl:string;seoTitle:string;seoDescription:string;status:'draft'|'published'|'archived';updatedAt?:unknown};
const ref=collection(db,'articles');
export function subscribeArticles(admin:boolean,onData:(items:ManagedArticle[])=>void,onError:(error:Error)=>void){return onSnapshot(admin?ref:query(ref,where('status','==','published')),snapshot=>onData(snapshot.docs.map(d=>({...d.data(),slug:d.id} as ManagedArticle)).filter(a=>admin||a.status==='published')),onError)}
export async function saveArticle(article:ManagedArticle){const {slug,updatedAt,...fields}=article;await setDoc(doc(db,'articles',slug),{...fields,updatedAt:serverTimestamp()});}
export async function removeArticle(slug:string){await deleteDoc(doc(db,'articles',slug));}
export function articleSlug(s:string){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
