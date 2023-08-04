import { useState } from "react";
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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();
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
  TODO: Features to add in this component
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

    console.log(formData);

    async function storeImage(image) {
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
    }

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
    // deleting images because we imgUrls are needed
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    // add data to database i.e. firestore
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing Created🚀!!");
    navigate(`/category/:${formDataCopy.type}/${docRef.id}`);
  };

  // tailwind css
  const styles = {
    heading: "mt-6 text-lg font-semibold",
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className='bg-white transition-all duration-300 ease-in-out'>
      <h1 className=' pt-8 text-center text-4xl font-semibold'>
        Create Listing
      </h1>
      <form onSubmit={submitListing} className='mx-auto max-w-md py-10'>
        {/* sell/rent */}
        <p className='text-xl font-semibold'>Sell / Rent</p>
        <div className='mt-3 flex space-x-3'>
          <button
            onClick={onChangeHandler}
            type='button'
            id='type'
            value='sale'
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl transition-all duration-200 ease-in-out active:scale-90 ${
              type === "sale" && "bg-deep_blue text-cream"
            } `}
          >
            sell
          </button>
          <button
            onClick={onChangeHandler}
            type='button'
            id='type'
            value='rent'
            className={`w-full rounded-md bg-deep_blue py-[12px] text-sm font-semibold uppercase text-cream shadow-xl transition-all duration-200 ease-in-out active:scale-90 ${
              type === "sale" && "bg-white text-deep_blue"
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
          className='mt-2 h-12 w-full rounded-md border-gray-300 text-lg text-deep_blue transition-all duration-200 ease-in-out'
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
              className='mt-2 w-[100px] rounded border-gray-300 text-center text-xl'
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
              className='mt-2 w-[100px] rounded border-gray-300 text-center text-xl'
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
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl transition-all duration-200 ease-in-out active:scale-90 ${
              parking && "bg-deep_blue text-cream"
            } `}
          >
            Yes
          </button>
          <button
            onClick={onChangeHandler}
            type='button'
            id='parking'
            value={false}
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl transition-all duration-200 ease-in-out active:scale-90 ${
              !parking && "bg-deep_blue text-cream"
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
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl transition-all duration-200 ease-in-out active:scale-90 ${
              furnished ? "bg-deep_blue text-cream" : "bg-white text-deep_blue"
            } `}
          >
            Yes
          </button>
          <button
            onClick={onChangeHandler}
            type='button'
            id='furnished'
            value={false}
            className={`w-full rounded-md bg-deep_blue py-[12px] text-sm font-semibold uppercase text-cream shadow-xl transition-all duration-200 ease-in-out active:scale-90 ${
              !furnished ? "bg-deep_blue text-cream" : "bg-white text-deep_blue"
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
          className='mt-2 w-full rounded-md border-gray-300 text-lg text-deep_blue transition-all duration-200 ease-in-out'
          placeholder='Address...'
          id='address'
          rows='2'
        />

        {/* Description */}
        <p className={`${styles.heading}`}>Description</p>
        <textarea
          onChange={onChangeHandler}
          value={description}
          className='mt-2 w-full rounded-md border-gray-300 text-lg text-deep_blue transition-all duration-200 ease-in-out'
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
            className={`w-full rounded-md py-[12px] text-sm font-semibold uppercase shadow-xl transition-all duration-200 ease-in-out active:scale-90 ${
              offer && "bg-deep_blue text-cream"
            } `}
          >
            Yes
          </button>
          <button
            onClick={onChangeHandler}
            type='button'
            id='offer'
            value={false}
            className={`w-full rounded-md bg-deep_blue py-[12px] text-sm font-semibold uppercase text-cream shadow-xl transition-all duration-200 ease-in-out active:scale-90 ${
              !offer ? "bg-deep_blue text-cream" : "bg-white text-deep_blue"
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
            className='mt-1 w-full rounded border-gray-300 text-center text-xl'
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
                className='mt-1 w-[50%] rounded border-gray-300 text-center text-xl'
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
            className='mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 transition duration-150 ease-in-out'
          />
        </div>

        {/* Create Listing button */}
        <div className=' my-6 mt-10'>
          <button
            type='submit'
            className='flex w-full items-center justify-center  rounded bg-blue-600 py-3 text-center font-semibold uppercase text-white hover:bg-blue-700 active:scale-95'
          >
            create listing
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateListing;
