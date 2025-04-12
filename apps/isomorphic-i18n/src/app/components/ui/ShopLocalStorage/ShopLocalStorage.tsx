"use client";

import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";

export default function ShopLocalStorage({ backgroud,vat, currencyId,vatType, rate,freeShppingTarget, showAllCouponsInSideBar, applyFreeShppingOnTarget,subdomainName, description, logoUrl, branchZones, shopId }: { backgroud: string;currencyId:string; vatType: number; rate:any, vat: number; subdomainName: string; description: string; logoUrl: string; showAllCouponsInSideBar:boolean; applyFreeShppingOnTarget:boolean; freeShppingTarget:number; branchZones: { lat: number; lng: number; zoonRadius: number }[]; shopId:string;
}) {
  const { setBranchZones, setshopId } = useUserContext(); 
  
  useEffect(() => {
    setshopId(shopId); 
  }, [shopId]);
  

    useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("backgroundUrl", backgroud);
      localStorage.setItem("showAllCouponsInSideBar", JSON.stringify(showAllCouponsInSideBar));
      localStorage.setItem("applyFreeShppingOnTarget", JSON.stringify(applyFreeShppingOnTarget));
      localStorage.setItem("subdomainName", subdomainName);
      localStorage.setItem("currencyId", currencyId);
      localStorage.setItem("description", description);
      localStorage.setItem("logoUrl", logoUrl);
      localStorage.setItem("rate", rate as any);
      localStorage.setItem("vatType", vatType.toString());
      localStorage.setItem("vat", vat as any);
      localStorage.setItem("freeShppingTarget", freeShppingTarget as any);
      // console.log("branchZones: ",branchZones);
      setBranchZones(branchZones);
    }
  }, [subdomainName, logoUrl]);

  return null;
}
