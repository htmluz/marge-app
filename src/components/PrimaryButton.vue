<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { type PropType } from 'vue'

interface buttonTypes {
  type: 'button' | 'submit' | 'reset' | undefined
}

const props = defineProps({
  type: {
    type: String as PropType<buttonTypes['type']>,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultText: {
    type: String,
    default: 'Replace Me',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: "I'm loading",
  },
})

const emit = defineEmits(['click'])

function handleClick(e: MouseEvent) {
  emit('click', e)
}
</script>

<template>
  <button :type="props.type" :disabled="isLoading || disabled" @click="handleClick">
    <slot> {{ isLoading ? loadingText : defaultText }}</slot>
  </button>
</template>

<style scoped>
button {
  cursor: pointer;
  border: none;
  height: 1rem;
  color: var(--button-text-color);
  background-color: var(--button-background);
  border-radius: 8px;
  transition:
    border-radius 0.2s ease,
    outline 0.05s ease;
}

button:not(:disabled):hover {
  border-radius: 0px;
}

button:not(:disabled):focus {
  outline: 2px solid var(--button-background);
  outline-style: dashed;
  outline-offset: 4px;
}
</style>
