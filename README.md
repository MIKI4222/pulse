# PULSE — Verifiable Metrics Intelligence

A React/TypeScript frontend for the existing MetricConsensus Intelligent Contract on GenLayer Studio Dev. The app never deploys or substitutes a contract. See `docs/CONTRACT_AUDIT.md` for the pre-development audit.

## Setup

Requires Node.js 20+ and npm. Run:

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

`genlayer-js` is pinned to `2.0.0-rc.3`, with its `studioDevnet` chain. Defaults and `.env.example` specify Studio Dev chain 61997, RPC `https://studio-dev.genlayer.com/api` and verified contract `0x82E719fa84d242211847be5CfeBB1fa72e87bd2D`. `VITE_METRIC_CONSENSUS_ADDRESS` and `VITE_GENLAYER_CHAIN_ID` may be provided explicitly but must match these values; a different contract or network is rejected, not silently substituted. Never place secrets in frontend environment variables.

For Netlify: connect the repository, use `npm run build` as build command and `dist` as publish directory. `netlify.toml` and `public/_redirects` enable SPA routing. Alternatively deploy the contents of `dist` as a Netlify Drop. Public source pages require no wallet; connect an EIP-1193 wallet and explicitly switch to Studio Dev before writes.

## What works and what remains unverified

Public discovery enumerates IDs with limited concurrency and incremental loading, reads actual metric and observation data, and offers filters and a public owner-filtered dashboard. Pages include metric detail, source registry, history, evidence reports, methodology and about. The five-step wizard validates user input and builds `register_metric` arguments. The UI prepares `add_metric_source` and `verify_metric` writes for the owner, checks account/network/state, estimates fees and requires separate wallet confirmation; SDK decision/finalization and execution outcome are checked. Pending hashes can be tracked again after reload. No transaction is automatically resubmitted.

The supplied contract was read live on Studio Dev, including its actual schema, metric, source and observation views. The application renders those reads in local browser testing. Unit tests cover validation and argument order; the wizard was tested without a wallet. **No real wallet signature, fee estimate, write, finalization, or end-to-end registration/verification was performed. Treat writes as unverified until independently tested with an authorized wallet and explicit approval.**

The application is a prototype, not a production audit. Charts and some requested dashboard analytics are not implemented; history and evidence are shown as exact records instead. The landing and interface were reviewed at desktop and mobile sizes, but not all wallet/network/error combinations have been exhaustively tested. The preview RPC has a 30-requests-per-minute limit and can fail under frequent refreshes. The loading and error states show those failures rather than substituting sample data. The initial bundle is large. Dependency install may report esbuild install-script policy warnings depending on npm configuration.

## Contract semantics

Configuration is immutable; sources are append-only; at most 50 observations are stored. A failed consensus may not create an observation. Evidence URLs are not snapshots and may change. Confidence is informational and not a calibrated probability. Consensus and apparent agreement do not establish objective truth or source authenticity. Currency units are not converted across currencies. Studio Dev is a preview network that can reset. No claims of validator independence or source ownership are implied by relationship labels.
