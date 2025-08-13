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
    const { logout, onlineUsers, authUser } = context;
    const navigate = useNavigate();

    const [input, setinput] = useState<String | null>(null);
    const [showSettings, setShowSettings] = useState(false); // for click toggle

    const filteredUsers = input
        ? users.filter((user: any) => user.fullName.toLowerCase().includes(input.toLowerCase()))
        : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers]);

    return (
        <div className={`bg-[#8185B2]/10 h-full p-5 rounded-xl overflow-y-scroll text-white flex flex-col justify-between ${selectedUser ? 'max-md:hidden' : ''}`}>
            {/* Top section */}
            <div>
                <div className='pb-5'>
                    <div className="flex justify-between items-center">
                        <img src={assets.logo} alt="logo" className='max-w-40' />
                        <img
                            src={authUser?.profilePic || 'https://m.media-amazon.com/images/G/01/digital/AVATARS/LTUM_2024_PVProfileImageCircle_256x256_Sauron_Purple.png'}
                            alt="profile_martin"
                            className='w-9 h-9 rounded-full cursor-pointer'
                            onClick={() => navigate('/profile')}
                        />
                    </div>

                    <div className='flex gap-4 p-3 mt-4 rounded-full bg-[#282142]/50'>
                        <img src={assets.search_icon} alt="search" className='w-4' />
                        <input
                            type="text"
                            onChange={e => setinput(e.target.value)}
                            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
                            placeholder='Search User..'
                        />
                    </div>
                </div>

                <div className='flex flex-col'>
                    {filteredUsers.map((user: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => {
                                setselectedUser(user);
                                setunseenMessages((prev: any) => ({ ...prev, [user._id]: 0 }));
                            }}
                            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}
                        >
                            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
                            <div className="flex flex-col leading-5">
                                <p>{user.fullName}</p>
                                {onlineUsers && onlineUsers.includes(user._id) ? (
                                    <span className='text-green-400 text-xs'>Online</span>
                                ) : (
                                    <span className='text-neutral-400 text-xs'>Offline</span>
                                )}
                            </div>
                            {unseenMessages[user._id] > 0 && (
                                <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                                    {unseenMessages[user._id]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom settings */}
            <div className='relative'>

                {showSettings && (
                    <div className='flex items-center bottom-full right-0 z-20 w-32 p-3 mb-2 rounded-2xl bg-[#282142] border border-gray-600 text-gray-100 cursor-pointer hover:bg-[#382d60]' onClick={() => logout()}>
                        <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 4L18 4C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H14M3 12L15 12M3 12L7 8M3 12L7 16" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <p className='text-sm ml-2'>
                            Logout
                        </p>
                    </div>
                )}
                <div className='flex gap-1 items-center hover:text-purple-400'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 cursor-pointer"
                        onClick={() => setShowSettings(prev => !prev)}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <p className='cursor-pointer text-sm' onClick={() => setShowSettings(prev => !prev)}>Settings</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar