import {
  BlockStack,
  Button,
  Card,
  DataTable,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BillingAPI = () => {
  const router = useRouter();
  const { functionId, id } = router.query;
  console.log(router.query);
  const [responseData, setResponseData] = useState("");

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
                    id ? updateDiscount() : createDiscount();
                  }}
                >
                  Subscribe Merchant
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
       </Layout>
    </Page>
  );
};

export default BillingAPI;
