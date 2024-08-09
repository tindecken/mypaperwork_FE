export interface RegressionTest {
  Id: number;
  ReleaseId: number;
  TestCaseFullName: string;
  TestCaseName: string;
  Category: string;
  Author: string;
  Status: string;
  AnalysedBy: string;
  Issue: string;
  RunLog: string;
  RunClient: string;
  ErrorMessage: string;
  IsHasErrorScreenshot: boolean;
  IsHighPriority: boolean;
  Comment: string;
  StartDate: Date;
  EndDate: Date;
  RunTime: number;
}
