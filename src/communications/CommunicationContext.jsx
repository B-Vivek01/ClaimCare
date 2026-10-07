import { useRecords } from "../data/useRecords";
import { useProfileSetting } from "../backend/useProfileSetting";
import {
  createContext,
  useContext,
} from "react";

const CommunicationContext = createContext();

const initialSettings = {
  emailEnabled: true,
  smsEnabled: true,
  whatsappEnabled: true,
  readReceipts: true,
  attachmentLimit: 10,
};

function CommunicationProvider({ children }) {
  const [conversations, setConversations] = useRecords("conversations");

  const [templates, setTemplates] = useRecords("communication_templates");

  const [broadcasts, setBroadcasts] = useRecords("broadcasts");

  const [settings, setSettings] = useProfileSetting("communication_settings", initialSettings);

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
