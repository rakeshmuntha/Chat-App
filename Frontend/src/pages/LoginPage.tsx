import { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
    const [currState, setcurrState] = useState("Login");
    const [fullName, setfullName] = useState('rakk');
    const [email, setemail] = useState('rakk@gmail.com');
    const [password, setpassword] = useState('rakk');
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
            <img
                src={assets.logo_big}
                alt=""
                className="w-40 sm:w-60 md:w-70 max-w-full"
            />

            {/* right */}
            <form
                onSubmit={onSubmitHandler}
                className="border-2 bg-white/8 text-white border-gray-500 p-6 sm:p-9 w-full sm:w-96 flex flex-col gap-6 rounded-lg shadow-lg"
            >
                <h2 className="font-bold text-2xl sm:text-3xl flex justify-between items-center">
                    {currState}

                    {isDataSubmitted && (
                        <img
                            src={assets.arrow_icon}
                            alt="arrow"
                            className="w-5 cursor-pointer"
                            onClick={() => setisDataSubmitted(false)}
                        />
                    )}
                </h2>

                {/* Full Name */}
                {currState === 'Sign up' && !isDataSubmitted && (
                    <input
                        type="text"
                        onChange={(e) => setfullName(e.target.value)}
                        value={fullName}
                        className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                placeholder="Enter your password"
                                className="p-2 w-full border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-sm absolute inset-y-0 right-2 flex items-center text-white-400"
                            >
                                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye-off size-5 text-base-content/40"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye size-5 text-base-content/40"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                }
                            </button>
                        </div>
                    </>
                )}

                {/* Bio */}
                {currState === 'Sign up' && isDataSubmitted && (
                    <textarea
                        rows={4}
                        className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Please provide a short bio..."
                        onChange={(e) => setbio(e.target.value)}
                        value={bio}
                    ></textarea>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    id="signInButton"
                    className="py-3 bg-white hover:bg-gray-100 text-black rounded-md cursor-pointer"
                >
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
                        <p className='text-sm text-gray-600'>Already have an Account? <span className='font-medium text-violet-500 cursor-pointer' onClick={() => { setcurrState("Login"); setisDataSubmitted(false) }}>Login here</span></p>
                    ) : (
                        <p className='text-sm text-gray-600'>Create an Account? <span className='font-medium text-violet-500 cursor-pointer' onClick={() => { setcurrState("Sign up") }}>Click here</span></p>
                    )}

                </div>
            </form>
        </div>
    )
}

export default LoginPage