drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_update_own_safe_fields"
on public.profiles for update
to authenticated
using (
  id = (select auth.uid())
)
with check (
  id = (select auth.uid())
  and role <> 'admin'
);

drop policy if exists "profiles_admin_manage" on public.profiles;

create policy "profiles_admin_manage"
on public.profiles for all
to authenticated
using (
  auth.jwt() -> 'app_metadata' ->> 'account_role' = 'admin'
)
with check (
  auth.jwt() -> 'app_metadata' ->> 'account_role' = 'admin'
);
