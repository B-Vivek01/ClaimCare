import {
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

function Broadcast() {
  const {
    groups,
    templates,
    createGroup,
    createCampaign,
  } = useCommunication();

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState(
    groups[0]?.name || ""
  );

  const [
    selectedChannel,
    setSelectedChannel,
  ] = useState("Email");

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState("");

  const [
    campaignName,
    setCampaignName,
  ] = useState("");

  const [
    scheduleDate,
    setScheduleDate,
  ] = useState("");

  const [
    scheduleTime,
    setScheduleTime,
  ] = useState("");

  const [
    showGroupForm,
    setShowGroupForm,
  ] = useState(false);

  const [
    groupName,
    setGroupName,
  ] = useState("");

  const [
    groupDescription,
    setGroupDescription,
  ] = useState("");

  const channelTemplates =
    templates.filter(
      (template) =>
        template.channel ===
        selectedChannel
    );

  const currentGroup =
    groups.find(
      (group) =>
        group.name ===
        selectedGroup
    );

  const createNewGroup =
    () => {
      if (
        !groupName.trim()
      ) {
        return;
      }

      createGroup({
        name: groupName,
        description:
          groupDescription,
      });

      setGroupName("");
      setGroupDescription("");
      setShowGroupForm(false);
    };

  const scheduleCampaign =
    () => {
      if (
        !campaignName.trim() ||
        !selectedGroup ||
        !selectedChannel ||
        !scheduleDate ||
        !scheduleTime
      ) {
        alert(
          "Please complete all required fields."
        );

        return;
      }

      createCampaign({
        name: campaignName,
        channel:
          selectedChannel,
        group:
          selectedGroup,
        template:
          selectedTemplate,
        recipients:
          currentGroup?.count ||
          0,
        scheduledAt:
          `${scheduleDate} ${scheduleTime}`,
      });

      setCampaignName("");
      setSelectedTemplate("");
      setScheduleDate("");
      setScheduleTime("");

      alert(
        "Broadcast scheduled successfully."
      );
    };

  return (
    <>
      <Navbar />

      <main className="communication-page">

        <div className="communication-container">

          <div className="communication-header">

            <div>

              <span className="communication-badge">
                BROADCAST CENTER
              </span>

              <h1>
                Scheduled Broadcast
              </h1>

              <p>
                Select customers, choose a
                channel and schedule a broadcast.
              </p>

            </div>

            <Link
              to="/communication"
              className="communication-secondary-button"
            >
              ← Communication
            </Link>

          </div>


          <div className="broadcast-layout">

            <section className="communication-list-card">

              <div className="communication-card-header">

                <div>

                  <span>
                    COM-11
                  </span>

                  <h2>
                    Customer Groups
                  </h2>

                </div>

                <button
                  className="communication-primary-button"
                  onClick={() =>
                    setShowGroupForm(
                      (value) =>
                        !value
                    )
                  }
                >
                  + Group
                </button>

              </div>


              {showGroupForm && (

                <div className="broadcast-group-form">

                  <input
                    value={groupName}
                    onChange={(event) =>
                      setGroupName(
                        event.target.value
                      )
                    }
                    placeholder="Group name"
                  />

                  <input
                    value={
                      groupDescription
                    }
                    onChange={(event) =>
                      setGroupDescription(
                        event.target.value
                      )
                    }
                    placeholder="Description"
                  />

                  <button
                    className="communication-primary-button"
                    onClick={
                      createNewGroup
                    }
                  >
                    Create
                  </button>

                </div>

              )}


              <div className="broadcast-groups">

                {groups.map(
                  (group) => (

                    <button
                      key={
                        group.id
                      }
                      className={
                        selectedGroup ===
                        group.name
                          ? "broadcast-group active"
                          : "broadcast-group"
                      }
                      onClick={() =>
                        setSelectedGroup(
                          group.name
                        )
                      }
                    >

                      <div>

                        <strong>
                          {
                            group.name
                          }
                        </strong>

                        <small>
                          {
                            group.description
                          }
                        </small>

                      </div>

                      <span>
                        {
                          group.count
                        }
                      </span>

                    </button>

                  )
                )}

              </div>

            </section>


            <section className="communication-list-card">

              <div className="communication-card-header">

                <div>

                  <span>
                    COM-12
                  </span>

                  <h2>
                    Schedule Broadcast
                  </h2>

                </div>

              </div>


              <div className="broadcast-form">

                <div>

                  <label>
                    Campaign Name
                  </label>

                  <input
                    value={
                      campaignName
                    }
                    onChange={(event) =>
                      setCampaignName(
                        event.target.value
                      )
                    }
                    placeholder="Example: Renewal Reminder"
                  />

                </div>


                <div>

                  <label>
                    Customer Group
                  </label>

                  <select
                    value={
                      selectedGroup
                    }
                    onChange={(event) =>
                      setSelectedGroup(
                        event.target.value
                      )
                    }
                  >

                    {groups.map(
                      (group) => (

                        <option
                          key={
                            group.id
                          }
                        >
                          {
                            group.name
                          }
                        </option>

                      )
                    )}

                  </select>

                </div>


                <div>

                  <label>
                    Channel
                  </label>

                  <select
                    value={
                      selectedChannel
                    }
                    onChange={(event) => {
                      setSelectedChannel(
                        event.target.value
                      );

                      setSelectedTemplate(
                        ""
                      );
                    }}
                  >

                    <option>
                      Email
                    </option>

                    <option>
                      SMS
                    </option>

                    <option>
                      WhatsApp
                    </option>

                  </select>

                </div>


                <div>

                  <label>
                    Template
                  </label>

                  <select
                    value={
                      selectedTemplate
                    }
                    onChange={(event) =>
                      setSelectedTemplate(
                        event.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Template
                    </option>

                    {channelTemplates.map(
                      (template) => (

                        <option
                          key={
                            template.id
                          }
                          value={
                            template.name
                          }
                        >
                          {
                            template.name
                          }
                        </option>

                      )
                    )}

                  </select>

                </div>


                <div>

                  <label>
                    Schedule Date
                  </label>

                  <input
                    type="date"
                    value={
                      scheduleDate
                    }
                    onChange={(event) =>
                      setScheduleDate(
                        event.target.value
                      )
                    }
                  />

                </div>


                <div>

                  <label>
                    Schedule Time
                  </label>

                  <input
                    type="time"
                    value={
                      scheduleTime
                    }
                    onChange={(event) =>
                      setScheduleTime(
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="broadcast-summary">

                  <span>
                    Recipients
                  </span>

                  <strong>
                    {
                      currentGroup?.count ||
                      0
                    }
                  </strong>

                </div>


                <button
                  className="communication-primary-button broadcast-submit"
                  onClick={
                    scheduleCampaign
                  }
                >
                  Schedule Broadcast
                </button>

              </div>

            </section>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Broadcast;