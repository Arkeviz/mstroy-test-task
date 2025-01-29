import type { InjectionKey, Ref } from "vue"

export const IsEditModeKey =
  Symbol('isEditMode') as InjectionKey<{ isEditMode: Ref<boolean>, toggleMode: () => void }>