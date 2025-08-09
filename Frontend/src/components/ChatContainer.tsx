import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets';
import formatMessageTime from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {

    const scrollEnd = useRef<HTMLDivElement | null>(null);
    const Chatcontext = useContext(ChatContext);
    if (!Chatcontext) throw new Error("ChatContext is missing. Make sure App is wrapped in AuthProvider.");
    const { messages, sendMessage, getMessages, selectedUser, setselectedUser, toggleRightSideBar } = Chatcontext;


    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { authUser, onlineUsers } = context;

    const [input, setinput] = useState("");

    // Handle sending a message
    const handleSendMessage = async (e: any) => {
        e.preventDefault();
        const text = input.trim();
        if(text === "") return null;
        setinput("");
        await sendMessage({text});
    }

    // Handle sending a image
    const handleSendImage = async (e: any) => {
        const file = e.target.files[0];
        if(!file || !file.type.startsWith("image/")) {
            toast.error("select an image file");
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessage({image: reader.result});
            e.target.value = "";
        }
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if(selectedUser) getMessages(selectedUser._id);
    }, [selectedUser])

    useEffect(() => {
        if (scrollEnd.current && messages) {
            // this will scroll this image upto this div
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg p-2 flex flex-col '>
            {/* Header */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile_martin" className='w-8 h-8 rounded-full' />
                <p className='flex-1 text-lg text-white flex items-center gap-2'>
                    {selectedUser.fullName}
                    {onlineUsers && onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                </p>
                <img onClick={() => setselectedUser(null)} src={assets.arrow_icon} alt="arrow_icon" className='md:hidden max-w-7' />
                <img src={assets.help_icon} alt="help_icon" className='max-md:hidden max-w-5 cursor-pointer' onClick={() => toggleRightSideBar()}/>
            </div>

            {/* Chat Area */}
            <div className='flex flex-col h-[calc(100% - 120px)] overflow-y-scroll p-3 mb-14'>
                {messages.map((msg: any, index: number) =>
                    <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser?._id && 'flex-row-reverse'}`}>
                        {/* if image display image or display text */}
                        {msg.image ? (<img src={msg.image} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
                        ) : <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser?._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>}
                        {/* display the user logo */}
                        <div className="text-center text-xs">
                            <img src={msg.senderId === authUser?._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="avatar" className='w-7 h-7 rounded-full' />
                            <p className='text-gray-500'>
                                {formatMessageTime(msg.createdAt)}
                            </p>
                        </div>
                    </div>
                )}

                <div ref={scrollEnd}>{/*just to autoscroll upto here*/}</div>
            </div>
            {/* bottom area message sending area */}
            <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-blend-darken'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input onChange={(e) => setinput(e.target.value)} value={input} onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null} type="text" placeholder='send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />
                    <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
                    <label htmlFor='image'>
                        <img src={assets.gallery_icon} alt="gallery-icon" className='w-4 mr-2 cursor-pointer' />
                    </label>
                </div>
                <img src={assets.send_button} onClick={handleSendMessage} alt='send_button' className='w-8 cursor-pointer' />
            </div>
        </div>
    ) : (
        // if no user is selected display logo
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden '>
            <img src={assets.logo_icon} className='max-w-16' alt="logo_icon" />
            <p className='text-lg font-medium text-white'>Chat AnyTime AnyWhere</p>
        </div>
    )
}

export default ChatContainer