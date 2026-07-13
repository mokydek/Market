-- Kaspi has very strong anti bot protection (Cloudflare plus a required city
-- cookie) and blocks datacenter IPs, where Supabase Edge Functions run. The
-- adapter is kept in the codebase but the marketplace is disabled so searches
-- do not always wait 8s for a guaranteed failure. To make Kaspi live, use an
-- official Kaspi merchant API, a paid scraping/proxy provider, or a small
-- worker on a residential IP, then re enable:
--   update public.marketplaces set enabled = true where id = 'kaspi';
update public.marketplaces set enabled = false where id = 'kaspi';
