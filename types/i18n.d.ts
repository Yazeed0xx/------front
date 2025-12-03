// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import Ar from "../locals/ar.json";
import En from "../locals/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ar";
    resources: { ar: typeof Ar; en: typeof En };
  }
}