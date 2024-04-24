// Content Security Policy
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// https://csp-evaluator.withgoogle.com/
// https://report-uri.com/

const reportURI = `https://igbayesile.onrender.com/api/v1/csp/api`;

const apiCSPHeader = `
    default-src 'none';
    report-to csp-api;
    report-uri ${reportURI};
`.replace(/\n/g, '');

export const cspHeaders = {
  rule: apiCSPHeader,
  endpoint: reportURI,
};
