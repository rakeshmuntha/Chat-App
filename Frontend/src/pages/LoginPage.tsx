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
        <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

            {/* left */}
            <img src={assets.logo_big} alt="" className='w-70 max-sm:w-50' />

            {/* right */}
            <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-9 w-1/4 flex flex-col gap-6 rounded-lg shadow-lg'>
                <h2 className='font-medium text-3xl flex justify-between items-center'>
                    {currState}

                    {isDataSubmitted && <img src={assets.arrow_icon} alt="arrow" className='w-5 cursor-pointer' onClick={() => setisDataSubmitted(false)} />}
                </h2>

                {/* Email and Pass && show data until user is not signed up */}
                {currState === 'Sign up' && !isDataSubmitted &&
                    <input type="text" onChange={(e) => setfullName(e.target.value)} value={fullName} className=' p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Full Name' required />}

                {!isDataSubmitted && (
                    <>
                        <input onChange={(e) => setemail(e.target.value)} value={email} type="email" placeholder='Email Address' required className=' p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
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
                                className="text-sm mr-1 absolute inset-y-0 right-2 flex items-center text-violet-400"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>                    
                    </>
                )}

                {currState === 'Sign up' && isDataSubmitted && (
                    <textarea rows={4} className=' p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Please provide a short bio...' onChange={(e) => setbio(e.target.value)} value={bio}></textarea>
                )}

                <button type='submit' id='signInButton' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>{currState === 'Sign up' ? 'Create Account' : 'Login Now'}</button>

                {currState === 'Sign up' && <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <input type="checkbox" required defaultChecked />
                    <p>Agree to the terms of use & privacy policy</p>
                </div>}

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