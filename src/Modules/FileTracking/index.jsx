import React from "react";
import { useMantineTheme } from "@mantine/core";
import { useDispatch } from "react-redux";
import SectionNavigation from "./components/SectionNavigation";
import CustomBreadcrumbs from "../../components/Breadcrumbs";
import { setActiveTab_, setCurrentModule } from "../../redux/moduleslice";

function FileTracking() {
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  dispatch(setCurrentModule("File Tracking"));
  dispatch(setActiveTab_("Compose File"));
  return (
    <>
      <CustomBreadcrumbs />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "80vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 7.5,
            marginRight: theme.spacing.md,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <SectionNavigation />
        </div>
        {/* <div style={{ flex: 2.5, height: "100%", overflow: "hidden" }}>
        <SideNotifications />
      </div> */}
      </div>
    </>
  );
}

export default FileTracking;
