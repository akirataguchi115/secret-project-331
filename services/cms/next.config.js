/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-var-requires */
const generateNormalResponseHeaders =
  require("./src/shared-module/common/utils/responseHeaders").generateNormalResponseHeaders
const svgoConfig = require("./src/shared-module/common/utils/svgoConfig")

const normalResponseHeaders = generateNormalResponseHeaders()

const config = {
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: normalResponseHeaders,
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      loader: "@svgr/webpack",
      options: {
        svgoConfig: svgoConfig,
        svgProps: { role: "presentation" },
      },
    })

    // Support webassembly
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm"
    config.experiments = { asyncWebAssembly: true }

    return config
  },
  compiler: {
    emotion: {
      autoLabel: "always",
      // https://github.com/vercel/next.js/issues/40091
      // labelFormat: "[dirname]--[filename]--[local]",
    },
  },

  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
  },
  transpilePackages: ["@vectopus/atlas-icons-react"],
}

if (process.env.NEXT_PUBLIC_BASE_PATH) {
  config.basePath = process.env.NEXT_PUBLIC_BASE_PATH
}

module.exports = config
