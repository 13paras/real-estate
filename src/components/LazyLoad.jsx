import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyLoad = ({ classes, imageSrc }) => {
  return (
    <>
      <LazyLoadImage
        effect='blur'
        className={
          "h-[200px] w-[30rem] rounded-t-lg object-cover transition-all duration-300 ease-in-out hover:scale-105"
        }
        src={imageSrc}
      />
    </>
  );
};

export default LazyLoad;
