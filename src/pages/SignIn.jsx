import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // for singin user
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials.user) {
        navigate("/");
        toast.success("Welcom Back, Have a great day!!");
      }
    } catch (error) {
      toast.error("Wrong user credentials!!");
    }
  };

  const image =
    "https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?w=900&t=st=1682748846~exp=1682749446~hmac=5dd7f2aa6af24e1d429e398724c7f25612c19825369faf001eced722990a0913";

  return (
    <main className=' bg-cream '>
      <div className='mx-auto max-w-7xl'>
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
          <div className='mx-auto pt-5 sm:w-[67%] md:w-[77%] lg:w-[50%] '>
            <form
              onSubmit={onSubmitHandler}
              className='mx-8 mt-8 flex flex-col space-y-6 '
            >
              <input
                onChange={onChangeHandler}
                id='email'
                className='h-12 rounded text-lg text-gray-700'
                type='email'
                placeholder='Enter email...'
                required
              />

              <input
                type='password'
                onChange={onChangeHandler}
                className='h-12 rounded text-lg text-gray-700'
                required
                id='password'
                placeholder='Enter password...'
              />

              <div className='flex items-center justify-between'>
                <p className='text-deep_blue'>
                  Dont have an account?
                  <span className='cursor-pointer pl-1 font-semibold text-light_coral_red'>
                    <Link to='/sign-up'>Register</Link>
                  </span>
                </p>
                <p className='font-semibold text-blue-500 hover:underline'>
                  <Link to='/forgot-password'>Forgot Password</Link>
                </p>
              </div>

              <div className=''>
                <button className='w-full rounded bg-blue-600 py-2 text-center text-lg font-semibold text-white hover:bg-blue-700 active:scale-95'>
                  Sign in
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

export default SignIn;
