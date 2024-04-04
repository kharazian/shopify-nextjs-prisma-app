import {
  BlockStack,
  Button,
  Card,
  DataTable,
  InlineStack,
  Layout,
  Page,
  Text,
  InputField,
  Form
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BillingAPI = () => {
  const router = useRouter();
  const { functionId, id } = router.query;
  console.log(router.query);
  const [responseData, setResponseData] = useState("");

  async function getDiscount() {
    setResponseData("loading...");
    const postOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ functionId, id }),
    };
    const res = await fetch("/api/apps/discount/get", postOptions);
    const data = await res.json();
    // if (data.error) {
    //   setResponseData(data.error);
    // } else if (data.automaticAppDiscount) {
    //   const { automaticAppDiscount } = data;
    //   setResponseData(automaticAppDiscount.discountId);
    // }
  }

  async function createDiscount() {
    setResponseData("loading...");
    const postOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ functionId }),
    };
    const res = await fetch("/api/apps/discount/create", postOptions);
    const data = await res.json();
    if (data.error) {
      setResponseData(data.error);
    } else if (data.automaticAppDiscount) {
      const { automaticAppDiscount } = data;
      setResponseData(automaticAppDiscount.discountId);
    }
  }

  async function updateDiscount() {
    setResponseData("loading...");
    const postOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ functionId, id }),
    };
    const res = await fetch("/api/apps/discount/update", postOptions);
    const data = await res.json();
    // if (data.error) {
    //   setResponseData(data.error);
    // } else if (data.automaticAppDiscount) {
    //   const { automaticAppDiscount } = data;
    //   setResponseData(automaticAppDiscount.discountId);
    // }
  }

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'amount') {
      setAmount(value);
    } else if (name === 'value') {
      setValue(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    // Here you can process the form data (name, amount and value)
    console.log('Form submitted:', name, amount, value);
    // You can also implement logic to send data to a server-side API
  };

  return (
    <Page
      title="Billing API"
      subtitle="Ensure your app is set to `public distribution` to use Billing API"
      backAction={{
        onAction: () => router.push("/debug"),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text>
                Subscribe your merchant to a test $10.25 plan and redirect to
                your home page.
              </Text>

              {
                /* If we have an error, it'll pop up here. */
                responseData && <p>{responseData}</p>
              }
              <InlineStack align="end">
                <Button
                  variant="primary"
                  onClick={() => {
                    // id ? updateDiscount() : createDiscount();
                    getDiscount();
                  }}
                >
                  Subscribe Merchant
                </Button>
              </InlineStack>
            </BlockStack>


            <BlockStack>
            <Form onSubmit={handleSubmit}>
      <InputField
        label="Name"
        type="text"
        value={name}
        onChange={(newValue) => handleChange('name', newValue)}
        required
      />
      <br />
      <InputField
        label="Amount"
        type="number"
        value={amount}
        onChange={(newValue) => handleChange('amount', newValue)}
        required
      />
      <br />
      <InputField
        label="Value"
        type="text"
        value={value}
        onChange={(newValue) => handleChange('value', newValue)}
        required
      />
      <br />
      <Button type="submit">Submit</Button>
      {submitted && <p>Form submitted successfully!</p>}
    </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
       </Layout>
    </Page>
  );
};

export default BillingAPI;
