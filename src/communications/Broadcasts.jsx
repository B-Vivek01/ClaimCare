import {
  useState,
} from "react";
import { Link } from "react-router-dom";

import {
  useCommunication,
} from "./CommunicationContext";

const customerGroups = [
  {
    name: "All Customers",
    count: 850,
  },
  {
    name: "Customers with Upcoming Renewals",
    count: 125,
  },
  {
    name: "Active Claim Customers",
    count: 210,
  },
  {
    name: "Medical Policy Customers",
    count: 180,
  },
];

function Broadcasts() {
  const {
    broadcasts,
    templates,
    createBroadcast,
  } = useCommunication();

  const [name, setName] =
    useState("");

  const [channel, setChannel] =
    useState("Email");

  const [group, setGroup] =
    useState(customerGroups[0].name);

  const [message, setMessage] =
    useState("");

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [selectedTemplate, setSelectedTemplate] =
    useState("");

  const channelTemplates =
    templates.filter(
      (template) =>
        template.channel === channel
    );

  const selectedGroup =
    customerGroups.find(
      (item) => item.name === group
    );

  const create = () => {
    if (
      !name.trim() ||
      !message.trim() ||
      !scheduledAt
    ) {
      return;
    }

    createBroadcast({
      name,
      channel,
      group,
      status: "Scheduled",
      scheduledAt,
      recipients:
        selectedGroup?.count || 0,
    });

    setName("");
    setMessage("");
    setScheduledAt("");
    setSelectedTemplate("");
  };

  const useTemplate = (id) => {
    const template =
      templates.find(
        (item) => item.id === id
      );

    if (template) {
      setMessage(template.body);
    }
  };

  return (
    <main className="communication-page">
      <div className="communication-container">

        <div className="communication-header">

          <div>
            <span className="communication-badge">
              COM-11 → COM-13
            </span>

            <h1>
              Broadcasts
            </h1>

            <p>
              Create customer broadcasts and
              schedule campaigns.
            </p>
          </div>

          <Link
            to="/communication"
            className="communication-secondary-button"
          >
            ← Communication Center
          </Link>

        </div>


        <div className="communication-template-layout">

          <section className="communication-card">

            <div className="communication-card-header">

              <div>
                <span>
                  NEW CAMPAIGN
                </span>

                <h2>
                  Schedule Broadcast
                </h2>
              </div>

            </div>


            <div className="communication-form">

              <label>
                Campaign Name

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Campaign name"
                />
              </label>


              <label>
                Channel

                <select
                  value={channel}
                  onChange={(e) => {
                    setChannel(
                      e.target.value
                    );
                    setSelectedTemplate("");
                  }}
                >
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
              </label>


              <label>
                Customer Group

                <select
                  value={group}
                  onChange={(e) =>
                    setGroup(e.target.value)
                  }
                >
                  {customerGroups.map(
                    (item) => (
                      <option
                        key={item.name}
                        value={item.name}
                      >
                        {item.name} (
                        {item.count})
                      </option>
                    )
                  )}
                </select>
              </label>


              <label>
                Use Template

                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(
                      e.target.value
                    );

                    useTemplate(
                      e.target.value
                    );
                  }}
                >
                  <option value="">
                    No Template
                  </option>

                  {channelTemplates.map(
                    (template) => (
                      <option
                        key={template.id}
                        value={template.id}
                      >
                        {template.name}
                      </option>
                    )
                  )}
                </select>
              </label>


              <label>
                Message

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  rows="6"
                  placeholder="Write broadcast message..."
                />
              </label>


              <label>
                Schedule Date & Time

                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) =>
                    setScheduledAt(
                      e.target.value
                    )
                  }
                />
              </label>


              <div className="communication-recipient-preview">

                <span>
                  RECIPIENTS
                </span>

                <strong>
                  {selectedGroup?.count || 0}
                </strong>

                <small>
                  customers selected
                </small>

              </div>


              <button
                className="communication-primary-button"
                onClick={create}
              >
                Schedule Broadcast
              </button>

            </div>

          </section>


          <section className="communication-card">

            <div className="communication-card-header">

              <div>
                <span>
                  CUSTOMER GROUPS
                </span>

                <h2>
                  Available Groups
                </h2>
              </div>

            </div>


            <div className="communication-group-list">

              {customerGroups.map(
                (item) => (

                  <div
                    key={item.name}
                    className={`communication-group ${
                      group === item.name
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setGroup(item.name)
                    }
                  >

                    <div>
                      <strong>
                        {item.name}
                      </strong>

                      <small>
                        Customer group
                      </small>
                    </div>

                    <span>
                      {item.count}
                    </span>

                  </div>
                )
              )}

            </div>

          </section>

        </div>


        <section className="communication-card">

          <div className="communication-card-header">

            <div>
              <span>
                COM-13
              </span>

              <h2>
                Campaign History
              </h2>
            </div>

          </div>


          <div className="communication-broadcast-list">

            {broadcasts.map(
              (broadcast) => (

                <div
                  key={broadcast.id}
                  className="communication-broadcast-item"
                >

                  <div>
                    <span>
                      {broadcast.id}
                    </span>

                    <h3>
                      {broadcast.name}
                    </h3>

                    <p>
                      {broadcast.channel} ·{" "}
                      {broadcast.group}
                    </p>
                  </div>

                  <div>
                    <strong>
                      {broadcast.recipients}
                    </strong>

                    <small>
                      recipients
                    </small>
                  </div>

                  <div>
                    <span
                      className={`communication-status ${broadcast.status.toLowerCase()}`}
                    >
                      {broadcast.status}
                    </span>

                    <small>
                      {new Date(
                        broadcast.scheduledAt
                      ).toLocaleString()}
                    </small>
                  </div>

                </div>
              )
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default Broadcasts;