<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabaseClient";
import FormFooter from "../components/FormFooter.vue";


// Form state
const email = ref("");
const password = ref("");
const loading = ref(false);
const errors = ref<{ email?: string; password?: string }>({});

const router = useRouter();

// Email regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Form submit handler
const handleSubmit = async () => {
  errors.value = {};

  // Validation
  if (!email.value) {
    errors.value.email = "Email is required";
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = "Invalid email address";
  }

  if (!password.value) {
    errors.value.password = "Password is required";
  } else if (password.value.length < 8) {
    errors.value.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  loading.value = false;

  if (error) {
    alert(error.message);
  } else {
    router.push("/basetodo"); // redirect
  }
};

// Google login
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
  if (error) alert(error.message);
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between shadow-xl overflow-hidden w-full lg:w-[80%]">

      <!-- Left Form -->
      <div class="flex flex-col justify-center p-8 w-full lg:w-1/2 bg-white">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p class="mt-2 text-gray-600">Login to your Deborah's App account</p>
        </div>

        <form class="flex flex-col space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-md font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-md"
              v-model="email"
            />
            <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
          </div>

          <div>
            <label class="block text-md font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-md"
              v-model="password"
            />
            <span v-if="errors.password" class="text-red-500">{{ errors.password }}</span>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-blue-600 hover:bg-purple-500"
          >
            {{ loading ? "Signing in..." : "Login" }}
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6 text-center relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white">Or</span>
          </div>
        </div>

        <!-- Google login -->
        <div class="mt-6">
          <button
            @click="handleGoogleLogin"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50"
          >
            <svg class="h-5 w-5" viewBox="0 0 533.5 544.3">
  <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34-4.6-50.2H272v95.1h147.5c-6.4 34.6-25.9 63.9-55.2 83.5v69.1h89.2c52.2-48.1 82-118.8 82-197.5z"/>
  <path fill="#34A853" d="M272 544.3c74.8 0 137.5-24.7 183.3-67.2l-89.2-69.1c-24.7 16.6-56.3 26.3-94.1 26.3-72.5 0-134-48.9-155.7-114.9H27.9v72.4C73.2 475.1 166.2 544.3 272 544.3z"/>
  <path fill="#FBBC05" d="M116.3 321.5c-5-15-7.9-31-7.9-47.5s2.9-32.5 7.9-47.5V153.6H27.9c-14.7 29.3-23.2 62.4-23.2 99.4s8.5 70.1 23.2 99.4l88.4-72.4z"/>
  <path fill="#EA4335" d="M272 107.7c39.6 0 75.1 13.6 103.1 40.2l77.2-77.2C407.4 24.8 344.7 0 272 0 166.2 0 73.2 69.2 27.9 153.6l88.4 72.4C138 156.6 199.5 107.7 272 107.7z"/>
</svg>

            Login with Google
          </button>
        </div>

        <!-- Signup link -->
        <div class="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?
          <router-link to="/signup" class="font-medium text-blue-600 hover:text-blue-500">
            Sign Up
          </router-link>
        </div>
      </div>

      <!-- Right image -->
      <div class="hidden lg:block lg:w-1/2">
        <img
          src="/images/login_img.jpg"
          alt="Login illustration"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <FormFooter />
  </div>
</template>
