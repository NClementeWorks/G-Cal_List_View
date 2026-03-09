<script setup>
// import {
  // RouterLink,
  // RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue';

import { useGapiStore } from '@/stores/gapi'

const gapiStore = useGapiStore ()
gapiStore.load_gapi ()

</script>

<template>

  <VCard>
    <VLayout class="flex-column">
      <VAppBar class="position-relative" style="height: 4rem">
        <VAppBarTitle>My Google Calendar Events List</VAppBarTitle>

      </VAppBar>

      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
      <HomeView />
      <!-- <RouterView /> -->
    </VLayout>
  </VCard>
</template>
