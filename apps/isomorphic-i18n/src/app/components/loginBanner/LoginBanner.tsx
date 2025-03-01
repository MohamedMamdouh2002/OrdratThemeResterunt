import Image from 'next/image'
import React from 'react'
import logPhoto from '@public/assets/online-chatting-app-cartoon-characters-communicating-internet-gadget-addiction-blogging-posting-modern-digital-technologies-desig.png'

function LoginBanner() {
  return <>
  <div className="bg-Color30 py-3">
    <div className="w-[90%] mx-auto flex justify-between items-center">
    <div className="">
        <h2 className='text-lg font-semibold'>Hey there!</h2>
        <h3 className='text-sm font-light mt-1 mb-3'>Log in for faster ordering experince</h3>
        <button className='w-16 h-8 bg-mainColor rounded-md text-white'>
            Log in
        </button>
    </div>
    <div className="">
        <Image src={logPhoto} width={300} height={150} className='w-36 h-36' alt='logPhoto'/>
    </div>
    </div>
  </div>
  </>
}

export default LoginBanner