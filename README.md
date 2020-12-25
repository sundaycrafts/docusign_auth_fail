# Prerequisites

1. Create [developer sandbox account](https://go.docusign.com/o/sandbox/)
2. "ADD APP & INTEGRATION KEY" from [Apps and keys](https://admindemo.docusign.com/api-integrator-key)
   in [Admin page of Docusign eSignature](https://admindemo.docusign.com/) > Settings
3. Enter edit screen for the app and add "Redirect URIs" by arbitrary, RSA Keypairs (no need prepare yourself) and store
   it into [cert/private.pem](cert/private.sample.pem) / [cert/public.pem](cert/public.sample.pem) (see *.sample.pem what expected)
4. Fill .env entries copied from sample.env by the app information.

# Getting Started

## 1. Install dependencies

```bash
# yarn
yarn

# npm
npm i
```

## 2. copy .env from sample.env and fill its entries by your environment

you may couldn't fill the entry "IMPERSONATED_USER_ID" in this step. See after steps to fill it.

```bash
cp sample.env .env
```

## 3. set AUTHORIZETAION_CODE in .env

```bash
# yarn
yarn renewauth
# print URL to authorize
# authorize on your browser

# npm
npm run renewauth
```

## 4. run tests

**You have to run the test for "auth code get token" at first if you don't know the Docusign user's ID**

```bash
# yarn
yarn test
# or this at first if you need to know the user ID
yarn test -- test/platform101/authcodeGetToken.spec.ts

# npm
npm test
# or this at first if you need to know the user ID
npm test -- test/platform101/authcodeGetToken.spec.ts
```

# Structures

```
.
├── README.md
├── jest.config.js
├── package.json
├── sample.env # copy as .env and rewrite
├── renewAuthCode # used by script of package.json
│   └ ...
├── test
│   ├── hello.spec.ts # test of test
│   ├── hello.ts # function for test of test
│   └ ... # actual test
└── yarn.lock
```
