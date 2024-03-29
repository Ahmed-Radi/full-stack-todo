// register
export interface IRegisterFormInput {
  username: string
  email: string
  password: string
}
export interface IRegisterInput {
  name: keyof IRegisterFormInput;
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp
  };
}

// login
export interface ILoginFormInput {
  identifier: string
  password: string
}
export interface ILoginInput {
  name: keyof ILoginFormInput;
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp
  };
}

export interface ErrorResponse {
  error: {
    details?: {
      errors: {
        message: string
      }[];
    }
    message?: string;
  }
}

export interface ITodo {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}