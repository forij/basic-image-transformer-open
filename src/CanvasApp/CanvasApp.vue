<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { CanvasApp } from "./CanvasApp";
import { COLOR_PALETTE, EXAMPLE_IMAGE_SRC } from "./constant";

const bgColor = COLOR_PALETTE.bg;

const canvasRef = useTemplateRef<HTMLCanvasElement>("canvasRef");
const app = ref<CanvasApp | null>(null);

const listeners: Array<{
  el: HTMLElement | Window;
  event: string;
  handler: EventListenerOrEventListenerObject;
}> = [];

const subscribe = (
  el: HTMLElement | Window,
  event: string,
  handler: EventListenerOrEventListenerObject
) => {
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
};

const startRaf = () => {
  let lastTime = performance.now();

  const loop = (time: number) => {
    const dt = time - lastTime;
    lastTime = time;

    app.value?.tick(dt);

    if (app.value) {
      requestAnimationFrame(loop);
    }
  };

  requestAnimationFrame(loop);
};

onMounted(() => {
  if (canvasRef.value) {
    app.value = new CanvasApp(canvasRef.value, EXAMPLE_IMAGE_SRC);
    subscribe(window, "resize", app.value.onResize.bind(app.value));
    startRaf();
  }
});

onUnmounted(() => {
  app.value?.destroy();
  app.value = null;

  // Cleanup event listeners
  listeners.forEach(({ el, event, handler }) => {
    el.removeEventListener(event, handler);
  });
});
</script>

<template>
  <canvas ref="canvasRef" id="canvas"></canvas>
</template>

<style scoped>
#canvas {
  background: v-bind(bgColor);
  width: 100%;
  height: 100%;
  display: block;
}
</style>
