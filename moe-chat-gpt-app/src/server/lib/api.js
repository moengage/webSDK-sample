// Parse request body from stream
export async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

// Route POST /api/:action to tool handlers
export async function handleApiRequest(action, body) {
  try {
    switch (action) {
      case "moengage-identify-user":
        return {
          action: "moe_identify_user",
          userId: body.user_id,
          attributes: {
            u_fn: body.first_name,
            u_ln: body.last_name,
            u_em: body.email,
          },
        };

      case "moengage-track-event":
        return {
          action: "moe_track_event",
          eventName: body.event_name,
          properties: body.properties || {},
        };

      case "moengage-set-attribute":
        return {
          action: "moe_set_attribute",
          attributeName: body.attribute_name,
          attributeValue: body.attribute_value,
        };

      default:
        return { error: `Unknown action: ${action}` };
    }
  } catch (err) {
    return { error: err.message };
  }
}
