/**
 * lang.js -- send a first-time visitor to the language their browser prefers.
 *
 * WHY THIS EXISTS
 *   taste10.com led in English and the sibling site led in the other language,
 *   so visiting both in turn felt like two unrelated companies. Both have
 *   always carried both languages; only the landing language differed.
 *
 * WHY IT FOLLOWS THE BROWSER RATHER THAN FORCING ONE DEFAULT
 *   The app already behaves this way: it follows the phone's language and
 *   offers a manual switch. Doing the same here means the websites and the
 *   product agree about something a user can actually notice.
 *
 * THE THREE RULES THAT KEEP IT FROM BEING ANNOYING
 *   1. It only ever fires on the two entry pages. Deep links are never
 *      redirected -- somebody following a link to the Privacy Policy in one
 *      language means that language.
 *   2. A language link that is clicked is an explicit choice and is remembered
 *      for good. After one click this script never moves anybody again.
 *   3. At most once per browsing session, even before any click. A redirect
 *      that can fire twice is a redirect that can loop.
 *
 * IT FAILS SILENTLY AND HARMLESSLY
 *   Every storage access is wrapped: a browser with cookies and storage blocked
 *   simply stays on the page it was given, which is the correct fallback. No
 *   error, no loop, no blank page.
 *
 * NO BUILD STEP, NO FRAMEWORK -- the same rule the rest of this site follows.
 */
(function () {
  'use strict';

  var KEY = 'taste10:lang';
  var PATHS = { en: '/', de: '/de/' };
  var here = document.documentElement.lang === 'de' ? 'de' : 'en';

  function remember(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* storage blocked */ }
  }

  // Rule 2. Delegated, so it works on every page and needs no markup beyond
  // the data-lang attribute on the links themselves.
  document.addEventListener('click', function (event) {
    var el = event.target;
    var link = el && el.closest ? el.closest('a[data-lang]') : null;
    if (link) remember(link.getAttribute('data-lang'));
  });

  // Rule 1.
  if (location.pathname !== PATHS.en && location.pathname !== PATHS.de) return;

  try {
    if (localStorage.getItem(KEY)) return;              // already chose, once, ever
    if (sessionStorage.getItem(KEY + ':seen')) return;  // rule 3
    sessionStorage.setItem(KEY + ':seen', '1');
  } catch (e) {
    return;                                             // storage blocked: leave them alone
  }

  var wants = String(navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  if (wants === here) return;

  // replace, not assign: the page they never meant to see should not sit in
  // their history waiting for the Back button.
  location.replace(PATHS[wants]);
})();
