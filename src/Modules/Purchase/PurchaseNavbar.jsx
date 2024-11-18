import React from "react";
import { Tabs, Group, MantineProvider, Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import CustomBreadcrumbs from "./components/BreadCrumbs";

const TabsModules = [
  {
    label: "File an Indent",
    id: "file-indent",
    url: "/purchase",
  },
  {
    label: "Filed Indents",
    id: "all-filed-indents",
    url: "/purchase/all_filed_indents",
  },
  {
    label: "Saved indents",
    id: "saved-indents",
    url: "/purchase/saved_indents",
  },
  {
    label: "Inbox",
    id: "inbox",
    url: "/purchase/inbox",
  },
  { label: "Outbox", id: "outbox", url: "/purchase/outbox" },
  {
    label: "Archieved Indents",
    id: "archieved-indents",
    url: "/purchase/archieved_indents",
  },
  {
    label: "Stock Entry",
    id: "stock-entry",
    url: "/purchase/stock_entry",
  },
];

export default function PurchaseNavbar() {
  const [activeTab, setActiveTab] = React.useState("file-indent");
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    const tab = TabsModules.find((t) => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
      navigate(tab.url);
    }
  };

  const filteredTabs = TabsModules.filter((tab) => {
    return [
      "file-indent",
      "all-filed-indents",
      "saved-indents",
      "inbox",
      "outbox",
      "archieved-indents",
      "stock-entry",
    ].includes(tab.id);
  });

  const activeTabLabel = filteredTabs.find(
    (tab) => tab.id === activeTab,
  )?.label;
  const activeTabIndex = filteredTabs.findIndex((tab) => tab.id === activeTab);
  const handleNextTab = () => {
    if (activeTabIndex < filteredTabs.length - 1) {
      const nextTab = filteredTabs[activeTabIndex + 1];
      handleTabChange(nextTab.id);
    }
  };

  const handlePreviousTab = () => {
    if (activeTabIndex > 0) {
      const prevTab = filteredTabs[activeTabIndex - 1];
      handleTabChange(prevTab.id);
    }
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <CustomBreadcrumbs activeTab={activeTabLabel} />
      <div className="booking-management">
        <Group position="apart" noWrap>
          <Button
            variant="subtle"
            compact
            onClick={handlePreviousTab}
            disabled={activeTabIndex === 0}
          >
            <IconChevronLeft size={18} />
          </Button>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            // defaultValue="file-indent"
          >
            <Tabs.List>
              {filteredTabs.map((tab) => (
                <Tabs.Tab
                  key={tab.id}
                  value={tab.id}
                  onClick={() => handleTabChange(tab.id)} // Ensure clicking on the tab works
                  sx={() => ({
                    fontWeight: activeTab === tab.id ? "bold" : "normal",
                  })}
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
          <Button
            variant="subtle"
            compact
            onClick={handleNextTab}
            disabled={activeTabIndex === filteredTabs.length - 1}
          >
            <IconChevronRight size={18} />
          </Button>
        </Group>
      </div>
      <style>{`
        .booking-management {
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .top-nav ul {
          list-style-type: none;
          padding: 0;
          margin: 0 0 20px 0;
          display: flex;
          gap: 10px;
        }
        .top-nav li {
          color: #666;
          font-size: 14px;
        }
        .top-nav li.active {
          font-weight: bold;
        }
        .top-nav li:not(:last-child)::after {
          content: "|";
          margin-left: 10px;
          color: #ccc;
        }
        .tabs-container {
          background-color: #f0f0f0;
          border-radius: 4px;
          padding: 10px;
        }
      `}</style>
    </MantineProvider>
  );
}
