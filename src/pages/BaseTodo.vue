<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { getTodos, createTodos, updateTodos, deleteTodos } from "../lib/todoCalls";
import type { Todo } from "../lib/todoCalls";
import { useServerError } from "../lib/useServerError";

// 🔹 Reactive state
const page = ref(1);
const limit = 10;
const title = ref("");
const description = ref("");
type FilterType = "all" | "completed" | "not_completed";
const filter = ref<FilterType>("all");
const filters: FilterType[] = ["all", "not_completed", "completed"];
const searchTerm = ref("");
const editTodo = ref<Todo | null>(null);

const serverError = ref<string | null>(null);

const { handleServerError } = useServerError();
const queryClient = useQueryClient();

// ✅ useQuery (v5-compatible, with onError fix)
const {
  data: todos,
  isPending: isLoading,
  isError,
  error,
} = useQuery<Todo[], Error>({
  queryKey: ["todos", page],
  queryFn: async () =>
    await getTodos({
      page: page.value,
      limit,
      sort: "createdAt",
      order: "desc",
    }),
  placeholderData: () => [],
  retry: false, // disable retries for easier debugging
});

// ✅ Watch for query error manually since v5 no longer accepts `onError` in useQuery
if (isError && error) handleServerError(error);

// ✅ Computed — safely handle `todos` being undefined
const todosLength = computed(() => (todos.value ?? []).length);

// 🔹 Create Todo
const createMutation = useMutation({
  mutationFn: createTodos,
  onSuccess: (createdTodo: Todo) => {
    queryClient.setQueryData<Todo[]>(["todos", page.value], (old = []) => [
      createdTodo,
      ...old,
    ]);
    page.value = 1;
    title.value = "";
    description.value = "";
  },
});

// 🔹 Toggle Complete
const toggleMutation = useMutation({
  mutationFn: ({ id, updatedTodo }: { id: number; updatedTodo: Todo }) =>
    updateTodos(id, updatedTodo),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
});

// 🔹 Delete Todo
const deleteMutation = useMutation({
  mutationFn: deleteTodos,
  onSuccess: (deletedId: number) => {
    queryClient.setQueryData<Todo[]>(["todos", page.value], (old = []) =>
      (old ?? []).filter((todo: Todo) => todo.id !== deletedId)
    );
  },
});

// 🔹 Handlers
const handleSubmit = async () => {
  if (!title.value.trim()) return;
  const newTodo = {
    title: title.value.trim(),
    description: description.value.trim(),
    completed: false,
  };
  await createMutation.mutateAsync(newTodo);
};

const handleToggleComplete = (todo: Todo) => {
  const updatedTodo = { ...todo, completed: !todo.completed };
  toggleMutation.mutate({ id: todo.id!, updatedTodo });
};

const handleDelete = (id: number) => deleteMutation.mutate(id);

// 🔹 Computed filtered list
const filteredTodos = computed(() =>
  (todos.value ?? [])
    .filter((todo: Todo) =>
      filter.value === "completed"
        ? todo.completed
        : filter.value === "not_completed"
        ? !todo.completed
        : true
    )
    .filter((todo: Todo) =>
      todo.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
);
</script>


<template>
  <div class="flex flex-col justify-center items-center m-4 p-4 font-medium">
    <div class="text-center mb-4">
      <h1 class="text-2xl md:text-3xl lg:text-4xl">Deborah's Todo App</h1>
      <p class="text-base md:text-xl lg:text-2xl text-gray-400">
        A modern task management app
      </p>
    </div>

    <!-- 🩶 Loading & Error -->
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="isError || serverError">
      Error: {{ error?.message || serverError }}
    </p>

    <!-- 🩶 Form -->
    <form
      class="w-full max-w-2xl border p-4 shadow-md rounded mb-6"
      @submit.prevent="handleSubmit"
    >
      <h2 class="text-xl mb-2">
        {{ editTodo ? "Edit Todo" : "Add New Todo" }}
      </h2>
      <div class="grid md:grid-cols-2 gap-2">
        <div>
          <label class="block mb-1">Title</label>
          <input
            type="text"
            v-model="title"
            placeholder="Add title..."
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label class="block mb-1">Description</label>
          <input
            type="text"
            v-model="description"
            placeholder="Add description..."
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="createMutation.isPending.value"
            class="bg-blue-700 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            {{ createMutation.isPending ? "Adding..." : "Add" }}
          </button>
        </div>
      </div>
    </form>

    <!-- 🩶 Search -->
    <div class="w-full max-w-2xl mb-4">
      <input
        type="text"
        placeholder="Search by title..."
        v-model="searchTerm"
        class="w-full p-2 border rounded shadow-sm"
      />
    </div>

    <!-- 🩶 Filters -->
    <div class="flex gap-4 mb-4">
      <button
        v-for="f in filters"
        :key="f"
        @click="filter = f"
        :class="[
          'px-4 py-2 rounded',
          filter === f ? 'bg-blue-700 text-white' : 'bg-gray-200',
        ]"
      >
        {{ f === "all" ? "All" : f === "not_completed" ? "Not Completed" : "Completed" }}
      </button>
    </div>

    <!-- 🩶 Todo List -->
    <section class="mt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="['border shadow p-4 rounded', todo.completed ? 'bg-green-50' : '']"
        >
          <div class="flex justify-between items-center">
            <h3
              :class="[
                'text-lg font-semibold',
                todo.completed ? 'line-through text-gray-500' : '',
              ]"
            >
              {{ todo.title }}
            </h3>
            <input
              type="checkbox"
              v-model="todo.completed"
              @change="handleToggleComplete(todo)"
            />
          </div>
          <p class="text-sm text-gray-700 mt-2">
            {{ todo.description || "No description" }}
          </p>
          <p class="mt-2 font-medium" :class="todo.completed ? 'text-green-600' : 'text-yellow-600'">
            Status: {{ todo.completed ? "Completed" : "Not Completed" }}
          </p>

          <div class="flex justify-end gap-3 mt-4">
            <button
              class="text-blue-600"
              @click="
                editTodo = todo;
                title = todo.title;
                description = todo.description || '';
              "
            >
              ✏️
            </button>
            <button class="text-blue-600" @click="handleDelete(todo.id!)">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 🩶 Pagination -->
    <div class="flex items-center justify-between mt-8 w-full max-w-xl">
      <button
        @click="page = Math.max(page - 1, 1)"
        :disabled="page === 1"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-400 text-white rounded"
      >
        Previous
      </button>
      <span>Page {{ page }}</span>
      <button
        @click="page++"
        :disabled="todosLength < limit"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-400 text-white rounded"
      >
        Next
      </button>
    </div>
  </div>
</template>
