<template>
  <div>
    <b-container>
      <br />
      <b-row>
        <b-row style="margin-left:-15px" class="label">
          <b-col cols="2" class="mr-3">
            <label for="question">Question</label>
          </b-col>
          <b-col cols="7">
            <input style="width: 600px" class="input" v-model="question" type="text" name="question" id="question"
              placeholder="your question here.." />
          </b-col>
        </b-row>
      </b-row>
      <b-row>
        <wysiwyg style="height:500px;width:100%;overflow:auto" id="editor" v-model="text"></wysiwyg>
      </b-row>
      <br />
      <b-row class="label" style="margin-right:25px;margin-left:-12px">
        <label for="tags">Watch Tags </label>
        <vue-tags-input style="width: 500px; margin-left:10px" v-model="tag" :tags="watchTags"
          @tags-changed="newTags => tags = newTags" />
      </b-row>
      <br>
      <b-row align-h="center">
        <button type="click" class="btn btn-secondary" @click="updatequestion">Edit Question</button>
      </b-row>
    </b-container>
  </div>
</template>

<script src="../components/wysiwyg/index.js"></script>
<script>
  import wysiwyg from "@/components/wysiwyg/index.js";
  import axios from "@/api/axios";
  import Swal from "sweetalert2";
  import VueTagsInput from '@johmun/vue-tags-input'

  export default {
    name: "updatequestion",
    data() {
      return {
        question: "",
        text: "",
        watchTags: [],
        questionId: "",
        questionData: {},
        tag: '',
        tags: []
      };
    },
    components: {
      wysiwyg: vueWysiwyg.default.component,
      VueTagsInput
    },
    computed: {
      textSaja() {
        return this.tags.map(el => el[0].text)
      }
    },
    watch: {
      tags: function () {
        this.watchTags = this.tags.map(el => {
          if (el.text) {
            return el.text
          } else {
            return el
          }
        })
      }
    },
    methods: {
      updatequestion() {
        axios
          .put(
            "/questions/update/" + this.questionId, {
              question: this.question,
              description: this.text,
              watchTags: this.watchTags
            }, {
              headers: {
                jwtoken: localStorage.jwtoken
              }
            }
          )
          .then(data => {
            Swal.fire({
              type: "success",
              text: "You have successfully updated question!"
            });
            this.$router.go(-1);
          })
          .catch(err => {
            Swal.fire({
              type: "error",
              title: "Error!",
              text: err.message
            });
          });
      }
    },
    created() {
      this.questionData = this.$store.state.indivQuestionData;
      this.questionId = this.$store.state.indivQuestionData._id;
      this.question = this.$store.state.indivQuestionData.question;
      this.text = this.$store.state.indivQuestionData.description;
      this.watchTags = this.$store.state.indivQuestionData.watchTags;
      this.tags = this.watchTags.map(el => el[0])
    }
  };
</script>

<style src="../components/wysiwyg/style.css"></style>