import { TestCaseTestProject } from '../TestProject/TestCaseTestProject';

export interface CreateReleaseRequestModel {
  ReleaseName: string;
  Build: string;
  Description: string;
  StartDate: Date | null;
  EndDate: Date | null;
  IsOfficial: boolean;
  IsDeleted?: boolean;
  RegressionTests: TestCaseTestProject[];
}
