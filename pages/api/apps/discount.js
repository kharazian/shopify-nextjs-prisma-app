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

  const { functionId } = req.body;
  const response = await client.request(
    `mutation {
      discountAutomaticAppCreate(automaticAppDiscount: {
        title: "Volume discount",
        functionId: "${functionId}",
        startsAt: "2022-06-22T00:00:00",
        metafields: [
          {
            namespace: "$app:volume-discount"
            key: "function-configuration"
            value: "{ \\"quantity\\": 3, \\"percentage\\": 50.0 }"
            type: "json"
          }
        ],
      }) {
         automaticAppDiscount {
          discountId
         }
         userErrors {
          field
          message
         }
      }
    }`
  );


  if (response.data.discountAutomaticAppCreate.userErrors.length > 0) {
    console.log(
      `--> Error subscribing ${req.user_shop} to plan:`,
      response.data.discountAutomaticAppCreate.userErrors
    );
    res.status(400).send({ error: "An error occured." });
    return;
  }

  res.status(200).send({
    automaticAppDiscount: `${response.data.discountAutomaticAppCreate.automaticAppDiscount}`,
  });
  return;
};

export default withMiddleware("verifyRequest")(handler);
