import React from "react";
import { Link, useAsyncError } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function () {
  const {currentUser} = useSelector((state) => state.user);

  return (
    <div className="bg-white">
      <div className=" flex justify-between items-center max-w-6xl mx-auto p-5">
        <Link to="/">
          <h1 className="font-serif  text-3xl rounded-lg  "></h1>
        </Link>
        <ul className="flex gap-4">
          
          <Link to={""}>
          <div className='flex gap-3 ml-4  '>
        <img src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY"  alt=""  className='w-10 h-10 object-cover mt-2 rounded-full'/>
       
            <div>
                <h1 className='text-gray-700 font-medium mt-2'>Julyaa</h1>
            <h1 className='text-slate-600 font-medium text-sm'>Julyaa@gmail.com</h1> 
            </div>


        </div>
               </Link>
         

           
            
        
        </ul>
      </div>
    </div>
  );
}