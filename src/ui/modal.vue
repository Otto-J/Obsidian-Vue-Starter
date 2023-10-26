<template>
  <div class="modal-bg" style="opacity: 0.85"></div>
  <div class="modal">
    <div class="modal-close-button" @click="closeModal"></div>
    <div class="modal-title">文章上传设置</div>
    <div class="modal-content">
      <!-- title -->
      <div class="setting-item">
        <div class="setting-item-info">
          <div class="setting-item-name">标题 Title</div>
          <div class="setting-item-description">默认读取当前标题</div>
        </div>
        <div class="setting-item-control">
          <input
            type="text"
            placeholder="留空表示默认标题"
            spellcheck="false"
            tabindex="2"
          />
        </div>
      </div>
      <!-- slug -->
      <div class="setting-item">
        <div class="setting-item-info">
          <div class="setting-item-name">路径 Slug</div>
          <div class="setting-item-description">留空默认分配</div>
        </div>
        <div class="setting-item-control">
          <input
            type="text"
            placeholder="留空表示默认"
            spellcheck="false"
            tabindex="2"
          />
        </div>
      </div>
      <!-- summary -->
      <div class="setting-item">
        <div class="setting-item-info">
          <div class="setting-item-name">摘要 Description</div>
          <div class="setting-item-description">留空默认分配</div>
        </div>
        <div class="setting-item-control">
          <input
            type="text"
            placeholder="留空表示默认"
            spellcheck="false"
            tabindex="2"
          />
        </div>
      </div>
      <!-- tags -->
      <div class="setting-item">
        <div class="setting-item-info">
          <div class="setting-item-name">标签 Tags</div>
          <div class="setting-item-description">使用中英文逗号分割</div>
        </div>
        <div class="setting-item-control">
          <input
            type="text"
            placeholder="留空表示默认"
            spellcheck="false"
            tabindex="2"
          />
        </div>
      </div>
      <!-- image upload -->
      <div class="setting-item">
        <div class="setting-item-info">
          <div class="setting-item-name">
            图片是否上传到 IPFS Upload Image to IPFS
          </div>
          <div class="setting-item-description">
            将图片上传至 IPFS，不影响本地笔记，也会稍微增加上传的耗时。
          </div>
        </div>
        <div class="setting-item-control">
          <div class="checkbox-container" :class="true ? 'is-enabled' : ''">
            <input
              type="checkbox"
              style="width: 100%; height: 100%"
              tabindex="2"
            />
          </div>
        </div>
      </div>
      <!-- 发布日期 -->
      <div class="setting-item">
        <div class="setting-item-info">
          <div class="setting-item-name">发布日期 Publish Time</div>
          <div class="setting-item-description">
            默认读取 publish_time，留空表示当前日期。
            <br />
            支持格式
            <b class="u-pop">YYYY/MM/DD HH:mm:ss</b>
          </div>
        </div>
        <div class="setting-item-control">
          <!-- checkbox -->
          <select class="dropdown">
            <option value="current">使用当前时间</option>
            <option value="create_time">使用 create_time</option>
            <option value="custom">自定义</option>
          </select>
          <input
            :disabled="false"
            type="text"
            placeholder="留空表示当前时间"
            spellcheck="false"
            tabindex="3"
          />
        </div>
      </div>
      <!-- noteId -->
      <div class="setting-item">
        <div class="setting-item-info">
          <div class="setting-item-name">关联 NoteID</div>
          <div class="setting-item-description">
            若填写视为更新文章，留空视为创建文章
          </div>
        </div>
        <div class="setting-item-control">
          <input
            type="text"
            placeholder="留空表示创建"
            spellcheck="false"
            tabindex="2"
          />
        </div>
      </div>
    </div>
    <div class="modal-button-container">
      <button class="mod-cta">
        {{ isLoading ? "正在上传" : "开始上传" }}
      </button>
      <button @click="closeModal">取消</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watchEffect } from "vue";
import { Notice, Modal, TFile, requestUrl, Plugin } from "obsidian";

const props = defineProps<{
  plugin: Plugin;
  modal: Modal;
  file: TFile;
}>();

const defaultConfig = () => ({});

const defaultSettings = () => ({
  enable: true,
});
const config = ref(defaultConfig());

const isLoading = ref(false);
const closeModal = () => {
  config.value = defaultConfig();
  props.modal.close();
};

// 系统设置
let settings: Partial<ReturnType<typeof defaultSettings>> = {};

onMounted(async () => {
  // 读取配置
  settings = await props.plugin.loadData();
});
</script>

<style></style>
