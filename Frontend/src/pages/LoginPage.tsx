import { useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {
    const [currState, setcurrState] = useState("Sign up");
    const [fullName, setfullName] = useState('rakk');
    const [email, setemail] = useState('rakk@gmail.com');
    const [password, setpassword] = useState('rakk');
    const [bio, setbio] = useState('');
    const [isDataSubmitted, setisDataSubmitted] = useState(false);

    const onSubmitHandler = () => {
        event?.preventDefault();

        if(currState === 'Sign up' && !isDataSubmitted) {
            setisDataSubmitted(true);
            return;
        }
    }

    return (
        <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

            {/* left */}
            <img src={assets.logo_big} alt="" className='w-90 max-sm:w-50' />

            {/* right */}
            <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
                <h2 className='font-medium text-2xl flex justify-between items-center'>
                    {currState}

                    {isDataSubmitted && <img src={assets.arrow_icon} alt="arrow" className='w-5 cursor-pointer' onClick={() => setisDataSubmitted(false)} />}
                </h2>

                {/* show data until user is not signed up */}
                {currState === 'Sign up' && !isDataSubmitted &&
                    <input type="text" onChange={(e) => setfullName(e.target.value)} value={fullName} className=' p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Full Name' required />}

                {!isDataSubmitted && (
                    <>
                        <input onChange={(e) => setemail(e.target.value)} value={email} type="email" placeholder='Email Address' required className=' p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
                        <input onChange={(e) => setpassword(e.target.value)} value={password} type="password" placeholder='password' required className=' p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
                    </>
                )}

                {currState === 'Sign up' && isDataSubmitted && (
                    <textarea rows={4} className=' p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Please provide a short bio...' onChange={(e) => setbio(e.target.value)} value={bio}></textarea>
                )}

                <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>{currState === 'Sign up' ? 'Create Account' : 'Login Now'}</button>

                <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <input type="checkbox" />
                    <p>Agree to the terms of use & privacy policy</p>
                </div>

                <div className='flex flex-col gap-2'>
                    {currState === 'Sign up' ? (
                        <p className='text-sm text-gray-600'>Already have an account? <span className='font-medium text-violet-500 cursor-pointer' onClick={() => { setcurrState("Login"); setisDataSubmitted(false) }}>Login here</span></p>
                    ) : (
                        <p className='text-sm text-gray-600'>Create an account <span className='font-medium text-violet-500 cursor-pointer' onClick={() => { setcurrState("Sign up") }}>Click here</span></p>
                    )}

                </div>
            </form>
        </div>
    )
}

export default LoginPage