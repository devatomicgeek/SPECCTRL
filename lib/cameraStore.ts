import { collection, doc, getDocs, onSnapshot, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { cameras as starterCameras, type Camera } from './data';

export type ManagedCamera = Camera & { status: 'draft' | 'published'; imageUrl?: string; updatedAt?: string };
export const starter: ManagedCamera[] = starterCameras.map(c => ({...c, status:'published'}));
export const cameraCollection = collection(db,'cameras');
export function subscribeCameras(admin:boolean, onData:(rows:ManagedCamera[])=>void,onError:(error:Error)=>void){
 return onSnapshot(admin?cameraCollection:query(cameraCollection,where('status','==','published')), snap=>{
  const rows=snap.docs.map(d=>({...d.data(),slug:d.id} as ManagedCamera));
  onData(admin?rows:rows.filter(c=>c.status==='published'));
 },onError);
}
export async function saveCamera(camera:ManagedCamera){
 const {slug,...data}=camera;
 await setDoc(doc(db,'cameras',slug),data);
}
export async function removeCamera(slug:string){await deleteDoc(doc(db,'cameras',slug));}
export async function seedCameras(){
 const snap=await getDocs(cameraCollection);
 if(!snap.empty)throw new Error('Database already has camera records. Import cancelled to prevent overwrites.');
 for(const camera of starter)await saveCamera(camera);
}
