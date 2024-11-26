<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ref } from 'vue';
import ModesSelect from '@/components/ModesSelect.vue';

const deviceName = ref('');
</script>

<template>
  <div class="properties">
    <div>
      <Label>Device Name</Label>
      <Input v-model="deviceName" type="text" placeholder="GRAM Slim SMASH" />
    </div>
    <div>
      <Label>Modes</Label>
      <ModesSelect />
    </div>
    <div>
      <Label>export / import layout</Label>
    </div>
    <div>
      <Label>view layout as mode</Label>
      <select name="" id=""></select>
    </div>
    <div>
      <Label>nya</Label>
    </div>
  </div>
</template>
