<template>
  <a-col :span="8">
    <a-card :bordered="false">
      <a-image :src="`http://localhost:5000${exercise.imageUrl}`" alt="exercise image" :width="200" />
      <p>
        <span class="font-bold text-lg" style="font-family: Arial, sans-serif;">Exercise Name:</span> {{ exercise.name }}
      </p>
      <p>
        <span class="font-semibold" style="font-family: Arial, sans-serif;">Target Muscle:</span> {{ exercise.targetMuscle }}
      </p>
      <p>
        <span class="font-semibold" style="font-family: Arial, sans-serif;">Difficulty:</span> {{ exercise.difficultyLevel }}
      </p>
      <p>
        <span class="font-semibold" style="font-family: Arial, sans-serif;">Description:</span> {{ exercise.description }}
      </p>
      <div>
        <a-space :size="[8, 16]" wrap>
          <a-button @click="$emit('edit', exercise)">Edit</a-button>
          <a-button danger @click="$emit('delete', exercise._id)">Delete</a-button>
        </a-space>
      </div>
    </a-card>
  </a-col>
</template>

<script>
export default {
  props: {
    exercise: {
      type: Object,
      required: true,
    },
  },
};
</script>
