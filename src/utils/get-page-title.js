import defaultSettings from '@/settings'
import translation from '@/utils/translation'

export default function getPageTitle(pageTitle) {
  const title = translation(defaultSettings.title) || 'Vue Admin Template'
  pageTitle = pageTitle && translation('route.' + pageTitle)

  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
