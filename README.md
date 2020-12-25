# Getting Started

## 1. Install dependencies

```bash
# yarn
yarn

# npm
npm i
```

## 2. copy .env from sample.env and fill its entries by your environment

you may couldn't fill the entry "IMPERSONATED_USER_ID" in this step.
See after steps to fill it.

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

**You have to run the test for "auth code get token" at first
if you don't know the Docusign user's ID**

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
