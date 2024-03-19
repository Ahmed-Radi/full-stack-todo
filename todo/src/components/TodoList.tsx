import Button from "./ui/Button";
import { ITodo } from "../interfaces";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { useState } from "react";

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // * Handlers
  const onToggleEditModal = () => {
    setIsEditModalOpen(prev => !prev)
  }

  if (isLoading) return 'Loading...'

  return (
    <div className="space-y-1">

      {data.length ? data?.map(({ id, title }: ITodo) => {
        return <div key={id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <p className="w-full font-semibold">{id} - {title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"} onClick={onToggleEditModal}>Edit</Button>
            <Button variant={"danger"} size={"sm"}>
              Remove
            </Button>
          </div>
        </div>
      }) : <h3>No Todo yet.</h3>}

      {/* Edit todo Modal */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onToggleEditModal}
        title="Edit this todo"
      >
        <Input value={'edit todo'} />
        <div className="flex items-center space-x-3 mt-3">
          <Button className="bg-indigo-700 hover:bg-indigo-800">Update</Button>
          <Button variant="cancel" onClick={onToggleEditModal}>Cancel</Button>
        </div>
      </Modal>

    </div>
  );
};

export default TodoList;
