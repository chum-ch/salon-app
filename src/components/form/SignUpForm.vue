<template>
  <div class="login-form p-3" v-if="isShowFormSignUp">
    <i
      v-if="isShowBackBtn"
      @click="$router.go(-1)"
      class="pi pi-chevron-left text-blue-500 bg-blue-50 p-2 border-circle hover:bg-gray-200 cursor-pointer"
    ></i>
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

          <div
            class="available-code d-flex flex-wrap"
            v-if="availableCode.length > 0"
          >
            កូដខាងលើបានប្រើហើយ សូមជ្រើសរើសកូដថ្មី។
            <span
              class="ml-0 mr-2 text-blue-500 underline"
              v-for="(code, index) in availableCode"
              :key="index"
              @click="getNewCode(availableCode[index])"
              style="cursor: pointer"
            >
              {{ code }}</span
            >
          </div>
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
  <OtpForm
    :email="initialValues.Email"
    v-else
    @onBackClick="onBackClick()"
    :additionalData="initialValues"
    :isForgotPwd="false"
  />
</template>

<script setup>
import { ref, inject } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import OtpForm from "./OtpForm.vue";

defineProps({
  isShowBackBtn: {
    type: Boolean,
    default: () => false,
  },
});
defineEmits(["onBackClick"]);
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
  if (e.valid) {
    loading.value = true;
    setTimeout(async () => {
      try {
        toast.add({
          severity: "success",
          summary: "Form is submitted.",
          life: 3000,
        });
        const body = {
          Name: initialValues.value.Name,
          Code: Number(initialValues.value.Code),
          Email: initialValues.value.Email,
          Phone: initialValues.value.PhoneNumber,
        };

        const { data: { EntityItemId } } = await $api.user.tenantRegister(body);
        initialValues.value.TenantId = EntityItemId;
        loading.value = false;
        isShowFormSignUp.value = false;
      } catch (error) {
        loading.value = false;
        console.error(error);
      }
    }, 2000);
  }
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
@media (max-width: 768px) {
  .login-form {
    width: 90%;
  }
}

/* --- Tablets (landscape) and Laptops --- */
/* (e.g., min-width of 768px) */
@media (min-width: 768px) and (max-width: 992px) {
  .login-form {
    width: 50%;
  }
}
</style>
