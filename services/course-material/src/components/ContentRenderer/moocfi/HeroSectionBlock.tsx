import React, { useContext } from "react"

import { BlockRendererProps } from ".."
import PageContext from "../../../contexts/PageContext"
import HeroSection, { HeroSectionProps } from "../../HeroSection"

import BreakFromCentered from "@/shared-module/common/components/Centering/BreakFromCentered"
import withErrorBoundary from "@/shared-module/common/utils/withErrorBoundary"
const HeroSectionBlock: React.FC<React.PropsWithChildren<BlockRendererProps<HeroSectionProps>>> = (
  props,
) => {
  const DEFAULT = true
  const pageData = useContext(PageContext)?.pageData
  const path = pageData?.url_path
  const formattedPath = path?.replace("-", " ").replace("/", "")
  const useDefaultTextForLabel = props.data.attributes.useDefaultTextForLabel ?? DEFAULT
  const isChapterFrontpage = pageData?.chapter_id
  const partiallyTransparent = props.data.attributes.partiallyTransparent ?? DEFAULT

  const chapterNumber =
    useDefaultTextForLabel && formattedPath && isChapterFrontpage
      ? formattedPath
      : props.data.attributes.label

  return (
    <BreakFromCentered sidebar={false}>
      <HeroSection
        label={chapterNumber}
        title={props.data.attributes.title}
        subtitle={props.data.attributes.subtitle}
        backgroundImage={props.data.attributes.backgroundImage}
        partiallyTransparent={partiallyTransparent}
        fontColor={props.data.attributes.fontColor}
        alignCenter={props.data.attributes.alignCenter ?? DEFAULT}
        backgroundColor={props.data.attributes.backgroundColor}
        backgroundRepeatX={props.data.attributes.backgroundRepeatX}
        alignBottom={props.data.attributes.alignBottom}
      />
    </BreakFromCentered>
  )
}

export default withErrorBoundary(HeroSectionBlock)
