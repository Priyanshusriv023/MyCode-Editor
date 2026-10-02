import SignInFormClient from '@/modules/auth/components/sign-in-form-client'
import Image from 'next/image'
import React from 'react'

const Page = () => {
  return (
    <>
    <Image
      src={"/login.svg"}
      alt="Login illustration"
      height={300}
      width={300}
      className="my-2 h-auto w-auto max-h-[40vh] max-w-[80vw] object-contain"
    />
    <SignInFormClient/>
    </>
  )
}

export default Page