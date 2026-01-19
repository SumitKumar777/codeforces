import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"
import {ac, admin, user, teacher} from "@repo/db"
export const authClient = createAuthClient({
   baseURL: "http://localhost:3001", 
   plugins:[
      adminClient({
         ac,
         roles: {
            admin,
            user,
            teacher
         }
      })
   ]
})
    
export const  {signIn, signUp, signOut, useSession} = authClient;