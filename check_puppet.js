import pkg from 'C:/Users/Nethra/Downloads/main git file/employee-management-system-main/frontend/node_modules/puppeteer/package.json' with { type: 'json' };
console.log('Puppeteer version:', pkg.version);

import puppeteer from 'puppeteer';
const pageProto = Object.getOwnPropertyNames(Object.getPrototypeOf({}).constructor.prototype);
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(puppeteer)).filter(k => k.toLowerCase().includes('wait')));
