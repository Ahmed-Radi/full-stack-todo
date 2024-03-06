export interface IFormInput {
  username: string
  email: string
  password: string
}

export interface IRegisterInput {
  name: keyof IFormInput,
  placeholder: string,
  type: string,
  validation: {
    required?: boolean,
    minLength?: number,
    pattern?: RegExp
  },
}