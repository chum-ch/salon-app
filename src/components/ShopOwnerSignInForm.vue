<template>
  <div class="shop-owner-form w-full">
    <PriToast class="w-max" />
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      class="flex flex-wrap w-full"
      @submit="onFormSubmit"
    >
      <div class="w-full shop-owner-input">
        <div class="w-full my-2">
          <PriInputText
            name="ShopOwnerCode"
            type="text"
            placeholder="លេខកូដហាង"
            fluid
            v-model="initialValues.ShopOwnerCode"
            @keyup="checkAvailableCode(initialValues.ShopOwnerCode)"
          />
          <PriMessage
            v-if="$form.ShopOwnerCode?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.ShopOwnerCode.error.message }}
          </PriMessage>
          <div
            class="available-code d-flex flex-wrap"
            v-if="
              availableCode.length > 0 &&
              initialValues.ShopOwnerCode.length === 4
            "
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
        <small
          >តើអ្នកធ្លាប់មានបានបង្កើតហាងពីមុនអត់?
          <router-link to="/signup">បង្កើតថ្មី</router-link></small
        >
      </div>

      <CustomButton
        type="submit"
        :severity="true"
        :label="'ចូលប្រើប្រាស់'"
        class="w-full my-4"
        :loading="loading"
        :disabled="
          !initialValues.ShopOwnerEmail ||
          !initialValues.ShopOwnerCode ||
          $form.ShopOwnerEmail?.invalid ||
          $form.ShopOwnerCode?.invalid ||
          loading ||
          availableCode.length > 0
        "
      />
    </Form>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
const $api = inject("$api");
const availableCode = ref([9995, 2299, 8199]);
const refToChildCustomDialog = ref();
const getNewCode = (newCode) => {
  availableCode.value = [];
  initialValues.value.ShopOwnerCode = newCode;
};
const checkAvailableCode = async (code) => {
  availableCode.value = [];
  if (code.length === 4) {
    try {
      let codes = await $api.user.getAvailableCode({ CodeShop: Number(code) });
      availableCode.value = codes.data;
    } catch (error) {
      console.log(error);
    }
  }
};
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

const toast = useToast();
const loading = ref(false);
const initialValues = ref({
  ShopOwnerEmail: "",
  ShopOwnerCode: "",
});

const resolver = zodResolver(
  z.object({
    ShopOwnerEmail: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email address." })
      .trim(),
    ShopOwnerCode: z
      .string() // IMPORTANT: Validate as string first for precise length control
      .min(1, { message: "Code is required." }) // Ensures the field isn't empty
      .length(4, { message: "Code must be a 4-digits." }), // Ensures string is exactly 4 characters
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
<style scoped></style>
