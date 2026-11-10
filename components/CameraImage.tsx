'use client';
import {useEffect,useState} from 'react';
import type {Camera} from '@/lib/data';
export default function CameraImage({camera,large=false}:{camera:Camera & {imageUrl?:string};large?:boolean}){
 const [failed,setFailed]=useState(false);
 const src=camera.imageUrl?.trim() || `/images/cameras/${camera.slug}.webp`;
 useEffect(()=>setFailed(false),[src]);
 return <div className={`camera-art relative flex items-center justify-center overflow-hidden ${large?'rounded-2xl min-h-80 lg:min-h-[430px]':'min-h-52'}`}>
 {!failed?<img src={src} alt={`${camera.name} product photograph`} loading={large?'eager':'lazy'} onError={()=>setFailed(true)} className="absolute inset-0 z-10 w-full h-full object-contain p-6"/>:<div className="text-center p-8"><div className="text-5xl mb-3" aria-hidden="true">📷</div><p className="font-bold">{camera.name}</p><p className="text-xs opacity-70 mt-1">Product photo coming soon</p></div>}
 </div>
}
