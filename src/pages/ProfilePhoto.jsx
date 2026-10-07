import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { storeFile,fileUrl } from '../data/files';
import { updateDoc } from '../backend/profiles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function ProfilePhoto() {
  const {user,profile}=useAuth();
  const [preview,setPreview]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  useEffect(()=>{
    let active=true;
    async function load() {
      if (!profile?.profilePhotoPath) return;
      try {const url=await fileUrl(profile.profilePhotoPath);if(active)setPreview(url);}
      catch(issue){if(active)setError(issue.message);}
    }
    load();const timer=setInterval(load,240000);
    return()=>{active=false;clearInterval(timer);};
  },[profile?.profilePhotoPath]);
  async function upload(event) {
    const file=event.target.files?.[0];if(!file)return;
    event.target.value='';setBusy(true);setError('');
    try {
      if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPEG, PNG, or WebP image.');
      const stored=await storeFile(file);
      await updateDoc({id:user.uid},{profilePhotoPath:stored.storagePath});
      setPreview(await fileUrl(stored.storagePath));
    }catch(issue){setError(issue.message || 'Photo upload failed.');}
    finally{setBusy(false);}
  }
  return <><Navbar/><main className="profile-photo-page"><div className="profile-photo-container"><h1>Profile photo</h1>{preview?<img src={preview} alt="Your profile" style={{width:160,height:160,borderRadius:'50%',objectFit:'cover'}}/>:<div className="profile-avatar">{(profile?.name || 'C').charAt(0).toUpperCase()}</div>}{error&&<p role="alert">{error}</p>}<label htmlFor="profile-photo">Upload a photo (JPEG, PNG, or WebP; up to 10 MB)</label><input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={upload}/>{busy&&<p role="status">Uploading…</p>}<p><Link to="/dashboard">Return to dashboard</Link></p></div></main><Footer/></>;
}
