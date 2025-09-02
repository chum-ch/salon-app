<template>
  <div class="file-uploader">
    <CustomDropdown
      :placeholder="'ជ្រើសរើសសេវាកម្ម'"
      :options="serviceOptions"
      :label="'ឈ្មោះសេវាកម្ម'"
      :required="isRequired"
      class="p-0 w-full mb-1"
      v-model="serviceSelection"
      @update:modelValue="getSelectOptionChange"
    />
    <file-pond
      name="image-upload"
      ref="pond"
      label-idle='<div> <i class="pi pi-cloud-upload m-0 p-0" style="font-size: 2rem;"></i> </div> ទាញរូបភាពទំលាក់ ឬ <span class="filepond--label-action no-underline">ចុចជ្រើសរើស</span>'
      v-on:updatefiles="handleFileUpdate"
      v-on:processfiles="handleUploadComplete"
      :allow-multiple="true"
      max-files="3"
      accepted-file-types="image/jpeg, image/png, image/gif"
      max-file-size="5MB"
      :files="selectedFile"
      :server="serverOptions"
      :instant-upload="false"
      :allow-image-preview="true"
      :allow-image-edit="true"
      :allow-image-crop="true"
      :image-crop-aspect-ratio="'1:1'"
      :allow-image-filter="true"
    />

    <button
      @click="submitFiles"
      :disabled="selectedFile.length === 0 || isRequired"
    >
      📤 Upload Files
    </button>
  </div>
</template>
<script setup>
import { ref, inject, getCurrentInstance } from "vue";

// Import Vue FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image Edit plugin styles
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";

// Import the Image Preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Import the necessary FilePond plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageFilter from "filepond-plugin-image-filter";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

// Create the FilePond component with the registered plugins
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageEdit,
  FilePondPluginImageFilter // <-- Added Image Filter plugin
);

// --- Component State ---
const pond = ref(null); // Reference to the FilePond instance
const selectedFile = ref([]); // Holds the current list of files
const isRequired = ref(true);
const $api = inject("$api");
const $constanceVariable = inject("$constanceVariable");
const $helperFun = inject("$helperFun");
const instance = getCurrentInstance();

const userInfo = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.UserInfo
);
// --- Methods ---

let allServiceItems = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.AllServicesItems
);
if (allServiceItems) {
  allServiceItems = allServiceItems.map((item) => ({
    Value: item.Name,
    ID: item.EntityItemId,
    Duration: item.Duration,
  }));
}
const serviceOptions = ref(allServiceItems);
const serviceSelection = ref({});

const getSelectOptionChange = async () => {
  isRequired.value = false;
};
// This handler updates our local file list when files are added or removed
const handleFileUpdate = (fileItems) => {
  selectedFile.value = fileItems.map((item) => item.file);
};

// **NEW**: This handler is called after all files have been processed
const handleUploadComplete = async () => {
  selectedFile.value = [];
  isRequired.value = true;
  const servicesImg = await $api.salon.listImages(
    userInfo.TenantId,
    userInfo.EntityItemId
  );
  instance.emit("update:modelValue", servicesImg.data);
};

const serverOptions = {
  // This function is called when processFiles() is triggered
  process: (
    fieldName,
    file,
    metadata,
    load,
    error,
    progress,
    abort,
    transfer,
    options
  ) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (isRequired.value) {
      error("សូមជ្រើសរើសសេវាកម្ម");
    }
    // 1. Prepare the data for your upload function
    const formData = new FormData();
    formData.append("images", file);
    // 2. Call your custom upload function and handle its lifecycle
    $api.salon
      .uploadImage(
        userInfo.TenantId,
        userInfo.EntityItemId,
        serviceSelection.value.ID,
        formData,
        (p) => {
          // The `p` here is the percentage from your `onUploadProgress` callback
          console.log("P", p, progress);

          progress(true, p, 100);
        },
        signal // Pass the signal to your upload function
      )
      .then((response) => {
        // When the server responds successfully, call the `load` callback
        // This ends the progress bar and signals success to FilePond.
        // The value passed to load should be a unique ID for the file.
        const fileId = response.data[0].OriginalName;
        load(fileId);
      })
      .catch((err) => {
        // **IMPROVED**: Differentiate between cancel and other errors
        if (err.name === "CanceledError") {
          console.log("Upload aborted by user.");
          return;
        }
        // Extract a meaningful error message
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Upload failed. Please try again.";
        error(errorMessage);
        console.error("Upload error:", errorMessage, err);
      });

    // 3. (Optional but recommended) Return an object with an `abort` method
    // This allows FilePond to cancel the request if the user clicks the "cancel" button.
    return {
      abort: () => {
        abortController.abort();
      },
    };
  },
};

// This function is called when the button is clicked
const submitFiles = () => {
  if (pond.value) {
    console.log("Processing files...");
    pond.value.processFiles();
  } else {
    console.error("FilePond instance not found.");
  }
};
defineEmits(["update:modelValue"]);
</script>

<style>
.filepond--drop-label {
  border: 2px dashed #ccc;
  padding: 3rem 0;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.filepond--drop-label:hover {
  border: 2px dashed var(--p2-color);
  color: var(--p2-color);
  background: #00ffa211;
  text-decoration: none;
}
.filepond--root .filepond--list-scroller {
  margin-top: 2rem;
}
.filepond--drop-label.filepond--drop-label label {
  cursor: pointer;
}
.file-uploader {
  max-width: 500px;
  margin: 2rem auto;
  font-family: sans-serif;
}
.file-uploader button {
  width: 100%;
  padding: 12px;
  background-color: var(--p2-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.file-uploader button:hover:not(:disabled) {
  background-color: var(--p2-color);
}
.file-uploader button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
a.filepond--credits {
  display: none;
}
</style>
