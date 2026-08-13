import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CommunicationContext =
  createContext();

const initialConversations = [
  {
    id: "CONV-1001",
    customerId: "CUS-1001",
    customer: "Rahul Kumar",
    subject: "Claim Status Update",
    channel: "Email",
    unread: true,
    updatedAt: "2026-08-11 09:15",
    messages: [
      {
        id: "MSG-001",
        sender: "customer",
        senderName: "Rahul Kumar",
        text: "I would like to know the current status of my claim.",
        time: "2026-08-11 09:10",
        read: true,
        attachment: null,
      },
      {
        id: "MSG-002",
        sender: "agent",
        senderName: "Support Team",
        text: "Your claim is currently under review.",
        time: "2026-08-11 09:15",
        read: false,
        attachment: null,
      },
    ],
  },
  {
    id: "CONV-1002",
    customerId: "CUS-1002",
    customer: "Priya Sharma",
    subject: "Policy Renewal",
    channel: "SMS",
    unread: false,
    updatedAt: "2026-08-10 16:30",
    messages: [
      {
        id: "MSG-003",
        sender: "agent",
        senderName: "Support Team",
        text: "Your policy renewal is due soon.",
        time: "2026-08-10 16:30",
        read: true,
        attachment: null,
      },
    ],
  },
  {
    id: "CONV-1003",
    customerId: "CUS-1003",
    customer: "Anil Kumar",
    subject: "Document Request",
    channel: "WhatsApp",
    unread: true,
    updatedAt: "2026-08-10 13:20",
    messages: [
      {
        id: "MSG-004",
        sender: "customer",
        senderName: "Anil Kumar",
        text: "I have uploaded the requested document.",
        time: "2026-08-10 13:20",
        read: true,
        attachment: "Hospital_Bill.pdf",
      },
    ],
  },
];

const initialTemplates = [
  {
    id: "TPL-001",
    name: "Claim Submitted",
    channel: "Email",
    subject: "Your claim has been submitted",
    body: "Hello {{customer_name}}, your claim {{claim_id}} has been successfully submitted.",
    enabled: true,
  },
  {
    id: "TPL-002",
    name: "Claim Status Update",
    channel: "SMS",
    subject: "",
    body: "Claim {{claim_id}} status: {{claim_status}}. Login to ClaimCare for details.",
    enabled: true,
  },
  {
    id: "TPL-003",
    name: "Policy Renewal",
    channel: "WhatsApp",
    subject: "",
    body: "Hello {{customer_name}}, your policy {{policy_number}} is due for renewal on {{renewal_date}}.",
    enabled: true,
  },
];

const initialGroups = [
  {
    id: "GRP-001",
    name: "Active Policy Customers",
    count: 1250,
    description: "Customers with active policies",
  },
  {
    id: "GRP-002",
    name: "Pending Claims",
    count: 86,
    description: "Customers with pending claims",
  },
  {
    id: "GRP-003",
    name: "Policy Renewal Customers",
    count: 142,
    description: "Customers with upcoming renewals",
  },
];

const initialCampaigns = [
  {
    id: "CMP-001",
    name: "August Renewal Reminder",
    channel: "Email",
    group: "Policy Renewal Customers",
    status: "Completed",
    recipients: 142,
    delivered: 138,
    failed: 4,
    scheduledAt: "2026-08-01 09:00",
  },
  {
    id: "CMP-002",
    name: "Claim Documentation Reminder",
    channel: "SMS",
    group: "Pending Claims",
    status: "Scheduled",
    recipients: 86,
    delivered: 0,
    failed: 0,
    scheduledAt: "2026-08-12 10:00",
  },
];

function CommunicationProvider({
  children,
}) {
  const [
    conversations,
    setConversations,
  ] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_conversations"
      );

    return stored
      ? JSON.parse(stored)
      : initialConversations;
  });

  const [
    templates,
    setTemplates,
  ] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_communication_templates"
      );

    return stored
      ? JSON.parse(stored)
      : initialTemplates;
  });

  const [
    groups,
    setGroups,
  ] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_customer_groups"
      );

    return stored
      ? JSON.parse(stored)
      : initialGroups;
  });

  const [
    campaigns,
    setCampaigns,
  ] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_campaigns"
      );

    return stored
      ? JSON.parse(stored)
      : initialCampaigns;
  });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_conversations",
      JSON.stringify(
        conversations
      )
    );
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_communication_templates",
      JSON.stringify(
        templates
      )
    );
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_customer_groups",
      JSON.stringify(groups)
    );
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_campaigns",
      JSON.stringify(
        campaigns
      )
    );
  }, [campaigns]);

  const sendMessage = (
    conversationId,
    message,
    attachment = null
  ) => {
    const newMessage = {
      id: `MSG-${Date.now()}`,
      sender: "agent",
      senderName: "Support Team",
      text: message,
      time: new Date().toLocaleString(),
      read: false,
      attachment,
    };

    setConversations(
      (previous) =>
        previous.map(
          (conversation) =>
            conversation.id ===
            conversationId
              ? {
                  ...conversation,
                  unread: false,
                  updatedAt:
                    new Date().toLocaleString(),
                  messages: [
                    ...conversation.messages,
                    newMessage,
                  ],
                }
              : conversation
        )
    );
  };

  const markConversationRead = (
    conversationId
  ) => {
    setConversations(
      (previous) =>
        previous.map(
          (conversation) =>
            conversation.id ===
            conversationId
              ? {
                  ...conversation,
                  unread: false,
                  messages:
                    conversation.messages.map(
                      (message) => ({
                        ...message,
                        read: true,
                      })
                    ),
                }
              : conversation
        )
    );
  };

  const createTemplate = (
    template
  ) => {
    setTemplates(
      (previous) => [
        ...previous,
        {
          ...template,
          id: `TPL-${Date.now()}`,
          enabled: true,
        },
      ]
    );
  };

  const updateTemplate = (
    id,
    data
  ) => {
    setTemplates(
      (previous) =>
        previous.map(
          (template) =>
            template.id === id
              ? {
                  ...template,
                  ...data,
                }
              : template
        )
    );
  };

  const deleteTemplate = (
    id
  ) => {
    setTemplates(
      (previous) =>
        previous.filter(
          (template) =>
            template.id !== id
        )
    );
  };

  const createGroup = (
    group
  ) => {
    setGroups(
      (previous) => [
        ...previous,
        {
          ...group,
          id: `GRP-${Date.now()}`,
          count: 0,
        },
      ]
    );
  };

  const createCampaign = (
    campaign
  ) => {
    setCampaigns(
      (previous) => [
        ...previous,
        {
          ...campaign,
          id: `CMP-${Date.now()}`,
          status: "Scheduled",
          delivered: 0,
          failed: 0,
        },
      ]
    );
  };

  return (
    <CommunicationContext.Provider
      value={{
        conversations,
        templates,
        groups,
        campaigns,
        sendMessage,
        markConversationRead,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        createGroup,
        createCampaign,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunication() {
  return useContext(
    CommunicationContext
  );
}

export default CommunicationProvider;