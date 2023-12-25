export interface DatasetsModel {
  id: number;
  Name: string;
  TotalRecords: number;
  AfterNanRecords: number;
  created_at: string;
}

export interface DatasetDetailModel {
  id: number;
  'Average record size in memory': string;
  'Duplicate rows': number;
  'Duplicate rows( %)': number;
  'Missing cells': number;
  'Missing cells (%)': number;
  'Number of observations': number;
  'Number of variables': number;
  Numeric: number;
  'Total size in memory': string;
  boolean: number;
  categorical: number;
}

export interface DatasetNullCountModel {
  id: number;
  age: number;
  al: number;
  ane: number;
  appet: number;
  ba: number;
  bgr: number;
  bp: number;
  bu: number;
  cad: number;
  classification: number;
  dm: number;
  hemo: number;
  htn: number;
  pc: number;
  pcc: number;
  pcv: number;
  pe: number;
  pot: number;
  rbc: number;
  rc: number;
  sc: number;
  sg: number;
  sod: number;
  su: number;
  wc: number;
}
interface transposeNum {
  '25%': number;
  '50%': number;
  '75%': number;
  Count: number;
  Max: number;
  Mean: number;
  Min: number;
  Missing: number;
  Std: number;
  Variance: number;
}

interface transposeCat {
  ane: number;
  appet: number;
  ba: number;
  cad: number;
  classification: number;
  dm: number;
  htn: number;
  pc: number;
  pcc: number;
  pe: number;
  rbc: number;
}

export interface DatasetTransposeNumericalModel {
  age: transposeNum;
  al: transposeNum;
  bgr: transposeNum;
  bp: transposeNum;
  bu: transposeNum;
  hemo: transposeNum;
  pcv: transposeNum;
  pot: transposeNum;
  rc: transposeNum;
  sc: transposeNum;
  sg: transposeNum;
  sod: transposeNum;
  su: transposeNum;
  wc: transposeNum;
}

export interface DatasetTransposeCategoricalModel {
  count: transposeCat;
  freq: transposeCat;
  top: transposeCat;
  unique: transposeCat;
}
