import CameraImage from './CameraImage';
import Link from 'next/link';
import type {Camera} from '@/lib/data';
export default function CameraCard({camera}:{camera:Camera & {imageUrl?:string}}){
 const href='/cameras/view/?slug='+encodeURIComponent(camera.slug);
 return <article className="panel overflow-hidden"><Link href={href}><CameraImage camera={camera}/></Link><div className="p-5"><p className="tag">{camera.format} · {camera.brand}</p><Link href={href}><h3 className="font-extrabold text-xl mt-2">{camera.name}</h3></Link><p className="muted text-sm mt-2 leading-relaxed">{camera.summary}</p><div className="flex flex-wrap gap-2 mt-4"><span className="pill">{camera.mp}</span><span className="pill">{camera.best}</span></div><div className="flex justify-between items-center mt-5"><Link href={href} className="font-bold text-sm blue">Explore specs →</Link><Link href={'/compare/?a='+camera.slug} className="text-xs font-bold btnOutline">Compare</Link></div></div></article>
}
