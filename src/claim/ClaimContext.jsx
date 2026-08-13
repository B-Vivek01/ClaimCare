import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ClaimContext = createContext();

const initialClaims = [
  {
    id: "CLM-1001",
    claimNumber: "CC-2026-1001",

    policyNumber: "HLT-2026-1001",

    customerName: "Manasa Rayavarapu",

    category: "Health",
    template: "Hospitalization",

    status: "Under Review",

    priority: "High",

    progress: 65,

    incidentDate: "2026-07-20",

    incidentType: "Hospitalization",

    incidentLocation: "Hyderabad",

    incidentDescription:
      "Hospitalization due to medical treatment.",

    notes:
      "Hospital bills and discharge summary are available.",

    assignedSpecialist:
      "Rahul Sharma",

    sla: {
      status: "On Track",
      remainingHours: 36,
    },

    outstandingActions: [
      {
        id: "TASK-001",
        title: "Upload discharge summary",
        completed: false,
      },
      {
        id: "TASK-002",
        title: "Confirm hospital details",
        completed: false,
      },
    ],

    tasks: [
      {
        id: "TASK-001",
        title: "Upload discharge summary",
        status: "Pending",
      },
      {
        id: "TASK-002",
        title: "Confirm hospital details",
        status: "Pending",
      },
    ],

    messages: [
      {
        id: "MSG-001",
        sender: "Rahul Sharma",
        message:
          "Please upload the discharge summary.",
        date: "2026-07-25",
      },
    ],

    documents: [
      {
        id: "DOC-001",
        name: "Hospital_Bill.pdf",
        type: "PDF",
        status: "Accepted",
      },
    ],

    tags: [
      "Hospitalization",
      "Medical",
    ],

    timeline: [
      {
        date: "2026-07-20",
        title: "Incident Reported",
        description:
          "Customer reported the incident.",
      },
      {
        date: "2026-07-21",
        title: "Claim Created",
        description:
          "Claim was created successfully.",
      },
      {
        date: "2026-07-22",
        title: "Documents Received",
        description:
          "Initial supporting documents were received.",
      },
      {
        date: "2026-07-23",
        title: "Review Started",
        description:
          "Claim specialist started reviewing the claim.",
      },
    ],

    milestones: [
      {
        title: "Claim Created",
        status: "completed",
      },
      {
        title: "Documents Submitted",
        status: "completed",
      },
      {
        title: "Claim Review",
        status: "current",
      },
      {
        title: "Decision",
        status: "upcoming",
      },
      {
        title: "Closure",
        status: "upcoming",
      },
    ],

    statusHistory: [
      {
        date: "2026-07-21",
        from: "Draft",
        to: "Submitted",
      },
      {
        date: "2026-07-23",
        from: "Submitted",
        to: "Under Review",
      },
    ],

    expectedNextStep:
      "Upload the discharge summary and confirm hospital details.",

    internalNotes: [
      {
        id: "IN-001",
        author: "Rahul Sharma",
        note:
          "Initial review completed.",
        date: "2026-07-23",
      },
    ],

    createdAt: "2026-07-21",

    closure: {
      checklistCompleted: false,
      feedbackRequested: false,
      rating: null,
      notes: "",
    },

    archived: false,
  },

  {
    id: "CLM-1002",
    claimNumber: "CC-2026-1002",

    policyNumber: "MTR-2026-2001",

    customerName: "Manasa Rayavarapu",

    category: "Motor",
    template: "Vehicle Accident",

    status: "Draft",

    priority: "Medium",

    progress: 25,

    incidentDate: "",
    incidentType: "Vehicle Accident",
    incidentLocation: "",
    incidentDescription: "",

    notes: "",

    assignedSpecialist: null,

    sla: {
      status: "Not Started",
      remainingHours: null,
    },

    outstandingActions: [],

    tasks: [],

    messages: [],

    documents: [],

    tags: ["Motor"],

    timeline: [],

    milestones: [
      {
        title: "Claim Information",
        status: "current",
      },
      {
        title: "Incident Information",
        status: "upcoming",
      },
      {
        title: "Documents",
        status: "upcoming",
      },
      {
        title: "Review",
        status: "upcoming",
      },
    ],

    statusHistory: [],

    expectedNextStep:
      "Continue entering incident information.",

    internalNotes: [],

    createdAt: "2026-08-01",

    closure: {
      checklistCompleted: false,
      feedbackRequested: false,
      rating: null,
      notes: "",
    },

    archived: false,
  },
];

function ClaimProvider({ children }) {
  const [claims, setClaims] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_claims"
      );

    return stored
      ? JSON.parse(stored)
      : initialClaims;
  });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_claims",
      JSON.stringify(claims)
    );
  }, [claims]);

  const getClaim = (id) => {
    return claims.find(
      (claim) => claim.id === id
    );
  };

  const createClaim = (data) => {
    const id = `CLM-${Date.now()}`;

    const claim = {
      id,

      claimNumber: `CC-${new Date()
        .getFullYear()}-${String(
        Date.now()
      ).slice(-5)}`,

      customerName:
        "Manasa Rayavarapu",

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

    setClaims((previous) => [
      claim,
      ...previous,
    ]);

    return claim;
  };

  const updateClaim = (
    id,
    updatedData
  ) => {
    setClaims((previous) =>
      previous.map((claim) =>
        claim.id === id
          ? {
              ...claim,
              ...updatedData,
            }
          : claim
      )
    );
  };

  const updateClaimStatus = (
    id,
    newStatus
  ) => {
    setClaims((previous) =>
      previous.map((claim) => {
        if (claim.id !== id) {
          return claim;
        }

        const previousStatus =
          claim.status;

        return {
          ...claim,

          status: newStatus,

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
    updateClaim(id, {
      archived: true,
      status: "Archived",
    });
  };

  const reopenClaim = (id) => {
    updateClaimStatus(
      id,
      "Reopen Requested"
    );

    updateClaim(id, {
      archived: false,
    });
  };

  const addInternalNote = (
    id,
    note
  ) => {
    const claim = getClaim(id);

    if (!claim) {
      return;
    }

    updateClaim(id, {
      internalNotes: [
        ...(claim.internalNotes || []),

        {
          id: `IN-${Date.now()}`,
          author: "Current User",
          note,
          date: new Date()
            .toISOString()
            .split("T")[0],
        },
      ],
    });
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

    updateClaim(id, {
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

    updateClaim(id, {
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
    updateClaim(id, {
      closure,
    });
  };

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