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
  
  const { id } = req.body;

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

  return;
};

export default withMiddleware("verifyRequest")(handler);
