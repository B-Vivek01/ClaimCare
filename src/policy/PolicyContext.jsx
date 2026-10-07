import { useRecords } from "../data/useRecords";
import {
  createContext,
  useContext,
} from "react";

const PolicyContext = createContext();

function PolicyProvider({ children }) {
  const [policies, setPolicies, loading] = useRecords("policies");

  const addPolicy = async (policy) => {
    const newPolicy = {
      ...policy,

      id: `POL-${crypto.randomUUID()}`,

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

    const saved = await setPolicies((previous) => [
      newPolicy,
      ...previous,
    ]);

    if (!saved) throw new Error('Policy could not be saved. Please retry.');
    return newPolicy;
  };

  const updatePolicy = (id, updatedData) => {
    return setPolicies((previous) =>
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
    return setPolicies((previous) =>
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

  if (loading) return <main aria-busy="true" style={{ padding: '4rem' }}>Loading policies…</main>;
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

