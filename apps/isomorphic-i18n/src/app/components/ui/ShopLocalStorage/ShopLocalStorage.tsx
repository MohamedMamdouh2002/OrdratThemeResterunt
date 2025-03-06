"use client";

import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";

export default function ShopLocalStorage({ backgroud, subdomainName, description, logoUrl, branchZones, shopId }: { backgroud: string; subdomainName: string; description: string; logoUrl: string;   branchZones: { lat: number; lng: number; zoonRadius: number }[]; shopId:string;
}) {
  const { setBranchZones, setshopId } = useUserContext(); 
  
  useEffect(() => {
    setshopId(shopId); 
  }, [shopId]);

    useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("backgroundUrl", backgroud);
      localStorage.setItem("subdomainName", subdomainName);
      localStorage.setItem("description", description);
      localStorage.setItem("logoUrl", logoUrl);
      // console.log("branchZones: ",branchZones);
      setBranchZones(branchZones);
    }
  }, [subdomainName, logoUrl]);

  return null;
}
