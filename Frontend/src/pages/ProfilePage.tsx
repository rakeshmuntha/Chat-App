import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { authUser, updateProfile } = context;

    const [selectedImg, setselectedImg] = useState<File | null>(null);
    const navigate = useNavigate();
    const [name, setname] = useState(authUser?.fullName || "Rakesh");
    const [bio, setbio] = useState(authUser?.bio || "Hi i am Alive")

    const handleChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) setselectedImg(file);
    }

    const handlesumbit = async (e: any) => {
        e.preventDefault();
        if (!selectedImg) {
            updateProfile({ fullName: name, bio })
            navigate('/');
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onload = async () => {
            const base64img = reader.result;
            updateProfile({ profilePic: base64img, fullName: name, bio });
            navigate('/');
        }
    }

    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
            <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
                <form onSubmit={handlesumbit} className='flex flex-col gap-5 p-11 flex-1'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-2xl'>Profile details</h3>
                        <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className='w-6 h-6 cursor-pointer' onClick={() => navigate('/login')}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"></path>
                        </svg>
                    </div>
                    <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md border border-white/20 hover:border-white/40 hover:bg-white/5 transition'>
                        <input onChange={handleChange} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
                        <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="avatar" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
                        <p className='text-sm'>Upload Profile Image</p>
                    </label>
                    <input onChange={(e) => setname(e.target.value)} value={name} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
                    <textarea onChange={(e) => setbio(e.target.value)} value={bio} required placeholder='Write profile bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
                    <button type='submit' className='p-2 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-full cursor-pointer'>Save</button>
                </form>
                <img src={authUser?.profilePic || 'https://m.media-amazon.com/images/G/01/digital/AVATARS/LTUM_2024_PVProfileImageCircle_256x256_Sauron_Purple.png'} className={`max-w-44 aspect-square mx-10 max-sm:mt-10 ${authUser?.profilePic && "rounded-full"}`} alt="" />
            </div>
            {/* 'https://m.media-amazon.com/images/G/01/digital/AVATARS/LTUM_2024_PVProfileImageCircle_256x256_Sauron_Purple.png' */}

        </div>
    )
}

export default ProfilePage