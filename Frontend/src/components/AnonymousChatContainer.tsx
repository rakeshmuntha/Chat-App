import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets';
import toast from 'react-hot-toast';
import EmojiPicker, { Theme } from "emoji-picker-react";
import { AnonymousContext } from '../../context/AnonymousContext';
import { useNavigate } from 'react-router-dom';


const ChatContainer = () => {

    const scrollEnd = useRef<HTMLDivElement | null>(null);
    const AC = useContext(AnonymousContext);
    if (!AC) throw new Error("AnonymousContext is missing. Make sure App is wrapped in AuthProvider.");
    const { socket, paired, messages, input, setInput, sendMessage, leaveChat, partnerName, buttonClick } = AC;

    const navigate = useNavigate();

    const [showPicker, setShowPicker] = useState(false);
    const [showExitButton, setshowExitButton] = useState(false);

    const textInput = document.getElementById("myInput");

    // Focus the input whenever any key is pressed
    window.addEventListener("keydown", (event) => {
        // Prevent focusing when special keys like Tab, Shift, etc., are pressed
        if (event.key.length === 1 || event.key === "Backspace") {
            if (textInput) textInput.focus();
        }
    });

    // Adding Emoji
    const onEmojiClick = (emojiData: any) => {
        setInput((prev) => prev + emojiData.emoji);
        setShowPicker(false);
    };

    useEffect(() => {
        if (scrollEnd.current) {
            // this will scroll this image upto this div
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    return paired ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg p-2 flex flex-col '>
            {/* Header */}
            <div className='flex items-center gap-3 py-3 mx-3 border-b border-[#2f2d2d]'>
                <img src={assets.avatar_icon} alt="profile_martin" className='w-8 h-8 rounded-full cursor-pointer' />
                <p className='flex-1 text-lg text-white flex items-center gap-2 cursor-pointer'>
                    {partnerName}
                    <span className='w-2 h-2 rounded-full bg-green-500'></span>
                </p>



                <button onClick={buttonClick} className=" max-md:hidden rounded-lg flex items-center justify-center gap-1 cursor-pointer hover:text-[#c88f33]/90 text-sm text-[#c88f33] ">
                    <svg stroke="currentColor" fill="none" stroke-width="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
                    <p className='text-base'>New Chat</p>
                </button>

                {/* TODO back button in small screen */}
                <svg className="w-8 h-8 md:hidden max-w-9  cursor-pointer hover:bg-gray-600 rounded-full p-1 text-gray-800 dark:text-white" onClick={() => setshowExitButton(!showExitButton)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"></path>
                </svg>

                {showExitButton && <div className='absolute md:hidden flex flex-col bg-white/60 right-0 top-17 cursor-pointer rounded-lg px-5 py-3'>
                    <button className='cursor-pointer py-2 px-2 rounded-lg hover:bg-white/50' onClick={() => { leaveChat(); navigate('/'); }}>
                        Leave Chat
                    </button>
                    <button className='cursor-pointer py-2 px-2 flex items-center justify-center gap-1 rounded-lg hover:bg-white/50' onClick={buttonClick}>
                        <svg stroke="currentColor" fill="none" stroke-width="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
                        New Chat
                    </button>
                </div>}

                {/* <img onClick={() => setselectedUser(null)} src={assets.arrow_icon} alt="arrow_icon" className='md:hidden max-w-9 cursor-pointer hover:bg-gray-600 rounded-full p-1' /> */}
                {/* <img src={assets.help_icon} alt="help_icon" className='max-md:hidden max-w-5 cursor-pointer' onClick={() => toggleRightSideBar()}/> */}
            </div>


            {/* chatcontainter */}
            <div className='flex flex-col h-[calc(100% - 120px)] overflow-y-scroll p-3 mb-14'>
                {messages.map((msg: any, index: number) => {
                    const isMe = msg.senderSocketId === socket?.id;
                    return (
                        <div key={index} className={`flex items-end gap-2 justify-end ${!isMe && 'flex-row-reverse'}`}>
                            {/* if image display image or display text */}
                            {msg.image ? (<img src={msg.image} onClick={() => window.open(msg.image)} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 cursor-pointer' />
                            ) : <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all ${isMe ? 'rounded-br-none bg-white text-black' : 'rounded-bl-none bg-[#d49736] text-black'}`}>{msg.text}</p>}
                            {/* display the user logo */}
                            <div className="text-center text-xs">
                                <img src={isMe ? assets.you : assets.avatar_icon} alt="avatar" className='w-7 h-7 rounded-full' />
                                <p className='text-gray-500'>
                                    {msg.createdAt.substring(0, 5) ? new Date(msg.createdAt).toLocaleTimeString().substring(0, 5) : ""}
                                </p>
                            </div>
                        </div>
                    )
                }
                )}

                <div ref={scrollEnd}>{/*just to autoscroll upto here*/}</div>
            </div>


            {/* bottom area message sending area */}
            <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-2 bg-blend-darken border-t border-white/8'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input id='myInput' onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null} type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />

                    {/* emoji buttion */}
                    <button
                        type="button"
                        onClick={() => setShowPicker((prev) => !prev)}
                        className="mr-3 text-gray-500 hover:text-black cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-emoji-smile text-white font-bold" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                        </svg>
                    </button>

                    {/* gallery icon */}
                    <label htmlFor='image'>
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { toast.error("Image sending feature is Disabled in Anonymous chats") }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white size-5 cursor-pointer">
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

                {/* Send Buttion */}
                <button className='rounded-full p-2 bg-white hover:bg-white/80' onClick={sendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send text-black"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                </button>
            </div>
        </div >
    ) : (
        // if no user is selected display logo
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/7 max-md:hidden '>
            <div className='flex items-center flex-col gap-3'>
                {/* logo dude */}
                <div className='rounded-4xl size-27 flex items-center justify-center bg-[#728bb5]/10 hover:bg-[#728bb5]/20'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square w-17 sm:w-60 md:w-70 max-w-full h-17 text-[#edecec]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>

                <div className='flex gap-2 items-center justify-center'>
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[#c88f33]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                    <h2 className='text-[#c88f33] font-sans text-xl logo'>Pairing.. Please Wait</h2>
                </div>
            </div>
        </div>
    )
}

export default ChatContainer;