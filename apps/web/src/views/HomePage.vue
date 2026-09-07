<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { CreateUserInput, User } from '@mono/shared';
import { USER_ROLES, USER_ROLE_LABELS, createUserSchema } from '@mono/shared';
import { api } from '../api/client';
import { formatDateTime } from '../utils/format';

const users = ref<User[]>([]);
const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const fieldErrors = reactive<Record<string, string>>({});

const form = reactive<CreateUserInput>({ name: '', email: '', role: 'member' });

async function loadUsers() {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.listUsers({ pageSize: 50 });
    users.value = res.items;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败';
  } finally {
    loading.value = false;
  }
}

async function remove(id: string) {
  error.value = '';
  try {
    await api.deleteUser(id);
    await loadUsers();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败';
  }
}

async function submit() {
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key];
  error.value = '';

  const parsed = createUserSchema.safeParse(form);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? 'form')] = issue.message;
    }
    return;
  }

  submitting.value = true;
  try {
    await api.createUser(parsed.data);
    form.name = '';
    form.email = '';
    form.role = 'member';
    await loadUsers();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '创建失败';
  } finally {
    submitting.value = false;
  }
}

onMounted(loadUsers);
</script>

<template>
  <main class="page">
    <header class="hero">
      <h1>Monorepo Demo</h1>
      <p>Vue 3 + Express 5 · pnpm workspace + turbo · 前后端共享 zod schema</p>
      <p>
        <router-link to="/activity/turkish-wheel">→ 土耳其大转盘活动</router-link>
      </p>
    </header>

    <section class="card">
      <h2>用户列表</h2>
      <p v-if="loading" class="muted">加载中…</p>
      <p v-else-if="users.length === 0" class="muted">暂无数据</p>
      <table v-else>
        <thead>
          <tr>
            <th>姓名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>创建时间</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ USER_ROLE_LABELS[user.role] }}</td>
            <td>{{ formatDateTime(user.createdAt) }}</td>
            <td><button type="button" class="link" @click="remove(user.id)">删除</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <h2>新建用户</h2>
      <form @submit.prevent="submit">
        <label>
          <span>姓名</span>
          <input v-model="form.name" type="text" placeholder="张三" />
          <em v-if="fieldErrors.name" class="error">{{ fieldErrors.name }}</em>
        </label>
        <label>
          <span>邮箱</span>
          <input v-model="form.email" type="text" placeholder="zhangsan@example.com" />
          <em v-if="fieldErrors.email" class="error">{{ fieldErrors.email }}</em>
        </label>
        <label>
          <span>角色</span>
          <select v-model="form.role">
            <option v-for="role in USER_ROLES" :key="role" :value="role">
              {{ USER_ROLE_LABELS[role] }}
            </option>
          </select>
        </label>
        <button type="submit" :disabled="submitting">
          {{ submitting ? '提交中…' : '创建' }}
        </button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.hero p {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 14px;
}

.hero a {
  color: #2563eb;
  text-decoration: underline;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.card h2 {
  margin: 0 0 16px;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #f3f4f6;
}

th {
  color: #6b7280;
  font-weight: 500;
}

form {
  display: grid;
  gap: 14px;
  max-width: 360px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #374151;
}

input,
select {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

button {
  justify-self: start;
  padding: 8px 18px;
  border: 1px solid #111827;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button.link {
  border: none;
  background: none;
  color: #dc2626;
  padding: 0;
  font-size: 13px;
}

.muted {
  color: #9ca3af;
  font-size: 14px;
}

.error {
  color: #dc2626;
  font-size: 12px;
  font-style: normal;
}
</style>
