import type {Metadata} from 'next';
import AdminGate from '@/components/AdminGate';
import AdminOverview from '@/components/AdminOverview';
export const metadata:Metadata={title:'Admin console',robots:{index:false,follow:false}};
export default function AdminPage(){return <AdminGate><AdminOverview/></AdminGate>}
