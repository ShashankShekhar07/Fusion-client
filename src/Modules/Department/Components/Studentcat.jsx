import { Button, Card, Collapse, Grid, Text, Group } from "@mantine/core";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import React, { useState, useEffect, lazy } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { host } from "../../../routes/globalRoutes/index.jsx";
// import SpecialTable from "./SpecialTable.jsx";

const SpecialTable = lazy(() => import("./SpecialTable.jsx"));

const columns = [
  {
    accessorKey: "id",
    header: "Roll",
    cell: ({ row }) => (
      <Link
        to={`/profile/${row.original.id}`}
        style={{ textDecoration: "none", color: "blue" }}
      >
        {row.original.id}
      </Link>
    ),
  },
  { accessorKey: "specialization", header: "Department" },
  { accessorKey: "programme", header: "Programme" },
  { accessorKey: "batch", header: "Batch" },
  { accessorKey: "cpi", header: "CPI" },
  { accessorKey: "category", header: "Category" },
];

let year = 2022;

function checkYear() {
  const now = new Date();
  const currentMonth = now.getMonth();
  year = currentMonth >= 8 ? now.getFullYear() : now.getFullYear() - 1;
}

function Studentcat({ branch }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const specialization = branch;
  const isDS = branch === "DS";
  let programme = "";

  if (["btech1", "btech2", "btech3", "btech4"].includes(selectedCategory))
    programme = "B.Tech";
  else if (["bdes1", "bdes2", "bdes3"].includes(selectedCategory))
    programme = "B.Des";
  else if (["mtech1", "mtech2"].includes(selectedCategory))
    programme = "M.Tech";
  else if (selectedCategory === "phd1") programme = "PhD";

  checkYear();
  if (selectedCategory) year -= parseInt(selectedCategory.slice(-1), 10) - 1;

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      setStudentData([]);
      const fetchUrl = `${host}/dep/api/all-students/${selectedCategory + specialization}/`;
      fetch(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : Promise.reject(new Error("Network error")),
        )
        .then((data) => {
          setStudentData(data[programme][year][branch]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [selectedCategory, branch]);

  return (
    <div style={{ margin: "20px" }}>
      <Text size="xl" weight={700} mb="md">
        Student Categories
      </Text>
      <Grid gutter={20}>
        {["phd", "mtech", "btech"].map((cat) => (
          <Grid.Col key={cat} span={4}>
            <Card
              shadow="sm"
              onClick={() => setOpenCategory(openCategory === cat ? null : cat)}
            >
              <Group position="apart">
                <Text size="lg" weight={600}>
                  {cat.toUpperCase()} Students
                </Text>
                {openCategory === cat ? (
                  <CaretUp size={18} />
                ) : (
                  <CaretDown size={18} />
                )}
              </Group>
              <Collapse in={openCategory === cat}>
                {cat === "phd" && (
                  <Button
                    variant="outline"
                    mt="sm"
                    onClick={() => setSelectedCategory("phd1")}
                  >
                    PhD {branch} Students
                  </Button>
                )}
                {cat === "mtech" &&
                  ["mtech1", "mtech2"].map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      mt="sm"
                      onClick={() => setSelectedCategory(item)}
                    >
                      M.Tech {item.slice(-1)} Year
                    </Button>
                  ))}
                {cat === "btech" &&
                  [1, 2, 3, 4].map((k) => (
                    <Button
                      key={k}
                      variant="outline"
                      mt="sm"
                      onClick={() =>
                        setSelectedCategory(isDS ? `bdes${k}` : `btech${k}`)
                      }
                    >
                      {isDS ? `B.Des ${k} Year` : `B.Tech ${k} Year`}
                    </Button>
                  ))}
              </Collapse>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      {loading ? (
        <Text>Loading data...</Text>
      ) : (
        selectedCategory && (
          <SpecialTable
            title="Student"
            columns={columns}
            data={studentData}
            rowOptions={["50", "60", "70"]}
          />
        )
      )}
    </div>
  );
}

export default Studentcat;

Studentcat.propTypes = {
  branch: PropTypes.string.isRequired,
};
