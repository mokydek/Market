-- Ozon has strong anti bot protection and blocks datacenter IPs, which is where
-- Supabase Edge Functions run. The adapter is kept in the codebase but the
-- marketplace is disabled so the pipeline does not waste an 8s timeout on every
-- search. Re enable it if you route the adapter through a proxy or an official
-- Ozon API: update public.marketplaces set enabled = true where id = 'ozon';
update public.marketplaces set enabled = false where id = 'ozon';
