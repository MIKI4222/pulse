import {afterEach, describe, expect, it, vi} from 'vitest';

const expected = '0xd4efFc3B03B830c7a60e47769F2b41596B808a55';
const load = () => import('./contract');
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe('deployment configuration', () => {
  it('accepts the intended environment and uses its address', async () => {
    vi.stubEnv('VITE_METRIC_CONSENSUS_ADDRESS', expected);
    vi.stubEnv('VITE_GENLAYER_CHAIN_ID', '61997');
    const {CONFIG} = await load();
    expect(CONFIG.address).toBe(expected);
    expect(CONFIG.explorer).toContain(expected);
  });
  it('rejects an address other than the configured deployment', async () => {
    vi.stubEnv('VITE_METRIC_CONSENSUS_ADDRESS', '0x0000000000000000000000000000000000000001');
    await expect(load()).rejects.toThrow('Configured contract address is not the verified PULSE contract.');
  });
  it('rejects a different chain ID', async () => {
    vi.stubEnv('VITE_METRIC_CONSENSUS_ADDRESS', expected);
    vi.stubEnv('VITE_GENLAYER_CHAIN_ID', '61999');
    await expect(load()).rejects.toThrow('PULSE requires Studio Dev chain 61997.');
  });
});
