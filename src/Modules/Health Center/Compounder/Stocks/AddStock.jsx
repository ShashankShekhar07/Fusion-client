import React, { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Paper,
  Divider,
  FileInput,
  Grid,
  Autocomplete,
} from "@mantine/core";
import { DownloadSimple } from "@phosphor-icons/react";
import axios from "axios";
import NavCom from "../NavCom";
import ManageStock from "./ManageStocksNav";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

function AddStock() {
  const [brand, setBrand] = useState("");
  const [brandnames, setbrandnames] = useState([]);
  const [similar, setsimilar] = useState([]);
  const [manuname, setmanu] = useState("");
  const [constit, setConstit] = useState("");
  const [medname, setmedname] = useState("");
  const [packsize, setpack] = useState(0);
  const [Quantity, setquantity] = useState(0);
  const [Supplier, setsupplier] = useState("");
  const [date, setdate] = useState("");
  const [Selected, setSelected] = useState(-1);
  const [submit, setSubmit] = useState(false);

  const fetchMedicine = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        compounderRoute,
        {
          medicine_name_for_stock: brand,
          get_stock: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      const arr = [];
      response.data.sim.forEach((value) => {
        const tp = `${value.brand_name},${value.id}`;
        arr.push(tp);
      });
      setsimilar(response.data.sim);
      setbrandnames(arr);
    } catch (err) {
      console.log(err);
    }
  };

  const handlebrand = (event) => {
    console.log(event);
    setBrand(event);
    let fl = 1;
    similar.forEach((item) => {
      const tp = `${item.brand_name},${item.id}`;
      if (tp === event) {
        fl = 0;
        setmanu(item.manufacturer_name);
        setpack(item.pack_size_label);
        setSelected(item.id);
        setConstit(item.constituents);
        setmedname(item.medicine_name);
      }
    });
    if (fl) {
      fetchMedicine();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmit(true);
    const token = localStorage.getItem("authToken");
    if (Selected !== -1) {
      try {
        const response = await axios.post(
          compounderRoute,
          {
            medicine_id: Selected,
            quantity: Quantity,
            supplier: Supplier,
            expiry_date: date,
            add_stock: 1,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        console.log(response);
        if (response.data.status === 1) {
          alert("Added Stock");
        }
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <ManageStock />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
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

        <Grid gutter="sm">
          <Grid.Col span={6}>
            <Autocomplete
              label="Brand Name"
              id="brand-name"
              placeholder="Brand Name"
              value={brand}
              onChange={handlebrand}
              data={brandnames}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Quantity"
              id="quantity"
              placeholder="Quantity"
              value={Quantity}
              onChange={(e) => {
                setquantity(e.target.value);
              }}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Supplier"
              id="supplier"
              placeholder="Supplier"
              value={Supplier}
              onChange={(e) => {
                setsupplier(e.target.value);
              }}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Expiry Date"
              id="expiry-date"
              type="date"
              value={date}
              onChange={(e) => {
                setdate(e.target.value);
              }}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Medicine Name"
              id="medicine-name"
              placeholder="Medicine Name"
              value={medname}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Constituents"
              id="constituents"
              placeholder="Constituents"
              value={constit}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Manufacturer Name"
              id="manufacturer-name"
              placeholder="Manufacturer Name"
              value={manuname}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Pack Size Label"
              id="pack-size"
              placeholder="Pack Size"
              value={packsize}
            />
          </Grid.Col>
        </Grid>

        <Group position="center" mt="lg">
          <Button
            type="submit"
            style={{
              backgroundColor: "#15ABFF",
              margin: "auto",
              display: "block",
            }}
            onClick={handleSubmit}
          >
            {submit ? "Submitting..." : "Submit"}
          </Button>
        </Group>
      </Paper>
    </>
  );
}

export default AddStock;
