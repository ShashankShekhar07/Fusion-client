import React from "react";
import { Tabs, Group, MantineProvider } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function PurchaseNavbar() {
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
  const [activeTab, setActiveTab] = React.useState("file-indent");
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    const tab = TabsModules.find((t) => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
      navigate(tab.url);
    }
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div className="booking-management">
        <Group position="apart" noWrap>
          <Tabs onChange={handleTabChange} defaultValue="file-indent">
            <Tabs.List>
              {TabsModules.map((tab) => (
                <Tabs.Tab
                  key={tab.id}
                  value={tab.id}
                  sx={() => ({
                    fontWeight: activeTab === tab.id ? "bold" : "normal",
                  })}
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Group>
      </div>
      <style>{`
        .booking-management {
        //   max-width: 800px;
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
