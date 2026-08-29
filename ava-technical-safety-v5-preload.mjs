const originalFetch = globalThis.fetch;

export const AVA_TECHNICAL_RULES_V5 = 'Dante unicast fan-out rule: each unique unicast destination consumes transmitter flow resources. Do not claim one master unicast bundle is replicated by the switch to arbitrary endpoints. Respect device-specific flow limits and use supported multicast flows for large fan-out when appropriate.';

export function applyAvaTechnicalSafetyV5(message='', answer='') {
  const q = String(message || '');
  const a = String(answer || '');
  const danteFanout = /(dante|unicast|multicast|fan[- ]out|48.*endpoint|48.*destination)/i.test(q);
  const oneBundleMyth = /(one|single|master)[\s\S]{0,50}unicast[\s\S]{0,80}(bundle|flow)[\s\S]{0,100}(switch|replicat)|switch[\s\S]{0,100}replicat[\s\S]{0,100}unicast/i.test(a);
  if (danteFanout && oneBundleMyth) {
    return 'Technical correction: Dante unicast is destination-specific. Each unique destination consumes transmitter flow resources; the switch does not turn one master unicast bundle into arbitrary per-destination copies. Respect the transmitter/device flow limits and use supported multicast flows when many receivers need the same channels.';
  }
  return a;
}

function addRule(payload={}) {
  const input = Array.isArray(payload.input) ? payload.input.map(x => ({...x})) : [];
  const s = input.find(x => x?.role === 'system');
  if (s) s.content = `${String(s.content || '')}\n${AVA_TECHNICAL_RULES_V5}`;
  else input.unshift({role:'system',content:AVA_TECHNICAL_RULES_V5});
  return {...payload,input};
}
function userMessage(payload={}) { const input=Array.isArray(payload.input)?payload.input:[]; return String([...input].reverse().find(x=>x?.role==='user')?.content||''); }
if (typeof originalFetch === 'function') {
  globalThis.fetch = async function(resource, options={}) {
    const url=String(resource?.url||resource||'');
    if (!url.includes('api.openai.com/v1/responses') || !options?.body) return originalFetch(resource,options);
    let payload; try { payload=JSON.parse(String(options.body)); } catch { return originalFetch(resource,options); }
    const msg=userMessage(payload);
    const response=await originalFetch(resource,{...options,body:JSON.stringify(addRule(payload))});
    if(!response.ok)return response;
    let data; try{data=await response.clone().json();}catch{return response;}
    const text=data.output_text||(data.output||[]).flatMap(i=>i.content||[]).map(c=>c.text||c.value||'').filter(Boolean).join('\n');
    const guarded=applyAvaTechnicalSafetyV5(msg,text||'');
    if(guarded===text)return response;
    data.output_text=guarded;
    const headers=new Headers(response.headers);headers.set('content-type','application/json');headers.delete('content-length');
    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers});
  };
}
