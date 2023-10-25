/* eslint-disable react/prop-types */
import moment from "moment/moment";
import { MdDelete, MdEditSquare, MdLocationOn } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import { FaBath, FaBed, FaChair, FaParking } from "react-icons/fa";
import CommonButton from "./CommonButton";

const ListingItem = ({ id, listing, delHandler, edtiHandler, simplified }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/category/${listing.type}/${id}`)}
      className=' cursor-pointer'
    >
      <Card className='relative w-[350px] bg-zinc-800 shadow-xl md:w-[400px]'>
        <CardHeader className='relative'>
          <Image
            className={`h-[260px] w-full object-cover`}
            src={listing?.imgUrls[0]}
          />
        </CardHeader>

        <span className=' absolute left-[6%] top-[6%] z-10 rounded-full bg-cream px-4 py-1 text-sm font-semibold capitalize text-sky-400 sm:px-6 sm:py-1.5 sm:text-lg'>
          For {listing?.type === "sell" ? "sale" : listing?.type}
        </span>
        <span className='absolute right-[6%] top-[6%] z-10 rounded-full bg-cream p-2 sm:p-2.5'>
          <AiOutlineHeart size={20} color='#38bdf8' />
        </span>

        <CardBody className='-mt-3 space-y-4'>
          <div className='flex items-center justify-between gap-2'>
            <p className='line-clamp-1 flex items-center text-sm text-stone-400'>
              <MdLocationOn size={23} color='green' className='mr-2' />{" "}
              <span className='line-clamp-1'>{listing.address}</span>
            </p>
            <p className=' min-w-fit rounded-md bg-gradient-to-r from-red-500 to-red-700 px-2 py-1 text-xs font-semibold uppercase text-cream shadow-lg'>
              {moment(listing.timestamp?.toDate()).fromNow()}
            </p>
          </div>

          <h3 className='line-clamp-1 text-xl font-semibold capitalize text-stone-300'>
            {listing.description}
          </h3>

          <ul className='flex h-14 items-center gap-4 text-sm capitalize text-stone-400'>
            <li className=''>
              <FaBed size={23} color='#71717a' /> {listing.bedrooms}{" "}
              {listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
            </li>
            <Divider className='h-10 opacity-80' orientation='vertical' />
            <li className=''>
              {" "}
              <FaBath size={23} color='#71717a' />
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : "1 Bath"}
            </li>
            <Divider className='h-10 opacity-80' orientation='vertical' />
            <li className=''>
              {" "}
              {listing.parking && (
                <>
                  <FaParking size={23} color='#71717a' className='mr-1' />
                  parking spot
                </>
              )}
            </li>
            <Divider className='h-10 opacity-80' orientation='vertical' />
            <li className=''>
              {listing.furnished && (
                <>
                  <FaChair size={23} color='#71717a' className='mr-1' />
                  Furnished
                </>
              )}
            </li>
          </ul>
          <Divider className='dotted opacity-80' />
          <div className='flex items-center justify-between'>
            <p className='text-stone-400'>
              <span className='text-2xl font-semibold text-sky-400'>
                $
                {listing.offer
                  ? listing.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : listing.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
              {listing.type === "rent" && " / month"}
            </p>
            {!simplified && <CommonButton text={"read more"} />}
          </div>
        </CardBody>
        {edtiHandler && (
          <MdEditSquare
            className='absolute bottom-6 right-12 cursor-pointer duration-200 ease-in-out transition-all active:scale-90'
            onClick={(e) => {
              e.stopPropagation();
              edtiHandler(id);
            }}
            color='skyblue'
            size={23}
          />
        )}
        {delHandler && (
          <MdDelete
            onClick={(e) => {
              e.stopPropagation();
              delHandler(id);
            }}
            className='absolute bottom-6 right-3 cursor-pointer duration-200 ease-in-out transition-all active:scale-90'
            size={23}
            color='red'
          />
        )}
      </Card>
    </div>
  );
};

export default ListingItem;
