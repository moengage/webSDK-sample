/**
 * @file lib/api.js
 * @description HTTP API handlers for standalone website mode.
 *
 * Mirrors each MCP tool, returning structuredContent directly as JSON.
 * This allows the widget to work in both:
 *   - ChatGPT mode: callTool() uses MCP bridge
 *   - Standalone mode: callTool() makes fetch() requests to these endpoints
 *
 * handleToolResult() in App.jsx processes the response identically in both modes.
 */

import { RESTAURANTS } from "../data/restaurants.js";
import { MENUS, flattenMenu } from "../data/menus.js";
import {
  addItem,
  getCart,
  getCartTotal,
  createOrder,
  findOrder,
} from "../state/cart.js";

/**
 * Parse JSON body from an incoming HTTP request.
 * @param {http.IncomingMessage} req
 * @returns {Promise<object>}
 */
export function parseBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => {
      resolve({});
    });
  });
}

/**
 * Route a POST /api/:action request to the correct handler.
 * Returns structuredContent (same format as MCP tools).
 *
 * @param {string} action - API endpoint name (e.g. 'browse-restaurants')
 * @param {object} body - Parsed request body
 * @returns {Promise<object>} structuredContent object
 */
export async function handleApiRequest(action, body) {
  switch (action) {
    case "browse-restaurants": {
      let restaurants = [...RESTAURANTS];
      const filter = body?.filter || "all";

      if (filter === "pure-veg") {
        restaurants = restaurants.filter((r) => r.pureVeg);
      }
      if (filter === "fast-delivery") {
        restaurants.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      }
      if (filter === "top-rated") {
        restaurants.sort((a, b) => b.rating - a.rating);
      }

      return {
        action: "show_restaurants",
        restaurants,
      };
    }

    case "search-food": {
      const query = (body?.query || "").toLowerCase();

      const byRestaurant = RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query)
      );

      const byMenuItem = RESTAURANTS.filter((r) => {
        if (byRestaurant.includes(r)) return false;
        return flattenMenu(r.id).some((item) => item.name.toLowerCase().includes(query));
      });

      const results = [...byRestaurant, ...byMenuItem];

      return {
        action: "show_restaurants",
        restaurants: results,
      };
    }

    case "view-menu": {
      const { restaurant_id } = body;
      const restaurant = RESTAURANTS.find((r) => r.id === restaurant_id);

      if (!restaurant) {
        return { action: "show_restaurants", restaurants: RESTAURANTS };
      }

      const menu = MENUS[restaurant_id] || { recommended: [], sides: [] };

      return {
        action: "show_menu",
        restaurant,
        menu,
      };
    }

    case "add-to-cart": {
      const { restaurant_id, item_id, item_name, price, quantity = 1 } = body;
      const restaurant = RESTAURANTS.find((r) => r.id === restaurant_id);
      const menuItem = flattenMenu(restaurant_id).find((m) => m.id === item_id);

      const itemName = menuItem?.name || item_name || item_id;
      const itemPrice = menuItem?.price || price || 0;

      addItem({
        id: item_id,
        name: itemName,
        price: itemPrice,
        qty: quantity,
        emoji: menuItem?.emoji || "🍽️",
        veg: menuItem?.veg ?? true,
        restaurantId: restaurant_id,
        restaurantName: restaurant?.name || "Restaurant",
      });

      const total = getCartTotal();

      return {
        action: "update_cart",
        cart: getCart(),
        cartTotal: total,
        addedItem: {
          item_id,
          item_name: itemName,
          price: itemPrice,
          quantity,
          restaurant_id,
          restaurant_name: restaurant?.name || "Restaurant",
        },
      };
    }

    case "view-cart": {
      const cart = getCart();
      const total = getCartTotal();

      return {
        action: "show_cart",
        cart,
        cartTotal: total,
      };
    }

    case "place-order": {
      const { items, restaurant, total } = body;
      const order = createOrder({ restaurant, items, total });

      return {
        action: "show_order",
        order,
      };
    }

    case "track-order": {
      const { order_id } = body;
      const order = findOrder(order_id);

      if (!order) {
        return { action: "show_order", order: null };
      }

      return {
        action: "show_order",
        order,
      };
    }

    default:
      return { error: `Unknown API action: ${action}` };
  }
}
