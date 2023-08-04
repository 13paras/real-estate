import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { db } from "../config/Firebase";

const OAuth = () => {
  const navigate = useNavigate();
  const handleSignin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //chekc the user exists and Save the user details to database
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate("/");
      toast.success("Successfully signed-in!!!");
    } catch (error) {
      toast.error("Could not authorize with Google");
      console.log(error);
    }
  };

  return (
    <div className='mb-6'>
      <button
        onClick={handleSignin}
        className='flex w-full items-center justify-center rounded bg-red-500  py-2 text-lg font-semibold text-white hover:bg-red-600 active:scale-95'
      >
        <FcGoogle size={23} className='mr-2 rounded-full bg-white' />
        Continue with google
      </button>
    </div>
  );
};

export default OAuth;
