# StudentsTool

Fullstack-Projekt zur Verwaltung von Lehrern und Schülern. Die Projektidee stammt aus meinem Schülerpraktikum, umgesetzt habe ich sie selbst, ohne KI-Unterstützung. Es ist ein Lernprojekt, mit dem ich das Zusammenspiel von React/Next.js und Java Spring ausprobiert habe.

## Funktionen
- Registrierung und Login mit den Rollen **Lehrer** und **Schüler**
- Lehrer sehen alle Schüler und fügen Schüler zu „meine Schüler" hinzu oder entfernen sie
- Schüler wählen ihre Fächer (IT, Mathe, Englisch, Französisch, Biologie, Physik)
- Authentifizierung über JWT, Passwörter werden gehasht gespeichert

## Technik
- **Frontend:** Next.js (App Router), React, TypeScript
- **Backend:** Java 17, Spring Boot 3, Spring Security, jjwt
- **Datenbank:** MongoDB

## Starten
Backend (Umgebungsvariablen `MONGODB_URI` und `JWT_SECRET` setzen):
```bash
cd backend
./mvnw spring-boot:run
```

Frontend:
```bash
npm install
npm run dev
```

## Bekannte Einschränkungen
Die Zugriffsrechte im Backend sind noch nicht vollständig umgesetzt. Alle Endpunkte sind offen, die Rollen werden bisher nur im Frontend geprüft.
