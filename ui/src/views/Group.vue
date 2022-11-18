<template>
    <div class="mx-3 my-3">
      
      <div style="background-color: white; padding:10px" class="my-2">
        <h1 class="margin: auto">{{group.name}}</h1>
        <p>{{group.description}}</p>
        <p>{{group.date}}</p>
      </div>
      <div class="gallery">
        <div class="gallery-image" style="position: relative;" v-for="n in imageRecordsPage" >
          <img :src="n.image" alt="Image" class="image">
          <div class="middle">
            <div class="text">{{n.creator}}</div>
          </div>
        </div>
      </div>

      <div style="my-2" class="my-3">
        <b-pagination
        v-model="currentPage"
        :total-rows="images.length"
        :per-page="6"
        aria-controls="my-table"
        align="center"
      ></b-pagination>
      </div>
      <br>
      <div>
        <b-tabs content-class="mt-3" align="center">
          <b-tab title="Comments" active>
            <h1>Comments</h1>
            <form class="comment">
              <b-form-input v-model="newCommentText" placeholder="Comment"></b-form-input>
              <b-button @click="" variant="primary">Post</b-button>
            </form>
            
          </b-tab>
          <b-tab title="Upload Photos">
            <div class="container" style="max-width: 1000px;">
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
          </b-tab>
          <b-tab title="Info"><p>I'm a disabled tab!</p></b-tab>
        </b-tabs>
      </div>
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

  const currentPage: Ref<number> = ref(1)

  const newCommentText: Ref<string> = ref("")

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

  const imageRecordsPage = computed(() => {
    if(!imageRecords){
      return []
    }
    const perPage = 6
    const start = (perPage*(currentPage.value-1))
    return imageRecords.value.slice(start,start+perPage)

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
    
    imageRecords.value = (await response.json())

    let id = 1
    imageRecords.value.forEach(element => {
      images.value.push({
        id: id,
        imgSrc: element.image
      })
      id = id + 1
    });

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
    background: rgb(255, 255, 255);
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }
  
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 100px;
    position: absolute;
    cursor: pointer;
  }
  
  .dropbox:hover {
    background: rgb(194, 255, 178); /* when mouse over to the drop zone, change color */
  }
  
  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    padding: 0 4px;
  }
  
  /* Create four equal columns that sits next to each other */
  .column {
    flex: 25%;
    max-width: 25%;
    padding: 0 4px;
  }
  
  .column img {
    margin-top: 8px;
    vertical-align: middle;
    width: 100%;
  }
  
  /* Responsive layout - makes a two column-layout instead of four columns */
  @media screen and (max-width: 800px) {
    .column {
      flex: 50%;
      max-width: 50%;
    }
  }
  
  /* Responsive layout - makes the two columns stack on top of each other instead of next to each other */
  @media screen and (max-width: 600px) {
    .column {
      flex: 100%;
      max-width: 100%;
    }
  }
   
/* (B) GALLERY WRAPPER */
.gallery {
  /* (B1) GRID LAYOUT - 3 IMAGES PER ROW */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
 
  /* (B2) OPTIONAL WIDTH RESTRICT */
  max-width: 1000px;
  margin: 0 auto;
}

/* (C) GALLERY IMAGES */
.gallery img {
  /* (C1) DIMENSION */
  width: 100%;
  height: auto;
  aspect-ratio : 1 / 1;
  border-radius: 5px;
  
 
  /* (C2) COLORS */
  border: 1px solid #ddd;
  background: #fff;
 
  /* (C3) IMAGE RESIZE */
  /* cover | contain | fill | scale-down */
  object-fit: cover;
  position: relative;
}

.gallery-image {
  transition: .2s ease;
  backface-visibility: hidden;
}

.gallery-image:hover .image {
  opacity: 0.3;
}


.gallery-image:hover .middle {
  opacity: 1;
}

.text {
  background-color: #7e7e7e;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  padding: 16px 32px;
}


.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

form.comment input[type=text] {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  float: left;
  width: 80%;
  background: #f1f1f1;
}

form.comment button {
  float: left;
  width: 20%;
  padding: 10px;
  background: #2196F3;
  color: white;
  font-size: 17px;
  border: 1px solid grey;
  border-left: none;
  cursor: pointer;
}

form.comment button:hover {
  background: #0b7dda;
}

form.comment::after {
  content: "";
  clear: both;
  display: table;
}

</style>
