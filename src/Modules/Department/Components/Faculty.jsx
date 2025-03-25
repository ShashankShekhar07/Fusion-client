import React, { useEffect, useState, lazy } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link for navigation
import { host } from "../../../routes/globalRoutes/index.jsx";

const SpecialTable = lazy(() => import("./SpecialTable.jsx"));

const columns = [
  {
    accessorKey: "id",
    header: "Faculty ID",
    cell: ({ row }) => (
      <Link
        to={`/eis/profile/${row.original.id}`} // Navigate to the faculty profile page
        style={{ textDecoration: "none", color: "blue" }}
      >
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "sex",
    header: "Gender",
  },
  {
    accessorKey: "date_of_birth",
    header: "DOB",
  },
  {
    accessorKey: "phone_no",
    header: "Phone Number",
  },
];

function Faculty({ branch }) {
  const [facultyData, setFacultyData] = useState([]);

  if (branch === "DS") branch = "Design";
  if (branch === "Natural Science") branch = "Natural_Science";

  // Fetch faculty data from API with Auth Token
  useEffect(() => {
    const fetchUrl = `${host}/dep/api/faculty-data/${branch}/`;

    fetch(fetchUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFacultyData(data);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  }, [branch]);

  return (
    <div
      style={{
        overflowX: "auto", // Enable horizontal scrolling
        width: "100%", // Ensure the container takes the full width
        marginTop: "10px", // Add some spacing
      }}
    >
      <SpecialTable
        title={`Faculties in ${branch} Department`}
        columns={columns}
        data={facultyData}
        rowOptions={["10", "20", "30"]}
      />
    </div>
  );
}

Faculty.propTypes = {
  branch: PropTypes.string.isRequired,
};

export default Faculty;
