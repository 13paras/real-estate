/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/Firebase";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditListing = () => {
  const auth = getAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
  } = formData;

  //  useEffect to check authentication
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You cannot edit this listing!!");
      navigate("/");
    }
  }, []);

  // *Fetch Listing and Fill the data
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      try {
        // here not using collections because we only want single doc from the collection not the full collection
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data());
          setFormData({ ...docSnap.data() });
          setLoading(false);
          //   console.log(listing)
        }
      } catch (error) {
        navigate("/");
        console.log(error);
        toast.error("Listing doesnot exist");
      }
    };
    fetchListing();
  }, []);

  const onChangeHandler = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // for files
    if (e.target.files) {
      setFormData({
        ...formData,
        images: e.target.files,
      });
    }

    // Text/boolean/number
    if (!e.target.files) {
      setFormData({
        ...formData,
        [e.target.id]: boolean ?? e.target.value,
      });
    }
  };

  /*
 
  * store all the data firestore under "listings" 
  * add image to firebase or firestore
  */
  const submitListing = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (+discountedPrice > +regularPrice) {
      setLoading(false);
      toast.error("Discounted Price cannot be greated than regular price");
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Images are more than 6!!");
    }

    //function for the confirmation dialog
    const showConfirmation = () => {
      return Swal.fire({
        title: "Confirm Edit?",
        text: "Are you sure you want to update the listing",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update",
        cancelButtonText: "Cancel",
      });
    };

    const result = await showConfirmation();

    if (result.isConfirmed) {
      const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
          const storageRef = ref(storage, filename);
          const uploadTask = uploadBytesResumable(storageRef, image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };

      const imgUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      ).catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error("Images not uploaded");
        return;
      });
      // add images to formdata
      const formDataCopy = {
        ...formData,
        imgUrls,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };
      // deleting images because imgUrls are needed
      delete formDataCopy.images;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;

      // add data to database i.e. firestore
      const docRef = doc(db, "listings", params.listingId);

      await updateDoc(docRef, formDataCopy);
      setLoading(false);
      toast.success("Listing Updated!!");
      navigate(`/category/:${formDataCopy.type}/${docRef.id}`);
    } else {
      setLoading(false);
      //User canceled the update
      toast.error("Edit operation has been cancelled..");
    }
  };

  // tailwind css
  const styles = {
    heading: "mt-6 text-lg font-semibold",
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className='text-stone-400 duration-300 ease-in-out transition-all'>
      <h1 className=' pt-8 text-center text-4xl font-semibold'>Edit Listing</h1>
      <form onSubmit={submitListing} className='mx-auto max-w-md py-10'>
        {/* sell/rent */}
        <p className='text-xl font-semibold'>Sell / Rent</p>
        <div className='mt-3 flex space-x-3'>
          <button
            onClick={onChangeHandler}
            type='button'
            id='type'
            value='sale'
            className={`w-full rounded-md bg-zinc-800 py-[12px] text-sm font-semibold uppercase shadow-xl duration-200 ease-in-out transition-all active:scale-90 ${
              type === "sale" && "bg-sky-500 text-cream"
            } `}
          >
            sell
          </button>
          <button
            onClick={onChangeHandler}
            type='button'
            id='type'
            value='rent'
            className={`w-full rounded-md  py-[12px] text-sm font-semibold uppercase shadow-xl duration-200 ease-in-out transition-all active:scale-90 ${
              type === "sale"
                ? "bg-zinc-800 text-stone-400"
                : "bg-sky-500 text-cream"
            }`}
          >
            rent
          </button>
        </div>

        {/* Name */}
        <p className={styles.heading}>Name</p>
        <input
          type='text'
          id='name'
          onChange={onChangeHandler}
          value={name}
          className='mt-2 h-12 w-full rounded-md border-none bg-zinc-800 text-lg text-stone-400 duration-200 ease-in-out transition-all'
          placeholder='Name...'
          minLength='6'
          maxLength={32}
          required
        />

        {/* beds and baths */}
        <ul className={`${styles.heading} flex space-x-3`}>
          <li>
            <p>Beds</p>
            <input
              id='bedrooms'
              type='number'
              onChange={onChangeHandler}
              value={bedrooms}
              className='mt-2 w-[100px] rounded border-none bg-zinc-800 text-center text-xl text-stone-400'
              min={1}
              max={50}
              required
            />
          </li>
          <li>
            <p>Baths</p>
            <input
              id='bathrooms'
              type='number'
              onChange={onChangeHandler}
              value={bathrooms}
              className='mt-2 w-[100px] rounded border-none bg-zinc-800 text-center text-xl text-stone-400'
              min={1}
              max={50}
              required
            />
          </li>
        </ul>

        {/* Parking */}
        <p className={`${styles.heading}`}>Parking Spot</p>
        <div className='mt-3 flex space-x-3'>
          <button
            onClick={onChangeHandler}
            type='button'
            id='parking'
            value={true}
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl duration-200 ease-in-out transition-all active:scale-90 ${
              parking ? "bg-sky-500 text-cream" : "bg-zinc-800 text-stone-400"
            } `}
          >
            Yes
          </button>
          <button
            onClick={onChangeHandler}
            type='button'
            id='parking'
            value={false}
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl duration-200 ease-in-out transition-all active:scale-90 ${
              !parking ? "bg-sky-500 text-cream" : "bg-zinc-800 text-stone-400"
            } `}
          >
            No
          </button>
        </div>

        {/* Furnished */}
        <p className={`${styles.heading}`}>Furnished</p>
        <div className='mt-3 flex space-x-3'>
          <button
            onClick={onChangeHandler}
            type='button'
            id='furnished'
            value={true}
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl duration-200 ease-in-out transition-all active:scale-90 ${
              furnished ? "bg-sky-500 text-cream" : "bg-zinc-800 text-stone-400"
            } `}
          >
            Yes
          </button>
          <button
            onClick={onChangeHandler}
            type='button'
            id='furnished'
            value={false}
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl duration-200 ease-in-out transition-all active:scale-90 ${
              !furnished
                ? "bg-sky-500 text-cream"
                : "bg-zinc-800 text-stone-400"
            } `}
          >
            No
          </button>
        </div>

        {/* Address */}
        <p className={`${styles.heading}`}>Address</p>
        <textarea
          onChange={onChangeHandler}
          value={address}
          className='mt-2 w-full rounded-md border-none bg-zinc-800 text-lg text-stone-400  duration-200 ease-in-out transition-all'
          placeholder='Address...'
          id='address'
          rows='2'
        />

        {/* Description */}
        <p className={`${styles.heading}`}>Description</p>
        <textarea
          onChange={onChangeHandler}
          value={description}
          className='mt-2 w-full rounded-md border-none bg-zinc-800 text-lg text-stone-400  duration-200 ease-in-out transition-all'
          placeholder='Description...'
          id='description'
          rows='2'
        />

        {/* Offer */}
        <p className={`${styles.heading}`}>Offer</p>
        <div className='mt-3 flex space-x-3'>
          <button
            onClick={onChangeHandler}
            type='button'
            id='offer'
            value={true}
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl duration-200 ease-in-out transition-all active:scale-90 ${
              offer ? "bg-sky-500 text-cream" : "bg-zinc-800 text-stone-400"
            } `}
          >
            Yes
          </button>
          <button
            onClick={onChangeHandler}
            type='button'
            id='offer'
            value={false}
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase text-cream shadow-xl duration-200 ease-in-out transition-all active:scale-90 ${
              !offer ? "bg-sky-500 text-cream" : "bg-zinc-800 text-stone-400"
            } `}
          >
            No
          </button>
        </div>

        {/* Regular Price (if rent then /month if sale then it should be hidden) */}
        <p className={styles.heading}>Regular Price</p>
        <div className='mt-3 flex items-center space-x-3'>
          <input
            id='regularPrice'
            onChange={onChangeHandler}
            value={regularPrice}
            type='number'
            className='mt-1 w-full rounded border-none bg-zinc-800 text-center text-xl text-stone-400'
            min='50'
            max='400000000'
            required
          />
          <p className='w-full text-xl'>{type === "rent" && "$ / month"}</p>
        </div>

        {/* Discounted Price- show only if offer is true */}
        {offer && (
          <>
            <p className={styles.heading}>Discounted Price</p>
            <div className='mt-3 flex items-center space-x-3'>
              <input
                id='discountedPrice'
                onChange={onChangeHandler}
                value={discountedPrice}
                type='number'
                className='mt-1 w-[50%] rounded border-none bg-zinc-800 text-center text-xl text-stone-400'
                min='50'
                max='400000000'
                required={false}
              />
            </div>
          </>
        )}

        {/* Images */}
        <div>
          <p className={styles.heading}>Images</p>
          <span className='text-sm text-gray-600'>
            The first image will be the cover (max 6).
          </span>
          <input
            type='file'
            id='images'
            onChange={onChangeHandler}
            accept='.jpg, .png, .jpeg'
            multiple
            required
            className='mt-2 w-full rounded border border-none bg-zinc-800 px-3 py-3 text-stone-400 duration-150 ease-in-out transition'
          />
        </div>

        {/* Create Listing button */}
        <div className=' my-6 mt-10'>
          <button
            type='submit'
            className='flex w-full items-center justify-center  rounded bg-gradient-to-r from-red-500 to-red-700 py-3 text-center font-semibold uppercase text-white  active:scale-95'
          >
            edit listing
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditListing;
