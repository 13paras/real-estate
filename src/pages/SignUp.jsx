import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import undraw from "../assets/undrawsvgL.svg";
import { Image } from "@nextui-org/react";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredentials.user;
      toast.success("User Created!!");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <div className='mx-auto max-w-7xl '>
        <h1 className='py-10 text-center text-4xl font-bold text-cream'>
          Sign Up
        </h1>

        <div className='flex flex-col items-center lg:flex-row'>
          <div className='mx-auto sm:w-[67%] md:w-[77%] lg:w-[50%]'>
            <Image
              loading='lazy'
              className='mx-auto w-[90%] rounded-xl shadow-xl'
              src={undraw}
              alt=''
            />
          </div>

          {/* Form */}
          <div className='mx-auto pt-5 sm:w-[67%] md:w-[77%] lg:w-[50%]'>
            <form
              onSubmit={onSubmitHandler}
              className='mx-8 mt-8 flex flex-col space-y-6 text-stone-400'
            >
              <input
                onChange={onChangeHandler}
                id='name'
                className='h-12 rounded bg-zinc-800 text-lg'
                type='text'
                placeholder='Enter your name...'
                required
              />

              <input
                onChange={onChangeHandler}
                id='email'
                className='h-12 rounded bg-zinc-800 text-lg'
                type='email'
                placeholder='Enter email...'
                required
              />

              <input
                type='password'
                onChange={onChangeHandler}
                className='h-12 rounded bg-zinc-800 text-lg'
                required
                id='password'
                placeholder='Enter password...'
              />

              <div className='flex items-center justify-between'>
                <p className='text-stone-300'>
                  Have an account?
                  <span className='cursor-pointer pl-1 font-semibold text-light_coral_red'>
                    <Link to='/sign-in'>Sign-in</Link>
                  </span>
                </p>
                <p className='font-semibold text-blue-500 hover:underline'>
                  <Link to='/forgot-password'>Forgot Password</Link>
                </p>
              </div>

              <div className=''>
                <button className='w-full rounded bg-blue-600 py-2 text-center text-lg font-semibold text-white hover:bg-blue-700 active:scale-95'>
                  Sign up
                </button>
              </div>

              <div
                className='flex items-center 
              before:flex-1 before:border-t-[1.5px] before:border-slate-500
              after:flex-1 after:border-t-[1.5px] after:border-slate-500'
              >
                <p className='px-4 text-center text-xl text-slate-500 '>OR</p>
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

export default SignUp;
