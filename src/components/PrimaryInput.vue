<script setup lang="ts">
import { defineProps, type InputHTMLAttributes } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Placeholder',
  },
})

const emit = defineEmits(['update:modelValue'])

function onInput(e: InputHTMLAttributes) {
  emit('update:modelValue', e.value)
}
</script>

<template>
  <input :value="props.modelValue" :placeholder="props.placeholder" @input="onInput" />
</template>
