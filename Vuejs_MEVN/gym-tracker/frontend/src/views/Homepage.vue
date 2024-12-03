<template>
  <a-layout style="min-height: 100vh">
    <!-- Sidebar Layout -->
    <a-layout-sider :collapsed="collapsed" collapsible @collapse="handleCollapse">
      <div class="logo"/>
      <!-- Sidebar Navigation Menu -->
      <a-menu :selectedKeys="selectedKeys" theme="dark" mode="inline">
        <!-- Exercises Navigation -->
        <a-menu-item key="exercises">
          <router-link to="/exercises">
            <desktop-outlined />
            <span>Exercises</span>
          </router-link>
        </a-menu-item>

        <!-- User Submenu -->
        <a-sub-menu key="user">
          <template #title>
            <span>
              <user-outlined />
              <span>User</span>
            </span>
          </template>
          <a-menu-item key="logout" @click = "handleLogout">Logout</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- Main Content Layout -->
    <a-layout>
      <!-- Header -->
      <a-layout-header style="background: #fff; padding: 0" />
      
      <!-- Content Area -->
      <a-layout-content style="margin: 0 16px">
        <!-- Breadcrumb Navigation -->
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{ currentRoute }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-modal
            v-model:visible="isDeleteModalVisible"
            title="Delete Exercise"
            ok-text="Yes, Delete"
            cancel-text="Cancel"
            @ok="deleteExercise"
            @cancel="cancelDeleteExercise"
          >
            <p>Are you sure you want to delete this exercise? This action cannot be undone.</p>
    </a-modal>
        <!-- Main content section -->
        <div class="content-container">
          <a-button class="red" type="primary" style="margin-bottom: 16px" @click="showAddExerciseModal">
            Add Exercise
          </a-button>
          <a-row :gutter="16">
            <ExerciseCard
              v-for="exercise in exercises"
              :key="exercise._id"
              :exercise="exercise"
              @edit="showEditExerciseModal"
              @delete="showDeleteModal"
            />
          </a-row>
          <ExerciseForm
            :isVisible="isModalVisible"
            :initialExercise="currentExercise"
            @submit="saveExercise"
            @cancel="closeModal"
          />
        </div>
        <!-- Router view to display additional pages -->
        <router-view></router-view>
      </a-layout-content>

      <!-- Footer -->
      <a-layout-footer style="text-align: center" class = "m-auto">
        Gym Tracker - Your Own Personal Gym Management
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup>
import {
  DesktopOutlined,
  UserOutlined,
  ExperimentOutlined,
} from '@ant-design/icons-vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter} from 'vue-router';
import { useAuthStore } from '@/stores/authStores';
import ExerciseCard from '@/components/ExerciseCard.vue';
import ExerciseForm from '@/components/ExerciseForm.vue';
import { message } from 'ant-design-vue';
import apiservice from '@/service/apiservice'

// Reactive state for sidebar collapsed state
const collapsed = ref(false);

// Reactive state for keeping track of the selected menu item
const selectedKeys = ref(['exercises']);

// Using Vue Router's route to keep track of the current route
const route = useRouter();
const currentRoute = computed(() => {
  return route.name || 'Dashboard';
});
watch(route, () => {
  selectedKeys.value = [route.name?.toLowerCase()];
});
//API CALL//
//fetch//
onMounted(async () => {
  try {
    const response = await apiservice.getExercise();
    exercises.value = response.data;
    console.log(response.data);
  } catch (error) {
    message.error('Failed to load exercise');
    console.log(error);
  }
});

//
const exercises = ref([]);

const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const exerciseToDelete = ref(null);
const currentExercise = ref(null);


const showAddExerciseModal = () => {
  currentExercise.value = null;
  isModalVisible.value = true;
};

const showEditExerciseModal = (exercise) => {
  currentExercise.value = exercise;
  isModalVisible.value = true;
};

const showDeleteModal = (exerciseId) => {
  exerciseToDelete.value = exerciseId;
  isDeleteModalVisible.value = true;

}
const saveExercise = async (formData) => {
  try {
    let response;
    if (currentExercise.value) {
      // Update existing exercise
      const updatedExercise = await apiservice.updateExercise(currentExercise.value._id, formData);
      const index = exercises.value.findIndex((e) => e._id === currentExercise.value._id);
      if (index !== -1) {
        exercises.value[index] = updatedExercise.data;
        message.success('Exercise updated successfully.');
      }
    } else {
      // Create new exercise
      const newExercise = await apiservice.createExercise(formData);
      exercises.value.push(newExercise.data);
      message.success('Exercise added successfully.');
    }

    closeModal();
  } catch (error) {
    console.error('Error in save:', error);
    message.error('Error in saving');
  }
};

const closeModal = () => {
  isModalVisible.value = false;
  currentExercise.value = null;
};

const deleteExercise = async () => {
  try{
    if (exerciseToDelete.value){
      await apiservice.deleteExercise(exerciseToDelete.value);
      exercises.value = exercises.value.filter(
        (exercise) => exercise._id !== exerciseToDelete.value
      );
      message.success('Exercise deleted successfully');
    }

  }catch(error){
    console.error('Error in delete', error);
    message.error('An error occured')
  } finally {
    isDeleteModalVisible.value = false;
    exerciseToDelete.value = null;
  }
};
const cancelDeleteExercise = () => {
  isDeleteModalVisible.value = false;
  exerciseToDelete.value = null;
};

// Handle collapse event for sidebar
const handleCollapse = (collapsedState) => {
  collapsed.value = collapsedState;
};
const handleLogout = () => {
  const authStore = useAuthStore();
  authStore.logout();
  message.success('Logged out successfully');
  route.push('/');
}
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.content-container {
  padding: 24px;
  background: #fff;
  min-height: 360px;
}

/* Styling for deep Ant Design elements */
:deep(.ant-layout-sider-children) {
  .ant-menu-item a {
    color: rgba(255, 255, 255, 0.65);
    text-decoration: none;
  }

  .ant-menu-item-selected a {
    color: #fff;
  }
}
</style>