import CameraDetail from '@/components/CameraDetail';
import {cameras} from '@/lib/data';
export function generateStaticParams(){return cameras.map(c=>({slug:c.slug}))}
export default function Page({params}:{params:{slug:string}}){return <CameraDetail slug={params.slug}/>}
