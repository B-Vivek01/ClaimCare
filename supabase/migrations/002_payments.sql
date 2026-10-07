begin;
create table public.payment_orders (
  id text primary key,
  invoice_id text not null unique,
  owner_id uuid not null references public.profiles(id),
  amount integer not null check(amount > 0),
  currency text not null default 'INR',
  payment_id text unique,
  status text not null default 'created',
  created_at timestamptz not null default now()
);
alter table public.payment_orders enable row level security;
create policy payment_order_read on public.payment_orders for select to authenticated using (public.current_role() <> 'disabled' and (owner_id=auth.uid() or public.is_staff()));
grant select on public.payment_orders to authenticated;
grant all on public.payment_orders, public.records to service_role;
create function public.lock_invoice_amount() returns trigger language plpgsql set search_path = '' as $$
begin
  if old.collection='invoices' and exists(select 1 from public.payment_orders where invoice_id=old.id)
    and (new.data->'total' is distinct from old.data->'total' or new.owner_id <> old.owner_id) then raise exception 'Invoice amount is locked after checkout begins.'; end if;
  return new;
end;
$$;
create trigger lock_invoice_after_checkout before update on public.records for each row execute function public.lock_invoice_amount();
create function public.finalize_payment(order_id text, provider_payment_id text, payment_method text) returns void language plpgsql security definer set search_path = '' as $$
declare purchase public.payment_orders; invoice public.records; payload jsonb;
begin
  select * into purchase from public.payment_orders where id=order_id for update;
  if not found then raise exception 'Order not found.'; end if;
  if purchase.status='captured' then
    if purchase.payment_id <> provider_payment_id then raise exception 'Order already paid.'; end if;
    return;
  end if;
  select * into invoice from public.records where collection='invoices' and id=purchase.invoice_id for update;
  if not found then raise exception 'Invoice not found.'; end if;
  payload := jsonb_build_object('id',provider_payment_id,'ownerId',purchase.owner_id,'invoiceId',purchase.invoice_id,'transactionId',provider_payment_id,
    'customer',invoice.data->>'customer','policyId',invoice.data->>'policyId','amount',invoice.data->'amount','tax',invoice.data->'tax',
    'total',purchase.amount / 100.0,'method',payment_method,'status','Success','date',now(),'testMode',true,'revision',1);
  insert into public.records(collection,id,owner_id,data) values ('payments',provider_payment_id,purchase.owner_id,payload);
  update public.records set data=data || '{"status":"Paid"}'::jsonb, revision=revision+1, updated_at=now() where collection='invoices' and id=purchase.invoice_id;
  update public.payment_orders set status='captured',payment_id=provider_payment_id where id=order_id;
end;
$$;
revoke all on function public.finalize_payment(text,text,text) from public;
grant execute on function public.finalize_payment(text,text,text) to service_role;
commit;
