export interface Release {
  Id: number;
  ReleaseName: string;
  ReleaseToDisplay?: string;
  Build: string;
  Description?: string;
  IsOfficial: boolean;
  CreatedDate?: Date;
  CreatedById?: number;
  UpdatedOn?: Date;
  UpdatedById?: number;
  StartDate?: Date;
  EndDate?: Date;
}
