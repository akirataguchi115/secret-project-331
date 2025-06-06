import { css } from "@emotion/css"
import React, { useMemo } from "react"

import ThinkingIndicator from "./ThinkingIndicator"

import { baseTheme } from "@/shared-module/common/styles"

interface MessageBubbleProps {
  message: string
  isFromChatbot: boolean
  isPending: boolean
  hideCitations?: boolean
}

const bubbleStyle = (isFromChatbot: boolean) => css`
  padding: 1rem;
  border-radius: 10px;
  width: fit-content;
  margin: 0.5rem 0;
  ${isFromChatbot
    ? `
      margin-right: 2rem;
      align-self: flex-start;
      background-color: ${baseTheme.colors.gray[100]};
    `
    : `
      margin-left: 2rem;
      align-self: flex-end;
      border: 2px solid ${baseTheme.colors.gray[200]};
      background-color: #ffffff;
    `}
`

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFromChatbot,
  isPending,
  hideCitations,
}) => {
  const processedMessage = useMemo(() => {
    if (hideCitations) {
      return message.replace(/\[.*?\]/g, "")
    }
    return message
  }, [hideCitations, message])
  return (
    <div className={bubbleStyle(isFromChatbot)}>
      <span>{processedMessage}</span>
      {isPending && <ThinkingIndicator />}
    </div>
  )
}

export default React.memo(MessageBubble)
