import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const DocumentContext = createContext();

const initialDocuments = [
  {
    id: "DOC-1001",
    name: "Hospital_Bill.pdf",
    category: "Medical",
    folder: "Claims",
    tags: ["hospital", "bill"],
    type: "PDF",
    size: 245000,
    sizeLabel: "239 KB",
    uploadedDate: "2026-08-01",
    uploadedBy: "Manasa Rayavarapu",
    reviewStatus: "Accepted",
    scanStatus: "Accepted",
    version: 1,
    metadata: {
      description: "Hospital bill document",
      reference: "CLM-1001",
    },
    claimId: "CLM-1001",
  },
  {
    id: "DOC-1002",
    name: "Policy_Document.pdf",
    category: "Policy",
    folder: "Policies",
    tags: ["policy", "insurance"],
    type: "PDF",
    size: 512000,
    sizeLabel: "500 KB",
    uploadedDate: "2026-07-28",
    uploadedBy: "Manasa Rayavarapu",
    reviewStatus: "Pending",
    scanStatus: "Accepted",
    version: 1,
    metadata: {
      description: "Insurance policy document",
      reference: "HLT-2026-1001",
    },
    claimId: null,
  },
];

function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState(() => {
    const stored = localStorage.getItem(
      "claimcare_documents"
    );

    return stored
      ? JSON.parse(stored)
      : initialDocuments;
  });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_documents",
      JSON.stringify(documents)
    );
  }, [documents]);

  const addDocuments = (files) => {
    const newDocuments = files.map((file) => ({
      id: `DOC-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,

      name: file.name,

      category: "Other",

      folder: "General",

      tags: [],

      type:
        file.type === "application/pdf"
          ? "PDF"
          : file.type.startsWith("image/")
          ? "Image"
          : "File",

      size: file.size,

      sizeLabel: formatFileSize(
        file.size
      ),

      uploadedDate: new Date()
        .toISOString()
        .split("T")[0],

      uploadedBy:
        "Current User",

      reviewStatus: "Pending",

      scanStatus: "Scanning",

      version: 1,

      metadata: {
        description: "",
        reference: "",
      },

      fileUrl: URL.createObjectURL(
        file
      ),

      fileType: file.type,
    }));

    setDocuments((previous) => [
      ...newDocuments,
      ...previous,
    ]);

    return newDocuments;
  };

  const updateDocument = (
    id,
    data
  ) => {
    setDocuments((previous) =>
      previous.map((document) =>
        document.id === id
          ? {
              ...document,
              ...data,
            }
          : document
      )
    );
  };

  const deleteDocument = (id) => {
    setDocuments((previous) =>
      previous.filter(
        (document) =>
          document.id !== id
      )
    );
  };

  const replaceDocument = (
    id,
    file
  ) => {
    setDocuments((previous) =>
      previous.map((document) => {
        if (document.id !== id) {
          return document;
        }

        return {
          ...document,

          name: file.name,

          size: file.size,

          sizeLabel:
            formatFileSize(
              file.size
            ),

          type:
            file.type ===
            "application/pdf"
              ? "PDF"
              : file.type.startsWith(
                  "image/"
                )
              ? "Image"
              : "File",

          fileUrl:
            URL.createObjectURL(
              file
            ),

          fileType:
            file.type,

          version:
            document.version + 1,

          reviewStatus: "Pending",

          scanStatus: "Scanning",

          uploadedDate:
            new Date()
              .toISOString()
              .split("T")[0],
        };
      })
    );
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocuments,
        updateDocument,
        deleteDocument,
        replaceDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

function formatFileSize(bytes) {
  if (!bytes) {
    return "0 KB";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) /
      Math.log(1024)
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(1)} ${
    units[index]
  }`;
}

export function useDocuments() {
  return useContext(
    DocumentContext
  );
}

export default DocumentProvider;