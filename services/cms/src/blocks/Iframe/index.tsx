/* eslint-disable i18next/no-literal-string */
import { BlockConfiguration } from "@wordpress/blocks"
import { archive as icon } from "@wordpress/icons"

import IframeEditor from "./IframeEditor"
import IframeSave from "./IframeSave"

export interface IframeAttributes {
  url: string | undefined
  heightPx: number
}

export const IFRAME_BLOCK_DEFAULT_HEIGHT_PX = 630

const IframeBoxConfiguration: BlockConfiguration<IframeAttributes> = {
  title: "Iframe",
  description: "Can be used to embed some sites that the embded block doesn't support.",
  category: "text",
  attributes: {
    url: {
      type: "string",
      default: undefined,
    },
    heightPx: {
      type: "number",
      default: IFRAME_BLOCK_DEFAULT_HEIGHT_PX,
    },
  },
  icon,
  edit: IframeEditor,
  save: IframeSave,
}

export default IframeBoxConfiguration
