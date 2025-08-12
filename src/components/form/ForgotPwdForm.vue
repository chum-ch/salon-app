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
    default: () => true,
  },
});
defineEmits(["onBackClick"]);

const $api = inject("$api");
const refToChildCustomDialog = ref();
const isShowOtpForm = ref(false);
const toast = useToast();
const loading = ref(false);
const initialValues = ref({
  ShopOwnerEmail: "",
  ShopOwnerCode: "",
});
const resetCode = (event) => {
  initialValues.value.ShopOwnerCode = event.value;
}
const createStudentInfo = async () => {
  try {
    // refToChildCustomDialog.value.openDialog();
    let classes = await $api.user.listUsers();
    console.log(classes);
  } catch (error) {
    console.log(error);
  }
};
const closeDialogStudentForm = () => {
  refToChildCustomDialog.value.closeDialog();
};

const resolver = zodResolver(
  z.object({
    ShopOwnerEmail: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email address." })
      .trim(),
    ShopOwnerCode: z
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

const onFormSubmit = (e) => {
  if (e.valid) {
    console.log("ad", initialValues.value);
  }

  loading.value = true;
  setTimeout(() => {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
    loading.value = false;
    isShowOtpForm.value = true;
  }, 2000);
};
</script>
<template>
  <div class="forgot-pwd-form p-3" v-if="!isShowOtpForm">
    <i
      v-if="isShowBackBtn"
      @click="($event) => $emit('onBackClick', $event)"
      class="pi pi-chevron-left text-blue-500 bg-blue-50 p-2 border-circle hover:bg-gray-200 cursor-pointer"
    ></i>
    <div class="logo text-center">
      <img src="/imgs/salon.png" alt="logo" />
    </div>
    <PriToast class="w-max" />
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      class="flex flex-wrap w-full mt-4"
      @submit="onFormSubmit"
    >
      <div class="w-full shop-owner-input">
        <div class="w-full my-2">
          <PriInputNumber
            name="ShopOwnerCode"
            type="text"
            :useGrouping="false"
            :min="0"
            @input="resetCode"
            placeholder="លេខកូដហាង"
            fluid
            v-model="initialValues.ShopOwnerCode"
          />
          <PriMessage
            v-if="$form.ShopOwnerCode?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.ShopOwnerCode.error.message }}
          </PriMessage>
        </div>

        <div class="w-full my-2">
          <PriInputText
            name="ShopOwnerEmail"
            type="text"
            placeholder="អ៊ីមែល"
            fluid
            v-model="initialValues.ShopOwnerEmail"
          />
          <PriMessage
            v-if="$form.ShopOwnerEmail?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.ShopOwnerEmail.error.message }}
          </PriMessage>
        </div>
      </div>

      <CustomButton
        type="submit"
        :severity="true"
        :label="'កំណត់សជាថ្មី'"
        class="w-full my-4"
        :loading="loading"
        :disabled="
          !initialValues.ShopOwnerEmail ||
          !initialValues.ShopOwnerCode ||
          $form.ShopOwnerEmail?.invalid ||
          $form.ShopOwnerCode?.invalid ||
          loading
        "
      />
    </Form>
  </div>
  <OtpForm v-else @onBackClick="isShowOtpForm = false"
    :email="initialValues.ShopOwnerEmail"
   />
</template>

<style scoped>
.forgot-pwd-form {
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
  width: 60%;
  border-radius: 50%;
}
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */
@media (min-width: 360px) and (max-width: 768px) {
  .forgot-pwd-form {
    width: 90%;
  }
}
</style>
