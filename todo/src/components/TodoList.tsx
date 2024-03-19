import Button from "./ui/Button";
import { ITodo } from "../interfaces";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";

const TodoList = () => {
  const storageKey = "user"
  const userDataString = localStorage.getItem(storageKey)
  const userData = userDataString ? JSON.parse(userDataString) : null

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ['todoData'],
    url: '/users/me?populate=todos',
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`
      }
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
