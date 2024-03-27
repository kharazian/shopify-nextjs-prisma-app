import { BlockStack, InlineStack, Button, Card, Layout, Page, Text, TextField } from "@shopify/polaris";
import { useRouter } from "next/router";

const DiscountNew = () => {
  const router = useRouter();
  return (
    <>
      <Page
        title="Page Title"
        backAction={{
          onAction: () => {
            router.push('/discounts');
          },
        }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="3">
                <Text variant="headingMd" as="h2">
                  Volume
                </Text>
                <TextField
                  label="Minimum quantity"
                  autoComplete="on"
                  // {...configuration.quantity}
                />
                <TextField
                  label="Discount percentage"
                  autoComplete="on"
                  // {...configuration.percentage}
                  suffix="%"
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd">Heading</Text>
                <Text>Regular Text Content</Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      alert('Button pressed');
                    }}
                  >
                    Button
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default DiscountNew;