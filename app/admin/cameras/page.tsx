import type {Metadata} from 'next';
import AdminGate from '@/components/AdminGate';
import CameraManager from '@/components/CameraManager';
export const metadata:Metadata={title:'Camera management',robots:{index:false,follow:false}};
export default function Page(){return <AdminGate><CameraManager/></AdminGate>}
