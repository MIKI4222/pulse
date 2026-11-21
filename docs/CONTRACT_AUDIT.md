# Contract and network audit

## Current deployment

- Intended MetricConsensus address: `0xd4efFc3B03B830c7a60e47769F2b41596B808a55` on Studio Dev / Studio Next, chain ID 61997 (`0xf22d`), RPC `https://studio-dev.genlayer.com/api`. Explorer: https://explorer-studio-next.genlayer.com/address/0xd4efFc3B03B830c7a60e47769F2b41596B808a55
- The app's startup guard, default configuration, `.env.example` and README use this address. Both the read adapter and wallet-backed fee estimation and write calls use `CONFIG.address`. If the Netlify build has an explicit `VITE_METRIC_CONSENSUS_ADDRESS`, it must match or be removed; redeploy after changing build variables.
- Read-only RPC preflight returned chain ID `0xf22d`, deployed code and the eleven-method schema. The returned code matched the MetricConsensus source at commit `d70b1d7d27db541f9f948b8df33eed617f18367c` after line-ending normalization, and `get_metric_count` returned 0. The network may be reset and the count can change. These checks do not prove wallet writes, finality or consensus.
- No transaction was signed or submitted for this address during this correction. Fee estimation, wallet writes and end-to-end verification remain untested on this deployment.

## Historical audit of a previous deployment — 2026-11-13

The results below refer only to the previous deployment, not the current address above. Its historical address has been omitted to avoid treating it as a configuration value.

- Source: https://github.com/MIKI4222/metric-consensus-genlayer at commit `5454407cfcc09c85033ff32d4e30f9491aefaaa3`. The fetched repository has `README.md` and root `metric_consensus.py`; the tests, docs and `contracts/` directory described in README were not present.
- Canonical RPC `https://studio-dev.genlayer.com/api` returned chain ID `0xf22d` (61997). With `genlayer-js@2.0.0-rc.3` and `studioDevnet`, `getContractSchema` at the previous deployment returned eleven methods, matching source and supplied parameter order and read/write designations. `get_metric_count` returned 1.
- Read calls `get_metric(1)`, `get_metric_sources(1)`, `get_latest_observation(1)`, `get_observation(1,1)`, `get_observation_history(1)`, `get_observation_count(1)` and `get_integration_status(1)` returned valid responses from Studio Dev. This confirmed the previous deployment’s interface and reads at that time, not identity of the exact deployed source byte-for-byte or frontend write capability.
- The supplied explorer resolves to the supplied address with six transactions. It labels calls `(constructor)`, inconsistent with the documented methods; rely on RPC schema and contract reads, not that display label. The explorer page alone does not prove the network identity.
- The repository reports a previous registration and verification on Studio Next. That is independent from testing this frontend. No writes or consensus transactions were submitted during this audit.

## Plan
Implement verified read interface and field validation; build an explicit wallet-backed transaction lifecycle and owner-only writes; render only actual records, maintain units and failure states, then test local and live reads separately from any wallet-write verification. Studio Dev is a preview and may reset or rate-limit.
