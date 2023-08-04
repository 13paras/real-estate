/* eslint-disable react/prop-types */
import moment from "moment/moment";
import { MdDelete, MdEditSquare, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import LazyLoad from "./LazyLoad";

const ListingItem = ({ id, listing, delHandler, edtiHandler }) => {
  const styles = {
    imgStyles:
      "w-full object-cover hover:scale-105 transition-all ease-in-out duration-200 rounded-t-lg bg-center h-[200px]",
  };
  return (
    <div className='relative box-border cursor-pointer overflow-hidden rounded-lg bg-[#cab3b3] shadow-md transition duration-200 ease-in-out hover:shadow-xl'>
      <Link to={`/category/${listing.type}/${id}`}>
        <LazyLoad classes={styles.imgStyles} imageSrc={listing?.imgUrls[0]} />

        <p className='absolute left-2 top-2 z-30 rounded-md bg-light_coral_red px-2 py-1 text-xs font-semibold uppercase text-cream shadow-lg'>
          {moment(listing.timestamp?.toDate()).fromNow()}
        </p>
        <p className='absolute bottom-[42%] right-2 z-30 rounded-md bg-cyan-600 px-2 py-1 text-xs font-semibold capitalize text-white shadow-lg'>
          For {listing?.type === "sell" ? "sale" : listing?.type}
        </p>
        <div className='relative'>
          <p className='flex items-center pl-2 pt-2 text-gray-500'>
            {" "}
            <MdLocationOn size={20} color='green' /> {listing.address}{" "}
          </p>
          <h2 className='py-1 pl-2 text-xl text-deep_blue'>
            {" "}
            {listing.description}{" "}
          </h2>
          <p className='pl-2 text-blue-600'>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <ul className='flex items-center justify-between py-2'>
            <li className='flex items-center space-x-3 pl-2'>
              <span>
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </span>
              <span>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : "1 Bath"}
              </span>
            </li>
          </ul>
        </div>
      </Link>
      {edtiHandler && (
        <MdEditSquare
          className='absolute bottom-2 right-12 cursor-pointer transition-all duration-200 ease-in-out active:scale-90'
          onClick={() => edtiHandler(id)}
          color='blue'
          size={22}
        />
      )}
      {delHandler && (
        <MdDelete
          onClick={() => delHandler(id)}
          className='absolute bottom-2 right-3 cursor-pointer transition-all duration-200 ease-in-out active:scale-90'
          size={22}
          color='red'
        />
      )}
    </div>
  );
};

export default ListingItem;
