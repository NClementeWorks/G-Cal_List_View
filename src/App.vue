<script setup>
// import {
  // RouterLink,
  // RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue';

import { useGapiStore } from '@/stores/gapi'
import { useLoginStore } from '@/stores/login'
import { watch } from 'vue';

const gapi_store = useGapiStore ()
gapi_store.load_gapi ()

const login_store = useLoginStore ()

watch ( () => login_store.refresh_token, new_value => {
  console.log ('APP::WATCH::refresh_token', new_value)
  gapi_store.set_token ()
})

</script>

<template>

  <VCard>
    <VLayout class="flex-column">
      <VAppBar class="position-relative" style="height: 4rem">
        <VAppBarTitle>My Google Calendar Events List</VAppBarTitle>
        <div>
          <VLabel
            v-if="!login_store.is_logged"
            class="mr-4"
            >
            You are logged out
          </VLabel>
          <VBtn
            id="login_btn"
            style="margin-right: 1rem"
            append-icon="mdi-chevron-down"
            size="xx-large"
            variant="plain"
            >
            <template #prepend>
              <VAppBarNavIcon
                size="xx-large"
                :icon="`mdi-account-${ login_store.is_logged ? 'check' : 'alert' }-outline`"
                :color="login_store.is_logged ? 'success' : 'error'"
              ></VAppBarNavIcon>
            </template>
          </VBtn>
          <VMenu
            activator="#login_btn"
            open-on-hover
            open-delay=".1"
            >
            <VList>
              <VListItem>
                <VBtn
                  style="cursor: pointer; text-transform: none;"
                  :color="login_store.is_logged ? 'error' : 'success'"
                  @click="login_store.handle_authentication"
                  >
                  <span v-if="login_store.is_logged">
                    Log out
                  </span>
                  <span v-else>
                    Login to Google Calendar
                  </span>
                </VBtn>
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </VAppBar>

      <HomeView v-if="login_store.is_logged" />
      <VCard v-else>
        <VCardTitle>You are not logged in!</VCardTitle>
        <VCardText>
          Please, use the top right button (
          <VIcon
            icon="mdi-account-alert-outline"
            ></VIcon>
          ) to log in
        </VCardText>
      </VCard>
    </VLayout>
  </VCard>
</template>
