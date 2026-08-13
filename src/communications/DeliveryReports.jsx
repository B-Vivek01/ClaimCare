import { Link } from "react-router-dom";

import {
  useCommunication,
} from "./CommunicationContext";

function DeliveryReports() {
  const { broadcasts } =
    useCommunication();

  const totalRecipients =
    broadcasts.reduce(
      (sum, item) =>
        sum + item.recipients,
      0
    );

  const delivered =
    broadcasts.reduce(
      (sum, item) =>
        sum + item.delivered,
      0
    );

  const failed =
    broadcasts.reduce(
      (sum, item) =>
        sum + item.failed,
      0
    );

  const deliveryRate =
    totalRecipients > 0
      ? (
          (delivered /
            totalRecipients) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <main className="communication-page">
      <div className="communication-container">

        <div className="communication-header">

          <div>
            <span className="communication-badge">
              COM-14
            </span>

            <h1>
              Delivery Reports
            </h1>

            <p>
              View delivery outcomes for
              communications.
            </p>
          </div>

          <Link
            to="/communication"
            className="communication-secondary-button"
          >
            ← Communication Center
          </Link>

        </div>


        <div className="communication-summary">

          <div className="communication-summary-card">
            <span>RECIPIENTS</span>
            <strong>
              {totalRecipients}
            </strong>
            <small>
              Total recipients
            </small>
          </div>

          <div className="communication-summary-card">
            <span>DELIVERED</span>
            <strong>
              {delivered}
            </strong>
            <small>
              Successfully delivered
            </small>
          </div>

          <div className="communication-summary-card">
            <span>FAILED</span>
            <strong>
              {failed}
            </strong>
            <small>
              Failed deliveries
            </small>
          </div>

          <div className="communication-summary-card">
            <span>DELIVERY RATE</span>
            <strong>
              {deliveryRate}%
            </strong>
            <small>
              Overall delivery rate
            </small>
          </div>

        </div>


        <section className="communication-card">

          <div className="communication-card-header">

            <div>
              <span>
                DELIVERY OUTCOMES
              </span>

              <h2>
                Communication Reports
              </h2>
            </div>

          </div>


          <div className="communication-table-wrapper">

            <table className="communication-table">

              <thead>

                <tr>
                  <th>Campaign</th>
                  <th>Channel</th>
                  <th>Recipients</th>
                  <th>Delivered</th>
                  <th>Failed</th>
                  <th>Rate</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {broadcasts.map(
                  (broadcast) => {

                    const rate =
                      broadcast.recipients >
                      0
                        ? (
                            (broadcast.delivered /
                              broadcast.recipients) *
                            100
                          ).toFixed(1)
                        : "0.0";

                    return (
                      <tr
                        key={broadcast.id}
                      >

                        <td>
                          <strong>
                            {broadcast.name}
                          </strong>

                          <small>
                            {broadcast.id}
                          </small>
                        </td>

                        <td>
                          {broadcast.channel}
                        </td>

                        <td>
                          {broadcast.recipients}
                        </td>

                        <td>
                          {broadcast.delivered}
                        </td>

                        <td>
                          {broadcast.failed}
                        </td>

                        <td>
                          {rate}%
                        </td>

                        <td>
                          <span
                            className={`communication-status ${broadcast.status.toLowerCase()}`}
                          >
                            {broadcast.status}
                          </span>
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>
    </main>
  );
}

export default DeliveryReports;