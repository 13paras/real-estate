/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Slider from "../components/Slider";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/Firebase";
import moment from "moment";
import { MdLocationOn } from "react-icons/md";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import CardSkeleton from "../components/skeleton/CardSkeleton";
import SliderSkeleton from "../components/skeleton/SliderSkeleton";

const Home = () => {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numberOfListings, setNumberOfListings] = useState(4);

  useEffect(() => {
    // Getting Offers
    const fetchOfferListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(4)
      );
      const docSnap = await getDocs(q);
      let listings = [];
      docSnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setOfferListings(listings);
    };
    fetchOfferListings();

    // --> Places for Rent
    const fetchRentListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", "rent"),
        orderBy("timestamp", "desc"),
        limit(4)
      );
      const docSnap = await getDocs(q);
      const listings = [];
      docSnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setRentListings(listings);
    };
    fetchRentListings();

    //  --> Places for sale
    const fetchSaleListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", "sell"),
        orderBy("timestamp", "desc"),
        limit(4)
      );
      const docSnap = await getDocs(q);
      const listings = [];
      docSnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setSaleListings(listings);
    };
    fetchSaleListings();

    setLoading(false);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setNumberOfListings(window.innerWidth >= 1200 ? 3 : 4);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main>
      {!loading ? <Slider /> : <SliderSkeleton />}
      {/* Offers Section */}
      <div className='mx-4 max-w-[1650px] lg:mx-auto'>
        <section className='mt-16'>
          <h1 className='ml-5 text-2xl font-semibold text-cream xl:ml-[10%] '>
            Recent Offers
          </h1>
          <Link to='/offers'>
            {" "}
            <p className='ml-5 cursor-pointer text-light_coral_red xl:ml-[10%]'>
              Show more offers
            </p>{" "}
          </Link>

          {/* - ListingItems for offers */}
          <div className='mt-4 flex flex-wrap justify-center gap-3'>
            {!loading
              ? offerListings &&
                offerListings?.length > 0 &&
                offerListings?.slice(0, numberOfListings).map((listing) => {
                  return (
                    <>
                      <ListingItem
                        key={listing.id}
                        listing={listing.data}
                        id={listing.id}
                      />
                    </>
                  );
                })
              : Array.from({ length: 4 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
          </div>
        </section>

        {/* Places for rent section */}
        <section className='mt-12'>
          <h1 className='ml-5 text-2xl font-semibold text-cream xl:ml-[10%] '>
            Places for rent
          </h1>
          <Link to='/category/rent'>
            {" "}
            <p className='ml-5 cursor-pointer text-light_coral_red xl:ml-[10%]'>
              Show more places for rent
            </p>{" "}
          </Link>

          {/* - ListingItems for rent */}

          <div className='mt-4 flex flex-wrap justify-center gap-3'>
            {!loading
              ? rentListings &&
                rentListings?.length > 0 &&
                rentListings?.slice(0, numberOfListings).map((listing) => (
                  <>
                    <ListingItem
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                    />
                  </>
                ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
          </div>
        </section>

        {/* Places for sale section */}
        <section className='mt-12'>
          <h1 className='ml-5 text-2xl font-semibold text-cream xl:ml-[10%] '>
            Places for sale
          </h1>
          <Link to='/category/sell'>
            {" "}
            <p className='ml-5 cursor-pointer text-light_coral_red xl:ml-[10%]'>
              Show more places for sale
            </p>{" "}
          </Link>

          {/* - ListingItems for sale */}
          <div className='mt-4 flex flex-wrap justify-center gap-3'>
            {!loading
              ? saleListings &&
                saleListings?.length > 0 &&
                saleListings?.slice(0, numberOfListings).map((listing) => (
                  <>
                    <ListingItem
                      key={listing.id}
                      listing={listing?.data}
                      id={listing?.id}
                    />
                  </>
                ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
