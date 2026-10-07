import { useClaims } from "../claim/ClaimContext";
import { useSearchParams } from "react-router-dom";
import {
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Footer from "../components/Footer";

import { useDocuments } from "./DocumentContext";

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
];

function DocumentUpload() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const {claims} = useClaims();
  const [claimId,setClaimId]=useState(params.get("claim") || "");

  const inputRef =
    useRef(null);

  const {
    addDocuments,
  } = useDocuments();

  const [files, setFiles] =
    useState([]);

  const [errors, setErrors] =
    useState([]);

  const [dragging, setDragging] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);


  const [success, setSuccess] =
    useState(false);

  const validateFiles =
    (selectedFiles) => {
      const valid = [];
      const newErrors = [];

      selectedFiles.forEach(
        (file) => {
          if (
            !allowedTypes.includes(
              file.type
            )
          ) {
            newErrors.push(
              `${file.name}: File type is not supported.`
            );

            return;
          }

          if (
            file.size >
            MAX_FILE_SIZE
          ) {
            newErrors.push(
              `${file.name}: Maximum file size is 10 MB.`
            );

            return;
          }

          valid.push(file);
        }
      );

      setErrors(newErrors);

      setFiles((previous) => [
        ...previous,
        ...valid,
      ]);
    };

  const handleInputChange =
    (event) => {
      validateFiles([
        ...event.target.files,
      ]);

      event.target.value = "";
    };

  const handleDrop =
    (event) => {
      event.preventDefault();

      setDragging(false);

      validateFiles([
        ...event.dataTransfer.files,
      ]);
    };

  const removeFile =
    (index) => {
      setFiles((previous) =>
        previous.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
      );
    };

  const uploadFiles = async () => {
      if (!files.length) { setErrors(['Please select at least one file.']); return; }
      setUploading(true);
      setErrors([]);
      try {
        if (claimId && !claims.some(claim=>claim.id===claimId)) throw new Error("Choose an available claim.");
        await addDocuments(files,claimId || null);
        setSuccess(true);
        navigate('/documents');
      } catch (error) {
        setErrors([error.message || 'Upload failed. Please retry.']);
      } finally { setUploading(false); }
    };

  return (
    <>

      <main className="document-page">

        <div className="document-container">
          <label htmlFor="upload-claim">Related claim (optional)</label><select id="upload-claim" value={claimId} onChange={event=>setClaimId(event.target.value)} disabled={uploading}><option value="">Unlinked document</option>{claims.map(claim=><option key={claim.id} value={claim.id}>{claim.claimNumber}</option>)}</select>

          <div className="document-header">

            <div>

              <span className="document-badge">
                DOCUMENT MANAGEMENT
              </span>

              <h1>
                Upload Documents
              </h1>

              <p>
                Upload one or multiple documents
                securely.
              </p>

            </div>

            <Link
              to="/documents"
              className="document-secondary-button"
            >
              ← Documents
            </Link>

          </div>


          <section className="document-upload-card">

            <div
              className={
                dragging
                  ? "document-dropzone dragging"
                  : "document-dropzone"
              }
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() =>
                setDragging(false)
              }
              onDrop={handleDrop}
              onClick={() =>
                inputRef.current?.click()
              }
            >

              <div className="document-upload-icon">
                ↑
              </div>

              <h2>
                Drag & Drop Files Here
              </h2>

              <p>
                or click to select multiple files
              </p>

              <span>
                PDF, JPG, PNG, WEBP, TXT ·
                Maximum 10 MB per file
              </span>

              <input
                ref={inputRef}
                type="file"
                multiple
                accept={allowedTypes.join(
                  ","
                )}
                onChange={
                  handleInputChange
                }
                hidden
              />

            </div>


            <div className="document-mobile-upload">

              <button
                className="document-secondary-button"
                onClick={() =>
                  inputRef.current?.click()
                }
              >
                📷 Select / Capture File
              </button>

              <small>
                On supported mobile devices,
                the browser may provide camera
                or file capture options.
              </small>

            </div>


            {errors.length > 0 && (

              <div className="document-error">

                {errors.map(
                  (error) => (
                    <div
                      key={error}
                    >
                      {error}
                    </div>
                  )
                )}

              </div>

            )}


            {files.length > 0 && (

              <div className="document-selected-files">

                <div className="document-card-title">

                  <div>

                    <span>
                      DOC-02
                    </span>

                    <h2>
                      Selected Files
                    </h2>

                  </div>

                  <strong>
                    {files.length}
                  </strong>

                </div>


                {files.map(
                  (
                    file,
                    index
                  ) => (

                    <div
                      className="document-upload-item"
                      key={`${file.name}-${index}`}
                    >

                      <div>

                        <span>
                          📄
                        </span>

                        <div>

                          <strong>
                            {file.name}
                          </strong>

                          <small>
                            {formatFileSize(
                              file.size
                            )}
                          </small>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          removeFile(
                            index
                          )
                        }
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

            )}


            {uploading && (

              <div className="document-upload-progress" role="status" aria-busy="true">

                <div>

                  <span>
                    Uploading...
                  </span>

                  <strong>Please wait while files are stored.</strong>

                </div>


              </div>

            )}


            {success && (

              <div className="document-success">
                ✓ Documents uploaded successfully.
              </div>

            )}


            <div className="document-upload-actions">

              <button
                className="document-secondary-button"
                onClick={() =>
                  navigate(
                    "/documents"
                  )
                }
              >
                Cancel
              </button>

              <button
                className="document-primary-button"
                disabled={uploading}
                onClick={
                  uploadFiles
                }
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Documents"}
              </button>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

function formatFileSize(
  bytes
) {
  if (!bytes) {
    return "0 KB";
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

export default DocumentUpload;

