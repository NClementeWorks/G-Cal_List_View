<script setup>
// import {
  // RouterLink,
  // RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue';

import { useGapiStore } from '@/stores/gapi'
import { useLoginStore } from '@/stores/login'

const gapi_store = useGapiStore ()
gapi_store.load_gapi ()

const login_store = useLoginStore ()

</script>

<template>

  <VCard>
    <VLayout class="flex-column">
      <VAppBar class="position-relative" style="height: 4rem">
        <VAppBarTitle>My Google Calendar Events List</VAppBarTitle>
        <div>
          <VLabel
            v-if="!login_store.is_logged"
            >
            You are logged out
          </VLabel>
          <VAppBarNavIcon
            id="login_btn"
            size="x-large"
            :icon="`mdi-account-${ login_store.is_logged ? 'check' : 'alert' }-outline`"
            :color="login_store.is_logged ? 'success' : 'error'"
          ></VAppBarNavIcon>
          <VMenu
            activator="#login_btn"
            open-on-hover
            >
            <VList>
              <VListItem>
                <VBtn
                  style="cursor: pointer"
                  :color="login_store.is_logged ? 'error' : 'success'"
                  @click="login_store.handle_authentication"
                  >
                  Log {{ login_store.is_logged ? 'Out' : 'In' }}
                </VBtn>
              </VListItem>
            </VList>
          </VMenu>
        </div>
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
