import { Breadcrumbs } from "@mantine/core";
import { CaretRight } from "@phosphor-icons/react";
// import { useSelector } from "react-redux";
// import classes from "../Modules/Dashboard/Dashboard.module.css";
import classes from "../../Dashboard/Dashboard.module.css";

// eslint-disable-next-line react/prop-types
function CustomBread({ breadCrumbs }) {
  //   const currentModule = useSelector((state) => state.module.current_module);
  //   const activeTab = useSelector((state) => state.module.active_tab);

  // const items = [{ title: currentModule }, { title: activeTab }].map(
  //   (item, index) => (
  //     <Text key={index} className={classes.fusionText} fw={600}>
  //       {item.title}
  //     </Text>
  //   ),
  // );
  const items = breadCrumbs;
  console.log(items);

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

export default CustomBread;
