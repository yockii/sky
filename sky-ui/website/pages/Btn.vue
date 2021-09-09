<template>
  <s-btn
    :to="to"
    :replace="replace"
    :exact="exact"
    :disable="disable"
    :loading="loading"
    :label="label"
    :icon="icon"
    :iconRight="iconRight"
    :noCaps="noCaps"
    :noWrap="noWrap"
    :align="align"
    :stack="stack"
    :stretch="stretch"
    :tabIndex="tabIndex"
    :ripple="ripple"
    :size="size"
    :round="round"
    :rounded="rounded"
    :textColor="textColor"
    :bgColor="bgColor"
    :unelevated="unelevated"
    :borderWidth="borderWidth"
    :borderStyle="borderStyle"
    :borderColor="borderColor"
    @click="handleClick"
    @keydown="handleKeydown"
    @touchstart="handleTouchstart"
    @mousedown="handleMousedown"
    @keyup="handleKeyup"
  >
    <template v-slot:loading>loading</template>
  </s-btn>
  <div style="margin-top: 20px"></div>
  <hr />
  <div style="margin-bottom: 20px"></div>

  to <input v-model="to" /><br />
  disable <input type="checkbox" v-model="disable" /><br />
  loading <input type="checkbox" v-model="loading" /><br />
  label <input v-model="label" /><br />
  icon <input v-model="icon" /><br />
  iconRight <input v-model="iconRight" /><br />
  noCaps <input type="checkbox" v-model="noCaps" /><br />
  noWrap <input type="checkbox" v-model="noWrap" /><br />
  align <input v-model="align" /><br />
  stack <input type="checkbox" v-model="stack" /><br />
  stretch <input type="checkbox" v-model="stretch" /><br />
  tabIndex <input v-model="tabIndex" /><br />
  ripple <input type="checkbox" v-model="ripple" /><br />
  size <input v-model="size" /><br />
  round <input type="checkbox" v-model="round" /><br />
  rounded <input type="checkbox" v-model="rounded" /><br />
  textColor <input v-model="textColor" /><br />
  bgColor <input v-model="bgColor" /><br />
  unelevated <input type="checkbox" v-model="unelevated" /><br />
  borderWidth <input v-model="borderWidth" /><br />
  borderStyle <input v-model="borderStyle" /><br />
  borderColor <input v-model="borderColor" /><br />
</template>

<script>
import { SBtn } from "../../src/components";

export default {
  name: "Btn",
  components: {
    SBtn,
  },
  data() {
    return {
      to: "",
      replace: false,
      exact: false,
      disable: false,
      loading: false,
      label: "测试按钮abc",
      icon: "",
      iconRight: "",
      noCaps: false,
      noWrap: false,
      align: "",
      stack: false,
      unelevated: false,
      stretch: false,
      tabIndex: -1,
      ripple: true,
      size: "",
      round: false,
      rounded: false,
      textColor: "",
      bgColor: "",
      borderWidth: "",
      borderStyle: "",
      borderColor: "",
    };
  },
  methods: {
    handleClick() {
      console.log("button clicked");
    },
    handleKeydown() {
      console.log("button keydown");
    },
    handleKeyup() {
      console.log("button keyup");
    },
    handleTouchstart() {
      console.log("button touchstart");
    },
    handleMousedown() {
      console.log("button mousedown");
    },
  },
};
</script>

<style>
</style>