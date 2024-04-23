// Content Security Policy
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// https://csp-evaluator.withgoogle.com/
// https://report-uri.com/

// TODO: Violated policies are not being reported. Look into it.
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://igbayesile.onrender.com'
    : 'http://localhost:2000';
const violationEndPoint = `/api/v1/csp`;
const reportURI = baseURL + violationEndPoint;

const webCSPHeader = `
    default-src 'self';
    connect-src 'self' countriesnow.space;
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
    report-uri ${reportURI}/web;
`.replace(/\n/g, '');

const apiCSPHeader = `
    default-src 'none';
    report-to csp-api;
    report-uri ${reportURI}/api;
`.replace(/\n/g, '');

export const cspHeaders = {
  api: {
    rule: apiCSPHeader,
    endpoint: reportURI + `/api`,
  },
  web: {
    rule: webCSPHeader,
    endpoint: reportURI + `/web`,
  },
};
