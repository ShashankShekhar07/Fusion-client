import React, { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Paper,
  Title,
  Autocomplete,
} from "@mantine/core";
import axios from "axios";
import NavCom from "../NavCom";
import ManageStock from "./ManageStocksNav";
import CustomBreadcrumbs from "../../../../components/Breadcrumbs";
import { compounderRoute } from "../../../../routes/health_center";

function EditThreshold() {
  const [brand, setBrand] = useState("");
  const [editThres, setEditThres] = useState("");
  const [brandnames, setbrandnames] = useState([]);
  const [similar, setsimilar] = useState([]);
  const [manuname, setmanu] = useState("");
  const [packsize, setpack] = useState(0);
  const [Thresh, setThresh] = useState(0);
  const [Selected, setSelected] = useState(-1);

  const editThreshold = async () => {
    const token = localStorage.getItem("authToken");
    if (Selected !== -1) {
      try {
        const response = await axios.post(
          compounderRoute,
          { medicine_id: Selected, threshold: editThres, edit_threshold: 1 },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        console.log(response);
        if (response.data.status === 1) {
          alert("Threshold Set");
        }
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleeditthres = (event) => {
    setEditThres(event.target.value);
  };

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
        setThresh(item.threshold);
        setSelected(item.id);
      }
    });
    if (fl) {
      fetchMedicine();
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <NavCom />
      <ManageStock />
      <br />
      <Paper shadow="xl" p="xl" withBorder>
        <Title order={3} style={{ color: "#15ABFF", textAlign: "center" }}>
          Edit Threshold
        </Title>
        <br />

        <Autocomplete
          label="Brand Name"
          id="brand-name"
          placeholder="Brand Name"
          value={brand}
          onChange={handlebrand}
          data={brandnames}
        />
        <TextInput
          label="Threshold"
          id="threshold"
          placeholder="Threshold"
          mb="sm"
          value={editThres}
          onChange={handleeditthres}
          type="number"
        />
        <TextInput
          label="Present Threshold"
          id="threshold"
          placeholder="Threshold"
          mb="sm"
          value={Thresh}
          type="number"
        />
        <TextInput
          label="Manufacturer Name"
          id="manufacturer-name"
          placeholder="Manufacturer Name"
          mb="sm"
          value={manuname}
        />
        <TextInput
          label="Pack Size Label"
          id="pack-size-label"
          placeholder="Pack Size"
          mb="sm"
          value={packsize}
        />

        <Group position="center" mt="lg">
          <Button
            type="submit"
            style={{
              backgroundColor: "#15ABFF",
              color: "white",
              margin: "auto",
            }}
            onClick={editThreshold}
          >
            Edit Threshold
          </Button>
        </Group>
      </Paper>
    </>
  );
}

export default EditThreshold;
