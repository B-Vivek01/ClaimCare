import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  useCommunication,
} from "./CommunicationContext";

function CampaignHistory() {
  const {
    campaigns,
  } = useCommunication();

  const [
    status,
    setStatus,
  ] = useState("All");

  const [
    channel,
    setChannel,
  ] = useState("All");

  const filteredCampaigns =
    useMemo(() => {
      return campaigns.filter(
        (campaign) => {
          return (
            (status === "All" ||
              campaign.status ===
                status) &&
            (channel === "All" ||
              campaign.channel ===
                channel)
          );
        }
      );
    }, [
      campaigns,
      status,
      channel,
    ]);

  const totalRecipients =
    campaigns.reduce(
      (sum, campaign) =>
        sum +
        Number(
          campaign.recipients ||
            0
        ),
      0
    );

  const totalDelivered =
    campaigns.reduce(
      (sum, campaign) =>
        sum +
        Number(
          campaign.delivered ||
            0
        ),
      0
    );

  const totalFailed =
    campaigns.reduce(
      (sum, campaign) =>
        sum +
        Number(
          campaign.failed ||
            0
        ),
      0
    );

  const deliveryRate =
    totalRecipients
      ? Math.round(
          (totalDelivered /
            totalRecipients) *
            100
        )
      : 0;

  return (
    <>
      <Navbar />

      <main className="communication-page">

        <div className="communication-container">

          <div className="communication-header">

            <div>

              <span className="communication-badge">
                CAMPAIGN HISTORY
              </span>

              <h1>
                Campaign History
              </h1>

              <p>
                Review previous broadcasts and
                delivery outcomes.
              </p>

            </div>

            <Link
              to="/communication"
              className="communication-secondary-button"
            >
              ← Communication
            </Link>

          </div>


          <div className="communication-stat-grid">

            <Stat
              label="Campaigns"
              value={
                campaigns.length
              }
            />

            <Stat
              label="Recipients"
              value={
                totalRecipients
              }
            />

            <Stat
              label="Delivered"
              value={
                totalDelivered
              }
            />

            <Stat
              label="Delivery Rate"
              value={`${deliveryRate}%`}
            />

          </div>


          <section className="communication-list-card">

            <div className="communication-toolbar">

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Failed">
                  Failed
                </option>

              </select>


              <select
                value={channel}
                onChange={(event) =>
                  setChannel(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Channels
                </option>

                <option value="Email">
                  Email
                </option>

                <option value="SMS">
                  SMS
                </option>

                <option value="WhatsApp">
                  WhatsApp
                </option>

              </select>

            </div>


            <div className="campaign-table-wrapper">

              <table className="campaign-table">

                <thead>

                  <tr>

                    <th>
                      Campaign
                    </th>

                    <th>
                      Channel
                    </th>

                    <th>
                      Group
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Recipients
                    </th>

                    <th>
                      Delivered
                    </th>

                    <th>
                      Failed
                    </th>

                    <th>
                      Delivery Rate
                    </th>

                    <th>
                      Scheduled
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredCampaigns.map(
                    (campaign) => {

                      const rate =
                        campaign.recipients
                          ? Math.round(
                              (campaign.delivered /
                                campaign.recipients) *
                                100
                            )
                          : 0;

                      return (
                        <tr
                          key={
                            campaign.id
                          }
                        >

                          <td>

                            <strong>
                              {
                                campaign.name
                              }
                            </strong>

                            <small>
                              {
                                campaign.id
                              }
                            </small>

                          </td>

                          <td>
                            <span className="campaign-channel">
                              {
                                campaign.channel
                              }
                            </span>
                          </td>

                          <td>
                            {
                              campaign.group
                            }
                          </td>

                          <td>
                            <span
                              className={
                                campaign.status ===
                                "Completed"
                                  ? "campaign-status completed"
                                  : campaign.status ===
                                    "Failed"
                                  ? "campaign-status failed"
                                  : "campaign-status scheduled"
                              }
                            >
                              {
                                campaign.status
                              }
                            </span>
                          </td>

                          <td>
                            {
                              campaign.recipients
                            }
                          </td>

                          <td>
                            {
                              campaign.delivered
                            }
                          </td>

                          <td>
                            {
                              campaign.failed
                            }
                          </td>

                          <td>
                            {rate}%
                          </td>

                          <td>
                            {
                              campaign.scheduledAt
                            }
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>


            {filteredCampaigns.length ===
              0 && (

              <div className="communication-empty">

                <h3>
                  No campaigns found
                </h3>

                <p>
                  Change your filters to view
                  campaign history.
                </p>

              </div>

            )}

          </section>


          <section className="communication-delivery-card">

            <div>

              <span>
                COM-14
              </span>

              <h2>
                Delivery Report
              </h2>

              <p>
                Overall delivery performance
                across available campaigns.
              </p>

            </div>


            <div className="delivery-report-grid">

              <div>
                <span>
                  Total Recipients
                </span>

                <strong>
                  {
                    totalRecipients
                  }
                </strong>
              </div>

              <div>
                <span>
                  Delivered
                </span>

                <strong>
                  {
                    totalDelivered
                  }
                </strong>
              </div>

              <div>
                <span>
                  Failed
                </span>

                <strong>
                  {
                    totalFailed
                  }
                </strong>
              </div>

              <div>
                <span>
                  Delivery Rate
                </span>

                <strong>
                  {deliveryRate}%
                </strong>
              </div>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

function Stat({
  label,
  value,
}) {
  return (
    <div className="communication-stat-card">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default CampaignHistory;