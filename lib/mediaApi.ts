import {auth} from './firebase';
export const MEDIA_API='https://specctrl-media-api.mratomicgeek.workers.dev';
async function authorized(path:string,init:RequestInit={}){
 const user=auth.currentUser;if(!user)throw new Error('Sign in as administrator first.');
 const token=await user.getIdToken();const res=await fetch(MEDIA_API+path,{...init,headers:{...init.headers,Authorization:`Bearer ${token}`}});
 const body=await res.json().catch(()=>({}));if(!res.ok)throw new Error(body.error||`Media API returned ${res.status}`);return body;
}
export type MediaItem={key:string;url:string;size:number;uploaded?:string};
export async function listMedia():Promise<{items:MediaItem[];truncated:boolean}>{return authorized('/media')}
export async function uploadMedia(file:File,slug:string):Promise<MediaItem>{return authorized(`/media?camera=${encodeURIComponent(slug||'general')}`,{method:'POST',headers:{'Content-Type':file.type},body:file})}
export async function deleteMedia(key:string){return authorized(`/media/${key}`,{method:'DELETE'})}
