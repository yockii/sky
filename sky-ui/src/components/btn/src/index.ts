import { defineComponent, PropType, getCurrentInstance, computed, ref, onBeforeUnmount, h, Transition } from 'vue'
import Ripple from '../../../directives/Ripple.js'
import routerLink, { routerLinkProps } from '../../../composables/private/router-link'
import align, { alignProps } from '../../../composables/private/align'
import { stop, stopAndPrevent, prevent, listenOpts } from '../../../utils/event.js'
import { isKeyCode } from '../../../utils/private/key-composition.js'
import SIcon from '../../icon'
import SSpinner from '../../spinner'
import { hDir, hMergeSlot } from '../../../utils/private/render'
import size from '../../../composables/private/size'

let keyboardTarget = null, touchTarget = null, mouseTarget = null

const defaultSizes = {
    xs: 8,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 24
}

export default defineComponent({
    name: 'SBtn',
    props: {
        ...routerLinkProps,

        // state
        loading: Boolean,
        disable: Boolean,
        //
        label: [String, Number],
        icon: String,
        iconRight: String,
        noCaps: Boolean,
        noWrap: Boolean,
        align: {
            ...alignProps,
            default: 'center'
        },
        stack: Boolean,
        stretch: Boolean,
        tabIndex: [Number, String],
        ripple: {
            type: [Boolean, Object],
            default: true
        },

        // style
        unelevated: Boolean,
        size: String, // xs|sm|md|lg|xl  16px  2rem
        round: Boolean,
        rounded: Boolean,
        textColor: String,
        bgColor: String,
        borderWidth: String,
        borderStyle: String,
        borderColor: String,
    },
    emits: ['click', 'keydown', 'touchstart', 'mousedown', 'keyup'],
    setup(props, { emit, slots }) {
        const { proxy } = getCurrentInstance()

        const rootRef = ref(null)
        const blurTargetRef = ref(null)
        const hasLabel = computed(() => props.label !== void 0 && props.label !== null && props.label !== '')
        const hasBgColor = computed(() => props.bgColor !== void 0 && props.bgColor !== null && props.bgColor !== '')
        const hasBorderColor = computed(() => props.borderColor !== void 0 && props.borderColor !== null && props.borderColor !== '')
        const isLink = computed(() => !hasBgColor.value && !hasBorderColor.value)

        const ripple = computed(() => (props.ripple === false ? false : {
            keyCodes: isLink.value === true ? [13, 32] : [13],
            ...(props.ripple === true ? {} : props.ripple)
        }))
        const isActionable = computed(() => props.disable !== true && props.loading !== true)
        const onEvents = computed(() => {
            if (props.loading === true) {
                return {
                    onMousedown: onLoadingEvt,
                    onTouchstartPassive: onLoadingEvt,
                    onClick: onLoadingEvt,
                    onKeydown: onLoadingEvt,
                    onKeyup: onLoadingEvt
                }
            }

            if (isActionable.value === true) {
                return {
                    onClick,
                    onKeydown,
                    onMousedown,
                    onTouchstartPassive
                }
            }

            return {
                onClick: stopAndPrevent
            }
        })

        const directives = computed(() => {
            return [[
                Ripple,
                ripple.value,
                void 0,
                { center: props.round }
            ]]
        })

        const classes = computed(() => {
            let colors
            if (props.textColor) {
                colors = `text-${props.textColor}`
            }

            return `s-btn--${isLink.value === true ? 'link' : 'notlink'} `
                + (props.unelevated ? 's-btn--unelevated ' : '')
                + `s-btn--${props.round === true ? 'round' : `rectangle${props.rounded === true ? ' s-btn--rounded' : ''}`}`
                + (colors !== void 0 ? ' ' + colors : '')
                + (isActionable.value === true ? ' s-btn--actionable s-focusable s-hoverable' : (props.disable === true ? ' disabled' : ''))
                + (props.noCaps === true ? ' s-btn--no-uppercase' : '')
                + (props.stretch === true ? ' no-border-radius self-stretch' : '')
        })

        const sizeStyle = size(props, defaultSizes)

        const style = computed(() => {
            const s = sizeStyle.value || {}
            if (props.textColor) {
                s['color'] = props.textColor
            }
            if (hasBgColor) {
                s['background-color'] = props.bgColor
            }
            if (hasBorderColor) {
                s['border-width'] = props.borderWidth
                s['border-style'] = props.borderStyle
                s['border-color'] = props.borderColor
            }
            return s
        })

        const { hasLink, linkProps, navigateToLink } = routerLink()
        const attributes = computed(() => {
            const acc = { tabindex: isActionable.value === true ? props.tabIndex || 0 : -1 }
            acc['type'] = 'button'
            if (hasLink.value === true) {
                Object.assign(acc, linkProps.value)
            }

            if (props.disable === true) {
                acc['disabled'] = ''
                acc['aria-disabled'] = 'true'
            }

            return acc
        })

        const nodeProps = computed(() => ({
            ref: rootRef,
            class: 's-btn s-btn-item non-selectable no-outline ' + classes.value,
            style: style.value,
            ...attributes.value,
            ...onEvents.value
        }))

        const alignClass = align(props)
        const innerClasses = computed(() => {
            let ic = alignClass.value
            if (props.stack === true) {
                ic += ' column'
            } else {
                ic += ' row'
            }
            if (props.noWrap) {
                ic += ' no-wrap text-no-wrap'
            }
            if (props.loading) {
                ic += ' s-btn__content--hidden'
            }
            return ic
        })

        function onLoadingEvt(evt) {
            evt.sNoRipple = true
        }
        const { passiveCapture } = listenOpts

        function onClick(e) {
            if (e !== void 0) {
                if (e.defaultPrevented === true) {
                    return
                }

                const el = document.activeElement
                // focus button if it came from ENTER on form
                // prevent the new submit (already done)
                if (
                    el !== document.body
                    && rootRef.value.contains(el) === false
                    // required for iOS and desktop Safari
                    && el.contains(rootRef.value) === false
                ) {
                    rootRef.value.focus()
                    const onClickCleanup = () => {
                        document.removeEventListener('keydown', stopAndPrevent, true)
                        document.removeEventListener('keyup', onClickCleanup, passiveCapture)
                        rootRef.value !== null && rootRef.value.removeEventListener('blur', onClickCleanup, passiveCapture)
                    }

                    document.addEventListener('keydown', stopAndPrevent, true)
                    document.addEventListener('keyup', onClickCleanup, passiveCapture)
                    rootRef.value.addEventListener('blur', onClickCleanup, passiveCapture)
                }
            }

            if (hasLink.value === true) {
                const go = () => {
                    e.__sNavigate = true
                    navigateToLink(e)
                }

                emit('click', e, go)
                e.defaultPrevented !== true && go()
            }
            else {
                emit('click', e)
            }
        }

        function onKeydown(e) {
            if (isKeyCode(e, [13, 32]) === true) {
                stopAndPrevent(e)

                if (keyboardTarget !== rootRef.value) {
                    keyboardTarget !== null && cleanup(false)

                    // focus external button if the focus helper was focused before
                    rootRef.value.focus()

                    keyboardTarget = rootRef.value
                    rootRef.value.classList.add('s-btn--active')
                    document.addEventListener('keyup', onPressEnd, true)
                    rootRef.value.addEventListener('blur', onPressEnd, passiveCapture)
                }
            }

            emit('keydown', e)
        }

        let localTouchTargetEl = null, avoidMouseRipple, mouseTimer

        function cleanup(destroying) {
            const blurTarget = blurTargetRef.value

            if (
                destroying !== true
                && (touchTarget === rootRef.value || mouseTarget === rootRef.value)
                && blurTarget !== null
                && blurTarget !== document.activeElement
            ) {
                blurTarget.setAttribute('tabindex', -1)
                blurTarget.focus()
            }

            if (touchTarget === rootRef.value) {
                if (localTouchTargetEl !== null) {
                    localTouchTargetEl.removeEventListener('touchcancel', onPressEnd, passiveCapture)
                    localTouchTargetEl.removeEventListener('touchend', onPressEnd, passiveCapture)
                }
                touchTarget = localTouchTargetEl = null
            }

            if (mouseTarget === rootRef.value) {
                document.removeEventListener('mouseup', onPressEnd, passiveCapture)
                mouseTarget = null
            }

            if (keyboardTarget === rootRef.value) {
                document.removeEventListener('keyup', onPressEnd, true)
                rootRef.value !== null && rootRef.value.removeEventListener('blur', onPressEnd, passiveCapture)
                keyboardTarget = null
            }

            rootRef.value !== null && rootRef.value.classList.remove('s-btn--active')
        }

        function onPressEnd(e) {
            // needed for IE (because it emits blur when focusing button from focus helper)
            if (e !== void 0 && e.type === 'blur' && document.activeElement === rootRef.value) {
                return
            }

            if (e !== void 0 && e.type === 'keyup') {
                if (keyboardTarget === rootRef.value && isKeyCode(e, [13, 32]) === true) {
                    // for click trigger
                    const evt = new MouseEvent('click', e)
                    evt['sKeyEvent'] = true
                    e.defaultPrevented === true && prevent(evt)
                    e.cancelBubble === true && stop(evt)
                    rootRef.value.dispatchEvent(evt)

                    stopAndPrevent(e)

                    // for ripple
                    e.sKeyEvent = true
                }

                emit('keyup', e)
            }

            cleanup(false)
        }

        function onTouchstartPassive(e) {
            if (touchTarget !== rootRef.value) {
                touchTarget !== null && cleanup(false)
                touchTarget = rootRef.value

                localTouchTargetEl = e.target
                localTouchTargetEl.addEventListener('touchcancel', onPressEnd, passiveCapture)
                localTouchTargetEl.addEventListener('touchend', onPressEnd, passiveCapture)
            }

            // avoid duplicated mousedown event
            // triggering another early ripple
            avoidMouseRipple = true
            clearTimeout(mouseTimer)
            mouseTimer = setTimeout(() => {
                avoidMouseRipple = false
            }, 200)

            emit('touchstart', e)
        }

        function onMousedown(e) {
            if (mouseTarget !== rootRef.value) {
                mouseTarget !== null && cleanup(false)
                mouseTarget = rootRef.value
                rootRef.value.classList.add('s-btn--active')
                document.addEventListener('mouseup', onPressEnd, passiveCapture)
            }

            e.qSkipRipple = avoidMouseRipple === true
            emit('mousedown', e)
        }

        onBeforeUnmount(() => {
            cleanup(true)
        })

        // expose public methods
        Object.assign(proxy, { click: onClick })

        return () => {
            let btnInner = []
            // 左侧icon
            props.icon !== void 0 && btnInner.push(
                h(SIcon, {
                    name: props.icon,
                    left: props.stack === false && hasLabel.value === true,
                    role: 'img',
                    'aria-hidden': 'true'
                })
            )

            // btn名称
            hasLabel.value === true && btnInner.push(
                h('span', { class: 'block' }, [props.label])
            )

            btnInner = hMergeSlot(slots.default, btnInner)

            // 右侧icon
            if (props.iconRight !== void 0 && props.round === false) {
                btnInner.push(
                    h(SIcon, {
                        name: props.iconRight,
                        left: props.stack === false && hasLabel.value === true,
                        role: 'img',
                        'aria-hidden': 'true'
                    })
                )
            }

            const child = [
                h('span', {
                    class: 's-focus-helper',
                    ref: blurTargetRef
                })
            ]

            child.push(
                h('span', {
                    class: 's-btn__content text-center col items-center s-anchor--skip ' + innerClasses.value
                }, btnInner)
            )

            if (props.loading !== null) {
                child.push(
                    h(Transition, {
                        name: 's-transition--fade'
                    }, () => {
                        if (props.loading === true) {
                            return [
                                h('span', {
                                    key: 'loading',
                                    class: 'absolute-full flex flex-center'
                                }, slots.loading !== void 0 ? slots.loading() : [h(SSpinner)])
                            ]
                        }
                        return null
                    })
                )
            }

            return hDir(
                'button',
                nodeProps.value,
                child,
                'ripple',
                props.disable !== true && props.ripple !== false,
                () => directives.value
            )
        }
    },
})