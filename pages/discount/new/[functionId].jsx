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
  const { functionId } = router.query;
  console.log(functionId);
  const [responseData, setResponseData] = useState("");

  async function fetchContent() {
    setResponseData("loading...");
    const postOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ functionId }),
    };
    const res = await fetch("/api/apps/discount", postOptions);
    const data = await res.json();
    if (data.error) {
      setResponseData(data.error);
    } else if (data.automaticAppDiscount) {
      const { automaticAppDiscount } = data;
      setResponseData(automaticAppDiscount.discountId);
    }
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
                    fetchContent();
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
