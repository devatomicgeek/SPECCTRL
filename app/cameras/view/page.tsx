import {Suspense} from 'react';
import CameraViewer from '@/components/CameraViewer';
export default function Page(){return <Suspense fallback={<main className="p-10">Loading camera…</main>}><CameraViewer/></Suspense>}
