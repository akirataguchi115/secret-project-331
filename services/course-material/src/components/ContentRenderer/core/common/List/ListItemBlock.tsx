import { css, cx } from "@emotion/css"
import { useContext } from "react"

import { BlockRendererProps } from "../../.."
import { ListItemAttributes } from "../../../../../../types/GutenbergBlockAttributes"
import { GlossaryContext } from "../../../../../contexts/GlossaryContext"
import { fontSizeMapper } from "../../../../../styles/fontSizeMapper"
import InnerBlocks from "../../../util/InnerBlocks"
import { parseText } from "../../../util/textParsing"

import { respondToOrLarger } from "@/shared-module/common/styles/respond"
import withErrorBoundary from "@/shared-module/common/utils/withErrorBoundary"

const ListItemBlock: React.FC<React.PropsWithChildren<BlockRendererProps<ListItemAttributes>>> = (
  props,
) => {
  const { content, fontSize } = props.data.attributes

  const { terms } = useContext(GlossaryContext)

  return (
    <li
      className={cx(
        props.wrapperClassName,
        css`
          font-size: 18px;
          ${respondToOrLarger.md} {
            font-size: ${fontSizeMapper(fontSize)};
          }
        `,
      )}
      id={props.id}
    >
      <span dangerouslySetInnerHTML={{ __html: parseText(content, terms).parsedText }} />
      <InnerBlocks parentBlockProps={props} dontAllowInnerBlocksToBeWiderThanParentBlock />
    </li>
  )
}

const ListItemBlockWithErrorBoundary = withErrorBoundary(ListItemBlock)

// @ts-expect-error: Custom property. This block cannot be rendered with a wrapper div because it's only used inside ul elements and ul elements are not allowed to contain div elements. See: https://dequeuniversity.com/rules/axe/4.4/list
ListItemBlockWithErrorBoundary.dontRenderWrapperDivIllDoItMySelf = true
// @ts-expect-error: Custom property
ListItemBlockWithErrorBoundary.dontUseDefaultBlockMargin = true

export default ListItemBlockWithErrorBoundary
