<template>
  <form class="w-full rounded-2xl bg-white p-5 shadow sm:p-7" @submit.prevent="submitTrip">
    <h1 class="text-2xl font-bold text-[#183d4c]">Tạo chuyến đi mới</h1>
    <div class="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="sm:col-span-2">
        <label for="trip-name" class="form-label">Tên chuyến đi</label>
        <v-text-field
          id="trip-name"
          v-model="form.name"
          class="form-control"
          :error-messages="errors.name"
          variant="outlined"
          hide-details="auto"
        />
      </div>
      <div>
        <label for="trip-status" class="form-label">Trạng thái</label>
        <v-select
          id="trip-status"
          v-model="form.status"
          class="form-control"
          :items="statuses"
          variant="outlined"
          hide-details
        />
      </div>
      <div class="sm:col-span-2">
        <label for="trip-destination" class="form-label">Địa điểm</label>
        <v-text-field
          id="trip-destination"
          v-model="form.destination"
          class="form-control"
          :error-messages="errors.destination"
          variant="outlined"
          hide-details="auto"
        />
      </div>
      <div>
        <label for="trip-budget" class="form-label">Ngân sách dự kiến (VNĐ)</label>
        <v-text-field
          id="trip-budget"
          v-model="form.budget"
          class="form-control"
          type="number"
          min="0"
          :error-messages="errors.budget"
          variant="outlined"
          hide-details="auto"
        />
      </div>
      <div class="lg:col-span-1">
        <label for="trip-cover" class="form-label">Ảnh mô tả địa điểm</label>
        <v-file-input
          id="trip-cover"
          v-model="form.coverFile"
          class="form-control"
          accept="image/*"
          prepend-icon="mdi-image-outline"
          :error-messages="errors.coverFile"
          variant="outlined"
          hide-details="auto"
          @update:model-value="updateCoverPreview"
        />
      </div>
      <div>
        <label for="trip-start-date" class="form-label">Ngày khởi hành</label>
        <v-text-field
          id="trip-start-date"
          v-model="form.startDate"
          class="form-control"
          type="date"
          :error-messages="errors.startDate"
          variant="outlined"
          hide-details="auto"
        />
      </div>
      <div>
        <label for="trip-end-date" class="form-label">Ngày kết thúc</label>
        <v-text-field
          id="trip-end-date"
          v-model="form.endDate"
          class="form-control"
          type="date"
          :error-messages="errors.endDate"
          variant="outlined"
          hide-details="auto"
        />
      </div>
      <div v-if="form.coverUrl" class="sm:col-span-2 lg:col-span-3">
        <img
          :src="form.coverUrl"
          alt="Xem trước ảnh mô tả địa điểm"
          class="h-44 w-full rounded-xl object-cover"
        />
      </div>
      <section class="sm:col-span-2 lg:col-span-3" aria-labelledby="members-heading">
        <div class="mb-2">
          <h2 id="members-heading" class="text-sm font-semibold text-[#183d4c]">Thành viên</h2>
        </div>
        <div class="space-y-2">
          <div
            v-for="(member, index) in form.members"
            :key="member.id"
            class="grid grid-cols-[minmax(0,1fr)_auto] gap-2"
          >
            <div>
              <label :for="`trip-member-${member.id}`" class="form-label">
                Thành viên {{ index + 1 }}
              </label>
              <v-text-field
                :id="`trip-member-${member.id}`"
                v-model="member.name"
                class="form-control"
                variant="outlined"
                hide-details
              />
            </div>
            <button
              v-if="form.members.length > 1"
              type="button"
              class="mt-7 h-14 w-auto rounded-lg bg-[#b42318] px-4 font-semibold text-white outline-none ring-[#e8c47c] hover:bg-[#8f1d15] focus-visible:ring-2"
              :aria-label="`Xóa thành viên ${index + 1}`"
              @click="removeMember(index)"
            >
              Xóa
            </button>
          </div>
        </div>
        <p v-if="errors.members" class="mt-2 text-sm text-[#b42318]" role="alert">
          {{ errors.members }}
        </p>
        <button
          type="button"
          class="mt-3 inline-flex rounded-lg bg-[#166c74] px-3 py-2 text-sm font-bold text-white outline-none ring-[#e8c47c] hover:bg-[#0f5a61] focus-visible:ring-2"
          @click="addMember"
        >
          <v-icon size="18" class="mr-1">mdi-plus</v-icon>Thêm thành viên
        </button>
      </section>
    </div>
    <div class="mt-6 flex justify-end gap-2">
      <button
        type="button"
        class="rounded-lg bg-[#d9e8e7] px-4 py-2 font-semibold text-[#183d4c] outline-none ring-[#e8c47c] hover:bg-[#c9dde0] focus-visible:ring-2"
        @click="emit('cancel')"
      >
        Hủy
      </button>
      <button class="rounded-lg bg-[#166c74] px-4 py-2 font-bold text-white" type="submit">
        Tạo workspace
      </button>
    </div>
  </form>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { messages } from '@/common/messages'
const emit = defineEmits(['submit', 'cancel'])
const statuses = ['Bản nháp', 'Đang lên kế hoạch', 'Đã chốt', 'Đang diễn ra', 'Đã hoàn tất']
const errors = ref({})
const form = reactive({
  name: '',
  destination: '',
  coverFile: null,
  coverUrl: '',
  members: [{ id: 'member-1', name: '' }],
  startDate: '',
  endDate: '',
  status: 'Bản nháp',
  budget: '12000000',
})
function validateTrip() {
  const result = {}
  const members = form.members.map((member) => member.name.trim()).filter(Boolean)
  if (!form.name.trim()) result.name = messages.trip.validation.nameRequired
  if (!form.destination.trim()) result.destination = messages.trip.validation.destinationRequired
  if (!form.coverFile) result.coverFile = messages.trip.validation.coverRequired
  if (!members.length) result.members = messages.trip.validation.membersRequired
  if (!form.startDate) result.startDate = messages.trip.validation.startDateRequired
  if (!form.endDate) result.endDate = messages.trip.validation.endDateRequired
  if (form.startDate && form.endDate && form.endDate < form.startDate)
    result.endDate = messages.trip.validation.endDateInvalid
  if (form.budget === '') result.budget = messages.trip.validation.budgetRequired
  else if (Number(form.budget) < 0) result.budget = messages.trip.validation.budgetInvalid
  return result
}
function updateCoverPreview(file) {
  const selectedFile = Array.isArray(file) ? file[0] : file
  form.coverUrl = selectedFile ? URL.createObjectURL(selectedFile) : ''
}
function addMember() {
  form.members.push({ id: `member-${Date.now()}`, name: '' })
}
function removeMember(index) {
  form.members.splice(index, 1)
}
function submitTrip() {
  errors.value = validateTrip()
  if (Object.keys(errors.value).length) return
  emit('submit', {
    ...form,
    name: form.name.trim(),
    destination: form.destination.trim(),
    members: form.members.map((member) => member.name.trim()).filter(Boolean),
    budget: Number(form.budget),
  })
}
</script>

<style scoped>
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #183d4c;
  font-size: 0.875rem;
  font-weight: 600;
}

.form-control :deep(.v-field) {
  border-radius: 0.75rem;
}
</style>
