import { storeFile, fileUrl } from "../data/files";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { usePolicies } from "./PolicyContext";

function PolicyAttachments() {
  const { id } = useParams();

  const {
    getPolicy,
    updateAttachments,
  } = usePolicies();

  const policy = getPolicy(id);

  const fileInputRef = useRef(null);

  const [error, setError] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  if (!policy) {
    return (
      <div className="policy-empty-page">
        Policy not found.
      </div>
    );
  }

  const handleUpload = async (event) => {
    const file=event.target.files?.[0];
    if (!file) return;
    event.target.value=''; setError(''); setSuccess(false); setUploading(true);
    try {
      const stored=await storeFile(file);
      const saved=await updateAttachments(id,[...(policy.attachments || []),{id:`ATT-${crypto.randomUUID()}`,name:file.name,type:file.type,size:file.size,...stored}]);
      if (!saved) throw new Error('Attachment could not be saved.');
      setSuccess(true);
    } catch (issue) {setError(issue.message || 'Upload failed.');}
    finally {setUploading(false);}
  };

  const handleDownload = async (attachment) => {
    try {
      const link=document.createElement('a');
      link.href=await fileUrl(attachment.storagePath,true); link.download=attachment.name; link.click();
    } catch (issue) {setError(issue.message || 'Download failed.');}
  };

  const formatSize = (size) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(
        size / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      size /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  return (
    <>
      

      <main className="policy-page">

        <div className="policy-container">

          <div className="policy-header">

            <div>

              <span className="policy-badge">
                POL-07
              </span>

              <h1>
                Policy Attachments
              </h1>

              <p>
                {policy.policyNumber}
              </p>

            </div>

          </div>


          <section className="policy-card">

            <div className="policy-form">

              <div
                className="attachment-upload"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <div className="attachment-upload-icon">
                  ↑
                </div>

                <strong>
                  Upload Policy Attachment
                </strong>

                <span>
                  Click to select a file. Maximum
                  size 10 MB.
                </span>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleUpload}
              />


              {uploading && (

                <div className="policy-loading">
                  Uploading...
                </div>

              )}


              {error && (

                <div className="policy-form-error">
                  {error}
                </div>

              )}


              {success && (

                <div className="policy-success">
                  ✓ Attachment uploaded successfully.
                </div>

              )}


              <div className="attachment-list">

                <h3>
                  Attachments
                </h3>

                {policy.attachments?.length ? (

                  policy.attachments.map(
                    (attachment) => (

                      <div
                        className="attachment-item"
                        key={attachment.id}
                      >

                        <div>

                          <strong>
                            {attachment.name}
                          </strong>

                          <span>
                            {formatSize(
                              attachment.size
                            )}
                          </span>

                        </div>

                        <button
                          className="policy-action-link"
                          onClick={() =>
                            handleDownload(
                              attachment
                            )
                          }
                        >
                          Download
                        </button>

                      </div>

                    )
                  )

                ) : (

                  <div className="policy-empty-inline">

                    No attachments available.

                  </div>

                )}

              </div>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default PolicyAttachments;
