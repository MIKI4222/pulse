# Contract and network audit — 2026-11-13

- Source: https://github.com/MIKI4222/metric-consensus-genlayer at commit `5454407cfcc09c85033ff32d4e30f9491aefaaa3`. The fetched repository has `README.md` and root `metric_consensus.py`; the tests, docs and `contracts/` directory described in README were not present.
- Canonical RPC `https://studio-dev.genlayer.com/api` returned chain ID `0xf22d` (61997). With `genlayer-js@2.0.0-rc.3` and `studioDevnet`, `getContractSchema` at `0x82E719fa84d242211847be5CfeBB1fa72e87bd2D` returned eleven methods, matching source and supplied parameter order and read/write designations. `get_metric_count` returned 1.
- Read calls `get_metric(1)`, `get_metric_sources(1)`, `get_latest_observation(1)`, `get_observation(1,1)`, `get_observation_history(1)`, `get_observation_count(1)` and `get_integration_status(1)` returned valid responses from Studio Dev. This confirms current address/interface and working reads, not identity of the exact deployed source byte-for-byte or frontend write capability.
- The supplied explorer resolves to the supplied address with six transactions. It labels calls `(constructor)`, inconsistent with the documented methods; rely on RPC schema and contract reads, not that display label. The explorer page alone does not prove the network identity.
- The repository reports a previous registration and verification on Studio Next. That is independent from testing this frontend. No writes or consensus transactions were submitted during this audit.

## Plan
Implement verified read interface and field validation; build an explicit wallet-backed transaction lifecycle and owner-only writes; render only actual records, maintain units and failure states, then test local and live reads separately from any wallet-write verification. Studio Dev is a preview and may reset or rate-limit.
