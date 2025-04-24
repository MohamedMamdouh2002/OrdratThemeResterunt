// components/server/ServerHeaderData.tsx
import { cookies } from "next/headers";

export default function ServerHeaderData() {
  const cookieStore = cookies();
  const logoUrl = cookieStore.get("logoUrl")?.value || null;
  const shopName = cookieStore.get("subdomainName")?.value || null;
  const rate = cookieStore.get("rate")?.value || null;
  const backgroundUrl = cookieStore.get("backgroundUrl")?.value || null;
  const description = cookieStore.get("description")?.value || null;
  const shopId = cookieStore.get("shopId")?.value || null;
  const currencyId = cookieStore.get("currencyId")?.value || null;

  return {
    logoUrl,
    shopName,
    backgroundUrl,
    rate,
    shopId,
    description,
    currencyId

  };
}
