import "i18next"

import ownTranslations from "@/shared-module/common/locales/en/main-frontend.json"
import sharedModule from "@/shared-module/common/locales/en/shared-module.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "main-frontend"
    fallbackNS: "shared-module"
    resources: {
      "main-frontend": typeof ownTranslations
      "shared-module": typeof sharedModule
    }
    allowObjectInHTMLChildren: true
  }

  type Trans = string // typeof Reacti18Next.Trans
}
