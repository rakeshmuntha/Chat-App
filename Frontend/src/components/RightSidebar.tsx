import { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
    const Chatcontext = useContext(ChatContext);
    if (!Chatcontext) throw new Error("ChatContext is missing. Make sure App is wrapped in AuthProvider.");
    const { selectedUser, messages, toggleRightSideBar } = Chatcontext;

    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { onlineUsers, logout } = context;
    const [msgImages, setmsgImages] = useState([]);

    // Get all the images from the messages and set them to state
    useEffect(() => {
        setmsgImages(
            messages.filter((msg: any) => msg.image).map((msg: any) => msg.image));
    }, [messages])

    return selectedUser && (
        // user profile
        <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? 'max-md:hidden' : 'hidden'}`}>
            <div className='flex justify-end m-7'>
                <svg onClick={() => toggleRightSideBar()} className="w-8 h-8 cursor-pointer hover:bg-gray-600 rounded-full p-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"></path>
                </svg>
            </div>

            <div className='flex flex-col items-center gap-2 text-xs font-light mx-auto'>
                <img src={selectedUser?.profilePic || assets.avatar_icon} onClick={() => window.open(selectedUser?.profilePic || assets.avatar_icon)} alt="profilepic" className='w-20 aspect-[1/1] rounded-full cursor-pointer' />

                <h1 className='px-11 text-2xl font-medium mx-auto flex items-center gap-2'>
                    {onlineUsers && onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
                    {selectedUser?.fullName}
                </h1>

                <p className='text-center text-sm opacity-90'>{selectedUser?.bio}</p>
            </div>

            <hr className='border-[#ffffff50] my-4' />

            <div className='px-5 text-base'>
                {/* displaying all the images in the chat */}
                <p>Media</p>
                <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                    {msgImages.map((url, index) =>
                        <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded'>
                            <img src={url} className='h-full rounded-md' alt="image" />
                        </div>
                    )}
                </div>
            </div>
            {/* logout button */}
            <button onClick={() => logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
                logout
            </button>
        </div>
    )
}

export default RightSidebar