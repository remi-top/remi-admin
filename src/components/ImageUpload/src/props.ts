export const previewProps = {
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  maxCount: {
    type: Number || String || null || undefined,
    default: null,
  },
  isPreview: {
    type: Boolean,
    default: true,
  }
};