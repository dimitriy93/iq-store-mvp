import { createServer, type ServerResponse } from "node:http";
import path from "node:path";
import { loadCatalog } from "./catalog/catalog.service.js";

const PORT = Number(process.env.PORT) || 3000;
const CATALOG_XML_PATH = process.env.CATALOG_XML_PATH || path.resolve(process.cwd(), "data", "products.xml");

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
};

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/catalog") {
    try {
      const catalog = await loadCatalog(CATALOG_XML_PATH);
      sendJson(res, 200, catalog);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";
      console.error(`[Ошибка каталога]: ${message}`);
      sendJson(res, 500, { error: "Не удалось загрузить каталог" });
    }
    return;
  }

  sendJson(res, 404, { error: "Не найдено" });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});