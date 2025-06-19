<template>
  <div class="login-form p-3">
    <h1 class="text-white font-bold">G10</h1>
    <div class="logo text-center">
      <img src="../assets/p2.jpeg" alt="logo" />
    </div>
    <div class="form">
        <PriToast />
        <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="flex flex-wrap w-full">
            <div class="w-full my-2">
                <PriInputText name="email" type="text" placeholder="Email" fluid v-model="initialValues.email" />
                <PriMessage v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error.message }}</PriMessage>
            </div>
            <div class="w-full my-2">
                <PriPassword name="password" placeholder="Password" :feedback="false" toggleMask fluid v-model="initialValues.password" />
                <PriMessage v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                    <ul class="my-0 px-4">
                        <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                    </ul>
                </PriMessage>
            </div>
            <PriButton type="submit" severity="primary" label="Login" class="w-full my-4" />
        </Form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';
import { Form } from '@primevue/forms';

const toast = useToast();
const disabled = ref(true);
const initialValues = ref({
    email: '',
    password: ''
});

const resolver = zodResolver(
    z.object({
        email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }).trim(),
        password: z
            .string()
            .min(3, { message: 'Minimum 3 characters.' })
            .max(8, { message: 'Maximum 8 characters.' })
            .refine((value) => /[a-z]/.test(value) && /[A-Z]/.test(value), {
              message: 'At least one lower and uppercase letter.'
            })
            .refine((value) => /\d/.test(value) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~]/.test(value), {
                message: 'At least one number and special character.'
            })
    })
);

const onFormSubmit = (e) => {

    if (e.valid) {
        toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 });
    }
};
</script>
<style scoped>
.login-form {
  margin: auto;
  width: 25%;
  box-shadow: #63636333 0px 2px 8px 0px;
  border-radius: .5rem;
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
    width: 85%;
  }
  
}
</style>
