import { useRecords } from "../data/useRecords";
import { storeFile } from "../data/files";
import { useAuth } from "../auth/AuthContext";
import {
  createContext,
  useContext,
} from "react";

const DocumentContext = createContext();

function DocumentProvider({ children }) {
  const [documents, setDocuments, loading] = useRecords("documents");
  const { user, profile } = useAuth();

  const addDocuments = async (files, claimId = null, category = 'Other') => {
    const uploaded = [];
    for (const file of files) uploaded.push({ name: file.name, size: file.size, type: file.type, ...await storeFile(file) });
    const newDocuments = uploaded.map((file) => ({
      id: `DOC-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,

      name: file.name,

      category,
      claimId,

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
        profile?.name || user?.email || "",

      reviewStatus: "Pending",

      scanStatus: "Not scanned",

      version: 1,

      metadata: {
        description: "",
        reference: "",
      },

      storagePath: file.storagePath,

      fileType: file.type,
    }));

    const saved = await setDocuments((previous) => [
      ...newDocuments,
      ...previous,
    ]);

    if (!saved) throw new Error('Document metadata could not be saved. Please retry.');
    return newDocuments;
  };

  const updateDocument = (
    id,
    data
  ) => {
    return setDocuments((previous) =>
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

  const replaceDocument = async (
    id,
    file
  ) => {
    const stored = await storeFile(file);
    const saved = await setDocuments((previous) =>
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

          ...stored,
          versions: [...(document.versions || []), { version: document.version, fileUrl: document.fileUrl, storagePath: document.storagePath, name: document.name }],

          fileType:
            file.type,

          version:
            document.version + 1,

          reviewStatus: "Pending",
          reviewReason: "",
          reviewedBy: null,
          reviewedAt: null,

          scanStatus: "Not scanned",

          uploadedDate:
            new Date()
              .toISOString()
              .split("T")[0],
        };
      })
    );
    if (!saved) throw new Error('Replacement could not be saved. Please retry.');
  };

  if (loading) return <main aria-busy="true" style={{ padding: '4rem' }}>Loading documents…</main>;
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

