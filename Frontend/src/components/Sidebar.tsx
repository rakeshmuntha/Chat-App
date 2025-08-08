import { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

    const Chatcontext = useContext(ChatContext);
    if (!Chatcontext) throw new Error("ChatContext is missing. Make sure App is wrapped in AuthProvider.");
    const { getUsers, users, selectedUser, setselectedUser, unseenMessages, setunseenMessages } = Chatcontext;


    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { logout, onlineUsers } = context;
    const navigate = useNavigate();

    const [input, setinput] = useState<String | null>(null);
    const filteredUsers = input ? users.filter((user: any) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
      getUsers();
    }, [onlineUsers])
    


    return (
        <div className={`bg-[#8185B2]/10 h-full p-5 rounded-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
            <div className='pb-5'>
                <div className="flex justify-between items-center">

                    <img src={assets.logo} alt="logo" className='max-w-40' />
                    <div className='relative py-2 group'>
                        <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer' />
                        <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                            <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                            <hr className='my-2 border-t border-grey-500'></hr>
                            <p onClick={() => logout()} className='cursor-pointer text-sm'>Logout</p>
                        </div>
                    </div>
                </div>

                <div className='flex gap-4 p-3 mt-4 rounded-full bg-[#282142]/50'>
                    <img src={assets.search_icon} alt="search" className='w-4' />
                    <input type="text" onChange={e => setinput(e.target.value)} className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User..' />
                </div>
            </div>

            <div className='flex flex-col'>
                {filteredUsers.map((user: any, index: number) => (
                    <div key={index} onClick={() => {setselectedUser(user); setunseenMessages((prev: any) => ({...prev, [user._id]: 0}))}} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                        <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
                        <div className="flex flex-col leading-5">
                            <p>{user.fullName}</p>
                            {onlineUsers && onlineUsers.includes(user._id) ? <span className='text-green-400 text-xs'>Online</span> : <span className='text-neutral-400 text-xs'>Offline</span>}
                        </div>
                        <div>
                            {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar