import "i18next"

import countries from "@/shared-module/common/locales/en/countries.json"
import ownTranslations from "@/shared-module/common/locales/en/course-material.json"
import sharedModule from "@/shared-module/common/locales/en/shared-module.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "course-material"
    fallbackNS: "shared-module"
    resources: {
      "course-material": typeof ownTranslations
      "shared-module": typeof sharedModule
      countries: typeof countries
    }
    allowObjectInHTMLChildren: true
  }

  type Trans = string // typeof Reacti18Next.Trans
}
