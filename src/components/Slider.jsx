import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Spinner from "../components/Spinner";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../config/Firebase";
import { Link } from "react-router-dom";
import SwiperCore, { EffectFade, Navigation, Pagination } from "swiper";

const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Navigation, Pagination, EffectFade]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(listingRef, orderBy("timestamp", "desc"), limit(6));
        const querySnap = await getDocs(q);
        const listingData = [];
        querySnap.forEach((doc) => {
          return listingData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listingData);
        // console.log(listings)
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchListing();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <Swiper
      speed={500}
      loop={true}
      parallax={true}
      slidesPerView={1}
      autoplay={{ delay: 2000 }}
      effect='fade'
      navigation
      pagination={{ clickable: true }}
    >
      {listings &&
        listings.map((listing, index) => (
          <>
            <SwiperSlide key={index}>
              <Link to={`/category/${listing.data.type}/${listing.id}`}>
                <div
                  style={{
                    background: `url(${listing.data.imgUrls[0]}) center, no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className='relative h-[400px] w-full overflow-hidden'
                ></div>
              </Link>
            </SwiperSlide>
          </>
        ))}
    </Swiper>
  );
};

export default Slider;
