import { useEffect, useState } from "react";
import { FcHome } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/Firebase";
import { toast } from "react-hot-toast";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import Swal from "sweetalert2";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [listings, setListings] = useState();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const updateDisplayName = async () => {
    try {
      // update displayName in firebase
      if (auth.currentUser.displayName !== name) {
        updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });

        toast.success("User Credentials updated!!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in updating user credentials");
    }
  };

  useEffect(() => {
    const fetchUserListing = async () => {
      const listingRef = collection(db, "listings");
      //query
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listingsData = [];
      querySnap.forEach((doc) => {
        listingsData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listingsData);
      //  console.log(listings)
      setLoading(false);
    };
    fetchUserListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = () => {
    return auth.signOut(), navigate("/");
  };

  // --> Edit Listing Handler
  const edtiHandler = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  // --> Delete listing
  const delHandler = async (userId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure..?",
      text: "Are you sure, you want to delete this listing..?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it?",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      await deleteDoc(doc(db, "listings", userId));
      const updatedListings = listings.filter((listing) => {
        return listing.id !== userId;
      });
      setListings(updatedListings);
      toast.success("Listing successfully Deleted !!!");
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <section className='w-full '>
      <div className='mx-auto max-w-[1250px]'>
        <div className='mx-auto w-[60%] py-10 lg:w-[50%]'>
          <h1 className='my-4 text-center text-4xl font-semibold text-stone-300'>
            My Profile
          </h1>
          <form className='mt-6 flex w-full flex-col space-y-5'>
            <input
              onChange={onChangeHandler}
              value={name}
              id='name'
              className={`h-12 border-b-[1.3px] border-stone-400 bg-transparent pl-2 text-lg text-stone-400 active:border-none active:outline-none sm:text-xl ${
                !isDisabled
                  ? "border border-zinc-700 bg-zinc-800 active:outline-none"
                  : ""
              } `}
              type='name'
              disabled={isDisabled}
            />
            <input
              onChange={onChangeHandler}
              value={email}
              id='name'
              className='h-12 border-b-[1.3px] border-stone-400 bg-transparent pl-2 text-lg text-stone-400 active:border-none active:outline-none sm:text-xl'
              type='name'
              disabled
              readOnly
            />

            <div className='flex items-center justify-between text-xs sm:text-lg'>
              <p className='w-[70%] text-stone-300 '>
                Do you want to change your name?
                {/* to update profile or not */}
                <span
                  onClick={() => {
                    !isDisabled && updateDisplayName();
                    setIsDisabled(!isDisabled);
                  }}
                  className='cursor-pointer pl-1 font-semibold text-light_coral_red'
                >
                  {isDisabled ? "Edit" : "Apply Changes"}
                </span>
              </p>

              {/* Sign out from site */}
              <p
                onClick={handleSignOut}
                className=' font-semibold text-sky-400 hover:underline '
              >
                Sign-out
              </p>
            </div>
          </form>

          {/* Create Listings Button */}
          <div className=' my-6 mt-10'>
            <button
              onClick={() => navigate("/create-listing")}
              className='flex w-full items-center justify-center rounded bg-sky-600 py-3 text-center text-xl font-semibold text-white hover:bg-sky-700 active:scale-95'
            >
              <FcHome size={25} className='mr-2 rounded-full bg-white' />
              Sell or rent your home
            </button>
          </div>
        </div>

        {/* My Listings Component */}
        {!loading && listings.length > 0 && (
          <div className='mt-10'>
            <h1 className='text-center text-4xl font-semibold'>My Listings</h1>
            <div className='mx-3 mt-12 flex flex-wrap justify-center gap-3'>
              {listings.map((listing) => (
                <>
                  <ListingItem
                    id={listing.id}
                    key={listing.id}
                    edtiHandler={edtiHandler}
                    delHandler={delHandler}
                    listing={listing.data}
                    simplified
                  />
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
