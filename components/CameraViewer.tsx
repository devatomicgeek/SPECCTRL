'use client';
import {useSearchParams} from 'next/navigation';
import CameraDetail from './CameraDetail';
export default function CameraViewer(){const params=useSearchParams();return <CameraDetail slug={params.get('slug')||''}/>}
