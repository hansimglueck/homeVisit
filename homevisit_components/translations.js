angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('cs', {});
    gettextCatalog.setStrings('da', {});
    gettextCatalog.setStrings('de', {"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon class=\"player-icon-big\" pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              should get {{score}} point from you?":"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              {{score}} Punkt vergeben?","A new %s":"Ein neuer %s","Add new item":"Neuen Eintrag hinzufügen","Are you sure?":"Bist Du sicher?","Average: {{home.data[1]}}":"Durchschnitt: {{home.data[1]}}","Average: {{teamActionInfo.data[1]}}":"Durchschnitt: {{teamActionInfo.data[1]}}","Away":"Weg","BACK":"Zurück","BACK TO GAME!":"ZURÜCK ZUM SPIEL!","Back":"Zurück","CONNECT DB":"VERBINDE MIT DATENBANK","Cancel":"Abbrechen","Change name":"Namen ändern","Change score":"Punkte ändern","Choose target where item will be appended.":"Ziel auswählen wo Eintrag angehängt werden soll.","Choose team to offer treaty:":"Wählt das Team, mit dem ihr ein Abkommen schließen möchtet.","Color":"Farbe","Come Back!":"Komm zurück!","Command":"Kommando","Configuration":"Konfiguration","Confirm":"Bestätigen","Content":"Inhalt","Copy":"Kopieren","Correct":"Richtig","Correct: {{home.correctAnswer}}":"Richtig: {{home.correctAnswer}}","Correct: {{teamActionInfo.correctAnswer}}":"Richtig: {{teamActionInfo.correctAnswer}}","Current deck:":"Ausgewählter Strang:","Current step:":"Aktueller Eintrag:","Current:":"Aktuell:","Czech":"Tschechisch","Danish":"Dänisch","Deck":"Strang","Decks and items":"Strang und Einträge","Default mapping:":"Voreingestellte Zuordnung:","Delete":"Löschen","Delete deck":"Lösche Strang","Deny":"Ablehnen","Description:":"Beschreibung:","Deselect":"Deselektieren","Details":"Details","Device Manager":"Gerätemanager","Do you really want to restart the server?":"Willst Du den Server wirklich neustarten?","Do you want to accept this treaty?":"Möchtet Ihr dieses Abkommen akzeptieren?","Doesn't match well. Should play alone.":"Keine Übereinstimmungen. Sollte alleine spielen.","Dutch":"Niederländisch","EUROPE":"EUROPA","English":"Englisch","Fill the rest":"Rest ausfüllen","French":"Französisch","Game":"Spiel","Game stopped":"Spiel gestoppt","German":"Deutsch","Import":"Importieren","Import JSON":"JSON importieren","Import:":"Importieren:","Interfaces":"Schnittstellen","JUMP":"SPRINGEN","JUMP to {{deck.nextJump}}":"SPRINGEN zu {{deck.nextJump}}","Joined":"Verbunden","Language":"Sprache","Leave Table!":"Tisch verlassen!","Maintenance":"Wartung","Mapped:":"Zugeordnet:","Matches best with the team of {{name1}} and {{name2}}.":"Passt am Besten zu Team {{name1}} und {{name2}}.","Matching":"Übereinstimmung","Max: {{home.data[3]}}":"Max: {{home.data[3]}}","Max: {{teamActionInfo.data[3]}}":"Max: {{teamActionInfo.data[3]}}","Memory":"Speicher","Message sent":"Nachricht gesendet","Min: {{home.data[2]}}":"Min: {{home.data[2]}}","Min: {{teamActionInfo.data[2]}}":"Min: {{teamActionInfo.data[2]}}","Move":"Verschieben","Move item":"Eintrag verschieben","My Turn!":"Dran!","My ambition":"Mein Ehrgeiz","My confidence in democracy":"Mein Vertrauen in die Demokratie","My earnings from the game of the markets":"Mein Gewinn aus dem Spiel der Märkte","My willingness of solidarity":"Meine Solidaritätsbereitschaft","N/A":"n.a.","New Deck":"Neuer Strang","New deck":"Neuer Strang","New option":"Neue Option","New title:":"Neuer Titel:","Next":"Nächster","Next!":"Nächster!","No":"Nein","Nobody was mean to you.":"Niemand hat euch Punkte abgezogen.","Norwegian":"Norwegisch","Not set":"Nicht gesetzt","Null Problemo!":"Null Problemo!","OS Info for {{osInfo.hostname}}":"OS Info für {{osInfo.hostname}}","Option":"Option","Options":"Optionen","Playback":"Spiel","Player":"Spieler","Player {{ playerNumber }}":"Spieler {{ playerNumber }}","Players are dealing":"Die Teams verhandeln","Players are rating others":"Die Teams bewerten andere","Players are voting":"Die Teams stimmen ab","Please rate a team! Give {{score}} point!":"{{score}} Punkt abziehen!","Point given!":"Die Stimme wurde gezählt!","Polish":"Polnisch","Polls":"Abstimmung","Portuguese":"Portugiesisch","Process":"Prozess","REALLY REALLY SURE??????????":"WIRKLICH WIRKLICH SICHER????????","Rank":"Rang","Rank: {{player.rank}}":"Rang: {{player.rank}}","Rank: {{status.player.rank}}":"Rang: {{status.player.rank}}","Really delete???":"Wirklich löschen???","Really restart?":"Wirklich neustarten?","Refresh":"Neuladen","Results are displayed":"Ergebnisse werden angezeigt","Results are weighted by ranking. See actual votes in braces.":"Ergebnisse sind nach Rang gewichtet. Die Stimmen stehen in Klammern.","Save":"Speichern","Score":"Punkte","Score for Player {{playerId}}":"Punkte für Team {{playerId}}","Score: {{player.score}}":"Punkte: {{player.score}}","Score: {{status.player.score}}":"Punkte: {{status.player.score}}","Select":"Auswählen","Silence please. Now <player-icon pid=\"status.playerOnTurn\"></player-icon> is reading:":"Ruhe bitte! Jetzt liest <player-icon pid=\"status.playerOnTurn\"></player-icon>","Silent":"Still","Sound is playing:":"Ton wird wiedergegeben:","System":"System","Team ID":"Team ID","Teams":"Teams","The MC has to select somebody!!":"Der MC muss jemanden auswählen!!","The agreement on %s is fullfilled.":"Die %s wurde geschlossen.","The agreement on %s is neglected.":"Keine %s geschlossen.","The deal was denied":"Das Abkommen kam nicht zustande.","The division of the cake":"Die Verteilung des Kuchens","The other team is busy":"Das andere Team is beschäftigt.","The worst team was not mean to you.":"Das schlechteste Team war nicht gemein zu Euch.","These teams were mean to you:":"Diese Teams haben euch Punkte abgezogen:","These worst team was mean to you:":"Das schlechteste Team war gemein zu Euch.","This deal is active":"Das Abkommen wurde geschlossen.","This is the about view.":"Das ist die About-Ansicht.","This poll doesn't exist!":"Diesen Frage gibt es nicht!","This treaty was ACCEPTED.":"Dieses Abkommen wurde ANGENOMMEN.","This treaty was DENIED.":"Dieses Abkommen wurde ABGELEHNT.","Title:":"Titel:","Total duration: {{getTimeForDeck()}}":"Gesamtdauer: {{getTimeForDeck()}}","Total: {{home.data[0]}}":"Gesamt: {{home.data[0]}}","Total: {{teamActionInfo.data[0]}}":"Gesamt: {{teamActionInfo.data[0]}}","Traitor! You can't score down your allied!":"Verräter! Ihr könnt Euren Allianzpartner nicht negativ bewerten!","Treaty":"Abkommen","Try Again":"Zurück","Type":"Art","VOTE":"ABSTIMMUNG","Voted for:":"Gestimmt für:","Wait":"Warten","Waiting for being rated.":"Auf Bewertung warten.","Waiting for reply...":"Warten auf Antwort ...","We are waiting for reply.":"Warten auf Antwort ...","Who at the table has a job of which he or she can live?":"Wer am Tisch hat eine Arbeit, von der er oder sie leben kann?","Who at this table has been class spokesman?":"Wer an diesem Tisch war einmal Klassensprecher?","Who at this table has ever won a lot?":"Wer an diesem Tisch hat schon mal viel gewonnen?","Who feels more as an European than a citizens of his country?":"Wer fühlt sich mehr als Europäer denn als Bürger seines Landes?","Who finds the people here in general trustworthy?":"Wer findet die Menschen hier grundsätzlich vertrauenswürdig?","Who had a physical conflict in the past 10 years?":"Wer hat in den vergangenen 10 Jahren einen Konflikt schon mal körperlich ausgetragen?","Who has ever consciously denied his national origin?":"Wer hat schon mal bewusst seine nationale Herkunft verleugnet?","Who is involved in a association or in an NGO?":"Wer engagiert sich in einem Verein oder in einer NGO?","Who is scared of the future?":"Wer hat Angst vor der Zukunft?","Who was or is a member of a political party?":"Wer war oder ist Parteimitglied?","Who works regularly outside the country?":"Wer arbeitet regelmäßig außerhalb des Landes?","Wi-Fi name:":"Wi-Fi Name:","Wi-Fi password":"Wi-Fi Passwort","Yes":"Ja","You are NOT in the game!":"Du spielst NICHT mit!","You are in the game!":"Du spielst mit!","You are not joined in the game!":"Nicht dem Spiel beigetreten!","You are voting for:":"Ihr stimmt für:","You can rate these Teams up or down!":"Du kannst diese Teams positiv oder negativ bewerten!","Your Time is Up. Scored one down!":"Die Zeit ist abgelaufen. Einen Punkt abgezogen!","Your choice is sent!":"Die Stimme wurde gezählt!","Your voting weight depends on your rank!":"Das Stimmgewicht hängt vom aktuellen Rang ab!","ambition":"Ehrgeiz","association/NGO":"Verein/NGO","cancel":"Abbrechen","class spokesman":"Klassensprecher","confidence in democracy":"Vertrauen in Demokratie","dark blue":"Blau","denied origin":"Herkunft verleugnet","earnings":"Gewinn aus Spiel der Märkte","feeling European":"gefühlter Europäer","green":"Grün","light blue":"Hellblau","lilac":"Lila","member of political party":"Parteimitglied","orange":"Orange","other Player":"anderer Spieler","paid job":"bezahlte Arbeit","physical conflict":"körperlicher Konflikt","pink":"Rosa","point":["Punkt","Punkte"],"red":"Rot","scared of the future":"Angst vor Zukunft","sec":"Sek.","trustworthy":"vertrauenswürdig","vote":["Team","Teams"],"waiting ...":"Warten...","willingness of solidarity":"Solidaritätsbereitschaft","won a lot":"viel gewonnen","working outside the country":"arbeitet im Ausland","yellow":"Gelb","{{minuspoints}} minus point":["{{minuspoints}} Minuspunkt","{{minuspoints}} Minuspunkte"]});
    gettextCatalog.setStrings('en', {});
    gettextCatalog.setStrings('fr', {});
    gettextCatalog.setStrings('nl', {});
    gettextCatalog.setStrings('no', {});
    gettextCatalog.setStrings('pl', {});
    gettextCatalog.setStrings('pt', {});
/* jshint +W100 */
}]);