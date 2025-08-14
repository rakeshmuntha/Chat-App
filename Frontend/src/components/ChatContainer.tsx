import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets';
import formatMessageTime from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import EmojiPicker, { Theme } from "emoji-picker-react";


const ChatContainer = () => {

    const scrollEnd = useRef<HTMLDivElement | null>(null);
    const Chatcontext = useContext(ChatContext);
    if (!Chatcontext) throw new Error("ChatContext is missing. Make sure App is wrapped in AuthProvider.");
    const { messages, sendMessage, getMessages, selectedUser, setselectedUser, toggleRightSideBar } = Chatcontext;


    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { authUser, onlineUsers } = context;

    const [input, setinput] = useState("");
    const [showPicker, setShowPicker] = useState(false);

    const textInput = document.getElementById("myInput");

    // Focus the input whenever any key is pressed
    window.addEventListener("keydown", (event) => {
        // Prevent focusing when special keys like Tab, Shift, etc., are pressed
        if (event.key.length === 1 || event.key === "Backspace") {
            if (textInput) textInput.focus();
        }
    });

    // Handle sending a message
    const handleSendMessage = async (e: any) => {
        e.preventDefault();
        const text = input.trim();
        if (text === "") return null;
        setinput("");
        await sendMessage({ text });
    }

    // Adding Emoji
    const onEmojiClick = (emojiData: any) => {
        setinput((prev) => prev + emojiData.emoji);
        setShowPicker(false);
    };

    // Handle sending a image
    const handleSendImage = async (e: any) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("select an image file");
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessage({ image: reader.result });
            e.target.value = "";
        }
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (selectedUser) getMessages(selectedUser._id);
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
            <div className='flex items-center gap-3 py-3 mx-3 border-b border-stone-500'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile_martin" className='w-8 h-8 rounded-full cursor-pointer' onClick={() => toggleRightSideBar()} />
                <p className='flex-1 text-lg text-white flex items-center gap-2 cursor-pointer' onClick={() => toggleRightSideBar()}>
                    {selectedUser.fullName}
                    {onlineUsers && onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                </p>
                <svg onClick={() => setselectedUser(null)} className="w-8 h-8 md:hidden max-w-9  cursor-pointer hover:bg-gray-600 rounded-full p-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"></path>
                </svg>
                {/* <img onClick={() => setselectedUser(null)} src={assets.arrow_icon} alt="arrow_icon" className='md:hidden max-w-9 cursor-pointer hover:bg-gray-600 rounded-full p-1' /> */}
                {/* <img src={assets.help_icon} alt="help_icon" className='max-md:hidden max-w-5 cursor-pointer' onClick={() => toggleRightSideBar()}/> */}
            </div>

            {/* Chat Area */}
            <div className='flex flex-col h-[calc(100% - 120px)] overflow-y-scroll p-3 mb-14'>
                {messages.map((msg: any, index: number) =>
                    <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser?._id && 'flex-row-reverse'}`}>
                        {/* if image display image or display text */}
                        {msg.image ? (<img src={msg.image} onClick={() => window.open(msg.image)} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 cursor-pointer' />
                        ) : <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all ${msg.senderId === authUser?._id ? 'rounded-br-none bg-[#f0f0ffed] text-black' : 'rounded-bl-none bg-violet-700/90 text-white'}`}>{msg.text}</p>}
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
                    <input id='myInput' onChange={(e) => setinput(e.target.value)} value={input} onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null} type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />
                    <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />

                    <button
                        type="button"
                        onClick={() => setShowPicker((prev) => !prev)}
                        className="mr-3 text-gray-500 hover:text-black cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-emoji-smile text-white font-bold" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                        </svg>
                    </button>

                    <label htmlFor='image'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white size-5.5 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                        </svg>

                        {/* <img src={assets.gallery_icon} alt="gallery-icon" className='w-4 mr-2 cursor-pointer' /> */}
                    </label>
                
                    {showPicker && (
                        <div className="absolute bottom-12 right-0 bg-white shadow-lg border rounded-lg z-10 ">
                            <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
                {/* <img src={assets.send_button} onClick={handleSendMessage} alt='send_button' className='w-8 cursor-pointer' /> */}

                <button className='rounded-full p-2 cursor-pointer hover:bg-gray-700' onClick={handleSendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-send text-white"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                </button>
            </div>
        </div >
    ) : (
        // if no user is selected display logo
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden '>
            <img src={assets.logo_icon} className='max-w-16' alt="logo_icon" />
            <p className='text-lg font-medium text-white'>Chat AnyTime AnyWhere</p>
        </div>
    )
}

export default ChatContainer