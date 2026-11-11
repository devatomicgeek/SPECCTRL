import {auth} from './firebase';
import {MEDIA_API} from './mediaApi';
export async function requestSiteDeployment():Promise<void>{
 const user=auth.currentUser;
 if(!user)throw new Error('Administrator sign-in is required to deploy.');
 const token=await user.getIdToken();
 const response=await fetch(`${MEDIA_API}/deploy`,{method:'POST',headers:{Authorization:`Bearer ${token}`}});
 const body=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(body.error||`Deployment request failed (${response.status})`);
}
