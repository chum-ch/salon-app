<template>
  <div class="login-form p-3">
    <h1 class="text-white font-bold">G10</h1>
    <div class="logo text-center">
      <img src="../assets/p2.jpeg" alt="logo" />
    </div>
    <div class="form">
      <PriToast class="w-max" />
      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        class="flex flex-wrap w-full"
        @submit="onFormSubmit"
      >
        <div class="w-full mb-2 mt-4">
          <PriInputText
            name="FullName"
            type="text"
            placeholder="Full name"
            fluid
            v-model="initialValues.FullName"
          />
          <PriMessage
            v-if="$form.FullName?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.FullName.error.message }}</PriMessage
          >
        </div>
        <div class="w-full my-2">
          <PriInputText
            name="PhoneNumber"
            type="text"
            placeholder="Phone number"
            fluid
            v-model="initialValues.PhoneNumber"
          />
          <PriMessage
            v-if="$form.PhoneNumber?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.PhoneNumber.error.message }}</PriMessage
          >
        </div>
        <div class="w-full my-2">
          <PriInputText
            name="Email"
            type="text"
            placeholder="Email"
            fluid
            v-model="initialValues.Email"
          />
          <PriMessage
            v-if="$form.Email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Email.error.message }}</PriMessage
          >
        </div>
        <div class="w-full my-2">
          <PriPassword
            name="Password"
            placeholder="Password"
            :feedback="false"
            toggleMask
            fluid
            v-model="initialValues.Password"
          />
          <PriMessage
            v-if="$form.Password?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            <ul class="px-3">
              <li v-for="(error, index) of $form.Password.errors" :key="index">
                {{ error.message }}
              </li>
            </ul>
          </PriMessage>
        </div>
        <small class="">Already have an account? <router-link to="/login">Login</router-link></small>
        <CustomButton
          type="submit"
          severity="primary"
          :label="'Sign up'"
          class="w-full mt-4"
          :loading="loading"
          :disabled="
            !initialValues.FullName ||
            $form.FullName?.invalid ||
            !initialValues.PhoneNumber ||
            $form.PhoneNumber?.invalid ||
            !initialValues.Email ||
            $form.Email?.invalid ||
            !initialValues.Password ||
            $form.Password?.invalid ||
            loading
          "
        />

      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";

const toast = useToast();
const loading = ref(false);
const initialValues = ref({
  FullName: "",
  PhoneNumber: "",
  Email: "",
  Password: "",
});

const resolver = zodResolver(
  z.object({
    FullName: z.string().min(1, { message: "Full name is required." }).trim(),
    PhoneNumber: z
      .string()
      .trim()
      .min(1, { message: "Phone number is requird." })
      .refine((value) => /^\d+$/.test(value), {
        message: "Acept only numbers.",
      }),
    Email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email address." })
      .trim(),
    Password: z
      .string()
      .min(3, { message: "Minimum 3 characters." })
      .max(8, { message: "Maximum 8 characters." })
      .refine((value) => /[a-z]/.test(value) && /[A-Z]/.test(value), {
        message: "At least one lower and uppercase letter.",
      })
      .refine(
        (value) =>
          /\d/.test(value) &&
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~]/.test(value),
        {
          message: "At least one number and special character.",
        }
      ),
  })
);

const onFormSubmit = (e) => {
  console.log("ad");

  if (e.valid) {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
  }

  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>
<style scoped>
.login-form {
  margin: auto;
  width: 25%;
  box-shadow: #63636333 0px 2px 8px 0px;
  border-radius: 0.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
img {
  width: 70%;
  border-radius: 50%;
}
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */
@media (min-width: 360px) and (max-width: 768px) {
  .login-form {
    width: 90%;
  }
}
</style>
