<script setup lang="ts">
// No script logic needed for this footer
</script>

<template>
  <div class="w-full text-center p-4 mt-2">
    <p class="text-sm text-gray-600">
      By clicking continue, you agree to our
      <router-link
        to="/terms"
        class="font-medium text-blue-600 hover:text-blue-500"
      >
        Terms of Service
      </router-link>
      and
      <router-link
        to="/privacy"
        class="font-medium text-blue-600 hover:text-blue-500"
      >
        Privacy Policy
      </router-link>
      .
    </p>
  </div>
</template>
