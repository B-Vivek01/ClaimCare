import { useClaims } from "../claim/ClaimContext";
import { useRecords } from "../data/useRecords";
import {
  createContext,
  useContext,
} from "react";

const WorkflowContext =
  createContext();

function WorkflowProvider({
  children,
}) {
  const {claims,updateClaim} = useClaims();
  const workItems = claims.filter(claim=>claim.status!=='Draft' && !claim.archived).map(claim=>({
    id:claim.id,customer:claim.customerName,type:claim.category,status:claim.status,priority:claim.priority,
    team:`${claim.category || 'General'} Claims`,assignedTo:claim.assignedSpecialist || 'Unassigned',createdAt:claim.createdAt,
    slaHours:claim.sla?.hours || 48,elapsedHours:Math.max(0,(Date.now()-new Date(claim.createdAt).getTime())/3600000),escalation:claim.status==='Escalated'
  }));
  const setWorkItems = update => {
    const next = typeof update==='function'?update(workItems):update;
    return Promise.all(next.filter(item=>JSON.stringify(item)!==JSON.stringify(workItems.find(previous=>previous.id===item.id))).map(item=>updateClaim(item.id,{
      status:item.status,priority:item.priority,assignedSpecialist:item.assignedTo==='Unassigned'?null:item.assignedTo,
    })));
  };

  const [rules, setRules] = useRecords("workflow_rules");

  const assignWorkItem = (
    id,
    user
  ) => {
    setWorkItems(
      (previous) =>
        previous.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  assignedTo:
                    user,
                  status:
                    item.status ===
                    "New"
                      ? "In Progress"
                      : item.status,
                }
              : item
        )
    );
  };

  const changePriority = (
    id,
    priority
  ) => {
    setWorkItems(
      (previous) =>
        previous.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  priority,
                }
              : item
        )
    );
  };

  const escalateWorkItem = (
    id
  ) => {
    setWorkItems(
      (previous) =>
        previous.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  escalation:
                    true,
                }
              : item
        )
    );
  };

  const updateStatus = (
    id,
    status
  ) => {
    setWorkItems(
      (previous) =>
        previous.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                }
              : item
        )
    );
  };

  const addRule = (
    rule
  ) => {
    setRules(
      (previous) => [
        ...previous,
        {
          ...rule,
          id: `RULE-${Date.now()}`,
        },
      ]
    );
  };

  const updateRule = (
    id,
    data
  ) => {
    setRules(
      (previous) =>
        previous.map(
          (rule) =>
            rule.id === id
              ? {
                  ...rule,
                  ...data,
                }
              : rule
        )
    );
  };

  const deleteRule = (
    id
  ) => {
    setRules(
      (previous) =>
        previous.filter(
          (rule) =>
            rule.id !== id
        )
    );
  };

  return (
    <WorkflowContext.Provider
      value={{
        workItems,
        rules,
        assignWorkItem,
        changePriority,
        escalateWorkItem,
        updateStatus,
        addRule,
        updateRule,
        deleteRule,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  return useContext(
    WorkflowContext
  );
}

export default WorkflowProvider;

