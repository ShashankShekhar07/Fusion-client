import { Breadcrumbs, Text } from "@mantine/core";
import { CaretRight } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import classes from "../../Dashboard/Dashboard.module.css";

function CustomBreadcrumbs({ activeTab, subTab }) {
  const currentModule = useSelector((state) => state.module.current_module);

  const items = [
    { title: currentModule },
    { title: activeTab },
    // Conditionally include subTab only if activeTab is "Manage Bookings"
    ...(activeTab === "Manage Bookings" && subTab ? [{ title: subTab }] : []),
  ]
    .filter((item) => item.title) // Filter out undefined or null items
    .map((item, index) => (
      <Text key={index} className={classes.fusionText} fw={600}>
        {item.title}
      </Text>
    ));

  return (
    <Breadcrumbs
      separator={
        <CaretRight className={classes.fusionCaretIcon} weight="bold" />
      }
      mt="xs"
      ml={{ md: "lg" }}
    >
      {items}
    </Breadcrumbs>
  );
}
CustomBreadcrumbs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  subTab: PropTypes.string,
};

export default CustomBreadcrumbs;
