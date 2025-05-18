"use client";

import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import Cookies from 'js-cookie';

export default function ShopLocalStorage({ backgroud, languages,currencyAbbreviation,vat, currencyId, vatType, rate, freeShppingTarget, showAllCouponsInSideBar, applyFreeShppingOnTarget, subdomainName, description, logoUrl, branchZones, shopId }: {
  backgroud: string; currencyId: string; vatType: number;languages:number; rate: any, vat: number; subdomainName: string; description: string; logoUrl: string; showAllCouponsInSideBar: boolean; applyFreeShppingOnTarget: boolean; currencyAbbreviation:string; freeShppingTarget: number; branchZones: { lat: number; lng: number; zoonRadius: number }[]; shopId: string;
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
      localStorage.setItem("currencyAbbreviation", currencyAbbreviation as any);
      // console.log("branchZones: ",branchZones);
      setBranchZones(branchZones);
    }
  }, [subdomainName, logoUrl]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      Cookies.set("languageOption", languages as any);
    }
  }, []);
  return null;
}