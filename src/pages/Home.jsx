/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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
      // console.log(offerListings);
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

  return (
    <main>
      {!loading ? <Slider /> : <SliderSkeleton />}

      {/* Offers Section */}
      <section className='mx-4 mt-16'>
        <h1 className='text-2xl font-semibold text-cream '>Recent Offers</h1>
        <Link to='/offers'>
          {" "}
          <p className='cursor-pointer text-light_coral_red'>
            Show more offers
          </p>{" "}
        </Link>

        {/* - ListingItems for offers */}
        <div className='mt-4 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4'>
          {!loading
            ? offerListings &&
              offerListings?.length > 0 &&
              offerListings?.map((listing) => (
                <>
                  <ListingItem listing={listing.data} id={listing.id} />
                </>
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
        </div>
      </section>

      {/* Places for rent section */}
      <section className='mx-4 mt-12'>
        <h1 className='text-2xl font-semibold text-cream '>Places for rent</h1>
        <Link to='/category/rent'>
          {" "}
          <p className='cursor-pointer text-light_coral_red'>
            Show more places for rent
          </p>{" "}
        </Link>

        {/* - ListingItems for rent */}

        <div className='mt-4 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4'>
          {!loading
            ? rentListings &&
              rentListings?.length > 0 &&
              rentListings?.map((listing) => (
                <>
                  <ListingItem listing={listing.data} id={listing.id} />
                </>
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
        </div>
      </section>

      {/* Places for sale section */}
      <section className='mx-4 mt-12'>
        <h1 className='text-2xl font-semibold text-cream '>Places for sale</h1>
        <Link to='/category/sell'>
          {" "}
          <p className='cursor-pointer text-light_coral_red'>
            Show more places for sale
          </p>{" "}
        </Link>

        {/* - ListingItems for sale */}
        <div className='mt-4 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4'>
          {!loading
            ? saleListings &&
              saleListings?.length > 0 &&
              saleListings?.map((listing) => (
                <>
                  <ListingItem listing={listing?.data} id={listing?.id} />
                </>
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
