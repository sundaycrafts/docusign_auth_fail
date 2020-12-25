# Getting Started

## 1. Install dependencies

```bash
# yarn
yarn

# npm
npm i
```

## 2. copy .env from sample.env and fill its entries by your environment

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

## 4. run test

```bash
# yarn
yarn test

# npm
npm test
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
