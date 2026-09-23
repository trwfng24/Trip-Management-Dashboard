<template>
  <main class="dashboard-shell">
    <section class="dashboard-shell__content" aria-labelledby="page-title">
      <p class="dashboard-shell__eyebrow">DiDiEms</p>
      <h1 id="page-title">Trip Management Dashboard</h1>
      <p>Không gian quản lý chuyến đi đang được xây dựng.</p>
    </section>
  </main>
</template>

<style scoped>
.dashboard-shell {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 2rem;
  background: #f6f7fb;
  color: #1f2937;
}

.dashboard-shell__content {
  width: min(100%, 36rem);
  padding: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1rem 2.5rem rgb(31 41 55 / 8%);
}

.dashboard-shell__eyebrow {
  margin: 0 0 0.5rem;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3rem);
}

p:not(.dashboard-shell__eyebrow) {
  margin: 1rem 0 0;
  color: #4b5563;
  line-height: 1.6;
}
</style>
