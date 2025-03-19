# XML project

Web aplikacija za upravljanje studentskim podacima s mogućnostima obrade XML-a, SOAP web uslugama, sigurnom autentikacijom i integracijom podataka o vremenu putem XML-RPC-a.

![Screenshot 2025-03-18 at 23 27 19](https://github.com/user-attachments/assets/c26b76bf-4775-44dc-be98-54458a4c14ca)

![Screenshot 2025-03-18 at 23 17 08](https://github.com/user-attachments/assets/037bfef5-1629-4615-8530-8619ea146a28)

![Screenshot 2025-03-18 at 23 18 55](https://github.com/user-attachments/assets/0c8d459e-6bbc-4485-abfe-f1997441d740)

![Screenshot 2025-03-18 at 23 21 25](https://github.com/user-attachments/assets/b0113c92-3aaf-48cf-b383-c26738b81778)

## Sadržaj

- [Funkcionalnosti](#funkcionalnosti)
- [Tehnologije](#tehnologije)
- [Pokretanje aplikacije](#pokretanje-aplikacije)
  - [Preduvjeti](#preduvjeti)
  - [Instalacija](#instalacija)
  - [Konfiguracija](#konfiguracija)
  - [Pokretanje](#pokretanje)
- [API endpoints](#api-endpoints)
- [Autentikacija](#autentikacija)
- [XML validacija](#xml-validacija)
- [SOAP servisi](#soap-servisi)
- [XML-RPC integracija](#xml-rpc-integracija)

## Funkcionalnosti

- **Upravljanje XML podacima o studentima**
  - Učitavanje XML datoteka s podacima
  - Validacija prema XSD i RNG shemama
  - Detaljni prikaz grešaka validacije
  - Generiranje validnog XML-a iz podataka
- **Pretraživanje studenata**
  - Pretraga po prosjeku ocjena (GPA)
  - Filtriranje pomoću XPath izraza
  - Predefinirani primjeri XPath upita
- **SOAP web servisi**
  - Pretraga studenata preko SOAP protokola
  - XPath filtriranje preko SOAP-a
  - Validacija XML-a preko SOAP-a
- **XML-RPC integracija**
  - Dohvat podataka o vremenu za gradove
  - Pretraga gradova po imenu
- **Autentikacija**
  - JWT autentikacija
  - Obnavljanje tokena
  - Zaštićeni pristup funkcionalnostima

## Tehnologije

### Backend

- **Java 17** - Programski jezik
- **Spring Boot 3.4.0** - Backend framework
- **Spring Web** - Web funkcionalnosti
- **Spring Security** - Autentikacija i autorizacija
- **Spring Data JPA** - Sloj za pristup bazi podataka
- **Hibernate** - ORM za mapiranje objekata u bazu
- **MySQL** - Relacijska baza podataka
- **JAXB** - Biblioteka za rad s XML-om
- **Apache XML-RPC** - Biblioteka za XML-RPC komunikaciju
- **Spring WS** - Implementacija SOAP web servisa
- **Jing** - Validacija prema RELAX NG shemi
- **Lombok** - Smanjenje boilerplate koda

### Frontend

- **React** - JavaScript biblioteka za izgradnju korisničkih sučelja
- **Axios** - HTTP klijent za API pozive
- **React Router** - Upravljanje rutama u React aplikaciji
- **React Query** - Upravljanje stanjem i dohvat podataka
- **Bootstrap** - CSS framework za responzivan dizajn

## Pokretanje aplikacije

### Preduvjeti

- **Java 17** ili novija
- **Maven** za build backend aplikacije
- **Node.js** i **npm** za frontend
- **MySQL** baza podataka

### Instalacija

1. Klonirajte repozitorij:

   ```bash
   git clone https://github.com/your-username/iis-project.git
   cd iis-project
   ```

2. Postavite MySQL bazu podataka:

   ```sql
   CREATE DATABASE Test1;
   ```

3. Instalirajte i pokrenite backend:

   ```bash
   cd iisProject
   mvn clean install
   mvn spring-boot:run
   ```

4. Instalirajte i pokrenite XML-RPC servis:

   ```bash
   cd ../iisProjectDhmzFinal
   mvn clean install
   mvn spring-boot:run
   ```

5. Instalirajte i pokrenite frontend:
   ```bash
   cd ../IIS_REACT_APP
   npm install
   npm run dev
   ```

### Konfiguracija

#### Backend (.properties)

Kreirajte `application.properties` datoteku u `src/main/resources` direktoriju:

```properties
# Baza podataka
spring.datasource.url=jdbc:mysql://localhost:3306/Test1
spring.datasource.username=root
spring.datasource.password=YourPassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Server postavke
server.port=8087

# JPA postavke
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.generate-ddl=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT postavke
jwt.secret=YourSecretKey
jwt.expiration=86400000
```

#### XML-RPC server (.properties)

Kreirajte `application.properties` datoteku u `src/main/resources` direktoriju XML-RPC servera:

```properties
# Server postavke
server.port=8085
```

### Pokretanje

1. Pokrenite backend aplikaciju:

   ```bash
   cd iisProject
   mvn spring-boot:run
   ```

2. Pokrenite XML-RPC servis:

   ```bash
   cd iisProjectDhmzFinal
   mvn spring-boot:run
   ```

3. Pokrenite frontend aplikaciju:
   ```bash
   cd IIS_REACT_APP
   npm run dev
   ```

Backend će biti dostupan na `http://localhost:8087`
XML-RPC servis će biti dostupan na `http://localhost:8085`
Frontend će biti dostupan na `http://localhost:5173`

## API endpoints

### Autentikacija

- `POST /rest/login` - Prijava korisnika
- `POST /rest/refreshToken` - Obnova JWT tokena

### XML i studentski podaci

- `POST /api/xml/validateAndSave` - Validacija i spremanje XML-a
- `GET /api/xml/students` - Dohvat svih studenata
- `GET /api/xml/students/{id}` - Dohvat studenta prema ID-u
- `GET /api/xml/students/gpa/{gpa}` - Dohvat studenata prema prosjeku ocjena
- `POST /api/xml/students/xpath` - Filtriranje studenata prema XPath izrazu

### Podaci o vremenu (XML-RPC)

- `GET /api/weather/temperature` - Dohvat temperature za grad
- `GET /api/weather/cities` - Dohvat gradova prema upitu

## Autentikacija

Aplikacija koristi JWT (JSON Web Token) za autentikaciju korisnika. Implementacija koristi Spring Security s JWT mehanizmom.

### Tijek autentikacije

1. Korisnik se prijavljuje s korisničkim imenom i lozinkom
2. Server provjerava vjerodajnice i generira JWT token
3. Token se šalje klijentu
4. Klijent šalje token u Authorization zaglavlju za svaki zahtjev
5. Server validira token i odobrava pristup zaštićenim resursima

## XML validacija

Aplikacija podržava validaciju XML dokumenata prema XSD i RNG shemama.

### Validacija pomoću XSD

1. Korisnik učitava XML datoteku
2. Aplikacija validira XML prema XSD shemi
3. Ako je XML validan, podaci se spremaju
4. Ako XML nije validan, prikazuju se detalji grešaka

### Validacija pomoću RNG

1. Korisnik učitava XML datoteku
2. Aplikacija validira XML prema RNG shemi
3. Ako je XML validan, podaci se spremaju
4. Ako XML nije validan, prikazuju se detalji grešaka

## SOAP servisi

Aplikacija pruža SOAP web servise za rad s podacima o studentima.

### Dostupni SOAP servisi

- `searchByGpa` - Pretraga studenata prema prosjeku ocjena
- `filterByXPath` - Filtriranje podataka pomoću XPath izraza

### Pristup SOAP servisima

WSDL dokument dostupan je na: `http://localhost:8087/ws/students.wsdl`

## XML-RPC integracija

Aplikacija koristi XML-RPC za integraciju s podacima o vremenu.

### Dohvat podataka o vremenu

1. Korisnik pretražuje gradove
2. Frontend šalje zahtjev backend aplikaciji
3. Backend komunicira s XML-RPC servisom
4. XML-RPC servis dohvaća podatke s DHMZ-a
5. Podaci se vraćaju korisniku

### XML-RPC server

XML-RPC server je implementiran kao zasebna Spring Boot aplikacija koja:

1. Dohvaća XML podatke o vremenu s DHMZ-a
2. Parsira XML dokument
3. Pruža metode za dohvat temperature i pretraživanje gradova
4. Komunicira s glavnom aplikacijom putem XML-RPC protokola

### Funkcionalnosti XML-RPC servisa

- `getTemperature` - Dohvat temperature za specifičan grad
- `getMatchingCities` - Pretraga gradova po imenu
