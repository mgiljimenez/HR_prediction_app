
import React, { useState } from "react";
import Form from "../components/commons/Form";
import { useEffect } from "react";
import { useAuth } from "../context/auth";
import _ from "lodash";
import authService from "../services/authService"

function Settings() {

   const [settings,setSettings] = useState({});


  const [user, dispatch] = useAuth();

  useEffect(() => {
    authService.getUser().then(({data}) => {
      
        setSettings({notification1:data.Notificacion1,notification2:data.Notificacion2,notification3:data.Notificacion3})
    })
  }, [])
 
  const handleSettings = async (data) => {
    console.log(data);
    
    authService.updateSettings(data).then(console.log);

  

  };

  if(_.isEmpty(settings)) return <div>CARGANDO</div>
  return (
   
       
         
              <Form
                header={"Gestionar notificaciones"}
                inputs={[
                  { name: "notification1", label: "Notificación A", type: "checkbox" },
                  { name: "notification2", label: "Notificación B", type: "checkbox" },
                  { name: "notification3", label: "Notificación C", type: "checkbox" },
                ]}

                defaultValues={
                    settings
  
                }
                submitLabel="Guardar"
                onSubmit={handleSettings}
              />
         
      );
}
export default Settings;