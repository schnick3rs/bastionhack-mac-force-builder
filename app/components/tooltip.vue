<script setup lang="ts">
import type {MAC} from "~~/types/unit";

const props = defineProps<{ text: string }>()
</script>

<template>
  <div class="tooltip">
    <slot></slot>
    <span class="tooltiptext">{{props.text}}</span>
  </div>
</template>

<style scoped>
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

/* Tooltip text */
.tooltiptext {
  visibility: hidden; /* Hidden by default */
  width: 240px;
  text-wrap: auto;
  top: 24px;
  left: 50%;
  margin-left: -120px; /* Use half of the width (130/2 = 65), to center the tooltip */
  background-color: black;
  color: white;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  opacity: 0.7;
  z-index: 1; /* Ensure tooltip is displayed above content */
}

.tooltiptext::after {
  content: " ";
  position: absolute;
  bottom: 100%;  /* At the top of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent black transparent;
}

/* Show the tooltip text on hover */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>