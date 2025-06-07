import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useUpdateTodo = (setTodos) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateTodo = async (todo) => {
    try {
      setIsLoading(true);
      // Use relative URL for Docker environment
      const response = await fetch(
        `/api/todos/${todo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isCompleted: !todo.isCompleted }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item._id === todo._id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : item
        )
      );
    } catch (error) {
      CustomErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTodo, isUpdatingTodo: isLoading };
};

export default useUpdateTodo;
