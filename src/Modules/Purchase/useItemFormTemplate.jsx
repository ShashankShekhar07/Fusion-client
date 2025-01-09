import { useForm } from "@mantine/form";

const useItemFormTemplate = () =>
  useForm({
    initialValues: {
      itemName: "",
      quantity: 0,
      cost: 0,
      itemType: "",
      presentStock: 0,
      purpose: "",
      specification: "",
      itemSubtype: "",
      budgetaryHead: "",
      expectedDelivery: null,
      sourceOfSupply: "",
      remark: "",
      file: null,
      forwardTo: "",
      receiverDesignation: "",
      receiverName: "",
    },
  });

export default useItemFormTemplate;
