import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AnonymousContext } from '../../context/AnonymousContext';

const StartPage = () => {
    const AC = useContext(AnonymousContext);
    if (!AC) throw new Error("AnonymousContext is missing. Make sure App is wrapped in AuthProvider.");
    const { setmyName } = AC;

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);


    const handleAnonymousClick = () => {
        setShowModal(true);
    };

    const handleStartChat = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            setError('Name must be at least 3 characters long');
            return;
        }
        setmyName(name.trim());
        setShowModal(false);
        navigate('/anonymous');
    };

    useEffect(() => {
        if (showModal && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showModal]);

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly flex-col sm:flex-row backdrop-blur-2xl px-4 sm:px-8 relative">

            {/* left */}
            <div className='flex items-center flex-col gap-4'>
                <div className='rounded-4xl size-45 flex items-center justify-center bg-[#728bb5]/10 hover:bg-[#728bb5]/20'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className="lucide lucide-message-square w-35 sm:w-60 md:w-70 max-w-full h-35 text-[#edecec]">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <h2 className='text-[#c88f33] font-sans font-bold text-5xl logo'>Blink Chat</h2>
            </div>

            {/* right */}
            <div className='mt-3 flex flex-col gap-6'>
                <div
                    className='cursor-pointer hover:bg-white/6 flex justify-center gap-2 items-center text-white border-1 bg-white/4 font-sans font-semibold border-gray-500 p-8 max-sm:p-7 rounded-lg shadow-lg'
                    onClick={handleAnonymousClick}
                >
                    <h1 className='text-3xl max-sm:text-2xl logo'>Chat Anonymous</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="mt-2 lucide lucide-shuffle-icon lucide-shuffle">
                        <path d="m18 14 4 4-4 4" />
                        <path d="m18 2 4 4-4 4" />
                        <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" />
                        <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" />
                        <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
                    </svg>
                </div>

                <div
                    className='cursor-pointer hover:bg-white/6 flex justify-center gap-2 items-center text-white border-1 bg-white/4 font-sans font-semibold border-gray-500 p-8 max-sm:p-7 rounded-lg shadow-lg'
                    onClick={() => navigate('/login')}
                >
                    <h2 className='text-3xl max-sm:text-2xl logo'>Sign up</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                        className="lucide mt-1 lucide-circle-arrow-out-up-right-icon lucide-circle-arrow-out-up-right">
                        <path d="M22 12A10 10 0 1 1 12 2" />
                        <path d="M22 2 12 12" />
                        <path d="M16 2h6v6" />
                    </svg>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="absolute inset-0 flex items-start mt-40 justify-center bg-black/60 backdrop-blur-md">
                    <form className="bg-[#1c1c1c] border border-gray-700 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl text-white" onSubmit={handleStartChat}>
                        <h2 className="text-3xl p-3 font-semibold mb-4 text-center">Enter Your Name</h2>
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="Type your name..."
                            className="w-full p-3 bg-transparent border-[1px] border-[#513e21] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#513e21]"
                            minLength={3}
                            required
                        />
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

                        <div className="flex justify-between mt-7">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-5 py-3 rounded-md bg-white/80 text-black hover:bg-white/90 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={name.trim().length < 3}
                                className={`px-5 py-3 rounded-md text-sm transition 
                                    ${name.trim().length < 3
                                        ? 'bg-[#dbaf69] cursor-not-allowed text-black/40'
                                        : 'bg-[#c88f33] hover:bg-[#d89c3c] text-black'}`}
                            >
                                Start Chat
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StartPage;