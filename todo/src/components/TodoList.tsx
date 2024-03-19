import Button from "./ui/Button";
import axiosInstance from "../config/axios.config";
import { ITodo } from "../interfaces";
import { useQuery } from "@tanstack/react-query";

const TodoList = () => {
  const storageKey = "user"
  const userDataString = localStorage.getItem(storageKey)
  const userData = userDataString ? JSON.parse(userDataString) : null

  const { isLoading, data } = useQuery({
    queryKey: ['todoData'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/me?populate=todos', {
        headers: {
          Authorization: `Bearer ${userData.jwt}`
        }
      })
      return res.data.todos
    }
  })

  if (isLoading) return 'Loading...'

  return (
    <div className="space-y-1">

      {data.length ? data?.map(({ id, title }: ITodo) => {
        return <div key={id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <p className="w-full font-semibold">{id} - {title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"}>Edit</Button>
            <Button variant={"danger"} size={"sm"}>
              Remove
            </Button>
          </div>
        </div>
      }) : <h3>No Todo yet.</h3>}

    </div>
  );
};

export default TodoList;
