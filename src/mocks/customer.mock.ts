import { Customer } from "../models/customer.model";
import { DEFAULT_PROMPT } from "../config/prompts/defaultPrompts";

export const MOCK_CUSTOMERS: Customer[] = [
  {
    customer_id: "1",
    entity: "India",
    name: "Tata Motors",
    fileType: "CSV",
    preProcessing: "Y",
    piiMasking: "Y",
    masterPrompt: DEFAULT_PROMPT,
    customerPrompt: "Mask Aadhaar and PAN fields",
    status: "Active",
    primaryGroup: "Automobile",
    secondaryGroup: "Manufacturing",
  },
  {
    customer_id: "2",
    entity: "USA",
    name: "Walmart",
    fileType: "XLSX",
    preProcessing: "N",
    piiMasking: "Y",
    masterPrompt: DEFAULT_PROMPT,
    customerPrompt: "Apply US PII rules",
    status: "Deactive",
    primaryGroup: "Retail",
    secondaryGroup: "E-Commerce",
  },
];
