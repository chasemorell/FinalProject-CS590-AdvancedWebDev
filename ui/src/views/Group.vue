<template>
    <div class="mx-3 my-3">
      <h3>{{group.name}}</h3>
      <b-button @click="" variant="primary">Upload Image</b-button>
      <div class="container">
        <!--UPLOAD-->
        <form enctype="multipart/form-data" novalidate>
          <h1>Upload images</h1>
          <div class="dropbox">
            <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event?.target);"
              accept="image/*" class="input-file">
              <p v-if="isInitial">
                Drag your file(s) here to begin<br> or click to browse
              </p>
              <p v-if="isSaving">
                Uploading {{ fileCount }} files...
              </p>
          </div>
        </form>
        </div>
        <p v-for="n in imageRecords">{{n.creator}}</p>
        <img v-for="n in imageRecords" :src="n.image" alt="Logo" class="d-inline-block align-top" style="max-height:8vh">
    </div>
</template>
  
<script setup lang="ts">
  import { watch, ref, Ref, inject, computed } from 'vue'
  import { Operator, Order, Group, ImageRecord } from "../../../server/data"
  import GroupList from '../Components/GroupList.vue'
  import VueRouter from 'vue-router'

  const group: Ref<Group> = ref<Group>({

  })

  const imageRecords: Ref<ImageRecord[]> = ref<ImageRecord[]>([])
  const images: Ref<any[]> = ref<any[]>([])

  const user: Ref<any> = inject("user")!

  const uploadFieldName = ref("Your Images")
  const isSaving = ref(false)
  const isInitial = ref(true)
  const fileCount = ref()

  // props
  interface Props {
    groupId?: string
  }

  // default values for props
  const props = withDefaults(defineProps<Props>(), {
  })

  let groupId = props.groupId

  async function refresh() {
    if (user.value.preferred_username) {
      await getGroup()
      await getImages()
    }
  }


  watch(user, refresh, { immediate: true })  

  async function getImages(){
    const response = await fetch(
      "/api/getimages?" + new URLSearchParams({
          username: user.value.preferred_username,
          groupId: groupId?? ""
        }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )
    
    imageRecords.value.forEach(element => {
      let i = new Image()
      i.src = element.image
      images.value.push(i)
    });
    imageRecords.value = (await response.json())
  }

  async function getGroup() {
    //send api request
    const response = await fetch(
      "/api/getgroup?" + new URLSearchParams({
          username: user.value.preferred_username,
          groupId: groupId?? ""
        }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )
    group.value = (await response.json())[0]
  }

  async function filesChange(target: EventTarget | null) {
    // handle file changes

    const fileList = (<HTMLInputElement>target).files
    let uFiles: any[] = []

    if (!fileList) return;
    if (!fileList?.length) return;

    // append the files to FormData
    Array
      .from(Array(fileList.length).keys())
      .map(x => {
        uFiles.push(fileList[x]);
      });
    
    let files: any[] = []
    console.log(typeof fileList)
    
    async function fileGetter(uFiles: any[]) : Promise<any>{
      let promises: Promise<any>[] = []
      function getImageFromFileObject(file: any) {
        const reader = new FileReader()
        return new Promise(resolve => {
          reader.onload = ev => {
            resolve({
              creator: user.value.preferred_username,
              image: ev.target?.result,
              groupId: groupId
            })
          }
          reader.readAsDataURL(file)
        })
      }

      uFiles.forEach((f: Blob) => {
        promises.push(getImageFromFileObject(f))
      });

      return await Promise.all(promises)
    }
    files = await fileGetter(uFiles)

    console.log(files)

    
    // save it
    const response = await fetch(
      "/api/uploadimages?" + new URLSearchParams({
          username: user.value.preferred_username,
          groupId: groupId?? ""
        }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(files)
      }
    )
    //console.log(fileList)
  }
</script>

<!-- SASS styling -->
<style lang="scss">
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }
  
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
  
  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }
  
  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
