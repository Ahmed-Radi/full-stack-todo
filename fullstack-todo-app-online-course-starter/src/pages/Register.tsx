import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { ErrorResponse, IFormInput, IRegisterInput } from "../interfaces";
import { registerSchema } from "../components/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";


const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema)
  })
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true)
    try {
      await axiosInstance.post("/auth/local/register", data);
      toast.success('You will navigate to the login page after 4 second to login',
        {
          position: "bottom-center",
          duration: 4000,
          style: {
            background: "black",
            color: "white",
            width: "fit-content"
          }
        }
      );
    } catch (error) {
      console.log('error', error)
      const errorObj = error as AxiosError<ErrorResponse>;
      console.log('errorObj', errorObj.response?.data?.error?.message)
      toast.error(`${errorObj.response?.data?.error?.message}`,
        {
          position: "bottom-center",
          duration: 4000,
          style: {
            background: "black",
            color: "white",
            width: "fit-content"
          }
        }
      );
    } finally {
      setIsLoading(false)
    }
  }

  // ** Renders
  const renderRegisterForm = REGISTER_FORM.map(({ name, placeholder, type, validation }: IRegisterInput, index: number) => (
    <div key={index}>
      <Input placeholder={placeholder} type={type} {...register(name, validation)} />
      {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
    </div>
  ))
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {renderRegisterForm}

        <Button fullWidth isLoading={isLoading}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
