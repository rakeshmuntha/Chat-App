import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
    const [currState, setcurrState] = useState("Login");
    const [fullName, setfullName] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [bio, setbio] = useState('');
    const [isDataSubmitted, setisDataSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            <form
                onSubmit={onSubmitHandler}
                className="border-1 bg-white/4 text-white border-gray-500 p-6 sm:p-9 w-full sm:w-96 flex flex-col gap-6 rounded-lg shadow-lg"
            >
                <h2 className="font-bold text-white text-2xl sm:text-3xl flex justify-between items-center">
                    {currState}

                    {isDataSubmitted && (
                        <svg onClick={() => setisDataSubmitted(false)} className="w-8 h-8 cursor-pointer hover:bg-gray-600 rounded-full p-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"></path>
                        </svg>
                    )}
                </h2>

                {/* Full Name */}
                {currState === 'Sign up' && !isDataSubmitted && (
                    <input
                        type="text"
                        onChange={(e) => setfullName(e.target.value)}
                        value={fullName}
                        className="p-2 border-[1px] border-[#513e21] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#513e21]"
                        placeholder="Full Name"
                        required
                    />
                )}

                {/* Email & Password */}
                {!isDataSubmitted && (
                    <>
                        <input
                            onChange={(e) => setemail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Email Address"
                            required
                            className="p-2 border-[1px] border-[#513e21] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#513e21]"
                        />
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                placeholder="Enter your password"
                                className="p-2 w-full border-[1px] border-[#513e21] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#513e21]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-sm absolute inset-y-0 right-2 flex items-center text-white-400 cursor-pointer"
                            >
                                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off size-5 text-[#8b6b39]"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye size-5 text-[#8b6b39]"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                }
                            </button>
                        </div>
                    </>
                )}

                {/* Bio */}
                {currState === 'Sign up' && isDataSubmitted && (
                    <textarea
                        rows={4}
                        className="p-2 border-[1px] border-[#513e21] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#513e21]"
                        placeholder="Please provide a short bio..."
                        onChange={(e) => setbio(e.target.value)}
                        value={bio}
                    ></textarea>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    id="signInButton"
                    style={{ fontWeight: "semibold" }}
                    className="py-3 bg-white text-black rounded-md cursor-pointer hover:bg-white/90">
                    {currState === 'Sign up' ? 'Create Account' : 'Login Now'}
                </button>

                {/* Terms */}
                {currState === 'Sign up' && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <input type="checkbox" required defaultChecked />
                        <p>Agree to the terms of use & privacy policy</p>
                    </div>
                )}

                {/* Switch */}
                <div className='flex flex-col gap-2'>
                    {currState === 'Sign up' ? (
                        <p className='text-sm text-[#b0833a]'>Already have an Account? <span className='font-medium text-white underline cursor-pointer hover:text-white/90' onClick={() => { setcurrState("Login"); setisDataSubmitted(false) }}>Login here</span></p>
                    ) : (
                        <p className='text-sm text-[#b0833a]'>Create an Account? <span className='font-medium text-white underline cursor-pointer hover:text-white/90' onClick={() => { setcurrState("Sign up") }}>Click here</span></p>
                    )}

                </div>
            </form>
        </div>
    )
}

export default LoginPage