import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import React from "react"
import { useTranslation } from "react-i18next"

import RegisterCompletion from "../../../components/page-specific/register-completion/RegisterCompletion"
import { fetchUserCompletionInformation } from "../../../services/backend/course-modules"

import ErrorBanner from "@/shared-module/common/components/ErrorBanner"
import Spinner from "@/shared-module/common/components/Spinner"
import { withSignedIn } from "@/shared-module/common/contexts/LoginStateContext"
import dontRenderUntilQueryParametersReady, {
  SimplifiedUrlQuery,
} from "@/shared-module/common/utils/dontRenderUntilQueryParametersReady"
import withErrorBoundary from "@/shared-module/common/utils/withErrorBoundary"

const REDIRECT = "redirect"

export interface CompletionPageProps {
  query: SimplifiedUrlQuery<"courseModuleId">
}

const CompletionPage: React.FC<React.PropsWithChildren<CompletionPageProps>> = ({ query }) => {
  const { t } = useTranslation()
  const { courseModuleId } = query
  const router = useRouter()
  const userCompletionInformation = useQuery({
    queryKey: [`course-module-${courseModuleId}-completion-information`],
    queryFn: () => fetchUserCompletionInformation(courseModuleId),
  })

  if (
    userCompletionInformation.isSuccess &&
    !userCompletionInformation.data.enable_registering_completion_to_uh_open_university
  ) {
    return (
      <ErrorBanner
        error={t("error-registering-to-the-uh-open-university-not-enabled-for-this-course-module")}
        variant={"readOnly"}
      />
    )
  }
  return (
    <>
      {userCompletionInformation.isError && (
        <ErrorBanner error={userCompletionInformation.error} variant={"readOnly"} />
      )}
      {userCompletionInformation.isPending && <Spinner variant={"medium"} />}
      {userCompletionInformation.isSuccess && (
        <RegisterCompletion
          data={userCompletionInformation.data}
          registrationFormUrl={`${router.asPath.split("?")[0]}/${REDIRECT}`}
        />
      )}
    </>
  )
}

export default withErrorBoundary(withSignedIn(dontRenderUntilQueryParametersReady(CompletionPage)))
