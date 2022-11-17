<template>
    <div class="mx-3 my-3">
        <b-container class="bv-example-row">
            <b-row>
              <b-col sm="12" lg="4" v-for="g in groups">
                
                <b-card 
                    :title="g.name"
                    style="max-width: 20rem; margin:auto"
                    class="mb-2"
                    >
                    <div style="height:70px; overflow: scroll;">
                        {{g.description}}
                    </div>
                    <b-card-text>
                        {{g.date}}, Members: {{g.members.length}}
                    </b-card-text>
        
                    <b-button href="#" variant="primary">View</b-button>
                </b-card>
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