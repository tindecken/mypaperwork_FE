import { Release } from './Release';

export interface GetReleaseResponseModel {
  Release: Release;
  RegressionTests: GetRegressionTestDTO[];
}

export interface GetRegressionTestDTO {
  Id: number;
  Category?: string;
  TestCaseName: string;
  TestCaseFullName: string;
  Author: string;
  Status: string;
  QueueName: string;
  DontRunWithQueues: string;
  IsHighPriority: boolean;
}
