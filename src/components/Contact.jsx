/* eslint-disable react-hooks/exhaustive-deps */
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/Firebase";
import { toast } from "react-hot-toast";

const Contact = ({ userRef, listing }) => {
  const [message, setMessage] = useState();
  const [landlord, setLandlord] = useState(null);

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Landlord doesn't exists!!");
      }
    };
    getLandlord();
  }, []);
  return (
    <>
      {landlord !== null && (
        <div>
          <p className='text-xl'>
            Contact <strong> {landlord.name} </strong> for this house{" "}
          </p>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder='Enter message...'
            className='mt-5 w-full rounded-md border-gray-300 text-lg text-deep_blue transition-all duration-200 ease-in-out'
            id=''
            rows='4'
          ></textarea>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button className='mx-auto mb-12 mt-8 flex w-full flex-nowrap items-center justify-center rounded bg-blue-600 px-7 py-2 font-semibold uppercase text-white transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md active:scale-95'>
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
