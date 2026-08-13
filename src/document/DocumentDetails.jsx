import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  useDocuments,
} from "./DocumentContext";

function DocumentDetails() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    documents,
    updateDocument,
    replaceDocument,
  } = useDocuments();

  const document =
    documents.find(
      (item) =>
        item.id === id
    );

  const inputRef =
    useState(null);

  const [zoom, setZoom] =
    useState(1);

  const [rotation, setRotation] =
    useState(0);

  const [tag, setTag] =
    useState("");

  const [description, setDescription] =
    useState(
      document?.metadata
        ?.description || ""
    );

  const [reference, setReference] =
    useState(
      document?.metadata
        ?.reference || ""
    );

  if (!document) {
    return (
      <div className="document-empty-page">
        <h1>
          Document Not Found
        </h1>

        <button
          className="document-primary-button"
          onClick={() =>
            navigate(
              "/documents"
            )
          }
        >
          Back to Documents
        </button>
      </div>
    );
  }

  const saveMetadata =
    () => {
      updateDocument(id, {
        metadata: {
          description,
          reference,
        },
      });
    };

  const addTag = () => {
    if (!tag.trim()) {
      return;
    }

    if (
      document.tags.includes(
        tag.trim()
      )
    ) {
      return;
    }

    updateDocument(id, {
      tags: [
        ...document.tags,
        tag.trim(),
      ],
    });

    setTag("");
  };

  const removeTag =
    (tagToRemove) => {
      updateDocument(id, {
        tags: document.tags.filter(
          (item) =>
            item !==
            tagToRemove
        ),
      });
    };

  const changeCategory =
    (value) => {
      updateDocument(id, {
        category: value,
      });
    };

  const changeFolder =
    (value) => {
      updateDocument(id, {
        folder: value,
      });
    };

  const replaceFile =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      replaceDocument(
        id,
        file
      );
    };

  const downloadDocument =
    () => {
      if (
        !document.fileUrl
      ) {
        alert(
          "This sample document does not have a local file attached."
        );

        return;
      }

      const link =
        window.document.createElement(
          "a"
        );

      link.href =
        document.fileUrl;

      link.download =
        document.name;

      link.click();
    };

  return (
    <>

      <main className="document-page">

        <div className="document-container">

          <div className="document-header">

            <div>

              <span className="document-badge">
                DOCUMENT DETAILS
              </span>

              <h1>
                {document.name}
              </h1>

              <p>
                Version{" "}
                {document.version}
                {" · "}
                {document.sizeLabel}
              </p>

            </div>

            <Link
              to="/documents"
              className="document-secondary-button"
            >
              ← Documents
            </Link>

          </div>


          <div className="document-details-grid">

            <section className="document-preview-card">

              <div className="document-preview-toolbar">

                <button
                  onClick={() =>
                    setZoom(
                      (value) =>
                        Math.min(
                          value +
                            0.1,
                          2
                        )
                    )
                  }
                >
                  +
                </button>

                <span>
                  {Math.round(
                    zoom * 100
                  )}%
                </span>

                <button
                  onClick={() =>
                    setZoom(
                      (value) =>
                        Math.max(
                          value -
                            0.1,
                          0.5
                        )
                    )
                  }
                >
                  −
                </button>

                <button
                  onClick={() =>
                    setRotation(
                      (value) =>
                        value +
                        90
                    )
                  }
                >
                  ↻
                </button>

                <button
                  onClick={
                    downloadDocument
                  }
                >
                  ↓
                </button>

              </div>


              <div className="document-preview">

                {document.fileUrl &&
                document.type ===
                  "Image" ? (

                  <img
                    src={
                      document.fileUrl
                    }
                    alt={
                      document.name
                    }
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                  />

                ) : (

                  <div className="document-preview-placeholder">

                    <div>
                      📄
                    </div>

                    <strong>
                      {document.name}
                    </strong>

                    <span>
                      {document.type}
                      {" · "}
                      Preview available
                      when a file is attached.
                    </span>

                  </div>

                )}

              </div>

            </section>


            <div>

              <section className="document-detail-card">

                <div className="document-card-title">

                  <div>

                    <span>
                      DOC-08
                    </span>

                    <h2>
                      Classification
                    </h2>

                  </div>

                </div>


                <div className="document-field">

                  <label>
                    Category
                  </label>

                  <select
                    value={
                      document.category
                    }
                    onChange={(event) =>
                      changeCategory(
                        event.target.value
                      )
                    }
                  >

                    <option value="Medical">
                      Medical
                    </option>

                    <option value="Policy">
                      Policy
                    </option>

                    <option value="Identity">
                      Identity
                    </option>

                    <option value="Financial">
                      Financial
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                <div className="document-field">

                  <label>
                    Folder
                  </label>

                  <select
                    value={
                      document.folder
                    }
                    onChange={(event) =>
                      changeFolder(
                        event.target.value
                      )
                    }
                  >

                    <option value="Claims">
                      Claims
                    </option>

                    <option value="Policies">
                      Policies
                    </option>

                    <option value="General">
                      General
                    </option>

                  </select>

                </div>

              </section>


              <section className="document-detail-card">

                <div className="document-card-title">

                  <div>

                    <span>
                      DOC-09
                    </span>

                    <h2>
                      Tags
                    </h2>

                  </div>

                </div>


                <div className="document-tags">

                  {document.tags.map(
                    (item) => (

                      <span
                        key={item}
                      >

                        {item}

                        <button
                          onClick={() =>
                            removeTag(
                              item
                            )
                          }
                        >
                          ×
                        </button>

                      </span>

                    )
                  )}

                </div>


                <div className="document-tag-form">

                  <input
                    value={tag}
                    onChange={(event) =>
                      setTag(
                        event.target.value
                      )
                    }
                    placeholder="Add tag"
                  />

                  <button
                    className="document-small-button"
                    onClick={
                      addTag
                    }
                  >
                    Add
                  </button>

                </div>

              </section>


              <section className="document-detail-card">

                <div className="document-card-title">

                  <div>

                    <span>
                      DOC-10
                    </span>

                    <h2>
                      Metadata
                    </h2>

                  </div>

                </div>


                <div className="document-field">

                  <label>
                    Description
                  </label>

                  <textarea
                    value={
                      description
                    }
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="document-field">

                  <label>
                    Reference
                  </label>

                  <input
                    value={
                      reference
                    }
                    onChange={(event) =>
                      setReference(
                        event.target.value
                      )
                    }
                  />

                </div>


                <button
                  className="document-primary-button"
                  onClick={
                    saveMetadata
                  }
                >
                  Save Metadata
                </button>

              </section>


              <section className="document-detail-card">

                <div className="document-card-title">

                  <div>

                    <span>
                      DOC-17
                    </span>

                    <h2>
                      Replace Version
                    </h2>

                  </div>

                </div>

                <p className="document-description">
                  Upload a replacement file.
                  The current version will be
                  retained in the document record.
                </p>

                <input
                  type="file"
                  ref={inputRef}
                  onChange={
                    replaceFile
                  }
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.txt"
                />

              </section>


              <section className="document-detail-card">

                <div className="document-card-title">

                  <div>

                    <span>
                      DOC-18
                    </span>

                    <h2>
                      Review Status
                    </h2>

                  </div>

                </div>

                <div className="document-review-grid">

                  <div>

                    <span>
                      Review
                    </span>

                    <strong>
                      {
                        document.reviewStatus
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Security Scan
                    </span>

                    <strong>
                      {
                        document.scanStatus
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Version
                    </span>

                    <strong>
                      v
                      {
                        document.version
                      }
                    </strong>

                  </div>

                </div>

              </section>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default DocumentDetails;