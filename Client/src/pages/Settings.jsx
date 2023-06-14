import React, { useState } from "react";
import Form from "../components/commons/Form";
import { useEffect } from "react";
import { useAuth } from "../context/auth";
import _ from "lodash";
import authService from "../services/authService";

function Settings() {
  const [settings, setSettings] = useState({});

  const [user, dispatch] = useAuth();

  useEffect(() => {
    authService.getUser().then(({ data }) => {
      setSettings({
        notification1: data.Notificacion1,
        notification2: data.Notificacion2,
        notification3: data.Notificacion3,
      });
    });
  }, []);

  const handleSettings = async (data) => {
    console.log(data);

    authService.updateSettings(data).then(console.log);
  };

  if (_.isEmpty(settings)) return <div>CARGANDO</div>;
  return (
    <div className="notifications-form">
      <Form
      className="notifications"
      header={<h1 style={{ fontSize: "40px" }}>Notification Management</h1>}
        inputs={[
          { name: "notification1", label: "Monthly Employee Status" , type: "checkbox", style: {width: "15px", height: "15px" }},
          { name: "notification2", label: "Employees Status Update", type: "checkbox", style: { width: "15px", height: "15px" } },
          { name: "notification3", label: "Weekly Employees Status", type: "checkbox", style: { width: "15px", height: "15px" } },
        ]}
        defaultValues={settings}
        submitLabel= "SEND"
        onSubmit={handleSettings}
      />{" "}
    </div>
  );
}
export default Settings;
