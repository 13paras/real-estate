import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/Firebase";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";
import ListingItem from "../components/ListingItem";
import CardSkeleton from "../components/skeleton/CardSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import InfiniteLoader from "../components/InfiniteLoader";

const Offers = () => {
  const [offerListings, setOfferListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastListing, setLastListings] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchOfferListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(8)
      );
      const docSnap = await getDocs(q);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];
      setLastListings(lastVisible);
      const listings = [];
      docSnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setOfferListings(listings);
      setLoading(false);
    };
    fetchOfferListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreListings = async () => {
    setLoading(true);
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastListing),
        limit(4)
      );
      const docSnap = await getDocs(q);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];

      if (docSnap.empty) {
        setHasMore(false);
        toast.success("All listings Fetched");
      }
      setLastListings(lastVisible);
      const listingData = [];
      docSnap.forEach((doc) => {
        return listingData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setOfferListings([...offerListings, ...listingData]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Could not fetch Listings !!");
    }
  };
  return (
    <div>
      <h1 className='mt-16 text-center text-4xl font-bold uppercase text-cream'>
        offers
      </h1>

      <div className='mt-3'>
        {loading ? (
          <div className='mb-7 mt-8 grid gap-7 px-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : offerListings && offerListings.length > 0 ? (
          <InfiniteScroll
            dataLength={offerListings?.length || []}
            next={fetchMoreListings}
            hasMore={hasMore}
            loader={<InfiniteLoader />}
            className='mb-7 mt-8 grid gap-7 px-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          >
            {offerListings.map((listing, index) => (
              <ListingItem
                key={index}
                listingType={listing.type}
                listing={listing.data}
                id={listing.id}
              />
            ))}
          </InfiniteScroll>
        ) : (
          <p className='text-center text-4xl font-bold uppercase'>
            There are no current offers
          </p>
        )}
      </div>
    </div>
  );
};

export default Offers;
