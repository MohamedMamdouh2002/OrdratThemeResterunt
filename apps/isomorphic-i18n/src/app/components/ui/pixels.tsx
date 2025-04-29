

import Head from 'next/head';
import React from 'react';

/**
 * Returns an array of React nodes containing the full pixel script(s)
 * for the given pixel object.
 *
 * Each case is based on pixel.name. The pixel.pixelCode value is used
 * to substitute the actual value (such as the Measurement ID or Conversion ID).
 *
 * For example, for "Google Ads Conversion ID", two script tags are rendered:
 * one for the external gtag.js load and one for the inline configuration.
 */
function getPixelComponents(pixel: any) {
  const elements = [];
  // Add a JS comment (in the inline code) for clarity and debugging.
  const comment = ` ${pixel.name} - ID: ${pixel.id} `;

  switch (pixel.name) {
    case 'GA4 API Secret':
      // Note: API Secret is typically used on the server side.
      elements.push(
        <script
  key={`${pixel.id}-console`}
  dangerouslySetInnerHTML={{
    __html: `
      ${comment}
      `,
    //   console.log("GA4 API Secret loaded: ${pixelValues[pixel.id]}");
  }}
/>

      );
      break;

    case 'GA4 Measurement ID':
      // Include external gtag loader and inline initialization.
      elements.push(
        <script
          key={`${pixel.id}-external`}
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${pixel.pixelCode}`}
        ></script>
      );
      elements.push(
        <script
          key={`${pixel.id}-inline`}
          dangerouslySetInnerHTML={{
            __html: `
              ${comment}
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${pixel.pixelCode}');
            `,
          }}
        />
      );
      break;

    case 'Google Ads Conversion ID':
      // Use the pixel code as the conversion ID.
      elements.push(
        <script
          key={`${pixel.id}-external`}
          async
          src={`https://www.googletagmanager.com/gtag/js?id=AW-${pixel.pixelCode}`}
        ></script>
      );
      elements.push(
        <script
          key={`${pixel.id}-inline`}
          dangerouslySetInnerHTML={{
            __html: `
              ${comment}
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-${pixel.pixelCode}');
              gtag('event', 'conversion', {
                'send_to': 'AW-${pixel.pixelCode}/conversion_label_placeholder',
                'value': 1.0,
                'currency': 'USD'
              });
            `,
          }}
        />
      );
      break;

    case 'Google Ads Conversion Label':
      // This would normally be used along with the Ads Conversion ID.
      elements.push(
        <script
          key={`${pixel.id}-inline`}
          dangerouslySetInnerHTML={{
            __html: `${comment} console.log("Google Ads Conversion Label loaded: ${pixel.pixelCode}");`,
          }}
        />
      );
      break;

    case 'Google Tag Manager':
      elements.push(
        <script
          key={`${pixel.id}-inline`}
          dangerouslySetInnerHTML={{
            __html: `
              ${comment}
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s), dl=(l!='dataLayer'?'&l='+l:'');
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${pixel.pixelCode}');
            `,
          }}
        />
      );
      break;

    case 'Hotjar Site ID':
      elements.push(
        <script
          key={`${pixel.id}-inline`}
          dangerouslySetInnerHTML={{
            __html: `
              ${comment}
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${pixel.pixelCode}, hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      );
      break;

    case 'Meta Access Token':
      // Not meant for the client side.
      elements.push(
        <script
          key={`${pixel.id}-console`}
          dangerouslySetInnerHTML={{
            __html: `${comment}console.log("Meta Access Token loaded: ${pixel.pixelCode}");`,
          }}
        />
      );
      break;

    case 'Meta Pixel ID':
      elements.push(
        <script
          key={`${pixel.id}-inline`}
          dangerouslySetInnerHTML={{
            __html: `
              ${comment}
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;
                n=f.fbq=function(){
                  n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)
                };
                if(!f._fbq)f._fbq=n;
                n.push=n; n.loaded=!0; n.version='2.0';
                n.queue=[];
                t=b.createElement(e); t.async=!0;
                t.src=v; s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixel.pixelCode}');
              fbq('track', 'PageView');
            `,
          }}
        />
      );
      elements.push(
        <noscript key={`${pixel.id}-noscript`}>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt="fb pixel"
            src={`https://www.facebook.com/tr?id=${pixel.pixelCode}&ev=PageView&noscript=1`}
          />
        </noscript>
      );
      break;

    case 'Snap Access Token':
      elements.push(
        <script
          key={`${pixel.id}-console`}
          dangerouslySetInnerHTML={{
            __html: `${comment} console.log("Snap Access Token loaded: ${pixel.pixelCode}");`,
          }}
        />
      );
      break;

      case 'Snap Pixel ID':
        elements.push(
          <React.Fragment key={`${pixel.id}-snap`}>
            <script
              key={`${pixel.id}-external`}
              async
              src="https://sc-static.net/scevent.min.js"
            ></script>
      
            <script
              key={`${pixel.id}-inline`}
              dangerouslySetInnerHTML={{
                __html: `
                  window.snaptr = window.snaptr || function() {
                    (window.snaptr.q = window.snaptr.q || []).push(arguments);
                  };
                  snaptr('init', '${pixel.pixelCode}');
                  snaptr('track', 'PAGE_VIEW');
                `,
              }}
            />
          </React.Fragment>
        );
        break;
      
    case 'TikTok Access Token':
      elements.push(
        <script
          key={`${pixel.id}-console`}
          dangerouslySetInnerHTML={{
            __html: `${comment}`
            // console.log("TikTok Access Token loaded: ${pixel.pixelCode}");,
          }}
        />
      );
      break;

    case 'TikTok Pixel ID':
      elements.push(
        <>
        {/* Load external script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject = t;
                var ttq = w[t] = w[t] || [];
                ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
                ttq.setAndDefer = function (t, e) {
                  t[e] = function () {
                    t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                  }
                };
                for (var i = 0; i < ttq.methods.length; i++) {
                  ttq.setAndDefer(ttq, ttq.methods[i]);
                }
                ttq.load = function (e) {
                  var n = "https://analytics.tiktok.com/i18n/pixel/events.js";
                  var o = document.createElement("script");
                  o.type = "text/javascript";
                  o.async = true;
                  o.src = n + "?sdkid=" + e + "&lib=" + t;
                  var a = document.getElementsByTagName("script")[0];
                  a.parentNode.insertBefore(o,a);
                };
                ttq.load('${pixel.pixelCode}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      </>
      
      );
      break;

    default:
      // For any unrecognized pixel type, output the pixelCode as is.
      elements.push(
        <script
          key={`${pixel.id}-inline`}
          dangerouslySetInnerHTML={{
            __html: `${comment}${pixel.pixelCode}`,
          }}
        />
      );
  }
  return elements;
}

export default function Pixels({ enabledPixels }:any) {
  return (
    <>

        {/* Iterate over each enabled pixel and render its full script components */}
        {enabledPixels?.map((pixel: { id: React.Key | null | undefined; }) => (
          <React.Fragment key={pixel.id}>
            {getPixelComponents(pixel as any)}
          </React.Fragment>
        ))}
      
        </>
  );
}

// utils/pixel-api.ts
export async function getEnabledPixels() {
    const shopid = process.env.SHOP_ID || '952E762C-010D-4E2B-8035-26668D99E23E';
  
    try {
      const res = await fetch(`https://testapi.ordrat.com/api/ShopPixel/GetAllPixelsByShopId/${shopid}`);
      const data = await res.json();
  
      return data.filter((pixel: any) => pixel.isEnabled && pixel.pixelCode?.trim() !== '');
    } catch (err) {
      console.error('Failed to fetch pixel data:', err);
      return [];
    }
  }
  