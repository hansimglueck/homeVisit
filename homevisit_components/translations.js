angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('cs', {"€":"Kč"});
    gettextCatalog.setStrings('da', {});
    gettextCatalog.setStrings('de', {"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon class=\"player-icon-big\" pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              should get {{score}} point from you?":"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              {{score}} Punkt vergeben?","A new %s":"Ein neuer %s","Add new item":"Neuen Eintrag hinzufügen","Are you sure?":"Bist Du sicher?","Average:":"Durchschnitt:","Away":"Weg","BACK":"Zurück","BACK TO GAME!":"ZURÜCK ZUM SPIEL!","Back":"Zurück","Cancel":"Abbrechen","Change name":"Namen ändern","Change score":"Punkte ändern","Choose target where item will be appended.":"Ziel auswählen wo Eintrag angehängt werden soll.","Choose team to offer treaty:":"Wählt das Team, mit dem ihr ein Abkommen schließen möchtet.","Color":"Farbe","Come Back!":"Komm zurück!","Command":"Kommando","Configuration":"Konfiguration","Confirm":"Bestätigen","Content":"Inhalt","Copy":"Kopieren","Correct":"Richtig","Correct: {{home.correctAnswer}}":"Richtig: {{home.correctAnswer}}","Current deck:":"Ausgewählter Strang:","Current step:":"Aktueller Eintrag:","Current:":"Aktuell:","Czech":"Tschechisch","Danish":"Dänisch","Deck":"Strang","Decks and items":"Strang und Einträge","Default mapping:":"Voreingestellte Zuordnung:","Delete":"Löschen","Deny":"Ablehnen","Description:":"Beschreibung:","Deselect":"Deselektieren","Details":"Details","Device Manager":"Gerätemanager","Do you really want to restart the server?":"Willst Du den Server wirklich neustarten?","Do you want to accept this treaty?":"Möchtet Ihr dieses Abkommen annehmen?","Doesn't match well. Should play alone.":"Keine Übereinstimmungen. Sollte alleine spielen.","Dutch":"Niederländisch","EUROPE":"EUROPA","English":"Englisch","Fill the rest":"Rest ausfüllen","French":"Französisch","Game":"Spiel","Game session":"Spielsitzung","Game stopped":"Spiel gestoppt","German":"Deutsch","Import":"Importieren","Import JSON":"JSON importieren","Import:":"Importieren:","Interfaces":"Schnittstellen","JUMP":"SPRINGEN","Joined":"Verbunden","Language":"Sprache","Leave Table!":"Tisch verlassen!","Mapped:":"Zugeordnet:","Matches best with the team of {{name1}} and {{name2}}.":"Passt am Besten zu Team {{name1}} und {{name2}}.","Matching":"Übereinstimmung","Memory":"Speicher","Message sent":"Nachricht gesendet","Move":"Verschieben","Move item":"Eintrag verschieben","My Turn!":"Dran!","My ambition":"Mein Ehrgeiz","My confidence in democracy":"Mein Vertrauen in die Demokratie","My earnings from the game of the markets":"Mein Vorteil aus dem Spiel der Märkte","My willingness of solidarity":"Meine Solidaritätsbereitschaft","N/A":"n.a.","New deck":"Neuer Strang","New option":"Neue Option","New title:":"Neuer Titel:","Next":"Nächster","Next!":"Nächster!","No":"Nein","No Deal with me!":"Kein Abkommen mit uns!","Nobody was mean to you.":"Niemand hat euch Punkte abgezogen.","Norwegian":"Norwegisch","Not set":"Nicht gesetzt","Null Problemo!":"Null Problemo!","Option":"Option","Options":"Optionen","Playback":"Spiel","Player":"Spieler","Player {{ playerNumber }}":"Spieler {{ playerNumber }}","Players are dealing":"Die Teams verhandeln","Players are rating others":"Die Teams bewerten andere","Players are voting":"Die Teams stimmen ab","Please rate a team! Give {{score}} point!":"{{score}} Punkt abziehen!","Please select a session before starting the game!":"Bitte Spielsitzung einstellen bevor das Spiel startet!","Point given!":"Die Stimme wurde gezählt!","Polish":"Polnisch","Polls":"Abstimmung","Portuguese":"Portugiesisch","Process":"Prozess","REALLY REALLY SURE??????????":"WIRKLICH WIRKLICH SICHER????????","Rank":"Rang","Rank: {{player.rank}}":"Rang: {{player.rank}}","Rank: {{status.player.rank}}":"Rang: {{status.player.rank}}","Really DB: {{action}}?":"Wirklich DB: {{action}}?","Really delete???":"Wirklich löschen???","Really restart?":"Wirklich neustarten?","Refresh":"Neuladen","Reject":"Ablehnen","Request":"Ersuchen","Results are displayed":"Ergebnisse werden angezeigt","Results are weighted by ranking. See actual votes in braces.":"Ergebnisse sind nach Rang gewichtet. Die Stimmen stehen in Klammern.","Save":"Speichern","Score":"Punkte","Score for Player {{playerId}}":"Punkte für Team {{playerId}}","Score: {{player.score}}":"Punkte: {{player.score}}","Score: {{status.player.score}}":"Punkte: {{status.player.score}}","Select":"Auswählen","Settings":"Einstellungen","Silence please. Now <player-icon pid=\"status.playerOnTurn\"></player-icon> is reading:":"Ruhe bitte! Jetzt liest <player-icon pid=\"status.playerOnTurn\"></player-icon>","Silent":"Still","Sound is playing:":"Ton wird wiedergegeben:","System":"System","Team ID":"Team ID","Teams":"Teams","The MC has to select somebody!!":"Der MC muss jemanden auswählen!!","The alliance is fullfilled.":"Die Allianz wurde geschlossen.","The alliance is neglected.":"Keine Allianz geschlossen.","The deal was denied":"Das Abkommen kam nicht zustande.","The division of the cake":"Die Verteilung des Kuchens","The other team is busy":"Das andere Team is beschäftigt.","The worst team was not mean to you.":"Das schlechteste Team war nicht gemein zu Euch.","These teams were mean to you:":"Diese Teams haben euch Punkte abgezogen:","These worst team was mean to you:":"Das schlechteste Team war gemein zu Euch.","This deal is active":"Das Abkommen wurde geschlossen.","This is the about view.":"Das ist die About-Ansicht.","This poll doesn't exist!":"Diesen Frage gibt es nicht!","This treaty was ACCEPTED.":"Dieses Abkommen wurde ANGENOMMEN.","This treaty was DENIED.":"Dieses Abkommen wurde ABGELEHNT.","Title:":"Titel:","Total:":"Summe:","Traitor! You can't score down your allied!":"Verräter! Ihr könnt Euren Allianzpartner nicht negativ bewerten!","Treaty":"Abkommen","Try Again":"Zurück","Type":"Art","VOTE":"ABSTIMMUNG","Voted for:":"Gestimmt für:","Wait":"Warten","Waiting for being rated.":"Auf Bewertung warten.","Waiting for reply...":"Warten auf Antwort ...","We are waiting for reply.":"Warten auf Antwort ...","Who at the table has a job of which he or she can live?":"Wer hat eine Arbeit, von der er / sie leben kann?  (+ Rückfrage)","Who at this table has been class spokesman?":"Wer war Klassensprecher?","Who at this table has ever won a lot?":"Wer hat schon mal das große Los gezogen?","Who feels more as an European than a citizens of his country?":"Wer fühlt sich mehr als Europäer denn als Bürger seines Landes?","Who finds the people here in general trustworthy?":"Wer findet die Menschen hier grundsätzlich vertrauenswürdig?","Who had a physical conflict in the past 10 years?":"Wer hat einen Konflikt schon mal körperlich ausgetragen?","Who has ever consciously denied his national origin?":"Wer hat bewusst seine nationale Herkunft verleugnet?  (+ Rückfrage)","Who is involved in a association or in an NGO?":"Wer engagiert sich in einem Verein oder in einer NGO?  (+ Rückfrage)","Who is scared of the future?":"Wer hat Angst vor der Zukunft?","Who was or is a member of a political party?":"Wer war oder ist Parteimitglied?  (+ Rückfrage)","Who works regularly outside the country?":"Wer arbeitet regelmäßig außerhalb des Landes?  (+ Rückfrage)","Yes":"Ja","You are NOT in the game!":"Ihr investiert nicht!","You are in the game!":"Ihr investiert 1 Punkt!","You are not joined in the game!":"Nicht dem Spiel beigetreten!","You are voting for:":"Ihr stimmt für:","You can rate these Teams up or down!":"Du kannst diese Teams positiv oder negativ bewerten!","You decided not to deal at all!":"Ihr habt euch entschieden, kein Abkommen zu schließen.","Your Time is Up. Scored one down!":"Die Zeit ist abgelaufen. 1 Punkt abgezogen!","Your choice is sent!":"Die Stimme wurde gezählt!","Your voting weight depends on your rank!":"Das Stimmgewicht hängt vom aktuellen Rang ab!","ambition":"Ehrgeiz","association/NGO":"Verein/NGO","cancel":"Abbrechen","class spokesman":"Klassensprecher","confidence in democracy":"Vertrauen in Demokratie","dark blue":"BLAU","denied origin":"Herkunft verleugnet","earnings":"Vorteil aus Spiel der Märkte","feeling European":"gefühlter Europäer","green":"GRÜN","light blue":"HELL BLAU","lilac":"LILA","member of political party":"Parteimitglied","orange":"ORANGE","other Player":"anderer Spieler","paid job":"bezahlte Arbeit","physical conflict":"körperlicher Konflikt","pink":"ROSA","point":["Punkt","Punkte"],"red":"ROT","scared of the future":"Angst vor Zukunft","sec":"Sek.","trustworthy":"vertrauenswürdig","vote":["Team","Teams"],"waiting ...":"Warten...","willingness of solidarity":"Solidaritätsbereitschaft","won a lot":"das große Los","working outside the country":"arbeitet im Ausland","yellow":"GELB","{{minuspoints}} minus point":["{{minuspoints}} Minuspunkt","{{minuspoints}} Minuspunkte"],"← Select game session!":"← Spielsitzung wählen!"});
    gettextCatalog.setStrings('en', {"My ambition":"My level of ambition","My confidence in democracy":"My trust in democracy","My earnings from the game of the markets":"My profit from the free market","My willingness of solidarity":"My sense of solidarity","Point given!":"Your vote was registered!","Results are weighted by ranking. See actual votes in braces.":"Results are weighted by rank. See actual votes in brackets.","Silence please. Now <player-icon pid=\"status.playerOnTurn\"></player-icon> is reading:":"Silence please. <player-icon pid=\"status.playerOnTurn\"></player-icon> is reading now. ","The alliance is neglected.":"The alliance is rejected.","Traitor! You can't score down your allied!":"Traitor! You can't deduct points from your allies!","Waiting for being rated.":"Waiting to be rated.","Who at the table has a job of which he or she can live?":"Who has a job that pays enough that they can live from it?  (+ further enquiry)","Who at this table has been class spokesman?":"Who was a class representative?","Who at this table has ever won a lot?":"Who at this table has ever hit the jackpot?","Who feels more as an European than a citizens of his country?":"Who feels more European than as a citizen of their own country?","Who finds the people here in general trustworthy?":"Who thinks that the people here are reliable?","Who had a physical conflict in the past 10 years?":"Who has gotten into a physical conflict or fight?","Who has ever consciously denied his national origin?":"Who has ever lied about their national identity? (+ further enquiry)","Who is involved in a association or in an NGO?":"Who is in an association, club or NGO? (+ further enquiry)","Who is scared of the future?":"Who is worried about the future?","Who was or is a member of a political party?":"Who has been a member of a political party? (+ further enquiry)","Who works regularly outside the country?":"Who works often outside of the country? (+ further enquiry)","Your Time is Up. Scored one down!":"Your time is up. One point deducted.","Your choice is sent!":"Your choice has been sent!","Your voting weight depends on your rank!":"The weight of your vote depends on your rank!","ambition":"ambition","association/NGO":"association/NGO","class spokesman":"class representative","confidence in democracy":"trust in democracy","denied origin":"denied origin","earnings":"profit","feeling European":"feels European","lilac":"purple","member of political party":"political party member","paid job":"paid job","physical conflict":"physical conflict","scared of the future":"worried about future","trustworthy":"reliable people","willingness of solidarity":"solidarity","won a lot":"jackpot","working outside the country":"works outside of the country","€":"NOK"});
    gettextCatalog.setStrings('fr', {});
    gettextCatalog.setStrings('nl', {});
    gettextCatalog.setStrings('no', {"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon class=\"player-icon-big\" pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              should get {{score}} point from you?":"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon class=\"player-icon-big\" pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              bør få {{score}} poeng fra deg?","A new %s":"En ny %s","ALARM":"ALARM","Add new item":"Legg til nytt element","Are you sure?":"Er du sikker?","Average:":"Gjennomsnitt:","Average: {{display.data[1]}}":"Gjennomsnitt: {{display.data[1]}}","Away":"Borte","BACK":"TILBAKE","BACK TO GAME!":"TILBAKE TIL SPILLET!","BRAIN Control":"HJERNE Kontroll","Back":"Tilbake","Cancel":"Avbryt","Change name":"Endre navn","Change score":"Endre poengsum","Choose target where item will be appended.":"Velg målet hvor elementet vil bli tilføyd.","Choose team to offer treaty:":"Velg lag som tilbys avtale","Color":"Farge","Come Back!":"Kom tilbake!","Command":"Command","Configuration":"Konfigurasjon","Confirm":"Bekrefte","Content":"Innhold","Copy":"Kopier","Correct":"Riktig","Correct: {{display.correctAnswer}}":"Riktig: {{display.correctAnswer}}","Correct: {{home.correctAnswer}}":"Riktig: {{home.correctAnswer}}","Current step:":"Gjeldende steg:","Current:":"Gjeldende:","Czech":"Tsjekkisk","Danish":"Dansk","Deal with":"Håndtere","Deck":"Deck","Decks and items":"Decks og gjenstander","Default mapping:":"Standard kartlegging","Delete":"Slett","Deny":"Nekt","Description:":"Beskrivelse:","Deselect":"opphev valg/fjern markering","Details":"Detaljer","Device Manager":"Enhetsbehandler","Do you really want to restart the server?":"Er du sikker på at du vil restarte serveren?","Do you want to accept this treaty?":"Vil dere godta avtalen?","Doesn't match well. Should play alone.":"Passer ikke godt. Burde spille alene.","Dutch":"Nederlandsk","EUROPE":"EUROPA","English":"Engelsk","Fill the rest":"Fyll opp resten","French":"Fransk","GO":"GÅ","GO 2":"GÅ 2","GOTO":"GÅ TIL","Game":"Spill","Game session":"Spilløkt","Game stopped":"Spill stoppet","German":"Tysk","Hello, MC!":"Hallo, spilleder!","Import":"Importer","Import JSON":"Importer JSON","Import:":"Importer:","Interfaces":"Grensesnitt","JUMP":"HOPP OVER","Joined":"Tilknyttet","Language":"Språk","Leave Table!":"Forlat bordet!","Load":"Laste","Log":"log","MC-Notes":"Spilledernotat","Mapped:":"Kartlagt:","Matches best with the team of {{name1}} and {{name2}}.":"Passer best sammen med laget til {{name1}} og {{name2}}.","Matching":"Passer sammen","Max:":"Maks:","Max: {{display.data[3]}}":"Maks: {{display.data[3]}}","Memory":"Minne","Message sent":"Melding sendt","Min:":"Min:","Min: {{display.data[2]}}":"Min: {{display.data[2]}}","Move":"Flytt","Move item":"Flytt element","My Turn!":"Min tur!","My ambition":"Mitt ambisjonsnivå","My confidence in democracy":"Min tillit til demokratiet","My earnings from the game of the markets":"Min profitt fra det frie markedet","My willingness of solidarity":"Min solidaritetssans","N/A":"N/A","Name":"Navn","New deck":"Ny deck","New name for ?":"Nytt navn for ?","New option":"Nytt alternativ","New title:":"Ny tittel:","Next":"Neste","Next!":"Neste!","No":"Nei","No Deal with me!":"Ingen avtale med meg!","No connected nodes!":"Ingen tilknyttede punkter!","Nobody was mean to you.":"Ingen var slemme mot deg.","Node list":"Punktliste","Norwegian":"Norsk","Not set":"Ikke satt","Null Problemo!":"Null problem!","OK":"OK","Online":"Online","Option":"Valg","Options":"Valgmuligheter","Playback":"Playback","Player":"Spiller","Player {{ playerNumber }}":"Spiller {{ playerNumber }}","Players are dealing":"Spillerne forhandler","Players are rating others":"Spillerne rangerer andre","Players are voting":"Spillerne stemmer","Please Select:":"Vennligst velg:","Please rate a team! Give {{score}} point!":"Vennligst ranger et lag! Gi {{score}} poeng!","Please select a session before starting the game!":"Vennligst velg en økt før spillet settes i gang!","Point given!":"Din stemme er registrert!","Polish":"Polsk","Polls":"Avstemninger","Port":"Port","Portuguese":"Portugisisk","Process":"Prosess","REALLY REALLY SURE??????????":"VIRKELIG HELT SIKKER??????????","REBOOT":"REBOOT","REGO":"REGO","RELOAD":"LAST PÅ NYTT","REPAIR DB":"REPARER DB","RESTART":"RESTART","RESTART SERVER":"RESTART SERVER","Rank":"Plassering","Rank: {{player.rank}}":"Plassering: {{player.rank}}","Rank: {{status.player.rank}}":"Plassering: {{status.player.rank}}","Really DB: {{action}}?":"Virkelig DB: {{action}}?","Really delete???":"Vil du virkelig slette???","Really jump?":"Vil du virkelig hoppe over?","Really restart?":"Vil du virkelig starte på nytt?","Refresh":"Oppdater","Reject":"Avslå","Request":"Ønske","Results are displayed":"Resultater vises","Results are weighted by ranking. See actual votes in braces.":"Resultatene vektes etter plassering. Se faktiske stemmer i parantes.","SHUTDOWN":"AVSLUTNING","Save":"Lagre","Score":"Poengsum / stilling","Score for Player {{playerId}}":"Poengsum for spiller {{playerId}}","Score: {{player.score}}":"Poengsum: {{player.score}}","Score: {{status.player.score}}":"Poengsum: {{status.player.score}}","Select":"Velg","Settings":"Innstillinger","Silence please. Now <player-icon pid=\"status.playerOnTurn\"></player-icon> is reading:":"Kan dere være stille? Nå skal <player-icon pid=\"status.playerOnTurn\"></player-icon> lese:","Silent":"Stille","Sound is playing:":"Lyd spilles av:","Submit":"Send inn","System":"System","Team ID":"Lag-ID","Teams":"Lag","The MC has to select somebody!!":"Spilleder må velge noen!","The alliance is fullfilled.":"Alliansen er fullbyrdet.","The alliance is neglected.":"Allianseforslaget er ikke godtatt.","The deal was denied":"Avtalen ble avslått","The division of the cake":"Delingen av kaken","The other team is busy":"Det andre laget er opptatt","The worst team was not mean to you.":"Det dårligste laget var ikke slemme mot deg/dere.","These teams were mean to you:":"Disse lagene var slemme mot dere:","These worst team was mean to you:":"Det dårligste laget var slemt mot deg:","This deal is active":"Denne avtalen er aktiv","This is the about view.":"Dette er innholdsfortegnelsen.","This poll doesn't exist!":"Denne avstemningen eksisterer ikke!","This treaty was ACCEPTED.":"Denne avtalen ble AKSEPTERT.","This treaty was DENIED.":"Denne avtalen ble AVSLÅTT.","Title:":"Tittel:","Total:":"Totalt:","Total: {{display.data[0]}}":"Totalt: {{display.data[0]}}","Traitor! You can't score down your allied!":"Forræder! Du kan ikke gi din allierte minuspoeng!","Treaty":"Avtale","Try Again":"Prøv igjen","Type":"Type","Uptime":"Oppetid","VOTE":"STEM","Voted for:":"Stemte for:","Wait":"Vent","Waiting for being rated.":"Venter på å bli rangért.","Waiting for reply...":"Venter på svar…","We are waiting for reply.":"Vi venter på et svar.","Who at the table has a job of which he or she can live?":"Hvem ved bordet har en jobb han/hun kan leve av? (+ videre spørsmål)","Who at this table has been class spokesman?":"Hvem ved dette bordet har vært elevrådsrepresentant?","Who at this table has ever won a lot?":"Hvem ved dette bordet har noensinne vunnet en stor premie?","Who feels more as an European than a citizens of his country?":"Hvem føler seg mer som en europeer enn som en innbygger i sitt eget land?","Who finds the people here in general trustworthy?":"Hvem tenker at personene i dette rommet er til å stole på?","Who had a physical conflict in the past 10 years?":"Hvem har vært involverte i en fysisk konflikt eller slåsskamp i løpet av de 10 siste årene?","Who has ever consciously denied his national origin?":"Hvem har noensinne bevisst løyet om sin nasjonalitet?  (+ videre spørsmål)","Who is involved in a association or in an NGO?":"Hvem er medlem av en forening, klubb eller ideell organisasjon?  (+ videre spørsmål)","Who is scared of the future?":"Hvem er bekymret for fremtiden?","Who was or is a member of a political party?":"Hvem var eller er medlem av et politisk parti? (+ videre spørsmål)","Who works regularly outside the country?":"Hvem jobber jevnlig i utlandet? (+ videre spørsmål)","Yes":"Ja","You are NOT in the game!":"Du er IKKE med i spillet!","You are in the game!":"Du er med i spillet! ","You are not joined in the game!":"Du er ikke deltaker i spillet! ","You are voting for:":"Dere stemmer på:","You can rate these Teams up or down!":"Du kan stemme disse lagene opp eller ned.","You decided not to deal at all!":"Dere bestemte dere for ikke å forhandle i det hele tatt!","Your Time is Up. Scored one down!":"Tiden er ute. Ett poeng ned!","Your choice is sent!":"Ditt valg er sendt!","Your voting weight depends on your rank!":"Tyngden av din stemme er avhengig av rangeringen din!","ambition":"ambisjonsnivå","association/NGO":"forening/ideell organisasjon","cancel":"avbryt","class spokesman":"elevrådsrepresentant","confidence in democracy":"tro på demokratiet","dark blue":"mørkeblå","denied origin":"løyet om nasjonalitet","earnings":"profitt","feeling European":"føler seg som en europeer","green":"grønn","light blue":"lyseblå","lilac":"lilla","member of political party":"medlem av et politisk parti","orange":"oransje","other Player":"annen spiller","paid job":"betalt jobb","physical conflict":"fysisk konflikt","pink":"rosa","point":["poeng","poeng"],"red":"rød","scared of the future":"redd for fremtiden","sec":"sekund","throw out":"kaste ut","to":"til","trustworthy":"stoler på de andre","vote":["stemme","stemmer"],"waiting ...":"venter...","willingness of solidarity":"villighet til solidaritet","won a lot":"har vunnet en jackpot","working outside the country":"jobber utenfor landet","yellow":"gul","{{minuspoints}} minus point":["{{minuspoints}} minuspoeng","{{minuspoints}} minuspoeng"],"€":"NOK"});
    gettextCatalog.setStrings('pl', {"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon class=\"player-icon-big\" pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              should get {{score}} point from you?":"<ul class=\"list-inline\">\n                <li ng-repeat=\"pid in playerIds\">\n                  <player-icon class=\"player-icon-big\" pid=\"pid\"></player-icon>\n                </li>\n              </ul>\n              przyznać {{score}} punkt?","A new %s":"Nowy %s","Add new item":"Dodaj nową pozycję","Are you sure?":"Jesteś pewien/-na?","Average:":"Średnia:","Average: {{display.data[1]}}":"Średnia: {{display.data[1]}}","Away":"Odejdź","BACK":"Wróć","BACK TO GAME!":"WRACASZ DO GRY!","BRAIN Control":"Nadzór","Back":"Wróć","Cancel":"Przerwij","Change name":"Zmień nazwę","Change score":"Zmień punkty","Choose target where item will be appended.":"Wybierz, gdzie ma być przytwierdzona pozycja.","Choose team to offer treaty:":"Wybierz drużynę, z którą chcesz zawrzeć ugodę.","Color":"Kolor","Come Back!":"Wracaj!","Command":"Komando","Configuration":"Konfiguracja","Confirm":"Potwierdź","Content":"Treść","Copy":"Kopiuj","Correct":"Dobrze","Correct: {{display.correctAnswer}}":"Dobrze: {{home, correctAnswer}}","Correct: {{home.correctAnswer}}":"Correct: {{home.correctAnswer}}","Current deck:":"Bierzący układ:","Current step":"Bierzący krok","Current step:":"Bierzący krok:","Current:":"Bierzący:","Czech":"Czeski","Danish":"Duński","Deal with":"Układ z","Deck":"Układ","Decks and items":"Układy i punkty","Default mapping:":"Ustawione przyporządkowanie:","Delete":"Kasuj","Deny":"Odrzuć","Description:":"Opis:","Deselect":"Odwołaj ","Details":"Szczegóły","Device Manager":"Zarządca przedmiotów","Do you really want to restart the server?":"Czy naprawdę chcesz ponownie uruchomić serwer?","Do you want to accept this treaty?":"Czy chcecie przyjąć tę ugodę?","Doesn't match well. Should play alone.":"Brak porozumienia. Musi grać sam.","Dutch":"Holenderski","EUROPE":"EUROPA","English":"Angielski","Fill the rest":"Wypełnij resztę","French":"Francuski","GO":"IDŹ","Game":"Gra","Game session":"Posiedzenie gry","Game stopped":"Gra zatrzymana","German":"niemiecki","Hello, MC!":"Witaj, MC!","Import":"Importuj","Import JSON":"Importuj JSON","Import:":"Importuj:","Interfaces":"Punkty przecięcia","JUMP":"SKAKAĆ","Joined":"Połączenie aktywne","Language":"Język","Leave Table!":"Opuść Stół!","Load":"uruchom","Log":"zaloguj","MC-Notes":"Głosy MC","Mapped:":"Przyporządkowany:","Matches best with the team of {{name1}} and {{name2}}.":"Pasuje najlepiej do drużyny {{name1}} i {{name2}}.","Matching":"Zgodne","Max:":"Max:","Max: {{display.data[3]}}":"Max: {{home.data[3]}}","Memory":"Pamięć","Message sent":"Wiadomość wysłana","Min:":"Min:","Min: {{display.data[2]}}":"Min: {{home.data[2]}}","Move":"Przesuń","Move item":"Przesuń pozycję","My Turn!":"Moja Kolej!","My ambition":"Moja ambicja","My confidence in democracy":"Moja ufność w demokrację","My earnings from the game of the markets":"Moja wygrana w grze rynków","My willingness of solidarity":"Moja gotowość solidaryzacji","N/A":"N/A","Name":"Nazwa","New deck":"Nowy układ","New name for ?":"Nowa nazwa","New option":"Nowa opcja","New title:":"Nowy tytuł:","Next":"Następny","Next!":"Następny!","No":"Nie","No Deal with me!":"Nie idę na Ugodę!","No connected nodes!":"Brak połączonych punktów!","Nobody was mean to you.":"Nikt nie odjął wam punktów.","Node list":"Lista punktów","Norwegian":"Norweski","Not set":"Nie usadowiony","Null Problemo!":"Zero Problemo!","OK":"OK","OS Info for {{systemInfo.osInfo.hostname}}":"OS informacja dla {{systemInfo.osInfo.hostname}}","Online":"Online","Option":"Opcja","Options":"Opcje","Playback":"Graj","Player":"Gracz","Player {{ playerNumber }}":"Gracz {{ playerNumber }}","Players are dealing":"Gracze licytują się","Players are rating others":"Gracze oceniają innych","Players are voting":"Drużyny głosują","Please Select:":"Proszę wybrać:","Please rate a team! Give {{score}} point!":"Proszę ocenić drużynę! Przyznaj {{score}} punkt!","Please select a session before starting the game!":"Proszę ustawić posiedzenie gry zanim rozpocznie się gra!","Point given!":"Punkt został przyznany!","Polish":"Polski","Portuguese":"Portugalski","Process":"Proces","REALLY REALLY SURE??????????":"CZY NAPRAWDĘ NAPRAWDĘ JESTEŚ PEWNY???????????","REBOOT":"PONOWNE URUCHOMIENIE","REGO":"PONOWNY START","RELOAD":"PONOWNE ZAŁADOWANIE","REPAIR DB":"NAPRAWA DB","RESTART":"PONOWNE URUCHOMIENIE","RESTART SERVER":"PONOWNE URUCHOMIENIE SERWERA","Rank":"Ranga","Rank: {{player.rank}}":"Ranga: {{player.rank}}","Rank: {{status.player.rank}}":"Ranga: {{status.player.rank}}","Really DB: {{action}}?":"Naprawdę DB: {{action}}?","Really delete???":"Naprawdę usunąć?","Really jump?":"Naprawdę przeskoczyć?","Really restart?":"Naprawdę uruchomić ponownie?","Refresh":"Odśwież","Reject":"Odrzuć","Request":"Prośba","Results are displayed":"Wyniki zostaną pokazane","Results are weighted by ranking. See actual votes in braces.":"Wyniki są rozpatrywane na podstawie rangi. Głosy znajdują się w nawiasach.","Save":"Zapisz","Score":"Punkty","Score for Player {{playerId}}":"Punkty dla Gracza {{playerId}}","Score: {{player.score}}":"Punkty: {{player.score}}","Score: {{status.player.score}}":"Punkty: {{status.player.score}}","Select":"Wybierz","Settings":"Ustawienia","Silence please. Now <player-icon pid=\"status.playerOnTurn\"></player-icon> is reading:":"Spokój! Teraz czyta <player-icon pid=\"status.playerOnTurn\"></player-icon>","Silent":"Cisza","Sound is playing:":"Głos przywrócony:","Submit":"Zatwierdź","System":"System","Team ID":"Drużyna ID","Teams":"Drużyny","The MC has to select somebody!!":"MC musi kogoś wybrać!!","The alliance is fullfilled.":"Sojusz został zawarty.","The alliance is neglected.":"Sojusz nie został zawarty.","The deal was denied":"Porozumienie nie doszło do skutku","The division of the cake":"Podział ciasta","The other team is busy":"Inna drużyna jest zajęta","The worst team was not mean to you.":"Najgorsza drużyna nie była wobec was nieuprzejma.","These teams were mean to you:":"Te drużyny były wobec was nieuprzejme:","These worst team was mean to you:":"Ta najgorsza drużyna była wobec was nieuprzejma:","This deal is active":"Porozumienie zostało zawarte","This is the about view.":"To jest pogląd about.","This poll doesn't exist!":"To głosowanie nie istnieje!","This treaty was ACCEPTED.":"To porozumienie zostało PRZYJĘTE.","This treaty was DENIED.":"To porozumienie zostało ODRZUCONE.","Title:":"Tytuł:","Total:":"Łącznie:","Total: {{display.data[0]}}":"Łącznie: {{display.data[0]}}","Traitor! You can't score down your allied!":"Zdrajcy! Nie możecie negatywnie ocenić Waszego sojusznika!","Treaty":"Porozumienie","Try Again":"Spróbuj Ponownie","Type":"Rodzaj","Uptime":"Czas trwania","VOTE":"GŁOSOWANIE","Voted for:":"Zagłosowano za:","Wait":"Czekaj","Waiting for being rated.":"Oczekiwanie na ocenę.","Waiting for reply...":"Oczekiwanie na odpowiedź …","We are waiting for reply.":"Oczekiwanie na odpowiedź. ","Who at the table has a job of which he or she can live?":"Kto ze zgromadzonych ma pracę, z której może wyżyć?","Who at this table has been class spokesman?":"Kto był przewodniczącym klasy?","Who at this table has ever won a lot?":"Kto już wygrał los na loterii?","Who feels more as an European than a citizens of his country?":"Kto czuje się bardziej Europejczykiem niż obywatelem własnego kraju?","Who finds the people here in general trustworthy?":"Kto zasadniczo uważa zgromadzonych tu ludzi za godnych zaufania?","Who had a physical conflict in the past 10 years?":"Kto w ciągu ostatnich 10 lat brał udział w bójce?","Who has ever consciously denied his national origin?":"Kto świadomie wyparł się swojej narodowości?","Who is involved in a association or in an NGO?":"Kto angażuje się w stowarzyszeniu lub organizacji pozarządowej?","Who is scared of the future?":"Kto się boi przyszłości?","Who was or is a member of a political party?":"Kto był lub jest członkiem partii?","Who works regularly outside the country?":"Kto regularnie pracuje poza granicami kraju?","Yes":"Tak","You are NOT in the game!":"Jesteście POZA grą!","You are in the game!":"Jesteście w grze!","You are not joined in the game!":"Nie przyłączyliście się do gry!","You are voting for:":"Głosujecie za:","You can rate these Teams up or down!":"Możesz ocenić te drużyny pozytywnie bądź negatywnie!","You decided not to deal at all!":"Zdecydowaliście się nie zawierać porozumienia.","Your Time is Up. Scored one down!":"Czas Minął. Odejmujemy 1 punkt.","Your choice is sent!":"Głos się liczy!","Your voting weight depends on your rank!":"Waga waszego głosu zależy od obecnej rangi!","ambition":"ambicja","association/NGO":"stowarzyszenie/organizacja pozarządowa","cancel":"przerwij","class spokesman":"przewodniczący klasy","confidence in democracy":"ufność w demokrację","dark blue":"niebieski","denied origin":"wyparcie się narodowości","earnings":"wygrana na loterii","feeling European":"czuć się Europejczykiem","green":"zielony","light blue":"jasny niebieski","lilac":"lila","member of political party":"członek partii","orange":"pomarańczowy","other Player":"inny Gracz","paid job":"płatna praca","physical conflict":"udział w bójce","pink":"różowy","point":["punkt","punkty",""],"red":"punkty","scared of the future":"strach przed przyszłością","sec":"sek.","throw out":"usuwanie","to":"do","trustworthy":"godny zaufania","vote":["drużyna","drużyny",""],"waiting ...":"oczekiwanie …","willingness of solidarity":"gotowość solidaryzacji","won a lot":"wygrana w grze rynków","working outside the country":"praca za granicą","yellow":"żółty","{{minuspoints}} minus point":["{{minuspoints}} punkt ujemny","{{minuspoints}} punkty ujemne",""],"€":"zł","← Select game session!":"← Wybierz posiedzenie gry!"});
    gettextCatalog.setStrings('pt', {});
/* jshint +W100 */
}]);