create policy "allow users to read their own queries"
on "public"."query"
as permissive
for select
to public
using ((user_id = auth.uid()));

create policy "allow users to add their own queries"
on "public"."query"
as permissive
for insert
to public
with check ((user_id = auth.uid()));

create policy "Enable SELECT for authenticated users"
on "public"."user"
as permissive
for select
to public
using ((id = auth.uid()));



