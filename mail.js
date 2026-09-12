/*
 * mail.js -- turns the written-out addresses into real links.
 *
 * WHY THE ADDRESSES ARE NOT IN THE HTML
 *   Published addresses get harvested and sold onto mailing lists. Nearly all
 *   of that harvesting is crude: fetch the page source, find "mailto:" or an
 *   "@", keep what is around it. So the source carries neither. A link is
 *   written as
 *
 *     <a class="mail" data-user="support" data-host="taste10.com">support (at) taste10.com</a>
 *
 *   and this file turns it into a working mailto: when the page opens.
 *
 * WHY THE FALLBACK IS THE VISIBLE TEXT
 *   Somebody with JavaScript switched off still reads "support (at)
 *   taste10.com" and can write to us -- the address is on the page either way.
 *   Hiding it behind script entirely would trade a real reader for a
 *   hypothetical robot.
 *
 * NOT USED ON THE IMPRESSUM
 *   perelli.ch's legal notice keeps its address in plain HTML. German law wants
 *   the address directly available there, and an address that only exists once
 *   a script has run is a weaker position to be in. One role alias taking some
 *   spam is the cheaper side of that trade.
 */

document.addEventListener('DOMContentLoaded', function () {
  var links = document.querySelectorAll('a.mail[data-user][data-host]');
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var address = link.getAttribute('data-user') + '@' + link.getAttribute('data-host');
    link.setAttribute('href', 'mailto:' + address);
    // Only replace the text when it is the written-out fallback; a link reading
    // "write to us" keeps its own wording.
    if (link.textContent.indexOf('(at)') !== -1) link.textContent = address;
  }
});
