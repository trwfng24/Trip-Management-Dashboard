export const messages = Object.freeze({
  auth: Object.freeze({
    signInSuccess: 'Đăng nhập thành công.',
    signInFailed: 'Không thể đăng nhập. Vui lòng thử lại.',
    googleSignInFailed: 'Không thể kết nối với Google. Vui lòng thử lại.',
    signUpSuccess: 'Tạo tài khoản thành công.',
    signOutSuccess: 'Đã đăng xuất.',
    signOutFailed: 'Không thể đăng xuất. Vui lòng thử lại.',
  }),
  trip: Object.freeze({
    validation: Object.freeze({
      nameRequired: 'Vui lòng nhập tên chuyến đi.',
      destinationRequired: 'Vui lòng nhập địa điểm.',
      coverRequired: 'Vui lòng chọn ảnh mô tả địa điểm.',
      membersRequired: 'Vui lòng thêm ít nhất một thành viên.',
      startDateRequired: 'Vui lòng chọn ngày khởi hành.',
      endDateRequired: 'Vui lòng chọn ngày kết thúc.',
      endDateInvalid: 'Ngày về phải sau hoặc trùng ngày khởi hành.',
      budgetRequired: 'Vui lòng nhập ngân sách dự kiến.',
      budgetInvalid: 'Ngân sách không được âm.',
    }),
  }),
})
