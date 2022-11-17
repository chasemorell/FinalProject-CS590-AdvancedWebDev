<template>
    <div class="mx-3 my-3">
    <h3>My Groups</h3>
    <GroupList :groups="userGroups"/>
    </div>
</template>
  
<script setup lang="ts">
  import { watch, ref, Ref, inject, computed } from 'vue'
  import { Operator, Order, Group } from "../../../server/data"
  import GroupList from '../Components/GroupList.vue'
  
  const userGroups: Ref<Group[]> = ref<Group[]>([])
  
  const user: Ref<any> = inject("user")!

  async function refresh() {
    if (user.value) {
      await getGroups()
    }
  }

  watch(user, refresh, { immediate: true })  

  async function getGroups() {
    //send api request
    const response = await fetch(
      "/api/getgroups?" + new URLSearchParams({
        username: user.value.preferred_username,
        }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )
    userGroups.value = await response.json()
  }
</script>