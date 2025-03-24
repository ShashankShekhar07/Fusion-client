import React from "react";
import PropTypes from "prop-types";

export default function AboutUs({ branch }) {
  // A dictionary object to store content for each branch
  const branchDetails = {
    CSE: {
      title: "Computer Science and Engineering",
      about:
        "The CSE department offers a comprehensive education in computer science principles, software development, algorithms, and system design. It equips students with cutting-edge skills to excel in the tech industry.",
      facilities:
        "State-of-the-art computer labs, advanced research centers, and high-speed internet access.",
      vision:
        "To be a center of excellence in the field of Computer Science and Engineering, empowering students with the skills and knowledge to innovate and lead in technology.",
      timetable:
        "https://drive.google.com/file/d/1EUdAlUYNZ-fKKlim46AZOVCMEgts6IBx/view?usp=drive_link",
    },
    ECE: {
      title: "Electronics and Communication Engineering",
      about:
        "The ECE department focuses on electronics systems, communication technologies, and signal processing, providing students with a strong foundation in both theory and practical applications.",
      facilities:
        "Modern electronics labs, communication system simulators, and well-equipped research labs.",
      vision:
        "To produce top-notch engineers who will drive innovation in the field of electronics and communication.",
      timetable:
        "https://drive.google.com/file/d/1EQpk2d2MWSpxAtu-3mwQ5IzI8796FLeH/view?usp=drive_link",
    },
    ME: {
      title: "Mechanical Engineering",
      about:
        "The Mechanical Engineering department emphasizes the design, analysis, and manufacturing of mechanical systems. The program provides a solid foundation in engineering mechanics and thermal sciences.",
      facilities:
        "High-tech workshops, CAD labs, and advanced mechanical testing facilities.",
      vision:
        "To nurture creative and analytical engineers who will excel in mechanical innovations and industrial design.",
      timetable:
        "https://drive.google.com/file/d/1EUPJ4uovg7DdUsLwjHwSUOxNDKwpR3aV/view?usp=sharing",
    },
    SM: {
      title: "Smart Manufacturing",
      about:
        "The Smart Manufacturing (SM) department focuses on the integration of advanced technologies such as IoT, AI, robotics, and data analytics into the manufacturing process to create more efficient, flexible, and sustainable production systems.",
      facilities:
        "Industry 4.0 labs, IoT-enabled workshops, AI-powered simulation systems, and collaborative robots (cobots).",
      vision:
        "To lead the transformation of traditional manufacturing into intelligent, data-driven systems that enhance productivity, efficiency, and sustainability.",
      timetable:
        "https://drive.google.com/file/d/1EZHI-roNjh50DrlIup8h1s8TpnTonORo/view?usp=drive_link",
    },
    DS: {
      title: "Design",
      about:
        "The Design department focuses on creating innovative, user-centric, and sustainable products by combining aesthetics, functionality, and cutting-edge tools. It bridges creativity and practicality to deliver impactful solutions.",
      facilities:
        "Design labs equipped with state-of-the-art tools, including 3D modeling software, virtual prototyping systems, ergonomic testing setups, and rapid fabrication technologies.",
      vision:
        "To drive innovation by creating user-focused, sustainable designs that blend creativity and functionality, shaping impactful solutions for a better future.",
      timetable:
        "https://drive.google.com/file/d/1PTF1d6gE2RmSqp6sUWGgoLCp1NlvLGVM/view",
    },
    LA: {
      title: "Liberal Arts",
      about:
        "The Liberal Arts department fosters critical thinking, creativity, and communication through a diverse curriculum that explores the humanities, social sciences, and interdisciplinary studies. It empowers students to navigate complex ideas and contribute meaningfully to society.",
      facilities:
        "Well-equipped lecture halls, dedicated research spaces, digital archives, and creative workshops to support an engaging and collaborative learning environment.",
      vision:
        "To cultivate well-rounded individuals who excel in critical analysis, creativity, and cultural understanding, shaping thoughtful leaders and innovators for a dynamic world.",
      timetable:
        "https://drive.google.com/file/d/1PTF1d6gE2RmSqp6sUWGgoLCp1NlvLGVM/view",
    },

    // You can add more branches here
  };

  const deptInfo = branchDetails[branch] || {
    title: "Department",
    about: "Details are not available for this branch at the moment.",
    facilities: "",
    vision: "",
  };

  return (
    <div>
      <h2>{deptInfo.title}</h2>
      <p>
        <strong>About the Department:</strong> {deptInfo.about}
      </p>
      {/* {deptInfo.facilities && (
        <p>
          <strong>Facilities:</strong> {deptInfo.facilities}
        </p>
      )} */}
      {deptInfo.vision && (
        <p>
          <strong>Vision:</strong> {deptInfo.vision}
        </p>
      )}
      {deptInfo.timetable && (
        <p>
          <strong>Timetable:</strong>{" "}
          <a
            href={deptInfo.timetable}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "4px 8px",
              backgroundColor: "#15ABFF",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            View
          </a>
        </p>
      )}
    </div>
  );
}

AboutUs.propTypes = {
  branch: PropTypes.string.isRequired,
};
