import Button from "./ui/Button";
import { ITodo } from "../interfaces";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { ChangeEvent, useState } from "react";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import { queryClient } from "../main";

const TodoList = () => {
  const storageKey = "user"
  const userDataString = localStorage.getItem(storageKey)
  const userData = userDataString ? JSON.parse(userDataString) : null

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  })
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)

  const { isLoading: isLoadingData, data } = useAuthenticatedQuery({
    queryKey: ['todoData'],
    url: '/users/me?populate=todos',
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`
      }
    }
  })

  // * Handlers
  // Edit
  const onCloseEditModal = () => {
    setIsEditModalOpen(false)
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    })
  }

  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo)
    setIsEditModalOpen(true)
  }

  const submitEdits = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const { title, description } = todoToEdit
    try {
      await axiosInstance.put(`/todos/${todoToEdit.id}`, {
        data: {
          title,
          description
        }
      }, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`
        }
      })
      onCloseEditModal()
    } catch (error) {
      console.log('error', error)
    } finally {
      queryClient.invalidateQueries({ queryKey: ['todoData'] });
      setIsLoading(false)
    }
  }

  // Remove
  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenConfirmModal(false);
  };

  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  }

  const onSubmitRemoveTodo = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`
        }
      })
      if (status === 200) {
        closeConfirmModal();
        queryClient.invalidateQueries({ queryKey: ['todoData'] });
        setIsLoading(false)
      }
    } catch (error) {
      console.log('error')
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTodoToEdit((prev) => ({
      ...(prev),
      [name]: value
    }))
  }

  if (isLoadingData) return 'Loading...'

  return (
    <div className="space-y-1">

      {data.length ? data?.map(({ id, title, description }: ITodo) => {
        return <div key={id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <p className="w-full font-semibold">{id} - {title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"} onClick={() => onOpenEditModal({ id, title, description })}>Edit</Button>
            <Button variant={"danger"} size={"sm"} onClick={() => openConfirmModal({ id, title, description })}>
              Remove
            </Button>
          </div>
        </div>
      }) : <h3>No Todo yet.</h3>}

      {/* Edit todo Modal */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onCloseEditModal}
        title="Edit this todo"
      >
        <form className="space-y-3" onSubmit={submitEdits}>
          <Input value={todoToEdit.title} onChange={onChangeHandler}
            name="title"
          />
          <Textarea value={todoToEdit.description} onChange={onChangeHandler}
            name="description"
          />
          <div className="flex items-center space-x-3 mt-3">
            <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isLoading}>Update</Button>
            <Button variant="cancel" onClick={onCloseEditModal}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Edit todo Modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button variant={"danger"} size={"sm"} onClick={onSubmitRemoveTodo} isLoading={isLoading}>
            Yes, remove
          </Button>
          <Button variant={"cancel"} size={"sm"} onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
