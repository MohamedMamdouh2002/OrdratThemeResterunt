
type HomeSchemaProps = {
  logoUrl: string;
  shopName: string;
  lang: string;

  description: string;

}
function getServerSiteUrl() {
  const host = "theme.ordrat.com";
  // const host = headers().get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${host}`;
}
export default function HomeSchema({
  logoUrl,
  lang,
  shopName,
  description,

}: HomeSchemaProps) {
  const relPath = getServerSiteUrl()
  const organizationSchema =
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": { shopName },
    "alternateName": { shopName },
    "url": { relPath },
    "logo": { logoUrl },
    "description": { description },
    "legalName": { shopName },
  }


  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema),
      }}
    />
  </>

}
