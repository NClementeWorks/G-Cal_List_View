<script setup>
// import {
  // RouterLink,
  // RouterView } from 'vue-router'
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';

import { useGapiStore } from '@/stores/gapi'

const gapiStore = useGapiStore ()
gapiStore.load_gapi ()

const refresh_token = ref ( localStorage.getItem ( 'gclv_rtk' ) )
console.log('App::refresh_token',refresh_token)

const gclv_path = document.getElementById ( 'gclv_path' ).value
console.log('App::gclv_path',gclv_path)

async function get_auth_url () {
  console.log('get_auth_url')

  if ( refresh_token.value?.length ) {
    // log out
    // localStorage.removeItem ( 'gclv_rtk' )
    open_browser_popup ( `https://127.0.0.1/edsa-NC/gclv_login?logout`, () => {
      refresh_token.value = localStorage.getItem ( 'gclv_rtk' )
    } )
  }
  else {
    // log in
    open_browser_popup ( `https://127.0.0.1/edsa-NC/gclv_login?login`, () => {
      refresh_token.value = localStorage.getItem ( 'gclv_rtk' )
    } )
  }
}

function open_browser_popup ( url, on_close_fn ) {
  const popup = window.open ( url, 'Google Authentication','height=600,width=400')
  console.log('App::popup', popup)
  var popup_watcher = setInterval ( function () {
    if ( popup.closed ) {
      console.log('popup closed...')
      clearInterval ( popup_watcher )
      on_close_fn ()
    }
  }, 1000 )
}
</script>

<template>

  <VCard>
    <VLayout class="flex-column">
      <VAppBar class="position-relative" style="height: 4rem">
        <VAppBarTitle>My Google Calendar Events List</VAppBarTitle>
        <div>
          <VLabel
            v-if="!refresh_token?.length"
            >
            You are logged out
          </VLabel>
          <VAppBarNavIcon
            id="login_btn"
            size="x-large"
            :icon="`mdi-account-${ refresh_token?.length ? 'check' : 'alert' }-outline`"
            :color="refresh_token?.length ? 'success' : 'error'"
          ></VAppBarNavIcon>
          <VMenu
            activator="#login_btn"
            open-on-hover
            >
            <VList>
              <VListItem>
                <VListItemAction
                  @click="get_auth_url"
                  style="cursor: pointer"
                  >
                  Log {{ refresh_token?.length ? 'Out' : 'In' }}
                </VListItemAction>
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
