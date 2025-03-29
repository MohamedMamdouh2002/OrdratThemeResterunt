"use client";

import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";

export default function ShopLocalStorage({ backgroud,vat,vatType, subdomainName, description, logoUrl, branchZones, shopId }: { backgroud: string; vatType: number;  vat: number; subdomainName: string; description: string; logoUrl: string;   branchZones: { lat: number; lng: number; zoonRadius: number }[]; shopId:string;
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
      localStorage.setItem("vatType", vatType.toString());
      localStorage.setItem("vat", vat as any);
      // console.log("branchZones: ",branchZones);
      setBranchZones(branchZones);
    }
  }, [subdomainName, logoUrl]);

  return null;
}
