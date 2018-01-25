/* @flow */

// WARNING: The contents of this file _including process.env variables_ will be
// exposed in the client code.

type HeadContent = {
  title: string,
  titleTemplate: string,
  meta: { name: string, content: string }[],
};

type Logger = {
  pretty: boolean,
  level: string,
};

type EnvConfig = {
  head: HeadContent,
  logger: Logger,
  httpClient?: Object,
  proxies?: Array<{
    path: string,
    destination: string,
    options?: Object,
    filter?: Function,
  }>,
};

type Config = {
  development: EnvConfig,
  production: EnvConfig,
};

const LOCAL_API_URL = "http://localhost:3000";
const API_PREFIX = "/db";

const headContent: HeadContent = {
  title: "Distillabase",
  titleTemplate: "%s | Distillabase",
  meta: [
    {
      name: "description",
      content: "The best distillery and distilled spirits data.",
    },
  ],
};

const baseConfig: EnvConfig = {
  head: headContent,
  logger: {
    pretty: true,
    level: "info",
  },
  proxies: [
    {
      path: API_PREFIX,
      destination: process.env.APP_HOST || LOCAL_API_URL,
      options: {
        xfwd: true,
        changeOrigin: true,
        headers: {
          "X-Distillbase-App-Token": "7490a0c6-1938-9f7f-38ah-390b3e76cd063",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    },
  ],
};

const config: Config = {
  development: {
    ...baseConfig,
  },
  production: {
    ...baseConfig,
    logger: {
      ...baseConfig.logger,
      pretty: false,
    },
  },
};

export default config[
  process.env.NODE_ENV === "production" ? "production" : "development"
];
