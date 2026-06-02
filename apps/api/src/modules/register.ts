import { FastifyInstance } from "fastify";

import { registerAuthModules } from "./auth/register";
import { registerBranchModules } from "./branches/register";
import { registerCrmModules } from "./crm/register";
import { registerIamModules } from "./iam/register";
import { registerDashbaordModules } from "./dashboard/register";
import { registerCatalogModules } from "./catalog/register";
import { registerFinanceModules } from "./finance/register";
import { registerCommerceModules } from "./commerce/register";
import { registerInventoryModules } from "./inventory/register";
import { registerReportModules } from "./reports/register";

export async function registerModules(app: FastifyInstance) {
  await registerAuthModules(app);
  await registerBranchModules(app);
  await registerIamModules(app);
  await registerCrmModules(app);
  await registerCatalogModules(app);
  await registerDashbaordModules(app);
  await registerCommerceModules(app);
  await registerInventoryModules(app);
  await registerFinanceModules(app);
  await registerReportModules(app);
}
