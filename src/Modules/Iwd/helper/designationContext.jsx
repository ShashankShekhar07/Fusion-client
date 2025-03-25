import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { host } from "../../../routes/globalRoutes";

export const DesignationsContext = createContext();

export function DesignationsProvider({ children }) {
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    const getDesignations = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${host}/iwdModuleV2/api/fetch-designations/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        setDesignations(response.data.holdsDesignations);
      } catch (error) {
        console.error(error);
      }
    };

    getDesignations();
  }, []);
  return (
    <DesignationsContext.Provider value={designations}>
      {children}
    </DesignationsContext.Provider>
  );
}
DesignationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
