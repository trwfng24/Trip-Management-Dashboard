<template>
  <main class="auth-page">
    <section class="auth-page__art" aria-hidden="true">
      <p class="auth-page__brand">DiDiEms</p>
      <div>
        <p class="auth-page__eyebrow">Trip workspace</p>
        <h1>Lên kế hoạch chuyến đi, cùng nhau.</h1>
        <p>Tập hợp lịch trình, công việc, chi phí và những kỷ niệm đáng nhớ trong một không gian chung.</p>
      </div>
      <div class="auth-page__shapes"><i></i><i></i><i></i></div>
    </section>
    <section class="auth-page__form-area"><div class="auth-card"><slot /></div></section>
  </main>
</template>
