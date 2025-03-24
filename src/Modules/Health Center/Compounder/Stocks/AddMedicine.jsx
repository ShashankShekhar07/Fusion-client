import React, { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Paper,
  Divider,
  FileInput,
  Grid,
} from "@mantine/core";
import axios from "axios";
import { DownloadSimple } from "@phosphor-icons/react";
import NavCom from "../NavCom";
import ManageStock from "./ManageStocksNav";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

function AddMedicine() {
  const [submit, setSubmit] = useState(false);
  const [med, setMed] = useState("");
  const [thres, setthres] = useState("");
  const [brand, setBrand] = useState("");
  const [constit, setconstit] = useState("");
  const [manu, setmanu] = useState("");
  const [pack, setpack] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmit(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          new_medicine: med,
          threshold: thres,
          brand_name: brand,
          constituents: constit,
          manufacture_name: manu,
          packsize: pack,
          add_medicine: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response.data);
      setSubmit(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <ManageStock />
      <Paper
        withBorder
        shadow="md"
        radius="md"
        p="lg"
        style={{ maxWidth: "2000px", margin: "20px auto", width: "100%" }}
      >
        {/* Insert Data using Excel Section */}
        <div
          style={{
            textAlign: "center",
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#15abff",
          }}
        >
          Insert Data using Excel File
        </div>

        <Group position="center" mt="lg">
          <FileInput
            label="Report"
            id="report"
            placeholder="Choose File"
            mb="lg"
            style={{ width: "30%" }}
          />
          <Button
            type="submit"
            style={{ backgroundColor: "#15ABFF", color: "white" }}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            leftIcon={<DownloadSimple size={20} />}
            style={{
              borderColor: "#15ABFF",
              color: "#15ABFF",
            }}
          >
            Download Example
          </Button>
        </Group>

        <Divider my="lg" label="OR" labelPosition="center" />

        {/* Medicine Details Form */}
        <form onSubmit={handleSubmit}>
          <Grid gutter="sm">
            <Grid.Col span={6}>
              <TextInput
                label="Medicine Name"
                placeholder="Enter medicine name"
                required
                value={med}
                onChange={(e) => setMed(e.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Threshold"
                placeholder="Enter threshold value"
                required
                value={thres}
                onChange={(e) => setthres(e.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Brand Name"
                placeholder="Enter brand name"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Constituents"
                placeholder="Enter constituents"
                required
                value={constit}
                onChange={(e) => setconstit(e.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Manufacturer Name"
                placeholder="Enter manufacturer name"
                required
                value={manu}
                onChange={(e) => setmanu(e.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Pack Size"
                placeholder="Enter pack size"
                required
                value={pack}
                onChange={(e) => setpack(e.target.value)}
              />
            </Grid.Col>
          </Grid>

          <Group position="right" mt="lg">
            <Button
              type="submit"
              style={{
                backgroundColor: "#15ABFF",
                color: "white",
                margin: "auto",
                display: "block",
              }}
            >
              {submit ? "Submitting..." : "Submit"}
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
}

export default AddMedicine;
