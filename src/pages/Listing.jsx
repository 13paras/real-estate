/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Map from "../components/Map";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/Firebase";
import { getAuth } from "firebase/auth";
import { MdLocationOn } from "react-icons/md";
import { FaChair, FaParking } from "react-icons/fa";
import Spinner from "../components/Spinner";
import "swiper/css/bundle";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination, FreeMode } from "swiper";
import Contact from "../components/Contact";

const Listing = () => {
  const auth = getAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactLandlord, setContactLandlord] = useState(false);
  const parmas = useParams();
  SwiperCore.use([Autoplay, Navigation, Pagination, FreeMode]);

  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "listings", parmas.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        // console.log(listing);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className=''>
      <Swiper
        // slidesPerView={1}
        // speed={500}
        // loop={true}
        // navigation
        // pagination={{ type: "progressbar", clickable: true }}
        // effect="flip"
        // autoplay={{ delay: 2000 }}
        speed={500}
        loop={true}
        parallax={true}
        slidesPerView={1}
        autoplay={{ delay: 2000 }}
        effect='fade'
        navigation
        pagination={{ clickable: true }}
      >
        {listing.imgUrls.map((url, index) => (
          <>
            <SwiperSlide key={index}>
              <div
                className='relative h-[370px] w-full overflow-hidden'
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          </>
        ))}
      </Swiper>

      {/* Listing Details */}
      <div className='bg-cream pb-10 pt-1 '>
        <div className='mx-auto mt-7 max-w-[70%] space-y-4  rounded-md p-3 px-4'>
          <h1 className='text-3xl font-bold text-deep_blue'>
            {" "}
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </h1>
          <p className='flex items-center text-lg font-semibold'>
            {" "}
            <MdLocationOn size={25} color='green' /> {listing.address}{" "}
          </p>
          <ul className='capitalise flex items-center space-x-5 font-semibold'>
            <li className='cursor-pointer rounded-lg bg-red-500 px-12 py-1 text-white'>
              For rent
            </li>
            {listing.offer && (
              <li className='cursor-pointer rounded-lg bg-green-700 px-12 py-1 text-white  '>
                Discount $
                {(listing.regularPrice - listing.discountedPrice)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              </li>
            )}
          </ul>
          <p className='pl-1'>
            {" "}
            <strong>Description -</strong> {listing.description}
          </p>
          <ul className='flex items-center space-x-7 pb-2 pl-1 font-semibold'>
            <li>
              {" "}
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}{" "}
            </li>
            <li>
              {" "}
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : "1 Bath"}{" "}
            </li>
            <li className='flex items-center capitalize'>
              {listing.parking && (
                <>
                  <FaParking className='mr-1' size={17} />
                  parking spot
                </>
              )}
            </li>
            <li className='flex items-center'>
              {listing.furnished && (
                <>
                  <FaChair size={17} className='mr-1' />
                  Furnished
                </>
              )}
            </li>
          </ul>

          {/* Contact Landlord */}
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div>
              <button
                onClick={() => setContactLandlord(true)}
                className='mx-auto mt-8 flex w-full flex-nowrap items-center justify-center rounded bg-blue-600 px-7 py-3 font-semibold uppercase text-white transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md active:scale-95'
              >
                Contact Landlord
              </button>
            </div>
          )}

          <div>
            {contactLandlord && (
              <Contact userRef={listing.userRef} listing={listing} />
            )}
          </div>

          {/* map */}
          <section className='z-10 h-[300px] w-full overflow-x-hidden lg:h-[400px]'>
            <Map />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Listing;
