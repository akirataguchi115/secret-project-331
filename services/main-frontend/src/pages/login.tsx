import { css } from "@emotion/css"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useContext, useState } from "react"
import { useTranslation } from "react-i18next"

import ResearchOnCoursesForm from "../components/forms/ResearchOnCoursesForm"
import useUserResearchConsentQuery from "../hooks/useUserResearchConsentQuery"

import Button from "@/shared-module/common/components/Button"
import ErrorBanner from "@/shared-module/common/components/ErrorBanner"
import TextField from "@/shared-module/common/components/InputFields/TextField"
import LoginStateContext from "@/shared-module/common/contexts/LoginStateContext"
import useQueryParameter from "@/shared-module/common/hooks/useQueryParameter"
import useToastMutation from "@/shared-module/common/hooks/useToastMutation"
import { login } from "@/shared-module/common/services/backend/auth"
import { baseTheme } from "@/shared-module/common/styles"
import {
  useCurrentPagePathForReturnTo,
  validateReturnToRouteOrDefault,
} from "@/shared-module/common/utils/redirectBackAfterLoginOrSignup"
import withErrorBoundary from "@/shared-module/common/utils/withErrorBoundary"

const Login: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const loginStateContext = useContext(LoginStateContext)

  const router = useRouter()
  const [credentialsError, setCredentialsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const uncheckedReturnTo = useQueryParameter("return_to")
  const returnToForLinkToSignupPage = useCurrentPagePathForReturnTo(router.asPath)
  const [showForm, setShowForm] = useState<boolean>(false)

  const loginMutation = useToastMutation(
    async () => {
      const success = await login(email, password)
      // Clear any previous errors
      setError(null)
      setCredentialsError(!success)
      return success
    },
    { notify: false },
  )

  const redirect = useCallback(() => {
    const returnTo = validateReturnToRouteOrDefault(uncheckedReturnTo, "/")
    router.push(returnTo)
  }, [router, uncheckedReturnTo])

  const getUserConsent = useUserResearchConsentQuery()

  if (getUserConsent.status == "error" && !showForm) {
    setShowForm(true)
  } else if (getUserConsent.status == "success") {
    redirect()
  }

  return (
    <div
      className={css`
        margin: 0 auto;
        a {
          text-decoration: none;
          color: #007bff;
          :hover {
            text-decoration: underline;
          }
        }
      `}
    >
      {error && <ErrorBanner error={error} />}

      <form
        onSubmit={async (event) => {
          event.preventDefault()
          try {
            const success = await loginMutation.mutateAsync()
            if (success) {
              await loginStateContext.refresh()
            }
          } catch (e) {
            if (!(e instanceof Error)) {
              throw e
            }
            console.error("failed to login: ", e)
            setError(e)
            return null
          }
        }}
        className={css`
          display: flex;
          flex-direction: column;
          padding: 3rem 0rem;
        `}
      >
        <h1>{t("login")}</h1>
        <div
          className={css`
            margin-bottom: 2rem;
          `}
        >
          {}
          {t("login-description")}{" "}
          <a
            className={css`
              color: ${baseTheme.colors.blue[500]}!important;
            `}
            href="https://mooc.fi"
            // eslint-disable-next-line i18next/no-literal-string
          >
            mooc.fi
          </a>{" "}
          {t("login-description2")}
        </div>
        <TextField
          label={t("label-email")}
          onChange={(event) => {
            setEmail(event.target.value)
            setCredentialsError(false)
          }}
          required
        />
        <TextField
          type="password"
          label={t("label-password")}
          onChange={(event) => {
            setPassword(event.target.value)
            setCredentialsError(false)
          }}
          required
        />
        {credentialsError && (
          <div
            aria-live="assertive"
            className={css`
              padding: 1rem;
              border: 2px solid ${baseTheme.colors.red[500]};
              font-weight: bold;
              color: ${baseTheme.colors.red[500]};
              margin-top: 1rem;
            `}
          >
            {t("incorrect-email-or-password")}
          </div>
        )}
        <Button
          className={css`
            margin: 2rem 0rem;
          `}
          variant={"primary"}
          size={"medium"}
          id={"login-button"}
          disabled={
            !email || !password || email === "" || password === "" || loginMutation.isPending
          }
        >
          {t("login")}
        </Button>
        <div
          className={css`
            margin-bottom: 1.5rem;
            display: none;
          `}
        >
          <Link
            className={css`
              color: ${baseTheme.colors.blue[500]}!important;
            `}
            href="/sign-up"
          >
            {t("create-new-account")}
          </Link>
        </div>
        <div
          className={css`
            margin-bottom: 1.5rem;
          `}
        >
          <a
            className={css`
              color: ${baseTheme.colors.blue[500]}!important;
            `}
            href="https://tmc.mooc.fi/password_reset_keys/new"
          >
            {t("forgot-password")}
          </a>
        </div>
        <div
          className={css`
            margin-bottom: 1.5rem;
          `}
        >
          <a
            className={css`
              color: ${baseTheme.colors.blue[500]}!important;
            `}
            href={`/signup?return_to=${encodeURIComponent(returnToForLinkToSignupPage)}`}
          >
            {t("create-an-acount")}
          </a>
        </div>
      </form>
      {showForm && <ResearchOnCoursesForm afterSubmit={redirect} />}
    </div>
  )
}

export default withErrorBoundary(Login)
