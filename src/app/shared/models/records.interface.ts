export interface RecordsModel {
  id: number;
  dataset_id: number;
  age: number;
  bp: number;
  sg: number;
  al: number;
  su: number;
  rbc: 'abnormal' | 'normal';
  pc: 'abnormal' | 'normal';
  pcc: 'notpresent' | 'present';
  ba: 'notpresent' | 'present';
  bgr: number;
  bu: number;
  sc: number;
  sod: number;
  pot: number;
  hemo: number;
  pcv: number;
  wc: number;
  rc: number;
  htn: 'no' | 'yes';
  dm: 'no' | 'yes';
  cad: 'no' | 'yes';
  appet: 'poor' | 'good';
  pe: 'no' | 'yes';
  ane: 'no' | 'yes';
  classification?: 'notckd' | 'ckd';
}
