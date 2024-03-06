import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { IFormInput, IRegisterInput } from "../interfaces";
import { registerSchema } from "../components/validation";
import { yupResolver } from "@hookform/resolvers/yup";


const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema)
  })
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
  }
console.log('er', errors)
  // ** Renders
  const renderRegisterForm = REGISTER_FORM.map(({ name, placeholder, type, validation}: IRegisterInput, index: number) => (
    <div key={index}>
      <Input placeholder={placeholder} type={type} {...register(name, validation) } />
      {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
    </div>
  ))
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {renderRegisterForm}

        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
