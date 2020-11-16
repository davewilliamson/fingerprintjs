import { replaceNaN, toFloat } from '../utils/data'
import * as browser from '../utils/browser'

type Position = [left: number | null, top: number | null, width: number | null, height: number | null]

export default function getAvailableScreenPosition(): Position | undefined {
  if (!isUseful()) {
    return undefined
  }

  const s = screen

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
  return [
    replaceNaN(toFloat(s.availLeft), null),
    replaceNaN(toFloat(s.availTop), null),
    replaceNaN(toFloat(s.availWidth), null),
    replaceNaN(toFloat(s.availHeight), null),
  ]
}

/**
 * Checks whether the current browser is know to have stable and informative available screen resolution. "Stable" means
 * that it doesn't change when the browser goes fullscreen (including via `requestFullscreen` and a UI button) or the
 * device is rotated. "Not informative" means that it's always equal to the screen size.
 *
 * @see https://github.com/fingerprintjs/fingerprintjs/issues/568#issuecomment-722272726 Based on research in November 2020
 */
function isUseful() {
  return (
    (browser.isWindows() && ((browser.isChromium() && !browser.isChromium84OrNewer()) || browser.isGecko())) ||
    browser.isTrident() ||
    browser.isEdgeHTML() ||
    (browser.isWebKit() && browser.isDesktopSafari() && !browser.isWebKit606OrNewer()) ||
    (browser.isMacOS() && browser.isChromium() && browser.isChromium57OrNewer() && !browser.isChromium79OrNewer())
  )
}
