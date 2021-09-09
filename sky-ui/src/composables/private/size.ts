import { computed } from "vue"

export const sizeDefaults = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 38,
  xl: 46
}

export const sizeProps = {
  size: String
}

export default function (props, sizes = sizeDefaults) {
  return computed(() => {
    console.log(props.size);
    return props.size !== void 0 ? {
      fontSize: props.size in sizes ? `${sizes[props.size]}px` : props.size
    } : null
  })
}