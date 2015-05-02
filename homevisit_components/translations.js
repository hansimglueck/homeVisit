angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('cs', {});
    gettextCatalog.setStrings('da', {});
    gettextCatalog.setStrings('de', {"<td><a href=\"#/deals/{{deal.id}}\">{{deal.subject}}</a></td>\n            <td>with team <player-icon pid=\"deal.player1Id\"></player-icon></td>\n            <td>{{getDealStateText(deal)}}</td>":"<td><a href=\"#/deals/{{deal.id}}\">{{deal.subject}}</a></td>\n            <td>mit Team <player-icon pid=\"deal.player1Id\"></player-icon></td>\n            <td>{{getDealStateText(deal)}}</td>","<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              should get {{score}} point from you?":"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              soll {{score}} Punkt von Euch bekommen?","A new %s":"Ein neuer %s","Add new item":"Neuen Eintrag hinzufügen","Are you sure?":"Bist Du sicher?","Average: {{home.data[1]}}":"Durchschnitt: {{home.data[1]}}","Away":"Weg","BACK":"Zurück","BACK TO GAME!":"ZURÜCK ZUM SPIEL!","Back":"Zurück","CONNECT DB":"VERBINDE MIT DATENBANK","Cancel":"Abbrechen","Change name":"Namen ändern","Change score":"Punkte ändern","Choose target where item will be appended.":"Ziel auswählen wo Eintrag angehängt werden soll.","Choose team to deal {{subject}} with:":"Team wählen um {{subject}} zu vereinbaren:","Choose type of deal:":"Wählen Sie Art des Deals:","Color":"Farbe","Come Back!":"Komm zurück!","Command":"Kommando","Configuration":"Konfiguration","Confirm":"Bestätigen","Content":"Inhalt","Copy":"Kopieren","Correct":"Richtig","Correct: {{home.correctAnswer}}":"Richtig: {{home.correctAnswer}}","Current deck:":"Ausgewählter Strang:","Current step:":"Aktueller Eintrag:","Current:":"Aktuell:","Czech":"Tschechisch","Danish":"Dänisch","Deck":"Strang","Decks and items":"Strang und Einträge","Default mapping:":"Voreingestellte Zuordnung:","Delete":"Löschen","Delete deck":"Lösche Strang","Description:":"Beschreibung:","Deselect":"Deselektieren","Details":"Details","Device Manager":"Gerätemanager","Do you really want to restart the server?":"Willst Du den Server wirklich neustarten?","Do you want to take out {{subject}} with <player-icon class=\"player-icon-med\" pid=\"player1Id\"></player-icon>?":"Möchtest du eine {{subject}} mit <player-icon class=\"player-icon-med\" pid=\"player1Id\"></player-icon> abschließen?","Dutch":"Niederländisch","EUROPE":"EUROPA","English":"Englisch","Fill the rest":"Rest ausfüllen","French":"Französisch","Game":"Spiel","Game stopped":"Spiel gestoppt","German":"Deutsch","Import":"Importieren","Import JSON":"JSON importieren","Import:":"Importieren:","Interfaces":"Schnittstellen","Joined":"Verbunden","Language":"Sprache","Leave Table!":"Tisch verlassen!","Maintenance":"Wartung","Mapped:":"Zugeordnet:","Matching":"Übereinstimmung","Max: {{home.data[3]}}":"Max: {{home.data[3]}}","Memory":"Speicher","Min: {{home.data[2]}}":"Min: {{home.data[2]}}","Move":"Verschieben","Move item":"Eintrag verschieben","My Turn!":"Dran!","New Deck":"Neuer Strang","New deal":"Neuer Deal","New deck":"Neuer Strang","New option":"Neue Option","New title:":"Neuer Titel:","Next":"Nächster","Next!":"Nächster!","Next:":"Nächster:","No":"Nein","Nobody was mean to you.":"Niemand war gemein zu Euch.","Norwegian":"Norwegisch","OS Info for {{osInfo.hostname}}":"OS Info für {{osInfo.hostname}}","Option":"Option","Options":"Optionen","Playback":"Spiel","Player":"Spieler","Player {{ playerNumber }}":"Spieler {{ playerNumber }}","Players are dealing":"Die Teams verhandeln","Players are rating others":"Die Teams bewerten andere","Players are voting":"Die Teams stimmen ab","Please rate a team! Give {{score}} point!":"Bitte bewerten Sie ein Team! Geben Sie {{score}} Punkte!","Point given!":"Punkt vergeben!","Polish":"Polnisch","Polls":"Abstimmung","Previous:":"Vorheriges:","Process":"Prozess","REALLY REALLY SURE??????????":"WIRKLICH WIRKLICH SICHER????????","Rank":"Rang","Rank: {{player.rank}}":"Rang: {{player.rank}}","Rank: {{status.player.rank}}":"Rang: {{status.player.rank}}","Really delete???":"Wirklich löschen???","Really restart?":"Wirklich neustarten?","Refresh":"Neuladen","Results are displayed":"Ergebnisse werden angezeigt","Results are weighted by ranking. See actual votes in braces.":"Ergebnisse sind nach Rang gewichtet. Die Stimmen stehen in Klammern.","Save":"Speichern","Score":"Punkte","Score for Player {{playerId}}":"Punkte für Team {{playerId}}","Score: {{player.score}}":"Punkte: {{player.score}}","Score: {{status.player.score}}":"Punkte: {{status.player.score}}","Select":"Auswählen","Silence please. Now <player-icon pid=\"status.playerOnTurn\"></player-icon> is reading:":"Ruhe bitte. Jetzt liest: <player-icon pid=\"status.playerOnTurn\"></player-icon>","Silent":"Still","Sound is playing:":"Ton wird wiedergegeben:","System":"System","Team ID":"Team ID","Teams":"Teams","The agreement on %(agreementType)s is fullfilled.":"Die %(agreementType)s ist erfüllt.","The agreement on %(agreementType)s is neglected.":"Die %(agreementType)s ist nicht zustande gekommen.","The division of the cake":"Die Verteilung des Kuchens","These teams were mean to you:":"Diese Teams waren gemein zu Euch:","This deal does not exist!":"Diesen Deal gibt es nicht!","This deal is ACTIVE.":"Dieser Deal ist AKTIV.","This deal was DENIED.":"Dieser Deal wurde ABGELEHNT.","This is the about view.":"Das ist die About-Ansicht.","This poll doesn't exist!":"Diesen Frage gibt es nicht!","Title:":"Titel:","Total duration: {{getTimeForDeck()}}":"Gesamtdauer: {{getTimeForDeck()}}","Total: {{home.data[0]}}":"Gesamt: {{home.data[0]}}","Traitor! You can't score down your allied!":"Verräter! Ihr könnt Euren Allianzpartner nicht negativ bewerten!","Try Again":"Versucht nochmal","Type":"Art","VOTE":"ABSTIMMUNG","Wait":"Warten","Waiting for being rated.":"Auf Bewertung warten.","Waiting for reply...":"Warten auf Antwort ...","Wi-Fi name:":"Wi-Fi Name:","Wi-Fi password":"Wi-Fi Passwort","Yes":"Ja","You are NOT in the game!":"Nicht dem Spiel beigetreten!","You are in the game!":"Nicht dem Spiel beigetreten!","You are not joined in the game!":"Nicht dem Spiel beigetreten!","You are voting for:":"Sie stimmen für:","You can rate these Teams up or down!":"Du kannst diese Teams positiv oder negativ bewerten!","Your Time is Up. Scored one down!":"Die Zeit ist abgelaufen. Einen Punkt abgezogen!","Your choice is sent!":"Ihre Stimme wurde abgeschickt!","Your voting weight depends on your rank!":"Das Stimmgewicht hängt vom aktuellen Rang ab!","dark blue":"dunkelblau","green":"grün","light blue":"hellblau","lilac":"lila","orange":"orange","other Player":"anderer Spieler","pink":"rosa","point":["Punkt","Punkte"],"red":"rot","sec":"Sek.","vote":["Stimme","Stimmen"],"yellow":"gelb","{{minuspoints}} minus point":["{{minuspoints}} Minuspunkt","{{minuspoints}} Minuspunkte"]});
    gettextCatalog.setStrings('en', {});
    gettextCatalog.setStrings('fr', {});
    gettextCatalog.setStrings('nl', {});
    gettextCatalog.setStrings('no', {});
    gettextCatalog.setStrings('pl', {});
    gettextCatalog.setStrings('pt', {});
/* jshint +W100 */
}]);