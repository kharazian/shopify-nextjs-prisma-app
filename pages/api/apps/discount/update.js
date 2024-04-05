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
  
  const data = req.body;
  console.log(data)
  const response = await client.request(
    `mutation {
      discountAutomaticAppUpdate(
      id: "${data.id}",
      automaticAppDiscount: {
        title: "Volume discount",
        functionId: "${data.functionId}",
        startsAt: "2022-06-22T00:00:00",
        metafields: [
          {
            id: "${data.configurationField.id}"
            value: "{ \\"quantity\\": ${data.field.quantity}, \\"percentage\\": ${data.field.percentage} }"
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

  console.log(`value: "{ \\"quantity\\": ${data.field.quantity}, \\"percentage\\": ${data.field.percentage} }"`)
  console.log(`value: "${JSON.stringify(data.field)}"`)

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
