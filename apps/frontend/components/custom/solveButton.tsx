"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";


function SolveButton({problemId}:{problemId:string}) {
   const router = useRouter();

   const handleSolveClick = () => {
      router.push(`/solve/${problemId}`);
   }

   return (
      <Button onClick={handleSolveClick}>Solve</Button>
    );
}

export default SolveButton;