import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WorkflowContext =
  createContext();

const initialWorkItems = [
  {
    id: "CLM-1001",
    customer: "Rahul Kumar",
    type: "Medical Claim",
    status: "New",
    priority: "High",
    team: "Medical Claims",
    assignedTo: "Unassigned",
    createdAt: "2026-08-10T08:30:00",
    slaHours: 24,
    elapsedHours: 18,
    escalation: false,
  },
  {
    id: "CLM-1002",
    customer: "Priya Sharma",
    type: "Vehicle Claim",
    status: "In Progress",
    priority: "Medium",
    team: "Motor Claims",
    assignedTo: "Arjun",
    createdAt: "2026-08-10T05:30:00",
    slaHours: 48,
    elapsedHours: 20,
    escalation: false,
  },
  {
    id: "CLM-1003",
    customer: "Anil Kumar",
    type: "Medical Claim",
    status: "Pending Documents",
    priority: "High",
    team: "Medical Claims",
    assignedTo: "Meena",
    createdAt: "2026-08-09T06:30:00",
    slaHours: 24,
    elapsedHours: 26,
    escalation: true,
  },
  {
    id: "CLM-1004",
    customer: "Sneha Reddy",
    type: "Property Claim",
    status: "In Progress",
    priority: "Low",
    team: "Property Claims",
    assignedTo: "Arjun",
    createdAt: "2026-08-08T10:30:00",
    slaHours: 72,
    elapsedHours: 32,
    escalation: false,
  },
];

const initialRules = [
  {
    id: "RULE-001",
    name: "Medical Claim Assignment",
    event: "Claim Submitted",
    condition: "Category = Medical",
    action: "Assign to Medical Claims",
    enabled: true,
  },
  {
    id: "RULE-002",
    name: "High Priority Escalation",
    event: "SLA Threshold",
    condition: "Priority = High",
    action: "Escalate to Manager",
    enabled: true,
  },
];

function WorkflowProvider({
  children,
}) {
  const [
    workItems,
    setWorkItems,
  ] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_work_items"
      );

    return stored
      ? JSON.parse(stored)
      : initialWorkItems;
  });

  const [
    rules,
    setRules,
  ] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_workflow_rules"
      );

    return stored
      ? JSON.parse(stored)
      : initialRules;
  });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_work_items",
      JSON.stringify(
        workItems
      )
    );
  }, [workItems]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_workflow_rules",
      JSON.stringify(rules)
    );
  }, [rules]);

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