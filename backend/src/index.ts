import path from "node:path";
import { createServer } from "node:http";
import { loadCatalog } from "./catalog/catalog.service.js";
import {ICreateOrderItemInput, IOrderItems} from "./order/order.types.js";
import {readBody, sendJson} from "./shared/utils/http.utils.js";
import { db } from "./database.js";

const PORT = Number(process.env.PORT) || 3000;
const CATALOG_XML_PATH = process.env.CATALOG_XML_PATH || path.resolve(process.cwd(), "data", "products.xml");

const isCreateOrderInput = (data: unknown): data is { items: unknown[] } => {
  return typeof data === "object" && data !== null && "items" in data && Array.isArray(data.items);
};

const isValidOrderItem = (item: unknown): item is ICreateOrderItemInput => {
  return (
      typeof item === "object" && item !== null && "productId" in item &&
      typeof item.productId === "string" && "quantity" in item &&
      typeof item.quantity === "number" && Number.isInteger(item.quantity) &&
      item.quantity > 0
  );
};

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/catalog") {
    try {
      const catalog = await loadCatalog(CATALOG_XML_PATH);
      sendJson(res, 200, catalog);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";
      console.error(`[Ошибка каталога]: ${message}`);

      sendJson(res, 500, {
        error: "Не удалось загрузить каталог",
      });
    }

    return;
  }

  if (req.method === "POST" && req.url === "/api/orders") {
    let data: unknown;

    try {
      const body = await readBody(req);
      data = JSON.parse(body);
    } catch {
      sendJson(res, 400, {
        error: "Некорректный JSON",
      });

      return;
    }

    try {
      if (!isCreateOrderInput(data)) {
        sendJson(res, 400, {
          error: "Некорректное поле items",
        });

        return;
      }

      if (data.items.length === 0) {
        sendJson(res, 400, {
          error: "Корзина пуста",
        });

        return;
      }

      const orderItemsInput: ICreateOrderItemInput[] = [];

      for (const item of data.items) {
        if (!isValidOrderItem(item)) {
          sendJson(res, 400, {
            error: "Некорректные данные товара",
          });

          return;
        }

        orderItemsInput.push(item);
      }

      const catalog = await loadCatalog(CATALOG_XML_PATH);
      const orderItems: IOrderItems[] = [];
      let total = 0;

      for (const item of orderItemsInput) {
        const product = catalog.products.find(product => product.id === item.productId);

        if (!product) {
          sendJson(res, 400, {
            error: `Товар ${item.productId} не найден`,
          });

          return;
        }

        const itemTotal = product.price * item.quantity;

        total += itemTotal;

        orderItems.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });
      }

      const orderId = await db.transaction(async (trx) => {
        const [id] = await trx("orders").insert({
          created_at: new Date().toISOString(),
          total,
        });

        await trx("order_items").insert(
            orderItems.map((item) => ({
              order_id: id,
              product_id: item.product_id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
        );

        return id;
      });

      sendJson(res, 201, {
        id: orderId,
        total,
      });
    } catch (err) {
      console.error(err);

      sendJson(res, 500, {
        error: "Не удалось создать заказ",
      });
    }

    return;
  }

  sendJson(res, 404, {
    error: "Не найдено",
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});