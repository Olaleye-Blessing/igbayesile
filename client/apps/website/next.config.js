// TODO: Violated policies are not being reported. Look into it.
const reportURI = `${process.env.BACKEND_URL}/api/v1/csp/web`;

const cspHeader = `
    default-src 'self';
    connect-src 'self' countriesnow.space *.igbayesile.xyz;
    script-src 'self' 'unsafe-inline';
    style-src 'self' fonts.googleapis.com fonts.googleapis.com 'unsafe-inline';
    img-src 'self' res.cloudinary.com github.com;
    font-src 'self' fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    report-to csp-web;
    report-uri ${reportURI};
`;

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Reporting-Endpoints",
            value: reportURI,
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};
