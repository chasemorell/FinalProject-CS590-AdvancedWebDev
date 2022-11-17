<template>
    <div class="mx-3 my-3">
      <div style="max-width: 970px; margin:auto">
        <b-card title="Create a Group" sub-title="Groups allow you and friends to put event photos in one place!">
            <b-row class="my-2 mx-10">
                <b-col sm="2">
                  <label for="input-large">Group Name:</label>
                </b-col>
                <b-col sm="10">
                  <b-form-input id="input-large" size="lg" placeholder="Enter group name" v-model="newGroup.name"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-2 mx-10">
                <b-col sm="2">
                  <label for="input-large">Description:</label>
                </b-col>
                <b-col sm="10">
                  <b-form-input id="input-small" size="md" placeholder="Enter description" v-model="newGroup.description"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-2 mx-10">
                <b-col sm="2">
                  <label for="input-large">Date:</label>
                </b-col>
                <b-col sm="10">
                    <b-form-datepicker id="example-datepicker" v-model="newGroup.date" class="mb-2"></b-form-datepicker>
                </b-col>
              </b-row>
              <b-row class="my-2 mx-10">
                <b-col sm="2">
                  <label for="input-large"></label>
                </b-col>
                <b-col sm="10">
                    <b-form-checkbox
                    id="checkbox-1"
                    v-model="newGroup.locked"
                    name="checkbox-1">
                    Allow users to join
                    </b-form-checkbox>        </b-col>
              </b-row>
              <div class="text-right">
                <span id="submitButton" class="d-inline-block" tabindex="0">
                    <b-button :disabled="!isGroupValid || isGroupLoading" @click="submitNewGroup(newGroup)" variant="success" class="mb-2">Create</b-button>
                </span>
                <b-tooltip target="submitButton">{{submitTooltip}}</b-tooltip>
                <b-modal :ok-only="true" v-model="showSuccessModal" title="Success!" id="success-modal">"{{newGroup.name}}" group created.
                    <br>
                    <br>
                    <b-button @click="$router.push('/mygroups')" variant="outline-primary" class="mb-2">My Groups</b-button>
                </b-modal>
            </div>
        </b-card>
      </div>
      
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
      operator.value = await (await fetch("/api/operator/")).json()
    }
    orders.value = await (await fetch("/api/orders/")).json()
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

  async function submitNewGroup(group: Group) {
    //disable create button while uploading
    isGroupLoading.value = true

    //add user info to group
    group.creator = user.value.email
    group.members.push(group.creator)

    //send api request
    const response = await fetch(
      "/api/creategroup/",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(group)
      }
    )
    if(response.ok){
        showSuccessModal.value = true
    }else{

    }

    isGroupLoading.value = false

  }
  </script>