import { useRecords } from "../data/useRecords";
import { useAuth } from "../auth/AuthContext";
import {
  createContext,
  useContext,
} from "react";

const ClaimContext = createContext();

function ClaimProvider({ children }) {
  const [claims, setClaims, loading] = useRecords("claims");
  const { user, profile } = useAuth();
  const [internalNotes, setInternalNotes] = useRecords("claim_internal");

  const getClaim = (id) => {
    const claim = claims.find(item => item.id === id);
    return claim ? { ...claim, internalNotes: internalNotes.filter(item => item.claimId === id) } : undefined;
  };

  const createClaim = async (data) => {
    const id = `CLM-${crypto.randomUUID()}`;

    const claim = {
      id,

      claimNumber: `CC-${new Date()
        .getFullYear()}-${String(
        Date.now()
      ).slice(-5)}`,

      customerName:
        profile?.name || user?.displayName || user?.email || "",

      status: "Draft",

      progress: 0,

      priority: "Medium",

      assignedSpecialist: null,

      sla: {
        status: "Not Started",
        remainingHours: null,
      },

      outstandingActions: [],

      tasks: [],

      messages: [],

      documents: [],

      tags: [],

      timeline: [],

      milestones: [],

      statusHistory: [],

      expectedNextStep:
        "Complete the claim information.",

      internalNotes: [],

      closure: {
        checklistCompleted: false,
        feedbackRequested: false,
        rating: null,
        notes: "",
      },

      archived: false,

      createdAt:
        new Date()
          .toISOString()
          .split("T")[0],

      ...data,
    };

    const saved = await setClaims((previous) => [
      claim,
      ...previous,
    ]);

    if (!saved) throw new Error('Claim could not be saved. Please retry.');
    return claim;
  };

  const updateClaim = (
    id,
    updatedData
  ) => {
    return setClaims((previous) =>
      previous.map((claim) =>
        claim.id === id
          ? {
              ...claim,
              ...(typeof updatedData === 'function' ? updatedData(claim) : updatedData),
            }
          : claim
      )
    );
  };

  const updateClaimStatus = (
    id,
    newStatus
  ) => {
    return setClaims((previous) =>
      previous.map((claim) => {
        if (claim.id !== id) {
          return claim;
        }

        const previousStatus =
          claim.status;

        return {
          ...claim,

          status: newStatus,
          progress: ({Draft:0,Submitted:25,'Under Review':50,'In Review':50,Escalated:60,Approved:75,Rejected:100,Closed:100,'Reopen Requested':25})[newStatus] ?? claim.progress,
          expectedNextStep: ({'Under Review':'A specialist is reviewing this claim.','In Review':'A specialist is reviewing this claim.',Escalated:'An escalated review is pending.',Approved:'Complete the closure review.',Rejected:'Contact support if you want to request reopening.',Closed:'Claim review is complete.','Reopen Requested':'Wait for staff to review the reopen request.'})[newStatus] || claim.expectedNextStep,

          statusHistory: [
            ...(claim.statusHistory || []),

            {
              date: new Date()
                .toISOString()
                .split("T")[0],

              from: previousStatus,

              to: newStatus,
            },
          ],

          timeline: [
            ...(claim.timeline || []),

            {
              date: new Date()
                .toISOString()
                .split("T")[0],

              title:
                `Status changed to ${newStatus}`,

              description:
                `Claim status changed from ${previousStatus} to ${newStatus}.`,
            },
          ],
        };
      })
    );
  };

  const archiveClaim = (id) => {
    return updateClaim(id, {
      archived: true,
    });
  };

  const reopenClaim = (id) => {
    return updateClaim(id, {
      status: "Reopen Requested",
      archived: false,
    });
  };

  const addInternalNote = (id, note) => {
    if (!note.trim() || !getClaim(id)) return;
    return setInternalNotes(previous => [...previous, { id: `IN-${crypto.randomUUID()}`, claimId: id, note: note.trim(), author: profile?.name || user?.email, date: new Date().toISOString() }]);
  };

  const addTag = (id, tag) => {
    const claim = getClaim(id);

    if (!claim || !tag.trim()) {
      return;
    }

    if (
      claim.tags?.includes(
        tag.trim()
      )
    ) {
      return;
    }

    return updateClaim(id, {
      tags: [
        ...(claim.tags || []),
        tag.trim(),
      ],
    });
  };

  const removeTag = (
    id,
    tag
  ) => {
    const claim = getClaim(id);

    if (!claim) {
      return;
    }

    return updateClaim(id, {
      tags: (
        claim.tags || []
      ).filter(
        (item) => item !== tag
      ),
    });
  };

  const updateClosure = (
    id,
    closure
  ) => {
    return updateClaim(id, {
      closure,
    });
  };

  if (loading) return <main aria-busy="true" style={{ padding: '4rem' }}>Loading claims…</main>;
  return (
    <ClaimContext.Provider
      value={{
        claims,
        getClaim,
        createClaim,
        updateClaim,
        updateClaimStatus,
        archiveClaim,
        reopenClaim,
        addInternalNote,
        addTag,
        removeTag,
        updateClosure,
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
}

export function useClaims() {
  return useContext(
    ClaimContext
  );
}

export default ClaimProvider;


