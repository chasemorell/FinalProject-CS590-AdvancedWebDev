<template>
    <div class="mx-3 my-3">
    <h3>My Groups</h3>
          
    </div>
  </template>
  
  <script setup lang="ts">
  import { watch, ref, Ref, inject, computed } from 'vue'
  import { Operator, Order, Group } from "../../../server/data"
  
  const operator: Ref<Operator | null> = ref(null)
  const orders: Ref<Order[]> = ref([])
  
  const user: Ref<any> = inject("user")!
  const newGroup: Ref<Group> = ref<Group>({
    name: "",
    creator: "",
    description: "",
    members: [],
    date: "",
    locked: false
  })
  const isGroupValid: Ref<Boolean> = ref(false)
  const isGroupLoading: Ref<Boolean> = ref(false)
  const showSuccessModal: Ref<Boolean> = ref(false)
  
const submitTooltip = computed(() => {
    return isGroupValid.value? "Create your Group." : "Groups must have a name, description, and date."
})

  async function refresh() {
    if (user.value) {
      await getGroups()
    }
  }
  
  watch(user, refresh, { immediate: true })
  watch( newGroup, validateNewGroup, { immediate: true, deep: true})
  
  
  function validateNewGroup(){
    const requiredFields: (keyof typeof newGroup.value)[] = ["name", "description", "date"]

    //for every required field, check if blank
    isGroupValid.value = true
    requiredFields.forEach(x => {
        if(newGroup.value[x] == ""){
            isGroupValid.value = false 
        }
    })
  }

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
    console.log(response)

  }
  </script>