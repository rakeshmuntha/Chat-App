import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { AnonymousContext } from '../../context/AnonymousContext'
import { useNavigate } from 'react-router-dom'

const AnonymousSidebar = () => {
    const navigate = useNavigate();
    const Chatcontext = useContext(ChatContext);
    if (!Chatcontext) throw new Error("ChatContext is missing. Make sure App is wrapped in AuthProvider.");

    const AC = useContext(AnonymousContext);
    if (!AC) throw new Error("AnonymousContext is missing. Make sure App is wrapped in AuthProvider.");
    const { paired, leaveChat, buttonClick, queueCount } = AC;


    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");

    const [showSettings, setShowSettings] = useState(false); // for click toggle

    return (
        <div className={`bg-black border-r border-[#2f2d2d] h-full p-5 overflow-y-scroll text-white flex flex-col justify-between ${paired ? 'max-md:hidden' : ''}`}>
            {/* Top section */}
            <div>
                <div className='pb-5'>
                    <div className="flex justify-between items-center">

                        <div className='flex items-center gap-2'>
                            {/* logo dude */}
                            <div className='rounded-xl size-12 flex items-center justify-center bg-[#728bb5]/17 hover:bg-[#728bb5]/20'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square w-7 max-w-full h-7 text-[#edecec]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <h2 className='text-[#c88f33] font-sans font-semibold text-xl logo'>Blink Chat</h2>
                        </div>
                    </div>
                </div>
            </div>
            {paired && <div className='flex flex-col items-center justify-center text-center w-full'>

                <h2 className='text-xl logo'>Now you are Chatting</h2>
                <h2 className='text-xl logo'>with a</h2>
                <h2 className='text-xl logo'>Anonymous User</h2>
            </div>}

            {!paired && (
                <div className="flex flex-col items-center justify-center text-center w-full">

                    <button onClick={buttonClick} className="mb-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer hover:text-[#c88f33]/90 text-sm text-[#c88f33] ">
                        <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
                        <p className='text-base'>New Chat</p>
                    </button>

                    <h2 className="text-xl logo">Please wait while we</h2>
                    <h2 className="text-xl logo">map you with a</h2>
                    <h2 className="text-xl logo">Anonymous User</h2>
                </div>
            )}

            {/* Bottom settings */}
            <div className='relative'>
                {showSettings && (
                    <div className='flex items-center bottom-full z-20 w-32 p-3 mb-2 rounded-2xl bg-[#0e0b17] border border-gray-600 text-gray-100 absolute cursor-pointer hover:bg-[#1e1c23]' onClick={() => { leaveChat(); navigate('/'); }}>
                        <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 4L18 4C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H14M3 12L15 12M3 12L7 8M3 12L7 16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <p className='text-sm ml-2'>
                            Leave chat
                        </p>
                    </div>
                )}
                <div className='flex flex-wrap gap-1 justify-between text-[#c88f33] items-center hover:text-[#a77320]'>
                    <div className='flex justify-center items-center'>
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


                    <div className='flex justify-center gap-1 items-center'>
                        <span className='w-2 h-2 rounded-full bg-green-500'></span><p className='text-white/60 text-sm'>{queueCount} online</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnonymousSidebar;