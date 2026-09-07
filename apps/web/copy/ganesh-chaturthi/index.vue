<!--
  神象节活动
  基于榜单活动模板实现，逻辑全在 template-activity，本文件只负责传入配置和文案。
  UI: https://lanhuapp.com/web/#/item/project/stage?tid=5c733b91-e63c-421c-811f-6731b7b3c436&pid=03262fb0-8b75-4794-839b-e1cd183bbc5d
  翻译：
  链接：https://activity-test.sout.chat/activity/ganesh-chaturthi?broadcase=3
  接口：https://api-test.sout.chat/api/swagger/index.html?key=842410
-->
<script setup>
import TemplateActivity from '../template-activity/index.vue';
import config from './config';
import locales from './locales';
</script>

<template>
  <TemplateActivity :config="config" :locales-map="locales" />
</template>
