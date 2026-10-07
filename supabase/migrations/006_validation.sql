begin;
create function public.validate_record() returns trigger language plpgsql security definer set search_path='' as $$
declare field text;
begin
  if new.collection='claims' then
    if coalesce(new.data->>'status','') not in ('Draft','Submitted','Under Review','In Review','Escalated','Approved','Rejected','Closed','Reopen Requested') then raise exception 'Invalid claim status.'; end if;
    if new.data->>'status'='Submitted' and (TG_OP='INSERT' or old.data->>'status'='Draft') then
      foreach field in array array['policyNumber','category','incidentDate','incidentType','incidentLocation','incidentDescription'] loop
        if length(trim(coalesce(new.data->>field,'')))=0 then raise exception 'Complete all required claim information before submitting.'; end if;
      end loop;
      if (new.data->>'incidentDate')::date > (now() at time zone 'Asia/Kolkata')::date then raise exception 'Incident date cannot be in the future.'; end if;
    end if;
    if TG_OP='UPDATE' and not public.is_staff() then
      if old.data->>'status'<>'Draft' then
        foreach field in array array['policyNumber','category','incidentDate','incidentType','incidentLocation','incidentDescription'] loop
          if new.data->field is distinct from old.data->field then raise exception 'Submitted incident details require a staff correction.'; end if;
        end loop;
      end if;
      if new.data->'closure' is distinct from old.data->'closure' then raise exception 'Closure review requires staff.'; end if;
    end if;
    if new.data->>'status'='Closed' and coalesce(new.data#>>'{closure,checklistCompleted}','false')<>'true' then raise exception 'Complete the closure checklist first.'; end if;
    if coalesce(new.data->>'archived','false')='true' and new.data->>'status' not in ('Closed','Rejected') then raise exception 'Only completed claims can be archived.'; end if;
  end if;
  if new.collection='documents' then
    if new.data->>'scanStatus' is distinct from 'Not scanned' then raise exception 'A scanning service has not been configured.'; end if;
    if new.data->>'reviewStatus' not in ('Pending','Accepted','Rejected') then raise exception 'Invalid document review status.'; end if;
    if new.data->>'claimId' is not null and not exists(select 1 from public.records where collection='claims' and id=new.data->>'claimId' and owner_id=new.owner_id) then raise exception 'Document must belong to a claim owned by this customer.'; end if;
    if split_part(coalesce(new.data->>'storagePath',''), '/',1)<>new.owner_id::text then raise exception 'Invalid document storage owner.'; end if;
    if new.data->>'reviewStatus'='Rejected' and length(trim(coalesce(new.data->>'reviewReason','')))=0 then raise exception 'Explain why this document was rejected.'; end if;
  end if;
  return new;
end;
$$;
create trigger validate_record_write before insert or update on public.records for each row execute function public.validate_record();
revoke all on function public.validate_record() from public;
commit;
