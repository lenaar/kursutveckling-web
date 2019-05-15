'use strict'

const co = require('co')
const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const ReactDOMServer = require('react-dom/server')
const { toJS } = require('mobx')
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const {sortedKursutveckligApiInfo} = require('../apiCalls/kursutvecklingApi')


module.exports = {
  getCourseDevInfo: co.wrap(_getCourseDevInfo),
  getCourseStaticDevInfo: co.wrap(_getCourseStaticDevInfo),
}

const serverPaths = require('../server').getPaths()

//MOVE THIS PART TO OTHER CONTROLLER

function hydrateStores (renderProps) {
  // This assumes that all stores are specified in a root element called Provider

  const {props} = renderProps.props.children
  const outp = {}
  for (let key in props) {
    if (typeof props[key].initializeStore === 'function') {
      outp[key] = encodeURIComponent(JSON.stringify(toJS(props[key], true)))
    }
  }
  return outp
}

function _staticRender(context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }

  const { staticRender } = require('../../dist/app.js')

  return staticRender(context, location)
}

async function _getCourseDevInfo (req, res, next) {

  const courseCode = req.params.courseCode
  // const ldapUser = req.session.authUser ? req.session.authUser.username : 'null'
  const lang = language.getLanguage(res) || 'sv'

  try {
    // Render inferno app
    // const context = {}
    const renderProps = _staticRender()
    renderProps.props.children.props.adminStore.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    renderProps.props.children.props.adminStore.__SSR__setCookieHeader(req.headers.cookie)
    await renderProps.props.children.props.adminStore.getCourseRequirementFromKopps(courseCode, lang)
    renderProps.props.children.props.adminStore.analysisData = await sortedKursutveckligApiInfo(courseCode)
    // await doAllAsyncBefore({
    //   pathname: req.originalUrl,
    //   query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
    //   adminStore: renderProps.props.children.props.adminStore,
    //   routes: renderProps.props.children.props.children.props.children.props.children
    // })
    const html = ReactDOMServer.renderToString(renderProps)
    res.render('course/index', {
      debug: 'debug' in req.query,
      html,
      title: 'TODO',
      initialState: JSON.stringify(hydrateStores(renderProps))
    })
  } catch (err) {
    log.error('Error in _getCourseDevInfo', { error: err })
    next(err)
  }
}
//===================================//===================================//===================================//===================================

async function _getCourseStaticDevInfo(req, res, next) {

  const courseCode = req.params.courseCode
  // const ldapUser = req.session.authUser ? req.session.authUser.username : 'null'
  const lang = language.getLanguage(res) || 'sv'

  try {
    // Render inferno app
    const context = {}
    const renderProps = _staticRender()
    renderProps.props.children.props.adminStore.setBrowserConfig(browserConfig, serverPaths, serverConfig.hostUrl)
    renderProps.props.children.props.adminStore.__SSR__setCookieHeader(req.headers.cookie)
    await renderProps.props.children.props.adminStore.getCourseRequirementFromKopps(courseCode, lang)
    // await doAllAsyncBefore({
    //   pathname: req.originalUrl,
    //   query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
    //   adminStore: renderProps.props.children.props.adminStore,
    //   routes: renderProps.props.children.props.children.props.children.props.children
    // })
    const html = ReactDOMServer.renderToString(renderProps)
    res.render('course/index', {
      debug: 'debug' in req.query,
      html,
      title: 'TODO',
      initialState: JSON.stringify(hydrateStores(renderProps))
    })
  } catch (err) {
    log.error('Error in _getCourseStaticDevInfo', { error: err })
    next(err)
  }
}