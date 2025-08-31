<template>
  <div>
    <h2>Upload your image</h2>
    <file-pond
      name="image-upload"
      ref="pond"
      label-idle="Drag & Drop your files or <span class='filepond--label-action'>Browse</span>"
      allow-multiple="true"
      accepted-file-types="image/jpeg, image/png"
      v-on:updatefiles="handleFileUpdate"
      v-on:init="handleFilePondInit"
      
      allowImageEdit="true"
      :allow-image-preview="true"
      :allow-image-crop="true"
    />

    <button @click="submitFiles" ref="uploadButton">Upload Files</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Import FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the plugins and their styles
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.min.css";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
// Import the plugin code

// Import the plugin styles
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';

// Register the plugins with the FilePond Vue component
const FilePond = vueFilePond(
  FilePondPluginFileValidateSize,
  FilePondPluginImagePreview,
  FilePondPluginImageEdit,
  FilePondPluginImageTransform,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop
);

// Get a reference to the FilePond component instance
const pond = ref(null);
const uploadButton = ref(null);
const uploadedFiles = ref([]);

const handleFilePondInit = () => {
  console.log("FilePond has initialized");
};

const handleFileUpdate = (fileItems) => {
  console.log('FilePond has updated files:', fileItems);
  
  // Filter out any items that are not valid file objects
  const validFileItems = fileItems.filter(item => item && item.file);

  // Map the valid file items to their file objects and store them
  uploadedFiles.value = validFileItems.map(item => item.file);

  if (validFileItems.length > 0) {
    console.log('Successfully updated files. Count:', validFileItems.length);
  } else {
    console.log('No valid files or files were removed.');
  }
};

const submitFiles = () => {
  if (uploadedFiles.value.length > 0) {
    uploadedFiles.value.forEach(file => {
      console.log('File object:', file);
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
    });
  } else {
    console.log('No files to submit.');
  }
};
</script>
