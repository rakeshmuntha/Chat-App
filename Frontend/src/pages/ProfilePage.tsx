import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const ProfilePage = () => {
    const [selectedImg, setselectedImg] = useState<File | null>(null);
    const navigate = useNavigate();
    const [name, setname] = useState("Rakesh");
    const [bio, setbio] = useState("Hi Every one, i am using chit chat")

    const handleChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) setselectedImg(file);
    }

    const handlesumbit = async (e: any) => {
        e.preventDefault();
        navigate('/');
    }

    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
            <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
                <form onSubmit={handlesumbit} className='flex flex-col gap-5 p-10 flex-1'>
                    <h3 className='text-lg'>Profile details</h3>
                    <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
                        <input onChange={handleChange} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
                        <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="avatar" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
                        Upload Profile Image
                    </label>
                    <input onChange={(e) => setname(e.target.value)} value={name} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
                    <textarea onChange={(e) => setbio(e.target.value)} value={bio} required placeholder='Write profile bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
                    <button type='submit' className='p-2 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-full cursor-pointer'>Save</button>
                </form>
                <img src={assets.logo_icon} className='max-w-44 aspect-square mx-10 max-sm:mt-10' alt="" />
            </div>

        </div>
    )
}

export default ProfilePage