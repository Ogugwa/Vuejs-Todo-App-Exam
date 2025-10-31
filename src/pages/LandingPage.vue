<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isHovered = ref(false);

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + "/");
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="flex p-4 justify-center items-center gap-4 shadow-md bg-white ">
      <!-- Todoist icon (SVG) -->
      <svg class="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
      </svg>
      <h1 class="text-2xl font-bold text-gray-800 md:flex-1 text-center">
        Deborah Okolo App
      </h1>
    </nav>

    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center p-6 mt-6">
      <h2 class="font-bold text-xl md:text-3xl text-center mb-4">
        Your tasks. Your notes. One smooth workspace.
      </h2>

      <p class="text-gray-600 text-center max-w-md">
        No clutter, no chaos.
        <span class="font-bold text-blue-500"> Deborah's App</span> helps you
        stay on top of your thoughts and to-dos, without breaking your flow.
      </p>

      <div class="flex flex-col md:flex-row gap-4 mt-6">
        <button
          @click="router.push('/login')"
          :class="[
            'w-40 px-4 py-2 rounded',
            isActive('/login')
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-black hover:bg-blue-500 hover:text-white'
          ]"
        >
          Log In
        </button>

        <button
          @click="router.push('/signup')"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          :class="[
            'w-40 px-4 py-2 rounded border border-blue-500 transition',
            isHovered ? 'bg-white text-black' : 'bg-blue-200 text-blue-700'
          ]"
        >
          Sign Up
        </button>
      </div>
    </section>

    <!-- Hero Image -->
    <section class="mt-8 w-full flex justify-center">
      <div class="relative w-full max-w-6xl h-[340px] md:h-[420px] rounded-lg overflow-hidden shadow-lg">
        <img
          src="/images/hero_img.webp"
          alt="Hero"
          class="w-full h-full object-cover"
        />
      </div>
    </section>
  </div>
</template>
