<template>
  <a-modal
    :open="isVisible"
    title="Add New Exercise"
    @ok="handleOk"
    @cancel="handleCancel"
    class="bg-white p-6 rounded-lg shadow-lg"
  >
    <a-form :model="exercise" layout="vertical">
      <a-form-item
        label="Exercise Name"
        name="name"
        :rules="[{ required: true, message: 'Please input the exercise name!' }]">
        <a-input v-model:value="exercise.name" placeholder="Enter exercise name" class="p-2 border rounded-lg" />
      </a-form-item>

      <a-form-item
        label="Target Muscle"
        name="targetMuscle"
        :rules="[{ required: true, message: 'Please input the target muscle!' }]">
        <a-input v-model:value="exercise.targetMuscle" placeholder="Enter target muscle" class="p-2 border rounded-lg" />
      </a-form-item>

      <a-form-item
        label="Difficulty Level"
        name="difficultyLevel"
        :rules="[{ required: true, message: 'Please select the difficulty level!' }]">
        <a-select v-model:value="exercise.difficultyLevel" placeholder="Select difficulty level" class="w-full">
          <a-select-option value="Easy">Easy</a-select-option>
          <a-select-option value="Medium">Medium</a-select-option>
          <a-select-option value="Hard">Hard</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Description" name="description">
        <a-textarea v-model:value="exercise.description" rows="3" placeholder="Enter description" class="p-2 border rounded-lg" />
      </a-form-item>

      <a-form-item label="Image" name="image">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          @preview="handlePreview"
        >
          <div v-if="fileList.length < 8">
            <plus-outlined />
            <div style="margin-top: 8px">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- Image Preview Modal -->
  <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handlePreviewCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    initialExercise: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      exercise: {
        name: '',
        targetMuscle: '',
        difficultyLevel: '',
        description: '',
        imageUrl: '',
      },
      fileList: [],
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
    };
  },
  watch: {
    initialExercise: {
      handler(newValue) {
        if (newValue) {
          this.exercise = { ...newValue };
        } else {
          this.resetForm();
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleOk() {
      const formData = new FormData();
      formData.append('name', this.exercise.name);
      formData.append('targetMuscle', this.exercise.targetMuscle);
      formData.append('difficultyLevel', this.exercise.difficultyLevel);
      formData.append('description', this.exercise.description);

      if (this.fileList.length > 0) {
        formData.append('image', this.fileList[0].originFileObj);
      }

      this.$emit('submit', formData);
      this.resetForm();
    },
    handleCancel() {
      this.$emit('cancel');
      this.resetForm();
    },
    handlePreviewCancel(){
      this.previewVisible = false;
    },
    resetForm() {
      this.exercise = {
        name: '',
        targetMuscle: '',
        difficultyLevel: '',
        description: '',
        imageUrl: '',
      };
      this.fileList = [];
    },

    // Handle Image Preview
    async handlePreview(file) {
    if (!file.url && !file.preview) {
      // If there is no URL, create a preview from Base64
      file.preview = await getBase64(file.originFileObj);
    }
    // Set preview image to either a valid URL or the Base64 preview
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
    this.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  },
  },
};
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
