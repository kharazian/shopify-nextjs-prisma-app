import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req, res) => {
  //false for offline session, true for online session
  const { client } = await clientProvider.online.graphqlClient({
    req,
    res,
  });
  const returnUrl = `${process.env.SHOPIFY_APP_URL}/api/auth?shop=${req.user_shop}`;
  
  const { functionId, id } = req.body;

  const discount = await client.request(
    `query {
      discountNode(id: "gid://shopify/DiscountAutomaticNode/${id}") {
        id
        configurationField: metafield(
          namespace: "$app:volume-discount"
          key: "function-configuration"
        ) {
          id
          value
        }
        discount {
          __typename
          ... on DiscountAutomaticApp {
            title
            discountClass
            combinesWith {
              orderDiscounts
              productDiscounts
              shippingDiscounts
            }
            startsAt
            endsAt
          }
          ... on DiscountCodeApp {
            title
            discountClass
            combinesWith {
              orderDiscounts
              productDiscounts
              shippingDiscounts
            }
            startsAt
            endsAt
            usageLimit
            appliesOncePerCustomer
            codes(first: 1) {
              nodes {
                code
              }
            }
          }
        }
      }
    }`
  );
  console.log(discount.data.discountNode.configurationField.id);
  res.status(200).send(discount);

  const response = await client.request(
    `mutation {
      discountAutomaticAppUpdate(        
      id: "gid://shopify/DiscountAutomaticApp/${id}",
      automaticAppDiscount: {
        title: "Volume discount",
        functionId: "${functionId}",
        startsAt: "2022-06-22T00:00:00",
        metafields: [
          {
            id: "${discount.data.discountNode.configurationField.id}"
            value: "{ \\"quantity\\": 4, \\"percentage\\": 80.0 }"
          }
        ],
      },
      ) {
         userErrors {
          field
          message
         }
      }
    }`
  );


  if (response.data.discountAutomaticAppUpdate.userErrors.length > 0) {
    console.log(
      `--> Error subscribing ${req.user_shop} to plan:`,
      response.data.discountAutomaticAppUpdate.userErrors
    );
    res.status(400).send({ error: "An error occured." });
    return;
  }

  res.status(200).send({
    automaticAppDiscount: `${response.data.discountAutomaticAppUpdate}`,
  });
  return;
};

export default withMiddleware("verifyRequest")(handler);
