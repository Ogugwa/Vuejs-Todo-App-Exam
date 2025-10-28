<script setup lang="ts">
// No script logic is required for a static 404 page
</script>

<template>
  <div class="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen px-6 text-center md:text-left">

    <!-- Text Section -->
    <div class="w-full md:w-1/2 space-y-4">
      <h1 class="text-6xl font-bold text-blue-700">404</h1>
      <h2 class="text-2xl font-semibold text-gray-800">Page Not Found</h2>
      <p class="text-gray-600">
        We couldn’t find the page you’re looking for. It might have been removed or moved.
      </p>

      <router-link to="/">
        <button class="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded transition">
          Go to Home
        </button>
      </router-link>
    </div>

    <!-- Image Section -->
    <div class="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
      <div class="relative w-full max-w-sm aspect-square">
        <img
          src="/images/error_img.jpg"
          alt="Error illustration"
          class="object-contain rounded w-full h-full"
        />
      </div>
    </div>

  </div>
</template>
