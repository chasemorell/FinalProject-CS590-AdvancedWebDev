<template>
    <div class="mx-3 my-3">
        <b-container class="bv-example-row">
            <b-row>
              <b-col style="margin:auto" sm="12" lg="4" v-for="g in groups">
                <div class="text-center" style="margin:auto">
                  <b-card 
                  :title="g.name"
                  style="max-width: 20rem; margin:auto"
                  class="mb-2"
                  >
                  <div style="height:70px; overflow: scroll;">
                      {{g.description}}
                  </div>
                  <b-card-text>
                      {{g.date}}, Members: {{g.members?.length}}
                  </b-card-text>
      
                  <b-button @click="$router.push({name:'group', params: {groupId: String(g._id)}})" variant="primary">View</b-button>
              </b-card>
                </div>
                
              </b-col>
            </b-row>
        </b-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { watch, ref, Ref, inject, computed } from 'vue'
  import { Group } from "../../../server/data"
  
  const props = defineProps<{
    groups: Group[],
  }>()

  </script>