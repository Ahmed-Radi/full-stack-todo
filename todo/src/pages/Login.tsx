import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LOGIN_FORM } from "../data";
import { ErrorResponse, ILoginFormInput, ILoginInput } from "../interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../components/validation";
import InputErrorMessage from "../components/InputErrorMessage";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useState } from "react";

const LoginPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors }  } = useForm<ILoginFormInput>({
    resolver: yupResolver(loginSchema), // yup, joi and even your own.
  })

  const onSubmit: SubmitHandler<ILoginFormInput> = async (data) => {
    try {
      setIsLoading(true)
      const { data: resData } = await axiosInstance.post("auth/local", data)
      toast.success('Welcome back! You will navigate to the home page after 2 second', {
        position: "bottom-center",
        duration: 1500,
        style: {
          background: "black",
          color: "white",
          width: "fit-content"
        }
      });

      localStorage.setItem('user', JSON.stringify(resData))
      setTimeout(() => location.replace('/'), 2000);
    } catch (error) {
      setIsLoading(true)
      const errorObj = error as AxiosError<ErrorResponse>
      toast.error(`${errorObj.response?.data?.error?.message}`,{
        position: "bottom-center",
        duration: 1500,
        style: {
          background: "black",
          color: "white",
          width: "fit-content"
        }
      });
    } finally {
      setIsLoading(false)
    }
  }
  //* render
  const renderLoginForm = LOGIN_FORM.map(({ name, placeholder, type, validation }: ILoginInput, index: number) => {
    return <div key={index}>
      <Input placeholder={placeholder} type={type} {...register(name, validation)} />
      {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
    </div>
  })

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {renderLoginForm}

        <Button fullWidth isLoading={isLoading}>Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;
