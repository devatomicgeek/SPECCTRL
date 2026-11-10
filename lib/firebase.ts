import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyCfl1mlcJP-rSOtotmcT_gsE8EPVgdo-GM',
  authDomain: 'specctrl-7c69f.firebaseapp.com',
  projectId: 'specctrl-7c69f',
  storageBucket: 'specctrl-7c69f.firebasestorage.app',
  messagingSenderId: '263131080867',
  appId: '1:263131080867:web:ab73399b48fc0e9f427716',
};
export const ADMIN_UID = 'GaHncpEvYkXIGxtJJOCYFjbWGZH2';
const app = getApps().length ? getApp() : initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
