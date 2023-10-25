/* eslint-disable react/prop-types */

const CommonButton = ({ text }) => {
  return (
    <button className='rounded-full border border-sky-400 px-5 py-2 text-lg font-semibold capitalize text-sky-400 hover:shadow-md'>
      {text}
    </button>
  );
};

export default CommonButton;
