import { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

    const Chatcontext = useContext(ChatContext);
    if (!Chatcontext) throw new Error("ChatContext is missing. Make sure App is wrapped in AuthProvider.");
    const { selectedUser, selectRightSidebar } = Chatcontext;

    return selectRightSidebar ? (
            // <div className='border w-full h-screen sm:px-[8%] sm:py-[3%]'>
            <div className='border w-full h-screen px-[8%] py-[3%]'>
                <div className={`backdrop-blur-xl bg-black border-[0.5px] border-[#2f2d2d] rounded-md overflow-hidden h-[100%] grid grid-cols-1 relative 
                ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'} `}>
                <Sidebar />
                <ChatContainer />
                <RightSidebar />
            </div>
        </div>)
        : (
            <div className='border w-full h-screen px-[8%] py-[3%]'>
                <div className={`backdrop-blur-xl bg-black border-[0.5px] border-[#2f2d2d] rounded-md overflow-hidden h-[100%] grid grid-cols-1 relative 
                ${selectedUser ? 'md:grid-cols-[1fr_1.5fr] xl:grid-cols-[1fr_2fr]' : 'md:grid-cols-[1fr_1.4fr]'} `}>
                    <Sidebar />
                    <ChatContainer />
                </div>
            </div>
        )
}

export default HomePage