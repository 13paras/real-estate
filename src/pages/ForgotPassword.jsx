import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const onChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setEmail(" ");
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Error sending password reset email");
      console.log(error);
    }
  };

  return (
    <main className=' bg-cream'>
      <div className='mx-auto max-w-7xl '>
        <h1 className='py-10 text-center text-4xl font-semibold text-deep_blue'>
          Sign In
        </h1>

        <div className='flex flex-col items-center lg:flex-row'>
          <div className='mx-auto sm:w-[67%] md:w-[77%] lg:w-[50%]'>
            <img
              loading='lazy'
              className='mx-auto w-[90%] rounded-xl shadow-xl'
              src='https://img.freepik.com/premium-vector/password-locked-concept-with-padlock-vector_744112-496.jpg?w=900'
              alt=''
            />
          </div>

          {/* Form */}
          <div className='mx-auto pt-5 sm:w-[67%] md:w-[77%] lg:w-[50%]'>
            <form
              onSubmit={onSubmitHandler}
              className='mx-8 mt-8 flex flex-col space-y-6 '
            >
              <input
                onChange={onChangeHandler}
                value={email}
                id='email'
                className='h-12 rounded text-lg text-gray-700'
                type='email'
                placeholder='Enter email...'
                required
              />

              <div className='flex items-center justify-between'>
                <p className='text-deep_blue'>
                  Dont have an account?
                  <span className='cursor-pointer pl-1 font-semibold text-light_coral_red'>
                    <Link to='/sign-up'>Register</Link>
                  </span>
                </p>
                <p className='font-semibold text-blue-500 hover:underline'>
                  <Link to='/forgot-password'>Sign-in instead</Link>
                </p>
              </div>

              <div className=''>
                <button className='w-full rounded bg-blue-600 py-2 text-center text-lg font-semibold text-white hover:bg-blue-700 active:scale-95'>
                  Send reset email
                </button>
              </div>

              <div
                className='flex items-center 
              before:flex-1 before:border-t-[1.5px] before:border-slate-500
              after:flex-1 after:border-t-[1.5px] after:border-slate-500'
              >
                <p className='px-4 text-center text-xl '>OR</p>
              </div>

              <div>
                <OAuth />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
