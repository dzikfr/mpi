import morgan from "morgan";
import { Request } from "express";

morgan.token("body", (req) => JSON.stringify((req as Request).body));
morgan.token("params", (req) => JSON.stringify((req as Request).params));
morgan.token("query", (req) => JSON.stringify((req as Request).query));

const customFormat = `
[REQ] :method :url :status - :response-time ms
       -> Body   : :body
       -> Params : :params
       -> Query  : :query
`;

export const logger = morgan(customFormat);
