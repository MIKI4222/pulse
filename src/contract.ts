import {createClient} from 'genlayer-js';
import {studioDevnet} from 'genlayer-js/chains';
import {TransactionHashVariant} from 'genlayer-js/types';
import {z} from 'zod';
const expectedAddress='0xd4efFc3B03B830c7a60e47769F2b41596B808a55' as const;
const addressEnv=import.meta.env.VITE_METRIC_CONSENSUS_ADDRESS as string|undefined;const chainEnv=import.meta.env.VITE_GENLAYER_CHAIN_ID as string|undefined;
if(addressEnv&&addressEnv.toLowerCase()!==expectedAddress.toLowerCase())throw Error('Configured contract address is not the verified PULSE contract.');if(chainEnv&&chainEnv!=='61997')throw Error('PULSE requires Studio Dev chain 61997.');
export const CONFIG={address:expectedAddress,chainId:'0xf22d',rpc:'https://studio-dev.genlayer.com/api',explorer:'https://explorer-studio-next.genlayer.com/address/0xd4efFc3B03B830c7a60e47769F2b41596B808a55',txExplorer:'https://explorer-studio-dev.genlayer.com/tx/'};
export type Provider={request:(v:{method:string;params?:unknown[]|object})=>Promise<unknown>;on?:(event:string,fn:(v:unknown)=>void)=>void;removeListener?:(event:string,fn:(v:unknown)=>void)=>void;isMetaMask?:boolean;providers?:Provider[]};
declare global{interface Window{ethereum?:Provider}}
export const client=createClient({chain:studioDevnet});
const metricSchema=z.object({metric_id:z.number(),metric_name:z.string(),owner:z.string(),description:z.string(),category:z.string(),data_type:z.string(),metric_unit:z.string(),extraction_instructions:z.string(),min_sources:z.number(),max_sources:z.number(),max_age_hours:z.number(),max_deviation_bps:z.number(),aggregation_method:z.string(),outlier_policy:z.string(),external_ref:z.string(),source_count:z.number(),observation_count:z.number(),created_at:z.string(),updated_at:z.string()});
const sourceSchema=z.object({position:z.number(),source_url:z.string(),label:z.string(),added_at:z.string()});
const historySchema=z.object({observation_number:z.number(),status:z.string(),aggregated_value:z.string(),unit:z.string(),observed_at:z.string(),accepted:z.boolean(),valid_sources:z.number(),previous_observation:z.number()});
const evidenceSchema=z.object({source_index:z.number(),source_url:z.string(),raw_value:z.string(),raw_unit:z.string(),normalized_value:z.string(),unit:z.string(),raw_timestamp:z.string(),age_hours:z.number(),retrieval_status:z.string(),freshness:z.string(),validity:z.string(),value_kind:z.string(),grounded:z.boolean(),included:z.boolean(),outlier:z.boolean(),exclusion_reason:z.string(),evidence_excerpt:z.string(),excerpt_verified:z.boolean(),limitations:z.array(z.string())});
const observationSchema=historySchema.extend({metric_id:z.number(),aggregated_scaled:z.string(),aggregation_method:z.string(),confidence:z.number(),minimum_observations_met:z.boolean(),deviation_check_passed:z.boolean(),freshness_check_passed:z.boolean(),independent_observations:z.number(),invalid_sources:z.number(),outlier_sources:z.number(),stale_sources:z.number(),source_count:z.number(),source_observations:z.array(evidenceSchema),source_relationships:z.array(z.object({a:z.number(),b:z.number(),relation:z.string()})),limitations:z.array(z.string()),requested_by:z.string()});
const integrationSchema=z.object({verification_status:z.string(),last_verified_at:z.string(),latest_observation:z.object({observed_at:z.string()}).nullable().optional(),last_accepted_observation:z.object({aggregated_value:z.string(),unit:z.string(),observation_number:z.number()}).nullable().optional()});
export type Metric=z.infer<typeof metricSchema>;export type Source=z.infer<typeof sourceSchema>;export type Observation=z.infer<typeof observationSchema>;export type History=z.infer<typeof historySchema>;export type Integration=z.infer<typeof integrationSchema>;
const cache=new Map<string,{value:unknown;time:number}>(),inflight=new Map<string,Promise<unknown>>();let epoch=0;
export function clearCache(){epoch++;cache.clear();inflight.clear()}
async function read(name:string,args:number[]=[],fresh=false){const key=JSON.stringify([name,args]);if(!fresh){const c=cache.get(key);if(c&&Date.now()-c.time<30000)return c.value;const p=inflight.get(key);if(p)return p}const e=epoch;const promise=client.readContract({address:CONFIG.address,functionName:name,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL});if(!fresh)inflight.set(key,promise);try{const val=await promise;if(e===epoch)cache.set(key,{value:val,time:Date.now()});return val}finally{if(inflight.get(key)===promise)inflight.delete(key)}}
export async function count(fresh=false){return z.number().int().nonnegative().parse(await read('get_metric_count',[],fresh))}
export async function getMetric(id:number,fresh=false){return metricSchema.parse(await read('get_metric',[id],fresh))}
export async function getSources(id:number,fresh=false){return z.array(sourceSchema).parse(await read('get_metric_sources',[id],fresh))}
export async function getHistory(id:number,fresh=false){return z.array(historySchema).parse(await read('get_observation_history',[id],fresh))}
export async function getObservation(id:number,n?:number){return observationSchema.parse(await read(n?'get_observation':'get_latest_observation',n?[id,n]:[id]))}
export async function getIntegration(id:number){return integrationSchema.parse(await read('get_integration_status',[id]))}
export function walletClient(provider:Provider,account:`0x${string}`){return createClient({chain:studioDevnet,account,provider:provider as NonNullable<Parameters<typeof createClient>[0]>['provider']})}
export const categories=['FINANCIAL','WEATHER','STATISTICAL','BLOCKCHAIN','INFRASTRUCTURE','PERFORMANCE','OTHER'];
export const units='C F K MM CM M KM IN FT MI MG G KG LB OZ MS S MIN H B KB MB GB TB PERCENT COUNT USD EUR GBP JPY CHF CAD AUD CNY UAH PLN BTC ETH USDT USDC'.split(' ');
export const label=(s:string)=>s.replaceAll('_',' ').toLowerCase().replace(/^./,c=>c.toUpperCase());
export const short=(s:string)=>s.length>18?s.slice(0,8)+'…'+s.slice(-6):s;
export const date=(s:string)=>{const d=new Date(s);return !s?'—':isNaN(d.valueOf())?s:d.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})};
export const errorMessage=(e:unknown)=>e instanceof Error?e.message:typeof e==='object'&&e!==null&&'message' in e?String(e.message):String(e);
export const same=(a:string,b:string)=>!!a&&a.toLowerCase()===b.toLowerCase();
export function safeURL(url:string){try{const x=new URL(url);return ['https:','http:'].includes(x.protocol)&&!x.username&&!x.password?x.href:undefined}catch{return undefined}}
