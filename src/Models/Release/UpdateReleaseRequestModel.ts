export interface UpdateReleaseRequestModel {
  Id: string;
  ReleaseName: string;
  Build: string;
  Description: string;
  StartDate: Date | null;
  EndDate?: Date | null;
  IsOfficial: boolean;
  AddionalRegressionTests: RegressionTestDTO[];
}

export interface RegressionTestDTO {
  TestCaseName: string;
  TestCaseFullName: string;
  Category: string;
  Author: string;
  QueueName: string;
  DontRunWithQueues: string;
  IsHighPriority: boolean;
  Status: string;
}
