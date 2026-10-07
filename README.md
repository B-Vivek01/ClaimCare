# ClaimCare

React application with Supabase authentication, PostgreSQL records, private file storage and Razorpay test checkout.

Start with [setup instructions](docs/SETUP.md) and [delivery status and acceptance checklist](docs/DELIVERY_STATUS.md). The backend project must be configured before private application flows can work. Some existing screens remain incomplete; the delivery status lists the known gaps.

```text
npm install
npm run dev -- --host 127.0.0.1
npm test
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` and supply the Supabase URL and publishable key. Keep all server secrets out of the frontend.

## Original Vite template notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
