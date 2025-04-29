<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="xsl">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8"/>
        <title>خريطة الموقع XML</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
          }
          .header {
            background-color: #3f80ff;
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
          }
          .header p {
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
          }
          .content {
            padding: 30px 10%;
            text-align: center;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px auto;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            background: white;
          }
          th, td {
            padding: 12px;
            border: 1px solid #ccc;
            text-align: right;
          }
          th {
            background-color: #007bff;
            color: white;
          }
          a {
            text-decoration: none;
            color: #007bff;
          }
          a:hover {
            text-decoration: underline;
          }
          footer {
            margin-top: 40px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>خريطة الموقع XML</h1>
          <p>
            تم إنشاء خريطة الموقع هذه بواسطة  <strong>اوردرات - Ordrat</strong>.
            إنها ما ستستخدمه محركات البحث مثل جوجل لزيارة وإعادة زيارة المقالات/المنتجات/الصفحات/الصور/الأرشيفات على موقعك الإلكتروني.
            <span> يمكنك زيارة موقعنا الالكتروني من خلال </span>
            <a href="https://ordrat.com"  target='_blank' style="color: #fff; text-decoration: underline;"> ordrat </a>
          </p>
        </div>

        <div class="content">
          <h2>📌 قائمة روابط الموقع</h2>
          <table>
            <tr>
              <th>الرابط الأساسي</th>
              <th>آخر تعديل</th>
            </tr>
            <xsl:for-each select="sm:urlset/sm:url">
              <tr>
                <td>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="sm:loc"/>
                    </xsl:attribute>
                    <xsl:value-of select="sm:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:value-of select="sm:lastmod"/>
                </td>
              </tr>
            </xsl:for-each>
          </table>

          <footer>
            ملف Sitemap يحتوي على <xsl:value-of select="count(sm:urlset/sm:url)"/> رابط.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
