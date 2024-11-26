<script setup lang="ts"></script>

<template>
  <section class="editor">
    <RouterView />
  </section>
</template>

<style>
.editor {
  display: grid;

  grid-template-columns: 4rem 1fr 320px;
  grid-template-rows: 8rem minmax(0, 1fr) 88px;

  gap: 1rem;
  padding: 1rem;

  width: 100%;
  height: 100vh;

  overflow: hidden;

  grid-template-areas:
    'header header inspector'
    'sidebar content inspector'
    'footer footer footer';

  > .content {
    grid-area: content;
  }

  > .inspector {
    grid-area: inspector;
  }

  > .properties {
    grid-area: content / content / inspector / inspector;
  }
}
</style>
