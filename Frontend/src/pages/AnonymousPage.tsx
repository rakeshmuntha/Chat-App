import AnonymousSidebar from '../components/AnonymousSidebar'
import AnonymousChatContainer from '../components/AnonymousChatContainer'
import { useContext, useEffect } from 'react'
import { AnonymousContext } from '../../context/AnonymousContext';

const AnonymousPage = () => {

    const AC = useContext(AnonymousContext);
    if (!AC) throw new Error("AnonymousContext is missing. Make sure App is wrapped in AuthProvider.");
    const { startAnonymousChat, myName } = AC;

    useEffect(() => {
        startAnonymousChat(myName || "Anonymous11");
    }, []);

    return (
        <div className="w-full h-screen overflow-hidden bg-black flex items-center justify-center">
            <div className="w-[94%] sm:w-[88%] h-[95vh] sm:h-[94vh] backdrop-blur-xl bg-black/70 border border-[#2f2d2d] rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_3.5fr]">
                <AnonymousSidebar />
                <AnonymousChatContainer />
            </div>
        </div>
    );
}

export default AnonymousPage;