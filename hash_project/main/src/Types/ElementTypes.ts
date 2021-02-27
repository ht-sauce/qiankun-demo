export type Validate = (valid: boolean) => void
export interface ElFormType {
  validate: (callback?: Validate) => null
  resetFields: () => void
  clearValidate: (props?: string | string[]) => void
}
