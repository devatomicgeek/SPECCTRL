import type {Metadata} from 'next';
import AdminGate from '@/components/AdminGate';
import MediaLibrary from '@/components/MediaLibrary';
export const metadata:Metadata={title:'Media library | SPECCTRL',robots:{index:false,follow:false}};
export default function Page(){return <AdminGate><MediaLibrary/></AdminGate>}
