# FiendAFriend API

This API allows NGOs to register their pets for adoption. It has mainly a learning purpose and is part of Rocketseat Learning Program in NodeJS.

> This application has an interface mock for inspirations in [Figma](https://www.figma.com/community/file/1220006040435238030)

## Project Requirements

This API has two main stakeholders:

-   **NGOs**: Organizations that takes care of pets and register them for adoption.
-   **Users**: Users are interested in adopting pets according to their capabilities of adopting.

The API must fulfill those requirements:

As a NGO, ...

[x] 1. I want to register a pet for adoption
[x] 1.1 A PET must have:

    - name
    - birthdate
    - size (1- small, 2- medium, 3- big)
    - energy level (1-5)
    - independence level (1-5)
    - space for living (1- small, 2- medium, 3- big)

    [x] 1.2 A pet must have a valid responsible NGO.
    [x] 1.3 A pet must have a set of adoption requirements or preferences.
    [x] 1.4 Only NGO can register a PET for adoption.

[x] 2. I want to remove a pet adoption

    [x] 2.1 Only NGO can remove a pet.
    [x] 2.2 A pet can only be removed by the NGO that registered it.

[x] 3. I want to update a pet's information

    [x] 3.1 Only NGO can update a pet.
    [x] 3.2 A pet can only be updated by the NGO that registered it.

[x] 4. I want to mark a pet as adopted

    [x] 4.1 Only NGO can mark a pet as adopted.
    [x] 4.2 A pet can only be adopted if it is not already adopted.
    [x] 4.3 A pet can only be marked as adopted by the NGO that registered it.

[x] 5. I want to register as a NGO

    [x] 5.1 A NGO must have:
    - name
    - email
    - password
    - address
    - zipcode
    - city
    - state
    - phone

    [x] 5.2 Only one NGO can be registered with the same email.

[x] 6 I want to be recognized as a NGO when I login

As a USER, ...

[x] 7. I want to find a pet for adoption

[x] 7.1 Pet's search must be done by city level
[x] 7.2 Filters might be applied by pet's characteristics
[x] 7.2.1 I want to filter by Age Category (baby < 1, young < 3, adult < 8, senior > 8)
[x] 7.2.2 I want to filter by Energy Level (1- low, 2- medium, 3- high)
[x] 7.2.3 I want to filter by Independence Level (1- low, 2- medium, 3- high)
[x] 7.2.4 I want to filter by Size (1- small, 2- medium, 3- big)
[x] 7.2.5 I want to filter by Space for Living (1- small, 2- medium, 3- big)
[x] 7.3 I want to filter available pets according to their characteristics

NFR:

-   A user must not be logged in to search for adoptions.
    [x] - A NGO must be authenticated in order to perform admin's actions.

# Data Model

-   For simplicity, the data model will consist of only two entities (although some may argue that this class could be broken into two: Pet and Adoption, while the last one would track the whole adoption process. But this app doesn't inteed to manage this):

    -   NGO
    -   Pet

> The data model is defined in the [schema.prisma](./prisma/schema.prisma) file.

**NGO**

| field       | type   | description                   |
| ----------- | ------ | ----------------------------- |
| id          | String | Unique identifier for the NGO |
| name        | String | Name of the NGO               |
| email       | String | Email of the NGO              |
| passwd_hash | String | Hashed password of the NGO    |
| address     | String | Address of the NGO            |
| zipcode     | String | Zipcode of the NGO            |
| city        | String | City of the NGO               |
| state       | String | State of the NGO              |
| phone       | String | Whatsapp number of the NGO    |
| latitude    | Float  | Latitude of the NGO           |
| longitude   | Float  | Longitude of the NGO          |

**Pet**

| field              | type        | description                             |
| ------------------ | ----------- | --------------------------------------- |
| id                 | String      | Unique identifier for the Pet           |
| name               | String      | Name of the Pet                         |
| birthdate          | Date        | Birthdate of the Pet                    |
| size               | Int         | Size of the Pet                         |
| energy_level       | Int         | Energy level of the Pet                 |
| independence_level | Int         | Independence level of the Pet           |
| space_for_living   | Int         | Space for living of the Pet             |
| ngo_id             | String (FK) | ID of the NGO that registered the Pet   |
| adopted_at         | DateTime?   | Date and time when the Pet was adopted  |
| requirements       | String[]    | Requirements or preferences for the Pet |

---
