import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const PolicyContext = createContext();

const initialPolicies = [
  {
    id: "POL-1001",
    policyNumber: "HLT-2026-1001",
    policyHolderName: "Manasa Rayavarapu",
    policyType: "Health",
    provider: "Secure Health Insurance",
    category: "Health",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    premiumAmount: 18500,
    coverageAmount: 500000,
    status: "Active",

    renewalReminder: true,
    reminderDays: 30,

    attachments: [
      {
        id: "ATT-001",
        name: "Health_Policy.pdf",
        type: "application/pdf",
        size: 245000,
      },
    ],

    claims: [
      {
        id: "CLM-1001",
        claimNumber: "CLM-2026-001",
        title: "Hospitalization Claim",
        status: "Under Review",
        amount: 75000,
      },
    ],

    timeline: [
      {
        date: "2026-01-01",
        title: "Policy Created",
        description:
          "Policy was added to the account.",
      },
      {
        date: "2026-01-02",
        title: "Policy Activated",
        description:
          "Policy became active.",
      },
    ],
  },

  {
    id: "POL-1002",
    policyNumber: "MTR-2026-2001",
    policyHolderName: "Manasa Rayavarapu",
    policyType: "Motor",
    provider: "SafeDrive Insurance",
    category: "Motor",
    startDate: "2026-03-15",
    endDate: "2027-03-14",
    premiumAmount: 12000,
    coverageAmount: 750000,
    status: "Active",

    renewalReminder: true,
    reminderDays: 30,

    attachments: [],

    claims: [],

    timeline: [
      {
        date: "2026-03-15",
        title: "Policy Created",
        description:
          "Motor policy was added.",
      },
      {
        date: "2026-03-15",
        title: "Policy Activated",
        description:
          "Policy became active.",
      },
    ],
  },

  {
    id: "POL-1003",
    policyNumber: "LIF-2025-3001",
    policyHolderName: "Manasa Rayavarapu",
    policyType: "Life",
    provider: "LifeSecure Insurance",
    category: "Life",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    premiumAmount: 25000,
    coverageAmount: 1000000,
    status: "Archived",

    renewalReminder: false,
    reminderDays: 30,

    attachments: [],

    claims: [],

    timeline: [
      {
        date: "2025-06-01",
        title: "Policy Created",
        description:
          "Life policy was added.",
      },
      {
        date: "2026-06-01",
        title: "Policy Archived",
        description:
          "Policy was removed from active policy views.",
      },
    ],
  },
];

function PolicyProvider({ children }) {
  const [policies, setPolicies] = useState(() => {
    const stored =
      localStorage.getItem("claimcare_policies");

    return stored
      ? JSON.parse(stored)
      : initialPolicies;
  });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_policies",
      JSON.stringify(policies)
    );
  }, [policies]);

  const addPolicy = (policy) => {
    const newPolicy = {
      ...policy,

      id: `POL-${Date.now()}`,

      attachments: [],
      claims: [],

      timeline: [
        {
          date: new Date()
            .toISOString()
            .split("T")[0],

          title: "Policy Created",

          description:
            "Policy was added to the account.",
        },
      ],
    };

    setPolicies((previous) => [
      newPolicy,
      ...previous,
    ]);

    return newPolicy;
  };

  const updatePolicy = (id, updatedData) => {
    setPolicies((previous) =>
      previous.map((policy) =>
        policy.id === id
          ? {
              ...policy,
              ...updatedData,
            }
          : policy
      )
    );
  };

  const archivePolicy = (id) => {
    setPolicies((previous) =>
      previous.map((policy) =>
        policy.id === id
          ? {
              ...policy,

              status: "Archived",

              timeline: [
                ...(policy.timeline || []),

                {
                  date: new Date()
                    .toISOString()
                    .split("T")[0],

                  title: "Policy Archived",

                  description:
                    "Policy was archived and removed from active views.",
                },
              ],
            }
          : policy
      )
    );
  };

  const restorePolicy = (id) => {
    setPolicies((previous) =>
      previous.map((policy) =>
        policy.id === id
          ? {
              ...policy,

              status: "Active",

              timeline: [
                ...(policy.timeline || []),

                {
                  date: new Date()
                    .toISOString()
                    .split("T")[0],

                  title: "Policy Restored",

                  description:
                    "Policy was restored to active status.",
                },
              ],
            }
          : policy
      )
    );
  };

  const updateAttachments = (
    policyId,
    attachments
  ) => {
    setPolicies((previous) =>
      previous.map((policy) =>
        policy.id === policyId
          ? {
              ...policy,
              attachments,
            }
          : policy
      )
    );
  };

  const getPolicy = (id) => {
    return policies.find(
      (policy) => policy.id === id
    );
  };

  return (
    <PolicyContext.Provider
      value={{
        policies,
        addPolicy,
        updatePolicy,
        archivePolicy,
        restorePolicy,
        updateAttachments,
        getPolicy,
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicies() {
  return useContext(PolicyContext);
}

export default PolicyProvider;