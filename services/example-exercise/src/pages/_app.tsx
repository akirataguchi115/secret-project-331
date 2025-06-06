import { OverlayProvider } from "@react-aria/overlays"
import { QueryClientProvider } from "@tanstack/react-query"
import type { AppProps } from "next/app"
import Head from "next/head"
import React, { useEffect } from "react"

import useLanguage from "@/shared-module/common/hooks/useLanguage"
import { queryClient } from "@/shared-module/common/services/appQueryClient"
import GlobalStyles from "@/shared-module/common/styles/GlobalStyles"
import generateWebVitalsReporter from "@/shared-module/common/utils/generateWebVitalsReporter"
import initI18n from "@/shared-module/common/utils/initI18n"

const SERVICE_NAME = "example-exercise"

const i18n = initI18n(SERVICE_NAME)

const MyApp: React.FC<React.PropsWithChildren<AppProps>> = ({ Component, pageProps }) => {
  const language = useLanguage()
  useEffect(() => {
    // Remove the server-side injected CSS.

    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  useEffect(() => {
    if (!language) {
      return
    }

    console.info(`Setting language to: ${language}`)
    i18n.changeLanguage(language)
  }, [language])

  return (
    <>
      {language && (
        <Head>
          <html lang={language} />
        </Head>
      )}
      <QueryClientProvider client={queryClient}>
        <OverlayProvider>
          <GlobalStyles />
          <Component {...pageProps} />
        </OverlayProvider>
      </QueryClientProvider>
    </>
  )
}

export const reportWebVitals = generateWebVitalsReporter(SERVICE_NAME)

export default MyApp
