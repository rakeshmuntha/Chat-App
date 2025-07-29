import React, { useEffect, useRef } from 'react'
import type { userType } from '../types';
import assets, { messagesDummyData } from '../assets/assets';
import formatMessageTime from '../lib/utils';

type selecteduserType = {
    selectedUser: userType | null | undefined,
    setselectedUser: React.Dispatch<React.SetStateAction<userType | null | undefined>>;
}

const ChatContainer = ({ selectedUser, setselectedUser }: selecteduserType) => {

    const scrollEnd = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [])

    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>
            {/* Header */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img src={assets.profile_martin} alt="profile_martin" className='w-8 rounded-full' />
                <p className='flex-1 text-lg text-white flex items-center gap-2'>
                    Martin Jhonson
                    <span className='w-2 h-2 rounded-full bg-green-500'></span>
                </p>
                <img onClick={() => setselectedUser(null)} src={assets.arrow_icon} alt="arrow_icon" className='md:hidden max-w-7' />
                <img src={assets.help_icon} alt="help_icon" className='max-md:hidden max-w-5' />
            </div>

            {/* Chat Area */}
            <div className='flex flex-col h-[calc(100% - 120px)] overflow-y-scroll p-3 pb-6 bg-red-50'>
                {messagesDummyData.map((msg, index) =>
                    <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50aaf10f3cd28382ecf9' && 'flex-row-reverse'}`}>
                        {/* if image display image or display text */}
                        {msg.senderId !== '680f50aaf10f3cd28382ecf9'}
                        {msg.image ? (<img src={msg.image} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
                        ) : <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === '680f50aaf10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>}

                        {/* display the user logo */}
                        <div className="text-center text-xs">
                            <img src={msg.senderId === '680f50aaf10f3cd28382ecf9' ? assets.avatar_icon : assets.profile_martin} alt="avatar" className='w-7 rounded-full' />
                            <p className='text-gray-500'>
                                {formatMessageTime(msg.createdAt)}
                            </p>
                        </div>
                    </div>
                )}
                <div ref={scrollEnd}>
                    
                </div>
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