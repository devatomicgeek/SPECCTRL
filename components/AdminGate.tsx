"use client";
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth, ADMIN_UID } from '@/lib/firebase';
import Link from 'next/link';
import { LayoutDashboard, Camera, FileText, Images, GitCompareArrows, Link2, Settings, LogOut, LockKeyhole } from 'lucide-react';

const sections = [
  {label:'Overview', icon:LayoutDashboard, href:'/admin/'},
  {label:'Cameras', icon:Camera, href:'/admin/#cameras'},
  {label:'Media Library', icon:Images, href:'/admin/#media'},
  {label:'Articles', icon:FileText, href:'/admin/#articles'},
  {label:'Comparisons', icon:GitCompareArrows, href:'/admin/#comparisons'},
  {label:'Affiliate Links', icon:Link2, href:'/admin/#affiliates'},
  {label:'Settings', icon:Settings, href:'/admin/#settings'},
];
export default function AdminGate({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null);
 const [loading,setLoading]=useState(true);
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);setLoading(false)}),[]);
 async function login(e:FormEvent){e.preventDefault();setError('');setBusy(true);try{const credential=await signInWithEmailAndPassword(auth,email,password);if(credential.user.uid!==ADMIN_UID){await signOut(auth);setError('This account is not authorized to administer SPECCTRL.');}}catch{setError('Unable to sign in. Check your email, password and Firebase Authentication settings.')}finally{setBusy(false);setPassword('')}}
 if(loading)return <main className="adminCenter"><p className="muted">Checking administrator access…</p></main>;
 if(!user||user.uid!==ADMIN_UID)return <main className="adminCenter"><div className="panel adminLogin"><div className="adminIcon"><LockKeyhole size={25}/></div><div className="tag">SECURE WORKSPACE</div><h1 className="text-3xl font-black mt-3 mb-2">SPEC<span className="blue">CTRL.</span> Admin</h1><p className="muted mb-7">Sign in with your authorized Firebase administrator account.</p><form onSubmit={login} className="space-y-4"><label className="block text-sm font-bold">Email<input className="input mt-2" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="block text-sm font-bold">Password<input className="input mt-2" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="adminError">{error}</p>}<button className="btn w-full" type="submit" disabled={busy}>{busy?'Signing in…':'Sign in securely'}</button></form><p className="text-xs muted mt-6">Access is restricted to the configured admin UID. Never share your password.</p></div></main>;
 return <div className="adminWrap"><aside className="adminSidebar"><Link href="/admin/" className="text-xl font-black tracking-tight block mb-2">SPEC<span className="blue">CTRL.</span></Link><div className="tag mb-7">ADMIN CONSOLE / 0.2.0</div><nav aria-label="Admin sections" className="adminNav">{sections.map((s,i)=><a key={s.label} className={i===0?'active':''} href={s.href}><s.icon size={18}/>{s.label}</a>)}</nav><div className="adminSidebarBottom"><div className="text-xs muted break-all mb-3">{user.email}</div><button className="btnOutline w-full gap-2" onClick={()=>signOut(auth)}><LogOut size={16}/> Sign out</button></div></aside><div className="adminContent">{children}</div></div>;
}
