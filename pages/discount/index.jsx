  import {
  Button,
  Card,
  Layout,
  Page,
  TextField
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

  const Discount = () => {
    const router = useRouter();
    const { functionId, id } = router.query;

    const [data, setData] = useState({ functionId });

    useEffect(() => {
      if(id) {
        getDiscount();
      }
    }, [id]);
    
    async function getDiscount() {
      try {
        const postOptions = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ functionId, id }),
        };
        const res = await fetch("/api/apps/discount/get", postOptions);
        const response = await res.json();
        if(response.discountNode) {
          const data = response.discountNode;
          data.field = JSON.parse(data.configurationField.value);
          data.functionId = functionId;
          setData(data || {});
        }
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    }

    async function updateDiscount() {
      try {
        const postOptions = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        };
        const res = await fetch("/api/apps/discount/update", postOptions);
        const response = await res.json();
        if(response.discountNode) {
          const data = response.discountNode;
          data.field = JSON.parse(data.configurationField.value);
          setData(data || {});
        }
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    }    

    async function createDiscount() {
      try {
        const postOptions = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        };
        const res = await fetch("/api/apps/discount/create", postOptions);
        const response = await res.json();
        if(response.discountNode) {
          const data = response.discountNode;
          data.field = JSON.parse(data.configurationField.value);
          setData(data || {});
        }
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    }    

    const handleDataChange = (state, fieldPath, value) => {
      const [topLevelField, ...nestedFields] = fieldPath.split(".");
      if (nestedFields.length === 0) {
        return { ...state, [topLevelField]: value };
      }
      return {
        ...state,
        [topLevelField]: handleDataChange(state[topLevelField], nestedFields.join("."), value),
      };
    };

    const handleChange = (fieldPath, value) => {
      setData(handleDataChange(data, fieldPath, value));
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      if(id) {
        updateDiscount();
      } else {
        createDiscount();
      }
    };

    return (
      <Page
        title="Discount"
        subtitle="Discount to lock price"
        backAction={{
          onAction: () => router.push("/debug"),
        }}
      >
        <Layout>
          <Layout.Section>
            <Card title="Input Fields">
              <form onSubmit={handleSubmit}>
              <TextField
                  label="Title"
                  value={data?.discount?.title || ""}
                  onChange={(newValue) => handleChange('discount.title', newValue)}
                  type="text"
                />
                <TextField
                  label="Quantity"
                  value={data?.field?.quantity || ""}
                  onChange={(newValue) => handleChange('field.quantity', newValue)}
                  type="number"
                />
                <TextField
                  label="Percentage"
                  value={data?.field?.percentage || ""}
                  onChange={(newValue) => handleChange('field.percentage', newValue)}
                  type="number"
                />                    
                <Button submit>Submit</Button>
              </form>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  };

  export default Discount;
