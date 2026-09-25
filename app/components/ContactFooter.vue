<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <footer class="container footer" data-anchor="contact">
    <ul class="links">
      <li v-for="link in site.contact" :key="link.label">
        <a :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
      </li>
    </ul>

    <div class="bottom">
      <span>{{ site.name }}</span>
      <span>© {{ site.year }}</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-top: 16vh;
  padding-bottom: 32px;
  border-top: 1px solid rgba(242, 240, 234, 0.12);
}

.links {
  list-style: none;
  margin: 0 0 20vh;
  padding: 0;
}

.links a {
  font-size: var(--logo);
  font-weight: 500;
  line-height: 2;
  letter-spacing: 0.12em;
  transition: color 0.3s;
}

.links a:hover {
  color: var(--muted);
}

.bottom {
  display: flex;
  justify-content: space-between;
  font-size: var(--label);
  letter-spacing: 0.15em;
  color: var(--muted);
}
</style>
