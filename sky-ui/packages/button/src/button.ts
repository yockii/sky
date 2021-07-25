import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'sky-button',
    props: {
        color: {
            type: String,
            default: 'default',
            validator: (val: string) => {
                return [
                    'default' , 'red' , 'orange' , 'yellow' , 'green' , 'cyan' , 'blue' , 'violet'
                ].includes(val)
            }
        },
        size: {
            type: String,
            default: '',
            validator: (val: string) => {
                return [
                    '', 'lg' , 'md' , 'sm' , 'xs'
                ].includes(val)
            }
        },
        type: {
            type: String,
            default: 'default',
            validator: (val: string) => {
                return [
                    'default' , 'subtle' , 'ghost' , 'link'
                ].includes(val)
            }
        }
    },
    emits: [],
    setup(props, {emit}) {
        // const handleClick = (evt) => {
        //     console.log(3);
            
        //     emit('click', evt)
        // }
        return {
            // handleClick
        }
    },
})