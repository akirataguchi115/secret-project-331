import React from "react"
import { useTranslation } from "react-i18next"

import { postReprocessModuleCompletions } from "../../../../../../services/backend/course-instances"

import Button from "@/shared-module/common/components/Button"
import OnlyRenderIfPermissions from "@/shared-module/common/components/OnlyRenderIfPermissions"
import useToastMutation from "@/shared-module/common/hooks/useToastMutation"

interface ModuleCompletionReprocessButtonProps {
  courseInstanceId: string
}

const ModuleCompletionReprocessButton: React.FC<
  React.PropsWithChildren<ModuleCompletionReprocessButtonProps>
> = ({ courseInstanceId }) => {
  const { t } = useTranslation()
  const postReprocessCompletionsMutation = useToastMutation(
    async () => {
      return postReprocessModuleCompletions(courseInstanceId)
    },
    { notify: true, method: "POST" },
    // { onError: setMutationError },
  )

  return (
    <OnlyRenderIfPermissions action={{ type: "edit" }} resource={{ type: "global_permissions" }}>
      <Button
        variant="secondary"
        size="medium"
        onClick={() => {
          if (confirm(t("message-are-you-sure-you-want-to-reprocess-submissions"))) {
            return postReprocessCompletionsMutation.mutate()
          }
        }}
      >
        {t("reprocess-module-completions")}
      </Button>
    </OnlyRenderIfPermissions>
  )
}

export default ModuleCompletionReprocessButton
