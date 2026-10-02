import React from "react";



const AuthLayout = ({children}:{children:React.ReactNode})=>{
    return(
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 overflow-y-auto bg-zinc-900 px-4 py-6">
        {children}
        </main>
    )
}

export default AuthLayout