import { RegressionTest } from 'src/Models/RegressionTest/RegressionTest';

export interface RegressionTestExt {
  TotalRecords: number;
  TotalFiteredRecords: number;
  Data: RegressionTest[];
}
