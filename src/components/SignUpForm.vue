<template>
  <div class="login-form p-3">
    <div class="logo text-center">
      <img src="/imgs/salon.png" alt="logo" />
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
            name="Name"
            type="text"
            placeholder="ឈ្មោះហាង"
            fluid
            v-model="initialValues.Name"
          />
          <PriMessage
            v-if="$form.Name?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.Name.error.message }}</PriMessage
          >
        </div>
        <div class="w-full my-2">
          <PriInputText
            name="Code"
            placeholder="លេខកូដ"
            fluid
            v-model="initialValues.Code"
          />
          <PriMessage
            v-if="$form.Code?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.Code.error.message }}
          </PriMessage>
        </div>
        <div class="w-full my-2">
          <PriInputText
            name="PhoneNumber"
            type="text"
            placeholder="លេខទូរស័ព្ទ"
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
            placeholder="អ៊ីមែល"
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

        <small class=""
          >តើអ្នកធ្លាប់បានបង្កើតហាងហើយឬនៅ?
          <router-link to="/login">ចូលទៅហាង</router-link></small
        >
        <CustomButton
          type="submit"
          severity="primary"
          :label="'បង្កើតថ្មី'"
          class="w-full mt-4"
          :loading="loading"
          :disabled="
            !initialValues.Name ||
            $form.Name?.invalid ||
            !initialValues.PhoneNumber ||
            $form.PhoneNumber?.invalid ||
            !initialValues.Email ||
            $form.Email?.invalid ||
            !initialValues.Code ||
            $form.Code?.invalid ||
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
  Name: "",
  PhoneNumber: "",
  Email: "",
  Code: "",
});

const resolver = zodResolver(
  z.object({
    Name: z.string().min(1, { message: "Full name is required." }).trim(),
    PhoneNumber: z
      .string()
      .trim()
      .min(1, { message: "Phone number is requird." })
      .refine((value) => /^\d+$/.test(value), {
        message: "No space and acept only numbers.",
      }),
    Email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email address." })
      .trim(),
    // Code: z
    //   .number({
    //     required_error: "Code is required.", // Message for when value is missing/undefined
    //     invalid_type_error: "Code must be a number.", // Message for when value isn't a number
    //   })
    //   .int("Code must be an integer.") // Ensures it's a whole number (no decimals)
    //   .min(1000, { message: "Code must be 4 digits." }) // Minimum 4-digit number
    //   .max(9999, { message: "Code must be 4 digits." }) // Maximum 4-digit number
    //   .nullable() // Allows null as a valid initial state if the field is empty
    // .refine(val => val !== null, { message: "Code is required." }) // Refine to make sure null is not valid for submission
    Code: z
      .string() // IMPORTANT: Validate as string first for precise length control
      .min(1, { message: "Code is required." }) // Ensures the field isn't empty
      .length(4, { message: "Code must be a 4-digits." }), // Ensures string is exactly 4 characters
    // .refine((value) => /^\d{4}$/.test(value), {
    //   message: "Code must be a 4-digit number.", // Ensures all 4 characters are digits
    // })
    //   .transform(Number) // Convert to number ONLY after all string checks pass
    // Code: z
    //   .union([
    //     z.number().lte(9999, { message: 'Must be 4 digits.' }),
    //     z.literal(null)
    //   ]).refine((val) => val !== null, { message: 'Number is required.' })
    //   // .union([z.number().gt(0, { message: 'Must be greater than 0.' }).lt(10, { message: 'Must be less than 10.' }), z.literal(null)]).refine((val) => val !== null, { message: 'Number is required.' })
  })
);

const onFormSubmit = (e) => {
  if (e.valid) {
    console.log("ad");
  }

  loading.value = true;
  setTimeout(() => {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
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
