import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CommunicationContext = createContext();

const initialConversations = [
  {
    id: "CON-1001",
    type: "Customer",
    customer: "Rahul Kumar",
    subject: "Medical Claim Documents",
    status: "Open",
    unread: 2,
    lastMessage: "Please provide the hospital discharge summary.",
    updatedAt: "2026-08-13T09:30:00",
    messages: [
      {
        id: "MSG-001",
        sender: "Rahul Kumar",
        senderType: "Customer",
        text: "What documents are required for my medical claim?",
        createdAt: "2026-08-13T08:30:00",
        read: true,
        attachments: [],
      },
      {
        id: "MSG-002",
        sender: "Support Team",
        senderType: "Internal",
        text: "Please provide the hospital discharge summary.",
        createdAt: "2026-08-13T09:30:00",
        read: false,
        attachments: [],
      },
    ],
  },
  {
    id: "CON-1002",
    type: "Internal",
    customer: "Claims Operations",
    subject: "CLM-1003 Escalation",
    status: "Open",
    unread: 1,
    lastMessage: "The claim has crossed the SLA threshold.",
    updatedAt: "2026-08-13T08:45:00",
    messages: [
      {
        id: "MSG-003",
        sender: "Claims Operations",
        senderType: "Internal",
        text: "The claim has crossed the SLA threshold.",
        createdAt: "2026-08-13T08:45:00",
        read: false,
        attachments: [],
      },
    ],
  },
  {
    id: "CON-1003",
    type: "Customer",
    customer: "Priya Sharma",
    subject: "Claim Status Update",
    status: "Open",
    unread: 0,
    lastMessage: "Thank you for the update.",
    updatedAt: "2026-08-12T16:20:00",
    messages: [
      {
        id: "MSG-004",
        sender: "Support Team",
        senderType: "Internal",
        text: "Your vehicle claim is currently under review.",
        createdAt: "2026-08-12T16:00:00",
        read: true,
        attachments: [],
      },
      {
        id: "MSG-005",
        sender: "Priya Sharma",
        senderType: "Customer",
        text: "Thank you for the update.",
        createdAt: "2026-08-12T16:20:00",
        read: true,
        attachments: [],
      },
    ],
  },
];

const initialTemplates = [
  {
    id: "TPL-001",
    name: "Claim Documents Request",
    channel: "Email",
    subject: "Documents Required for Your Claim",
    body:
      "Hello {{customerName}}, please provide the required documents for claim {{claimId}}.",
    status: "Active",
  },
  {
    id: "TPL-002",
    name: "Claim Status Update",
    channel: "SMS",
    subject: "",
    body:
      "Hello {{customerName}}, your claim {{claimId}} is currently {{claimStatus}}.",
    status: "Active",
  },
  {
    id: "TPL-003",
    name: "Claim Approved",
    channel: "WhatsApp",
    subject: "",
    body:
      "Hello {{customerName}}, your claim {{claimId}} has been approved.",
    status: "Active",
  },
];

const initialBroadcasts = [
  {
    id: "CMP-001",
    name: "Policy Renewal Reminder",
    channel: "Email",
    group: "Customers with Upcoming Renewals",
    status: "Sent",
    scheduledAt: "2026-08-10T10:00:00",
    recipients: 125,
    delivered: 120,
    failed: 5,
  },
  {
    id: "CMP-002",
    name: "Service Announcement",
    channel: "SMS",
    group: "All Customers",
    status: "Scheduled",
    scheduledAt: "2026-08-15T09:00:00",
    recipients: 850,
    delivered: 0,
    failed: 0,
  },
];

const initialSettings = {
  emailEnabled: true,
  smsEnabled: true,
  whatsappEnabled: true,
  readReceipts: true,
  attachmentLimit: 10,
};

function CommunicationProvider({ children }) {
  const [conversations, setConversations] =
    useState(() => {
      const stored = localStorage.getItem(
        "claimcare_conversations"
      );

      return stored
        ? JSON.parse(stored)
        : initialConversations;
    });

  const [templates, setTemplates] =
    useState(() => {
      const stored = localStorage.getItem(
        "claimcare_communication_templates"
      );

      return stored
        ? JSON.parse(stored)
        : initialTemplates;
    });

  const [broadcasts, setBroadcasts] =
    useState(() => {
      const stored = localStorage.getItem(
        "claimcare_broadcasts"
      );

      return stored
        ? JSON.parse(stored)
        : initialBroadcasts;
    });

  const [settings, setSettings] =
    useState(() => {
      const stored = localStorage.getItem(
        "claimcare_communication_settings"
      );

      return stored
        ? JSON.parse(stored)
        : initialSettings;
    });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_conversations",
      JSON.stringify(conversations)
    );
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_communication_templates",
      JSON.stringify(templates)
    );
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_broadcasts",
      JSON.stringify(broadcasts)
    );
  }, [broadcasts]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_communication_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const sendMessage = (
    conversationId,
    text,
    attachments = []
  ) => {
    if (!text.trim() && attachments.length === 0) {
      return;
    }

    const newMessage = {
      id: `MSG-${Date.now()}`,
      sender: "Support Team",
      senderType: "Internal",
      text: text.trim(),
      createdAt: new Date().toISOString(),
      read: true,
      attachments,
    };

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                newMessage,
              ],
              lastMessage:
                text.trim() ||
                `${attachments.length} attachment(s)`,
              updatedAt:
                newMessage.createdAt,
            }
          : conversation
      )
    );
  };

  const markConversationRead = (id) => {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              unread: 0,
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

  const createConversation = ({
    type,
    customer,
    subject,
    message,
  }) => {
    const now = new Date().toISOString();

    const newConversation = {
      id: `CON-${Date.now()}`,
      type,
      customer,
      subject,
      status: "Open",
      unread: 0,
      lastMessage: message,
      updatedAt: now,
      messages: [
        {
          id: `MSG-${Date.now()}`,
          sender: "Support Team",
          senderType: "Internal",
          text: message,
          createdAt: now,
          read: true,
          attachments: [],
        },
      ],
    };

    setConversations((previous) => [
      newConversation,
      ...previous,
    ]);

    return newConversation.id;
  };

  const closeConversation = (id) => {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              status: "Closed",
            }
          : conversation
      )
    );
  };

  const addTemplate = (template) => {
    setTemplates((previous) => [
      ...previous,
      {
        ...template,
        id: `TPL-${Date.now()}`,
      },
    ]);
  };

  const updateTemplate = (id, data) => {
    setTemplates((previous) =>
      previous.map((template) =>
        template.id === id
          ? {
              ...template,
              ...data,
            }
          : template
      )
    );
  };

  const deleteTemplate = (id) => {
    setTemplates((previous) =>
      previous.filter(
        (template) => template.id !== id
      )
    );
  };

  const createBroadcast = (broadcast) => {
    setBroadcasts((previous) => [
      {
        ...broadcast,
        id: `CMP-${Date.now()}`,
        delivered: 0,
        failed: 0,
      },
      ...previous,
    ]);
  };

  const updateSettings = (data) => {
    setSettings((previous) => ({
      ...previous,
      ...data,
    }));
  };

  const unreadCount = conversations.reduce(
    (total, conversation) =>
      total + conversation.unread,
    0
  );

  return (
    <CommunicationContext.Provider
      value={{
        conversations,
        templates,
        broadcasts,
        settings,
        unreadCount,
        sendMessage,
        markConversationRead,
        createConversation,
        closeConversation,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        createBroadcast,
        updateSettings,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunication() {
  return useContext(CommunicationContext);
}

export default CommunicationProvider;