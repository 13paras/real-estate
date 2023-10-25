import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/Firebase";

export const useFetchListings = ({ condition, listingLimit }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferListings = async () => {
      setLoading(true);
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        condition,
        orderBy("timestamp", "desc"),
        limit(listingLimit)
      );
      const docSnap = await getDocs(q);
      let listings = [];
      docSnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchOfferListings();
  }, []);
  return { listings, loading };
};
