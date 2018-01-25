/* @flow */
export type Distillery = {
  name: string,
};

// distilleries
export type FetchDistilleriesResponse = Distillery[];

// distilleries/:distilleryId
export type FetchDistilleryResponse = Distillery;
