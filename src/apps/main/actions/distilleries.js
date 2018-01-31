/* @flow */
import config from "config/application";
import type { Axios, AxiosPromise } from "axios";
import { memoize } from "main/reducers/apiMemoization";
import type { FetchDistilleriesResponse } from "main/types";

export type FetchDistilleriesAction = () => {
  type: string,
  promise: Axios => AxiosPromise<FetchDistilleriesResponse>,
};

export const _fetchDistilleries: FetchDistilleriesAction = () => {
  return {
    type: "FETCH_DISTILLERIES",
    promise: (httpClient: any) => {
      return httpClient.get(`${config.apiUrl}/distilleries`);
    },
  };
};

export const fetchDistilleries: Function = memoize(_fetchDistilleries);
