import express from "express";
import productRoutes from "./modules/product/product.route";
import customerRoutes from "./modules/customer/customer.route";
import companyRoutes from "./modules/company/company.route";
import invoiceRoutes from "./modules/invoice/invoice.route";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./middlewares/logger";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);

app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/invoices", invoiceRoutes);

app.use(errorHandler);
export default app;
