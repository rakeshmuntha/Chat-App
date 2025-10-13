import AnonymousSidebar from '../components/AnonymousSidebar'
import AnonymousChatContainer from '../components/AnonymousChatContainer'
import { useContext, useEffect } from 'react'
import { AnonymousContext } from '../../context/AnonymousContext';

const AnonymousPage = () => {

    const AC = useContext(AnonymousContext);
    if (!AC) throw new Error("AnonymousContext is missing. Make sure App is wrapped in AuthProvider.");
    const { startAnonymousChat } = AC;

    useEffect(() => {
        const name = prompt("enter your name");
        startAnonymousChat(name || "Ananonymus11");
    }, []);

    return (
        <div className='border w-full h-screen px-[6%] sm:py-[3%]'>
            <div className={`backdrop-blur-xl bg-black border-[0.5px] border-[#2f2d2d] rounded-md overflow-hidden h-[100%] grid grid-cols-1 relative md:grid-cols-[1fr_2.5fr]`}>
                <AnonymousSidebar />
                <AnonymousChatContainer />
            </div>
        </div>
    )
}

export default AnonymousPage;