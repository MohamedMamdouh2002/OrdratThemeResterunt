<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="xsl"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>قائمة روابط الموقع</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            text-align: center;
          }
          table {
            border-collapse: collapse;
            width: 80%;
            margin: 20px auto;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          th, td {
            padding: 12px;
            border: 1px solid #ccc;
            text-align: left;
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
        </style>
      </head>
      <body>
        <h1>📌 قائمة روابط الموقع</h1>
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
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
