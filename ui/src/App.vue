<template>
  <div>
    <b-navbar toggleable="lg" type="dark" :variant="'dark'">
      <b-navbar-brand href="#">
        <img src="@/assets/logo.png" alt="Logo" class="d-inline-block align-top" style="max-height:8vh" >
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="/creategroup">Home</b-nav-item>
        <b-nav-item v-if="user?.roles?.includes('customer')" href="/mygroups">My Groups</b-nav-item>
        <b-nav-item v-if="user?.roles?.includes('customer')" href="/customer">Search</b-nav-item>
        <b-nav-item v-if="user?.roles?.includes('operator')" href="/operator">(Old) My Work Screen</b-nav-item>

        <b-nav-item v-if="user?.name == null" href="/api/login">Login</b-nav-item>
        <b-nav-item v-if="user?.name" @click="logout">Logout</b-nav-item>
        <form method="POST" action="/api/logout" id="logoutForm" />
      </b-navbar-nav>
    </b-navbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'

const user = ref({} as any)
provide("user", user)

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
})

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}
</script>

<style scoped>
 .navbar.navbar-dark.bg-dark{
    background-color: #363636!important;
 }
</style>