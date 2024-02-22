const CardCurrentMonth = () => {
  
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between">
        <div className="flex h-8.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <span className="text-sm font-medium text-black text-meta-1">
            Feb
          </span>
        </div>

        <span className="text-sm font-bold text-black text-meta-8"> ৳15.456K </span>
        <span className="text-sm font-medium text-meta-5">150MT</span>
      </div>

      <div className="mt-4 flex items-end justify-between" >
        <div style={{paddingTop:16}}> 
          <h4 className="text-title-md font-bold text-black dark:text-white">
            ৳8.456K
          </h4>
          <span className="text-sm font-medium">Total Amount</span>
        </div>

        <div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
           ৳1.606K
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
            0.43%
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          </span>
          <span className="text-sm font-medium">Total Payment</span>
        </div>
        
      </div>
    </div>
  );
};

export default CardCurrentMonth;
