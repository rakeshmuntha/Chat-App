import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { authUser, updateProfile, logout } = context;

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
            {/* className="p-2 w-full border-[1px] border-[#513e21] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#513e21]" */}


            <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-1 bg-white/3 border-gray-500 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>

                {/* logout button */}
                <button
                    onClick={() => logout()}
                    className='absolute top-4 right-2 fle flex-col items-center justify-center gap-2 bg-transparent hover:bg-gray-700/30 p-2 rounded-full group'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
                </button>

                <form onSubmit={handlesumbit} className='flex flex-col gap-5 p-11 flex-1'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-2xl'>
                            Profile details
                        </h3>
                        <svg onClick={() => navigate('/login')} className="w-8 h-8 cursor-pointer hover:bg-gray-600 rounded-full p-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"></path>
                        </svg>
                    </div>

                    <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md border border-white/20 hover:border-white/40 hover:bg-white/5 transition'>
                        <input onChange={handleChange} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
                        <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="avatar" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
                        <p className='text-sm'>Upload Profile Image</p>
                    </label>

                    <input onChange={(e) => setname(e.target.value)} value={name} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#513e21]' />
                    <textarea onChange={(e) => setbio(e.target.value)} value={bio} required placeholder='Write profile bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#513e21]' rows={4}></textarea>
                    <button type='submit' className='p-2 bg-[#d49736] text-black border-none text-sm rounded-full cursor-pointer hover:bg-[#d49736]/90'>Save</button>
                </form>

                {/* image */}
                <div>
                    <img
                        src={authUser?.profilePic || assets.avatar_icon}
                        className={`max-w-44 aspect-square mx-10 max-sm:mt-10 ${authUser?.profilePic && "rounded-full"}`}
                        alt=""
                    />
                </div>
            </div>
            {/* 'https://m.media-amazon.com/images/G/01/digital/AVATARS/LTUM_2024_PVProfileImageCircle_256x256_Sauron_Purple.png' */}

        </div>
    )
}

export default ProfilePage