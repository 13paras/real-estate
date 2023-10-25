import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import SwiperCore, { EffectFade, Navigation, Pagination } from "swiper";
import { useFetchListings } from "../hooks/useFetchListings";

const Slider = () => {
  // const [listings, setListings] = useState(null);
  // const [loading, setLoading] = useState(true);
  const { listings } = useFetchListings({ listingLimit: 6 });
  SwiperCore.use([Navigation, Pagination, EffectFade]);

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
        listings.map((listing) => (
          <>
            <SwiperSlide key={listing.id}>
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
