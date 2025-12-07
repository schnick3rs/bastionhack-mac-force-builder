<script setup lang="ts">


</script>

<template>

  <div class="grid grid-cols-3 grid-rows-3 gap-2 w-full max-w-md">

    <!-- Cell 1 — top-left -->
    <div class="relative overflow-hidden aspect-square bg-slate-200 rounded">
      <div class="absolute bg-red-400 rounded-full"
           style="
           width: 66%;
           height: 66%;
           top: 0;
           left: 0;
           transform: translate(-50%, -50%);
         ">
      </div>
      <span class="absolute top-0 left-1 m-1 font-bold">A</span>
    </div>

    <!-- Cell 2 — top-center -->
    <div class="relative overflow-hidden aspect-square bg-slate-200 rounded">
      <div class="absolute bg-red-400 rounded-full"
           style="
           width: 50%;
           height: 50%;
           top: 0;
           left: 50%;
           transform: translate(-50%, -50%);
         ">
      </div>
      <span class="absolute top-0 left-16 m-1 font-bold">B</span>
    </div>

    <!-- Cell 3 — top-right -->
    <div class="relative aspect-square bg-slate-200 rounded">
      <span class="absolute top-0 right-0 m-1 text-sm">3</span>
    </div>

    <!-- Cell 4 — middle-left -->
    <div class="relative overflow-hidden aspect-square bg-slate-200 rounded">
      <div class="absolute bg-red-200 rounded-full"
           style="
           width: 50%;
           height: 50%;
           top: 50%;
           left: 0;
           transform: translate(-50%, -50%);
         ">
      </div>
      <span class="absolute top-14 left-0 m-1 font-bold">C</span>
    </div>

    <!-- Cell 5 — center -->
    <div class="relative aspect-square bg-slate-200 rounded">
      <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">5</span>
    </div>

    <!-- Cell 6 — middle-right -->
    <div class="relative aspect-square bg-slate-200 rounded">
      <span class="absolute top-1/2 right-0 -translate-y-1/2 m-1 text-sm">6</span>
    </div>

    <!-- Cell 7 — bottom-left -->
    <div class="relative overflow-hidden aspect-square bg-slate-200 rounded">
      <div class="absolute bg-blue-200 rounded-full"
           style="
           width: 66%;
           height: 66%;
           bottom: -66%;
           left: 0;
           transform: translate(-50%, -50%);
         ">
      </div>
      <span class="absolute bottom-0 left-0 m-1 font-bold">B</span>
    </div>


    <!-- Cell 8 — bottom-center -->
    <div class="relative overflow-hidden aspect-square bg-slate-200 rounded">
      <div class="absolute bg-blue-400 rounded-full"
           style="
           width: 50%;
           height: 50%;
           bottom: -50%;
           left: 50%;
           transform: translate(-50%, -50%);
         ">
      </div>
      <span class="absolute bottom-0 left-16 m-1 font-bold">A</span>
    </div>

    <!-- Cell 9 — bottom-right -->
    <div class="relative overflow-hidden aspect-square bg-slate-200 rounded">
      <div class="absolute bg-blue-200 rounded-full"
           style="
           width: 66%;
           height: 66%;
           bottom: -66%;
           right: -66%;
           transform: translate(-50%, -50%);
         ">
      </div>
      <span class="absolute bottom-0 right-0 m-1 font-bold">C</span>
    </div>

  </div>



  <div>
    <strong>Red Objective #7:</strong>  Breach 3 class 3 buildings,
    placed by blue.
  </div>

  <div>
    <strong>Blue Objective #2:</strong> Destroy at least half of the
    enemy points cost.
  </div>

  <div>
    <strong>Twist #11:</strong> Nova: Pre-meltdown, MACs on
    6 Heat take a hit.
  </div>


</template>

<style scoped>

</style>