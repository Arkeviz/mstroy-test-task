import type { InjectionKey, Ref } from "vue"
import type { TTreeItem } from "@/components/MSTree/types";

export const IsEditModeKey =
  Symbol('isEditMode') as InjectionKey<
    {
      isEditMode: Ref<boolean>,
      toggleMode: () => void
    }
  >
export const itemEditKey =
  Symbol('isEditMode')as InjectionKey<
    {
      addItem: (data: TTreeItem) => void,
      deleteItem: (data: TTreeItem) => void
    }
  >
