const midtransPlugin = {
  name: "midtransPlugin",
  register: async (server, options) => {
    // Set your server key (Note: Server key for sandbox and production mode are different)
    const server_key = "SB-Mid-server-Tm9bCNJ7bl976oskgH4Vtxk9";
    // Set true for production, set false for sandbox
    const is_production = false;

    const api_url = is_production
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    server.route({
      method: "POST",
      path: "/charge",
      handler: async (request, h) => {
        // Set your server key (Note: Server key for sandbox and production mode are different)
        const server_key = "SB-Mid-server-Tm9bCNJ7bl976oskgH4Vtxk9";
        // Set true for production, set false for sandbox
        const is_production = false;

        const api_url = is_production
          ? "https://app.midtrans.com/snap/v1/transactions"
          : "https://app.sandbox.midtrans.com/snap/v1/transactions";

        // get the HTTP POST body of the request
        const request_body = JSON.stringify(request.payload);
        // call charge API using request body passed by mobile SDK
        const charge_result = await chargeAPI(
          api_url,
          server_key,
          request_body
        );
        // set the response http status code
        const response = h.response(charge_result.body);
        console.log(response);

        response.code(charge_result.http_code);
        response.header("Content-Type", "application/json");
        return response;
      },
    });
  },
};

module.exports = midtransPlugin;

async function chargeAPI(api_url, server_key, request_body) {
  const axios = require("axios").default;
  const response = await axios.post(api_url, request_body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Basic " + Buffer.from(server_key + ":").toString("base64"),
    },
  });
  return {
    body: JSON.stringify(response.data),
    http_code: response.status,
  };
}
