import { HashLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className='fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <HashLoader
        color='#FF595A'
        cssOverride={{}}
        loading
        size={56}
        speedMultiplier={1.5}
      />
    </div>
  );
};

export default Spinner;
