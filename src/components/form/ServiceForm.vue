<template>
  <div class="service-form">
    <div class="logo text-center">
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
            placeholder="ឈ្មោះសេវាកម្ម"
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
          <PriInputNumber
            name="Code"
            fluid
            placeholder="លេខកូដ"
            :useGrouping="false"
            v-model="initialValues.Code"
            @input="checkAvailableCode"
            :min="0"
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
            loading ||
            availableCode.length > 0
          "
        />
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import OtpForm from "./OtpForm.vue";
const toast = useToast();
const loading = ref(false);
const isShowFormSignUp = ref(true);
const availableCode = ref([]);
const $api = inject("$api");
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
    Code: z
      .union([
        z.string(),
        z
          .number()
          .int({ message: "Code must be an integer." })
          .min(1000, { message: "Code must be a 4-digit number." })
          .max(9999, { message: "Code must be a 4-digit number." }),
      ])
      .nullable()
      .refine((val) => val !== null, {
        message: "Code is required.",
      }),
  })
);
const onBackClick = () => {
  isShowFormSignUp.value = true;
};
const getNewCode = (newCode) => {
  availableCode.value = [];
  initialValues.value.Code = newCode;
};
const checkAvailableCode = async (event) => {
  const code = String(event.value);
  availableCode.value = [];
  initialValues.value.Code = event.value;
  if (event.value && code.length === 4) {
    try {
      let codes = await $api.user.getAvailableCode({ CodeShop: Number(code) });
      availableCode.value = codes.data;
    } catch (error) {
      console.error(error);
    }
  }
};
const onFormSubmit = async (e) => {
  try {
    if (e.valid) {
      loading.value = true;
      const body = {
        Name: initialValues.value.Name,
        Code: Number(initialValues.value.Code),
        Email: initialValues.value.Email,
        Phone: initialValues.value.PhoneNumber,
      };
      await $api.user.tenantRegister(body);
      setTimeout(() => {
        toast.add({
          severity: "success",
          summary: "Form is submitted.",
          life: 3000,
        });
        loading.value = false;
        isShowFormSignUp.value = false;
      }, 2000);
    }
  } catch (error) {
    loading.value = false;
    console.error(error);
  }
};
</script>
<style scoped>
.login-form {
  /* margin: auto;
  width: 25%;
  box-shadow: #63636333 0px 2px 8px 0px;
  border-radius: 0.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
}
/* img {
  width: 70%;
  border-radius: 50%;
} */
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */
@media (min-width: 360px) and (max-width: 768px) {
  .login-form {
    width: 90%;
  }
}
</style>
