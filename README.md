# Handi API Card Lookup - Next.js Frontend

A beautiful Next.js frontend application for card information lookup using Handi API.

## Features

- Modern, responsive UI design with Next.js 14
- Card number validation (must start with 535316)
- Real-time card information lookup
- Direct Handi API integration with API key in header
- Displays: Scheme, Type, Tier, Luhn, Issuer/Bank, Country

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Configuration

The frontend calls Handi API directly with the API key in the header:
- API Key: `PUB-0YNm2r8MDXYc3JWVNQg7GLx6Uz9`
- Endpoint: `https://api.handyapi.com/v1/card/{cardNumber}`
- Header: `x-api-key`

## Project Structure

```
frontend/
├── app/
│   ├── page.js          # Main page component
│   ├── page.module.css  # Styles
│   └── layout.js        # Root layout
├── package.json
└── next.config.js
```
