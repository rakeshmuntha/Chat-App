import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StartPage = () => {
    const [currState, setcurrState] = useState("Login");
    const [fullName, setfullName] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [bio, setbio] = useState('');
    const [isDataSubmitted, setisDataSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { login } = context;

    const onSubmitHandler = async (event: any) => {
        event?.preventDefault();

        if (currState === 'Sign up' && !isDataSubmitted) {
            setisDataSubmitted(true);
            return;
        }
        const data = document.getElementById("signInButton");
        if (data) data.innerHTML = "Loading...";

        await login(currState === 'Sign up' ? 'signup' : 'login', { fullName, email, password, bio });
        if (data) data.innerHTML = currState;
    }

    const handleAnonymous = () => {
        navigate('/anonymous');
    }

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly flex-col sm:flex-row backdrop-blur-2xl px-4 sm:px-8">

            {/* left */}
            <div className='flex items-center flex-col gap-4'>
                {/* logo dude */}
                <div className='rounded-4xl size-45 flex items-center justify-center bg-[#728bb5]/10 hover:bg-[#728bb5]/20'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square w-35 sm:w-60 md:w-70 max-w-full h-35 text-[#edecec]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h2 className='text-[#c88f33] font-sans font-bold text-5xl logo'>Blink Chat</h2>


            </div>

            {/* right */}
            <div className='mt-3 flex flex-col gap-6'>

                {/* Anonymous Chat */}
                <div className='cursor-pointer hover:bg-white/6 flex justify-center gap-2 items-center text-white border-1 bg-white/4 font-sans font-semibold border-gray-500 p-8 max-sm:p-7  rounded-lg shadow-lg' onClick={() => handleAnonymous()}>
                    <h1 className='text-3xl max-sm:text-2xl logo'>Chat Anonymous</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-2 lucide lucide-shuffle-icon lucide-shuffle"><path d="m18 14 4 4-4 4" /><path d="m18 2 4 4-4 4" /><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" /><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" /><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" /></svg>
                </div>

                {/* login */}
                <div className='cursor-pointer hover:bg-white/6 flex justify-center items-center gap-2 text-white border-1 bg-white/4 font-sans font-semibold border-gray-500 p-7 max-sm:p-6 max-  rounded-lg shadow-lg' onClick={() => navigate('/login')}>
                    <h2 className='text-3xl max-sm:text-2xl logo'>Login</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="lucide mt-1 lucide-circle-arrow-out-up-right-icon lucide-circle-arrow-out-up-right"><path d="M22 12A10 10 0 1 1 12 2" /><path d="M22 2 12 12" /><path d="M16 2h6v6" /></svg>
                </div>
            </div>

        </div>
    )
}

export default StartPage