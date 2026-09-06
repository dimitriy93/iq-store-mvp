import {IncomingMessage, ServerResponse} from "node:http";

export const sendJson = (res: ServerResponse, status: number, body: unknown) => {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(body));
};

export const readBody = async (req: IncomingMessage): Promise<string> => {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
};