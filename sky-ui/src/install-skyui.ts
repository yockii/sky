import { createApp } from 'vue'
import { freezeGlobalConfig, globalConfig, globalConfigIsFrozen } from './utils/private/global-config'
import { skyuiKey } from './utils/private/symbols'
import { version } from '../package.json'

const autoInstalledPlugins = [
]

function installPlugins(pluginOpts, pluginList) {
  pluginList.forEach(Plugin => {
    Plugin.install(pluginOpts)
    Plugin.__installed = true
  })
}

function prepareApp(app, opts, pluginOpts) {
  app.config.globalProperties.$s = pluginOpts.$s
  app.provide(skyuiKey, pluginOpts.$s)

  installPlugins(pluginOpts, autoInstalledPlugins)

  opts.components !== void 0 && Object.values(opts.components).forEach(c => {
    if (Object(c) === c && c['name'] !== void 0) {
      app.component(c['name'], c)
    }
  })

  opts.directives !== void 0 && Object.values(opts.directives).forEach(d => {
    if (Object(d) === d && d['name'] !== void 0) {
      app.directive(d['name'], d)
    }
  })

  opts.plugins != void 0 && installPlugins(
    pluginOpts, Object.values(opts.plugins).filter(
      p => typeof p['install'] === 'function' && autoInstalledPlugins.includes(p) === false
    )
  )

}

export default function (parentApp, opts = {}) {
  const $s = { version: version }
  if (globalConfigIsFrozen === false) {
    if (opts['config'] !== void 0) {
      Object.assign(globalConfig, opts['config'])
    }

    $s['config'] = { ...globalConfig }
    freezeGlobalConfig()
  } else {
    $s['config'] = opts['config'] || {}
  }

  prepareApp(parentApp, opts, {
    parentApp,
    $s,
    lang: opts['lang'],
    iconSet: opts['iconSet'],
  })
}