begin;
create function public.claim_progress() returns trigger language plpgsql security definer set search_path='' as $$
declare state text; progress integer; next_step text;
begin
  if new.collection<>'claims' then return new; end if;
  state:=new.data->>'status';
  if TG_OP='UPDATE' and old.data->>'status' in ('Closed','Rejected') and state is distinct from old.data->>'status' and state is distinct from 'Reopen Requested' then
    raise exception 'Request reopening before changing a completed claim status.';
  end if;
  progress:=case state when 'Draft' then 0 when 'Submitted' then 25 when 'Under Review' then 50 when 'In Review' then 50 when 'Escalated' then 60 when 'Approved' then 75 when 'Rejected' then 100 when 'Closed' then 100 when 'Reopen Requested' then 25 end;
  next_step:=case state when 'Draft' then 'Complete the claim information.' when 'Submitted' then 'Claim submitted. Wait for review.'
    when 'Under Review' then 'A specialist is reviewing this claim.' when 'In Review' then 'A specialist is reviewing this claim.'
    when 'Escalated' then 'An escalated review is pending.' when 'Approved' then 'Complete the closure review.'
    when 'Rejected' then 'Contact support if you want to request reopening.' when 'Closed' then 'Claim review is complete.'
    when 'Reopen Requested' then 'Wait for staff to review the reopen request.' end;
  new.data:=new.data || jsonb_build_object('progress',progress,'expectedNextStep',next_step);
  return new;
end;
$$;
create trigger claim_progress_write before insert or update on public.records for each row execute function public.claim_progress();
revoke all on function public.claim_progress() from public;
-- Refresh existing records so their displayed progress agrees with their status.
update public.records set data=data where collection='claims';
commit;
