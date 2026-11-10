'use client';
import {useEffect,useMemo,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {cameras} from '@/lib/data';
import {subscribeCameras,type ManagedCamera} from '@/lib/cameraStore';
import CameraCard from './CameraCard';
export default function Catalog(){
 const params=useSearchParams();const[q,setQ]=useState('');const[format,setFormat]=useState(params.get('format')||'All');const[brand,setBrand]=useState('All');const[sort,setSort]=useState('name');
 const [rows,setRows]=useState<ManagedCamera[]>(cameras.map(c=>({...c,status:'published'})));
 const [notice,setNotice]=useState('');
 useEffect(()=>subscribeCameras(false,docs=>{if(docs.length){setRows(docs);setNotice('');}else{setRows(cameras.map(c=>({...c,status:'published'})));setNotice('Showing starter catalog. Admin can import cameras to Firestore.');}},()=>{setNotice('Live catalog unavailable; showing built-in camera data.');}),[]);
 const brands=Array.from(new Set(rows.map(c=>c.brand))).sort();
 const list=useMemo(()=>rows.filter(c=>(format==='All'||c.format===format)&&(brand==='All'||c.brand===brand)&&[c.name,c.best,c.summary,c.mount].join(' ').toLowerCase().includes(q.toLowerCase())).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='photo'?b.photo-a.photo:b.videoScore-a.videoScore),[rows,q,format,brand,sort]);
 return <><div className="panel p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"><label><span className="text-xs font-bold">Search cameras</span><input className="input mt-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Model, use case, mount..."/></label><label><span className="text-xs font-bold">Sensor format</span><select className="input mt-2" value={format} onChange={e=>setFormat(e.target.value)}><option>All</option><option>APS-C</option><option>Full frame</option></select></label><label><span className="text-xs font-bold">Brand</span><select className="input mt-2" value={brand} onChange={e=>setBrand(e.target.value)}>{['All',...brands].map(x=><option key={x}>{x}</option>)}</select></label><label><span className="text-xs font-bold">Sort</span><select className="input mt-2" value={sort} onChange={e=>setSort(e.target.value)}><option value="name">Name</option><option value="photo">Photography focus*</option><option value="video">Video focus*</option></select></label></div>{notice&&<p className="muted text-xs mb-3">{notice}</p>}<p className="muted text-sm mb-5">{list.length} camera{list.length===1?'':'s'} · *Editorial sorting is illustrative, not tested scores.</p><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{list.map(c=><CameraCard key={c.slug} camera={c}/>)}</div>{!list.length&&<div className="panel p-10 text-center">No cameras match these filters.</div>}</>;
}
