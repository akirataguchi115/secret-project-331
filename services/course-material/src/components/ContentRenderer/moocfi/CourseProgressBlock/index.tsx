import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { useTranslation } from "react-i18next"

import { BlockRendererProps } from "../.."
import PageContext from "../../../../contexts/PageContext"
import { fetchUserCourseProgress } from "../../../../services/backend"

import CourseProgress from "./CourseProgress"

import ErrorBanner from "@/shared-module/common/components/ErrorBanner"
import GenericInfobox from "@/shared-module/common/components/GenericInfobox"
import Spinner from "@/shared-module/common/components/Spinner"
import LoginStateContext from "@/shared-module/common/contexts/LoginStateContext"
import withErrorBoundary from "@/shared-module/common/utils/withErrorBoundary"

const CourseProgressBlock: React.FC<React.PropsWithChildren<BlockRendererProps<unknown>>> = () => {
  const { t } = useTranslation()
  const pageContext = useContext(PageContext)
  const courseInstanceId = pageContext.instance?.id
  const getUserCourseProgress = useQuery({
    queryKey: [`course-instance-${courseInstanceId}-progress`],
    queryFn: () =>
      fetchUserCourseProgress(courseInstanceId as NonNullable<typeof courseInstanceId>),
    enabled: !!courseInstanceId,
  })
  const loginStateContext = useContext(LoginStateContext)

  if (pageContext.state !== "ready" || loginStateContext.isPending) {
    return <Spinner variant={"small"} />
  }
  if (!loginStateContext.signedIn) {
    return <GenericInfobox>{t("please-log-in-to-see-your-progress")}</GenericInfobox>
  }
  if (!pageContext.instance) {
    return <div>{t("select-course-version-to-see-your-progress")}</div>
  }

  return (
    <>
      {getUserCourseProgress.isError && (
        <ErrorBanner variant={"readOnly"} error={getUserCourseProgress.error} />
      )}
      {getUserCourseProgress.isPending && <Spinner variant={"medium"} />}
      {getUserCourseProgress.isSuccess && (
        <CourseProgress userCourseInstanceProgress={getUserCourseProgress.data} />
      )}
    </>
  )
}

export default withErrorBoundary(CourseProgressBlock)
