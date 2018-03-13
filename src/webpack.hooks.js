import appRoot from "app-root-path";
import path from "path";
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const autoprefixerOptions = {
  browsers: [
    ">1%",
    "last 4 versions",
    "Firefox ESR",
    "not ie < 9", // React doesn't support IE8 anyway
  ],
  flexbox: "no-2009",
};

const updateAutoprefixerConfig = plugins => {
  // Get reference to AutoPrefixer instance
  const pluginWithPostcss = plugins.find(
    plugin =>
      plugin.options &&
      plugin.options.options &&
      plugin.options.options.postcss,
  );
  const autoPrefixer = pluginWithPostcss.options.options.postcss.find(
    plugin => plugin.postcssPlugin === "autoprefixer",
  );
  autoPrefixer.options.browsers = [
    "last 3 Chrome versions",
    "last 3 Firefox versions",
    "last 3 Edge versions",
    "last 3 iOS versions",
    "last 3 Opera versions",
    "last 3 Safari versions",
    "Explorer >= 10",
    "ExplorerMobile >= 10",
  ];
  return plugins;
};

const getOutput = output => ({
  ...output,
  publicPath:
    isProduction && process.env.ASSET_URL
      ? `${process.env.ASSET_URL}/`
      : output.publicPath,
});

const cssFilename = "static/css/[name].[contenthash:8].css";
const cssClassName = isDev
  ? "[path][name]__[local]--[hash:base64:5]"
  : "[hash:base64:5]";
const extractLess = new ExtractTextPlugin({
  filename: cssFilename,
  disable: isDev,
});
const shouldUseSourceMap =
  isProduction && process.env.GENERATE_SOURCEMAP !== "false";

const additionalLoaders = [
  {
    test: /\.html$/,
    use: [
      {
        loader: "file-loader?name=[name]-[hash].[ext]",
      },
    ],
  },
  {
    test: /\/sdk\//,
    use: [
      {
        loader: "file-loader?name=[name].[ext]",
      },
    ],
  },
  // "postcss" loader applies autoprefixer to our LESS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use a plugin to extract that CSS to a file, but
  // in development "style" loader enables hot editing of CSS.
  {
    test: /\.less$/,
    exclude: [path.resolve("../src/apps/main/components")],
    use: extractLess.extract({
      fallback: {
        loader: "style-loader",
        options: {
          hmr: true,
        },
      },
      use: [
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
            minimize: isProduction,
            sourceMap: shouldUseSourceMap,
          },
        },
        {
          loader: require.resolve("postcss-loader"),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: "postcss",
            plugins: () => [
              require("postcss-flexbugs-fixes"),
              autoprefixer(autoprefixerOptions),
            ],
          },
        },
        { loader: require.resolve("less-loader") },
      ],
    }),
  },
  // We apply CSS modules only to our components, this allow to use them
  // and don't break SUI.
  {
    test: /\.less$/,
    include: [path.resolve("../src/apps/main/components")],
    use: extractLess.extract({
      fallback: {
        loader: require.resolve("style-loader"),
        options: {
          hmr: true,
        },
      },
      use: [
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
            localIdentName: cssClassName,
            modules: true,
            minimize: isProduction,
            sourceMap: shouldUseSourceMap,
          },
        },
        {
          loader: require.resolve("postcss-loader"),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: "postcss",
            plugins: () => [
              require("postcss-flexbugs-fixes"),
              autoprefixer(autoprefixerOptions),
            ],
          },
        },
        { loader: require.resolve("less-loader") },
      ],
    }),
  },
];

export default {
  webpackClientConfig: config => ({
    ...config,
    module: {
      ...config.module,
      rules: [...config.module.rules, ...additionalLoaders],
    },
    entry: {
      ...config.entry,
      vendor: [
        // Adding babel-polyfill first prevents React from loading before polyfills on IE11.
        // Removing this line causes a white page and React error on IE11.
        // Please don't remove this line.
        "babel-polyfill",
        "axios",
        "history",
        "react",
        "redux",
      ],
    },
    plugins: [
      ...updateAutoprefixerConfig(config.plugins),
      // this handles the bundled .css output file
      extractLess,
    ],
    output: getOutput(config.output),
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "../../theme.config$": path.resolve(
          appRoot.toString(),
          "src",
          "apps",
          "main",
          "styling/theme.config",
        ),
        heading: path.resolve(
          appRoot.toString(),
          "src",
          "apps",
          "main",
          "styling/heading.less",
        ),
      },
    },
    node: {
      ...config.node,
      dns: "empty",
      fs: "empty",
    },
  }),
  webpackServerConfig: config => ({
    ...config,
    module: {
      ...config.module,
      rules: [...config.module.rules, ...additionalLoaders],
    },
    plugins: [
      ...updateAutoprefixerConfig(config.plugins),
      // this handles the bundled .css output file
      extractLess,
    ],
    output: getOutput(config.output),
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "../../theme.config$": path.resolve(
          appRoot.toString(),
          "src",
          "apps",
          "main",
          "styling/theme.config",
        ),
        heading: path.resolve(
          appRoot.toString(),
          "src",
          "apps",
          "main",
          "styling/heading.less",
        ),
      },
    },
  }),
  webpackVendorDllConfig: [],
};
