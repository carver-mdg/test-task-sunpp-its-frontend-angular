export interface IDepartmentDialogData {
  dialogType: 'create' | 'update';
  departmentID: number | undefined;
  departmentName: string | undefined;
}