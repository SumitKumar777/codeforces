"use client";
import { useSession } from "@/app/lib/auth-client";
import Signout from "@/components/custom/signout";

function UserData() {
   const {data:session, isPending, error, refetch}=useSession();

   if(isPending){
      return <div>Loading...</div>
   }

   if(error){
      return <div>Error: {error.message}</div>
   }

   return (
         <div>
            <h1>Dashboard Page</h1>
            {session ? (
               <div className="flex gap-4">
                  <div>
                     <p>Welcome, {session.user.name}!</p>
                     <p>Your role: {session.user.role}</p>
                  </div>
                  <div>
                     <Signout/>
                  </div>
               </div>
            ) : (
               <p>You are not logged in.</p>
            )}
         </div>
      );
}

export default UserData;