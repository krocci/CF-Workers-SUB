export async function onRequest(context) {
  const kv = context.env.sublink-worker-SUBLINK_KV;

  // 从 KV 取订阅链接
  const target = await kv.get("sub");

  if (!target) {
    return new Response("No subscription found in KV", { status: 500 });
  }

  // 👉 关键：伪装 Clash 请求
  const resp = await fetch(target, {
    method: "GET",
    headers: {
      "User-Agent": "Clash/Meta",
      "Accept": "*/*",
      "Connection": "keep-alive"
    }
  });

  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "Content-Type": "text/yaml; charset=utf-8"
    }
  });
}
