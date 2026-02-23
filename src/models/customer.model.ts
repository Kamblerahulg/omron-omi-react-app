export interface Customer {
  customer_id: string;
  entity: string;
  name: string;
  fileType: string;
  preProcessing: "Y" | "N";
  piiMasking: "Y" | "N";
  masterPrompt: string;
  customerPrompt: string;
  status: "Active" | "Deactive";
  primaryGroup?: string;
  secondaryGroup?: string;
}
